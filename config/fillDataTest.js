const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const db = require('./database');
const logger = require('../lib/logger/logger');

const datas = JSON.parse(fs.readFileSync(path.join(__dirname, './datasTest.json'), 'utf-8')).datas;

async function dropTable() {
    const res = await db('DROP TABLE IF EXISTS auth');
    return res;
}

async function createTable() {
    // eslint-disable-next-line no-multi-str
    const res = await db('CREATE TABLE IF NOT EXISTS \
                            auth(id serial PRIMARY KEY, \
                            username VARCHAR (50) UNIQUE NOT NULL, \
                            password VARCHAR (355) NOT NULL, \
                            email VARCHAR (355) UNIQUE NOT NULL, \
                            created_on TIMESTAMP NOT NULL, \
                            token VARCHAR(355) UNIQUE, \
                            last_login TIMESTAMP)');
    return res;
}

async function insertDatas(toInsert) {
    // eslint-disable-next-line no-multi-str
    const res = await db(`INSERT INTO auth (username, password, email, created_on) VALUES ${toInsert}`);
    return res;
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index += 1) {
        // eslint-disable-next-line no-await-in-loop
        await callback(array[index], index, array);
    }
}

async function fillDataTest() {
    const drop = await dropTable();
    if (drop === null) {
        return false;
    }
    const create = await createTable();
    if (create === null) {
        return false;
    }
    let toInsert = '';

    await asyncForEach(datas, async (data, index, array) => {
        if (index !== 0 && array.length !== index - 1) {
            toInsert += ', ';
        }
        const password = await bcrypt.hash(data.password, 10);
        toInsert += `('${data.username}', '${password}', '${data.email}', current_timestamp)`;
    });
    const insert = insertDatas(toInsert)
        .then((r) => {
            logger.info(r);
            return true;
        })
        .catch((err) => {
            logger.error(err);
            return false;
        });
    return insert;
}

module.exports = fillDataTest;
