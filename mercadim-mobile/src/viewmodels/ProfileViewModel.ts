import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { validateEmail } from '@/utils/validation';
import { getProfile, updateProfile, uploadProfilePhoto, removeProfilePhoto } from '@/services/profile.service';
import { authService } from '@/services/auth.service';

export const useProfileViewModel = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);

  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoadingProfile(true);
      const profileData = await getProfile();
      setName(profileData.name);
      setEmail(profileData.email);
      setProfilePhotoUrl(profileData.url || null);
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

  const handlePickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        setErrorMessage('Permissão para acessar galeria foi negada');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        await handleUploadPhoto(imageUri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      setErrorMessage('Erro ao selecionar imagem');
    }
  };

  const handleUploadPhoto = async (photoUri: string) => {
    try {
      setUploadingPhoto(true);
      setErrorMessage('');
      
      const response = await uploadProfilePhoto(photoUri);
      
      setProfilePhotoUrl(response.user.url || null);
      setSuccessMessage('Foto de perfil atualizada com sucesso!');
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao enviar foto';
      setErrorMessage(message);
      console.error('Upload photo error:', error);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = async () => {
    try {
      setUploadingPhoto(true);
      setErrorMessage('');
      
      const response = await removeProfilePhoto();
      
      setProfilePhotoUrl(null);
      setSuccessMessage('Foto de perfil removida com sucesso!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao remover foto';
      setErrorMessage(message);
      console.error('Erro de remoção de foto:', error);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      router.replace('/login');
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  return {
    name,
    email,
    profilePhotoUrl,

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
    uploadingPhoto,
    refreshProfile: fetchProfile,
    handleLogout,
    handlePickImage,
    handleRemovePhoto,
  };
};