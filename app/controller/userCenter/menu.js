'use strict'
/** 校验规则 */
const createRule = {
  title: 'string',
  path: 'string',
  isLeaf: 'boolean',
  iconType: 'string',
  parentId: 'string?'
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
    const res = await ctx.model.Menu.find().sort({ order: 1 })
    const data = ctx.helper.listToTree(res)
    ctx.helper.SuccessRes(data)
  }
  async showFolder() {
    const { ctx } = this
    const res = await ctx.model.Menu.find({ isLeaf: false }).sort({ order: 1 })
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
    const maxOrderList = await ctx.model.Menu.find().sort({ order: -1 }).limit(1)
    // 默认最大的order为0
    let maxOrder = 0
    if (maxOrderList.length > 0) {
      const { order } = maxOrderList[0]
      maxOrder = order
    }
    const res = await ctx.model.Menu.create({ ...ctx.request.body, order: maxOrder + 1 })
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
    ctx.helper.UpdateRes(res, '菜单')
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
  async queryAllChild(_id) {
    const { ctx } = this
    const allIds = [_id]
    const childNode = await ctx.model.Menu.find({ parentId: _id })
    if (childNode && childNode.length > 0) {
      for (const item of childNode) {
        // 递归
        allIds.push(...(await this.queryAllChild(item._id)))
      }
    }
    return allIds
  }
  async destroy() {
    const { ctx, app } = this
    const errorInfo = app.validator.validate(updateOrDelRule, ctx.request.body)
    if (errorInfo) {
      ctx.helper.ErrorValid(errorInfo)
      return
    }
    const { _id } = ctx.request.body
    const allIdList = await this.queryAllChild(_id)
    // 循环删除
    for (const _id of allIdList) {
      await ctx.model.Menu.deleteOne({ _id })
    }
    const data = {
      deletedCount: allIdList.length
    }
    ctx.helper.DelRes(data, '菜单')
  }
  async dragDrop() {
    const { ctx, app } = this
    const errorInfo = app.validator.validate(dragDropRule, ctx.request.body)
    if (errorInfo) {
      ctx.helper.ErrorValid(errorInfo)
      return
    }
    // 数据节点取回
    const { drapNodeId, dropNodeId, positionType } = ctx.request.body
    const dragNode = await ctx.model.Menu.findOne({ _id: drapNodeId })
    const dropNode = await ctx.model.Menu.findOne({ _id: dropNodeId })
    // 相关节点不存在
    if (!dragNode || !dropNode) {
      ctx.helper.ErrorRes(null, '相关节点不存在，菜单配置修改')
      return
    }
    const { parentId: dragNodeParentId } = dragNode
    const { order: dropNodeOrder, parentId: dropNodeParentId } = dropNode

    // 不是同级菜单，且不是拖到到内部，拖拽node的父节点改为目标node的父节点
    if (dragNodeParentId !== dropNodeParentId && positionType !== 'inside') {
      await ctx.model.Menu.findOneAndUpdate({ _id: drapNodeId }, { parentId: dropNodeParentId })
    }
    // 分位置进行逻辑处理
    if (positionType === 'top' || positionType === 'bottom') {
      const num = positionType === 'top' ? -0.1 : 0.1
      // 1. 更新拖拽节点order 为比目标节点order 小一点或者大一点的数字
      await ctx.model.Menu.findOneAndUpdate({ _id: drapNodeId }, { order: dropNodeOrder + num })
      // 2. 查询所有数据根据order排序，重新赋值整数order
      const sortList = await ctx.model.Menu.find().sort({ order: 1 })
      let sortKey = 1
      for (const item of sortList) {
        // 重新给每个order 赋值新的整数
        const { _id } = item
        await ctx.model.Menu.findOneAndUpdate({ _id }, { order: sortKey })
        sortKey++
      }
    } else {
      // 判断是否无效拖拽，是否父级菜单不变
      if (dragNodeParentId === dropNodeId) {
        ctx.helper.ErrorRes(null, '无效拖拽')
        return
      }
      // 1. 目标节点改为菜单
      await ctx.model.Menu.findOneAndUpdate({ _id: dropNodeId }, { isLeaf: false })
      // 2. 拖拽node 的父节点改为目标node 的节点id
      await ctx.model.Menu.findOneAndUpdate({ _id: drapNodeId }, { parentId: dropNodeId })
    }
    const res = {
      nModified: 1
    }
    ctx.helper.UpdateRes(res, '菜单拖拽')
  }
}

module.exports = MenuController
