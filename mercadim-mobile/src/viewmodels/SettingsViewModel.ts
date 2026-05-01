// ViewModel da tela de Configurações
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { useSettings } from '@/contexts/SettingsContext';
import { Language, FontSize } from '@/models/Settings';

export const useSettingsViewModel = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const settings = useSettings();
  const [aboutModalVisible, setAboutModalVisible] = useState(false);
  const [termsModalVisible, setTermsModalVisible] = useState(false);

  const toggleDarkMode = () => {
    settings.setThemeMode(settings.isDark ? 'light' : 'dark');
  };

  const handleSelectLanguage = (lang: Language) => {
    settings.setLanguage(lang);
  };

  const handleSelectFontSize = (size: FontSize) => {
    settings.setFontSize(size);
  };

  const openAbout = () => setAboutModalVisible(true);
  const closeAbout = () => setAboutModalVisible(false);

  const openTerms = () => setTermsModalVisible(true);
  const closeTerms = () => setTermsModalVisible(false);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)' as any);
    }
  };

  return {
    // Estado
    isDark: settings.isDark,
    currentLanguage: settings.settings.language,
    currentFontSize: settings.settings.fontSize,
    colors: settings.colors,
    fontScale: settings.fontScale,
    aboutModalVisible,
    termsModalVisible,

    // Tradução
    t,

    // Ações
    toggleDarkMode,
    handleSelectLanguage,
    handleSelectFontSize,
    openAbout,
    closeAbout,
    openTerms,
    closeTerms,
    handleBack,
  };
};