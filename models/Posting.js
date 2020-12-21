// This creates the Posting model using sequelize ORM. 
// The columns include title, description, category, image_paths, ask_price.
// This table is used for the posting system that allows users to post their bears.
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
    // This table is associated with the PostingComment model under the foreign key postingId,
    // Message model under the foreign key productId,
    // User model under the foreign key userId.
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