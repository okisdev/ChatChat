FROM node:lts-alpine as base

WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN npm i -g pnpm
RUN pnpm i

COPY . .

RUN pnpm prisma generate
RUN pnpm build

FROM node:lts-alpine as production
WORKDIR /app
COPY --from=base /app/package*.json ./
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/prisma ./prisma
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/next.config.js ./next.config.js

RUN npm i -g pnpm

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

CMD ["pnpm", "start"]