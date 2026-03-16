import { useState, useEffect } from "react";
import { authService } from "@/services/auth.service";
import { validateEmail, validatePassword } from "@/utils/validation";
import { RegisterRequest } from "@/models";

export const useRegisterViewModel = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState<'form' | 'verification'>('form');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationCodeError, setVerificationCodeError] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(15);
  const [isCodeExpired, setIsCodeExpired] = useState(false);

  const clearErrors = () => {
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setGeneralError("");
    setSuccessMessage("");
    setVerificationCodeError("");
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'verification' && timeRemaining > 0 && !isCodeExpired) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsCodeExpired(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, isCodeExpired]);

  const validateForm = (): boolean => {
    clearErrors();

    if (!name.trim()) {
      setNameError("Nome é obrigatório");
      return false;
    }

    if (name.trim().length < 3) {
      setNameError("Nome deve ter no mínimo 3 caracteres");
      return false;
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error || "");
      return false;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.error || "");
      return false;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("As senhas não coincidem");
      return false;
    }

    return true;
  };

  const requestVerificationCode = async (): Promise<boolean> => {
    if (!validateForm()) {
      return false;
    }

    setLoading(true);

    try {
      await authService.requestEmailVerification({ email });
      setStep('verification');
      setTimeRemaining(15);
      setIsCodeExpired(false);
      clearErrors();
      return true;
    } catch (error: any) {
      setGeneralError(
        error.message || "Erro ao solicitar código de verificação."
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (): Promise<boolean> => {
    setVerificationCodeError('');

    if (!verificationCode.trim()) {
      setVerificationCodeError('Digite o código recebido no seu email');
      return false;
    }

    if (isCodeExpired) {
      setVerificationCodeError('Código expirado. Solicite um novo código.');
      return false;
    }

    setLoading(true);

    try {
      await authService.verifyEmailCode({
        email,
        code: verificationCode,
      });

      const registerData: RegisterRequest = {
        name,
        email,
        password,
      };
      await authService.cadastro(registerData);
      setSuccessMessage("Cadastro realizado com sucesso!");
      return true;
    } catch (error: any) {
      setVerificationCodeError(
        error.message || "Código inválido ou expirado."
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async (): Promise<boolean> => {
    setLoading(true);
    try {
      await authService.requestEmailVerification({ email });
      setTimeRemaining(15);
      setIsCodeExpired(false);
      setVerificationCode('');
      setVerificationCodeError('');
      return true;
    } catch (error: any) {
      setVerificationCodeError(
        error.message || "Erro ao reenviar código."
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (): Promise<boolean> => {
    if (step === 'form') {
      return requestVerificationCode();
    } else {
      return verifyCode();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    nameError,
    emailError,
    passwordError,
    confirmPasswordError,
    generalError,
    successMessage,
    loading,
    showPassword,
    showConfirmPassword,
    step,
    verificationCode,
    setVerificationCode,
    verificationCodeError,
    timeRemaining,
    isCodeExpired,
    register,
    verifyCode,
    resendCode,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
  };
};
