'use strict'

const Controller = require('egg').Controller
const svgCaptcha = require('svg-captcha')
class SvgCodeController extends Controller {
  async index() {
    const { ctx, app } = this
    const option = {
      size: 4,
      width: 120,
      height: 40,
      ignoreChars: '0o1iIl',
      noise: 3,
      color: true,
      background: '#fdfdfd',
      fontSize: 48
    }
    const codeSvg = svgCaptcha.create(option)
    const { data, text } = codeSvg
    const res = {
      svg: data,
      text
    }
    ctx.helper.SuccessRes(res)
  }
}

module.exports = SvgCodeController
