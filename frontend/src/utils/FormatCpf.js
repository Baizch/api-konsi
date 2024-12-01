export const FormatCPF = (cpf) => {
  cpf = cpf.replace(/\D/g, '');

  cpf = cpf.slice(0, 11);

  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, (_, p1, p2, p3, p4) =>
    `${p1}.${p2}.${p3}-${p4}`.replace(/-$/, '')
  );
};
