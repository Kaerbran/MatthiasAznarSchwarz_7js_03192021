const express = require('express');
const router = express.Router();

const postCtrl = require('../controllers/post');

//npm Library 'Express rate limiter'
//const rateLimiter = require('../middleware/rate-limiter')

//Importer le middleware pour la gestion des fichiers
//const multer = require('../middleware/multer-config');

router.get('/', postCtrl.getAllPosts);
router.get('/:id', postCtrl.getOnePost);
router.post('/', postCtrl.createPost);
router.put('/:id', postCtrl.modifyPost);
router.delete('/:id', postCtrl.deletePost); 

module.exports = router;