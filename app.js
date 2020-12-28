'use strict'

// app.js
class AppBootHook {
  constructor(app) {
    this.app = app
  }

  configWillLoad() {
    // 此时 config 文件已经被读取并合并，但是还并未生效
    // 这是应用层修改配置的最后时机
    // 注意：此函数只支持同步调用
    console.log('配置读取合并完毕')
  }

  async didLoad() {
    // 所有的配置已经加载完毕
    // 可以用来加载应用自定义的文件，启动自定义的服务
    console.log('配置加载生效完毕')
  }

  async willReady() {
    // 所有的插件都已启动完毕，但是应用整体还未 ready
    // 可以做一些数据初始化等操作，这些操作成功才会启动应用
    // 例如：从数据库加载数据到内存缓存
    console.log('程序即将启动')
  }

  async didReady() {
    // 应用已经启动完毕
    console.log('程序启动完毕')
  }

  async serverDidReady() {
    console.log('程序启动完毕，开始接收外部请求')
  }
}

module.exports = AppBootHook
