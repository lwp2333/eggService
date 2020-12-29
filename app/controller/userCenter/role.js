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
    } else {
      const res = await ctx.model.Role.create(ctx.request.body)
      ctx.helper.SuccessRes(res)
    }
  }
  async update() {
    const { ctx, app } = this
    const errorInfo = app.validator.validate(updateOrDelRule, ctx.request.body)
    if (errorInfo) {
      ctx.helper.ErrorValid(errorInfo)
    } else {
      const { _id } = ctx.request.body
      const res = await ctx.model.Role.updateOne({ _id }, ctx.request.body)
      ctx.helper.UpdateRes(res)
    }
  }
  async show() {
    const { ctx } = this
    const res = await ctx.model.Role.findOne({ _id: ctx.request.query._id })
    ctx.helper.SuccessRes(res)
  }
  async destroy() {
    const { ctx, app } = this
    const errorInfo = app.validator.validate(updateOrDelRule, ctx.request.query)
    if (errorInfo) {
      ctx.helper.ErrorValid(errorInfo)
    } else {
      const res = await ctx.model.Role.deleteOne({ _id: ctx.request.query._id })
      ctx.helper.DelRes(res)
    }
  }
}

module.exports = RoleController
