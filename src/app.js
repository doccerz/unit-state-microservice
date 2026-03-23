import Fastify from 'fastify'
import fastifyEnv from '@fastify/env'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { envSchema } from './config/env.schema.js'
import { swaggerConfig } from './docs/openapi.js'
import dbPlugin from './plugins/db.js'
import errorHandlerPlugin from './plugins/error-handler.js'
import unitsRoutes from './routes/units.js'
import healthRoutes from './routes/health.js'

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
  app.register(errorHandlerPlugin)
  app.register(unitsRoutes)
  app.register(healthRoutes)

  return app
}
