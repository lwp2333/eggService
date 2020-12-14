'use strict'
const jwt = require('jsonwebtoken')
module.exports = () => {
  return async function auth(ctx, next) {
    console.log('#----进入auth中间件----#')
    const { jwtSecret } = ctx.app.config.jwtConfig
    const { accesstoken, refreshtoken } = ctx.request.header
    let accesstokenRes = null
    let refreshtokenRes = null

    // 先验证refreshtoken 失效直接返回前端 status 403，拉起重新登录
    try {
      refreshtokenRes = jwt.verify(refreshtoken, jwtSecret)
    } catch (error) {
      ctx.helper.ErrorAuthValid()
      return
    }
    // 再验证accessToken 失效返回前端 code 403， 拉起自动刷新token
    try {
      accesstokenRes = jwt.verify(accesstoken, jwtSecret)
    } catch (error) {
      ctx.helper.WarnAuthvalid() // 告诉前端需要
      return
    }
    console.log(accesstokenRes, refreshtokenRes)
    await next()
    console.log('#----退出auth中间件---#')
  }
}
