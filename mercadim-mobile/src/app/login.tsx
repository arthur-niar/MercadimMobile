import React from 'react';
import { useRouter } from 'expo-router';
import { LoginView } from '@/views';
import { useProfile } from '@/contexts/ProfileContext';

export default function LoginScreen() {
  const router = useRouter();
  const { refreshProfile } = useProfile();

  const handleLoginSuccess = async () => {
    await refreshProfile();
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
