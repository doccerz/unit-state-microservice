export const envSchema = {
  type: 'object',
  required: ['DATABASE_URL'],
  properties: {
    DATABASE_URL: { type: 'string' },
    DATABASE_SCHEMA: { type: 'string', default: 'unit-state-service' },
    PORT: { type: 'integer', default: 3000 },
    DATABASE_HOST: { type: 'string', default: 'localhost' },
    DATABASE_PORT: { type: 'integer', default: 5432 },
    DATABASE_USER: { type: 'string' },
    DATABASE_PASSWORD: { type: 'string' },
    DATABASE_NAME: { type: 'string' },
    DATABASE_POOL_MAX: { type: 'integer', default: 10 },
    DATABASE_IDLE_TIMEOUT: { type: 'integer', default: 10000 },
  },
}
