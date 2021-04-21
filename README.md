# eggSerive



### 提示：

`config/config.local` 、`config/config.prod`  为开发环境和线上环境的 oss 、数据库地址配置

结构如下：

```js

'use strict'

module.exports = {
  // mongodb库
  mongoose: {
    client: {
      url: 'mongodb://xxxxxxxxxxxx@xx.xxx.xxx.xx:27017/xxxx',
      options: {
        useUnifiedTopology: true,
        useNewUrlParser: true
      }
    }
  },

  // oss 配置
  oss: {
    client: {
      accessKeyId: 'xxxxxxxxxxxxxx',
      accessKeySecret: 'xxxxxxxxxxxxxxxxxxx',
      bucket: 'xxxxxx',
      endpoint: 'oss-cn-beijing.aliyuncs.com',
      timeout: '60s'
    }
  },
  io: {
    namespace: {
      '/': {
        connectionMiddleware: ['auth'],
        packetMiddleware: [] // 针对消息的处理暂时不实现
      }
    },

    // cluster 模式下，通过 redis 实现数据共享
    redis: {
      host: 'xx.xxx.xxx.xx',
      port: 6379,
      password: 'xxxxxxxxxx',
      db: 0
    }
  },
  redis: {
    client: {
      host: 'xx.xxx.xxx.xx',
      port: 6379,
      password: 'xxxxxxxxxx',
      db: 0
    }
  }
}

```



#### 本地开发

```
// 安装依赖
cnpm i
// 启动开发服务
npm run dev
// 服务运行在 htttp://localhost:7000/
```

#### 部署

```
// 启动服务
npm start
// 停用服务
npm stop
```



#### 框架插件

- egg-oss
- egg-cors
- egg-mongoose
- egg-redis
- egg-socket.io
- egg-validate
- jsonwebtoken
- svg-captcha

#### 已实现功能

- [x] mongodb 数据库的CURD
- [x] 用户jwt登录，接口权限中间件
- [x] oss文件存储
- [x] redis 使用
- [x] socket双向通信（配合redis）
- [x] 验证码接口 （配合redis）

#### 后续实现功能

- [ ] 单点登录，异地登陆强制下线（socket配合redis）