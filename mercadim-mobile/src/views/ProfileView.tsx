// SUBSTITUI: src/views/ProfileView.tsx
// Mudanças:
// - import useSettings + cores adaptadas ao tema escuro
// - Mantém o gradiente laranja no topo (identidade visual)
// - Card branco vira escuro no modo escuro
// - Modal e inputs adaptados

import React from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, StatusBar, Modal, ActivityIndicator, Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useProfileViewModel } from '@/viewmodels';
import { useSettings } from '@/contexts/SettingsContext';

export const ProfileView: React.FC = () => {
  const viewModel = useProfileViewModel();
  const { isDark, fontScale } = useSettings();

  // Cores adaptadas ao tema
  const screenBg = isDark ? '#0B0B0D' : '#fff';
  const cardBg = isDark ? '#17181B' : '#fff';
  const textColor = isDark ? '#F3F4F6' : '#111827';
  const labelColor = isDark ? '#D1D5DB' : '#374151';
  const subTextColor = isDark ? '#9CA3AF' : '#6B7280';
  const inputBg = isDark ? '#27282C' : '#F9FAFB';
  const inputBorder = isDark ? 'rgba(255,255,255,0.08)' : '#E5E7EB';
  const inputErrorBg = isDark ? '#3F1212' : '#FEF2F2';
  const inputErrorBorder = isDark ? '#7F1D1D' : '#FCA5A5';

  if (viewModel.loadingProfile) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: screenBg }}>
        <ActivityIndicator size="large" color="#FF662A" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, backgroundColor: screenBg }}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={['#FF662A', '#FCA537']} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

          <View style={{
            height: 260,
            justifyContent: 'center',
            alignItems: 'center',
          }}>

            <View style={{
              width: 110,
              height: 110,
              borderRadius: 55,
              backgroundColor: '#E5E7EB',
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 4,
              borderColor: '#fff',
              zIndex: 2,
              overflow: 'hidden',
            }}>
              {viewModel.profilePhotoUrl ? (
                <Image 
                  source={{ uri: viewModel.profilePhotoUrl }}
                  style={{ width: '100%', height: '100%' }}
                />
              ) : (
                <Text style={{ fontSize: 42 * fontScale }}>👤</Text>
              )}
            </View>

            {/* Botões de ação para foto */}
            {!viewModel.uploadingPhoto ? (
              <View style={{
                flexDirection: 'row',
                marginTop: 16,
                gap: 12,
                justifyContent: 'center',
              }}>
                <TouchableOpacity 
                  onPress={viewModel.handlePickImage}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  }}
                >
                  <Text style={{
                    color: '#fff',
                    fontSize: 12 * fontScale,
                    fontWeight: '600',
                  }}>
                    📷 Alterar
                  </Text>
                </TouchableOpacity>

                {viewModel.profilePhotoUrl && (
                  <TouchableOpacity 
                    onPress={viewModel.handleRemovePhoto}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 16,
                      borderWidth: 1,
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    }}
                  >
                    <Text style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: 12 * fontScale,
                      fontWeight: '600',
                    }}>
                      ✕ Remover
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <View style={{ marginTop: 16 }}>
                <ActivityIndicator size="small" color="#fff" />
              </View>
            )}
          </View>

          <View style={{
            flex: 1,
            backgroundColor: cardBg,
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            padding: 28,
            marginTop: -50,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.15,
            shadowRadius: 20,
            elevation: 10
          }}>

            <View style={{ marginBottom: 16 }}>
              <Text style={getLabelStyle(labelColor, fontScale)}>Nome</Text>
              <View style={getInputBox(false, inputBg, inputBorder, inputErrorBg, inputErrorBorder)}>
                <Text style={{ color: textColor, fontSize: 15 * fontScale }}>{viewModel.name}</Text>
              </View>
            </View>

            <View style={{ marginBottom: 20 }}>
              <Text style={getLabelStyle(labelColor, fontScale)}>Email</Text>
              <View style={getInputBox(false, inputBg, inputBorder, inputErrorBg, inputErrorBorder)}>
                <Text style={{ color: textColor, fontSize: 15 * fontScale }}>{viewModel.email}</Text>
              </View>
            </View>

            {viewModel.errorMessage ? (
              <Text style={{
                color: '#EF4444',
                marginBottom: 12,
                textAlign: 'center'
              }}>
                {viewModel.errorMessage}
              </Text>
            ) : null}

            {viewModel.successMessage ? (
              <Text style={{
                color: '#22C55E',
                marginBottom: 12,
                textAlign: 'center'
              }}>
                {viewModel.successMessage}
              </Text>
            ) : null}

            <TouchableOpacity onPress={viewModel.openModal}>
              <LinearGradient
                colors={['#FCA537', '#FF662A']}
                style={{
                  paddingVertical: 16,
                  borderRadius: 18,
                  alignItems: 'center',
                  shadowColor: '#FF662A',
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.3,
                  shadowRadius: 10,
                  elevation: 5
                }}
              >
                <Text style={{
                  color: '#fff',
                  fontWeight: '700',
                  fontSize: 15 * fontScale
                }}>
                  Editar
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={{ marginTop: 20 }} onPress={viewModel.handleLogout}>
              <Text style={{
                textAlign: 'center',
                color: '#EF4444',
                fontWeight: '600'
              }}>
                Sair Do Aplicativo
              </Text>
            </TouchableOpacity>

          </View>

        </ScrollView>

        <Modal visible={viewModel.modalVisible} transparent animationType="slide">
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            padding: 24
          }}>
            <View style={{
              backgroundColor: cardBg,
              borderRadius: 20,
              padding: 20
            }}>

              <Text style={{
                fontSize: 18 * fontScale,
                fontWeight: '700',
                marginBottom: 16,
                color: textColor,
              }}>
                Editar Perfil
              </Text>

              <View style={{ marginBottom: 16 }}>
                <Text style={getLabelStyle(labelColor, fontScale)}>Nome</Text>
                <View style={getInputBox(!!viewModel.nameError, inputBg, inputBorder, inputErrorBg, inputErrorBorder)}>
                  <TextInput
                    style={{ color: textColor, fontSize: 15 * fontScale }}
                    placeholderTextColor={subTextColor}
                    value={viewModel.editName}
                    onChangeText={viewModel.setEditName}
                    editable={!viewModel.loading}
                  />
                </View>
                {viewModel.nameError && <Text style={getErrText(fontScale)}>{viewModel.nameError}</Text>}
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text style={getLabelStyle(labelColor, fontScale)}>Email</Text>
                <View style={getInputBox(!!viewModel.emailError, inputBg, inputBorder, inputErrorBg, inputErrorBorder)}>
                  <TextInput
                    style={{ color: textColor, fontSize: 15 * fontScale }}
                    placeholderTextColor={subTextColor}
                    value={viewModel.editEmail}
                    onChangeText={viewModel.setEditEmail}
                    autoCapitalize="none"
                    editable={!viewModel.loading}
                  />
                </View>
                {viewModel.emailError && <Text style={getErrText(fontScale)}>{viewModel.emailError}</Text>}
              </View>

              {viewModel.errorMessage ? (
                <Text style={{
                  color: '#EF4444',
                  marginBottom: 12,
                  textAlign: 'center',
                  fontSize: 13 * fontScale
                }}>
                  {viewModel.errorMessage}
                </Text>
              ) : null}

              <TouchableOpacity onPress={viewModel.handleSave} disabled={viewModel.loading}>
                <LinearGradient
                  colors={['#FCA537', '#FF662A']}
                  style={{
                    padding: 14,
                    borderRadius: 14,
                    alignItems: 'center',
                    opacity: viewModel.loading ? 0.6 : 1
                  }}
                >
                  {viewModel.loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={{ color: '#fff', fontWeight: '700' }}>
                      Salvar
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity onPress={viewModel.closeModal} style={{ marginTop: 12 }} disabled={viewModel.loading}>
                <Text style={{
                  textAlign: 'center',
                  color: subTextColor
                }}>
                  Fechar
                </Text>
              </TouchableOpacity>

            </View>
          </View>
        </Modal>

      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const getLabelStyle = (color: string, fontScale: number) => ({
  color,
  fontSize: 10 * fontScale,
  fontWeight: '800' as const,
  letterSpacing: 1.5,
  textTransform: 'uppercase' as const,
  marginBottom: 8,
});

const getInputBox = (
  hasError: boolean,
  bg: string,
  border: string,
  errorBg: string,
  errorBorder: string,
) => ({
  backgroundColor: hasError ? errorBg : bg,
  borderWidth: 1.5,
  borderColor: hasError ? errorBorder : border,
  borderRadius: 14,
  paddingHorizontal: 16,
  paddingVertical: 14,
});

const getErrText = (fontScale: number) => ({
  color: '#EF4444',
  fontSize: 12 * fontScale,
  marginTop: 5,
  marginLeft: 4,
});