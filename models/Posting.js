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
        category: {
            type: DataTypes.STRING,
            defaultValue: "",
        }
    });

    Posting.associate = function (models) {
        // Associating Posting with PostingComment
        Posting.hasMany(models.PostingComment, {
            onDelete: "cascade",
        });
    };

    return Posting;
};