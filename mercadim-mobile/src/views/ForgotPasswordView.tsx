import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useForgotPasswordViewModel } from '@/viewmodels';

interface ForgotPasswordViewProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const ForgotPasswordView: React.FC<ForgotPasswordViewProps> = ({ onBack, onSuccess }) => {
  const viewModel = useForgotPasswordViewModel();

  const renderEmailStep = () => (
    <>
      <View className="items-center mb-8">
        <View className="bg-orange-100 rounded-full p-6 mb-6">
          <View className="w-16 h-16 bg-orange-500 rounded-full items-center justify-center">
            <Text className="text-white text-3xl font-bold">?</Text>
          </View>
        </View>
        <Text className="text-gray-900 text-3xl font-bold mb-3">
          Recuperar senha
        </Text>
        <Text className="text-gray-500 text-center text-base">
          Digite seu email para receber o código
        </Text>
      </View>

      {viewModel.generalError ? (
        <View className="bg-red-50 border-l-4 border-red-500 rounded-xl p-4 mb-6">
          <Text className="text-red-700 font-medium">{viewModel.generalError}</Text>
        </View>
      ) : null}

      <View className="mb-8">
        <Text className="text-gray-700 font-semibold mb-3">Email</Text>
        <View className={`bg-gray-50 border-2 ${viewModel.emailError ? 'border-red-400' : 'border-gray-200'} rounded-2xl px-5 py-4`}>
          <TextInput
            className="text-gray-900 text-base"
            placeholder="seu@email.com"
            placeholderTextColor="#9CA3AF"
            value={viewModel.email}
            onChangeText={viewModel.setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        {viewModel.emailError ? <Text className="text-red-500 text-sm mt-2">{viewModel.emailError}</Text> : null}
      </View>

      <TouchableOpacity
        className={`py-5 rounded-2xl items-center shadow-lg ${viewModel.loading ? 'opacity-60' : ''}`}
        style={{ backgroundColor: '#FF9F43' }}
        onPress={viewModel.requestPasswordReset}
        disabled={viewModel.loading}
        activeOpacity={0.8}
      >
        {viewModel.loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text className="text-white text-lg font-bold">Enviar código</Text>
        )}
      </TouchableOpacity>
    </>
  );

  const renderCodeStep = () => (
    <>
      <View className="items-center mb-8">
        <View className="bg-orange-100 rounded-full p-6 mb-6">
          <View className="w-16 h-16 bg-orange-500 rounded-full items-center justify-center">
            <Text className="text-white text-2xl font-bold">#</Text>
          </View>
        </View>
        <Text className="text-gray-900 text-3xl font-bold mb-3">
          Código enviado
        </Text>
        <Text className="text-gray-500 text-center text-base">
          Enviamos um código para{'\n'}
          <Text className="font-semibold text-orange-600">{viewModel.email}</Text>
        </Text>
      </View>

      {viewModel.generalError ? (
        <View className="bg-red-50 border-l-4 border-red-500 rounded-xl p-4 mb-6">
          <Text className="text-red-700 font-medium">{viewModel.generalError}</Text>
        </View>
      ) : null}

      <View className="mb-5">
        <Text className="text-gray-700 font-semibold mb-3">Código (6 dígitos)</Text>
        <View className={`bg-gray-50 border-2 ${viewModel.codeError ? 'border-red-400' : 'border-gray-200'} rounded-2xl px-5 py-4`}>
          <TextInput
            className="text-gray-900 text-base text-center tracking-widest font-bold"
            placeholder="000000"
            placeholderTextColor="#9CA3AF"
            value={viewModel.code}
            onChangeText={viewModel.setCode}
            keyboardType="number-pad"
            maxLength={6}
          />
        </View>
        {viewModel.codeError ? <Text className="text-red-500 text-sm mt-2">{viewModel.codeError}</Text> : null}
      </View>

      <View className="mb-5">
        <Text className="text-gray-700 font-semibold mb-3">Nova senha</Text>
        <View className={`flex-row items-center bg-gray-50 border-2 ${viewModel.passwordError ? 'border-red-400' : 'border-gray-200'} rounded-2xl px-5 py-4`}>
          <TextInput
            className="flex-1 text-gray-900 text-base"
            placeholder="Sua nova senha"
            placeholderTextColor="#9CA3AF"
            value={viewModel.newPassword}
            onChangeText={viewModel.setNewPassword}
            secureTextEntry={!viewModel.showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={viewModel.togglePasswordVisibility} className="ml-2">
            <Text className="text-gray-400 text-sm font-medium">
              {viewModel.showPassword ? 'Ocultar' : 'Mostrar'}
            </Text>
          </TouchableOpacity>
        </View>
        {viewModel.passwordError ? <Text className="text-red-500 text-sm mt-2">{viewModel.passwordError}</Text> : null}
      </View>

      <View className="mb-8">
        <Text className="text-gray-700 font-semibold mb-3">Confirmar senha</Text>
        <View className={`bg-gray-50 border-2 ${viewModel.confirmPasswordError ? 'border-red-400' : 'border-gray-200'} rounded-2xl px-5 py-4`}>
          <TextInput
            className="text-gray-900 text-base"
            placeholder="Confirme sua senha"
            placeholderTextColor="#9CA3AF"
            value={viewModel.confirmPassword}
            onChangeText={viewModel.setConfirmPassword}
            secureTextEntry={!viewModel.showPassword}
            autoCapitalize="none"
          />
        </View>
        {viewModel.confirmPasswordError ? <Text className="text-red-500 text-sm mt-2">{viewModel.confirmPasswordError}</Text> : null}
      </View>

      <TouchableOpacity
        className={`py-5 rounded-2xl items-center mb-4 shadow-lg ${viewModel.loading ? 'opacity-60' : ''}`}
        style={{ backgroundColor: '#FF9F43' }}
        onPress={viewModel.verifyResetCode}
        disabled={viewModel.loading}
        activeOpacity={0.8}
      >
        {viewModel.loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text className="text-white text-lg font-bold">Redefinir senha</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={viewModel.goBackToEmail}
        className="py-3 items-center"
      >
        <Text className="text-orange-600 font-semibold">Voltar</Text>
      </TouchableOpacity>
    </>
  );

  const renderSuccessStep = () => (
    <>
      <View className="items-center py-10">
        <View className="bg-green-100 rounded-full p-8 mb-8">
          <View className="w-20 h-20 bg-green-500 rounded-full items-center justify-center">
            <Text className="text-white text-4xl font-bold">✓</Text>
          </View>
        </View>
        <Text className="text-gray-900 text-3xl font-bold mb-4">
          Senha redefinida
        </Text>
        <Text className="text-gray-500 text-center text-lg mb-10">
          Sua senha foi alterada com sucesso
        </Text>

        <TouchableOpacity
          className="w-full py-5 rounded-2xl items-center shadow-lg"
          style={{ backgroundColor: '#FF9F43' }}
          onPress={onSuccess}
          activeOpacity={0.8}
        >
          <Text className="text-white text-lg font-bold">Fazer login</Text>
        </TouchableOpacity>
      </View>
    </>
  );

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
            <TouchableOpacity 
              onPress={onBack}
              className="mb-8 flex-row items-center"
            >
              <Text className="text-white text-lg font-semibold">← Voltar</Text>
            </TouchableOpacity>

            <View className="items-center mb-10">
              <Text className="text-white text-5xl font-black">Mercadim</Text>
            </View>

            <View className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
              {viewModel.step === 'email' && renderEmailStep()}
              {viewModel.step === 'code' && renderCodeStep()}
              {viewModel.step === 'success' && renderSuccessStep()}
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};
