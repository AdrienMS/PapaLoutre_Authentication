require('dotenv').config();
// eslint-disable-next-line no-unused-vars
const db = require('./config/database');
const server = require('./config/express');

const PORT = process.env.PORT || 3001;

if (!module.parent) {
    server.listen(PORT, () => console.info(`Server running on ${PORT}`));
}

module.exports = server;
