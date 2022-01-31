var EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "PostUser", // Will use table name `post` as default behaviour.
    tableName: "Table_PostsUser", // Optional: Provide `tableName` property to override the default behaviour for table name. 
    columns: {
        Link_ID: {
            primary: true,
            generated: "uuid"
        },
        Post_ID: {
            type: "varchar"
        },
        User_ID: {
            type: "varchar"
        },
        Link_Date_created: {
            type: "datetime",
            createDate: true
        }
    }
});