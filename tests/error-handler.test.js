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

describe('Error Handler Plugin', () => {
  let app

  beforeEach(() => {
    mockQuery.mockReset()
    app = buildApp({ logger: false }, { DATABASE_URL: 'postgres://localhost/test' })
  })

  afterEach(async () => {
    await app.close()
  })

  it('sanitizes 500 message — does not expose internal DB error text', async () => {
    await app.ready()
    mockQuery.mockRejectedValueOnce(new Error('relation "units" does not exist'))

    const res = await app.inject({
      method: 'GET',
      url: `/units/${VALID_UUID}`,
    })

    expect(res.statusCode).toBe(500)
    const body = JSON.parse(res.payload)
    expect(body.message).toBe('Internal Server Error')
    expect(body.message).not.toContain('relation')
  })

  it('returns correct shape for 500 errors', async () => {
    await app.ready()
    mockQuery.mockRejectedValueOnce(new Error('unexpected failure'))

    const res = await app.inject({
      method: 'GET',
      url: `/units/${VALID_UUID}`,
    })

    expect(res.statusCode).toBe(500)
    const body = JSON.parse(res.payload)
    expect(body).toMatchObject({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'Internal Server Error',
    })
  })

  it('passes through Fastify validation errors (400) without mangling them', async () => {
    await app.ready()

    const res = await app.inject({
      method: 'GET',
      url: '/units/not-a-valid-uuid',
    })

    expect(res.statusCode).toBe(400)
  })
})
