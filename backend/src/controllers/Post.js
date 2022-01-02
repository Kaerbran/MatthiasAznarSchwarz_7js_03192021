//Import the entity model
const User = require('../entity/User');
const Post = require('../entity/Post');

//Import de la librarie node qui permet de gerer les documents 
const fs = require('fs');

//Import divers
const getRepository = require('typeorm');
const connection = require('typeorm');
//const { request } = require('../../app');

/* !!!!!!! NOT TESTED !!!!!!! */
exports.createPost = (request, response, next) => {
    /* ----------------- à rajouter --------------------
    Integere multer pour le chargement de nouvelles images. Et
    éventuellement faire un resize de ces dernières avant stockage.
    ----------------- à rajouter -------------------- */

    try {
        const postRepo = connection.getRepository("Post");
        const linkUserPostRepo = connection.getRepository("Post&User");

        const post = postRepo.create({
            Post_Comment: request.body.comment,
            Post_Location: request.body.location,
            Post_Picture: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, //Post_Picture: "placeholder.png",
            Post_Creator_ID: request.body.user_id,
            Post_Creator: request.body.user         
        })
        postRepo.save(post)
        .then((postCreated) => {
            console.log(postCreated);

            console.log("linkUserPostRepo existe?");
            console.log(linkUserPostRepo);

            const linkUserPost = linkUserPostRepo.create({
                Post_ID: postCreated.Post_ID,
                User_ID: postCreated.Post_Creator_ID,
            })
            linkUserPostRepo.save(linkUserPost)
        })
        .then((linkUserPost_Created)=>{    
            console.log(linkUserPost_Created);

            response.status(201).json({ message: 'Post créé !' });
        })
        .catch(error => response.status(400).json({ error })); //error.driverError.errno = 1062 -> duplicate entry
    
    } catch (error) {
        response.status(500).json({ error })
    }
};

/* !!!!!!! NOT TESTED !!!!!!! */
exports.getOnePost = (request, response, next) => {
    const postRepo = connection.getRepository("Post");
    postRepo.findOne({ Post_ID: request.body.Post_ID })
    .then((post) => {
        console.log("La publication que l'on souhaite visualiser: ", post);
        if (!post) {
            return response.status(204).json({ error: 'Publication non trouvée' });
        }
        return response.status(200).json({ post });
    })
    .catch(error => response.status(500).json({ error }));
};

exports.getAllPosts = (request, response, next) => {
    const postRepo = connection.getRepository("Post");
    try {
        postRepo.find()
        .then((posts) => {
            return response.status(201).json(posts);
        })
        .catch(error => response.status(401).json(error));
    } catch (error) {
        return response.status(500).json(error);
    }
};

//Variante n°1 : getALLPosts with review = 0 (for Home page)
exports.getAllPostsApproved = (request, response, next) => {
    const postRepo = connection.getRepository("Post");
    try {
        postRepo.find({ where : {Post_Review: "0"}})
        .then((posts) => {
            return response.status(201).json(posts);
        })
        .catch(error => response.status(401).json(error));
    } catch (error) {
        return response.status(500).json(error);
    }
};

//Variante n°2 : getAllPosts with review = 1 (for Admin page)
exports.getAllPostsUnapproved = (request, response, next) => {
    const postRepo = connection.getRepository("Post");
    try {
        postRepo.find({ where : {Post_Review: "1"}})
        .then((posts) => {
            return response.status(201).json(posts);
        })
        .catch(error => response.status(401).json(error));
    } catch (error) {
        return response.status(500).json(error);
    }
};

/* !!!!!!! NOT TESTED !!!!!!! */
exports.getNextPosts = (request, response, next) => {
    const postRepo = connection.getRepository("Post");
    postRepo.find({
        order: {
            Post_Date_published: "ASC"
        },
        skip: 5, //request.params.offset
        take: 10 //request.params.limit
    })
    .then((posts)=> {
        return response.status(201).json({ posts });
    })
    .catch(error => response.status(401).json({ error }));
};

/* !!!!!!! NOT TESTED !!!!!!! */
exports.modifyPost = (request, response, next) => {
    
    const postRepo = connection.getRepository("Post");
    postRepo.findOne({ Post_ID: request.body.Post_ID })
    .then((postToUpdate)=>{
        postToUpdate.Post_Comment = request.body.comment;
        if (req.file) {
            postToUpdate.Post_Picture = "placeholder_New.png"    //`${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        }
        
        postRepo.save(postToUpdate)
        .then(()=>{
            return response.status(201).json({ message: 'Post modifié !'});
        })
        .catch((error) => response.status(400).json({ error }));
    })
    .catch((error) => response.status(500).json({ error }));
};

/* !!!!!!! NOT TESTED !!!!!!! */
exports.deletePost = (request, response, next) => {
    const postRepo = connection.getRepository("Post");
    postRepo.findOne({ Post_ID: request.body.Post_ID })
    .then((post)=>{
        console.log("This post is about to be removed:", post);
        if (!post) {
            return response.status(401).json({ error: 'Publication non trouvée !' });
        }
        postRepo.remove(post)
    })
    .then((deletedPost) => {

        /*------------------------------------------------------------------------------------
        Il manque la suppression de tous les liens entre ID utilisateurs et ID des publications
        ------------------------------------------------------------------------------------*/

        response.status(201).json({ message: 'Publication supprimée avec succes & Post_Id retiré de la liste utilisateur!' });
    })
    .catch(error => response.status(400).json({ error }))
    .catch(error => response.status(500).json({ error }));
};