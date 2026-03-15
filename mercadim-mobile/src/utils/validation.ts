export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email) {
    return { isValid: false, error: 'Email é obrigatório' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Email inválido' };
  }

  return { isValid: true };
};

export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  if (!password) {
    return { isValid: false, error: 'Senha é obrigatória' };
  }

  if (password.length < 6) {
    return { isValid: false, error: 'Senha deve ter no mínimo 6 caracteres' };
  }

  return { isValid: true };
};

export const validateCode = (code: string): { isValid: boolean; error?: string } => {
  if (!code) {
    return { isValid: false, error: 'Código é obrigatório' };
  }

  if (code.length !== 6) {
    return { isValid: false, error: 'Código deve ter 6 dígitos' };
  }

  if (!/^\d+$/.test(code)) {
    return { isValid: false, error: 'Código deve conter apenas números' };
  }

  return { isValid: true };
};
