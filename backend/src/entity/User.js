//Import the entity model
const Post = require('../entity/Post');

var EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "User", 
    tableName: "Table_Personnes",
    columns: {
        Person_ID: {
            primary: true,
            generated: "uuid"
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
            default: "profile_icon.png"
        },
        Personnes_Date_created: {
            type: "datetime",
            createDate: true
        },
        Person_ArrayPosts: {
            SimpleColumnType: "simple-array",
            type: "int",
            nullable: true,       
        }
    }
});
