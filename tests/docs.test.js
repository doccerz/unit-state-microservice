import { describe, it, expect, afterEach } from 'vitest'
import { buildApp } from '../src/app.js'

describe('OpenAPI docs', () => {
  let app

  afterEach(async () => {
    await app.close()
  })

  it('GET /docs redirects or returns 200', async () => {
    app = buildApp({ logger: false }, { DATABASE_URL: 'postgres://localhost/test' })
    await app.ready()

    const res = await app.inject({ method: 'GET', url: '/docs' })
    expect([200, 301, 302]).toContain(res.statusCode)
  })

  it('GET /docs/json returns valid OpenAPI JSON with correct title', async () => {
    app = buildApp({ logger: false }, { DATABASE_URL: 'postgres://localhost/test' })
    await app.ready()

    const res = await app.inject({ method: 'GET', url: '/docs/json' })
    expect(res.statusCode).toBe(200)

    const body = JSON.parse(res.payload)
    expect(body.info.title).toBe('Unit State Microservice')
    expect(body.openapi).toMatch(/^3\./)
  })

  it('GET /docs/json includes all unit route paths', async () => {
    app = buildApp({ logger: false }, { DATABASE_URL: 'postgres://localhost/test' })
    await app.ready()

    const res = await app.inject({ method: 'GET', url: '/docs/json' })
    const body = JSON.parse(res.payload)
    const paths = Object.keys(body.paths)

    expect(paths).toContain('/units')
    expect(paths).toContain('/units/{id}')
    expect(paths).toContain('/units/{id}/toggle')
  })

  it('GET /docs/json includes correct HTTP methods for each route', async () => {
    app = buildApp({ logger: false }, { DATABASE_URL: 'postgres://localhost/test' })
    await app.ready()

    const res = await app.inject({ method: 'GET', url: '/docs/json' })
    const body = JSON.parse(res.payload)

    expect(body.paths['/units']).toHaveProperty('get')
    expect(body.paths['/units']).toHaveProperty('post')
    expect(body.paths['/units/{id}']).toHaveProperty('get')
    expect(body.paths['/units/{id}']).toHaveProperty('patch')
    expect(body.paths['/units/{id}']).toHaveProperty('delete')
    expect(body.paths['/units/{id}/toggle']).toHaveProperty('post')
  })
})
