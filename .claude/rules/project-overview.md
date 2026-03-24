# Project Overview

## Tech Stack
- Node.js + Fastify (ESM, `"type": "module"`)
- PostgreSQL via `@fastify/postgres` (JSONB metadata)
- `@fastify/env` for env validation
- `vitest` for testing, `nodemon` for dev reloading
- Docker + Docker Compose for containerization

## Architecture
- Entry: `src/server.js` → calls `buildApp()` from `src/app.js`
- Plugins registered in `src/app.js`
- Routes in `src/routes/`, repos in `src/repositories/`, schemas in `src/schemas/`
- DB migrations in `migrations/`, runner in `scripts/migrate.js`

## Database Architecture
- Single shared Postgres instance; each service owns its own schema (e.g. `unit-state-service`)
- Individual env vars (`DATABASE_HOST/PORT/USER/PASSWORD/NAME`) used by Docker Compose; app consumes `DATABASE_URL`

## Key Commands
- `npm start` — run server
- `npm run dev` — run with nodemon
- `npm test` — run vitest integration tests
- `npm run migrate` — run DB migration script (task 2.1+)
- `docker pull ghcr.io/doccerz/unit-state-microservice:latest` — pull published image

## CI/CD
- GitHub Actions: `.github/workflows/docker-publish.yml`
- Triggers: push to `main` → publishes `latest` tag; push `v*.*.*` git tag → publishes semver tags
- Registry: ghcr.io (authenticates with `GITHUB_TOKEN` — no manual secret needed)
- PR builds: image is built but not pushed (smoke-tests the Dockerfile)
- Example Compose file for consuming the published image: `docker-compose.example.yml`

## API Endpoints
- `POST /units` — create unit(s)
- `GET /units/:id` — fetch unit
- `PATCH /units/:id` — atomic state update (409 if already in target state)
- `POST /units/:id/toggle` — invert status
- `DELETE /units/:id` — remove unit
- `GET /health` — health check
- `GET /docs` — Swagger UI
