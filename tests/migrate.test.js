import { describe, it, expect, vi, beforeEach } from 'vitest'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

const sqlPath = join(process.cwd(), 'migrations', '001_init.sql')

const mockConnect = vi.fn()
const mockQuery = vi.fn()
const mockEnd = vi.fn()

vi.mock('pg', () => ({
  default: {
    Client: vi.fn(function () {
      this.connect = mockConnect
      this.query = mockQuery
      this.end = mockEnd
    }),
  },
}))

describe('migrations/001_init.sql', () => {
  it('contains CREATE SCHEMA IF NOT EXISTS', async () => {
    const sql = await readFile(sqlPath, 'utf-8')
    expect(sql).toContain('CREATE SCHEMA IF NOT EXISTS')
  })

  it('contains CREATE TABLE IF NOT EXISTS for units', async () => {
    const sql = await readFile(sqlPath, 'utf-8')
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS')
    expect(sql).toContain('units')
  })

  it('defines id UUID PRIMARY KEY', async () => {
    const sql = await readFile(sqlPath, 'utf-8')
    expect(sql).toContain('id UUID PRIMARY KEY')
  })

  it('defines status BOOLEAN', async () => {
    const sql = await readFile(sqlPath, 'utf-8')
    expect(sql).toContain('status BOOLEAN')
  })

  it('defines metadata JSONB', async () => {
    const sql = await readFile(sqlPath, 'utf-8')
    expect(sql).toContain('metadata JSONB')
  })
})

describe('scripts/migrate.js', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockQuery.mockResolvedValue({ rows: [] })
    mockConnect.mockResolvedValue(undefined)
    mockEnd.mockResolvedValue(undefined)
  })

  it('exports a migrate function', async () => {
    const mod = await import('../scripts/migrate.js')
    expect(typeof mod.migrate).toBe('function')
  })

  it('migrate connects, queries, and ends the pg client', async () => {
    const { migrate } = await import('../scripts/migrate.js')
    await migrate('postgres://mock/testdb')

    expect(mockConnect).toHaveBeenCalledOnce()
    expect(mockQuery).toHaveBeenCalledOnce()
    expect(mockEnd).toHaveBeenCalledOnce()

    const querySql = mockQuery.mock.calls[0][0]
    expect(querySql).toContain('CREATE SCHEMA')
    expect(querySql).toContain('CREATE TABLE')
  })
})
