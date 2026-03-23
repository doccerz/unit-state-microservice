# Coding Patterns

- Use ESM (`import`/`export`) — package.json has `"type": "module"`
- Fastify app is built via `buildApp(opts = {})` factory in `src/app.js` (not instantiated directly)
- All plugins registered inside `buildApp` or as decorated Fastify plugins
- Keep `src/server.js` thin — only calls `buildApp()` and `app.listen()`
- UUID primary keys for all units
- Atomic DB updates: `UPDATE ... WHERE id=$1 AND status!=$2` — return `rowCount` to detect 409
