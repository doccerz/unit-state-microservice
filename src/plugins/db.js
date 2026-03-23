import fp from 'fastify-plugin'
import fastifyPostgres from '@fastify/postgres'

async function dbPlugin(app) {
  app.register(fastifyPostgres, {
    connectionString: app.config.DATABASE_URL,
    max: app.config.DATABASE_POOL_MAX,
    idleTimeoutMillis: app.config.DATABASE_IDLE_TIMEOUT,
  })
}

export default fp(dbPlugin)
