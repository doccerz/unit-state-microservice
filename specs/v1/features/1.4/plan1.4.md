# Plan: Task 1.4 — Schema Validation

## Context

Tasks 1.1–1.3 are complete. The app has Fastify with `@fastify/env`, `@fastify/swagger`, and `@fastify/swagger-ui` registered. No routes or schemas exist yet. Task 1.4 creates the Fastify JSON schema definitions that will be wired into routes in Phase 3.

## Branch

`feat/task-1.4-schema-validation` (from `main`)

## File to Create

**`src/schemas/unit.schema.js`** — exports four schema objects:

| Export | Shape |
|---|---|
| `createUnitBody` | `oneOf`: single `{ id?: UUID, metadata?: object }` OR array of same |
| `patchUnitBody` | `{ status?: boolean, metadata?: object }` (at least one property required) |
| `unitParams` | `{ id: UUID }` (UUID format validation) |
| `unitResponse` | `{ id: UUID, status: boolean, metadata: object\|null }` |

## Schema Details

```js
// createUnitBody — supports single or batch
export const createUnitBody = {
  oneOf: [
    {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        metadata: { type: 'object', nullable: true },
      },
      additionalProperties: false,
    },
    {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          metadata: { type: 'object', nullable: true },
        },
        additionalProperties: false,
      },
      minItems: 1,
    },
  ],
}

// patchUnitBody
export const patchUnitBody = {
  type: 'object',
  properties: {
    status: { type: 'boolean' },
    metadata: { type: 'object', nullable: true },
  },
  anyOf: [{ required: ['status'] }, { required: ['metadata'] }],
  additionalProperties: false,
}

// unitParams
export const unitParams = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string', format: 'uuid' },
  },
}

// unitResponse
export const unitResponse = {
  type: 'object',
  required: ['id', 'status'],
  properties: {
    id: { type: 'string', format: 'uuid' },
    status: { type: 'boolean' },
    metadata: { type: 'object', nullable: true },
  },
}
```

## Tests to Write (Failing First)

**`tests/schemas.test.js`** — import schemas and validate their structure:

- `createUnitBody` has `oneOf` with object and array variants
- `patchUnitBody` has `anyOf` requiring at least `status` or `metadata`
- `unitParams` requires `id` with UUID format
- `unitResponse` requires `id` and `status`
- Use Fastify's built-in Ajv (via `app.inject()`) to confirm schemas accept/reject valid/invalid inputs by registering a test route in `buildApp`

## Execution Steps

1. `git checkout main && git pull`
2. `git checkout -b feat/task-1.4-schema-validation`
3. Write failing tests in `tests/schemas.test.js`
4. `git commit` failing tests
5. Create `src/schemas/unit.schema.js`
6. `git commit` implementation
7. `npm test` — ensure all pass
8. `git commit` any fixes
9. Call `/claude-md-management:revise-claude-md`
10. Mark task 1.4 `[x]` in `specs/v1/plan.md` and commit
11. `git push -u origin feat/task-1.4-schema-validation`
12. `gh pr create` to main

## Critical Files

- **Create**: `src/schemas/unit.schema.js`
- **Create**: `tests/schemas.test.js`
- **Modify**: `specs/v1/plan.md` (mark task done)

## Verification

- `npm test` passes all tests including new schema tests
- `createUnitBody` accepts `{}`, `{ id: "valid-uuid" }`, and arrays; rejects `{ id: "not-uuid" }` and extra props
- `patchUnitBody` rejects empty `{}`; accepts `{ status: true }`
- `unitParams` rejects non-UUID strings
