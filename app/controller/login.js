'use strict'

const loginRule = {
  name: 'string',
  password: 'string'
}
const autoLoginRule = {
  refreshToken: 'string'
}
const jwt = require('jsonwebtoken')
const Controller = require('egg').Controller

class LoginController extends Controller {
  async index() {
    const { ctx, app } = this
    const { name, password } = ctx.request.body
    const errorInfo = app.validator.validate(loginRule, ctx.request.body)
    if (errorInfo) {
      ctx.helper.ErrorValid(errorInfo, '登录')
      return
    }
    const validUser = await ctx.model.User.findOne({ name })
    if (!validUser) {
      ctx.helper.ErrorRes(null, '用户不存在，登录')
      return
    }
    const { password: remotePass } = validUser
    if (remotePass !== password) {
      ctx.helper.ErrorRes(null, '密码错误，登录')
      return
    }
    const data = {
      name,
      password
    }
    const { jwtSecret, accessTokenExpiresIn, refreshTokenExpiresIn } = app.config.jwtConfig
    const accessToken = jwt.sign(data, jwtSecret, { expiresIn: accessTokenExpiresIn })
    const refreshToken = jwt.sign(data, jwtSecret, { expiresIn: refreshTokenExpiresIn })
    const res = {
      name,
      accessToken,
      refreshToken
    }
    ctx.helper.SuccessRes(res, '登录')
  }
  async autoLogin() {
    const { ctx, app } = this
    const { refreshToken } = ctx.request.body
    const errorInfo = app.validator.validate(autoLoginRule, ctx.request.body)
    if (errorInfo) {
      ctx.helper.ErrorRes(errorInfo, '自动登录')
      return
    }
    const { jwtSecret, accessTokenExpiresIn, refreshTokenExpiresIn } = app.config.jwtConfig
    let jwtRes = null
    try {
      jwtRes = jwt.verify(refreshToken, jwtSecret)
      const { name, password } = jwtRes
      const data = { name, password }
      const accessTokenNew = jwt.sign(data, jwtSecret, { expiresIn: accessTokenExpiresIn })
      const refreshTokenNew = jwt.sign(data, jwtSecret, { expiresIn: refreshTokenExpiresIn })
      const res = {
        name,
        accessToken: accessTokenNew,
        refreshToken: refreshTokenNew
      }
      ctx.helper.SuccessRes(res, '自动登录')
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = LoginController
