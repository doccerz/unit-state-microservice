import { vi, describe, it, expect, afterEach, beforeEach } from 'vitest'
import { buildApp } from '../src/app.js'

// var (not const/let) avoids TDZ when vi.mock factory runs before module init
var capturedOpts = null

vi.mock('@fastify/postgres', async () => {
  const fp = (await import('fastify-plugin')).default
  return {
    default: fp(async function mockPgPlugin(app, opts) {
      capturedOpts = opts
      app.decorate('pg', { query: vi.fn(), connect: vi.fn() })
    }),
  }
})

describe('DB Plugin', () => {
  let app

  beforeEach(() => {
    capturedOpts = null
  })

  afterEach(async () => {
    await app.close()
  })

  it('registers app.pg after ready', async () => {
    app = buildApp({ logger: false }, { DATABASE_URL: 'postgres://localhost/test' })
    await app.ready()
    expect(app.pg).toBeDefined()
  })

  it('passes DATABASE_URL as connectionString to postgres plugin', async () => {
    app = buildApp({ logger: false }, { DATABASE_URL: 'postgres://localhost/testdb' })
    await app.ready()
    expect(capturedOpts).toMatchObject({ connectionString: 'postgres://localhost/testdb' })
  })
})
