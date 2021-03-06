//Import the entity model
const User = require('../entity/User');
const Post = require('../entity/Post');
const PostUser = require('../entity/PostUser_Linked');

//Import de la librarie node qui permet de gerer les documents 
const fs = require('fs');

//Import divers
const getRepository = require('typeorm');
const connection = require('typeorm');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const validateSchema = require('../entity/password');
const { request } = require('express');
const { response } = require('../../app');

exports.showAll = (request, response, next) => {

    /* ---------------------------------------
            Ce controller est a supprimer, ou limiter. Puisque
            dangereuse pour la sécurité de l'application
    --------------------------------------- */

    try {

        const userRepo = connection.getRepository("User");

        userRepo.find()
        .then((user) => {
            return response.status(201).json({ user });
        })
        .catch(error => response.status(401).json({ error }));
    } catch (error) {
        return response.status(500).json({error});
    }
};

exports.showOne = (request, response, next) => {

    try {
        const userRepo = connection.getRepository("User");

        userRepo.findOne({ Person_ID: request.body.post_creator_id })
        .then((user) => {
            return response.status(201).json(user);
        })
        .catch((error) => {
            return response.status(401).json({ error })
        });

    } catch (error) {
        return response.status(500).json({error});
    }

};

exports.signup = (request, response, next) => {
    
    const userRepo = connection.getRepository("User");
    bcrypt.hash(request.body.password, 10)
    .then((hash) => {
        if (validateSchema.validate(request.body.password)) {
            const user = userRepo.create({
                Person_Login: request.body.login,
                Person_Email: request.body.email.toString().toLowerCase(),
                Person_Name: request.body.name,
                Person_Picture: "profile_icon.png",
                Person_Password: hash
            })
            userRepo.save(user)
            .then(() => response.status(201).json({ message: 'Utilisateur créé !' }))
            .catch(error => response.status(400).json({ error })); //error.driverError.errno = 1062 -> duplicate entry
        } else {
            response.status(400).json(validateSchema.validate(request.body.password, { list: true }))
        }
    })
    .catch(error => {
        response.status(500).json({ error })
    }); 
};

exports.modify = (request, response, next) => {

    console.log("request for profile change:");
    console.log(request);

    const userRepo = connection.getRepository("User");
    userRepo.findOne({ Person_Email: request.body.user_email })
    .then((userToUpdate)=>{
        userToUpdate.Person_Login = request.body.login;
        userToUpdate.Person_Name = request.body.name;

        if (request.file) {
            userToUpdate.Person_Picture = `${request.protocol}://${request.get('host')}/images/${request.file.filename}`
        }
        
        userRepo.save(userToUpdate)
        .then((userUpdated)=>{
            console.log("User updated :");
            console.log(userUpdated);

            response.status(201).json({ 
                userLogin: userUpdated.Person_Login,
                userAdmin: userUpdated.Person_Admin,
                userPicture: userUpdated.Person_Picture,
                userEmail: userUpdated.Person_Email,
                userId: userUpdated.Person_ID,
                userName : userUpdated.Person_Name,
                message: 'User modifié !'
            });
        })
        .catch((error) => response.status(400).json(error));
    })
    .catch((error) => response.status(500).json(error));
    
};
  
exports.login = (request, response, next) => {
    
    const userRepo = connection.getRepository("User");
    userRepo.findOne({ Person_Email: request.body.user_email.toString().toLowerCase() })
    .then((user) => {
        console.log("User that logged in: ", user);
        if (!user) {
            return response.status(204).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(request.body.password, user.Person_Password)
        .then(valid => {
            if (!valid) {
            return response.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            response.status(200).json({
                userId: user.Person_ID,
                token: jwt.sign(
                    { userId: user.Person_ID },
                    'RANDOM_TOKEN_SECRET',
                    { expiresIn: '24h' }
                ),
                userLogin: user.Person_Login,
                userAdmin: user.Person_Admin,
                userEmail: user.Person_Email,
                userPicture: user.Person_Picture,
                userName : user.Person_Name
            }); 
        })
        .catch(error => response.status(500).json({ error }));
    })
    .catch(error => response.status(500).json({ error }));
};


exports.deleteTest = (request, response, next) => {

    const postRepo = connection.getRepository("Post");
    const linkUserPostRepo = connection.getRepository("PostUser");
    
    linkUserPostRepo.find({
        where : {User_ID: request.body.Person_ID}
    })
    .then((postsLinked) => {
        try {

            console.log("test1 :");
            console.log(postsLinked);

            console.log("test3 :");
            Object.keys(postsLinked).forEach(function(key) {

                console.log(postsLinked[key].Post_ID);
                console.log(postsLinked[key].Link_ID);
              
            });

        } catch (error) {
            response.status(500).json({ error });
        }
        

        response.status(201).json({ message: 'Utilisateur supprimé avec succes!' });
    })
    .catch(response.status(400).json({ error: 'Erreur interne' }));
}

exports.delete = (request, response, next) => {

    /*Fonction supplémentaire à coder : avant de supprimer un utilisateur, il faut 
    penser à supprimer tous les posts que l'utilisateur à crée*/

    console.log(response.body);

    const userRepo = connection.getRepository("User");
    const postRepo = connection.getRepository("Post");

    //Step n°1 : deletion of the person
    userRepo.findOne({ Person_ID: request.body.User_ID })
    .then((user) => {
        console.log("This user is about to be removed:", user);
        if (!user) {
            return response.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        userRepo.remove(user)
    })
    .then(() => {
        console.log("The folowing user has been removed:");
        console.log(request.body.User_ID);
    })
    .catch(error => {return response.status(400).json({ message: 'Erreur interne', error })});

    //Step n°2 : deletion of all the posts, linked to the previously deleted person
    postRepo.find({
        where : {Post_Creator_ID: request.body.User_ID}
    })
    .then((postsToRemove) => {
        console.log("The following posts are about to be removed:");
        console.log(postsToRemove);

        postRepo.remove(postsToRemove)
        .then(() => response.status(200).json({ message: 'Utilisateur et posts supprimés avec succes!'}))
        .catch(error => response.status(400).json({ error }));
    })
    .catch(error => {return response.status(500).json({ message: 'Erreur interne', error })});
};
