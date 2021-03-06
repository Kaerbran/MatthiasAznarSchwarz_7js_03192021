//Import the entity model
const User = require('../entity/User');
const Post = require('../entity/Post');
const PostUser = require('../entity/PostUser_Linked');

//Import de la librarie node qui permet de gerer les documents 
const fs = require('fs');

//Import divers
const getRepository = require('typeorm');
const connection = require('typeorm');
const { request } = require('express');
const { response, post } = require('../../app');
//const { request } = require('../../app');

/* !!!!!!! NOT TESTED !!!!!!! */
exports.createPost = (request, response, next) => {

    try {
        const postRepo = connection.getRepository("Post");
        const linkUserPostRepo = connection.getRepository("PostUser");

        const post = postRepo.create({
            Post_Comment: request.body.comment,
            Post_Location: request.body.location,
            Post_Picture: `${request.protocol}://${request.get('host')}/images/${request.file.filename}`, //Post_Picture: "placeholder.png",
            Post_PictureName: `${request.file.filename}`,
            Post_Creator_ID: request.body.user_id,
            Post_Creator: request.body.user         
        })
        postRepo.save(post)
        .then((postCreated) => {
            console.log(postCreated);

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
/*
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
};*/

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
        postRepo.find({ 
            where : {
                Post_Review: "0"
            }}
        )
        .then((posts) => {
            return response.status(201).json(posts);
        })
        .catch(error => response.status(401).json(error));
    } catch (error) {
        return response.status(500).json(error);
    }
};

//Variante n°1 - optimisation : getALLPosts with review = 0 (for Home page)
//NE FONCTIONNE PAS, car il manque la relation 'one to many'
exports.getAllPostsProfileApproved = (request, response, next) => {

    const postRepo = connection.getRepository("Post");
    //const userRepo = connection.getRepository("User");
    try {
        postRepo.find({
            join: {
                alias: "Post",
                leftJoinAndSelect: {
                    User: "Post.Post_Creator_ID"
                },
            }, 
            where: { 
                Post_Review: "0"
            }
        })
        .then((posts) => {
            return response.status(201).json(posts);
        })
        .catch(error => response.status(401).json(error));
    } catch (error) {
        return response.status(500).json(error);
    }
}

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
            //postToUpdate.Post_PictureName = 
        }
        
        postRepo.save(postToUpdate)
        .then(()=>{
            return response.status(201).json({ message: 'Post modifié !'});
        })
        .catch((error) => response.status(400).json({ error }));
    })
    .catch((error) => response.status(500).json({ error }));
};

//Post_Review -> with default value at '0'
//0: okay for display     
//1: review is needed before showing post
exports.reviewPost = (request, response, next) => {
    
    const postRepo = connection.getRepository("Post");
    console.log("0");
    console.log(request);
    postRepo.findOne({ Post_ID: request.body.Post_ID })
    .then((postToUpdate) => {
        console.log("1");
        console.log(postToUpdate);
        postToUpdate.Post_Review = request.body.reviewStatus;   //review status = 1 ou 0
        postRepo.save(postToUpdate)
    })
    .then((postUpdated) =>{
        console.log("2");
        return response.status(201).json({ 
            message: 'Post modifié !', 
            post: postUpdated});
    }).catch(error => response.status(500).json(error));
}

/* !!!!!!! NOT TESTED !!!!!!! */
exports.deletePost = (request, response, next) => {
    
    const postRepo = connection.getRepository("Post");
    const linkUserPostRepo = connection.getRepository("PostUser");
    
    postRepo.findOne({ Post_ID: request.body.Post_ID })
    .then((post)=>{
        console.log("This post is about to be removed:", post);
        if (!post) {
            return response.status(401).json({ error: 'Publication non trouvée !' });
        }
        postRepo.remove(post)
    })
    .then((deletedPost) => {

        let path = `./images/${deletedPost.Post_PictureName}`;

        //suppression de la photo qui est stocké dans le serveur
        fs.unlink(path, (err) => {
            if (err) {
                console.log(err);
                return response.status(401).json({ error: 'Photo déjà supprimée !' });
            }
        })
        
        linkUserPostRepo.findOne({ Post_ID: request.body.Post_ID })
    })
    .then((link) => {
        response.status(201).json({ message: 'Publication supprimée avec succes & Post_Id retiré de la liste utilisateur!' });
    })
    .catch(error => response.status(400).json({ error }));
};