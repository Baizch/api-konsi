export const translationMap: { [key: string]: string } = {
  'Credenciais inválidas': 'Invalid credentials',
  'CPF inválido ou inexistente': 'CPF is invalid or does not exist',
  'Token inválido': 'Invalid token',
  'Token expirado': 'Expired token',
};

export const translateMessage = (message: string): string => {
  return translationMap[message] || message;
};
