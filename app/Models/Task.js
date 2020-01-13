'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */

const Model = use('Model')

class Task extends Model {
  static boot () {
    super.boot()

    this.addHook('afterCreate', 'TaskHook.sendNewTaskEmail')
    this.addHook('beforeUpdate', 'TaskHook.sendNewTaskEmail')
  }

  project () {
    return this.belongsTo('App/Models/Project')
  }

  user () {
    return this.belongsTo('App/Models/User')
  }

  file () {
    return this.belongsTo('App/Models/File')
  }
}

module.exports = Task
