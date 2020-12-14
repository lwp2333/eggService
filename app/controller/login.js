'use strict'

const loginRule = {
  userName: 'string',
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
    const { userName, password } = ctx.request.body
    const errorInfo = app.validator.validate(loginRule, ctx.request.body)
    if (errorInfo) {
      ctx.helper.ErrorRes(errorInfo, '登录')
      return
    }
    const data = {
      userName,
      password
    }
    const { jwtSecret, accessTokenExpiresIn, refreshTokenExpiresIn } = app.config.jwtConfig
    const accessToken = jwt.sign(data, jwtSecret, { expiresIn: accessTokenExpiresIn })
    const refreshToken = jwt.sign(data, jwtSecret, { expiresIn: refreshTokenExpiresIn })
    const res = {
      userName,
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
      const { userName, password } = jwtRes
      const data = { userName, password }
      const accessTokenNew = jwt.sign(data, jwtSecret, { expiresIn: accessTokenExpiresIn })
      const refreshTokenNew = jwt.sign(data, jwtSecret, { expiresIn: refreshTokenExpiresIn })
      const res = {
        userName,
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
