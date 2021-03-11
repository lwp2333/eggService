'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, io } = app
  router.get('/', controller.home.index)

  // login
  router.post('/login', controller.login.index)
  router.post('/autoLogin', controller.login.autoLogin)

  // register
  router.post('/register', controller.register.index)

  // Oss
  router.post('/uploadFile', controller.common.oss.uploadFile)
  router.post('/uploadStream', controller.common.oss.uploadStream)
  router.get('/downloadFile', controller.common.oss.downloadFile)

  // User
  router.get('/getUserList', controller.userCenter.user.index)
  router.get('/getUserListByPage', controller.userCenter.user.indexByPage)
  router.post('/createUser', controller.userCenter.user.create)
  router.del('/delUser', controller.userCenter.user.destroy)
  router.put('/updateUser', controller.userCenter.user.update)
  router.get('/getUserDetail', controller.userCenter.user.show)

  // 用户权限中心 --角色配置
  router.get('/getRoleList', controller.userCenter.role.index)
  router.get('/getRoleListByPage', controller.userCenter.role.indexByPage)
  router.post('/createRole', controller.userCenter.role.create)
  router.del('/delRole', controller.userCenter.role.destroy)
  router.put('/updateRole', controller.userCenter.role.update)
  router.get('/getRoleDetail', controller.userCenter.role.show)
  router.get('/getRoleMenuTree', controller.userCenter.role.showMenuTree)

  // 用户权限中心 --菜单配置
  router.get('/getMenuList', controller.userCenter.menu.index)
  router.post('/createMenu', controller.userCenter.menu.create)
  router.del('/delMenu', controller.userCenter.menu.destroy)
  router.put('/updateMenu', controller.userCenter.menu.update)
  router.get('/getMenu', controller.userCenter.menu.show)
  router.post('/dragDropMenu', controller.userCenter.menu.dragDrop)
  router.get('/getMenuFolder', controller.userCenter.menu.showFolder)

  // socket.io
  io.of('/').route('exchange', io.controller.nsp.exchange)

  // 验证码
  router.get('/svgCode', controller.common.svgCode.index)
}
