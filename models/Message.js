// This creates the Message model using sequelize ORM. 
// The columns include contents, fromId, fromName. 
// This table is used for the message system that allows users to message other users.
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
    // This table is associated with the User model under the foreign key toId, 
    // Posting model under the foreign key productId
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