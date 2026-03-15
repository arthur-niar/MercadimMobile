import { useState } from 'react';
import { authService } from '@/services/auth.service';
import { validateEmail, validatePassword } from '@/utils/validation';
import { LoginCredentials } from '@/models';

export const useLoginViewModel = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const clearErrors = () => {
    setEmailError('');
    setPasswordError('');
    setGeneralError('');
    setSuccessMessage('');
  };

  const validateForm = (): boolean => {
    clearErrors();

    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error || '');
      return false;
    }

    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.error || '');
      return false;
    }

    return true;
  };

  const login = async (): Promise<boolean> => {
    if (!validateForm()) {
      return false;
    }

    setLoading(true);

    try {
      const credentials: LoginCredentials = { email, password };
      await authService.login(credentials);
      setSuccessMessage('Login realizado com sucesso!');
      return true;
    } catch (error: any) {
      setGeneralError(error.message || 'Email ou senha incorretos');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    emailError,
    passwordError,
    generalError,
    successMessage,
    loading,
    showPassword,
    login,
    togglePasswordVisibility,
  };
};
