'use strict'

module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const RoleSchema = new Schema(
    {
      roleName: { type: String, default: '' },
      roleLevel: { type: String, default: '' },
      description: { type: String, default: '' },
      bindMenu: { type: Array, default: [] }
    },
    { versionKey: false }
  )

  return mongoose.model('Role', RoleSchema, 'Role')
}
