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

    return PostingComment;
};
