FROM node:lts-alpine as base

WORKDIR /app
COPY package*.json yarn.lock ./
RUN yarn

COPY . .

RUN yarn prisma generate
RUN yarn build

FROM node:lts-alpine as production
WORKDIR /app

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
