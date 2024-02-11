// Database connection
const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
});

db.connect((err) => {
    if (err) return console.log(err.stack);

    console.log("connected successfully", db.threadId);
});

module.exports = db.promise();