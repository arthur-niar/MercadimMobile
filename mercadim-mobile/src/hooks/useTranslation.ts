import { useTranslation as useI18nTranslation } from 'react-i18next';
import { useSettings } from '@/contexts/SettingsContext';

export const useTranslation = () => {
  const { t, i18n } = useI18nTranslation();
  const { fontScale, isDark } = useSettings();

  return {
    t,
    i18n,
    fontScale,
    isDark,
  };
};