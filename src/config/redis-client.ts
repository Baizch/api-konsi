import { createClient } from 'redis';

const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST || 'redis'}:${
    process.env.REDIS_PORT || 6379
  }`,
});

redisClient.on('error', (error) => {
  console.error('Redis Client Error:', error);
});

redisClient.connect();

export default redisClient;
