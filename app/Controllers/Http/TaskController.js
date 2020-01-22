'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Task = use('App/Models/Task')
const moment = require('moment')

/**
 * Resourceful controller for interacting with tasks
 */
class TaskController {
  /**
   * Show a list of all tasks.
   * GET tasks
   */
  async index ({ params, request }) {
    const { date } = request.get()

    if (date) {
      switch (date) {
        case 'today': {
          const tasks = await Task.query()
            .where('project_id', params.projects_id)
            .where('start_date', moment())
            .with('user')
            .with('status')
            .fetch()
          return tasks
        }
        default:
      }
    }

    const tasks = await Task.query()
      .where('project_id', params.projects_id)
      .with('user')
      .with('status')
      .fetch()

    return tasks
  }

  /**
   * Create/save a new task.
   * POST tasks
   */
  async store ({ params, request }) {
    const data = request.only([
      'user_id',
      'title',
      'description',
      'start_date',
      'due_date',
      'file_id',
      'status_id'
    ])

    const task = await Task.create({ ...data, project_id: params.projects_id })

    return task
  }

  /**
   * Display a single task.
   * GET tasks/:id
   */
  async show ({ params }) {
    const task = await Task.findOrFail(params.id)

    return task
  }

  /**
   * Update task details.
   * PUT or PATCH tasks/:id
   */
  async update ({ params, request }) {
    const task = await Task.findOrFail(params.id)
    const data = request.only([
      'user_id',
      'title',
      'description',
      'due_date',
      'file_id',
      'status_id'
    ])

    task.merge(data)

    await task.save()

    return task
  }

  /**
   * Delete a task with id.
   * DELETE tasks/:id
   */
  async destroy ({ params }) {
    const task = await Task.findOrFail(params.id)

    await task.delete()
  }
}

module.exports = TaskController
