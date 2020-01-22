'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */

const Schema = use('Schema')

class UserAvatarSchema extends Schema {
  up () {
    this.alter('users', (table) => {
      // alter table
      table
        .integer('file_id')
        .unsigned()
        .references('id')
        .inTable('files')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
    })
  }

  down () {
    this.table('users', (table) => {
      // reverse alternations
    })
  }
}

module.exports = UserAvatarSchema
