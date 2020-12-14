'use strict'

const crypto = require('crypto')
const fs = require('fs')
const Duplex = require('stream').Duplex

module.exports = {
  /**
   *
   * @param {*} params 参数
   * @param {*} validList  有效参数
   */
  filterSearchParams(params, validList) {
    const data = {}
    validList.forEach(item => {
      params[item] && (data[item] = params[item])
    })
    return data
  },
  /**
   *
   * @param {*} filePath 文件路径/数据流
   */
  getFileHash(filePath) {
    // 读取一个Buffer
    const buffer = fs.readFileSync(filePath)
    const fsHash = crypto.createHash('md5')
    fsHash.update(buffer)
    const md5 = fsHash.digest('hex')
    return md5
  },
  /**
   *
   * @param {*} stream 文件流
   */
  streamToBuffer(stream) {
    return new Promise((resolve, reject) => {
      const buffers = []
      stream.on('error', reject)
      stream.on('data', data => buffers.push(data))
      stream.on('end', () => resolve(Buffer.concat(buffers)))
    })
  },
  /**
   *
   * @param {*} buffer 字节
   */
  bufferToStream(buffer) {
    const stream = new Duplex()
    stream.push(buffer)
    stream.push(null) // 关闭
    return stream
  },
  /**
   *
   * @param {*} buffer 字节
   */
  getStreamHash(buffer) {
    const fsHash = crypto.createHash('md5')
    fsHash.update(buffer)
    const md5 = fsHash.digest('hex')
    return md5
  },

  /**
   *
   * @param {*} data 数据
   * @param {*} msg 信息
   */
  SuccessRes(data = null, msg = '') {
    this.ctx.body = {
      code: 200,
      data,
      message: `${msg}请求成功！`
    }
  },
  UpdateRes(data = null, msg = '') {
    if (data && data.nModified >= 1) {
      this.ctx.body = {
        code: 201,
        data,
        message: `${msg}修改成功！ `
      }
    } else {
      this.ctx.body = {
        code: 202,
        data,
        message: `${msg} 修改失败，未做修改或该条记录不存在！`
      }
    }
  },
  DelRes(data = null, msg = '') {
    if (data && data.deletedCount >= 1) {
      this.ctx.body = {
        code: 203,
        data,
        message: `${msg}删除成功！`
      }
    } else {
      this.ctx.body = {
        code: 204,
        data,
        message: `${msg}删除失败，该条记录不存在！`
      }
    }
  },
  ErrorRes(data = null, msg = '') {
    this.ctx.body = {
      code: 301,
      data,
      message: `${msg} 请求失败！`
    }
  },
  ErrorValid(data = null, msg = '') {
    this.ctx.body = {
      code: 302,
      data,
      message: `${msg}字段缺失，请求失败！`
    }
  },
  WarnAuthvalid() {
    this.ctx.body = {
      code: 403,
      data: null,
      message: '正在刷新token登录'
    }
  },
  ErrorAuthValid() {
    this.ctx.status = 403 // 登录失效
  }
}
