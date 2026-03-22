import React from 'react';
import { useRouter } from 'expo-router';
import { LoginView } from '@/views';

export default function LoginScreen() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.replace('/');
  };

  const handleForgotPassword = () => {
    router.push('/forgot-password');
  };

  return (
    <LoginView
      onLoginSuccess={handleLoginSuccess}
      onForgotPassword={handleForgotPassword}
      onRegister={() => router.push('/register')}
    />
  );
}