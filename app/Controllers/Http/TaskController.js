'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Task = use('App/Models/Task')

const { startOfWeek, endOfWeek, startOfMonth, endOfMonth } = require('date-fns')

/**
 * Resourceful controller for interacting with tasks
 */
class TaskController {
  /**
   * Show a list of all tasks.
   * GET tasks
   */
  async index ({ params, request }) {
    const { page, date, search } = request.get()

    const query = Task.query()
    query.orderBy('id')

    if (search) {
      query.where('title', 'LIKE', `%${search}%`)
    } else {
      query.where('project_id', params.projects_id)
    }

    switch (date) {
      case 'today': {
        query.where('start_date', new Date())
        break
      }
      case 'week': {
        query.whereBetween('start_date', [startOfWeek(new Date()), endOfWeek(new Date())])
        break
      }
      case 'month': {
        query.whereBetween('start_date', [startOfMonth(new Date()), endOfMonth(new Date())])
        break
      }
      default:
    }

    query.with('user')
    query.with('status')
    query.with('file')
    query.with('project')
    query.forPage(page, 20)

    const tasks = await query.fetch()

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
