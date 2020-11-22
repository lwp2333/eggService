'use strict'

const Controller = require('egg').Controller

class HomeController extends Controller {
  async index() {
    const { ctx, app } = this
    ctx.body = 'hi, 枯木逢春' + app.config.env
  }
}

module.exports = HomeController
