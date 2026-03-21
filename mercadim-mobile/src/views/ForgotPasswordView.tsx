import React from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, ActivityIndicator, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useForgotPasswordViewModel } from '@/viewmodels';

interface ForgotPasswordViewProps {
  onBack: () => void;
  onSuccess: () => void;
}

const fieldLabel = {
  color: '#374151', fontSize: 10, fontWeight: '800' as const,
  letterSpacing: 1.5, textTransform: 'uppercase' as const, marginBottom: 8,
};
const inputBox = (hasError: boolean) => ({
  backgroundColor: hasError ? '#FEF2F2' : '#F9FAFB',
  borderWidth: 1.5, borderColor: hasError ? '#FCA5A5' : '#E5E7EB',
  borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14,
});
const inputText = { color: '#111827', fontSize: 15 };
const errText = { color: '#EF4444', fontSize: 12, marginTop: 5, marginLeft: 4 };

const GradientButton = ({ onPress, loading, disabled, label }: any) => (
  <TouchableOpacity onPress={onPress} disabled={disabled || loading} activeOpacity={0.85} style={{ opacity: (disabled || loading) ? 0.65 : 1 }}>
    <LinearGradient colors={['#FCA537', '#FF662A']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ borderRadius: 14, paddingVertical: 17, alignItems: 'center', justifyContent: 'center' }}>
      {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 }}>{label}</Text>}
    </LinearGradient>
  </TouchableOpacity>
);

