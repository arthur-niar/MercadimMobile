import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  isPassword?: boolean;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  isPassword = false,
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="mb-4">
      {label && (
        <Text className="text-text-primary font-medium mb-2">{label}</Text>
      )}
      <View className="relative">
        <TextInput
          {...props}
          secureTextEntry={isPassword && !showPassword}
          className={`bg-white border ${
            error ? 'border-text-error' : 'border-gray-300'
          } rounded-lg px-4 py-3 text-text-primary`}
          placeholderTextColor="#95A5A6"
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-3"
          >
            <Text className="text-text-secondary">
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text className="text-text-error text-sm mt-1">{error}</Text>
      )}
    </View>
  );
};
