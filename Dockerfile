FROM node:lts-alpine AS base

WORKDIR /app
COPY package*.json bun.lockb ./
RUN npm i -g bun
RUN bun i

COPY . .

RUN bun prisma generate
RUN bun build

FROM node:lts-alpine AS production
WORKDIR /app
COPY --from=base /app/package*.json ./
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/prisma ./prisma
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/next.config.js ./next.config.js

RUN npm i -g bun

EXPOSE 3000

ENV NODE_ENV=production \
  DATABASE_URL="" \
  NEXTAUTH_URL="" \
  NEXTAUTH_SECRET="" \
  EMAIL_HOST="" \
  EMAIL_PORT="" \
  EMAIL_USERNAME="" \
  EMAIL_PASSWORD="" \
  EMAIL_FROM=""

CMD ["bun", "start"]
