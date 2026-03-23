export function createUnitRepository(pg, schema = 'unit-state-service') {
  const table = `"${schema}".units`

  async function create(units) {
    const values = []
    const params = []
    units.forEach(({ id, metadata = null }, i) => {
      const base = i * 2
      values.push(`($${base + 1}, $${base + 2})`)
      params.push(id, metadata != null ? JSON.stringify(metadata) : null)
    })
    const sql = `INSERT INTO ${table} (id, metadata) VALUES ${values.join(', ')} ON CONFLICT DO NOTHING RETURNING *`
    const { rows } = await pg.query(sql, params)
    return rows
  }

  async function findById(id) {
    const { rows } = await pg.query(`SELECT * FROM ${table} WHERE id = $1`, [id])
    return rows[0] ?? null
  }

  async function deleteById(id) {
    const { rows } = await pg.query(`DELETE FROM ${table} WHERE id = $1 RETURNING id`, [id])
    return rows[0] ?? null
  }

  async function atomicUpdate(id, status, metadata) {
    const sql = `UPDATE ${table} SET status = $2, metadata = COALESCE($3, metadata) WHERE id = $1 AND status != $2 RETURNING *`
    const { rows, rowCount } = await pg.query(sql, [id, status, metadata != null ? JSON.stringify(metadata) : null])
    return { row: rows[0] ?? null, rowCount }
  }

  async function toggle(id) {
    const { rows } = await pg.query(
      `UPDATE ${table} SET status = NOT status WHERE id = $1 RETURNING *`,
      [id]
    )
    return rows[0] ?? null
  }

  return { create, findById, deleteById, atomicUpdate, toggle }
}
