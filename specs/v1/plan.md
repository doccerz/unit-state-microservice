# Plan: Unit State Microservice — v1 Implementation

## Context

The repository is a blank slate (no source code, no package.json, no tests). The goal is to implement a hyper-minimalist atomic state ledger microservice from scratch, following the `specs/v1/v1-specs.md` specification. The service tracks a binary state (`status: boolean`) per unique ID with optional JSON metadata, exposing a REST API with atomic conflict-safe updates.

---

## Tech Stack (per spec)

- **Runtime:** Node.js + Fastify
- **Database:** PostgreSQL with `@fastify/postgres` (JSONB for metadata)
- **Docs:** OpenAPI 3.0 via `@fastify/swagger` + `@fastify/swagger-ui`
- **Env validation:** `@fastify/env`
- **Container:** Docker + Docker Compose
- **Testing:** `vitest` (integration tests for concurrency)

---

## Task Execution Order

Each task gets its own branch from `main`, following the strict git-workflow rules.

---

## Phase 1: Foundation & API Contract

### Task 1.1 — Project Initialization
- [ ] **Branch:** `feat/task-1.1-project-init`
- [ ] `npm init -y`
- [ ] Install: `fastify`, `@fastify/env`, `@fastify/postgres`
- [ ] Install dev: `vitest`, `nodemon`
- [ ] Create `src/app.js` — bare Fastify instance
- [ ] Create `src/server.js` — entry point (listen on PORT)
- [ ] Create `.gitignore`, `.env.example`

### Task 1.2 — Environment Configuration
- [ ] **Branch:** `feat/task-1.2-env-config`
- [ ] Create `src/config/env.schema.js` — JSON schema for env vars:
  - `DATABASE_URL` (string, required)
  - `PORT` (integer, default 3000)
  - `DATABASE_SCHEMA` (string, default `"public"`)
- [ ] Register `@fastify/env` in `src/app.js` with the schema

### Task 1.3 — OpenAPI Specification
- [ ] **Branch:** `feat/task-1.3-openapi`
- [ ] Create `src/docs/openapi.yaml` covering all endpoints
- [ ] Register `@fastify/swagger` + `@fastify/swagger-ui` in app (served at `/docs`)

### Task 1.4 — Schema Validation
- [ ] **Branch:** `feat/task-1.4-schema-validation`
- [ ] Create `src/schemas/unit.schema.js` — Fastify JSON schemas:
  - `createUnitBody` — `{ id?: UUID, metadata?: object }` (or array for batch)
  - `patchUnitBody` — `{ status?: boolean, metadata?: object }`
  - `unitParams` — `{ id: UUID }`
  - `unitResponse` — `{ id, status, metadata }`

---

## Phase 2: PostgreSQL Persistence Layer

### Task 2.1 — Database Migration Script
- [ ] **Branch:** `feat/task-2.1-db-migration`
- [ ] Create `migrations/001_init.sql`:
  ```sql
  CREATE SCHEMA IF NOT EXISTS "unit-state-service";
  CREATE TABLE IF NOT EXISTS "unit-state-service".units (
    id UUID PRIMARY KEY,
    status BOOLEAN NOT NULL DEFAULT false,
    metadata JSONB
  );
  ```
- [ ] Create `scripts/migrate.js` — runs the SQL file via pg

### Task 2.2 — Table Definition & DB Plugin
- [ ] **Branch:** `feat/task-2.2-db-plugin`
- [ ] Create `src/plugins/db.js` — registers `@fastify/postgres` with `DATABASE_URL`
- [ ] Verify connection on startup

### Task 2.3 — Atomic Update Query
- [ ] **Branch:** `feat/task-2.3-atomic-query`
- [ ] Create `src/repositories/unit.repository.js` with methods:
  - `create(units[])` — batch insert with `ON CONFLICT DO NOTHING`
  - `findById(id)` — SELECT by UUID
  - `deleteById(id)` — DELETE by UUID
  - `atomicUpdate(id, status, metadata)` — `UPDATE ... WHERE id=$1 AND status!=$2`, returns rowCount
  - `toggle(id)` — `UPDATE ... SET status = NOT status WHERE id=$1`, returns updated row

### Task 2.4 — Connection Pooling
- [ ] **Branch:** `feat/task-2.4-connection-pool`
- [ ] Tune `@fastify/postgres` pool config (max, idleTimeoutMillis)
- [ ] Ensure pool is available via `fastify.pg` throughout lifecycle

