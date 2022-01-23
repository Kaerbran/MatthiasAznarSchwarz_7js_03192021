const express = require('express');
const router = express.Router();

//Import des middelwares et controllers
const postCtrl = require('../controllers/post');
const rateLimiter = require('../middlewares/rate-limiter');
const multer = require('../middlewares/multer-config');
const auth = require('../middlewares/auth');

router.get('/', postCtrl.getAllPosts);
router.get('/approved', postCtrl.getAllPostsApproved);
router.get('/approvedFull', postCtrl.getAllPostsProfileApproved);   //à tester
router.get('/unapproved', postCtrl.getAllPostsUnapproved);
router.get('/:limit/:offset', postCtrl.getNextPosts);
router.get('/:id', postCtrl.getOnePost);
router.post('/', postCtrl.createPost);
router.post('/modify', postCtrl.modifyPost);
router.post('/review', postCtrl.reviewPost);
router.delete('/:id', postCtrl.deletePost);                         //à tester

module.exports = router;