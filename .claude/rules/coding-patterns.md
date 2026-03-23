# Coding Patterns

- Use ESM (`import`/`export`) — package.json has `"type": "module"`
- Fastify app is built via `buildApp(opts = {}, envData = null)` factory in `src/app.js` — pass `envData` object in tests to inject env vars without touching `process.env`
- All plugins registered inside `buildApp` or as decorated Fastify plugins
- Keep `src/server.js` thin — only calls `buildApp()` and `app.listen()`
- UUID primary keys for all units
- Atomic DB updates: `UPDATE ... WHERE id=$1 AND status!=$2` — return `rowCount` to detect 409
- Plugin order in `src/app.js`: swagger → swaggerUi → env → routes (swagger must come first)
- Swagger config exported from `src/docs/openapi.js` as `swaggerConfig`
- OpenAPI JSON served at `GET /docs/json`; UI at `GET /docs` (redirects to `/docs/`)
- `pg` is available as a transitive dep of `@fastify/postgres` — use it directly in scripts that run outside Fastify (e.g. `scripts/migrate.js`)
- `fastify-plugin` is a transitive dep (via `@fastify/postgres`) — use `fp(plugin)` to wrap custom plugins that need their decorations visible at root scope (e.g. `src/plugins/db.js`)
- Plugin order in `src/app.js`: swagger → swaggerUi → env → db → routes
- Repository pattern: `createUnitRepository(pg, schema)` factory in `src/repositories/unit.repository.js` — pass `app.pg` and `app.config.DATABASE_SCHEMA` at call site
- Batch INSERT params: build `($1,$2),($3,$4),...` dynamically; each unit uses 2 slots (id, metadata)
- `metadata` param: pass `JSON.stringify(metadata)` when not null — pg driver does not auto-serialize nested objects from JSONB columns in parameterized queries
- `atomicUpdate` returns `{ row, rowCount }` — caller checks `rowCount === 0` to return 409
