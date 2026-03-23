import { vi, describe, it, expect, afterEach } from 'vitest'
import { buildApp } from '../src/app.js'

vi.mock('@fastify/postgres', () => ({
  default: vi.fn(async function (app) {
    app.decorate('pg', { query: vi.fn(), connect: vi.fn() })
  }),
}))

describe('DB Plugin', () => {
  let app

  afterEach(async () => {
    await app.close()
  })

  it('registers app.pg after ready', async () => {
    app = buildApp({ logger: false }, { DATABASE_URL: 'postgres://localhost/test' })
    await app.ready()
    expect(app.pg).toBeDefined()
  })

  it('connects using DATABASE_URL from config', async () => {
    const { default: fastifyPostgres } = await import('@fastify/postgres')
    app = buildApp({ logger: false }, { DATABASE_URL: 'postgres://localhost/testdb' })
    await app.ready()
    expect(fastifyPostgres).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ connectionString: 'postgres://localhost/testdb' }),
      expect.anything()
    )
  })
})
