import { createUnitRepository } from '../repositories/unit.repository.js'
import { createUnitBody, unitParams, unitResponse } from '../schemas/unit.schema.js'

async function unitsRoutes(app) {
  const repo = createUnitRepository(app.pg, app.config.DATABASE_SCHEMA)

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
}

export default unitsRoutes
