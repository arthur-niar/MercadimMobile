
import { useColorScheme as useSystemColorScheme } from 'react-native';
import { useSettings } from '@/contexts/SettingsContext';

/**
 * Retorna 'light' | 'dark' baseado na escolha do usuário.
 * Se o usuário escolheu "system", usa o tema do celular.
 */
export function useColorScheme(): 'light' | 'dark' {
  const systemScheme = useSystemColorScheme();

  // Tenta pegar do SettingsContext
  // Se não estiver dentro do Provider (caso raro), usa tema do sistema
  try {
    const { effectiveTheme } = useSettings();
    return effectiveTheme;
  } catch {
    return systemScheme === 'dark' ? 'dark' : 'light';
  }
}