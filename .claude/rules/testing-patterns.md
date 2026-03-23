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

