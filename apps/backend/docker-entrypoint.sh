#!/bin/sh
set -e

echo "🔄 Running database migrations..."
node_modules/.bin/prisma migrate deploy --schema=./database/postgres/prisma/schema.prisma

echo "🚀 Starting backend server..."
exec node --dns-result-order=ipv4first apps/backend/src/server.js
