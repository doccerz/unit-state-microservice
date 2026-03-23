# Plan: Task 1.2 — Environment Configuration

## Context

Task 1.1 established a bare Fastify app with no env validation. Task 1.2 wires `@fastify/env` into the app so that required env vars are validated at startup and config values are accessible throughout the app via `fastify.config`.

The `.env.example` has been updated to reflect the multi-service single-postgres architecture: individual DB params (`DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME`) plus a composite `DATABASE_URL`, and `DATABASE_SCHEMA=unit-state-service` (each service owns its own schema).

## Branch

`feat/task-1.2-env-config` (created from `main`)

## Files to Create/Modify

| File | Action |
|---|---|
| `src/config/env.schema.js` | Create — JSON schema for env vars |
| `src/app.js` | Modify — register `@fastify/env` plugin |
| `tests/env.test.js` | Create — failing tests first |

## Env Schema

Validate all vars present in `.env.example`:

```js
export const envSchema = {
  type: 'object',
  required: ['DATABASE_URL'],
  properties: {
    DATABASE_URL: { type: 'string' },
    DATABASE_SCHEMA: { type: 'string', default: 'unit-state-service' },
    PORT: { type: 'integer', default: 3000 },
    // Individual DB params (optional, used by Docker Compose / external tooling)
    DATABASE_HOST: { type: 'string', default: 'localhost' },
    DATABASE_PORT: { type: 'integer', default: 5432 },
    DATABASE_USER: { type: 'string' },
    DATABASE_PASSWORD: { type: 'string' },
    DATABASE_NAME: { type: 'string' },
  },
}
```

## Implementation Steps

### 1. Write failing tests (`tests/env.test.js`)

Test cases:
- App `ready()` rejects when `DATABASE_URL` is missing
- App `ready()` resolves with valid env and exposes `fastify.config`
- `PORT` defaults to `3000` when not provided
- `DATABASE_SCHEMA` defaults to `"unit-state-service"` when not provided

Use `@fastify/env`'s `data` option to inject test values without touching `process.env`:
```js
const app = buildApp({ logger: false }, { DATABASE_URL: 'postgres://localhost/test' })
await app.ready()
```
`buildApp` accepts an optional second `envData` argument passed to `@fastify/env`.

Commit: `test: add failing tests for env configuration`

### 2. Create `src/config/env.schema.js`

Per schema above.

### 3. Update `src/app.js`

```js
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
```

Commit: `feat: add env schema and register @fastify/env in app`

### 4. Run tests and fix if needed

`npm test` — all tests including existing `app.test.js` must pass.

Note: existing `app.test.js` calls `buildApp()` with no env data. Update it to pass a valid `envData` object and call `await app.ready()` where needed.

Commit: `fix: update app tests to supply env data`

### 5. Final steps

- Update CLAUDE.md via `/claude-md-management:revise-claude-md`
- Mark task 1.2 `[x]` in `specs/v1/plan.md`
- Commit, push, create PR

## Verification

1. `npm test` — all tests pass
2. `node src/server.js` without `DATABASE_URL` → process exits with validation error
3. `DATABASE_URL=postgres://x node src/server.js` → server starts (DB connect may fail, but env validation passes)
