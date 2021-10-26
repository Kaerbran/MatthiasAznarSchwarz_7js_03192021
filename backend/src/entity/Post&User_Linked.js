var EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "Post&User", // Will use table name `post` as default behaviour.
    tableName: "Table_Posts&User", // Optional: Provide `tableName` property to override the default behaviour for table name. 
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