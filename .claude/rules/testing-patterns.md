# Testing Patterns

- Framework: `vitest` (`npm test` = `vitest run`)
- Tests live in `tests/` directory
- Import `buildApp` from `src/app.js` directly — no test server startup needed for unit tests
- Integration tests start the full app and hit real DB (for concurrency tests in task 4.2)
- Follow test-first: write failing tests → commit → implement → run → commit
- Always `await app.close()` after each test to release resources

