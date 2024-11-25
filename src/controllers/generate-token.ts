import { Request, Response } from 'express';
import axios from 'axios';

interface ApiResponse {
  data: {
    token: string;
  };
}

export const generateToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, password } = req.body;

    const response = await axios.post<ApiResponse>(
      `${process.env.BASE_URL}/api/v1/token`,
      {
        username,
        password,
      }
    );

    const { token } = response.data.data;

    if (!token) {
      res.status(500).json({
        message: 'Token not found in response. Please try again later.',
      });
      return;
    }

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({
      message:
        'There was an error trying to generate the token. Please try again later',
      error: error,
    });
  }
};
