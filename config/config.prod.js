/* eslint valid-jsdoc: "off" */

'use strict'

module.exports = {
  mongoose: {
    client: {
      url: '',
      options: {
        useUnifiedTopology: true,
        useNewUrlParser: true
      }
    }
  },

  // 线上环境oss 配置
  oss: {
    client: {
      accessKeyId: '',
      accessKeySecret: '',
      bucket: '',
      endpoint: '',
      timeout: '60s'
    }
  }
}
