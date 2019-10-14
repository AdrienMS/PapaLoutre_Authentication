const express = require('express');
const { Auth } = require('../models/auth.model');

const router = express.Router();

router.delete('/delete/:id', async (req, res, next) => {
    let token = req.headers.authorization;
    if (token && req.params.id) {
        if (token.startsWith('Bearer ')) { token = token.slice(7, token.length); }
        const auth = new Auth('delete', 'delete', 'delete', null, null, token, null);
        auth.verifyToken()
            .then(() => {
                if (auth.id.toString() !== req.params.id.toString()) {
                    next({ status: 401, message: 'Id is not match with this token' });
                } else {
                    auth.checkIfExistWithID()
                        .then((result) => {
                            if (result.rows[0].exists !== false) {
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
                                next({ status: 401, message: 'This ID not exists or is already deleted' });
                            }
                        })
                        .catch(() => {
                            next({ status: 401, message: 'This ID not exists or is already deleted' });
                        });
                }
            })
            .catch(() => {
                next({ status: 401, message: 'Token is expired' });
            });
    } else {
        next({ status: 400, message: 'Id or token missing' });
    }
});

module.exports = router;
