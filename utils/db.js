const mysql = require('mysql2/promise');  // 使用 promise 版本

const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'admin123',
    database: 'my_db_01',
})


module.exports = db