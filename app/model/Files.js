'use strict'

const Dayjs = require('dayjs')
module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const FileSchema = new Schema(
    {
      fileName: { type: String, default: '' },
      ossUrl: { type: String, default: '' },
      hash: { type: String, default: '' },
      ossFileName: { type: String, default: '' },
      fileSize: { type: String, default: '' },
      fileType: { type: String, default: '' },
      createTime: { type: String, default: Dayjs().format('YYYY-MM-DD HH:mm:ss') },
      updateTime: { type: String, default: Dayjs().format('YYYY-MM-DD HH:mm:ss') }
    },
    { versionKey: false }
  )

  return mongoose.model('Files', FileSchema, 'Files')
}
