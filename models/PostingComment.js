'use strict';

const User = require("./User");

module.exports = function (sequelize, DataTypes) {
    var PostingComment = sequelize.define("PostingComment", {
        comment: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: [1],
            },
        }
    },
    );

    PostingComment.associate = function (models) {
        // Associating PostingComment with User
        PostingComment.belongsTo(models.User, {
            onDelete: "cascade",
        });
    };

    return PostingComment;
};
