import pkg from "pg";
import dotenv from "dotenv";
const { Pool } = pkg;
dotenv.config();

const pool = new Pool({
    user: 'postgres', //process.env.DB_USER
    password: '000000', //process.env.DB_PASSWORD
    host: 'db', //process.env.DB_HOST
    database: 'messaging_db', //process.env.DB_DATABASE
    port: 5432 //process.env.DB_PORT
});

pool.connect()
    .then(() => {
        console.log("Connected to postgreSQL");
    })
    .catch((error) => {
        console.error("PostgreSQL connection error: ", error.message);
    });

export const queryDb = async (query, values) => {
    try {
        const result = await pool.query(query, values);
        return result.rows;
    } catch (err) {
        console.error('Error executing query:', err);
        throw new Error('Database query failed');
    }
};
