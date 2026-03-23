**Unit State Service**, a hyper-minimalist microservice designed to act as an atomic state ledger for any resource (parking, housing, etc.) without caring about time or business logic.

---

# Technical Specification

## 1. DB Schema (Atomic Ledger)

The database is stripped of all temporal and resource-specific data. It tracks only the unique identifier, its binary state, and a flexible data blob.

|**Column**|**Type**|**Constraints**|**Description**|
|---|---|---|---|
|**`id`**|UUID|Primary Key|Unique identifier for the unit.|
|**`status`**|Boolean|Default: `false`|`true` = Active/Occupied, `false` = Available.|
|**`metadata`**|JSON|Optional|External references or attributes (e.g., `{"label": "Spot A1"}`).|

---

## 2. API Endpoints (REST)

The API focuses on high-speed state transitions and metadata retrieval.

### Unit Management

- **`POST /units`**: Create a new unit or a batch of units.
    
- **`GET /units/{id}`**: Retrieve the current status and metadata for a specific ID.
    
- **`DELETE /units/{id}`**: Remove a unit from the ledger.
    

### State Control

- **`PATCH /units/{id}`**: Explicitly update the status and/or metadata.
    
    - _Body:_ `{ "status": true, "metadata": { ... } }`
        
- **`POST /units/{id}/toggle`**: Invert the current boolean status automatically.
    

---

## 3. Workflows (Mermaid.js)

### Atomic State Toggle

This workflow ensures that state changes are idempotent and safe from race conditions at the database level.

Code snippet

```
sequenceDiagram
    participant App as External Service
    participant API as Unit Service
    participant DB as SQLite/Postgres

    App->>API: PATCH /units/{id} (status: true)
    
    Note over API, DB: Atomic Update logic
    API->>DB: UPDATE units SET status = true WHERE id = {id} AND status = false
    
    alt Row Affected (1)
        DB-->>API: Update Success
        API-->>App: 200 OK (State Changed)
    else No Row Affected (0)
        DB-->>API: No Change
        API-->>App: 409 Conflict (Already in requested state)
    end
```

---

## 4. Architecture & Tech Stack

To keep this service "slim" while maintaining high performance:

- **Runtime:** **Node.js (Fastify)**. Fastify provides the lowest overhead for JSON APIs and built-in schema validation.
    
- **Database:** **SQLite**. For a single-table service, SQLite is faster than a networked DB and eliminates infrastructure management.
    
- **Documentation:** **OpenAPI 3.0 (Swagger)**. A static `swagger.json` file served via a `/docs` route.
    
- **Concurrency:** Handled via standard SQL `WHERE` clauses to ensure atomic updates without complex locking logic.
    

---

## Why this works

1. **Agnostic:** It doesn't know if it's booking a car or a house. It only knows that `ID X` is now `status: true`.
    
2. **Stateless Logic:** By removing `updated_at` and time components, the service is a pure "Source of Truth" for current state only.
    
3. **Low Latency:** With a 3-column SQLite table, lookups and updates are near-instant.
    

Would you like me to generate the **`openapi.yaml`** file so you can immediately generate the server code?

---

# Task breakdown 

## Overview

A high-performance, agnostic state manager built with **Node.js (Fastify)** and **PostgreSQL**. The service acts as a pure "Source of Truth" for binary states (Active/Occupied vs. Available).

---

## Phase 1: Foundation & API Contract

- **Task 1.1: Project Initialization:** Initialize the Node.js project and install core dependencies: `fastify`, `@fastify/env`, and `@fastify/postgres`.
    
- **Task 1.2: Environment Configuration:** Implement a validation schema for the `.env` variables (e.g., `DATABASE_URL`, `PORT`, `DATABASE_SCHEMA`).
    
- **Task 1.3: OpenAPI Specification:** Define the `openapi.yaml` file covering `/units`, `/units/{id}`, and `/units/{id}/toggle`.
    
- **Task 1.4: Schema Validation:** Set up Fastify JSON schemas for request body validation, particularly for the metadata JSON blob.
    

## Phase 2: PostgreSQL Persistence Layer

- **Task 2.1: Database Migration:** Create a migration script to initialize the `iam_db` database and the `unit-state-service` schema.
    
- **Task 2.2: Table Definition:** Create the `units` table using `UUID` for the ID and `JSONB` for the metadata to ensure efficient storage and querying.
    
- **Task 2.3: Atomic Update Query:** Implement the atomic transition logic to prevent race conditions:
    
    `UPDATE units SET status = $1 WHERE id = $2 AND status != $1`.
    
- **Task 2.4: Connection Pooling:** Configure `@fastify/postgres` to manage the connection pool using the provided `DATABASE_URL`.
    

## Phase 3: Core Service Implementation

- **Task 3.1: Unit Management:** Develop routes for `POST /units` (batch creation), `GET /units/{id}`, and `DELETE /units/{id}`.
    
- **Task 3.2: State Control Logic:** Implement `PATCH /units/{id}` for explicit updates and `POST /units/{id}/toggle` for automatic boolean inversion.
    
- **Task 3.3: Conflict Management:** Ensure the API returns a **409 Conflict** if an update is attempted on a unit that is already in the target state.
    

## Phase 4: Documentation & Quality Assurance

- **Task 4.1: Swagger UI:** Integrate `@fastify/swagger-ui` to serve interactive documentation at the `/docs` route.
    
- **Task 4.2: Concurrency Testing:** Write integration tests to simulate simultaneous requests and verify the atomic behavior of the PostgreSQL `UPDATE` query.
    
- **Task 4.3: Health Monitoring:** Implement a `/health` endpoint that verifies the database connection status.
    

## Phase 5: Containerization & Orchestration

- **Task 5.1: Dockerfile:** Create a multi-stage Dockerfile for a slim Node-Alpine production image.
    
- **Task 5.2: Docker Compose:** Define a `docker-compose.yml` to orchestrate the Fastify service and the PostgreSQL container on the same network.
    
- **Task 5.3: Persistence Setup:** Ensure PostgreSQL data volumes are correctly mapped to prevent data loss during container restarts.
    

---

### Implementation Summary

|**Phase**|**Focus**|**Primary Tooling**|
|---|---|---|
|**1**|Design|Fastify + OpenAPI|
|**2**|Data|PostgreSQL + JSONB|
|**3**|Logic|REST Endpoints|
|**4**|DX|Swagger + Unit Tests|
|**5**|DevOps|Docker Compose|
