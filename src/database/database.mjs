import mysql from "mysql2";
import config from "../config.mjs";

const connection = mysql.createConnection({
    host: config.host,
    database: config.database,
    user: config.user,
    password: config.password
});

export default function getConnection() {
    return connection;
};
