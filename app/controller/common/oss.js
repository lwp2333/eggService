'use strict'

const Controller = require('egg').Controller
const fs = require('fs')
const path = require('path')

const uploadRule = {
  files: { required: true, type: 'array', min: 1 }
}

class OssController extends Controller {
  async uploadFile() {
    const { ctx, app } = this
    const errorInfo = app.validator.validate(uploadRule, ctx.request)
    if (errorInfo) {
      ctx.helper.ErrorValid(errorInfo, '上传文件')
      return
    }

    const file = ctx.request.files[0]
    const hash = ctx.helper.getFileHash(file.filepath)
    const ossFileName = hash + path.extname(file.filename)
    const fileInfo = fs.statSync(file.filepath)
    const fileSize = (fileInfo.size / 1024 / 1024).toFixed(2) + 'mb' // 转为 mb单位

    /**
     * 判断文件是否已经存在，存在则直接返回数据库中的记录
     */
    const isHas = await ctx.service.oss.fileService.findFile({ ossFileName })
    if (isHas) {
      ctx.helper.SuccessRes(isHas, '已有文件')
      return
    }

    let result = null
    try {
      result = await ctx.oss.put(ossFileName, file.filepath)
    } catch (err) {
      ctx.helper.ErrorRes(err, '上传文件')
    } finally {
      fs.unlink(file.filepath, () => {})
    }

    if (result) {
      const currentEnv = app.config.env === 'prod'
      let ossUrl = result.url
      if (currentEnv) {
        // oss-cn-beijing-internal.aliyuncs.com 换成 oss-cn-beijing.aliyuncs.com
        ossUrl = ossUrl.replace('-internal', '')
      }
      const data = {
        fileName: file.filename,
        ossUrl,
        hash,
        ossFileName,
        fileSize,
        fileType: file.mime
      }
      const res = await ctx.service.oss.fileService.create(data)
      ctx.helper.SuccessRes(res, '上传文件')
    }
  }

  async uploadStream() {
    const { ctx, app } = this
    const stream = await ctx.getFileStream()
    const buffers = await ctx.helper.streamToBuffer(stream)
    const hash = ctx.helper.getStreamHash(buffers)
    const ossFileName = hash + path.extname(stream.filename)
    const fileSize = (buffers.length / 1024 / 1024).toFixed(2) + 'mb'

    /**
     * 判断文件是否已经存在，存在则直接返回数据库中的记录
     */
    const isHas = await ctx.service.oss.fileService.findFile({ ossFileName })
    if (isHas) {
      ctx.helper.SuccessRes(isHas, '已有文件')
      return
    }

    let result = null
    try {
      const toOssStream = ctx.helper.bufferToStream(buffers)
      result = await ctx.oss.putStream(ossFileName, toOssStream)
    } catch (err) {
      ctx.helper.ErrorRes(err, '上传文件')
    }

    if (result) {
      const currentEnv = app.config.env === 'prod'
      let ossUrl = result.url
      if (currentEnv) {
        // oss-cn-beijing-internal.aliyuncs.com 换成 oss-cn-beijing.aliyuncs.com
        ossUrl = ossUrl.replace('-internal', '')
      }
      const data = {
        fileName: stream.filename,
        ossUrl,
        hash,
        ossFileName,
        fileSize,
        fileType: stream.mime
      }
      const res = await ctx.service.oss.fileService.create(data)
      ctx.helper.SuccessRes(res, '上传文件')
    }
  }

  async downloadFile() {
    const { ctx } = this
    const { query } = ctx.request
    const { _id, fileName, hash, ossFileName } = query
    if (!_id && !fileName && !hash && !ossFileName) {
      ctx.helper.ErrorValid(null, '文件下载')
      return
    }
    const fileInfo = await ctx.service.oss.fileService.findFile(query)
    /**
     * 表里没有相关记录
     */
    if (!fileInfo) {
      ctx.helper.ErrorRes(null, '文件找不到')
      return
    }

    /**
     * 表里有相关记录 则取ossFileName 进行流下载
     */

    /**
     * 1.读到内存二进制下载
     */
    // try {
    //   const result = await ctx.oss.get(fileInfo.ossFileName)
    //   ctx.attachment(fileName)
    //   ctx.set('Content-Type', 'application/octet-stream')
    //   ctx.body = result.content
    // } catch (err) {
    //   ctx.helper.ErrorRes(err, 'oss 读取文件错误')
    // }

    /**
     * 2.直接赋值文件流下载
     */
    try {
      ctx.attachment(fileInfo.fileName)
      ctx.set('Content-Type', 'application/octet-stream')
      const result = await ctx.oss.getStream(fileInfo.ossFileName)
      ctx.body = result.stream
    } catch (err) {
      ctx.helper.ErrorRes(err, 'oss 读取文件错误')
    }
  }
}

module.exports = OssController
