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
  settings: AppSettings;
  isLoaded: boolean;
  effectiveTheme: 'light' | 'dark';
  colors: typeof Colors.light;
  isDark: boolean;
  fontScale: number;
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
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as AppSettings;
          setSettings({ ...DEFAULT_SETTINGS, ...parsed });
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

  const fontScale = FONT_SIZE_SCALE[settings.fontSize];

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
      setForceUpdate(prev => prev + 1);
    },
    [settings, persist],
  );

  const setFontSize = useCallback(
    async (size: FontSize) => {
      await persist({ ...settings, fontSize: size });
      setForceUpdate(prev => prev + 1);
    },
    [settings, persist],
  );

  const resetSettings = useCallback(async () => {
    await persist(DEFAULT_SETTINGS);
    setForceUpdate(prev => prev + 1);
  }, [persist]);

  const effectiveTheme: 'light' | 'dark' =
    settings.themeMode === 'system'
      ? systemScheme === 'dark' ? 'dark' : 'light'
      : settings.themeMode;

  const colors = Colors[effectiveTheme] as typeof Colors.light;

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

  return (
    <SettingsContext.Provider value={value} key={forceUpdate}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextValue => {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings deve ser usado dentro de <SettingsProvider>');
  }
  return ctx;
};
