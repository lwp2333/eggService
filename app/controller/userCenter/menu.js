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
}

module.exports = MenuController
