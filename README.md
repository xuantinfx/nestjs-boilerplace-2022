<p align="center">
  <a href="https://kitemetric.com/" target="blank">Kite Metric</a>
</p>

# Kite Metric Group Order

Bring the benefits to your team by Group Order via easy, fast, and trackable.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Swagger API docs

[Swagger](https://github.com/nestjs/swagger) docs will be available at
http://localhost:3000/documentation

## Reference

The project has clone from the boilerplate
[iMichaelOwolabi/google-oauth-nestjs](https://github.com/iMichaelOwolabi/google-oauth-nestjs)

### Debug with VS Code

At the project directory, start VS Code. Create .vscode/launch.json as below:

```
// ./.vscode/launch.json

{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch npm start:debug",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["start", "debug"]
    },
  ]
}
```

Start db for local development via development-utils/docker-compose.yml

```sh
cd development-utils
docker-compose up -d
```

Create .env file based on .env.sample

- Enable `SYNC_MODEL=true` in .env to create database tables if tables are not
  created yet.

To have a token to try APIs in
[the swagger](http://localhost:3000/documentation):

- env `GOOGLE_CLIENT_ID` & `GOOGLE_SECRET` must be configured
- Access the link http://localhost:3000/google/redirect and copy the token
  returned in the URL.

## Database migrations

### Running Migrations

```
npm run db:migrate
```

### Undoing Migrations

```
npm run db:migrate:undo
```

### Generate Migration Skeleton

```
npm run migration:generate <file-name>
```
