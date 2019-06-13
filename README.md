# Papa Loutre Rest API base
## Overview

This is the rest API base for microservice API of Papa Loutre.
This works with :
  - NodeJS 12.3.1
  - Express 4.17.0
  - PostgreSQL 11.2
  - Gulp 4.0.2
  - Eslint 5.16 (AirBnB)
  - nyc 14.1.1
  - mocha 6.1.4
  - chai 4.2.0
  - Babel 7.4.4
  - Swagger UI Express 4.0.6
  - Docker


# Getting Started
## With Docker

Run docker compose:
```sh
docker-compose up
```

If the run failed with postgres container, run:

```sh
docker-compose down
docker-compose up --force-recreate
```

The next time, just run docker compose normally

If you add changes, run the following command so that docker can take them into account :

```sh
docker-compose up --build
```

Then, the node server will run on localhost:3001 and the postgres on localhost:5432

## Without Docker

You have to install [postgres](https://www.postgresql.org) locally.

Then you have to create an admin and a database :

```sh
psql -U postgres
```

```postgres
CREATE DATABASE auth;
CREATE ROLE auth_admin password 'auth' login;
GRANT ALL ON DATABASE auth TO auth_admin WITH GRANT OPTION;
```

You can access to you database with your admin role like this:

```bash
psql -U auth_admin auth
```

Install [node](https://nodejs.org/en/)


Install yarn:

```js
npm install -g yarn
```

Install dependencies:

```sh
yarn
```

Set environment (vars):

```sh
cp env.example .env
```

Start server:

```sh
yarn start
```

The server will start on localhost:3001