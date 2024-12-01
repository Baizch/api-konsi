import axios from 'axios';
import {
  storeInCache,
  checkCacheForCpf,
  isValidCacheData,
} from '../utils/cache-manager';
import { indexData } from '../config/elasticsearch-client';
import { getToken, isTokenValid, setToken } from '../utils/token-manager';
import { translateMessage } from '../utils/translate-messages';
import { generateTokenService } from './generate-token';

export const getBenefitsService = async (cpf: string) => {
  try {
    const cachedData = await checkCacheForCpf(cpf);

    if (cachedData && isValidCacheData(cachedData)) {
      console.log(`Cache data found for CPF: ${cpf}`);
      console.log('Returnig cached data');
      return cachedData;
    }

    console.log(
      `No valid cache data found for CPF: ${cpf}, fetching from API.`
    );

    let token: string | null = null;

    if (!(await isTokenValid())) {
      console.log('Token is invalid or expired. Generating a new one...');
      const tokenResponse = await generateTokenService({
        username: process.env.API_USERNAME!,
        password: process.env.API_PASSWORD!,
      });

      const { token: newToken, expiresIn } = tokenResponse.data;

      if (!newToken || typeof newToken !== 'string') {
        throw new Error(`Invalid token received: ${newToken}`);
      }

      token = newToken;

      if (!expiresIn || isNaN(new Date(expiresIn).getTime())) {
        throw new Error(`Invalid expiresIn received: ${expiresIn}`);
      }

      console.log('New token generated:', newToken, 'expires in:', expiresIn);
      await setToken(newToken, expiresIn);
    } else {
      const tokenData = await getToken();

      token = tokenData.token;

      console.log('Using cached token:', token);
    }

    if (!token) {
      throw new Error('Token is null or undefined before making the API call.');
    }

    const response = await axios.get(
      `${process.env.BASE_URL}/api/v1/inss/consulta-beneficios`,
      {
        params: { cpf },
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const benefitsData = response.data.data.beneficios || [];

    if (!Array.isArray(benefitsData) || benefitsData.length === 0) {
      console.log(`No data found for CPF: ${cpf}`);
      return null;
    }

    const dataToStore = benefitsData
      .map((benefit: any, index: number) => {
        if (!benefit.numero_beneficio || !benefit.codigo_tipo_beneficio) {
          console.warn(
            `Missing data for benefit at index ${index} for CPF ${cpf}:`,
            benefit
          );
          return null;
        }

        return {
          numero_beneficio: benefit.numero_beneficio,
          codigo_tipo_beneficio: benefit.codigo_tipo_beneficio,
        };
      })
      .filter((item: any) => item !== null);

    if (dataToStore.length === 0) {
      console.log(`No valid data to store for CPF: ${cpf}`);
      return null;
    }

    console.log('Saving data in cache');
    await storeInCache(cpf, dataToStore);
    console.log(`Data for CPF ${cpf} saved in cache.`);

    console.log('Indexing data');
    await indexData('benefits', cpf, { benefits: dataToStore });
    console.log(`Data for CPF ${cpf} indexed successfully.`);

    return dataToStore;
  } catch (error) {
    const observations = error.response?.data?.observations || null;

    const translatedErrorMessage = translateMessage(observations);

    throw new Error(
      `There was an error fetching benefits. Details: ${translatedErrorMessage}`
    );
  }
};
