

import React from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, StatusBar, Modal, ActivityIndicator, Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useProfileViewModel } from '@/viewmodels';
import { useTranslation } from '@/hooks/useTranslation';

export const ProfileView: React.FC = () => {
  const viewModel = useProfileViewModel();
  const { t, isDark, fontScale } = useTranslation();

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
  const sheetBg = isDark ? '#1E1E1E' : '#FFFFFF';
  const sheetItemBg = isDark ? '#2A2A2A' : '#F5F5F5';
  const sheetItemBorder = isDark ? '#3A3A3A' : '#E8E8E8';

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

          {/* ── Seção da foto estilo WhatsApp ── */}
          <View style={{
            height: 280,
            justifyContent: 'center',
            alignItems: 'center',
          }}>

            {/* Avatar */}
            <TouchableOpacity
              onPress={() => viewModel.setPhotoSheetVisible(true)}
              disabled={viewModel.uploadingPhoto}
              activeOpacity={0.85}
              style={{
                width: 130,
                height: 130,
                borderRadius: 65,
                backgroundColor: '#E5E7EB',
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 3,
                borderColor: 'rgba(255,255,255,0.6)',
                overflow: 'hidden',
              }}
            >
            {viewModel.uploadingPhoto ? (
                <ActivityIndicator size="large" color="#FF662A" />
              ) : viewModel.profilePhotoUrl ? (
                <Image
                  source={{ uri: viewModel.profilePhotoUrl }}
                  style={{ width: '100%', height: '100%' }}
                />
              ) : (
                <Ionicons name="person" size={60} color="#9CA3AF" />
              )}
            </TouchableOpacity>

            {/* Botão Editar branco */}
            <TouchableOpacity
              onPress={() => viewModel.setPhotoSheetVisible(true)}
              disabled={viewModel.uploadingPhoto}
              style={{ marginTop: 14 }}
            >
              <Text style={{
                color: '#FFFFFF',
                fontSize: 17 * fontScale,
                fontWeight: '700',
                letterSpacing: 0.3,
              }}>
                {t('profile.edit')}
              </Text>
            </TouchableOpacity>

          </View>

          {/* ── Restante da tela (nome, email, botão editar perfil, logout) ── */}
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
              <Text style={getLabelStyle(labelColor, fontScale)}>{t('profile.name')}</Text>
              <View style={getInputBox(false, inputBg, inputBorder, inputErrorBg, inputErrorBorder)}>
                <Text style={{ color: textColor, fontSize: 15 * fontScale }}>{viewModel.name}</Text>
              </View>
            </View>

            <View style={{ marginBottom: 20 }}>
              <Text style={getLabelStyle(labelColor, fontScale)}>{t('profile.email')}</Text>
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
                  {t('profile.editProfile')}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={{ marginTop: 20 }} onPress={viewModel.handleLogout}>
              <Text style={{
                textAlign: 'center',
                color: '#EF4444',
                fontWeight: '600'
              }}>
                {t('profile.logout')}
              </Text>
            </TouchableOpacity>

          </View>

        </ScrollView>

        {/* ── Modal de editar perfil (nome/email) ── */}
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
                {t('profile.editProfile')}
              </Text>

              <View style={{ marginBottom: 16 }}>
                <Text style={getLabelStyle(labelColor, fontScale)}>{t('profile.name')}</Text>
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
                <Text style={getLabelStyle(labelColor, fontScale)}>{t('profile.email')}</Text>
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
                      {t('profile.save')}
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity onPress={viewModel.closeModal} style={{ marginTop: 12 }} disabled={viewModel.loading}>
                <Text style={{
                  textAlign: 'center',
                  color: subTextColor
                }}>
                  {t('common.cancel')}
                </Text>
              </TouchableOpacity>

            </View>
          </View>
        </Modal>

        {/* ── Bottom Sheet estilo WhatsApp: Editar foto do perfil ── */}
        <Modal
          visible={viewModel.photoSheetVisible}
          transparent
          animationType="slide"
          onRequestClose={() => viewModel.setPhotoSheetVisible(false)}
        >
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
            activeOpacity={1}
            onPress={() => viewModel.setPhotoSheetVisible(false)}
          />
          <View style={{
            backgroundColor: sheetBg,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingBottom: Platform.OS === 'ios' ? 34 : 16,
            paddingTop: 8,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          }}>

            {/* Handle bar */}
            <View style={{
              width: 36,
              height: 4,
              borderRadius: 2,
              backgroundColor: isDark ? '#555' : '#CCC',
              alignSelf: 'center',
              marginBottom: 16,
            }} />

            {/* Título */}
            <Text style={{
              color: textColor,
              fontSize: 16 * fontScale,
              fontWeight: '700',
              textAlign: 'center',
              marginBottom: 16,
              paddingHorizontal: 20,
            }}>
              {t('profile.editPhotoTitle')}
            </Text>

            {/* ── Tirar foto ── */}
            <TouchableOpacity
              onPress={viewModel.handleTakePhoto}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: sheetItemBg,
                marginHorizontal: 16,
                marginBottom: 2,
                paddingHorizontal: 18,
                paddingVertical: 16,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: sheetItemBorder,
              }}
            >
              <Text style={{ color: textColor, fontSize: 15 * fontScale, fontWeight: '500' }}>
                {t('profile.takePhoto')}
              </Text>
              <Ionicons name="camera-outline" size={22} color={textColor} />
            </TouchableOpacity>

            {/* ── Escolher foto ── */}
            <TouchableOpacity
              onPress={viewModel.handlePickImage}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: sheetItemBg,
                marginHorizontal: 16,
                marginBottom: 2,
                paddingHorizontal: 18,
                paddingVertical: 16,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: sheetItemBorder,
              }}
            >
              <Text style={{ color: textColor, fontSize: 15 * fontScale, fontWeight: '500' }}>
                {t('profile.choosePhoto')}
              </Text>
              <Ionicons name="image-outline" size={22} color={textColor} />
            </TouchableOpacity>

            {/* ── Apagar foto (só aparece se tiver foto) ── */}
            {viewModel.profilePhotoUrl && (
              <TouchableOpacity
                onPress={viewModel.handleRemovePhoto}
                activeOpacity={0.7}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: sheetItemBg,
                  marginHorizontal: 16,
                  marginTop: 10,
                  paddingHorizontal: 18,
                  paddingVertical: 16,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: sheetItemBorder,
                }}
              >
                <Text style={{ color: '#EF4444', fontSize: 15 * fontScale, fontWeight: '500' }}>
                  {t('profile.deletePhoto')}
                </Text>
                <Ionicons name="trash-outline" size={22} color="#EF4444" />
              </TouchableOpacity>
            )}

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