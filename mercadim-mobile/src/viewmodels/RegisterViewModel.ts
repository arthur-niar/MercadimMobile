import { useState } from 'react';
import { validateEmail, validatePassword, validateCode } from '@/utils/validation';

type RegisterStep = 'credentials' | 'confirmPassword' | 'code' | 'success';

export const useRegisterViewModel = () => {
  const [step, setStep] = useState<RegisterStep>('credentials');

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [code, setCode] = useState('');

  const [emailError, setEmailError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [codeError, setCodeError] = useState('');
  const [generalError, setGeneralError] = useState('');

  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const clearErrors = () => {
    setEmailError('');
    setUsernameError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setCodeError('');
    setGeneralError('');
    setSuccessMessage('');
  };

  const handleEmailAndUsername = async () => {
    clearErrors();

    const emailValidation = validateEmail(email);

    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error || '');
      return;
    }

    if (!username) {
      setUsernameError('Nome de usuário é obrigatório');
      return;
    }

    setStep('confirmPassword');
  };

  const handleConfirmPassword = async () => {
    clearErrors();

    const passwordValidation = validatePassword(password);

    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.error || '');
      return;
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Confirme sua senha');
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('As senhas não coincidem');
      return;
    }

    setStep('code');
  };

  const handleVerifyCode = async () => {
    clearErrors();

    const codeValidation = validateCode(code);

    if (!codeValidation.isValid) {
      setCodeError(codeValidation.error || '');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccessMessage('Conta verificada com sucesso!');
      setStep('success');
    }, 1000);
  };

  const goBack = () => {
    clearErrors();

    if (step === 'confirmPassword') {
      setPassword('');
      setConfirmPassword('');
      setStep('credentials');
    } else if (step === 'code') {
      setCode('');
      setStep('confirmPassword');
    } else if (step === 'success') {
      setStep('code');
    }
  };

  return {
    step,

    email,
    setEmail,
    username,
    setUsername,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    code,
    setCode,

    emailError,
    usernameError,
    passwordError,
    confirmPasswordError,
    codeError,
    generalError,

    successMessage,
    loading,

    handleEmailAndUsername,
    handleConfirmPassword,
    handleVerifyCode,
    goBack,
  };
};