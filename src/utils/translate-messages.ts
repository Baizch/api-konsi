export const translationMap: { [key: string]: string } = {
  'Credenciais inválidas': 'Invalid credentials',
  'CPF inválido ou inexistente': 'Invalid CPF',
};

export const translateMessage = (message: string): string => {
  return translationMap[message] || message;
};
