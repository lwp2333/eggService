'use strict'

module.exports = () => {
  return async function logger(ctx, next) {
    console.log(ctx.req.connection.remoteAddress)
    console.log(ctx.request.url)
    console.log(ctx.request.body)
    console.log(ctx.request.query)
    await next()
    console.log(ctx.response.body.code)
    console.log('over')
  }
}
