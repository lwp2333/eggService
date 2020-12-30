'use strict'
/** 校验规则 */
const createRule = {
  roleName: 'string',
  roleLevel: 'string',
  description: 'string',
  bindMenu: 'array'
}
const updateOrDelRule = {
  _id: 'string'
}

const Controller = require('egg').Controller

class RoleController extends Controller {
  async index() {
    const { ctx } = this
    const res = await ctx.model.Role.find()
    ctx.helper.SuccessRes(res)
  }
  async create() {
    const { ctx, app } = this
    const errorInfo = app.validator.validate(createRule, ctx.request.body)
    if (errorInfo) {
      ctx.helper.ErrorValid(errorInfo)
      return
    }
    const res = await ctx.model.Role.create(ctx.request.body)
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
    const res = await ctx.model.Role.updateOne({ _id }, ctx.request.body)
    ctx.helper.UpdateRes(res)
  }
  async show() {
    const { ctx, app } = this
    const errorInfo = app.validator.validate(updateOrDelRule, ctx.request.query)
    if (errorInfo) {
      ctx.helper.ErrorValid(errorInfo)
      return
    }
    const res = await ctx.model.Role.findOne({ _id: ctx.request.query._id })
    const { _id, bindMenu, roleName, roleLevel, description } = res
    const menuList = []
    if (bindMenu) {
      // 根据bindMenu 里面的id 列表查询授权菜单列表，生成树
      for (const item of bindMenu) {
        console.log(item)
        const menu = await ctx.model.Menu.findOne({ _id: item })
        menuList.push(menu)
      }
    }
    //  生成 菜单树
    const menuTree = ctx.helper.listToTree(menuList)
    const data = {
      _id,
      roleName,
      roleLevel,
      description,
      bindMenu,
      menuTree
    }
    ctx.helper.SuccessRes(data)
  }
  async destroy() {
    const { ctx, app } = this
    const errorInfo = app.validator.validate(updateOrDelRule, ctx.request.query)
    if (errorInfo) {
      ctx.helper.ErrorValid(errorInfo)
      return
    }
    const res = await ctx.model.Role.deleteOne({ _id: ctx.request.query._id })
    ctx.helper.DelRes(res)
  }
}

module.exports = RoleController
