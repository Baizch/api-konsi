import redisClient from '../config/redis-client';
import axios from 'axios';

interface ApiResponse {
  data: {
    token: string;
    expiresIn: Date;
  };
}

interface GetTokenResponse {
  token: string | null;
  expiresAt: Date | null;
}

const TOKEN_KEY = 'api_token';
const EXPIRY_KEY = 'api_token_expiry';

export const generateNewToken = async (username: string, password: string) => {
  if (!username || !password) {
    throw new Error('Missing username or password!');
  }

  const response = await axios.post<ApiResponse>(
    `${process.env.BASE_URL}/api/v1/token`,
    {
      username,
      password,
    }
  );

  const { token, expiresIn } = response.data.data;

  if (!token) {
    throw new Error('Token not found in response');
  }

  const expiresAt = new Date(expiresIn);
  await setToken(token, expiresAt);

  return { token, expiresAt };
};

export const setToken = async (token: string, expiresAt: Date) => {
  await redisClient.set(TOKEN_KEY, token);
  await redisClient.set(EXPIRY_KEY, expiresAt.toISOString());
};

export const getToken = async (): Promise<GetTokenResponse> => {
  const token = await redisClient.get(TOKEN_KEY);
  const expiry = await redisClient.get(EXPIRY_KEY);

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
