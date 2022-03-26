const express = require('express');
const router = express.Router();

//Import des middelwares et controllers
const userCtrl = require('../controllers/user');
const rateLimiter = require('../middlewares/rate-limiter');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');


router.post('/signup', rateLimiter.createAccountLimiter, userCtrl.signup);
router.post('/login', userCtrl.login);
router.post('/modify', auth ,  multer, userCtrl.modify);
router.get('/users', multer , userCtrl.showAll);
router.post('/user', auth , multer ,userCtrl.showOne)
router.delete('/usersDelete', auth ,userCtrl.delete);
router.post('/usersTestDelete', userCtrl.deleteTest);


module.exports = router;