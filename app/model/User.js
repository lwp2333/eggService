'use strict'

module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const UserSchema = new Schema(
    {
      avatar: { type: String, default: '' },
      name: { type: String, default: '' },
      description: { type: String, default: '' },
      age: { type: String, default: '' },
      sex: { type: String, default: '' },
      tags: { type: Array, default: [] },
      email: { type: String, default: '' },
      password: { type: String, default: '' },
      roles: { type: Array, default: [] },
      status: { type: Number, default: 200 }
    },
    { versionKey: false }
  )

  return mongoose.model('User', UserSchema, 'User')
}
