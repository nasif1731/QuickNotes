import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

const redisHost = process.env.REDIS_URL || `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;

const redisClient = createClient({
  url: redisHost,
});


redisClient.on('error', (err) => console.error('Redis Client Error:', err));

export default redisClient;