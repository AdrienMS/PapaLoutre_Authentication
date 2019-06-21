require('dotenv').config();
const { Pool } = require('pg');
const logger = require('../lib/logger/logger');

const config = {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DB,
};

async function db(query) {
    const pool = new Pool(config);
    const client = await pool.connect();
    let res = null;
    try {
        await client.query('BEGIN');
        try {
            res = await client.query(query);
            logger.info(res);
            await client.query('COMMIT');
        } catch (err) {
            logger.error(`An error occured in database: ${JSON.stringify(err)}`);
            await client.query('ROLLBACK');
            throw (err);
        }
    } finally {
        client.release();
    }
    return res;
}

module.exports = db;
