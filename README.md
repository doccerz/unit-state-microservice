# unit-state-microservice

A Fastify microservice for managing unit states with atomic boolean-toggle operations, JSONB metadata, and PostgreSQL persistence.

## Docker Image

```bash
docker pull ghcr.io/doccerz/unit-state-microservice:latest
```

Tags:
- `latest` — most recent build from `main`
- `vX.Y.Z` — pinned release (e.g. `v1.0.0`)
- `sha-<commit>` — exact commit build

## Run with Docker Compose (pre-built image)

Copy `docker-compose.example.yml` to `docker-compose.yml`, then:

```bash
docker compose up
```

## Run locally (build from source)

```bash
docker compose up --build
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | — | Full Postgres connection string (required) |
| `DATABASE_SCHEMA` | `unit-state-service` | Postgres schema name |
| `PORT` | `3000` | HTTP port |
| `DATABASE_POOL_MAX` | `10` | Max DB pool connections |
| `DATABASE_IDLE_TIMEOUT` | `10000` | Pool idle timeout (ms) |

Copy `.env.example` to `.env` for local development.

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/units` | Create one or more units |
| `GET` | `/units/:id` | Fetch a unit by UUID |
| `PATCH` | `/units/:id` | Atomic status update (409 if already in target state) |
| `POST` | `/units/:id/toggle` | Invert unit status |
| `DELETE` | `/units/:id` | Delete a unit |
| `GET` | `/health` | Health check (queries DB) |
| `GET` | `/docs` | Swagger UI |
| `GET` | `/docs/json` | OpenAPI JSON spec |

## Development

```bash
npm install
npm run dev      # run with nodemon (hot reload)
npm test         # run vitest test suite
npm run migrate  # run DB migrations
```
