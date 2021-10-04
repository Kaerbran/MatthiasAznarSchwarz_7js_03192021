//Import the entity model
const User = require('../entity/User');
const Post = require('../entity/Post');

//Import divers
const getRepository = require('typeorm');
const connection = require('typeorm');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const validateSchema = require('../entity/password');

exports.showAll = (request, response, next) => {
    const userRepo = connection.getRepository("User");
    try {
        userRepo.find()
        .then((user) => {
            return response.status(201).json({ user });
        })
        .catch(error => response.status(401).json({ error }));
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
                Person_Picture: "placeholder",
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
  
exports.login = (request, response, next) => {
    
    //Fonction n°1 : donner des droits différents pour certains Webservices. Par exemple la suppression ne peut pas être faite par tout le monde.

    const userRepo = connection.getRepository("User");
    userRepo.findOne({ Person_Email: request.body.user_email.toString().toLowerCase() })
    .then((user) => {
        console.log("User that logged in: ", user);
        if (!user) {
            return response.status(401).json({ error: 'Utilisateur non trouvé !' });
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
                )   
            });
        })
        .catch(error => response.status(500).json({ error }));
    })
    .catch(error => response.status(500).json({ error }));
};

exports.delete = (request, response, next) => {
    
    /*Fonction supplémentaire à coder : avant de supprimer un utilisateur, il faut 
    penser à supprimer tous les posts que l'utilisateur à crée*/

    console.log(request.body);
    console.log(request.params);

    const userRepo = connection.getRepository("User");
    userRepo.findOne({ Person_ID: request.body.User_ID })
    .then((user)=>{
        console.log("This user is about to be removed:", user);
        if (!user) {
            return response.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        userRepo.remove(user)
        .then(() => response.status(201).json({ message: 'Utilisateur supprimé avec succes!' }))
        .catch(response.status(400).json({ error: 'Erreur interne' }));

    })
    .catch(error => response.status(500).json({ error }));
};