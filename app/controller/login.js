'use strict'

const loginRule = {
  userName: 'string',
  passWord: 'string'
}
const jwt = require('jsonwebtoken')
const Controller = require('egg').Controller

class LoginController extends Controller {
  async index() {
    const { ctx, app } = this
    const { userName, passWord } = ctx.request.body
    console.log({ userName, passWord })
    const errorInfo = app.validator.validate(loginRule, ctx.request.body)
    if (errorInfo) {
      ctx.helper.ErrorRes(errorInfo, '登录')
    }
    const data = {
      userName,
      passWord
    }
    const secret = 'lwp2333'
    const token = jwt.sign(data, secret, { expiresIn: '1d' })
    console.log(token)
    ctx.cookies.set('jwtoken', token, {
      httpOnly: false,
      signed: false,
      encrypt: false,
      maxAge: 1000 * 60 * 60 * 24
    })
    // ctx.cookies.set('userName', userName, {
    //   httpOnly: false, // 是否只允许http可读
    //   signed: false, // 签名处理
    //   encrypt: true, // 不做加密
    //   maxAge: 1000 * 60 * 60 * 24
    // })
    // ctx.cookies.set('passWord', passWord, {
    //   httpOnly: false, // 是否只允许http可读
    //   signed: false, // 签名处理
    //   encrypt: true, // 不做加密
    //   maxAge: 1000 * 60 * 60 * 24
    // })
    ctx.helper.SuccessRes(null, '登录')
  }
}

module.exports = LoginController
