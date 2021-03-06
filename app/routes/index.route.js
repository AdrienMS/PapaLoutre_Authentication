const router = require('express').Router();

router.post('/login', require('./login.route'));
router.post('/register', require('./register.route'));
router.get('/verify', require('./verifyJWT.route'));
router.delete('/delete/:id', require('./delete.route'));

module.exports = router;
