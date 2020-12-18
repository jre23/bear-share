module.exports = function (sequelize, DataTypes) {
    var Posting = sequelize.define("Posting", {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1],
            },
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            len: [1],
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
            len: [1],
        },
        image_paths: {
            type: DataTypes.TEXT,
        },
        ask_price: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    });

    Posting.associate = function (models) {
        // Associating Posting with PostingComment
        Posting.hasMany(models.PostingComment, {
            foreignKey: {
                name: "postingId",
            },
            onDelete: "cascade",
        });
        Posting.hasMany(models.Message, {
            foreignKey: {
                name: "productId",
            },
            onDelete: "cascade",
        });
        Posting.belongsTo(models.User, {
            foreignKey: {
                name: "userId",
            },
            onDelete: "cascade",
        });
    };

    return Posting;
};
