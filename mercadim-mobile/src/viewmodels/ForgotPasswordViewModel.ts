import { useState } from 'react';
import { authService } from '@/services/auth.service';
import { validateEmail, validateCode, validatePassword } from '@/utils/validation';
import { PasswordResetRequest, PasswordResetVerify } from '@/models';
import { useTranslation } from '@/hooks/useTranslation';

type Step = 'email' | 'code' | 'newPassword' | 'success';

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
  const { t } = useTranslation();

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
      setEmailError(t(emailValidation.error as any));
      return false;
    }
    setLoading(true);
    try {
      const data: PasswordResetRequest = { email };
      await authService.requestPasswordReset(data);
      setStep('code');
      return true;
    } catch (error: any) {
      setGeneralError(error.message || t('auth.messages.emailNotFound'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (): Promise<boolean> => {
    clearErrors();
    const codeValidation = validateCode(code);
    if (!codeValidation.isValid) {
      setCodeError(t(codeValidation.error as any));
      return false;
    }
    setStep('newPassword');
    return true;
  };

  const verifyResetCode = async (): Promise<boolean> => {
    clearErrors();
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      setPasswordError(t(passwordValidation.error as any));
      return false;
    }
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError(t('auth.validation.passwordsDoNotMatch'));
      return false;
    }
    setLoading(true);
    try {
      const data: PasswordResetVerify = { email, code, newPassword };
      await authService.verifyResetCode(data);
      setStep('success');
      return true;
    } catch (error: any) {
      setGeneralError(error.message || t('auth.messages.codeInvalid'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const goBackToEmail = () => { setStep('email'); clearErrors(); };
  const goBackToCode = () => { setStep('code'); clearErrors(); };
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return {
    step, email, setEmail, code, setCode,
    newPassword, setNewPassword, confirmPassword, setConfirmPassword,
    emailError, codeError, passwordError, confirmPasswordError, generalError,
    loading, showPassword,
    requestPasswordReset, verifyCode, verifyResetCode,
    goBackToEmail, goBackToCode, togglePasswordVisibility,
  };
};