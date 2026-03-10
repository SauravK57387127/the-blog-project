# ===== Stage 1: Dependencies =====
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat && corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/frontend/package.json ./apps/frontend/

RUN pnpm install --frozen-lockfile


# ===== Stage 2: Builder =====
FROM node:20-alpine AS builder
RUN corepack enable

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY apps/frontend ./apps/frontend
COPY package.json pnpm-workspace.yaml ./

WORKDIR /app/apps/frontend

RUN pnpm build


# ===== Stage 3: Production =====
FROM node:20-alpine AS production
RUN corepack enable

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/frontend/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/frontend/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/frontend/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
