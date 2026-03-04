
// Responsabilidade: Lógica pura, formatação e validações.
// Inputs: Dados brutos | Outputs: Dados formatados/validados.

export const formatPhone = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 11) {
    return numbers.replace(/^(\d{2})(\d)/g, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
  }
  return numbers.slice(0, 11).replace(/^(\d{2})(\d)/g, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
};

export const formatCPF = (value: string): string => {
  return value.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').replace(/(-\d{2})\d+?$/, '$1');
};

export const calculateAge = (birthDate: string): number => {
  if (!birthDate) return 0;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

export const validateWhatsapp = (value: string): boolean => {
  return /^\(\d{2}\) \d{5}-\d{4}$/.test(value);
};

export const getStaleStatus = (requests: any[]): boolean => {
  const now = new Date();
  return requests.some(req => {
    if (req.status !== 'em_oracao') return false;
    const diffDays = (now.getTime() - new Date(req.createdAt).getTime()) / (1000 * 3600 * 24);
    return diffDays >= 3;
  });
};
