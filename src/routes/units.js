import { createUnitRepository } from '../repositories/unit.repository.js'
import { createUnitBody, listUnitsQuery, patchUnitBody, unitParams, unitResponse } from '../schemas/unit.schema.js'

async function unitsRoutes(app) {
  const repo = createUnitRepository(app.pg, app.config.DATABASE_SCHEMA)

  app.get('/units', {
    schema: {
      querystring: listUnitsQuery,
      response: { 200: { type: 'array', items: unitResponse } },
      tags: ['units'],
    },
  }, async (req) => {
    return repo.findByStatus(req.query.status)
  })

  app.post('/units', {
    schema: {
      body: createUnitBody,
      response: {
        201: { oneOf: [unitResponse, { type: 'array', items: unitResponse }] },
      },
      tags: ['units'],
    },
  }, async (req, reply) => {
    const isBatch = Array.isArray(req.body)
    const rows = await repo.create(isBatch ? req.body : [req.body])
    reply.code(201).send(isBatch ? rows : rows[0])
  })

  app.get('/units/:id', {
    schema: {
      params: unitParams,
      response: { 200: unitResponse },
      tags: ['units'],
    },
  }, async (req, reply) => {
    const unit = await repo.findById(req.params.id)
    if (!unit) return reply.code(404).send({ message: 'Unit not found' })
    return unit
  })

  app.delete('/units/:id', {
    schema: {
      params: unitParams,
      tags: ['units'],
    },
  }, async (req, reply) => {
    const deleted = await repo.deleteById(req.params.id)
    if (!deleted) return reply.code(404).send({ message: 'Unit not found' })
    return deleted
  })

  app.patch('/units/:id', {
    schema: {
      params: unitParams,
      body: patchUnitBody,
      response: { 200: unitResponse },
      tags: ['units'],
    },
  }, async (req, reply) => {
    const { id } = req.params
    const { status, metadata } = req.body

    if (status === undefined) {
      const unit = await repo.patchMetadata(id, metadata)
      if (!unit) return reply.code(404).send({ message: 'Unit not found' })
      return unit
    }

    const { row, rowCount } = await repo.atomicUpdate(id, status, metadata ?? null)
    if (rowCount === 0) {
      const exists = await repo.findById(id)
      if (!exists) return reply.code(404).send({ message: 'Unit not found' })
      return reply.code(409).send({ message: 'Unit already in target state' })
    }
    return row
  })

  app.post('/units/:id/toggle', {
    schema: {
      params: unitParams,
      response: { 200: unitResponse },
      tags: ['units'],
    },
  }, async (req, reply) => {
    const unit = await repo.toggle(req.params.id)
    if (!unit) return reply.code(404).send({ message: 'Unit not found' })
    return unit
  })
}

export default unitsRoutes
