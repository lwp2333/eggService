'use strict'

module.exports = () => {
  return async function logger(ctx, next) {
    console.log('#-----进入logger中间件----#')
    console.log(ctx.req.connection.remoteAddress)
    console.log(ctx.request.method)
    console.log(ctx.request.url)
    console.log(ctx.request.body)
    console.log(ctx.request.query)
    await next()
    console.log(ctx.response.body.code)
    console.log('#-----退出logger中间件----#')
  }
}
