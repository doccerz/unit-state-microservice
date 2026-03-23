import Fastify from 'fastify'
import fastifyEnv from '@fastify/env'
import { envSchema } from './config/env.schema.js'

export function buildApp(opts = {}, envData = null) {
  const app = Fastify(opts)

  app.register(fastifyEnv, {
    schema: envSchema,
    dotenv: false,
    data: envData ?? process.env,
  })

  return app
}
