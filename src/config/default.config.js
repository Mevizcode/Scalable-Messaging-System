import './loadEnv.js';

const {
    APP_NAME,
    NODE_ENV,
    PORT,
    DB_HOST,
    DB_DATABASE,
    DB_USER,
    DB_PASSWORD,
    DB_PORT,
    DB_MAX_RETRIES,
    DB_TIMEOUT,
    REDIS_HOST,
    REDIS_PORT,
    LOG_LEVEL,
} = process.env;

export const config = {
    app: {
        name: APP_NAME,
        environment: NODE_ENV,
        port: PORT,
    },
    db: {
        host: DB_HOST,
        database: DB_DATABASE,
        user: DB_USER,
        password: DB_PASSWORD,
        port: DB_PORT,
        timeout: DB_TIMEOUT,
        retries: DB_MAX_RETRIES,
    },
    redis: {
        host: REDIS_HOST,
        port: REDIS_PORT,
    },
    logging: {
        level: LOG_LEVEL,
    }
}