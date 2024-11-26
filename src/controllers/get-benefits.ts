import { Request, Response } from 'express';
import axios from 'axios';
import {
  generateNewToken,
  getToken,
  isTokenValid,
  setToken,
} from '../utils/token-manager';
import { translateMessage } from '../utils/translate-messages';

export const getBenefits = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { cpf } = req.query;

  if (!cpf) {
    res.status(400).json({
      success: false,
      message: 'CPF is required.',
    });
    return;
  }

  try {
    let { token } = await getToken();

    if (!(await isTokenValid())) {
      const tokenResponse = await generateNewToken({
        username: process.env.API_USERNAME!,
        password: process.env.API_PASSWORD!,
      });

      const { token, expiresIn } = tokenResponse.data;
      await setToken(token, new Date(expiresIn));
    }

    const response = await axios.get(
      `${process.env.BASE_URL}/api/v1/inss/consulta-beneficios`,
      {
        params: { cpf },
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    res.status(200).json({
      success: true,
      data: response.data.data,
    });
  } catch (error: any) {
    const observations = error.response?.data?.observations || null;

    const translatedMessage = translateMessage(observations);

    res.status(error.response?.status || 500).json({
      success: false,
      message:
        'There was an error trying to fetch the benefits. Please try again later.',
      details: translatedMessage,
    });
  }
};
