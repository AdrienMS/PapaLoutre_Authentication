const express = require('express');
const { Auth } = require('../models/auth.model');

const router = express.Router();

router.delete('/delete/:id', async (req, res, next) => {
    let token = req.headers.authorization;
    if (token.startsWith('Bearer ')) { token = token.slice(7, token.length); }
    if (token && req.params.id) {
        const auth = new Auth('delete', 'delete',
            'delete', req.params.id, null, token, null);
        auth.delete()
            .then(() => {
                res.status(200);
                res.json({
                    httpCode: 200,
                    data: {
                        success: true,
                    },
                });
            })
            .catch((err) => {
                next({ status: 500, message: JSON.stringify(err) });
            });
    } else {
        next({ status: 500, message: 'An error occured' });
    }
});

module.exports = router;
