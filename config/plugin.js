'use strict'

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  static: {
    enable: true
  },
  mongoose: {
    enable: true,
    package: 'egg-mongoose'
  },
  validate: {
    enable: true,
    package: 'egg-validate'
  },
  cors: {
    enable: true,
    package: 'egg-cors'
  },
  oss: {
    enable: true,
    package: 'egg-oss'
  },
  io: {
    enable: true,
    package: 'egg-socket.io'
  },
  redis: {
    enable: true,
    package: 'egg-redis'
  }
}
