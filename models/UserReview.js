module.exports = function (sequelize, DataTypes) {
    var UserReview = sequelize.define("UserReview", {
        comment: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: [1],
            },
        },
    });

    UserReview.associate = function (models) {
        // We're saying that a UserReview should belong to an User
        // A UserReview can't be created without an User due to the foreign key constraint
        // UserReview.belongsTo(models.User, { as: "reviewer" });
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
