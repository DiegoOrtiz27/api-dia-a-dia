const mysql = require('promise-mysql');
import config from "../config.mjs";

const connection = mysql.createConnection({
    host: config.host,
    database: config.database,
    user: config.user,
    password: config.password
});

const getConnection = () => {
    return connection;
};

module.exports = {
    getConnection
};