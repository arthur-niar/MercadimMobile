export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email) {
    return { isValid: false, error: 'auth.validation.emailRequired' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'auth.validation.emailInvalid' };
  }

  return { isValid: true };
};

export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  if (!password) {
    return { isValid: false, error: 'auth.validation.passwordRequired' };
  }

  if (password.length < 6) {
    return { isValid: false, error: 'auth.validation.passwordMinLength' };
  }

  return { isValid: true };
};

export const validateCode = (code: string): { isValid: boolean; error?: string } => {
  if (!code) {
    return { isValid: false, error: 'auth.validation.codeRequired' };
  }

  if (code.length !== 6) {
    return { isValid: false, error: 'auth.validation.codeLength' };
  }

  if (!/^\d+$/.test(code)) {
    return { isValid: false, error: 'auth.validation.codeNumeric' };
  }

  return { isValid: true };
};
