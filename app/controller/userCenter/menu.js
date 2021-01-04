'use strict'
/** 校验规则 */
const createRule = {
  title: 'string',
  path: 'string',
  isLeaf: 'string',
  iconType: 'string',
  parentId: 'string'
}
const updateOrDelRule = {
  _id: 'string'
}
const dragDropRule = {
  drapNodeId: 'string',
  dropNodeId: 'string',
  positionType: ['top', 'inside', 'bottom']
}
const Controller = require('egg').Controller

class MenuController extends Controller {
  async index() {
    const { ctx } = this
    const res = await ctx.model.Menu.find()
    const data = ctx.helper.listToTree(res)
    ctx.helper.SuccessRes(data)
  }
  async create() {
    const { ctx, app } = this
    const errorInfo = app.validator.validate(createRule, ctx.request.body)
    if (errorInfo) {
      ctx.helper.ErrorValid(errorInfo)
      return
    }
    const res = await ctx.model.Menu.create(ctx.request.body)
    ctx.helper.SuccessRes(res)
  }
  async update() {
    const { ctx, app } = this
    const errorInfo = app.validator.validate(updateOrDelRule, ctx.request.body)
    if (errorInfo) {
      ctx.helper.ErrorValid(errorInfo)
      return
    }
    const { _id } = ctx.request.body
    const res = await ctx.model.Menu.updateOne({ _id }, ctx.request.body)
    ctx.helper.UpdateRes(res)
  }
  async show() {
    const { ctx, app } = this
    const errorInfo = app.validator.validate(updateOrDelRule, ctx.request.query)
    if (errorInfo) {
      ctx.helper.ErrorValid(errorInfo)
      return
    }
    const res = await ctx.model.Menu.findOne({ _id: ctx.request.query._id })
    ctx.helper.SuccessRes(res)
  }
  async destroy() {
    const { ctx, app } = this
    const errorInfo = app.validator.validate(updateOrDelRule, ctx.request.query)
    if (errorInfo) {
      ctx.helper.ErrorValid(errorInfo)
      return
    }
    const res = await ctx.model.Menu.deleteOne({ _id: ctx.request.query._id })
    ctx.helper.DelRes(res)
  }
  async dragDrop() {
    const { ctx, app } = this
    const errorInfo = app.validator.validate(dragDropRule, ctx.request.body)
    if (errorInfo) {
      ctx.helper.ErrorValid(errorInfo)
      return
    }
    const { drapNodeId, dropNodeId, positionType } = ctx.request.body
    const dragNode = await ctx.model.Menu.findOne({ _id: drapNodeId })
    const dropNode = await ctx.model.Menu.findOne({ _id: dropNodeId })
    // 分位置进行逻辑处理
    // 判断是否为同级菜单
    const { title: dragNodeTitle, order: dragNodeOrder, parentId: dragNodeParentId } = dragNode
    const { title: dropNodeTitle, order: dropNodeOrder, parentId: dropNodeParentId } = dropNode
    if (dragNodeParentId !== dropNodeParentId) {
      // 不是同级菜单， 父节点改为目标node的父节点
      console.log(dragNodeTitle, dropNodeTitle, '不是同级菜单')
      try {
        await ctx.model.Menu.findOneAndUpdate({ _id: drapNodeId }, { parentId: dropNodeParentId })
      } catch (error) {
        console.log(error)
      }
    }
    if (positionType === 'top') {
      console.log(dragNodeTitle, '移到', dropNodeTitle, '上面')
      if (dragNodeOrder === dropNodeOrder - 1) {
        console.log('无效拖拽, 本来就在上面')
      } else {
        // 1. 更新拖拽节点order 为比目标节点order 小一点得数
        await ctx.model.Menu.findOneAndUpdate({ _id: drapNodeId }, { order: dropNodeOrder - 0.1 })
        // 2. 查询所有数据根据order排序，重新赋值整数order
        const sortList = await ctx.model.Menu.find().sort({ order: 1 })
        let sortKey = 1
        for (const item of sortList) {
          // 重新给每个order 赋值新的整数
          const { _id } = item
          await ctx.model.Menu.findOneAndUpdate({ _id }, { order: sortKey })
          sortKey++
        }
      }
    } else if (positionType === 'bottom') {
      console.log(dragNodeTitle, '移到', dropNodeTitle, '下面')
      // 判断是否为无效拖拽，是否位置不变
      if (dragNodeOrder === dropNodeOrder + 1) {
        console.log('无效拖拽，本来就在下面')
      } else {
        // 1. 更新拖拽节点order 为比目标节点order 小一点得数
        await ctx.model.Menu.findOneAndUpdate({ _id: drapNodeId }, { order: dropNodeOrder + 0.1 })
        // 2. 查询所有数据根据order排序，重新赋值整数order
        const sortList = await ctx.model.Menu.find().sort({ order: 1 })
        let sortKey = 1
        for (const item of sortList) {
          // 重新给每个order 赋值新的整数
          const { _id } = item
          await ctx.model.Menu.findOneAndUpdate({ _id }, { order: sortKey })
          sortKey++
        }
      }
    } else {
      console.log(dragNodeTitle, '移到', dropNodeTitle, '里面')
      // 判断是否无效拖拽，是否父级菜单不变
      if (dragNodeParentId === dropNodeId) {
        console.log('无效拖拽，父级菜单不变')
      } else {
        await ctx.model.Menu.findOneAndUpdate({ _id: drapNodeId }, { parentId: dropNodeId })
      }
    }

    ctx.helper.UpdateRes(null, '菜单配置')
  }
  async dragDrop2() {
    const { ctx, app } = this
    const errorInfo = app.validator.validate(dragDropRule, ctx.request.body)
    if (errorInfo) {
      ctx.helper.ErrorValid(errorInfo)
      return
    }
    const { drapNodeId, dropNodeId, positionType } = ctx.request.body
    // 进行数据取回
    const dragNode = await ctx.model.Menu.findOne({ _id: drapNodeId })
    const dropNode = await ctx.model.Menu.findOne({ _id: dropNodeId })
    if (!dragNode || !dropNode) {
      // 相关节点不存在
      ctx.helper.ErrorRes(null, '相关节点不存在，菜单配置修改')
      return
    }
    const { title: dragNodeTitle, order: dragNodeOrder, parentId: dragNodeParentId } = dragNode
    const { title: dropNodeTitle, order: dropNodeOrder, parentId: dropNodeParentId } = dropNode
    // 不是同级菜单，且不是拖到到内部，拖拽node的父节点改为目标node的父节点
    if (dragNodeParentId !== dropNodeParentId && positionType !== 'inside') {
      console.log(dragNodeTitle, dropNodeTitle, '不是同级菜单，不是拖拽到内部')
      await ctx.model.Menu.findOneAndUpdate({ _id: drapNodeId }, { parentId: dropNodeParentId })
    }
    // 分位置进行逻辑处理
    if (positionType === 'top') {
      console.log(dragNodeTitle, '移到', dropNodeTitle, '上面')
      if (dragNodeOrder > dropNodeOrder) {
        // 从下往上拖拽, 更改影响区间
        await ctx.model.Menu.updateMany({ order: { $gte: dropNodeOrder, $lt: dragNodeOrder } }, { $inc: { order: 1 } })
        // 拖拽node的order改为目标node的order（注意操作滞后）
        await ctx.model.Menu.findOneAndUpdate({ _id: drapNodeId }, { order: dropNodeOrder })
      } else {
        // 从上往下拖拽, 更改影响区间
        await ctx.model.Menu.updateMany({ order: { $gt: dragNodeOrder, $lte: dropNodeOrder } }, { $inc: { order: -1 } })
        // 拖拽node的order改为目标node的order（注意操作滞后）
        await ctx.model.Menu.findOneAndUpdate({ _id: drapNodeId }, { order: dropNodeOrder - 1 })
      }
    } else if (positionType === 'inside') {
      console.log(dragNodeTitle, '移到', dropNodeTitle, '里面')
      // 1. 放置在最后
      const maxOrderNode = await ctx.model.Menu.find().sort({ order: -1 }).limit(1)
      console.log(maxOrderNode)
      const { order: maxOrder } = maxOrderNode[0]
      // 2. 拖拽node 的父节点改为目标node 的节点id
      await ctx.model.Menu.findOneAndUpdate({ _id: drapNodeId }, { parentId: dropNodeId, order: maxOrder + 1 })
    } else {
      console.log(dragNodeTitle, '移到', dropNodeTitle, '下面')
      if (dragNodeOrder > dropNodeOrder) {
        // 从下往上拖拽, 更改影响区间
        await ctx.model.Menu.updateMany({ order: { $gt: dropNodeOrder, $lt: dragNodeOrder } })
        // 拖拽node的order改为目标node的order+1（注意操作滞后）
        await ctx.model.Menu.findOneAndUpdate({ _id: drapNodeId }, { order: dropNodeOrder + 1 })
      } else {
        // 从上往下拖拽, 更改影响区间
        await ctx.model.Menu.updateMany({ order: { $gt: dragNodeOrder, $lte: dropNodeOrder } })
        // 拖拽node的order改为目标node的order（注意操作滞后）
        await ctx.model.Menu.findOneAndUpdate({ _id: drapNodeId }, { order: dropNodeOrder })
      }
    }
  }
}

module.exports = MenuController
