'use strict'

const registerRule = {
  name: 'string',
  email: 'string',
  password: 'string'
}
const Controller = require('egg').Controller

class RegisterController extends Controller {
  async index() {
    const { ctx, app } = this
    const errorInfo = app.validator.validate(registerRule, ctx.request.body)
    if (errorInfo) {
      ctx.helper.ErrorValid(errorInfo, '注册')
      return
    }
    await ctx.model.User.create(ctx.request.body)
    ctx.helper.SuccessRes(null, '注册')
  }
}

module.exports = RegisterController
