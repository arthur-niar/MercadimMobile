import React from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, StatusBar, Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useProfileViewModel } from '@/viewmodels';

export const ProfileView: React.FC = () => {
  const viewModel = useProfileViewModel();

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={['#FF662A', '#FCA537']} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

          <View style={{ 
            height: 260,
            justifyContent: 'center',
            alignItems: 'center',
          }}>

            <View style={{ // ícone do usuário
              width: 110,
              height: 110,
              borderRadius: 55,
              backgroundColor: '#E5E7EB',
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 4,
              borderColor: '#fff',
              zIndex: 2
            }}>
              <Text style={{ fontSize: 42 }}>👤</Text>
            </View>
          </View>

          <View style={{
            flex: 1,
            backgroundColor: '#fff',
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
              <Text style={labelStyle}>Nome</Text>
              <View style={inputBox(false)}>
                <Text>{viewModel.name}</Text>
              </View>
            </View>

            <View style={{ marginBottom: 20 }}>
              <Text style={labelStyle}>Email</Text>
              <View style={inputBox(false)}>
                <Text>{viewModel.email}</Text>
              </View>
            </View>

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
                  fontSize: 15
                }}>
                  Editar
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={{ marginTop: 20 }}>
              <Text style={{
                textAlign: 'center',
                color: '#FF662A',
                fontWeight: '600'
              }}>
                Fazer Log out
              </Text>
            </TouchableOpacity>

            {viewModel.successMessage ? (
              <Text style={{
                color: '#22C55E',
                marginTop: 12,
                textAlign: 'center'
              }}>
                {viewModel.successMessage}
              </Text>
            ) : null}

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
              backgroundColor: '#fff',
              borderRadius: 20,
              padding: 20
            }}>

              <Text style={{
                fontSize: 18,
                fontWeight: '700',
                marginBottom: 16
              }}>
                Editar Perfil
              </Text>

              <View style={{ marginBottom: 16 }}>
                <Text style={labelStyle}>Nome</Text>
                <View style={inputBox(!!viewModel.nameError)}>
                  <TextInput
                    style={inputText}
                    value={viewModel.editName}
                    onChangeText={viewModel.setEditName}
                  />
                </View>
                {viewModel.nameError && <Text style={errText}>{viewModel.nameError}</Text>}
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text style={labelStyle}>Email</Text>
                <View style={inputBox(!!viewModel.emailError)}>
                  <TextInput
                    style={inputText}
                    value={viewModel.editEmail}
                    onChangeText={viewModel.setEditEmail}
                    autoCapitalize="none"
                  />
                </View>
                {viewModel.emailError && <Text style={errText}>{viewModel.emailError}</Text>}
              </View>

              <TouchableOpacity onPress={viewModel.handleSave}>
                <LinearGradient
                  colors={['#FCA537', '#FF662A']}
                  style={{
                    padding: 14,
                    borderRadius: 14,
                    alignItems: 'center'
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: '700' }}>
                    Salvar
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity onPress={viewModel.closeModal} style={{ marginTop: 12 }}>
                <Text style={{
                  textAlign: 'center',
                  color: '#6B7280'
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

const labelStyle = {
  color: '#374151',
  fontSize: 10,
  fontWeight: '800' as const,
  letterSpacing: 1.5,
  textTransform: 'uppercase' as const,
  marginBottom: 8,
};

const inputBox = (hasError: boolean) => ({
  backgroundColor: hasError ? '#FEF2F2' : '#F9FAFB',
  borderWidth: 1.5,
  borderColor: hasError ? '#FCA5A5' : '#E5E7EB',
  borderRadius: 14,
  paddingHorizontal: 16,
  paddingVertical: 14,
});

const inputText = {
  color: '#111827',
  fontSize: 15,
};

const errText = {
  color: '#EF4444',
  fontSize: 12,
  marginTop: 5,
  marginLeft: 4,
};