// This creates the PostingComment model using sequelize ORM. 
// The column includes comment.
// This table is used for the adding comments on the product page of individual bear posts.
module.exports = function (sequelize, DataTypes) {
    var PostingComment = sequelize.define("PostingComment", {
        comment: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: [1],
            },
        },
    });
    // This table is associated with the User model under the foreign key commenterId,
    // Posting model under the foreign key postingId.
    PostingComment.associate = function (models) {
        PostingComment.belongsTo(models.User, {
            foreignKey: {
                name: "commenterId",
            },
            onDelete: "cascade",
        });
        PostingComment.belongsTo(models.Posting, {
            foreignKey: {
                name: "postingId",
            },
            onDelete: "cascade",
        });
    };
    return PostingComment;
};