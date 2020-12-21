// This allows you to use the .env file.
require('dotenv').config()
// This sets up the different enviorment connections for development, test, and production.
module.exports = {
        "development": {
          "username": "root",
          "password": process.env.DATABASE_PASSWORD,
          "database": "bear_share_DB",
          "host": "127.0.0.1",
          "dialect": "mysql"
        },
        "test": {
          "username": "root",
          "password": null,
          "database": "database_test",
          "host": "127.0.0.1",
          "dialect": "mysql"
        },
        "production": {
          "use_env_variable": "JAWSDB_URL",
          "dialect": "mysql"
        }
}
      
