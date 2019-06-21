require('dotenv').config();
// eslint-disable-next-line no-unused-vars
const db = require('./config/database');
const server = require('./config/express');
const logger = require('./lib/logger/logger');

// eslint-disable-next-line no-multi-str
db('CREATE TABLE IF NOT EXISTS \
    auth(id serial PRIMARY KEY, \
    username VARCHAR (50) UNIQUE NOT NULL, \
    password VARCHAR (355) NOT NULL, \
    email VARCHAR (355) UNIQUE NOT NULL, \
    created_on TIMESTAMP NOT NULL, \
    token VARCHAR(355) UNIQUE, \
    last_login TIMESTAMP)')
    .then((res) => {
        logger.info(res);
    })
    .catch((err) => {
        logger.error(err);
    });

const PORT = process.env.PORT || 3001;

if (!module.parent) {
    server.listen(PORT, () => console.info(`Server running on ${PORT}`));
}

module.exports = server;
