FROM node:22-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

RUN npm i -g pnpm && pnpm i

COPY apps/user apps/user
COPY libs libs

RUN pnpm build user

CMD ["pnpm", "start:dev", "user"]

#FROM node:22-alpine AS production
#
#ARG NODE_ENV=production
#ENV NODE_ENV=${NODE_ENV}
#
#WORKDIR /usr/src/app
#
#COPY package.json ./
#COPY pnpm-lock.yaml ./
#
#RUN npm i -g pnpm && pnpm i
#
#COPY --from=development /usr/src/app/dist ./dist
#COPY proto proto
#
#CMD ["node", "dist/apps/user/main"]