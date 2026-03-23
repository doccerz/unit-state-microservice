import { describe, it, expect, afterEach } from 'vitest'
import { buildApp } from '../src/app.js'
import {
  createUnitBody,
  patchUnitBody,
  unitParams,
  unitResponse,
} from '../src/schemas/unit.schema.js'

describe('unit schemas — structure', () => {
  it('createUnitBody uses oneOf with object and array variants', () => {
    expect(createUnitBody).toHaveProperty('oneOf')
    expect(createUnitBody.oneOf).toHaveLength(2)
    expect(createUnitBody.oneOf[0].type).toBe('object')
    expect(createUnitBody.oneOf[1].type).toBe('array')
  })

  it('createUnitBody object variant allows optional id (UUID) and metadata', () => {
    const obj = createUnitBody.oneOf[0]
    expect(obj.properties.id.format).toBe('uuid')
    expect(obj.properties.metadata).toBeDefined()
    expect(obj.required).toBeUndefined()
  })

  it('createUnitBody array variant has minItems 1 and correct item shape', () => {
    const arr = createUnitBody.oneOf[1]
    expect(arr.minItems).toBe(1)
    expect(arr.items.properties.id.format).toBe('uuid')
  })

  it('patchUnitBody uses anyOf requiring status or metadata', () => {
    expect(patchUnitBody).toHaveProperty('anyOf')
    const keys = patchUnitBody.anyOf.flatMap(s => s.required)
    expect(keys).toContain('status')
    expect(keys).toContain('metadata')
  })

  it('patchUnitBody has additionalProperties: false', () => {
    expect(patchUnitBody.additionalProperties).toBe(false)
  })

  it('unitParams requires id with UUID format', () => {
    expect(unitParams.required).toContain('id')
    expect(unitParams.properties.id.format).toBe('uuid')
  })

  it('unitResponse requires id and status', () => {
    expect(unitResponse.required).toContain('id')
    expect(unitResponse.required).toContain('status')
    expect(unitResponse.properties.id.format).toBe('uuid')
    expect(unitResponse.properties.status.type).toBe('boolean')
  })
})

describe('unit schemas — Fastify validation via inject', () => {
  let app

  afterEach(async () => {
    if (app) await app.close()
  })

  function buildTestApp() {
    app = buildApp({ logger: false }, { DATABASE_URL: 'postgres://localhost/test' })

    app.post('/test/create', { schema: { body: createUnitBody } }, async (req) => req.body)
    app.patch('/test/patch', { schema: { body: patchUnitBody } }, async (req) => req.body)
    app.get('/test/unit/:id', { schema: { params: unitParams } }, async (req) => req.params)

    return app
  }

  it('POST /test/create accepts empty object', async () => {
    buildTestApp()
    await app.ready()
    const res = await app.inject({ method: 'POST', url: '/test/create', payload: {} })
    expect(res.statusCode).toBe(200)
  })

  it('POST /test/create accepts valid UUID', async () => {
    buildTestApp()
    await app.ready()
    const res = await app.inject({
      method: 'POST',
      url: '/test/create',
      payload: { id: '123e4567-e89b-12d3-a456-426614174000' },
    })
    expect(res.statusCode).toBe(200)
  })

  it('POST /test/create accepts array of units', async () => {
    buildTestApp()
    await app.ready()
    const res = await app.inject({
      method: 'POST',
      url: '/test/create',
      payload: [{ id: '123e4567-e89b-12d3-a456-426614174000' }],
    })
    expect(res.statusCode).toBe(200)
  })

  it('POST /test/create strips additional properties (Fastify removeAdditional)', async () => {
    buildTestApp()
    await app.ready()
    const res = await app.inject({
      method: 'POST',
      url: '/test/create',
      payload: { unknown: 'field' },
    })
    // Fastify removes unknown props rather than rejecting (removeAdditional: true)
    expect(res.statusCode).toBe(200)
    expect(JSON.parse(res.payload)).not.toHaveProperty('unknown')
  })

  it('PATCH /test/patch accepts { status: true }', async () => {
    buildTestApp()
    await app.ready()
    const res = await app.inject({
      method: 'PATCH',
      url: '/test/patch',
      payload: { status: true },
    })
    expect(res.statusCode).toBe(200)
  })

  it('PATCH /test/patch rejects empty body', async () => {
    buildTestApp()
    await app.ready()
    const res = await app.inject({ method: 'PATCH', url: '/test/patch', payload: {} })
    expect(res.statusCode).toBe(400)
  })

  it('GET /test/unit/:id rejects non-UUID id', async () => {
    buildTestApp()
    await app.ready()
    const res = await app.inject({ method: 'GET', url: '/test/unit/not-a-uuid' })
    expect(res.statusCode).toBe(400)
  })

  it('GET /test/unit/:id accepts valid UUID', async () => {
    buildTestApp()
    await app.ready()
    const res = await app.inject({
      method: 'GET',
      url: '/test/unit/123e4567-e89b-12d3-a456-426614174000',
    })
    expect(res.statusCode).toBe(200)
  })
})
