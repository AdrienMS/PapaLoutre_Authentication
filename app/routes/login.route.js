const express = require('express');
const bcrypt = require('bcryptjs');
const { Auth, validate } = require('../models/auth.model');
const checkBody = require('../utils/checkBody');

const router = express.Router();

router.post('/login', async (req, res, next) => {
    const cb = checkBody(req, true);
    if (!cb.success) {
        next(cb.err);
        return;
    }

    const { error } = validate(req.body);
    if (error) {
        next({ status: 400, message: error.details[0].message });
        return;
    }

    const auth = new Auth(req.body.username, req.body.password, req.body.email);
    auth.checkIfExist()
        .then((result) => {
            if (result.rows[0] != null) {
                if (bcrypt.compareSync(auth.password, result.rows[0].password)) {
                    auth.updateToken()
                        .then(({ data, token }) => {
                            if (data != null) {
                                res.status(200);
                                res.json({
                                    httpCode: 200,
                                    data: {
                                        // eslint-disable-next-line object-shorthand
                                        token: token,
                                    },
                                });
                            } else {
                                next({ status: 500, message: 'An error occured' });
                            }
                        })
                        .catch((err) => {
                            next({ status: 500, message: err });
                        });
                } else {
                    next({ status: 400, message: 'Password is incorrect' });
                }
            } else {
                next({ status: 400, message: 'Username / Email with password is incorrect' });
            }
        })
        .catch(() => {
            next({ status: 400, message: 'Username / Email with password is incorrect' });
        });
});

module.exports = router;
