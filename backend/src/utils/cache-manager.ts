import redisClient from '../config/redis-client';

export const checkCacheForCpf = async (cpf: string) => {
  const cachedData = await redisClient.get(cpf);
  if (!cachedData) {
    console.log(`No cache found for CPF: ${cpf}`);
  }
  return cachedData ? JSON.parse(cachedData) : null;
};

export const storeInCache = async (cpf: string, data: any) => {
  try {
    await redisClient.set(cpf, JSON.stringify(data));
  } catch (error) {
    console.error(`Error storing data for CPF ${cpf} in cache:`, error);
  }
};

export const isValidCacheData = (data: any): boolean => {
  if (!data || !Array.isArray(data) || data.length === 0) return false;

  return data.every((benefit: any) => {
    return (
      benefit.numeroBeneficio &&
      typeof benefit.numeroBeneficio === 'string' &&
      benefit.codigoTipoBeneficio &&
      typeof benefit.codigoTipoBeneficio === 'string'
    );
  });
};
