import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { validateEmail } from '@/utils/validation';
import { getProfile, updateProfile } from '@/services/profile.service';
import { authService } from '@/services/auth.service';

export const useProfileViewModel = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const fetchProfile = async () => {
    try {
      setLoadingProfile(true);
      const profileData = await getProfile();
      setName(profileData.name);
      setEmail(profileData.email);
      setEditName(profileData.name);
      setEditEmail(profileData.email);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao carregar perfil';
      setErrorMessage(message);
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const clearErrors = () => {
    setNameError('');
    setEmailError('');
    setErrorMessage('');
  };

  const openModal = () => {
    setEditName(name);
    setEditEmail(email);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    clearErrors();
    setSuccessMessage('');
  };

  const handleSave = async () => {
    clearErrors();
    setSuccessMessage('');

    if (!editName.trim()) {
      setNameError('Nome é obrigatório');
      return;
    }

    const emailValidation = validateEmail(editEmail);

    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error || '');
      return;
    }

    try {
      setLoading(true);
      const response = await updateProfile({
        name: editName,
        email: editEmail,
      });

      setName(response.user.name);
      setEmail(response.user.email);
      setSuccessMessage('Dados atualizados com sucesso!');
      closeModal();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao atualizar perfil';
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return {
    name,
    email,

    editName,
    setEditName,
    editEmail,
    setEditEmail,

    nameError,
    emailError,
    successMessage,
    errorMessage,

    modalVisible,
    openModal,
    closeModal,
    handleSave,

    loading,
    loadingProfile,
    refreshProfile: fetchProfile,
    handleLogout,
  };
};