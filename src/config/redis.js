import { createClient } from 'redis';
import { config } from './default.config.js';
import './loadEnv.js';

const redisClient = createClient({
    socket: {
        host: config.redis.host,
        port: config.redis.port,
    },
});

// Connect the client
redisClient.connect()
    .then(() => console.log('Connected to Redis'))
    .catch((err) => console.error('Redis connection error:', err));

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});


export const getCache = async (key) => await redisClient.get(key);
export const setCache = async (key, expiration, value) => await redisClient.setEx(key, expiration, value); //cache for 3 mins
export const clearCache = async (key) => await redisClient.del(key);

export default redisClient;