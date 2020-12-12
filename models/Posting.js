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
        image_paths: {
            type: DataTypes.TEXT,
        },
        ask_price: {
            type: DataTypes.INTEGER,
        },
    });

    Posting.associate = function (models) {
        // We're saying that a Posting should belong to an User
        // A Posting can't be created without an User due to the foreign key constraint
        Posting.belongsTo(models.User, {
            foreignKey: {
                allowNull: false,
            },
        });
    };

    return Posting;
};
