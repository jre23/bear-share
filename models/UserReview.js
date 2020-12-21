// This creates the UserReview model using sequelize ORM. 
// The columns include comment, and fromName.
// This table is used to store user reviews about other users.
module.exports = function (sequelize, DataTypes) {
    var UserReview = sequelize.define("UserReview", {
        comment: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: [1],
            },
        },
        fromName: {
            type: DataTypes.TEXT,
            allowNull: false,
            len: [1],
        }
    });
    // This table is associated with the User model under the foreign key reviewerId,
    // User model under the foreign key userReviewedId.
    UserReview.associate = function (models) {
        UserReview.belongsTo(models.User, {
            foreignKey: {
                name: "reviewerId",
            },
            onDelete: "cascade",
        });

        UserReview.belongsTo(models.User, {
            foreignKey: {
                name: "userReviewedId",
            },
            onDelete: "cascade",
        });
    };
    return UserReview;
};
