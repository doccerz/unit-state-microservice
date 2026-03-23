import pg from 'pg'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join, dirname } from 'node:path'

const { Client } = pg
const __dirname = dirname(fileURLToPath(import.meta.url))
const sqlPath = join(__dirname, '..', 'migrations', '001_init.sql')

export async function migrate(databaseUrl) {
  const url = databaseUrl ?? process.env.DATABASE_URL
  const client = new Client({ connectionString: url })
  await client.connect()
  const sql = await readFile(sqlPath, 'utf-8')
  await client.query(sql)
  await client.end()
}

// Run when executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  migrate().then(() => {
    console.log('Migration complete')
    process.exit(0)
  }).catch((err) => {
    console.error('Migration failed:', err)
    process.exit(1)
  })
}
