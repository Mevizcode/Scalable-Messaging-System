import redis from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
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
