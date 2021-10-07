//Import the entity model
const User = require('../entity/User');
const Post = require('../entity/Post');

//Import divers
const getRepository = require('typeorm');
const connection = require('typeorm');

/* ----------------------------------------------
                NOT TESTED YET
---------------------------------------------- */

exports.createPost = (req, res, next) => {
    
    const postRepo = connection.getRepository("Post");
    const post = postRepo.create({
        Post_Comment: request.body.comment,
        Post_Location: request.body.location,
        Post_Picture: "placeholder"
        })
    userRepo.save(post)
    .then(() => response.status(201).json({ message: 'Post créé !' }))
    .catch(error => response.status(400).json({ error })); //error.driverError.errno = 1062 -> duplicate entry
};

exports.getAllPosts = (req, res, next) => {
    const postRepo = connection.getRepository("Post");
    try {
        postRepo.find()
        .then((post) => {
            return response.status(201).json({ post });
        })
        .catch(error => response.status(401).json({ error }));
    } catch (error) {
        return response.status(500).json({error});
    }
};

exports.getNextPosts = (req, res, next) => {
    /* ---------------------------------------
            Parametre d'entree : 
            -> :limit -> incrément (10 par 10 par exemple)
            -> :offset -> n° de la page

            Permet de ne pas télécharger toute la base de données. Mais au
            contraire, juste page par page.
    --------------------------------------- */

    const postRepo = connection.getRepository("Post");
    postRepo.find({
        order: {
            columnName: "Post_Date_published"
        },
        skip: 5,
        take: 10
    })
    .then()
    .catch();
};

exports.getOnePost = (req, res, next) => {
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

exports.modifyPost = (req, res, next) => {
    /*const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => {
        res.status(201).json({
        message: 'Sauce updated successfully!'
        });
    })
    .catch((error) => {
        res.status(400).json({
        error: error
        });
    });*/
};

exports.deletePost = (req, res, next) => {
    const postRepo = connection.getRepository("Post");
    postRepo.findOne({ Post_ID: request.body.Post_ID })
    .then((post)=>{
        console.log("This post is about to be removed:", post);
        if (!post) {
            return response.status(401).json({ error: 'Publication non trouvée !' });
        }
        postRepo.remove(post)
        .then(() => response.status(201).json({ message: 'Publication supprimée avec succes!' }))
        .catch(response.status(400).json({ error: 'Erreur interne' }));

    })
    .catch(error => response.status(500).json({ error }));
};
