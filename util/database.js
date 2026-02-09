const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'abhay',
    database: 'node_complete',
    password: 'pswd'
});

module.exports = pool.promise();