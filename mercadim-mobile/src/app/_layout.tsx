import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SettingsProvider, useSettings } from '@/contexts/SettingsContext';
import { ProfileProvider } from '@/contexts/ProfileContext';
import '@/i18n'; 
import '../../global.css';
import '@/utils/setupGlobalText';

function ThemedStack() {
  const { isDark, isLoaded } = useSettings();

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
        <ProfileProvider>
          <ThemedStack />
        </ProfileProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
