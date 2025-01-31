import { createClient } from 'redis';
import { config } from './default.config.js';
import './loadEnv.js';

const redisClient = createClient({
    host: config.redis.host,
    port: config.redis.port,
});

redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
    console.error('Redis Connection error: ', err);
});

export const getCache = async (key) => await redisClient.get(key);
export const setCache = async (key, value, expiration = 300) => await redisClient.SETEX(key, expiration, value); //cache for 3 mins
export const clearCache = async (key) => await redisClient.del(key);
