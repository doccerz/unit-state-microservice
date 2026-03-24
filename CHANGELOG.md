# Changelog

## 1.0.0 (2026-03-24)


### Features

* add centralized error handler plugin ([2dd6236](https://github.com/doccerz/unit-state-microservice/commit/2dd62363d6078727253d4a7216fef29afa419c44))
* add CI workflow for staging → main PRs ([#29](https://github.com/doccerz/unit-state-microservice/issues/29)) ([53ab83e](https://github.com/doccerz/unit-state-microservice/commit/53ab83e53c8da329237edc780c38d02d2a80594e))
* add connection pool config (max, idleTimeoutMillis) for task 2.4 ([9f7cb3e](https://github.com/doccerz/unit-state-microservice/commit/9f7cb3ea05a0e0650aab4afe5e1a9e73788a8ae5))
* add db migration script and SQL for task 2.1 ([5c77e2e](https://github.com/doccerz/unit-state-microservice/commit/5c77e2ee93ef7202ebc9cf0be89fc2fc3b6fcb60))
* add db plugin and register @fastify/postgres for task 2.2 ([abc0e53](https://github.com/doccerz/unit-state-microservice/commit/abc0e5375d9a5f2f5230ca55445f48743b809c0b))
* add DB plugin for task 2.2 ([bc60c83](https://github.com/doccerz/unit-state-microservice/commit/bc60c83d156deadf6a6aca7a6c8747e5afb9d674))
* add Docker Compose with postgres and app services ([26acc07](https://github.com/doccerz/unit-state-microservice/commit/26acc07e9c89d44768b7bb3430921933081d388b))
* add docker-compose.yml with postgres and app services ([63be631](https://github.com/doccerz/unit-state-microservice/commit/63be63182134ff5a3daea414aad732d7ac88a524))
* add docker-publish workflow to build and push image to ghcr.io ([768ad35](https://github.com/doccerz/unit-state-microservice/commit/768ad358da7982e0dff396ee77a0e3f01abb7200))
* add env schema and register @fastify/env in app ([fb2e9fc](https://github.com/doccerz/unit-state-microservice/commit/fb2e9fc22aa71e055541ed8bc9e80992f3b04375))
* add GET /health endpoint with DB liveness check ([fac72c9](https://github.com/doccerz/unit-state-microservice/commit/fac72c9535ee29fb3647ac00875553e9e2de0553))
* add GET /health endpoint with DB liveness check ([f4f86a3](https://github.com/doccerz/unit-state-microservice/commit/f4f86a3ece4c50cedf6db6d77c54fd02e1b58ab8))
* add GET /units?status= endpoint to list units by status ([7e8a12e](https://github.com/doccerz/unit-state-microservice/commit/7e8a12e9ffff8f24f7e691f37acc9a3566c814d7))
* add GET /units?status= endpoint to list units by status ([5e23d58](https://github.com/doccerz/unit-state-microservice/commit/5e23d5892bc76ef939527871a48f5d004022b2c0))
* add GitHub Actions workflow to build and push Docker image to ghcr.io ([7edec03](https://github.com/doccerz/unit-state-microservice/commit/7edec0347b3c7c44a6729624f2a223a8c519e7de))
* add multi-stage Dockerfile ([d0fa558](https://github.com/doccerz/unit-state-microservice/commit/d0fa5583f94a5db0c048b3db340c7162adab8444))
* add multi-stage Dockerfile using node:20-alpine ([836f6fd](https://github.com/doccerz/unit-state-microservice/commit/836f6fd156c2f90edaf292b5fbbab7097db958e5))
* add OpenAPI docs via @fastify/swagger and @fastify/swagger-ui ([6a8eefe](https://github.com/doccerz/unit-state-microservice/commit/6a8eefee3c8c8b5efdf0865a030412a1557fb709))
* add release-please for automatic versioning ([1bb0ed7](https://github.com/doccerz/unit-state-microservice/commit/1bb0ed75df9792f8afc7843200cad3beed58fc2d))
* add release-please for automatic versioning ([d6a8844](https://github.com/doccerz/unit-state-microservice/commit/d6a8844f761da37853897d0655cbc5aec4a8f037))
* add unit JSON schemas for request/response validation ([f4d6877](https://github.com/doccerz/unit-state-microservice/commit/f4d68773661f2c8b660da2298eeb5e51cb502986))
* add unit repository with atomic update query (task 2.3) ([7f7bd56](https://github.com/doccerz/unit-state-microservice/commit/7f7bd564e487908bb2e343c2ebc8f232c0df053e))
* add unit repository with atomic update query for task 2.3 ([6a0ad03](https://github.com/doccerz/unit-state-microservice/commit/6a0ad03480811abda5665f61b1f819dfe4760120))
* centralized error handler plugin (task 3.3) ([513a95a](https://github.com/doccerz/unit-state-microservice/commit/513a95ac0ded77eddbef99640841c53635546805))
* implement PATCH /units/:id and POST /units/:id/toggle routes ([febf63f](https://github.com/doccerz/unit-state-microservice/commit/febf63f7248befc9135eea27436d9b9a306c163d))
* implement unit management routes (POST/GET/DELETE) for task 3.1 ([37ad48b](https://github.com/doccerz/unit-state-microservice/commit/37ad48b72179a45c4d36d3e425ba0a1360ab6836))
* initialize project with Fastify app and server entry ([837d643](https://github.com/doccerz/unit-state-microservice/commit/837d643d75f7fbb106b6a0b4fad5ff4a682b612f))
* register @fastify/swagger and @fastify/swagger-ui at /docs ([1c2f21d](https://github.com/doccerz/unit-state-microservice/commit/1c2f21d2dc28e89e50b5bdef1c4e7f21ebabc6ef))
* run all verifications and fix Docker/pg/UUID issues ([d4d3e3e](https://github.com/doccerz/unit-state-microservice/commit/d4d3e3e87e7bfb29d57d03c96f3138cf4f116b9a))
* state control routes (PATCH + toggle) ([0984b14](https://github.com/doccerz/unit-state-microservice/commit/0984b1452e326151eb5b8baea953d801a7146a71))
* task 1.1 — project initialization ([fd7e842](https://github.com/doccerz/unit-state-microservice/commit/fd7e84202aa694fc091c3c68d2a57c88c2c4cdc1))
* task 1.4 schema validation ([6e3dfec](https://github.com/doccerz/unit-state-microservice/commit/6e3dfec3d974997d1e19b77140bba627b819b8b0))
* task 2.1 — database migration script ([b9e3351](https://github.com/doccerz/unit-state-microservice/commit/b9e335165827a92e3a05c8d30b47f624277d9715))
* task 2.4 - connection pool tuning ([e62ad19](https://github.com/doccerz/unit-state-microservice/commit/e62ad197f77f7713561dd9f648edad860f5612b1))
* unit management routes (POST/GET/DELETE) ([6cffcaf](https://github.com/doccerz/unit-state-microservice/commit/6cffcaf297e371d2da147df12ca9799720cada13))
* validate Swagger UI path and method coverage (task 4.1) ([5fccb56](https://github.com/doccerz/unit-state-microservice/commit/5fccb560604391212e0f372f6016f584b67a9595))


### Bug Fixes

* also tag image as latest on version release ([21998cc](https://github.com/doccerz/unit-state-microservice/commit/21998ccf4d90763808d19628a9d4de74baeabfc7))
* trigger docker publish on version tags only ([29587f1](https://github.com/doccerz/unit-state-microservice/commit/29587f1bc445924c553f526297aa49608eb36122))
* trigger docker publish on version tags only ([7494830](https://github.com/doccerz/unit-state-microservice/commit/74948308c3f743076dd75f42ad79e06d04075530))
* use node:25.7-slim, npm install without lockfile, auto-generate UUID in repo ([1f791c9](https://github.com/doccerz/unit-state-microservice/commit/1f791c94540cf23f13956b9b8365068774af03eb))
