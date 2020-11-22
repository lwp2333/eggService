/* eslint valid-jsdoc: "off" */

'use strict'

module.exports = {
  // 测试mongodb库
  mongoose: {
    client: {
      url: '',
      options: {
        useUnifiedTopology: true,
        useNewUrlParser: true
      }
    }
  },

  // 本地环境oss 配置
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
