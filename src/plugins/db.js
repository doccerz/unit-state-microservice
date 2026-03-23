import fp from 'fastify-plugin'
import fastifyPostgres from '@fastify/postgres'

async function dbPlugin(app) {
  app.register(fastifyPostgres, {
    connectionString: app.config.DATABASE_URL,
  })
}

export default fp(dbPlugin)
