// SUBSTITUI: src/app/(tabs)/_layout.tsx
// Mudança: Tabs.Screen name="sales" (antes era "nova-venda" que não existe)

import { Tabs } from 'expo-router';
import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { useSettings } from '@/contexts/SettingsContext';
import { useTranslation } from '@/hooks/useTranslation';

const ORANGE = '#FF662A';

const HomeIcon = ({ active, inactive }: { active: boolean; inactive: string }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M3 12L12 4l9 8" stroke={active ? '#fff' : inactive} strokeWidth="2" strokeLinecap="round" />
    <Path d="M5 10v9a1 1 0 001 1h4v-4h4v4h4a1 1 0 001-1v-9" stroke={active ? '#fff' : inactive} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const NovaVendaIcon = ({ active, inactive }: { active: boolean; inactive: string }) => (
  <View style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke={active ? '#fff' : inactive} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
    {!active && (
      <View style={{ position: 'absolute', top: -2, right: -2, width: 13, height: 13, borderRadius: 6.5, backgroundColor: ORANGE, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width="8" height="8" viewBox="0 0 10 10" fill="none">
          <Path d="M5 2v6M2 5h6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
        </Svg>
      </View>
    )}
  </View>
);

const EstoqueIcon = ({ active, inactive }: { active: boolean; inactive: string }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Rect x="5" y="2" width="14" height="17" rx="2" stroke={active ? '#fff' : inactive} strokeWidth="1.8" />
    <Path d="M9 2v2a1 1 0 001 1h4a1 1 0 001-1V2" stroke={active ? '#fff' : inactive} strokeWidth="1.8" />
    <Path d="M9 10l1.5 1.5L13 8" stroke={active ? '#fff' : inactive} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M9 15h6" stroke={active ? '#fff' : inactive} strokeWidth="1.6" strokeLinecap="round" />
  </Svg>
);

const PerfilIcon = ({ active, inactive }: { active: boolean; inactive: string }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="4" stroke={active ? '#fff' : inactive} strokeWidth="1.8" />
    <Path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={active ? '#fff' : inactive} strokeWidth="1.8" strokeLinecap="round" />
  </Svg>
);

const TabIcon = ({
  icon, active, inactiveBg,
}: {
  icon: React.ReactNode;
  active: boolean;
  inactiveBg: string;
}) => (
  <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}>
    <View style={{
      width: 54, height: 54, borderRadius: 18,
      backgroundColor: active ? ORANGE : inactiveBg,
      alignItems: 'center', justifyContent: 'center',
    }}>
      {icon}
    </View>
  </View>
);

export default function TabsLayout() {
  const { isDark } = useSettings();

  // Cores adaptadas ao tema
  const tabBarBg = isDark ? '#17181B' : '#fff';
  const tabBarBorder = isDark ? 'rgba(255,255,255,0.08)' : '#E5E7EB';
  const inactiveBg = isDark ? '#27282C' : '#E5E7EB';
  const inactiveColor = isDark ? '#9CA3AF' : '#4B5563';
  const sceneBg = isDark ? '#0B0B0D' : '#fff';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: sceneBg },
        
        tabBarShowLabel: false,

        tabBarStyle: {
          backgroundColor: tabBarBg,
          borderTopColor: tabBarBorder,
          borderTopWidth: 1,
          height: 92,
          paddingBottom: 12,
          paddingTop: 18,
          paddingHorizontal: 10,
        },

        tabBarItemStyle: {
          alignItems: 'center',
          justifyContent: 'center',
        },
        
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={<HomeIcon active={focused} inactive={inactiveColor} />}
              active={focused}
              inactiveBg={inactiveBg}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="sales"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={<NovaVendaIcon active={focused} inactive={inactiveColor} />}
              active={focused}
              inactiveBg={inactiveBg}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="estoque"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={<EstoqueIcon active={focused} inactive={inactiveColor} />}
              active={focused}
              inactiveBg={inactiveBg}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={<PerfilIcon active={focused} inactive={inactiveColor} />}
              active={focused}
              inactiveBg={inactiveBg}
            />
          ),
        }}
      />
    </Tabs>
  );
}