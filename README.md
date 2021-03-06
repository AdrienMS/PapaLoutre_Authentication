# Papa Loutre Authentication
## Overview

This is the Authentication API for microservice API of Papa Loutre.
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
## Generate SSH keys

You have to generate SSH RSA keys.
You can do it with ssh-keygen command or with this link : http://travistidwell.com/jsencrypt/demo/
Copy your private key in keys/private.key.example, and your public key in keys/public.key.example
Then run :
```sh
mv keys/private.key.example keys/private.key
mv keys/public.key.example keys/public.key
```

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