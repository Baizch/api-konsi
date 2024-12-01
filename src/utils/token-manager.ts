import redisClient from '../config/redis-client';
import { GetTokenResponse } from '../interfaces/api-responses';

export const setToken = async (
  token: string,
  expiresIn: string
): Promise<void | Error> => {
  if (!token || typeof token !== 'string') {
    throw new Error(
      'Invalid token: Cannot save null or undefined token to Redis.'
    );
  }

  const expiresInSeconds = parseInt(expiresIn, 10);

  if (isNaN(expiresInSeconds) || expiresInSeconds <= 0) {
    throw new Error('expiresIn must be a valid number of seconds.');
  }

  const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);

  await redisClient.set(process.env.TOKEN_KEY, token);
  await redisClient.set(process.env.EXPIRY_KEY, expiresAt.toISOString());
};

export const getToken = async (): Promise<GetTokenResponse> => {
  const token = await redisClient.get(process.env.TOKEN_KEY);
  const expiry = await redisClient.get(process.env.EXPIRY_KEY);

  return {
    token,
    expiresAt: expiry ? new Date(expiry) : null,
  };
};

export const isTokenValid = async (): Promise<boolean> => {
  const { token, expiresAt } = await getToken();

  if (!token || !expiresAt) return false;

  return new Date() < expiresAt;
};
