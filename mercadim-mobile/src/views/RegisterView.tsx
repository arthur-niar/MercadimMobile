import React from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, ActivityIndicator, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRegisterViewModel } from '@/viewmodels';
import { useTranslation } from '@/hooks/useTranslation';

export const RegisterView: React.FC<{ onBackToLogin: () => void }> = ({ onBackToLogin }) => {
  const viewModel = useRegisterViewModel();
  const { t, fontScale } = useTranslation();

  const handleAction = () => {
    if (viewModel.step === 'credentials') return viewModel.handleEmailAndUsername();
    if (viewModel.step === 'confirmPassword') return viewModel.handleConfirmPassword();
    if (viewModel.step === 'code') return viewModel.handleVerifyCode();
  };

  const handleBack = () => {
    if (viewModel.step === 'credentials') return;
    viewModel.goBack();
  };

  const getHeader = () => {
    switch (viewModel.step) {
      case 'credentials':
        return {
          title: t('auth.register.createAccount'),
          subtitle: t('auth.register.provideEmailAndUsername')
        };
      case 'confirmPassword':
        return {
          title: t('auth.register.createPassword'),
          subtitle: t('auth.register.defineSecurePassword')
        };
      case 'code':
        return {
          title: t('auth.register.codeSent'),
          subtitle: t('auth.register.verifyEmailWithCode')
        };
      default:
        return { title: '', subtitle: '' };
    }
  };

  const header = getHeader();

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={['#FF662A', '#FCA537']} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={{
            flex: 1,
            justifyContent: 'space-between',
            paddingHorizontal: 24,
            paddingTop: 80,
            paddingBottom: 40
          }}>

            {viewModel.step !== 'credentials' && viewModel.step !== 'success' && (
              <TouchableOpacity onPress={handleBack} style={{ marginBottom: 16 }}>
                <Text style={{ color: '#fff', fontSize: 16 * fontScale }}>{t('auth.register.back')}</Text>
              </TouchableOpacity>
            )}

            <View style={{ marginBottom: 32 }}>
              <View style={{
                alignSelf: 'flex-start',
                backgroundColor: 'rgba(255,255,255,0.15)',
                borderRadius: 20,
                paddingHorizontal: 18,
                paddingVertical: 10,
                marginBottom: 28,
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.3)'
              }}>
                <Text style={{ color: '#fff', fontSize: 11 * fontScale, fontWeight: '800', letterSpacing: 3 }}>
                  MERCADIM
                </Text>
              </View>

              {viewModel.step !== 'success' && (
                <>
                  <Text style={{
                    color: '#fff',
                    fontSize: 40 * fontScale,
                    fontWeight: '800',
                    lineHeight: 46,
                    letterSpacing: -1
                  }}>
                    {header.title}
                  </Text>

                  <Text style={{
                    color: 'rgba(255,255,255,0.65)',
                    fontSize: 15 * fontScale,
                    marginTop: 8
                  }}>
                    {header.subtitle}
                  </Text>
                </>
              )}
            </View>

            <View style={{
              backgroundColor: '#fff',
              borderRadius: 28,
              padding: 28,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: 0.2,
              shadowRadius: 24,
              elevation: 16
            }}>

              {viewModel.generalError ? (
                <View style={{ backgroundColor: '#FEF2F2', borderLeftWidth: 3, borderLeftColor: '#EF4444', borderRadius: 10, padding: 14, marginBottom: 20 }}>
                  <Text style={{ color: '#B91C1C', fontSize: 13 * fontScale, fontWeight: '500' }}>{viewModel.generalError}</Text>
                </View>
              ) : null}

              {viewModel.step === 'credentials' && (
                <>
                  <View style={{ marginBottom: 16 }}>
                    <Text style={getLabelStyle(fontScale)}>{t('auth.register.emailLabel')}</Text>
                    <View style={inputBox(!!viewModel.emailError)}>
                      <TextInput
                        style={getInputText(fontScale)}
                        placeholder={t('auth.register.emailPlaceholder')}
                        placeholderTextColor="#9CA3AF"
                        value={viewModel.email}
                        onChangeText={viewModel.setEmail}
                        autoCapitalize="none"
                      />
                    </View>
                    {viewModel.emailError && <Text style={getErrText(fontScale)}>{viewModel.emailError}</Text>}
                  </View>

                  <View style={{ marginBottom: 16 }}>
                    <Text style={getLabelStyle(fontScale)}>{t('auth.register.usernameLabel')}</Text>
                    <View style={inputBox(!!viewModel.usernameError)}>
                      <TextInput
                        style={getInputText(fontScale)}
                        placeholder={t('auth.register.usernamePlaceholder')}
                        placeholderTextColor="#9CA3AF"
                        value={viewModel.username}
                        onChangeText={viewModel.setUsername}
                        autoCapitalize="none"
                      />
                    </View>
                    {viewModel.usernameError && <Text style={getErrText(fontScale)}>{viewModel.usernameError}</Text>}
                  </View>
                </>
              )}

              {viewModel.step === 'confirmPassword' && (
                <>
                  <View style={{ marginBottom: 16 }}>
                    <Text style={getLabelStyle(fontScale)}>{t('auth.register.passwordLabel')}</Text>
                    <View style={inputBox(!!viewModel.passwordError)}>
                      <TextInput
                        style={getInputText(fontScale)}
                        placeholder={t('auth.register.passwordPlaceholder')}
                        placeholderTextColor="#9CA3AF"
                        value={viewModel.password}
                        onChangeText={viewModel.setPassword}
                        secureTextEntry
                      />
                    </View>
                    {viewModel.passwordError && <Text style={getErrText(fontScale)}>{viewModel.passwordError}</Text>}
                  </View>

                  <View style={{ marginBottom: 16 }}>
                    <Text style={getLabelStyle(fontScale)}>{t('auth.register.confirmPasswordLabel')}</Text>
                    <View style={inputBox(!!viewModel.confirmPasswordError)}>
                      <TextInput
                        style={getInputText(fontScale)}
                        placeholder={t('auth.register.confirmPasswordPlaceholder')}
                        placeholderTextColor="#9CA3AF"
                        value={viewModel.confirmPassword}
                        onChangeText={viewModel.setConfirmPassword}
                        secureTextEntry
                      />
                    </View>
                    {viewModel.confirmPasswordError && <Text style={getErrText(fontScale)}>{viewModel.confirmPasswordError}</Text>}
                  </View>
                </>
              )}

              {viewModel.step === 'code' && (
                <View style={{ marginBottom: 16 }}>
                  <Text style={getLabelStyle(fontScale)}>{t('auth.register.codeLabel')}</Text>
                  <View style={inputBox(!!viewModel.codeError)}>
                    <TextInput
                      style={{ ...getInputText(fontScale), textAlign: 'center', letterSpacing: 8, fontSize: 20 * fontScale }}
                      placeholder={t('auth.register.codePlaceholder')}
                      placeholderTextColor="#D1D5DB"
                      value={viewModel.code}
                      onChangeText={viewModel.setCode}
                      keyboardType="number-pad"
                      maxLength={6}
                    />
                  </View>
                  {viewModel.codeError && <Text style={getErrText(fontScale)}>{viewModel.codeError}</Text>}
                </View>
              )}

              {viewModel.step === 'success' && (
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 30 * fontScale }}>✓</Text>
                  <Text style={{ fontSize: 18 * fontScale, fontWeight: '700', marginTop: 10 }}>
                    {t('auth.register.registrationComplete')}
                  </Text>

                  <TouchableOpacity onPress={onBackToLogin} style={{ marginTop: 20 }}>
                    <Text style={{ textAlign: 'center', color: '#FF662A', fontWeight: '600' }}>
                      {t('auth.register.backToLogin')}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {viewModel.step !== 'success' && (
                <>
                  <TouchableOpacity onPress={handleAction} style={{ marginTop: 20 }}>
                    <LinearGradient
                      colors={['#FCA537', '#FF662A']}
                      style={{ padding: 16, borderRadius: 14, alignItems: 'center' }}
                    >
                      {viewModel.loading ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text style={{ color: '#fff', fontWeight: '700' }}>
                          {t('auth.register.continueBtn')}
                        </Text>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                  
                  {viewModel.step === 'credentials' && (
                    <View style={{ alignItems: 'center', marginTop: 20 }}>
                      <Text style={{ color: '#6B7280', fontSize: 13 * fontScale }}>
                        {t('auth.register.alreadyHaveAccount')}{' '}
                        <Text 
                          style={{ color: '#FF662A', fontWeight: '700' }}
                          onPress={onBackToLogin}
                        >
                          {t('auth.register.signIn')}
                        </Text>
                      </Text>
                    </View>
                  )}
                </>
              )}
            </View>

            <View style={{ alignItems: 'center', marginTop: 28 }}>
              <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 * fontScale }}>
                © Mercadim 2026
              </Text>
            </View>

          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const getLabelStyle = (fontScale: number) => ({
  color: '#374151',
  fontSize: 10 * fontScale,
  fontWeight: '800' as const,
  letterSpacing: 1.5,
  textTransform: 'uppercase' as const,
  marginBottom: 8,
});

const inputBox = (hasError: boolean) => ({
  backgroundColor: hasError ? '#FEF2F2' : '#F9FAFB',
  borderWidth: 1.5,
  borderColor: hasError ? '#FCA5A5' : '#E5E7EB',
  borderRadius: 14,
  paddingHorizontal: 16,
  paddingVertical: 14,
});

const getInputText = (fontScale: number) => ({
  color: '#111827',
  fontSize: 15 * fontScale,
});

const getErrText = (fontScale: number) => ({
  color: '#EF4444',
  fontSize: 12 * fontScale,
  marginTop: 5,
  marginLeft: 4,
});