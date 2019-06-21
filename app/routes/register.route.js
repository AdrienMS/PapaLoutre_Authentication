const express = require('express');
const bcrypt = require('bcryptjs');
const { Auth, validate } = require('../models/auth.model');
const checkBody = require('../utils/checkBody');

const router = express.Router();

router.post('/register', async (req, res, next) => {
    const cb = checkBody(req, false);
    if (!cb.success) {
        next(cb.err);
        return;
    }

    const { error } = validate(req.body);
    if (error) {
        next({ status: 400, message: error.details[0].message });
        return;
    }

    const password = await bcrypt.hash(req.body.password, 10);
    const auth = new Auth(req.body.username, password, req.body.email);
    auth.checkUsernameAndEmailWithoutPassword()
        .then((result) => {
            if (result.rows[0].exists) {
                next({ status: 400, message: 'Username or Email are already registers' });
                return;
            }
            auth.register()
                .then(() => {
                    res.status(200);
                    res.json({
                        httpCode: 200,
                        data: {
                            success: 'success',
                        },
                    });
                })
                .catch((err) => {
                    next({ status: 500, message: err });
                });
        })
        .catch((errCheck) => {
            next({ status: 500, message: errCheck });
        });
});

module.exports = router;
