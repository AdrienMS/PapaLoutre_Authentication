const express = require('express');
const { Auth } = require('../models/auth.model');

const router = express.Router();

// eslint-disable-next-line no-unused-vars
router.get('/verify', async (req, res, next) => {
    let token = req.headers.authorization;
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }
    if (token) {
        const auth = new Auth('verify', 'verify', null, null, null, token, null);
        const verify = await auth.verifyToken();
        console.info(verify);
        if (verify.success) {
            res.status(200);
            res.json({
                httpStatus: 200,
                datas: {
                    user_id: verify.datas.uuid,
                },
            });
            return;
        }
        next({ status: 401, message: 'The token is expired' });
    }
    next({ status: 500, message: 'An error occured' });
});

module.exports = router;
