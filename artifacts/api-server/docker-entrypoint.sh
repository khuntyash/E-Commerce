#!/bin/sh
set -e

# Apply the Drizzle schema (idempotent: creates tables if missing, no-ops if
# already up to date). Requires DATABASE_URL to be set.
echo "[api] Applying database schema (drizzle-kit push)..."
pnpm --filter @workspace/db run push

echo "[api] Starting API server on port ${PORT:-5050}..."
exec node --enable-source-maps /app/artifacts/api-server/dist/index.mjs
