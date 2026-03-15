import React from 'react';
import { useRouter } from 'expo-router';
import { ForgotPasswordView } from '@/views';

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleSuccess = () => {
    router.replace('/login');
  };

  return (
    <ForgotPasswordView 
      onBack={handleBack}
      onSuccess={handleSuccess}
    />
  );
}
