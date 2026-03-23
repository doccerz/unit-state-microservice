import Fastify from 'fastify'
import fastifyEnv from '@fastify/env'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { envSchema } from './config/env.schema.js'
import { swaggerConfig } from './docs/openapi.js'
import dbPlugin from './plugins/db.js'

export function buildApp(opts = {}, envData = null) {
  const app = Fastify(opts)

  app.register(swagger, swaggerConfig)
  app.register(swaggerUi, { routePrefix: '/docs' })

  app.register(fastifyEnv, {
    schema: envSchema,
    dotenv: false,
    data: envData ?? process.env,
  })

  app.register(dbPlugin)

  return app
}
