# Task 1.3 — OpenAPI Specification

## Context
Task 1.2 completed env config. Task 1.3 adds OpenAPI documentation via `@fastify/swagger` and `@fastify/swagger-ui`, served at `/docs`. No routes exist yet — this sets up the doc infrastructure so future route tasks can attach schemas automatically.

## Branch
`feat/task-1.3-openapi` (created from `main`)

## Steps

### 1. Write failing tests first
Create `tests/docs.test.js`:
- `GET /docs` returns 200 (or 302 redirect to `/docs/`)
- `GET /docs/json` returns valid OpenAPI JSON with correct `info.title`

Commit: `test: add failing tests for OpenAPI docs endpoint`

### 2. Install dependencies
```bash
npm install @fastify/swagger @fastify/swagger-ui
```

### 3. Create `src/docs/openapi.js`
Export a swagger config object with:
```js
{
  openapi: {
    info: { title: 'Unit State Microservice', version: '1.0.0' },
    tags: [{ name: 'units' }, { name: 'health' }]
  }
}
```

### 4. Register plugins in `src/app.js`
Add before `@fastify/env` registration (swagger must register before routes):
```js
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import swaggerConfig from './docs/openapi.js'

await app.register(swagger, swaggerConfig)
await app.register(swaggerUi, { routePrefix: '/docs' })
```

Commit: `feat: register @fastify/swagger and @fastify/swagger-ui at /docs`

### 5. Run tests — confirm passing

### 6. Update CLAUDE.md + mark task done, push, PR

## Critical Files
| File | Action |
|---|---|
| `src/app.js` | Add swagger + swagger-ui plugin registrations |
| `src/docs/openapi.js` | Create — swagger config object |
| `tests/docs.test.js` | Create — failing tests for /docs endpoint |
| `package.json` | Add `@fastify/swagger` and `@fastify/swagger-ui` |

## Verification
- `GET /docs` → 200 HTML (Swagger UI)
- `GET /docs/json` → valid OpenAPI JSON
- `npm test` → all tests pass
