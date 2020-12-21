// This indicate that the code should be executed in "strict mode".
'use strict';
// Establishing variables that store necessary required dependencies.
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(module.filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};
// Check if the config variable has a env file.
if (config.use_env_variable) {
  // Creates a new instance of Sequelize using the env information.
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  //Else creates a new instance of Sequelize using the config.js information from “development”.
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}
// Synchronously read the contents of the given directory and filter the name of the basde file names of the models folder.
fs
  .readdirSync(__dirname)
  .filter(function (file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  // Loops through the file array and creates new sequelize tables based off the names of each file and stores it as an object in the db variable under model.name.
  .forEach(function (file) {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });
// Adds table associations by creating an array from the object keys in the db variable and for each item in the array check if there is an associate value, 
// if there is then do a sequelize associate method on that index with db as the parameter.
Object.keys(db).forEach(function (modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
// Assign each sequelize instances to the db variable using dot notation and calling it sequelize. 
// Then adding all of Sequelize as an object to the sb variable using dot notation and calling it Sequelize.
db.sequelize = sequelize;
db.Sequelize = Sequelize;
// Export the db object.
module.exports = db;