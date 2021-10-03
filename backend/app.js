var express = require('express');
var typeorm = require("typeorm");

const bodyParser = require('body-parser');

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
        require("./src/entity/Category")
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

    app.use((req, res) => {
        res.json({ message: 'Votre requête a bien été reçue !' }); 
    });

})
.catch(function(error) {
    console.log("Error: ", error);
});

module.exports = app;