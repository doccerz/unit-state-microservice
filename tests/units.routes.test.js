import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { buildApp } from '../src/app.js'

var mockQuery

vi.mock('@fastify/postgres', async () => {
  const fp = (await import('fastify-plugin')).default
  mockQuery = vi.fn()
  return {
    default: fp(async function (app) {
      app.decorate('pg', { query: mockQuery })
    }),
  }
})

const VALID_UUID = '123e4567-e89b-12d3-a456-426614174000'

describe('Unit Routes', () => {
  let app

  beforeEach(() => {
    mockQuery.mockReset()
    app = buildApp({ logger: false }, { DATABASE_URL: 'postgres://localhost/test' })
  })

  afterEach(async () => {
    await app.close()
  })

  describe('GET /units', () => {
    it('returns 200 with array of units when status=true', async () => {
      await app.ready()
      const units = [
        { id: VALID_UUID, status: true, metadata: null },
      ]
      mockQuery.mockResolvedValueOnce({ rows: units })

      const res = await app.inject({ method: 'GET', url: '/units?status=true' })

      expect(res.statusCode).toBe(200)
      expect(JSON.parse(res.payload)).toEqual(units)
    })

    it('returns 200 with empty array when no units match', async () => {
      await app.ready()
      mockQuery.mockResolvedValueOnce({ rows: [] })

      const res = await app.inject({ method: 'GET', url: '/units?status=true' })

      expect(res.statusCode).toBe(200)
      expect(JSON.parse(res.payload)).toEqual([])
    })

    it('returns 400 when status query param is missing', async () => {
      await app.ready()
      const res = await app.inject({ method: 'GET', url: '/units' })

      expect(res.statusCode).toBe(400)
    })
  })

  describe('POST /units', () => {
    it('returns 201 with a single unit when body is an object', async () => {
      await app.ready()
      const unit = { id: VALID_UUID, status: false, metadata: null }
      mockQuery.mockResolvedValueOnce({ rows: [unit] })

      const res = await app.inject({
        method: 'POST',
        url: '/units',
        payload: { id: VALID_UUID },
      })

      expect(res.statusCode).toBe(201)
      expect(JSON.parse(res.payload)).toEqual(unit)
    })

    it('returns 201 with an array when body is an array', async () => {
      await app.ready()
      const units = [{ id: VALID_UUID, status: false, metadata: null }]
      mockQuery.mockResolvedValueOnce({ rows: units })

      const res = await app.inject({
        method: 'POST',
        url: '/units',
        payload: [{ id: VALID_UUID }],
      })

      expect(res.statusCode).toBe(201)
      expect(JSON.parse(res.payload)).toEqual(units)
    })

    it('returns 400 when body is an empty array', async () => {
      await app.ready()
      const res = await app.inject({
        method: 'POST',
        url: '/units',
        payload: [],
      })

      expect(res.statusCode).toBe(400)
    })

    it('returns 400 when id is not a valid UUID', async () => {
      await app.ready()
      const res = await app.inject({
        method: 'POST',
        url: '/units',
        payload: { id: 'not-a-uuid' },
      })

      expect(res.statusCode).toBe(400)
    })
  })

  describe('GET /units/:id', () => {
    it('returns 200 with the unit when found', async () => {
      await app.ready()
      const unit = { id: VALID_UUID, status: false, metadata: null }
      mockQuery.mockResolvedValueOnce({ rows: [unit] })

      const res = await app.inject({ method: 'GET', url: `/units/${VALID_UUID}` })

      expect(res.statusCode).toBe(200)
      expect(JSON.parse(res.payload)).toEqual(unit)
    })

    it('returns 404 when unit not found', async () => {
      await app.ready()
      mockQuery.mockResolvedValueOnce({ rows: [] })

      const res = await app.inject({ method: 'GET', url: `/units/${VALID_UUID}` })

      expect(res.statusCode).toBe(404)
    })

    it('returns 400 for non-UUID id param', async () => {
      await app.ready()
      const res = await app.inject({ method: 'GET', url: '/units/not-a-uuid' })

      expect(res.statusCode).toBe(400)
    })
  })

  describe('DELETE /units/:id', () => {
    it('returns 200 with the deleted unit when found', async () => {
      await app.ready()
      const unit = { id: VALID_UUID, status: false, metadata: null }
      mockQuery.mockResolvedValueOnce({ rows: [unit] })

      const res = await app.inject({ method: 'DELETE', url: `/units/${VALID_UUID}` })

      expect(res.statusCode).toBe(200)
      expect(JSON.parse(res.payload)).toMatchObject({ id: VALID_UUID })
    })

    it('returns 404 when unit not found', async () => {
      await app.ready()
      mockQuery.mockResolvedValueOnce({ rows: [] })

      const res = await app.inject({ method: 'DELETE', url: `/units/${VALID_UUID}` })

      expect(res.statusCode).toBe(404)
    })

    it('returns 400 for non-UUID id param', async () => {
      await app.ready()
      const res = await app.inject({ method: 'DELETE', url: '/units/not-a-uuid' })

      expect(res.statusCode).toBe(400)
    })
  })

  describe('PATCH /units/:id', () => {
    it('returns 200 with updated unit when status changes', async () => {
      await app.ready()
      const unit = { id: VALID_UUID, status: true, metadata: null }
      mockQuery.mockResolvedValueOnce({ rows: [unit], rowCount: 1 })

      const res = await app.inject({
        method: 'PATCH',
        url: `/units/${VALID_UUID}`,
        payload: { status: true },
      })

      expect(res.statusCode).toBe(200)
      expect(JSON.parse(res.payload)).toEqual(unit)
    })

    it('returns 409 when unit is already in target state', async () => {
      await app.ready()
      const unit = { id: VALID_UUID, status: false, metadata: null }
      mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 0 })
      mockQuery.mockResolvedValueOnce({ rows: [unit] })

      const res = await app.inject({
        method: 'PATCH',
        url: `/units/${VALID_UUID}`,
        payload: { status: false },
      })

      expect(res.statusCode).toBe(409)
    })

    it('returns 404 when unit does not exist', async () => {
      await app.ready()
      mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 0 })
      mockQuery.mockResolvedValueOnce({ rows: [] })

      const res = await app.inject({
        method: 'PATCH',
        url: `/units/${VALID_UUID}`,
        payload: { status: true },
      })

      expect(res.statusCode).toBe(404)
    })

    it('returns 200 when only metadata is updated', async () => {
      await app.ready()
      const unit = { id: VALID_UUID, status: false, metadata: { key: 'value' } }
      mockQuery.mockResolvedValueOnce({ rows: [unit] })

      const res = await app.inject({
        method: 'PATCH',
        url: `/units/${VALID_UUID}`,
        payload: { metadata: { key: 'value' } },
      })

      expect(res.statusCode).toBe(200)
      expect(JSON.parse(res.payload)).toEqual(unit)
    })

    it('returns 404 when metadata-only update targets missing unit', async () => {
      await app.ready()
      mockQuery.mockResolvedValueOnce({ rows: [] })

      const res = await app.inject({
        method: 'PATCH',
        url: `/units/${VALID_UUID}`,
        payload: { metadata: { key: 'value' } },
      })

      expect(res.statusCode).toBe(404)
    })

    it('returns 400 for empty body', async () => {
      await app.ready()
      const res = await app.inject({
        method: 'PATCH',
        url: `/units/${VALID_UUID}`,
        payload: {},
      })

      expect(res.statusCode).toBe(400)
    })

    it('returns 400 for non-UUID id param', async () => {
      await app.ready()
      const res = await app.inject({
        method: 'PATCH',
        url: '/units/not-a-uuid',
        payload: { status: true },
      })

      expect(res.statusCode).toBe(400)
    })
  })

  describe('POST /units/:id/toggle', () => {
    it('returns 200 with toggled unit', async () => {
      await app.ready()
      const unit = { id: VALID_UUID, status: true, metadata: null }
      mockQuery.mockResolvedValueOnce({ rows: [unit] })

      const res = await app.inject({ method: 'POST', url: `/units/${VALID_UUID}/toggle` })

      expect(res.statusCode).toBe(200)
      expect(JSON.parse(res.payload)).toEqual(unit)
    })

    it('returns 404 when unit not found', async () => {
      await app.ready()
      mockQuery.mockResolvedValueOnce({ rows: [] })

      const res = await app.inject({ method: 'POST', url: `/units/${VALID_UUID}/toggle` })

      expect(res.statusCode).toBe(404)
    })

    it('returns 400 for non-UUID id param', async () => {
      await app.ready()
      const res = await app.inject({ method: 'POST', url: '/units/not-a-uuid/toggle' })

      expect(res.statusCode).toBe(400)
    })
  })
})
