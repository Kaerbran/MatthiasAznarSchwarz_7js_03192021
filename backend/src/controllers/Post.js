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

    console.log(request.body);
    console.log(request.file);

    try {
        const postRepo = connection.getRepository("Post");
        const userRepo = connection.getRepository("User");

        const post = postRepo.create({
            Post_Comment: request.body.comment,
            Post_Location: request.body.location,
            Post_Picture: "placeholder.png",    //`${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            Post_Creator: request.body.user_id
            })
        postRepo.save(post)
        .then((postCreated) => {
            
            console.log(postCreated);

            //on ajoute ici ID_Post à la fiche de l'utilisateur
            userRepo.findOne({ Person_ID: request.body.user_id })
            .then((userToUpdate)=>{
                
                console.log(userToUpdate);
                console.log(userToUpdate.Person_ArrayPosts);
                
                //Ci-dessous : On rajoute le post dans l'array de l'utilisateur
                if (userToUpdate.Person_ArrayPosts === undefined) {
                    userToUpdate.Person_ArrayPosts = [postCreated.Post_ID];
                } else {
                    userToUpdate.Person_ArrayPosts.push(postCreated.Post_ID);
                }
                
                userRepo.save(userToUpdate)
                .then(()=>{
                    //on déclare la création comme étant terminée
                    response.status(201).json({ message: 'Post créé !' });
                })
            })
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

/* !!!!!!! NOT TESTED !!!!!!! */
exports.getAllPosts = (request, response, next) => {
    const postRepo = connection.getRepository("Post");
    try {
        postRepo.find()
        .then((posts) => {
            return response.status(201).json({ posts });
        })
        .catch(error => response.status(401).json({ error }));
    } catch (error) {
        return response.status(500).json({error});
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
        .then((newPost) => {

            //on supprime ici ID_Post qui se trouve dans la fiche de l'utilisateur
            //on ajoute ici ID_Post à la fiche de l'utilisateur
            userRepo.findOne({ Person_ID: request.body.user_id })
            .then((modifiedUser)=>{
                //Ci-dessous : on cherche l'index où se trouve 'Post_ID' et on le supprime de l'array
                const index = modifiedUser.Person_ArrayPosts.indexOf(request.body.Post_ID);
                if (index > -1) {
                    modifiedUser.Person_ArrayPosts.splice(index, 1);
                }

                //Ci-dessous : on met l'utilisateur à jour, suite à la mise à jour de l'array
                userRepo.save(modifiedUser)
                .then(()=>{
                    //on déclare la création comme étant terminée
                    response.status(201).json({ message: 'Publication supprimée avec succes & Post_Id retiré de la liste utilisateur!' });
                })
            })
        })
        .catch(response.status(400).json({ error: 'Erreur interne' }));
    })
    .catch(error => response.status(500).json({ error }));
};