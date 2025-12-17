const mysql = require("mysql2/promise");


const pool = mysql.createPool({
    host: process.env.DB_IP || "127.0.0.1",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function mysql_get(query, params = []) {
    try {
        const [results] = await pool.execute(query, params);
        return results;
    } catch (err) {
        console.error("MySQL error:", err);
        throw err;
    }
}

async function mysql_set(sql, params = []) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const [results] = await connection.execute(sql, params);
        await connection.commit();
        connection.release();
        return results;
    } catch (err) {
        await connection.rollback();
        connection.release();
        console.error("MySQL transaction error:", err);
        throw err;
    }
}

module.exports = {
    mysql_get,
    mysql_set
};
