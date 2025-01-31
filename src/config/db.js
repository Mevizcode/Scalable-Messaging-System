import pkg from "pg";
import { config } from "./default.config.js";
import './loadEnv.js';

const { Pool } = pkg;

export const pool = new Pool({
    user: config.db.user,
    password: config.db.password,
    host: config.db.host,
    database: config.db.database,
    port: config.db.port,
    pool: {
        max: config.db.retries,
        idleTimeoutMillis: config.db.timeout
    }
});

pool.connect()
    .then(() => {
        console.log("Connected to postgreSQL");
    })
    .catch((error) => {
        console.error("PostgreSQL connection error: ", error.message);
    });
