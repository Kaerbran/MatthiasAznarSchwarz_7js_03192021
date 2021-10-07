//Import the entity model
const User = require('../entity/User');

var EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "Post", // Will use table name `post` as default behaviour.
    tableName: "Table_Posts", // Optional: Provide `tableName` property to override the default behaviour for table name. 
    columns: {
        Post_ID: {
            primary: true,
            type: "int",    //uuid
            generated: true
        },
        Post_Picture: {
            type: "varchar"
        },
        Post_Location: {
            type: "varchar"
        },
        Post_Date_published: {
            type: "datetime",
            CreateDateColumn : true
        },
        Post_Date_modified: {
            type: "datetime",
            UpdateDateColumn : true
        },
        Post_Comment: {
            type: "text"
        }
    },
    relations: {
        Table_Personnes: {
            target: "User",
            type: "many-to-one",

            joinTable: true,
            cascade: true
        }
    }
});

//type : datetime
// special column -> @CreateDateColumn 
// special column -> @UpdateDateColumn