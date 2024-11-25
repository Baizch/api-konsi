import { Request, Response } from 'express';
import { generateNewToken } from '../utils/token-manager';

interface ApiResponse {
  data: {
    token: string;
    expiresIn: Date;
  };
}

export const generateToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, password } = req.body;

    const { token } = await generateNewToken(username, password);

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({
      message:
        'There was an error trying to generate the token. Please try again later',
      error: error,
    });
  }
};
