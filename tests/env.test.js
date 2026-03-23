import { describe, it, expect, afterEach } from 'vitest'
import { buildApp } from '../src/app.js'

describe('env configuration', () => {
  let app

  afterEach(async () => {
    if (app) await app.close()
  })

  it('rejects when DATABASE_URL is missing', async () => {
    app = buildApp({ logger: false }, {})
    await expect(app.ready()).rejects.toThrow()
  })

  it('resolves with valid DATABASE_URL and exposes fastify.config', async () => {
    app = buildApp({ logger: false }, { DATABASE_URL: 'postgres://localhost/test' })
    await expect(app.ready()).resolves.not.toThrow()
    expect(app.config).toBeDefined()
    expect(app.config.DATABASE_URL).toBe('postgres://localhost/test')
  })

  it('PORT defaults to 3000 when not provided', async () => {
    app = buildApp({ logger: false }, { DATABASE_URL: 'postgres://localhost/test' })
    await app.ready()
    expect(app.config.PORT).toBe(3000)
  })

  it('DATABASE_SCHEMA defaults to "unit-state-service" when not provided', async () => {
    app = buildApp({ logger: false }, { DATABASE_URL: 'postgres://localhost/test' })
    await app.ready()
    expect(app.config.DATABASE_SCHEMA).toBe('unit-state-service')
  })
})
