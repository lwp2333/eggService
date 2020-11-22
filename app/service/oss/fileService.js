'use strict'

const Service = require('egg').Service
const createRule = {
  fileName: 'string',
  ossUrl: 'string',
  hash: 'string',
  ossFileName: 'string',
  fileSize: 'string',
  fileType: 'string'
}
const findRule = {
  _id: { type: 'string', max: 24, min: 24, required: false, allowEmpty: true },
  fileName: 'string?',
  hash: 'string?',
  ossFileName: 'string?'
}
class fileService extends Service {
  async create(data) {
    const { ctx, app } = this
    const errorInfo = app.validator.validate(createRule, data)
    if (errorInfo) {
      console.log(errorInfo)
      return
    }
    return await ctx.model.Files.create(data)
  }
  async findFile(data) {
    const { ctx, app } = this
    const errorInfo = app.validator.validate(findRule, data)
    if (errorInfo) {
      ctx.helper.ErrorValid(errorInfo, '文件下载')
      return null
    }
    return await ctx.model.Files.findOne(data)
  }
}
module.exports = fileService
