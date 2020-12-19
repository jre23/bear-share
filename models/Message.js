module.exports = function (sequelize, DataTypes) {
    var Message = sequelize.define("Message", {
        contents: {
            type: DataTypes.TEXT,
            allowNull: false,
            len: [1],
        },
        fromId: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        fromName: {
            type: DataTypes.TEXT,
            allowNull: false,
            len: [1],
        },
    });

    Message.associate = function (models) {
        Message.belongsTo(models.User, {
            foreignKey: {
                name: "toId",
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