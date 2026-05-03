import React from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, ActivityIndicator, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLoginViewModel } from '@/viewmodels';
import { useTranslation } from '@/hooks/useTranslation';

interface LoginViewProps {
  onLoginSuccess: () => void;
  onForgotPassword: () => void;
  onRegister: () => void; 
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, onForgotPassword, onRegister }) => {
  const viewModel = useLoginViewModel();
  const { t, fontScale } = useTranslation();

  const handleLogin = async () => {
    const success = await viewModel.login();
    if (success) {
      setTimeout(() => {
        onLoginSuccess();
      }, 1500);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#FF662A', '#FCA537']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={{ flex: 1, justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 80, paddingBottom: 40 }}>

            <View style={{ marginBottom: 32 }}>
              <View style={{ alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, paddingHorizontal: 18, paddingVertical: 10, marginBottom: 28, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' }}>
                <Text style={{ color: '#fff', fontSize: 11 * fontScale, fontWeight: '800', letterSpacing: 3 }}>MERCADIM</Text>
              </View>
              <Text style={{ color: '#fff', fontSize: 40 * fontScale, fontWeight: '800', lineHeight: 46, letterSpacing: -1 }}>{t('auth.login.welcomeBack')}</Text>
              <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15 * fontScale, marginTop: 8 }}>{t('auth.login.loginToContinue')}</Text>
            </View>

            <View style={{ backgroundColor: '#fff', borderRadius: 28, padding: 28, shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.2, shadowRadius: 24, elevation: 16 }}>

              {viewModel.generalError ? (
                <View style={{ backgroundColor: '#FEF2F2', borderLeftWidth: 3, borderLeftColor: '#EF4444', borderRadius: 10, padding: 14, marginBottom: 20 }}>
                  <Text style={{ color: '#B91C1C', fontSize: 13 * fontScale, fontWeight: '500' }}>{viewModel.generalError}</Text>
                </View>
              ) : null}

              {viewModel.successMessage ? (
                <View style={{ backgroundColor: '#F0FDF4', borderLeftWidth: 3, borderLeftColor: '#22C55E', borderRadius: 10, padding: 14, marginBottom: 20 }}>
                  <Text style={{ color: '#15803D', fontSize: 13 * fontScale, fontWeight: '500' }}>{viewModel.successMessage}</Text>
                </View>
              ) : null}

              <View style={{ marginBottom: 16 }}>
                <Text style={{ color: '#374151', fontSize: 10 * fontScale, fontWeight: '800', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>{t('auth.login.emailLabel')}</Text>
                <View style={{ backgroundColor: viewModel.emailError ? '#FEF2F2' : '#F9FAFB', borderWidth: 1.5, borderColor: viewModel.emailError ? '#FCA5A5' : '#E5E7EB', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14 }}>
                  <TextInput style={{ color: '#111827', fontSize: 15 * fontScale }} placeholder={t('auth.login.emailPlaceholder')} placeholderTextColor="#9CA3AF" value={viewModel.email} onChangeText={viewModel.setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
                </View>
                {viewModel.emailError ? <Text style={{ color: '#EF4444', fontSize: 12 * fontScale, marginTop: 5, marginLeft: 4 }}>{viewModel.emailError}</Text> : null}
              </View>

              <View style={{ marginBottom: 10 }}>
                <Text style={{ color: '#374151', fontSize: 10 * fontScale, fontWeight: '800', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>{t('auth.login.passwordLabel')}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: viewModel.passwordError ? '#FEF2F2' : '#F9FAFB', borderWidth: 1.5, borderColor: viewModel.passwordError ? '#FCA5A5' : '#E5E7EB', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14 }}>
                  <TextInput style={{ flex: 1, color: '#111827', fontSize: 15 * fontScale }} placeholder={t('auth.login.passwordPlaceholder')} placeholderTextColor="#9CA3AF" value={viewModel.password} onChangeText={viewModel.setPassword} secureTextEntry={!viewModel.showPassword} autoCapitalize="none" />
                  <TouchableOpacity onPress={viewModel.togglePasswordVisibility}>
                    <Text style={{ color: '#FF662A', fontSize: 13 * fontScale, fontWeight: '600' }}>{viewModel.showPassword ? t('auth.login.hide') : t('auth.login.show')}</Text>
                  </TouchableOpacity>
                </View>
                {viewModel.passwordError ? <Text style={{ color: '#EF4444', fontSize: 12 * fontScale, marginTop: 5, marginLeft: 4 }}>{viewModel.passwordError}</Text> : null}
              </View>

              <TouchableOpacity onPress={onForgotPassword} style={{ alignSelf: 'flex-end', marginBottom: 24 }}>
                <Text style={{ color: '#FF662A', fontSize: 13 * fontScale, fontWeight: '600' }}>{t('auth.login.forgotPassword')}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleLogin} disabled={viewModel.loading} activeOpacity={0.85} style={{ opacity: viewModel.loading ? 0.65 : 1 }}>
                <LinearGradient colors={['#FCA537', '#FF662A']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ borderRadius: 14, paddingVertical: 17, alignItems: 'center', justifyContent: 'center' }}>
                  {viewModel.loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={{ color: '#fff', fontSize: 16 * fontScale, fontWeight: '700', letterSpacing: 0.5 }}>{t('auth.login.signIn')}</Text>}

                </LinearGradient>
              </TouchableOpacity>

              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 28, marginBottom: 20 }}>
                <View style={{ flex: 1, height: 1, backgroundColor: '#E5E7EB' }} />
                <Text style={{ color: '#9CA3AF', fontSize: 13 * fontScale, marginHorizontal: 12 }}>{t('auth.login.or')}</Text>
                <View style={{ flex: 1, height: 1, backgroundColor: '#E5E7EB' }} />
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Text style={{ color: '#6B7280', fontSize: 14 * fontScale }}>{t('auth.login.makeYour')}</Text>
                <TouchableOpacity onPress={onRegister}>
                  <Text style={{ color: '#FF662A', fontSize: 14 * fontScale, fontWeight: '700' }}>{t('auth.login.register')}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ alignItems: 'center', marginTop: 28 }}>
              <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 * fontScale }}>© Mercadim 2026</Text>
            </View>

          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};