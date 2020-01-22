'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */

const Model = use('Model')

class Task extends Model {
  static boot () {
    super.boot()

    this.addHook('afterCreate', 'TaskHook.sendNewTaskEmail')
    this.addHook('beforeUpdate', 'TaskHook.sendNewTaskEmail')
  }

  static get hidden () {
    return ['created_at', 'updated_at', 'user_id', 'file_id', 'status_id', 'project_id']
  }

  static get dates () {
    return super.dates.concat(['start_date', 'due_date'])
  }

  static castDates (field, value) {
    return value.format('YYYY-MM-DD')
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

  status () {
    return this.belongsTo('App/Models/Status')
  }
}

module.exports = Task
