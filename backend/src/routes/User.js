const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

//npm Library 'Express rate limiter'
//const rateLimiter = require('../middleware/rate-limiter')

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/users', userCtrl.showAll);
router.delete('/usersDelete', userCtrl.delete);


module.exports = router;