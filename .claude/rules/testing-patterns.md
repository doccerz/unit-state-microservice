# Testing Patterns

- Framework: `vitest` (`npm test` = `vitest run`)
- Tests live in `tests/` directory
- Import `buildApp` from `src/app.js` directly — no test server startup needed for unit tests
- Integration tests that hit real DB: start full app with no envData override — `DATABASE_URL` from `process.env` is used automatically
- Real-DB test cleanup: always DELETE test data before `app.close()` to avoid cross-test pollution in a live DB
- Concurrency guarantee is at the DB layer (`UPDATE ... WHERE status != $2`) — no app-level locking needed; concurrency tests verify behavior, not implement it
- Follow test-first: write failing tests → commit → implement → run → commit
- Always `await app.close()` after each test to release resources
- Env injection in tests: `buildApp({ logger: false }, { DATABASE_URL: 'postgres://localhost/test' })` — call `await app.ready()` to trigger plugin init
- Swagger UI redirect: `GET /docs` returns 301/302 — assert `[200, 301, 302]` not just 200
- Fastify Ajv default: `removeAdditional: true` — extra body properties are stripped silently (200), not rejected (400). Test for removal, not rejection.
- Vitest ESM constructor mocks: use `vi.fn(function() { this.method = mockFn })` pattern — arrow functions cannot be used as constructors. Define `mockFn` vars at module scope (not inside tests) since `vi.mock()` is hoisted.
- Vitest `vi.mock` factory TDZ: use `var` (not `const`/`let`) for any module-scope variable referenced inside a `vi.mock` factory — `const`/`let` throw `Cannot access before initialization` since the factory is hoisted before module init.
- Fastify plugin mocks: if a mocked plugin needs to `app.decorate(...)` and have it visible at root scope, wrap the mock with `fastify-plugin`: `vi.mock('pkg', async () => { const fp = (await import('fastify-plugin')).default; return { default: fp(mockFn) } })`
- Repository unit tests: mock pg as `{ query: vi.fn() }` — no `vi.mock`, no real DB, just pass the mock directly to `createUnitRepository(pg, schema)`
- Assert SQL shape in repository tests: `pg.query.mock.calls[0][0]` is the SQL string — check for keywords like `ON CONFLICT`, `NOT status`, `COALESCE`
- Route integration tests: use `app.inject` with mocked `@fastify/postgres` (same `var mockQuery` + `fp()` pattern as `db.test.js`) — `mockQuery.mockResolvedValueOnce({ rows: [...] })` controls repo responses; `mockQuery.mockReset()` in `beforeEach`
- Concurrency tests: use `Promise.all` with multiple `app.inject` calls — Fastify inject supports concurrent in-process requests, no `app.listen()` needed
- Real-DB integration test guard: `it.skipIf(!process.env.DATABASE_URL)(...)` — skips tests requiring a live DB when env var is absent (avoids CI failures)
- Swagger path coverage tests: parse `GET /docs/json`, assert `Object.keys(body.paths)` contains expected paths; assert HTTP method keys (e.g. `body.paths['/units/{id}']` has `get`, `patch`, `delete`)
- docs.test.js HTTP method assertions: when adding a new method to an existing path (e.g. `GET /units`), add the assertion to the existing "HTTP methods" test block — don't create a new `it` block

