
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SettingsProvider, useSettings } from '@/contexts/SettingsContext';
import '@/i18n'; // inicializa o sistema de tradução
import '../../global.css';

// Componente interno que consome o context (precisa estar dentro do Provider)
function ThemedStack() {
  const { isDark, isLoaded } = useSettings();

  // Aguarda settings carregarem antes de renderizar (evita flash de tema errado)
  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="configuracoes" />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <ThemedStack />
      </SettingsProvider>
    </SafeAreaProvider>
  );
}