---

## Phase 3: Core Service Implementation

### Task 3.1 — Unit Management Routes
- [ ] **Branch:** `feat/task-3.1-unit-management`
- [ ] Write failing integration tests first
- [ ] Create `src/routes/units.js`:
  - `POST /units` — create single or batch; respond 201
  - `GET /units/:id` — return unit or 404
  - `DELETE /units/:id` — remove or 404
- [ ] Wire schemas from Task 1.4

### Task 3.2 — State Control Routes
- [ ] **Branch:** `feat/task-3.2-state-control`
- [ ] Write failing tests first
- [ ] Add to `src/routes/units.js`:
  - `PATCH /units/:id` — explicit status/metadata update; 409 if already in target state
  - `POST /units/:id/toggle` — invert boolean; 404 if not found
- [ ] Wire atomic query from Task 2.3

### Task 3.3 — Conflict Management
- [ ] **Branch:** `feat/task-3.3-conflict-management`
- [ ] Write failing test for 409 scenario first
- [ ] Ensure `atomicUpdate` returns `409` when `rowCount === 0`
- [ ] Centralize error handling in `src/plugins/error-handler.js`

---

## Phase 4: Documentation & Quality Assurance

### Task 4.1 — Swagger UI
- [ ] **Branch:** `feat/task-4.1-swagger-ui`
- [ ] Confirm `/docs` serves interactive UI
- [ ] Validate all routes appear with request/response schemas

### Task 4.2 — Concurrency Integration Tests
- [ ] **Branch:** `feat/task-4.2-concurrency-tests`
- [ ] Simultaneous `PATCH` requests for same unit
- [ ] Assert only one 200 and others 409
- [ ] Verify no data corruption

### Task 4.3 — Health Endpoint
- [ ] **Branch:** `feat/task-4.3-health`
- [ ] Write failing test first
- [ ] `GET /health` — queries DB (`SELECT 1`) and returns `{ status: "ok" }` or 503

---

## Phase 5: Containerization

### Task 5.1 — Dockerfile
- [ ] **Branch:** `feat/task-5.1-dockerfile`
- [ ] Multi-stage: `node:20-alpine` builder → slim production image
- [ ] Expose PORT, run `node src/server.js`

### Task 5.2 — Docker Compose
- [ ] **Branch:** `feat/task-5.2-docker-compose`
- [ ] `docker-compose.yml` with `postgres:16-alpine` + `app` services
- [ ] App depends_on postgres, runs migrations then starts server

### Task 5.3 — Persistence & Volumes
- [ ] **Branch:** `feat/task-5.3-volumes`
- [ ] Map named volume for PostgreSQL data directory
- [ ] Verify data survives `docker compose down` + `up`

---

## Critical Files to Create

| File | Purpose |
|---|---|
| `package.json` | Node project + deps |
| `src/app.js` | Fastify instance + plugins |
| `src/server.js` | Entry point |
| `src/config/env.schema.js` | Env validation |
| `src/schemas/unit.schema.js` | Request/response schemas |
| `src/plugins/db.js` | Postgres plugin |
| `src/plugins/error-handler.js` | Centralized errors |
| `src/repositories/unit.repository.js` | All DB queries |
| `src/routes/units.js` | All REST routes |
| `migrations/001_init.sql` | DB schema |
| `scripts/migrate.js` | Migration runner |
| `src/docs/openapi.yaml` | API spec |
| `Dockerfile` | Container build |
| `docker-compose.yml` | Orchestration |

---

## Verification

- [ ] `npm run migrate` → table created in PostgreSQL
- [ ] `npm start` → server starts on PORT 3000
- [ ] `curl POST /units` → 201 with UUID
- [ ] `curl GET /units/:id` → 200 with unit
- [ ] `curl PATCH /units/:id { status: true }` → 200; repeat → 409
- [ ] `curl POST /units/:id/toggle` → inverts status
- [ ] `curl DELETE /units/:id` → 200; repeat → 404
- [ ] `GET /docs` → Swagger UI renders all endpoints
- [ ] `GET /health` → `{ status: "ok" }`
- [ ] `npm test` → all integration tests pass including concurrency
- [ ] `docker compose up` → service + DB start, migrations run automatically
