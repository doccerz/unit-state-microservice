import Fastify from 'fastify'

export function buildApp(opts = {}) {
  const app = Fastify(opts)
  return app
}
