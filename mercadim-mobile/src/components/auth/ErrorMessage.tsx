import React from 'react';
import { View, Text } from 'react-native';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;

  return (
    <View className="bg-red-50 border border-text-error rounded-lg p-3 mb-4">
      <Text className="text-text-error text-sm">{message}</Text>
    </View>
  );
};
