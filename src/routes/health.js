export default async function healthRoutes(app) {
  app.get('/health', async (req, reply) => {
    try {
      await app.pg.query('SELECT 1')
      return { status: 'ok' }
    } catch {
      reply.code(503)
      return { status: 'error' }
    }
  })
}
