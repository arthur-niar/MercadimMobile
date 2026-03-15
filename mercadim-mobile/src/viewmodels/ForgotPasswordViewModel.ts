import { useState } from 'react';
import { authService } from '@/services/auth.service';
import { validateEmail, validateCode, validatePassword } from '@/utils/validation';
import { PasswordResetRequest, PasswordResetVerify } from '@/models';

type Step = 'email' | 'code' | 'success';

export const useForgotPasswordViewModel = () => {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [emailError, setEmailError] = useState('');
  const [codeError, setCodeError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const clearErrors = () => {
    setEmailError('');
    setCodeError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setGeneralError('');
  };

  const requestPasswordReset = async (): Promise<boolean> => {
    clearErrors();

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error || '');
      return false;
    }

    setLoading(true);

    try {
      const data: PasswordResetRequest = { email };
      await authService.requestPasswordReset(data);
      setStep('code');
      return true;
    } catch (error: any) {
      setGeneralError(error.message || 'Email não encontrado');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const verifyResetCode = async (): Promise<boolean> => {
    clearErrors();

    const codeValidation = validateCode(code);
    const passwordValidation = validatePassword(newPassword);

    if (!codeValidation.isValid) {
      setCodeError(codeValidation.error || '');
      return false;
    }

    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.error || '');
      return false;
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('As senhas não coincidem');
      return false;
    }

    setLoading(true);

    try {
      const data: PasswordResetVerify = { email, code, newPassword };
      await authService.verifyResetCode(data);
      setStep('success');
      return true;
    } catch (error: any) {
      setGeneralError(error.message || 'Código inválido ou expirado');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const goBackToEmail = () => {
    setStep('email');
    clearErrors();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return {
    step,
    email,
    setEmail,
    code,
    setCode,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    emailError,
    codeError,
    passwordError,
    confirmPasswordError,
    generalError,
    loading,
    showPassword,
    requestPasswordReset,
    verifyResetCode,
    goBackToEmail,
    togglePasswordVisibility,
  };
};
