module.exports = function (sequelize, DataTypes) {
    var Message = sequelize.define("Message", {
        contents: {
            type: DataTypes.TEXT,
            allowNull: false,
            len: [1],
        },
        toId: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        }
    });

    Message.associate = function (models) {
        Message.belongsTo(models.User, {
            foreignKey: {
                name: "fromId",
            },
            onDelete: "cascade",
        });
        Message.belongsTo(models.Posting, {
            foreignKey: {
            name: "productId",
        },
        onDelete: "cascade",
        });
    };
    return Message;
};