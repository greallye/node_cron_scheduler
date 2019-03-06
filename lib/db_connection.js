var Sequelize = require('sequelize');

const dbConnection = {
    // Create connections to sqlite db
    createDbConnection(database, username, password, host, dialect) {
        return new Sequelize(database, username, password, {
            host: host,
            dialect: dialect,
            logging: false,
            operatorsAliases: false,
            storage: './configDb.sqlite3'
        });
    }
    
}

module.exports = dbConnection;