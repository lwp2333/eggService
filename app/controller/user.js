'use strict'
/** 校验规则 */
const createRule = {
  avatar: 'string',
  name: 'string',
  description: 'string',
  age: 'string',
  sex: ['男', '女'],
  tags: 'array'
}
const updateOrDelRule = {
  _id: 'string'
}
const byPageRule = {
  pageNum: 'string',
  pageSize: 'string'
}
const Controller = require('egg').Controller

class UserController extends Controller {
  async index() {
    const { ctx } = this
    const res = await ctx.model.User.find()
    ctx.helper.SuccessRes(res)
  }
  async indexByPage() {
    const { ctx, app } = this
    const errorInfo = app.validator.validate(byPageRule, ctx.request.query)
    if (errorInfo) {
      ctx.helper.ErrorValid(errorInfo)
      return
    }
    let { pageNum, pageSize, ...other } = ctx.request.query
    const searchParams = ctx.helper.filterSearchParams(other, ['name', 'age', 'sex'])
    pageNum = Number(pageNum)
    pageSize = Number(pageSize)
    const offset = (pageNum - 1) * pageSize
    const totalRecord = await ctx.model.User.find({ ...searchParams }).countDocuments()
    const totalPage = Math.ceil(totalRecord / pageSize)
    const list = await ctx.model.User.find({ ...searchParams })
      .skip(offset)
      .limit(pageSize)
    const data = {
      pageNum,
      pageSize,
      list,
      totalPage,
      totalRecord
    }
    ctx.helper.SuccessRes(data)
  }
  async create() {
    const { ctx, app } = this
    const errorInfo = app.validator.validate(createRule, ctx.request.body)
    if (errorInfo) {
      ctx.helper.ErrorValid(errorInfo)
      return
    }
    const res = await ctx.model.User.create(ctx.request.body)
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
    const res = await ctx.model.User.updateOne({ _id }, ctx.request.body)
    ctx.helper.UpdateRes(res)
  }
  async show() {
    const { ctx, app } = this
    const errorInfo = app.validator.validate(updateOrDelRule, ctx.request.query)
    if (errorInfo) {
      ctx.helper.ErrorValid(errorInfo)
      return
    }
    const res = await ctx.model.User.findOne({ _id: ctx.request.query._id })
    ctx.helper.SuccessRes(res)
  }
  async destroy() {
    const { ctx, app } = this
    const errorInfo = app.validator.validate(updateOrDelRule, ctx.request.query)
    if (errorInfo) {
      ctx.helper.ErrorValid(errorInfo)
      return
    }
    const res = await ctx.model.User.deleteOne({ _id: ctx.request.query._id })
    ctx.helper.DelRes(res)
  }
}

module.exports = UserController
