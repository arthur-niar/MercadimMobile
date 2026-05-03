// Tipos do sistema de configurações do app


export type ThemeMode = 'light' | 'dark' | 'system';
export type Language = 'pt' | 'en';
export type FontSize = 'small' | 'medium' | 'large';

export interface AppSettings {
  themeMode: ThemeMode;
  language: Language;
  fontSize: FontSize;
}

export const DEFAULT_SETTINGS: AppSettings = {
  themeMode: 'system',
  language: 'pt',
  fontSize: 'medium',
};

// Multiplicadores aplicados ao tamanho de fonte base
export const FONT_SIZE_SCALE: Record<FontSize, number> = {
  small: 0.9,
  medium: 1.0,
  large: 1.15,
};