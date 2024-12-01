import { Request, Response } from 'express';
import { generateTokenService } from '../services/generate-token';

export const generateTokenController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, password } = req.body;

    const tokenResponse = await generateTokenService({ username, password });

    res.status(200).json(tokenResponse);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
