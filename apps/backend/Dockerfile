# ===== Stage 1: Dependencies =====
FROM node:20-alpine AS deps

RUN apk add --no-cache openssl && corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY apps/backend/package.json ./apps/backend/
COPY packages/config/package.json ./packages/config/
COPY packages/logger/package.json ./packages/logger/
COPY packages/cloudinary/package.json ./packages/cloudinary/
COPY database/package.json ./database/
COPY database/postgres/package.json ./database/postgres/

COPY database/postgres/prisma/schema.prisma ./database/postgres/prisma/

RUN pnpm install --frozen-lockfile


# ===== Stage 2: Builder =====
FROM node:20-alpine AS builder
RUN apk add --no-cache openssl && corepack enable
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY apps/backend ./apps/backend
COPY packages ./packages
COPY database ./database
COPY package.json pnpm-workspace.yaml ./

COPY --from=deps /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=deps /app/database/node_modules ./database/node_modules
COPY --from=deps /app/database/postgres/node_modules ./database/postgres/node_modules
COPY --from=deps /app/packages/config/node_modules ./packages/config/node_modules
COPY --from=deps /app/packages/logger/node_modules ./packages/logger/node_modules
COPY --from=deps /app/packages/cloudinary/node_modules ./packages/cloudinary/node_modules

# ===== Stage 3: Production =====
FROM node:20-alpine AS production

RUN apk add --no-cache openssl && corepack enable

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser

WORKDIR /app

RUN mkdir logs && chown -R appuser:nodejs /app

COPY --from=builder --chown=appuser:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:nodejs /app/apps/backend ./apps/backend
COPY --from=builder --chown=appuser:nodejs /app/packages ./packages
COPY --from=builder --chown=appuser:nodejs /app/database ./database
COPY --from=builder --chown=appuser:nodejs /app/package.json ./

RUN pnpm exec prisma generate --schema=./database/postgres/prisma/schema.prisma \
 && pnpm rebuild @prisma/client

RUN npx prisma migrate deploy --schema=./database/postgres/prisma/schema.prisma || echo "Migrations failed or already applied"

USER appuser

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:4000/health',(r)=>{process.exit(r.statusCode===200?0:1)})"

CMD ["node", "apps/backend/src/server.js"]
