import { Tabs } from 'expo-router';
import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

const ORANGE = '#FF662A';
const GRAY_ACTIVE = '#4B5563';
const GRAY_BG = '#E5E7EB';

const HomeIcon = ({ active }: { active: boolean }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M3 12L12 4l9 8" stroke={active ? '#fff' : GRAY_ACTIVE} strokeWidth="2" strokeLinecap="round" />
    <Path d="M5 10v9a1 1 0 001 1h4v-4h4v4h4a1 1 0 001-1v-9" stroke={active ? '#fff' : GRAY_ACTIVE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const NovaVendaIcon = ({ active }: { active: boolean }) => (
  <View style={{ width: 22, height: 22, alignItems: 'center', justifyContent: 'center' }}>
    <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <Path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke={active ? '#fff' : GRAY_ACTIVE} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
    {!active && (
      <View style={{ position: 'absolute', top: 0, right: 0, width: 12, height: 12, borderRadius: 6, backgroundColor: ORANGE, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width="8" height="8" viewBox="0 0 10 10" fill="none">
          <Path d="M5 2v6M2 5h6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
        </Svg>
      </View>
    )}
  </View>
);

const EstoqueIcon = ({ active }: { active: boolean }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Rect x="5" y="2" width="14" height="17" rx="2" stroke={active ? '#fff' : GRAY_ACTIVE} strokeWidth="1.8" />
    <Path d="M9 2v2a1 1 0 001 1h4a1 1 0 001-1V2" stroke={active ? '#fff' : GRAY_ACTIVE} strokeWidth="1.8" />
    <Path d="M9 10l1.5 1.5L13 8" stroke={active ? '#fff' : GRAY_ACTIVE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M9 15h6" stroke={active ? '#fff' : GRAY_ACTIVE} strokeWidth="1.6" strokeLinecap="round" />
  </Svg>
);

const PerfilIcon = ({ active }: { active: boolean }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="4" stroke={active ? '#fff' : GRAY_ACTIVE} strokeWidth="1.8" />
    <Path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={active ? '#fff' : GRAY_ACTIVE} strokeWidth="1.8" strokeLinecap="round" />
  </Svg>
);

const TabIcon = ({ icon, label, active, lines = 1 }: { icon: React.ReactNode; label: string; active: boolean; lines?: number }) => (
  <View style={{ alignItems: 'center', gap: 3, paddingTop: 4, width: '100%' }}>
    <View style={{
      width: 44, height: 44, borderRadius: 14,
      backgroundColor: active ? ORANGE : GRAY_BG,
      alignItems: 'center', justifyContent: 'center',
    }}>
      {icon}
    </View>
    <Text
      numberOfLines={lines}
      adjustsFontSizeToFit
      minimumFontScale={0.6}
      style={{
        fontSize: 9,
        fontWeight: active ? '700' : '500',
        color: active ? ORANGE : GRAY_ACTIVE,
        width: '100%',
        textAlign: 'center',
        lineHeight: 11,
      }}
    >
      {label}
    </Text>
  </View>
);

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#E5E7EB',
          borderTopWidth: 1,
          height: 100,
          paddingBottom: 12,
          paddingTop: 8,
          paddingHorizontal: 4,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={<HomeIcon active={focused} />} label="Home" active={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="nova-venda"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={<NovaVendaIcon active={focused} />} label="Venda" active={focused} lines={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="estoque"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={<EstoqueIcon active={focused} />} label="Estoque" active={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={<PerfilIcon active={focused} />} label="Perfil" active={focused} />
          ),
        }}
      />
    </Tabs>
  );
}