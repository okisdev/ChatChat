FROM oven/bun:1 AS base

WORKDIR /app

FROM base AS install
COPY package*.json bun.lockb ./
RUN bun install

FROM install AS prerelease

COPY . .

ENV NODE_ENV=production \
  DATABASE_URL="" \
  NEXTAUTH_URL="" \
  NEXTAUTH_SECRET="" \
  EMAIL_HOST="" \
  EMAIL_PORT="" \
  EMAIL_USERNAME="" \
  EMAIL_PASSWORD="" \
  EMAIL_FROM=""
RUN bun run build

FROM base AS release
COPY --from=install /app/package*.json ./
COPY --from=install /app/.next ./.next
COPY --from=install /app/public ./public
COPY --from=install /app/prisma ./prisma
COPY --from=install /app/node_modules ./node_modules
COPY --from=install /app/next.config.js ./next.config.js

USER bun
EXPOSE 3000/tcp

CMD ["bun", "run"]
