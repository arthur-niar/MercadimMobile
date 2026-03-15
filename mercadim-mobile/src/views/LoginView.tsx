import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLoginViewModel } from '@/viewmodels';

interface LoginViewProps {
  onLoginSuccess: () => void;
  onForgotPassword: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, onForgotPassword }) => {
  const viewModel = useLoginViewModel();

  const handleLogin = async () => {
    const success = await viewModel.login();
    if (success) {
      setTimeout(() => {
        onLoginSuccess();
      }, 1500);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <LinearGradient
        colors={['#FF9F43', '#FF8C1A', '#FF7A00']}
        className="flex-1"
      >
        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 justify-center px-8 py-16">
            <View className="items-center mb-16">
              <View className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 mb-8 shadow-2xl">
                <Text className="text-white text-7xl font-black">M</Text>
              </View>
              <Text className="text-white text-6xl font-black mb-3 tracking-tight drop-shadow-lg">
                Mercadim
              </Text>
              <View className="h-1 w-24 bg-white/30 rounded-full mb-4" />
              <Text className="text-white/95 text-xl font-medium">
                Bem-vindo de volta
              </Text>
            </View>

            <View className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
              <Text className="text-gray-900 text-3xl font-bold mb-2">
                Entrar
              </Text>
              <Text className="text-gray-500 text-base mb-8">
                Acesse sua conta
              </Text>

              {viewModel.generalError ? (
                <View className="bg-red-50 border-l-4 border-red-500 rounded-xl p-4 mb-6">
                  <Text className="text-red-700 font-medium">{viewModel.generalError}</Text>
                </View>
              ) : null}

              {viewModel.successMessage ? (
                <View className="bg-green-50 border-l-4 border-green-500 rounded-xl p-4 mb-6">
                  <Text className="text-green-700 font-medium">{viewModel.successMessage}</Text>
                </View>
              ) : null}

              <View className="mb-5">
                <Text className="text-gray-700 font-semibold mb-3 text-base">
                  Email
                </Text>
                <View className={`bg-gray-50 border-2 ${viewModel.emailError ? 'border-red-400' : 'border-gray-200'} rounded-2xl px-5 py-4 focus:border-orange-500`}>
                  <TextInput
                    className="text-gray-900 text-base"
                    placeholder="seu@email.com"
                    placeholderTextColor="#9CA3AF"
                    value={viewModel.email}
                    onChangeText={viewModel.setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                </View>
                {viewModel.emailError ? (
                  <Text className="text-red-500 text-sm mt-2 ml-1">{viewModel.emailError}</Text>
                ) : null}
              </View>

              <View className="mb-3">
                <Text className="text-gray-700 font-semibold mb-3 text-base">
                  Senha
                </Text>
                <View className={`flex-row items-center bg-gray-50 border-2 ${viewModel.passwordError ? 'border-red-400' : 'border-gray-200'} rounded-2xl px-5 py-4`}>
                  <TextInput
                    className="flex-1 text-gray-900 text-base"
                    placeholder="Sua senha"
                    placeholderTextColor="#9CA3AF"
                    value={viewModel.password}
                    onChangeText={viewModel.setPassword}
                    secureTextEntry={!viewModel.showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity onPress={viewModel.togglePasswordVisibility} className="ml-2">
                    <Text className="text-gray-400 text-sm font-medium">
                      {viewModel.showPassword ? 'Ocultar' : 'Mostrar'}
                    </Text>
                  </TouchableOpacity>
                </View>
                {viewModel.passwordError ? (
                  <Text className="text-red-500 text-sm mt-2 ml-1">{viewModel.passwordError}</Text>
                ) : null}
              </View>

              <TouchableOpacity 
                onPress={onForgotPassword}
                className="mb-8 self-end"
              >
                <Text className="text-black-600 font-semibold text-base">
                  Esqueceu a senha?
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`py-5 rounded-2xl items-center justify-center shadow-lg ${viewModel.loading ? 'opacity-60' : ''}`}
                style={{ backgroundColor: '#FF9F43' }}
                onPress={handleLogin}
                disabled={viewModel.loading}
                activeOpacity={0.8}
              >
                {viewModel.loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text className="text-white text-lg font-bold tracking-wide">
                    Entrar
                  </Text>
                )}
              </TouchableOpacity>

              <View className="mt-8 flex-row items-center justify-center">
                <View className="flex-1 h-px bg-gray-300" />
                <Text className="text-gray-400 text-sm mx-4">Ou</Text>
                <View className="flex-1 h-px bg-gray-300" />
              </View>

              <View className="mt-6 flex-row justify-center">
                <Text className="text-gray-600 text-sm">Realize seu </Text>
                <TouchableOpacity>
                  <Text className="text-orange-500 text-sm font-semibold">cadastro</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="mt-10 items-center">
              <Text className="text-white/60 text-sm">
                Mercadim 2026
              </Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};
