FROM node:14.17.1 as buildWithTsc

# Because typescript is a devDependency, first, need to build in non-prod mode
ENV NODE_ENV=development

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY ./src ./src
COPY tsconfig.json .
COPY tsconfig.build.json .
RUN npm i @nestjs/cli@8.2.0
RUN npm run build


FROM node:14.17.1 as production

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY --from=buildWithTsc /usr/src/app/dist ./dist

CMD ["node", "dist/main"]

# Tell Docker about the port we'll run on.
EXPOSE 3000
