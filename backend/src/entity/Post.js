var EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "Post", // Will use table name `post` as default behaviour.
    tableName: "Table_Posts", // Optional: Provide `tableName` property to override the default behaviour for table name. 
    columns: {
        Post_ID: {
            primary: true,
            generated: "uuid"
        },
        Post_Picture: {
            type: "varchar"
        },
        Post_Location: {
            type: "varchar",
            lenght : 150
        },
        Post_Date_published: {
            type: "datetime",
            createDate: true
        },
        Post_Date_modified: {
            type: "datetime",
            updateDate: true
        },
        Post_Comment: {
            type: "text"
        },
        Post_Creator: {
            type: "varchar",
        },
        Post_Creator_ID: {
            type: "varchar"
        }
    }
});