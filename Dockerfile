FROM node:lts-alpine as base

WORKDIR /app
COPY package*.json yarn.lock ./
RUN yarn

COPY . .

RUN yarn prisma generate
RUN yarn build

FROM node:lts-alpine as production
WORKDIR /app
COPY --from=base /app/package*.json ./
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/prisma ./prisma
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/next.config.js ./next.config.js

EXPOSE 3000

ENV NODE_ENV=production \
  BASE_URL=http://localhost:3000 \
  OPENAI_API_KEY="" \
  OPENAI_API_ENDPOINT="" \
  DATABASE_URL="" \
  NEXTAUTH_URL="" \
  NEXTAUTH_SECRET="" \
  EMAIL_HOST="" \
  EMAIL_PORT="" \
  EMAIL_USERNAME="" \
  EMAIL_PASSWORD="" \
  EMAIL_FORM=""

CMD ["yarn", "start"]
