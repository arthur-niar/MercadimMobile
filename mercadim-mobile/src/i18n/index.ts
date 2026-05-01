import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import { pt } from './pt';
import { en } from './en';

// Detecta idioma do dispositivo
const deviceLanguage = Localization.getLocales()[0]?.languageCode ?? 'pt';
const initialLanguage = deviceLanguage === 'en' ? 'en' : 'pt';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      pt: { translation: pt },
      en: { translation: en },
    },
    lng: initialLanguage,
    fallbackLng: 'pt',
    interpolation: {
      escapeValue: false, // React já escapa
    },
    compatibilityJSON: 'v4',
  });

export default i18n;