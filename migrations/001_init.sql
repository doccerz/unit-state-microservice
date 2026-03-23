CREATE SCHEMA IF NOT EXISTS "unit-state-service";

CREATE TABLE IF NOT EXISTS "unit-state-service".units (
  id UUID PRIMARY KEY,
  status BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB
);