export const ForgotPasswordView: React.FC<ForgotPasswordViewProps> = ({ onBack, onSuccess }) => {
  const viewModel = useForgotPasswordViewModel();

  const getHeaderText = () => {
    switch (viewModel.step) {
      case 'email': return { title: 'Recuperar\nsenha.', subtitle: 'Informe o email cadastrado na sua conta' };
      case 'code': return { title: 'Código\nenviado.', subtitle: 'Verifique sua caixa de entrada' };
      case 'newPassword': return { title: 'Nova\nsenha.', subtitle: 'Crie uma senha segura para sua conta' };
      default: return { title: '', subtitle: '' };
    }
  };

  const handleBack = () => {
    if (viewModel.step === 'email') onBack();
    else if (viewModel.step === 'code') viewModel.goBackToEmail();
    else if (viewModel.step === 'newPassword') viewModel.goBackToCode();
    else onBack();
  };

  const renderEmailStep = () => (
    <>
      <Text style={{ color: '#111827', fontSize: 22, fontWeight: '800', marginBottom: 6 }}>Recuperar senha</Text>
      <Text style={{ color: '#6B7280', fontSize: 13, marginBottom: 24 }}>Digite seu email para receber o código</Text>
      {viewModel.generalError ? (
        <View style={{ backgroundColor: '#FEF2F2', borderLeftWidth: 3, borderLeftColor: '#EF4444', borderRadius: 10, padding: 14, marginBottom: 20 }}>
          <Text style={{ color: '#B91C1C', fontSize: 13, fontWeight: '500' }}>{viewModel.generalError}</Text>
        </View>
      ) : null}
      <View style={{ marginBottom: 28 }}>
        <Text style={fieldLabel}>Email</Text>
        <View style={inputBox(!!viewModel.emailError)}>
          <TextInput style={inputText} placeholder="seu@email.com" placeholderTextColor="#9CA3AF" value={viewModel.email} onChangeText={viewModel.setEmail} keyboardType="email-address" autoCapitalize="none" />
        </View>
        {viewModel.emailError ? <Text style={errText}>{viewModel.emailError}</Text> : null}
      </View>
      <GradientButton onPress={viewModel.requestPasswordReset} loading={viewModel.loading} label="Enviar código" />
    </>
  );

  const renderCodeStep = () => (
    <>
      <Text style={{ color: '#111827', fontSize: 22, fontWeight: '800', marginBottom: 6 }}>Digite o código</Text>
      <Text style={{ color: '#6B7280', fontSize: 13, marginBottom: 24 }}>
        Enviamos um código para{' '}
        <Text style={{ color: '#FF662A', fontWeight: '600' }}>{viewModel.email}</Text>
      </Text>
      {viewModel.generalError ? (
        <View style={{ backgroundColor: '#FEF2F2', borderLeftWidth: 3, borderLeftColor: '#EF4444', borderRadius: 10, padding: 14, marginBottom: 20 }}>
          <Text style={{ color: '#B91C1C', fontSize: 13, fontWeight: '500' }}>{viewModel.generalError}</Text>
        </View>
      ) : null}
      <View style={{ marginBottom: 28 }}>
        <Text style={fieldLabel}>Código (6 dígitos)</Text>
        <View style={inputBox(!!viewModel.codeError)}>
          <TextInput style={{ ...inputText, textAlign: 'center', letterSpacing: 8, fontWeight: '700', fontSize: 22 }} placeholder="000000" placeholderTextColor="#D1D5DB" value={viewModel.code} onChangeText={viewModel.setCode} keyboardType="number-pad" maxLength={6} />
        </View>
        {viewModel.codeError ? <Text style={errText}>{viewModel.codeError}</Text> : null}
      </View>
      <GradientButton onPress={viewModel.verifyCode} loading={viewModel.loading} label="Verificar código" />
      <TouchableOpacity onPress={viewModel.requestPasswordReset} style={{ paddingVertical: 14, alignItems: 'center' }}>
        <Text style={{ color: '#FF662A', fontSize: 14, fontWeight: '600' }}>Reenviar código</Text>
      </TouchableOpacity>
    </>
  );

  const renderNewPasswordStep = () => (
    <>
      <Text style={{ color: '#111827', fontSize: 22, fontWeight: '800', marginBottom: 6 }}>Nova senha</Text>
      <Text style={{ color: '#6B7280', fontSize: 13, marginBottom: 24 }}>Crie uma senha com no mínimo 6 caracteres</Text>
      {viewModel.generalError ? (
        <View style={{ backgroundColor: '#FEF2F2', borderLeftWidth: 3, borderLeftColor: '#EF4444', borderRadius: 10, padding: 14, marginBottom: 20 }}>
          <Text style={{ color: '#B91C1C', fontSize: 13, fontWeight: '500' }}>{viewModel.generalError}</Text>
        </View>
      ) : null}
      <View style={{ marginBottom: 16 }}>
        <Text style={fieldLabel}>Nova senha</Text>
        <View style={{ ...inputBox(!!viewModel.passwordError), flexDirection: 'row', alignItems: 'center' }}>
          <TextInput style={{ ...inputText, flex: 1 }} placeholder="Sua nova senha" placeholderTextColor="#9CA3AF" value={viewModel.newPassword} onChangeText={viewModel.setNewPassword} secureTextEntry={!viewModel.showPassword} autoCapitalize="none" />
          <TouchableOpacity onPress={viewModel.togglePasswordVisibility}>
            <Text style={{ color: '#FF662A', fontSize: 13, fontWeight: '600' }}>{viewModel.showPassword ? 'Ocultar' : 'Mostrar'}</Text>
          </TouchableOpacity>
        </View>
        {viewModel.passwordError ? <Text style={errText}>{viewModel.passwordError}</Text> : null}
      </View>
      <View style={{ marginBottom: 28 }}>
        <Text style={fieldLabel}>Confirmar senha</Text>
        <View style={inputBox(!!viewModel.confirmPasswordError)}>
          <TextInput style={inputText} placeholder="Confirme sua senha" placeholderTextColor="#9CA3AF" value={viewModel.confirmPassword} onChangeText={viewModel.setConfirmPassword} secureTextEntry={!viewModel.showPassword} autoCapitalize="none" />
        </View>
        {viewModel.confirmPasswordError ? <Text style={errText}>{viewModel.confirmPasswordError}</Text> : null}
      </View>
      <GradientButton onPress={viewModel.verifyResetCode} loading={viewModel.loading} label="Redefinir senha" />
    </>
  );

  const renderSuccessStep = () => (
    <View style={{ alignItems: 'center', paddingVertical: 16 }}>
      <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: '#F0FDF4', alignItems: 'center', justifyContent: 'center', marginBottom: 20, borderWidth: 2, borderColor: '#BBF7D0' }}>
        <Text style={{ fontSize: 36 }}>✓</Text>
      </View>
      <Text style={{ color: '#111827', fontSize: 22, fontWeight: '800', marginBottom: 8, textAlign: 'center' }}>Senha redefinida!</Text>
      <Text style={{ color: '#6B7280', fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 32 }}>
        Sua senha foi alterada com sucesso.{'\n'}Faça login para continuar.
      </Text>
      <TouchableOpacity onPress={onSuccess} activeOpacity={0.85} style={{ width: '100%' }}>
        <LinearGradient colors={['#FCA537', '#FF662A']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ borderRadius: 14, paddingVertical: 17, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 }}>Fazer login</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const header = getHeaderText();

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#FF662A', '#FCA537']} start={{ x: 0.1, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 64, paddingBottom: 40 }}>
            <TouchableOpacity onPress={handleBack} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 32 }}>
              <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 22, lineHeight: 24 }}>‹</Text>
              <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, fontWeight: '600' }}>Voltar</Text>
            </TouchableOpacity>
            <View style={{ alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, paddingHorizontal: 18, paddingVertical: 10, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' }}>
              <Text style={{ color: '#fff', fontSize: 11, fontWeight: '800', letterSpacing: 3 }}>MERCADIM</Text>
            </View>
            {viewModel.step !== 'success' && (
              <>
                <Text style={{ color: '#fff', fontSize: 36, fontWeight: '800', lineHeight: 42, letterSpacing: -0.5, marginBottom: 8 }}>{header.title}</Text>
                <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 28 }}>{header.subtitle}</Text>
              </>
            )}
            <View style={{ backgroundColor: '#fff', borderRadius: 28, padding: 28, shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.2, shadowRadius: 24, elevation: 16 }}>
              {viewModel.step === 'email' && renderEmailStep()}
              {viewModel.step === 'code' && renderCodeStep()}
              {viewModel.step === 'newPassword' && renderNewPasswordStep()}
              {viewModel.step === 'success' && renderSuccessStep()}
            </View>
            <View style={{ alignItems: 'center', marginTop: 32 }}>
              <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>© Mercadim 2026</Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};