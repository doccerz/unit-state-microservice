# Plan: Task 1.1 — Project Initialization

## Context

The repository is a blank slate (no source code, no `package.json`, no git history). Task 1.1 bootstraps the entire Node.js project: initializes git, installs dependencies, and creates the bare Fastify app and server entry point.

---

## Branch

`feat/task-1.1-project-init` (created from `main` after `git init` + initial commit)

---

## Steps

### 1. Git init + initial commit on main
```
git init
git add .
git commit -m "chore: initial repo setup"
```

### 2. Create branch
```
git checkout -b feat/task-1.1-project-init
```

### 3. Write failing test first
Create `tests/app.test.js` — a smoke test that:
- Imports `src/app.js`
- Asserts the Fastify instance is defined and has a `listen` method
- (Tests will fail because `src/app.js` doesn't exist yet)

Commit: `test: add app smoke test (failing)`

### 4. Implement files

**`package.json`** via `npm init -y`, then install:
- Production: `fastify`, `@fastify/env`, `@fastify/postgres`
- Dev: `vitest`, `nodemon`

Add scripts:
```json
{
  "start": "node src/server.js",
  "dev": "nodemon src/server.js",
  "test": "vitest run"
}
```

**`src/app.js`** — bare Fastify instance:
```js
import Fastify from 'fastify'

export function buildApp(opts = {}) {
  const app = Fastify(opts)
  return app
}
```

**`src/server.js`** — entry point:
```js
import { buildApp } from './app.js'

const app = buildApp({ logger: true })
const port = process.env.PORT || 3000

app.listen({ port, host: '0.0.0.0' }, (err) => {
  if (err) { app.log.error(err); process.exit(1) }
})
```

**`.gitignore`**:
```
node_modules/
.env
dist/
```

**`.env.example`**:
```
DATABASE_URL=postgres://user:password@localhost:5432/unit_state
PORT=3000
DATABASE_SCHEMA=public
```

Commit: `feat: initialize project with Fastify app and server entry`

### 5. Run tests — verify they pass
```
npm test
```

Commit any fixes: `fix: resolve test issues if needed`

### 6. Update plan.md — mark task 1.1 `[x]`

Commit: `chore: mark task 1.1 complete`

### 7. Push + PR
```
git push -u origin feat/task-1.1-project-init
gh pr create ...
```

---

## Critical Files

| File | Action |
|---|---|
| `package.json` | Create via `npm init -y` + manual edits |
| `src/app.js` | Create — Fastify factory function |
| `src/server.js` | Create — entry point |
| `.gitignore` | Create |
| `.env.example` | Create |
| `tests/app.test.js` | Create — smoke test (written first) |

---

## Verification

- `npm test` → smoke test passes (Fastify instance is valid)
- `node src/server.js` → server starts on port 3000 (with `DATABASE_URL` not yet needed at this stage)
