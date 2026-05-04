import React from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, ActivityIndicator, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useForgotPasswordViewModel } from '@/viewmodels';
import { useTranslation } from '@/hooks/useTranslation';

interface ForgotPasswordViewProps {
  onBack: () => void;
  onSuccess: () => void;
}

const getFieldLabel = (fontScale: number) => ({
  color: '#374151', fontSize: 10 * fontScale, fontWeight: '800' as const,
  letterSpacing: 1.5, textTransform: 'uppercase' as const, marginBottom: 8,
});
const inputBox = (hasError: boolean) => ({
  backgroundColor: hasError ? '#FEF2F2' : '#F9FAFB',
  borderWidth: 1.5, borderColor: hasError ? '#FCA5A5' : '#E5E7EB',
  borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14,
});
const getInputText = (fontScale: number) => ({ color: '#111827', fontSize: 15 * fontScale });
const getErrText = (fontScale: number) => ({ color: '#EF4444', fontSize: 12 * fontScale, marginTop: 5, marginLeft: 4 });

const GradientButton = ({ onPress, loading, disabled, label, fontScale }: any) => (
  <TouchableOpacity onPress={onPress} disabled={disabled || loading} activeOpacity={0.85} style={{ opacity: (disabled || loading) ? 0.65 : 1 }}>
    <LinearGradient colors={['#FCA537', '#FF662A']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ borderRadius: 14, paddingVertical: 17, alignItems: 'center', justifyContent: 'center' }}>
      {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={{ color: '#fff', fontSize: 16 * fontScale, fontWeight: '700', letterSpacing: 0.5 }}>{label}</Text>}
    </LinearGradient>
  </TouchableOpacity>
);

