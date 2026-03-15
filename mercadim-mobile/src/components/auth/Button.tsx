import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ 
  title, 
  loading = false, 
  variant = 'primary',
  disabled,
  ...props 
}) => {
  const isPrimary = variant === 'primary';
  
  return (
    <TouchableOpacity
      {...props}
      disabled={disabled || loading}
      className={`py-4 rounded-lg items-center justify-center ${
        isPrimary ? 'bg-primary' : 'bg-transparent border border-primary'
      } ${(disabled || loading) ? 'opacity-50' : ''}`}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? '#FFFFFF' : '#FF9F43'} />
      ) : (
        <Text className={`font-semibold text-base ${
          isPrimary ? 'text-white' : 'text-primary'
        }`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
