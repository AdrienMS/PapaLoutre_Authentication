require('dotenv').config();
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const db = require('../../config/database');

const privateKey = fs.readFileSync(path.join(__dirname, '../../keys/private.key'), 'utf-8');
const publicKey = fs.readFileSync(path.join(__dirname, '../../keys/public.key'), 'utf-8');

class Auth {
    constructor(username, password, email, id = null,
        createdOn = null, token = null, lastLogin = null) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.created_on = createdOn;
        this.token = token;
        this.last_login = lastLogin;
    }

    async checkIfExist() {
        let query = null;
        if (this.username !== null) {
            query = `SELECT id, password FROM auth WHERE username = '${this.username}'`;
        } else {
            query = `SELECT id, password FROM auth WHERE email = '${this.email}'`;
        }
        const data = await db(query);
        if (data.rows[0]) {
            this.id = data.rows[0].id;
        }
        return data;
    }

    async checkUsernameAndEmailWithoutPassword() {
        const data = await db(`SELECT exists (SELECT 1 FROM auth WHERE username = '${this.username}' OR email = '${this.email}')`);
        return data;
    }

    async checkIfExistWithID() {
        const data = await db(`SELECT exists (SELECT 1 FROM auth WHERE id = '${this.id}')`);
        return data;
    }

    generateAuthToken() {
        const playload = {
            uuid: this.id,
            name: this.name,
            isAdmin: false,
        };

        const signOption = {
            expiresIn: '12h',
            algorithm: 'RS256',
        };

        const token = jwt.sign(playload, privateKey, signOption);
        return token;
    }

    async verifyToken() {
        const verifyOption = {
            expiresIn: '12h',
            algorithm: ['RS256'],
        };

        let verify = null;
        jwt.verify(this.token, publicKey, verifyOption, (err, decoded) => {
            if (err) {
                verify = { success: false, error: err };
                return;
            }
            verify = { success: true, datas: decoded };
            this.id = verify.datas.uuid;
        });
        if (verify.success) {
            const data = await this.checkIfExistWithID();
            if (!data.rows[0].exists) {
                verify = { success: false, error: 'This ID is not found' };
            }
        }
        return verify;
    }

    async updateToken() {
        const token = this.generateAuthToken();
        let query = null;
        if (this.username !== null) {
            query = `UPDATE auth SET token = '${token}', last_login = current_timestamp WHERE username = '${this.username}'`;
        } else {
            query = `UPDATE auth SET token = '${token}', last_login = current_timestamp WHERE email = '${this.email}'`;
        }
        const data = await db(query);
        return { data, token };
    }

    async register() {
        const data = await db(`INSERT INTO auth (username, password, email, created_on) VALUES ('${this.username}', '${this.password}', '${this.email}', current_timestamp)`);
        return data;
    }

    async delete() {
        const data = await db(`DELETE FROM auth WHERE id = ${this.id}`);
        return data;
    }
}

function validateAuth(auth) {
    const schema = Joi.object().keys({
        username: Joi.string().min(5).max(30).allow(null),
        password: Joi.string().regex(/^[a-zA-Z0-9]{5,30}$/),
        email: Joi.string().email().allow(null),
    });

    return Joi.validate(
        { username: auth.username, password: auth.password, email: auth.email },
        schema,
    );
}

module.exports.Auth = Auth;
module.exports.validate = validateAuth;
