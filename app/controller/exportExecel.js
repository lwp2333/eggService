'use strict'
const nodeExcel = require('excel-export')
const Service = require('egg').Controller
const path = require('path')
class exportExecelController extends Service {
  async index() {
    const { ctx } = this
    const conf = {}
    conf.stylesXmlFile = path.join('app/public/template', 'style.xml')
    conf.name = 'mysheet'
    conf.cols = [
      {
        caption: 'string',
        type: 'string'
      },
      {
        caption: 'date',
        type: 'date'
      },
      {
        caption: 'bool',
        type: 'bool'
      },
      {
        caption: 'number',
        type: 'number'
      }
    ]
    conf.rows = [
      ['pi', new Date(Date.UTC(2013, 4, 1)), true, 3.14],
      ['e', new Date(2012, 4, 1), false, 2.7182],
      ["M&M<>'", new Date(Date.UTC(2013, 6, 9)), false, 1.61803],
      ['null date', null, true, 1.414]
    ]
    ctx.set('Content-Type', 'application/octet-stream')
    ctx.attachment('123.xlsx')
    const result = nodeExcel.execute(conf)
    const res = new Buffer(result, 'binary')
    ctx.body = res
  }
}
module.exports = exportExecelController
