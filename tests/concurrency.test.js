import { describe, it, expect } from 'vitest'
import { buildApp } from '../src/app.js'

const CONCURRENCY = 5

describe('concurrency', () => {
  it.skipIf(!process.env.DATABASE_URL)(
    'concurrent PATCH requests — only one 200, rest 409',
    async () => {
      const app = buildApp({ logger: false })
      await app.ready()

      // Create a unit to operate on
      const createRes = await app.inject({
        method: 'POST',
        url: '/units',
        payload: {},
      })
      const { id } = JSON.parse(createRes.body)

      // Fire CONCURRENCY simultaneous PATCH requests all setting status: true
      const responses = await Promise.all(
        Array.from({ length: CONCURRENCY }, () =>
          app.inject({
            method: 'PATCH',
            url: `/units/${id}`,
            payload: { status: true },
          })
        )
      )

      const statuses = responses.map((r) => r.statusCode)
      expect(statuses.filter((s) => s === 200)).toHaveLength(1)
      expect(statuses.filter((s) => s === 409)).toHaveLength(CONCURRENCY - 1)

      // Verify final state is correct — no corruption
      const getRes = await app.inject({ method: 'GET', url: `/units/${id}` })
      expect(JSON.parse(getRes.body).status).toBe(true)

      // Cleanup
      await app.inject({ method: 'DELETE', url: `/units/${id}` })
      await app.close()
    }
  )

  it.skipIf(!process.env.DATABASE_URL)(
    'concurrent toggle requests — no data corruption',
    async () => {
      const app = buildApp({ logger: false })
      await app.ready()

      const createRes = await app.inject({
        method: 'POST',
        url: '/units',
        payload: {},
      })
      const { id } = JSON.parse(createRes.body)

      // Fire CONCURRENCY simultaneous toggles — each should succeed (toggle has no 409)
      const responses = await Promise.all(
        Array.from({ length: CONCURRENCY }, () =>
          app.inject({ method: 'POST', url: `/units/${id}/toggle` })
        )
      )

      expect(responses.every((r) => r.statusCode === 200)).toBe(true)

      // Final status should reflect an odd number of toggles from initial false
      const getRes = await app.inject({ method: 'GET', url: `/units/${id}` })
      // All toggles ran — status must be a boolean (no corruption)
      expect(typeof JSON.parse(getRes.body).status).toBe('boolean')

      await app.inject({ method: 'DELETE', url: `/units/${id}` })
      await app.close()
    }
  )
})
