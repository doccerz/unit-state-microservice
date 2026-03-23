# Testing Patterns

- Framework: `vitest` (`npm test` = `vitest run`)
- Tests live in `tests/` directory
- Import `buildApp` from `src/app.js` directly — no test server startup needed for unit tests
- Integration tests start the full app and hit real DB (for concurrency tests in task 4.2)
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

