'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Status = use('App/Models/Status')

/**
 * Resourceful controller for interacting with statuses
 */
class StatusController {
  /**
   * Show a list of all statuses.
   * GET statuses
   */
  async index ({ request, response, view }) {
    const status = await Status.all()

    return status
  }

  /**
   * Create/save a new status.
   * POST statuses
   */
  async store ({ request }) {
    const data = request.only([
      'name',
      'color',
      'icon'
    ])

    const status = await Status.create(data)

    return status
  }

  /**
   * Display a single status.
   * GET statuses/:id
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Update status details.
   * PUT or PATCH statuses/:id
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a status with id.
   * DELETE statuses/:id
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = StatusController
