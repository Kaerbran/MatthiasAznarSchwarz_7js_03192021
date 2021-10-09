var express = require('express');
var typeorm = require("typeorm");

const bodyParser = require('body-parser');
const helmet = require('helmet');
const path = require('path');   //nécessaire pour 'multer'

//Importation des routes
const postRoutes = require('./src/routes/post');
const userRoutes = require('./src/routes/user');

const app = express();

typeorm.createConnection({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "backendTypeORM",
    password: "12345",
    database: "groupomania",
    synchronize: true,
    entities: [
        require("./src/entity/Post"),
        require("./src/entity/User")
    ]
})
.then(function (connection) {

    //CROS resolved : permet de donner acces à notre serveur pour tous les origines
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        next();
    });

    //Déclarer comment on souhaite utiliser ces API
    app.use(bodyParser.json());

    //app.use(helmet());
    //app.use('/images', express.static(path.join(__dirname, 'images'))); //pour 'multer'
    //app.use("/api/", rateLimiter.apiLimiter);

    // setup express app here
    app.use('/api/post', postRoutes);
    app.use('/api/auth', userRoutes);

    /*app.use((req, res) => {
        res.json({ message: 'Votre requête a bien été reçue !' }); 
    });*/

})
.catch(function(error) {
    console.log("Error: ", error);
});

module.exports = app;