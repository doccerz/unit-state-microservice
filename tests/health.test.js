import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'

var mockQuery
vi.mock('@fastify/postgres', async () => {
  const fp = (await import('fastify-plugin')).default
  mockQuery = vi.fn()
  return {
    default: fp(async (app) => {
      app.decorate('pg', { query: mockQuery })
    }),
  }
})

import { buildApp } from '../src/app.js'

describe('GET /health', () => {
  let app

  beforeEach(async () => {
    mockQuery.mockReset()
    app = buildApp({ logger: false }, { DATABASE_URL: 'postgres://localhost/test' })
    await app.ready()
  })

  afterEach(async () => {
    await app.close()
  })

  it('returns 200 { status: "ok" } when DB responds', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ '?column?': 1 }] })

    const res = await app.inject({ method: 'GET', url: '/health' })

    expect(res.statusCode).toBe(200)
    expect(JSON.parse(res.body)).toEqual({ status: 'ok' })
  })

  it('returns 503 { status: "error" } when DB is down', async () => {
    mockQuery.mockRejectedValueOnce(new Error('DB down'))

    const res = await app.inject({ method: 'GET', url: '/health' })

    expect(res.statusCode).toBe(503)
    expect(JSON.parse(res.body)).toEqual({ status: 'error' })
  })
})
