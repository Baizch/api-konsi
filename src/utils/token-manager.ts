import redisClient from '../config/redis-client';
import axios from 'axios';

interface ExternalApiResponse {
  success: boolean;
  data: {
    token: string;
    type: string;
    expiresIn: string;
  };
}

interface GetTokenResponse {
  token: string | null;
  expiresAt: Date | null;
}

const TOKEN_KEY = 'api_token';
const EXPIRY_KEY = 'api_token_expiry';

export const generateNewToken = async (credentials: {
  username: string;
  password: string;
}): Promise<ExternalApiResponse> => {
  const { username, password } = credentials;

  if (!username || !password) {
    throw new Error('Missing username or password!');
  }

  const response = await axios.post<ExternalApiResponse>(
    `${process.env.BASE_URL}/api/v1/token`,
    { username, password }
  );

  const { success, data } = response.data;

  if (!success || !data.token) {
    throw new Error('Failed to generate token from external API.');
  }

  const expiresAt = new Date(data.expiresIn);
  await setToken(data.token, expiresAt);

  return response.data;
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
