const mysql = require('mysql2/promise');
const connectDatabase =  () => {
    const pool = mysql.createPool({
        connectionLimit: 10,
        host : 'localhost',
        user  :'root',
        password : '',  
        database : 'thinktankertask',
        port: 3306
    });
    pool.getConnection()
    .then((connection) => {
        console.log('Database connected successfully');
        connection.release();
    })
    .catch((error) => {
        console.error('Database connection failed:', error);
    });

    pool.on('error', (error) => {
        console.error('Database error:', error);
    });
    return pool;
}
module.exports = { connectDatabase };