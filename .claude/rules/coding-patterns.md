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
