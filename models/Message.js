module.exports = function (sequelize, DataTypes) {
    var Message = sequelize.define("Message", {
        contents: {
            type: DataTypes.TEXT,
            allowNull: false,
            len: [1],
        },
        toId: {
            type: DataTypes.STRING,
            allowNull: false,
            len: [1],
        }
    });

    return Message;
};