import { useState } from 'react';
import { validateEmail } from '@/utils/validation';

export const useProfileViewModel = () => {
  const [name, setName] = useState('Test User');
  const [email, setEmail] = useState('teste@mercadim.com');

  const [editName, setEditName] = useState(name);
  const [editEmail, setEditEmail] = useState(email);

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [modalVisible, setModalVisible] = useState(false);

  const clearErrors = () => {
    setNameError('');
    setEmailError('');
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

  const handleSave = () => {
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

    setName(editName);
    setEmail(editEmail);
    setSuccessMessage('Dados atualizados com sucesso!');
    closeModal();
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

    modalVisible,
    openModal,
    closeModal,
    handleSave,
  };
};