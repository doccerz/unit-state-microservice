import { describe, it, expect } from 'vitest'
import { buildApp } from '../src/app.js'

describe('app', () => {
  it('creates a Fastify instance with a listen method', () => {
    const app = buildApp()
    expect(app).toBeDefined()
    expect(typeof app.listen).toBe('function')
  })

  it('can be closed without errors', async () => {
    const app = buildApp()
    await expect(app.close()).resolves.not.toThrow()
  })
})
