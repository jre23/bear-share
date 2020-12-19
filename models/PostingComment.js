"use strict";

const User = require("./User");

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
