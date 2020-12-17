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

    return Message;
};