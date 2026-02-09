const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'abhay',
    database: 'node_complete',
    password: 'put_passworld'
});

module.exports = pool.promise();
