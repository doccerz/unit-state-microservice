export const swaggerConfig = {
  openapi: {
    info: {
      title: 'Unit State Microservice',
      version: '1.0.0',
      description: 'Atomic binary state ledger for tracking unit states',
    },
    tags: [
      { name: 'units', description: 'Unit management and state control' },
      { name: 'health', description: 'Health check' },
    ],
  },
}
