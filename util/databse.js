const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'abhay',
    database: 'node_complete',
    password: '8227'
});

module.exports = pool.promise();