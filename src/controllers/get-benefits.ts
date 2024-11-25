import { Request, Response } from 'express';
import axios from 'axios';
import {
  generateNewToken,
  getToken,
  isTokenValid,
  setToken,
} from '../utils/token-manager';

export const getBenefits = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { cpf } = req.query;

  if (!cpf) {
    res.status(400).json({ message: 'CPF is required' });
    return;
  }

  try {
    let { token } = await getToken();

    console.log(token);

    if (!(await isTokenValid())) {
      const { token: newToken } = await generateNewToken(
        process.env.API_USERNAME!,
        process.env.API_PASSWORD!
      );
      token = newToken;
    }

    const response = await axios.get(
      `${process.env.BASE_URL}/api/v1/inss/consulta-beneficios`,
      {
        params: { cpf },
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log(response);

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({
      message:
        'There was an error trying to fetch the benefits. Please try again later.',
      error: error,
    });
  }
};
