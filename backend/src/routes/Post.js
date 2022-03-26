const express = require('express');
const router = express.Router();

//Import des middelwares et controllers
const postCtrl = require('../controllers/post');
const rateLimiter = require('../middlewares/rate-limiter');
const multer = require('../middlewares/multer-config');
const auth = require('../middlewares/auth');

router.get('/approved', auth , postCtrl.getAllPostsApproved);
router.get('/approvedFull', postCtrl.getAllPostsProfileApproved);   //à tester
router.get('/unapproved', auth , postCtrl.getAllPostsUnapproved);
router.post('/', auth , multer ,postCtrl.createPost);
router.post('/modify', auth , postCtrl.modifyPost);
router.post('/review', auth , multer ,postCtrl.reviewPost);
router.post('/delete', auth , multer ,postCtrl.deletePost);                         //à tester

// A AMELIORER
router.get('/:limit/:offset', postCtrl.getNextPosts);
//router.get('/:id', postCtrl.getOnePost);

//A SUPPRIMER
router.get('/', postCtrl.getAllPosts);


module.exports = router;