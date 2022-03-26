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
        Post_PictureName: {
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
            type: "varchar",    //login of the creator
        },
        Post_Creator_ID: {      //id of the creator
            type: "varchar"
        },
        Post_Review: {
            type: "boolean",
            default: "0"        //0: okay for display      1: review is needed before showing post
        }
    }
});