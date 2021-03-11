/* eslint valid-jsdoc: "off" */

'use strict'

const path = require('path')
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {})

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1605688556461_3336'

  // add your middleware config here
  config.middleware = ['logger', 'auth']
  config.logger = {
    enable: false
  }
  config.auth = {
    enable: true,
    ignore: ctx => {
      const ignoreApiList = ['/', '/login', '/autoLogin', '/register', '/svgCode'] // 忽略auth中间件的请求地址列表
      return ignoreApiList.includes(ctx.path)
    }
  }
  config.multipart = {
    mode: 'stream',
    fileModeMatch: /^\/uploadFile/,
    fieldNameSize: '1mb',
    fileSize: '100mb',
    whitelist: [
      // images
      '.jpg',
      '.jpeg', // image/jpeg
      '.png', // image/png, image/x-png
      '.gif', // image/gif
      '.bmp', // image/bmp
      '.wbmp', // image/vnd.wap.wbmp
      '.webp',
      '.tif',
      '.psd',
      // text
      '.svg',
      '.js',
      '.jsx',
      '.json',
      '.css',
      '.less',
      '.html',
      '.htm',
      '.xml',
      '.txt',
      // tar
      '.zip',
      '.gz',
      '.tgz',
      '.gzip',
      // video
      '.mp3',
      '.mp4',
      '.avi',
      '.MOV',
      // doc
      '.doc',
      '.docx',
      '.xls',
      '.xlsx',
      '.ppt',
      '.pptx',
      '.pdf'
    ]
  }

  // static
  config.static = {
    prefix: '/static',
    dir: path.join(appInfo.baseDir, 'app/public') // 静态化目录,可以设置多个静态化目录
    // dynamic: false, // 如果当前访问的静态资源没有缓存，则缓存静态文件，和`preload`配合使用
    // preload: true,
    // maxAge: 31536000, // in prod env, 0 in other envs
    // buffer: true // in prod env, false in other envs
  }

  config.security = {
    csrf: {
      enable: false
    },
    domainWhiteList: ['*']
  }
  config.cors = {
    origin: '*',
    allowMethods: ['GET', 'HEAD', 'OPTION', 'PUT', 'POST', 'DELETE', 'PATCH']
  }
  config.cluster = {
    listen: {
      path: '',
      port: 7000,
      hostname: '0.0.0.0'
    }
  }
  // add your user config here
  const userConfig = {
    appName: 'eggoss', // 项目名称
    jwtConfig: {
      jwtSecret: 'lwp2333',
      accessTokenExpiresIn: 60 * 6 * 4, // 数字单位s
      refreshTokenExpiresIn: 60 * 60 * 12
    }
  }

  return {
    ...config,
    ...userConfig
  }
}
