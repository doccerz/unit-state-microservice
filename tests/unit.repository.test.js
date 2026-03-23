import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createUnitRepository } from '../src/repositories/unit.repository.js'

describe('createUnitRepository', () => {
  let pg
  let repo

  beforeEach(() => {
    pg = { query: vi.fn() }
    repo = createUnitRepository(pg, 'unit-state-service')
  })

  describe('create', () => {
    it('inserts a single unit and returns rows', async () => {
      const unit = { id: 'abc-123', metadata: { foo: 'bar' } }
      pg.query.mockResolvedValueOnce({ rows: [unit] })

      const result = await repo.create([unit])

      expect(pg.query).toHaveBeenCalledOnce()
      const [sql, params] = pg.query.mock.calls[0]
      expect(sql).toContain('ON CONFLICT DO NOTHING')
      expect(params).toContain(unit.id)
      expect(result).toEqual([unit])
    })

    it('inserts multiple units in a single query', async () => {
      const units = [
        { id: 'id-1', metadata: null },
        { id: 'id-2', metadata: { x: 1 } },
      ]
      pg.query.mockResolvedValueOnce({ rows: units })

      const result = await repo.create(units)

      expect(pg.query).toHaveBeenCalledOnce()
      const [sql, params] = pg.query.mock.calls[0]
      expect(sql).toContain('ON CONFLICT DO NOTHING')
      expect(params).toContain('id-1')
      expect(params).toContain('id-2')
      expect(result).toEqual(units)
    })
  })

  describe('findById', () => {
    it('returns the row when found', async () => {
      const row = { id: 'abc-123', status: false, metadata: null }
      pg.query.mockResolvedValueOnce({ rows: [row] })

      const result = await repo.findById('abc-123')

      expect(result).toEqual(row)
    })

    it('returns null when not found', async () => {
      pg.query.mockResolvedValueOnce({ rows: [] })

      const result = await repo.findById('not-found')

      expect(result).toBeNull()
    })
  })

  describe('deleteById', () => {
    it('returns the deleted row when found', async () => {
      const row = { id: 'abc-123' }
      pg.query.mockResolvedValueOnce({ rows: [row] })

      const result = await repo.deleteById('abc-123')

      expect(result).toEqual(row)
    })

    it('returns null when not found', async () => {
      pg.query.mockResolvedValueOnce({ rows: [] })

      const result = await repo.deleteById('not-found')

      expect(result).toBeNull()
    })
  })

  describe('atomicUpdate', () => {
    it('returns row and rowCount 1 on successful update', async () => {
      const row = { id: 'abc-123', status: true, metadata: null }
      pg.query.mockResolvedValueOnce({ rows: [row], rowCount: 1 })

      const result = await repo.atomicUpdate('abc-123', true, null)

      const [sql] = pg.query.mock.calls[0]
      expect(sql).toMatch(/WHERE.*status\s*!=\s*\$2/i)
      expect(result).toEqual({ row, rowCount: 1 })
    })

    it('returns rowCount 0 when already in target state (conflict)', async () => {
      pg.query.mockResolvedValueOnce({ rows: [], rowCount: 0 })

      const result = await repo.atomicUpdate('abc-123', true, null)

      expect(result).toEqual({ row: null, rowCount: 0 })
    })

    it('uses COALESCE for metadata so existing value is preserved when null passed', async () => {
      pg.query.mockResolvedValueOnce({ rows: [], rowCount: 0 })

      await repo.atomicUpdate('abc-123', false, null)

      const [sql] = pg.query.mock.calls[0]
      expect(sql.toUpperCase()).toContain('COALESCE')
    })
  })

  describe('toggle', () => {
    it('returns the updated row after toggling status', async () => {
      const row = { id: 'abc-123', status: true, metadata: null }
      pg.query.mockResolvedValueOnce({ rows: [row] })

      const result = await repo.toggle('abc-123')

      const [sql] = pg.query.mock.calls[0]
      expect(sql).toContain('NOT status')
      expect(result).toEqual(row)
    })

    it('returns null when unit not found', async () => {
      pg.query.mockResolvedValueOnce({ rows: [] })

      const result = await repo.toggle('not-found')

      expect(result).toBeNull()
    })
  })
})
