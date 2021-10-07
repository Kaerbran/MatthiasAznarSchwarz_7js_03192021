const express = require('express');
const router = express.Router();

//Import des middelwares et controllers
const postCtrl = require('../controllers/post');
const rateLimiter = require('../middlewares/rate-limiter');
const multer = require('../middlewares/multer-config');
const auth = require('../middlewares/auth');

router.get('/', postCtrl.getAllPosts);
router.get('/:limit/:offset', postCtrl.getNextPosts);
router.get('/:id', postCtrl.getOnePost);
router.post('/', postCtrl.createPost);
router.put('/:id', postCtrl.modifyPost);
router.delete('/:id', postCtrl.deletePost); 

module.exports = router;