import axios from 'axios';
import { translateMessage } from '../utils/translate-messages';
import { ExternalApiResponse } from '../interfaces/api-responses';
import { setToken } from '../utils/token-manager';

export const generateTokenService = async (credentials: {
  username: string;
  password: string;
}) => {
  try {
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

    await setToken(data.token, data.expiresIn);

    return response.data;
  } catch (error: any) {
    const observations = error.response?.data?.observations || null;

    const translatedErrorMessage = translateMessage(observations);

    throw new Error(
      `There was an error generating the token. Details: ${translatedErrorMessage}`
    );
  }
};
