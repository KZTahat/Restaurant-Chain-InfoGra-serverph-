// Database connection
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'restaurantchain.mysql.database.azure.com',
    database: 'restaurant',
    user: 'khaled',
    password: 'Admin1234567890',
    port: 3306
});

db.connect((err) => {
    if (err) return console.log(err.stack);

    console.log("connected successfully", db.threadId);
});


module.exports = db.promise();