export const ForgotPasswordView: React.FC<ForgotPasswordViewProps> = ({ onBack, onSuccess }) => {
  const viewModel = useForgotPasswordViewModel();
  const { t, fontScale } = useTranslation();

  const getHeaderText = () => {
    switch (viewModel.step) {
      case 'email': return { title: t('auth.forgotPassword.recoverPassword'), subtitle: t('auth.forgotPassword.enterRegisteredEmail') };
      case 'code': return { title: t('auth.forgotPassword.codeSent'), subtitle: t('auth.forgotPassword.checkInbox') };
      case 'newPassword': return { title: t('auth.forgotPassword.newPassword'), subtitle: t('auth.forgotPassword.createSecurePassword') };
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
      <Text style={{ color: '#111827', fontSize: 22 * fontScale, fontWeight: '800', marginBottom: 6 }}>{t('auth.forgotPassword.recoverPasswordTitle')}</Text>
      <Text style={{ color: '#6B7280', fontSize: 13 * fontScale, marginBottom: 24 }}>{t('auth.forgotPassword.typeEmailToReceiveCode')}</Text>
      {viewModel.generalError ? (
        <View style={{ backgroundColor: '#FEF2F2', borderLeftWidth: 3, borderLeftColor: '#EF4444', borderRadius: 10, padding: 14, marginBottom: 20 }}>
          <Text style={{ color: '#B91C1C', fontSize: 13 * fontScale, fontWeight: '500' }}>{viewModel.generalError}</Text>
        </View>
      ) : null}
      <View style={{ marginBottom: 28 }}>
        <Text style={getFieldLabel(fontScale)}>{t('auth.forgotPassword.emailLabel')}</Text>
        <View style={inputBox(!!viewModel.emailError)}>
          <TextInput style={getInputText(fontScale)} placeholder={t('auth.forgotPassword.emailPlaceholder')} placeholderTextColor="#9CA3AF" value={viewModel.email} onChangeText={viewModel.setEmail} keyboardType="email-address" autoCapitalize="none" />
        </View>
        {viewModel.emailError ? <Text style={getErrText(fontScale)}>{viewModel.emailError}</Text> : null}
      </View>
      <GradientButton onPress={viewModel.requestPasswordReset} loading={viewModel.loading} label={t('auth.forgotPassword.sendCodeBtn')} fontScale={fontScale} />
    </>
  );

  const renderCodeStep = () => (
    <>
      <Text style={{ color: '#111827', fontSize: 22 * fontScale, fontWeight: '800', marginBottom: 6 }}>{t('auth.forgotPassword.enterCode')}</Text>
      <Text style={{ color: '#6B7280', fontSize: 13 * fontScale, marginBottom: 24 }}>
        {t('auth.forgotPassword.codeSentTo')}
        <Text style={{ color: '#FF662A', fontWeight: '600' }}>{viewModel.email}</Text>
      </Text>
      {viewModel.generalError ? (
        <View style={{ backgroundColor: '#FEF2F2', borderLeftWidth: 3, borderLeftColor: '#EF4444', borderRadius: 10, padding: 14, marginBottom: 20 }}>
          <Text style={{ color: '#B91C1C', fontSize: 13 * fontScale, fontWeight: '500' }}>{viewModel.generalError}</Text>
        </View>
      ) : null}
      <View style={{ marginBottom: 28 }}>
        <Text style={getFieldLabel(fontScale)}>{t('auth.forgotPassword.codeLabel')}</Text>
        <View style={inputBox(!!viewModel.codeError)}>
          <TextInput style={{ ...getInputText(fontScale), textAlign: 'center', letterSpacing: 8, fontWeight: '700', fontSize: 22 * fontScale }} placeholder={t('auth.forgotPassword.codePlaceholder')} placeholderTextColor="#D1D5DB" value={viewModel.code} onChangeText={viewModel.setCode} keyboardType="number-pad" maxLength={6} />
        </View>
        {viewModel.codeError ? <Text style={getErrText(fontScale)}>{viewModel.codeError}</Text> : null}
      </View>
      <GradientButton onPress={viewModel.verifyCode} loading={viewModel.loading} label={t('auth.forgotPassword.verifyCodeBtn')} fontScale={fontScale} />
      <TouchableOpacity onPress={viewModel.requestPasswordReset} style={{ paddingVertical: 14, alignItems: 'center' }}>
        <Text style={{ color: '#FF662A', fontSize: 14 * fontScale, fontWeight: '600' }}>{t('auth.forgotPassword.resendCode')}</Text>
      </TouchableOpacity>
    </>
  );

  const renderNewPasswordStep = () => (
    <>
      <Text style={{ color: '#111827', fontSize: 22 * fontScale, fontWeight: '800', marginBottom: 6 }}>{t('auth.forgotPassword.newPasswordTitle')}</Text>
      <Text style={{ color: '#6B7280', fontSize: 13 * fontScale, marginBottom: 24 }}>{t('auth.forgotPassword.createMinChars')}</Text>
      {viewModel.generalError ? (
        <View style={{ backgroundColor: '#FEF2F2', borderLeftWidth: 3, borderLeftColor: '#EF4444', borderRadius: 10, padding: 14, marginBottom: 20 }}>
          <Text style={{ color: '#B91C1C', fontSize: 13 * fontScale, fontWeight: '500' }}>{viewModel.generalError}</Text>
        </View>
      ) : null}
      <View style={{ marginBottom: 16 }}>
        <Text style={getFieldLabel(fontScale)}>{t('auth.forgotPassword.newPasswordLabel')}</Text>
        <View style={{ ...inputBox(!!viewModel.passwordError), flexDirection: 'row', alignItems: 'center' }}>
          <TextInput style={{ ...getInputText(fontScale), flex: 1 }} placeholder={t('auth.forgotPassword.newPasswordPlaceholder')} placeholderTextColor="#9CA3AF" value={viewModel.newPassword} onChangeText={viewModel.setNewPassword} secureTextEntry={!viewModel.showPassword} autoCapitalize="none" />
          <TouchableOpacity onPress={viewModel.togglePasswordVisibility}>
            <Text style={{ color: '#FF662A', fontSize: 13 * fontScale, fontWeight: '600' }}>{viewModel.showPassword ? t('auth.forgotPassword.hide') : t('auth.forgotPassword.show')}</Text>
          </TouchableOpacity>
        </View>
        {viewModel.passwordError ? <Text style={getErrText(fontScale)}>{viewModel.passwordError}</Text> : null}
      </View>
      <View style={{ marginBottom: 28 }}>
        <Text style={getFieldLabel(fontScale)}>{t('auth.forgotPassword.confirmPasswordLabel')}</Text>
        <View style={inputBox(!!viewModel.confirmPasswordError)}>
          <TextInput style={getInputText(fontScale)} placeholder={t('auth.forgotPassword.confirmPasswordPlaceholder')} placeholderTextColor="#9CA3AF" value={viewModel.confirmPassword} onChangeText={viewModel.setConfirmPassword} secureTextEntry={!viewModel.showPassword} autoCapitalize="none" />
        </View>
        {viewModel.confirmPasswordError ? <Text style={getErrText(fontScale)}>{viewModel.confirmPasswordError}</Text> : null}
      </View>
      <GradientButton onPress={viewModel.verifyResetCode} loading={viewModel.loading} label={t('auth.forgotPassword.resetPasswordBtn')} fontScale={fontScale} />
    </>
  );

  const renderSuccessStep = () => (
    <View style={{ alignItems: 'center', paddingVertical: 16 }}>
      <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: '#F0FDF4', alignItems: 'center', justifyContent: 'center', marginBottom: 20, borderWidth: 2, borderColor: '#BBF7D0' }}>
        <Text style={{ fontSize: 36 * fontScale }}>✓</Text>
      </View>
      <Text style={{ color: '#111827', fontSize: 22 * fontScale, fontWeight: '800', marginBottom: 8, textAlign: 'center' }}>{t('auth.forgotPassword.passwordResetComplete')}</Text>
      <Text style={{ color: '#6B7280', fontSize: 14 * fontScale, textAlign: 'center', lineHeight: 22, marginBottom: 32 }}>
        {t('auth.forgotPassword.passwordChangedSuccess')}
      </Text>
      <TouchableOpacity onPress={onSuccess} activeOpacity={0.85} style={{ width: '100%' }}>
        <LinearGradient colors={['#FCA537', '#FF662A']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ borderRadius: 14, paddingVertical: 17, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 16 * fontScale, fontWeight: '700', letterSpacing: 0.5 }}>{t('auth.forgotPassword.loginBtn')}</Text>
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
              <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 22 * fontScale, lineHeight: 24 }}>{t('auth.forgotPassword.back').split(' ')[0]}</Text>
              <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15 * fontScale, fontWeight: '600' }}>{t('auth.forgotPassword.back').split(' ')[1]}</Text>
            </TouchableOpacity>
            <View style={{ alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, paddingHorizontal: 18, paddingVertical: 10, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' }}>
              <Text style={{ color: '#fff', fontSize: 11 * fontScale, fontWeight: '800', letterSpacing: 3 }}>MERCADIM</Text>
            </View>
            {viewModel.step !== 'success' && (
              <>
                <Text style={{ color: '#fff', fontSize: 36 * fontScale, fontWeight: '800', lineHeight: 42, letterSpacing: -0.5, marginBottom: 8 }}>{header.title}</Text>
                <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 * fontScale, marginBottom: 28 }}>{header.subtitle}</Text>
              </>
            )}
            <View style={{ backgroundColor: '#fff', borderRadius: 28, padding: 28, shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.2, shadowRadius: 24, elevation: 16 }}>
              {viewModel.step === 'email' && renderEmailStep()}
              {viewModel.step === 'code' && renderCodeStep()}
              {viewModel.step === 'newPassword' && renderNewPasswordStep()}
              {viewModel.step === 'success' && renderSuccessStep()}
            </View>
            <View style={{ alignItems: 'center', marginTop: 32 }}>
              <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 * fontScale }}>© Mercadim 2026</Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};