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

  it('passes default pool config (max=10, idleTimeoutMillis=10000) when not set', async () => {
    app = buildApp({ logger: false }, { DATABASE_URL: 'postgres://localhost/test' })
    await app.ready()
    expect(capturedOpts).toMatchObject({ max: 10, idleTimeoutMillis: 10000 })
  })

  it('passes custom pool config from env vars', async () => {
    app = buildApp({ logger: false }, { DATABASE_URL: 'postgres://localhost/test', DATABASE_POOL_MAX: 20, DATABASE_IDLE_TIMEOUT: 5000 })
    await app.ready()
    expect(capturedOpts).toMatchObject({ max: 20, idleTimeoutMillis: 5000 })
  })
})
