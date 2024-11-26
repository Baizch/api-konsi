import { Request, Response } from 'express';
import { generateNewToken } from '../utils/token-manager';
import { translateMessage } from '../utils/translate-messages';

export const generateToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({
        success: false,
        message: 'Username and password are required.',
      });
      return;
    }

    const tokenResponse = await generateNewToken({ username, password });

    res.status(200).json(tokenResponse);
  } catch (error: any) {
    const observations = error.response?.data?.observations || null;

    const translatedErrorMessage = translateMessage(observations);

    res.status(500).json({
      success: false,
      message:
        'There was an error trying to generate the token. Please try again later.',
      details: translatedErrorMessage,
    });
  }
};
