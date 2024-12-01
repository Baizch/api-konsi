import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://redis:6379',
});

redisClient.on('error', (error) => {
  console.error('Redis Client Error:', error);
});

console.log('Connecting to Redis...');

redisClient.connect();

console.log('Connected to Redis successfully!');

export default redisClient;
