

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import {
  AppSettings,
  DEFAULT_SETTINGS,
  ThemeMode,
  Language,
  FontSize,
  FONT_SIZE_SCALE,
} from '@/models/Settings';
import { Colors } from '@/constants/theme';
import i18n from '@/i18n';

const STORAGE_KEY = '@mercadim:settings';

interface SettingsContextValue {
  // Estado das preferências
  settings: AppSettings;
  isLoaded: boolean;

  // Tema efetivo (já resolvido se for "system")
  effectiveTheme: 'light' | 'dark';
  colors: typeof Colors.light;
  isDark: boolean;

  // Multiplicador de fonte atual
  fontScale: number;

  // Setters
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  setLanguage: (lang: Language) => Promise<void>;
  setFontSize: (size: FontSize) => Promise<void>;
  resetSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useSystemColorScheme();
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carrega settings do AsyncStorage ao iniciar
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as AppSettings;
          setSettings({ ...DEFAULT_SETTINGS, ...parsed });
          // Aplica idioma carregado
          if (parsed.language) {
            i18n.changeLanguage(parsed.language);
          }
        }
      } catch (err) {
        console.warn('Erro ao carregar settings:', err);
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  // Persiste mudanças
  const persist = useCallback(async (newSettings: AppSettings) => {
    setSettings(newSettings);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
    } catch (err) {
      console.warn('Erro ao salvar settings:', err);
    }
  }, []);

  const setThemeMode = useCallback(
    (mode: ThemeMode) => persist({ ...settings, themeMode: mode }),
    [settings, persist],
  );

  const setLanguage = useCallback(
    async (lang: Language) => {
      await i18n.changeLanguage(lang);
      await persist({ ...settings, language: lang });
    },
    [settings, persist],
  );

  const setFontSize = useCallback(
    (size: FontSize) => persist({ ...settings, fontSize: size }),
    [settings, persist],
  );

  const resetSettings = useCallback(() => persist(DEFAULT_SETTINGS), [persist]);

  // Resolve o tema efetivo (se for 'system', usa o do celular)
  const effectiveTheme: 'light' | 'dark' =
    settings.themeMode === 'system'
      ? systemScheme === 'dark' ? 'dark' : 'light'
      : settings.themeMode;

  const colors = Colors[effectiveTheme] as typeof Colors.light;
  const fontScale = FONT_SIZE_SCALE[settings.fontSize];

  const value: SettingsContextValue = {
    settings,
    isLoaded,
    effectiveTheme,
    colors,
    isDark: effectiveTheme === 'dark',
    fontScale,
    setThemeMode,
    setLanguage,
    setFontSize,
    resetSettings,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

// Hook pra usar o context em qualquer componente
export const useSettings = (): SettingsContextValue => {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings deve ser usado dentro de <SettingsProvider>');
  }
  return ctx;
};