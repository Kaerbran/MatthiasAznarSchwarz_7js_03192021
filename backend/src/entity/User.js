//Import the entity model
const Post = require('../entity/Post');

var EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "User", 
    tableName: "Table_Personnes",
    columns: {
        Person_ID: {
            primary: true,
            type: "int",   //uuid
            generated: true
        },
        Person_Email: {
            type: "varchar",
            lenght : 150,
            unique : true
        },
        Person_Login: {
            type: "varchar",
            lenght : 30
        },
        Person_Password: {
            type: "varchar",
            lenght : 150
        },
        Person_Picture: {
            type: "varchar",
            lenght : 150,
            default: "profile.png"
        }
    },
    relations: {
        Table_Posts: {
            target: "Post", 
            type: "one-to-many",
            joinTable: true,
            cascade: true,
            //Post: Post[];
        }
    }
});
