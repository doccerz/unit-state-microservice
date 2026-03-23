import fp from 'fastify-plugin'

async function errorHandlerPlugin(app) {
  app.setErrorHandler(function (err, req, reply) {
    const statusCode = err.statusCode ?? 500
    const isServerError = statusCode >= 500
    reply.code(statusCode).send({
      statusCode,
      error: isServerError ? 'Internal Server Error' : (err.name ?? 'Error'),
      message: isServerError ? 'Internal Server Error' : (err.message ?? 'Internal Server Error'),
    })
  })
}

export default fp(errorHandlerPlugin)
