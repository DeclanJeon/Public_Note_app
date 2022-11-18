import mariadb from "mariadb";

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionLimit: 10,
    acquireTimeout: 1000,
    waitForConnections: true,
});

// Connect and check for errors
pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === "PROTOCOL_CONNECTION_LOST") {
            console.error("Database connection lost");
        }

        if (err.code === "ER_CON_COUNT_ERROR") {
            console.error("Database has too many connection");
        }

        if (err.code === "ECONNREFUSED") {
            console.error("database connection was refused");
        }
    }

    try {
        if (connection) {
            connection.release();
            resolve({
                status: "success",
                message: "MariaDB connected.",
                Connection: pool,
            });
        }
    } catch (err) {
        reject({ status: "failed", error: `MariaDB error. ${err}` });
    }

    resolve({ status: "failed", error: "Error connecting to MariaDB." });
});

export default pool;
