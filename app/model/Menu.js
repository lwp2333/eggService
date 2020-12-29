'use strict'

module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const MenuSchema = new Schema(
    {
      title: { type: String, default: '' },
      path: { type: String, default: '' },
      isLeaf: { type: Boolean, default: false },
      iconType: { type: String, default: '' },
      slots: {
        type: Object,
        default: () => {
          return {
            icon: 'icon'
          }
        }
      },
      parentId: { type: String, default: null }
    },
    { versionKey: false }
  )

  return mongoose.model('Menu', MenuSchema, 'Menu')
}
