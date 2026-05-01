// View da tela de Configurações (UI)
// SUBSTITUI: src/views/SettingsView.tsx
// Mudança nesta versão: corrige scroll travado no modal de Termos
// Estrutura agora usa View + TouchableOpacity de overlay (padrão de bottom-sheet)

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
  Pressable,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { useSettingsViewModel } from '@/viewmodels/SettingsViewModel';
import { Language, FontSize } from '@/models/Settings';

const ORANGE = '#FF662A';

// ── Icons ─────────────────────────────────────────────────────────────────────

const BackIcon = ({ color }: { color: string }) => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <Path d="M15 18l-6-6 6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronIcon = ({ color }: { color: string }) => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Path d="M9 18l6-6-6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ThemeIcon = ({ color }: { color: string }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const FontIcon = ({ color }: { color: string }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path d="M4 7V5h16v2M9 20h6M12 5v15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const LanguageIcon = ({ color }: { color: string }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path d="M12 2a10 10 0 100 20 10 10 0 000-20zM2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const InfoIcon = ({ color }: { color: string }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path d="M12 22a10 10 0 100-20 10 10 0 000 20zM12 16v-4M12 8h.01" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const TermsIcon = ({ color }: { color: string }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8M16 17H8M10 9H8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// ── Sub-components ────────────────────────────────────────────────────────────

interface SectionLabelProps {
  text: string;
  color: string;
  scale: number;
}
const SectionLabel = ({ text, color, scale }: SectionLabelProps) => (
  <Text
    style={{
      fontSize: 10 * scale,
      fontWeight: '500',
      letterSpacing: 1.5,
      color,
      paddingHorizontal: 16,
      paddingTop: 18,
      paddingBottom: 8,
      textTransform: 'uppercase',
    }}
  >
    {text}
  </Text>
);

interface RowProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle?: string;
  right: React.ReactNode;
  onPress?: () => void;
  textColor: string;
  subColor: string;
  scale: number;
  isLast?: boolean;
  borderColor: string;
}
const Row = ({
  icon, iconBg, title, subtitle, right, onPress, textColor, subColor, scale, isLast, borderColor,
}: RowProps) => {
  const Container: any = onPress ? TouchableOpacity : View;
  return (
    <Container
      onPress={onPress}
      activeOpacity={onPress ? 0.6 : 1}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 13,
        paddingHorizontal: 14,
        borderBottomWidth: isLast ? 0 : 0.5,
        borderBottomColor: borderColor,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 11, flex: 1 }}>
        <View
          style={{
            width: 28, height: 28, borderRadius: 8, backgroundColor: iconBg,
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          {icon}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 13 * scale, color: textColor }}>{title}</Text>
          {subtitle && (
            <Text style={{ fontSize: 11 * scale, color: subColor, marginTop: 1 }}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {right}
    </Container>
  );
};

interface ChipGroupProps {
  options: { value: string; label: string }[];
  active: string;
  onSelect: (value: string) => void;
  inactiveBg: string;
  inactiveColor: string;
  scale: number;
}
const ChipGroup = ({ options, active, onSelect, inactiveBg, inactiveColor, scale }: ChipGroupProps) => (
  <View style={{ flexDirection: 'row', gap: 6 }}>
    {options.map(opt => {
      const isActive = opt.value === active;
      return (
        <TouchableOpacity
          key={opt.value}
          onPress={() => onSelect(opt.value)}
          activeOpacity={0.7}
          style={{
            paddingVertical: 5,
            paddingHorizontal: 11,
            borderRadius: 8,
            backgroundColor: isActive ? ORANGE : inactiveBg,
          }}
        >
          <Text style={{
            fontSize: 11 * scale,
            fontWeight: '500',
            color: isActive ? '#fff' : inactiveColor,
          }}>
            {opt.label}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

// Lista das seções dos termos (chaves do i18n)
const TERMS_SECTIONS = [
  'intro', 'academic', 'usage', 'dataCollection',
  'dataUsage', 'userRights', 'responsibility', 'changes', 'contact',
] as const;

// ── View ──────────────────────────────────────────────────────────────────────

export const SettingsView: React.FC = () => {
  const vm = useSettingsViewModel();
  const { colors, fontScale: scale, isDark, t } = vm;

  // Cores derivadas
  const cardBg = isDark ? '#17181B' : '#fff';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const headerBg = isDark ? '#17181B' : '#fff';
  const screenBg = isDark ? '#0B0B0D' : '#F5F5F5';
  const sectionLabelColor = isDark ? '#9CA3AF' : '#6B7280';
  const subColor = isDark ? '#9CA3AF' : '#6B7280';
  const chevronColor = isDark ? '#6B7280' : '#9CA3AF';
  const inactiveChipBg = isDark ? '#27282C' : '#F3F4F6';
  const inactiveChipColor = isDark ? '#9CA3AF' : '#6B7280';

  // Cores dos ícones por seção
  const iconAppearanceBg = isDark ? '#3A2412' : '#FFEEDB';
  const iconAppearanceColor = isDark ? '#FFB37A' : '#FF662A';
  const iconLanguageBg = isDark ? '#0F2540' : '#E6F1FB';
  const iconLanguageColor = isDark ? '#85B7EB' : '#185FA5';
  const iconAboutBg = isDark ? '#231F45' : '#EEEDFE';
  const iconAboutColor = isDark ? '#AFA9EC' : '#534AB7';
  const iconTermsBg = isDark ? '#27282C' : '#F1EFE8';
  const iconTermsColor = isDark ? '#B4B2A9' : '#5F5E5A';

  const fontSizeOptions = [
    { value: 'small' as FontSize, label: t('settings.fontSizes.small') },
    { value: 'medium' as FontSize, label: t('settings.fontSizes.medium') },
    { value: 'large' as FontSize, label: t('settings.fontSizes.large') },
  ];

  const languageOptions = [
    { value: 'pt' as Language, label: t('settings.languages.pt') },
    { value: 'en' as Language, label: t('settings.languages.en') },
  ];

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: screenBg }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={headerBg} />

      {/* Header com botão voltar */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: headerBg,
        borderBottomWidth: 0.5,
        borderBottomColor: borderColor,
      }}>
        <TouchableOpacity
          onPress={vm.handleBack}
          activeOpacity={0.7}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
        >
          <BackIcon color={colors.text} />
          <Text style={{ fontSize: 16 * scale, fontWeight: '500', color: colors.text }}>
            {t('settings.title')}
          </Text>
        </TouchableOpacity>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        style={{ flex: 1, backgroundColor: screenBg }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* ── Aparência ───────────────────────────── */}
        <SectionLabel text={t('settings.sections.appearance')} color={sectionLabelColor} scale={scale} />
        <View style={{
          marginHorizontal: 12,
          borderRadius: 12,
          overflow: 'hidden',
          backgroundColor: cardBg,
          borderWidth: 0.5,
          borderColor: borderColor,
        }}>
          <Row
            icon={<ThemeIcon color={iconAppearanceColor} />}
            iconBg={iconAppearanceBg}
            title={t('settings.items.darkMode')}
            subtitle={t('settings.items.darkModeSubtitle')}
            textColor={colors.text}
            subColor={subColor}
            scale={scale}
            borderColor={borderColor}
            right={
              <Switch
                value={isDark}
                onValueChange={vm.toggleDarkMode}
                trackColor={{ false: '#D1D5DB', true: ORANGE }}
                thumbColor="#fff"
              />
            }
          />
          <Row
            icon={<FontIcon color={iconAppearanceColor} />}
            iconBg={iconAppearanceBg}
            title={t('settings.items.fontSize')}
            textColor={colors.text}
            subColor={subColor}
            scale={scale}
            isLast
            borderColor={borderColor}
            right={
              <ChipGroup
                options={fontSizeOptions}
                active={vm.currentFontSize}
                onSelect={(v) => vm.handleSelectFontSize(v as FontSize)}
                inactiveBg={inactiveChipBg}
                inactiveColor={inactiveChipColor}
                scale={scale}
              />
            }
          />
        </View>

        {/* ── Idioma ──────────────────────────────── */}
        <SectionLabel text={t('settings.sections.language')} color={sectionLabelColor} scale={scale} />
        <View style={{
          marginHorizontal: 12,
          borderRadius: 12,
          overflow: 'hidden',
          backgroundColor: cardBg,
          borderWidth: 0.5,
          borderColor: borderColor,
        }}>
          <Row
            icon={<LanguageIcon color={iconLanguageColor} />}
            iconBg={iconLanguageBg}
            title={t('settings.items.appLanguage')}
            textColor={colors.text}
            subColor={subColor}
            scale={scale}
            isLast
            borderColor={borderColor}
            right={
              <ChipGroup
                options={languageOptions}
                active={vm.currentLanguage}
                onSelect={(v) => vm.handleSelectLanguage(v as Language)}
                inactiveBg={inactiveChipBg}
                inactiveColor={inactiveChipColor}
                scale={scale}
              />
            }
          />
        </View>

        {/* ── Sobre ───────────────────────────────── */}
        <SectionLabel text={t('settings.sections.about')} color={sectionLabelColor} scale={scale} />
        <View style={{
          marginHorizontal: 12,
          borderRadius: 12,
          overflow: 'hidden',
          backgroundColor: cardBg,
          borderWidth: 0.5,
          borderColor: borderColor,
          marginBottom: 16,
        }}>
          <Row
            icon={<InfoIcon color={iconAboutColor} />}
            iconBg={iconAboutBg}
            title={t('settings.items.aboutApp')}
            textColor={colors.text}
            subColor={subColor}
            scale={scale}
            onPress={vm.openAbout}
            borderColor={borderColor}
            right={<ChevronIcon color={chevronColor} />}
          />
          <Row
            icon={<TermsIcon color={iconTermsColor} />}
            iconBg={iconTermsBg}
            title={t('settings.items.termsAndPrivacy')}
            textColor={colors.text}
            subColor={subColor}
            scale={scale}
            isLast
            onPress={vm.openTerms}
            borderColor={borderColor}
            right={<ChevronIcon color={chevronColor} />}
          />
        </View>

        {/* ── Card final com info da Unifor ────────── */}
        <View style={{
          marginHorizontal: 12,
          padding: 16,
          borderRadius: 12,
          backgroundColor: cardBg,
          borderWidth: 0.5,
          borderColor: borderColor,
          alignItems: 'center',
        }}>
          <Text style={{
            fontSize: 11 * scale,
            fontWeight: '500',
            letterSpacing: 3,
            color: ORANGE,
            marginBottom: 4,
          }}>
            MERCADIM
          </Text>
          <Text style={{ fontSize: 10 * scale, color: subColor }}>
            {t('settings.about.version')} 1.0.0
          </Text>
          <Text style={{
            fontSize: 10 * scale,
            color: subColor,
            marginTop: 6,
            textAlign: 'center',
            lineHeight: 14 * scale,
          }}>
            {t('settings.about.project')}{'\n'}
            {t('settings.about.university')} · 2026
          </Text>
        </View>
      </ScrollView>

      {/* ── Modal "Sobre o app" (continua igual) ─── */}
      <Modal
        visible={vm.aboutModalVisible}
        transparent
        animationType="fade"
        onRequestClose={vm.closeAbout}
      >
        <Pressable
          onPress={vm.closeAbout}
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            padding: 28,
          }}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              backgroundColor: cardBg,
              borderRadius: 20,
              padding: 24,
              alignItems: 'center',
            }}
          >
            <Text style={{
              fontSize: 12 * scale,
              fontWeight: '500',
              letterSpacing: 3,
              color: ORANGE,
              marginBottom: 12,
            }}>
              MERCADIM
            </Text>

            <Text style={{
              fontSize: 18 * scale,
              fontWeight: '700',
              color: colors.text,
              marginBottom: 8,
              textAlign: 'center',
            }}>
              {t('settings.items.aboutApp')}
            </Text>

            <Text style={{
              fontSize: 13 * scale,
              color: subColor,
              textAlign: 'center',
              lineHeight: 20 * scale,
              marginBottom: 16,
            }}>
              {t('settings.about.description')}
            </Text>

            <View style={{
              width: '100%',
              borderTopWidth: 0.5,
              borderTopColor: borderColor,
              paddingTop: 14,
              alignItems: 'center',
              gap: 4,
            }}>
              <Text style={{ fontSize: 12 * scale, color: subColor }}>
                {t('settings.about.version')} 1.0.0
              </Text>
              <Text style={{ fontSize: 12 * scale, color: subColor, textAlign: 'center' }}>
                {t('settings.about.project')}
              </Text>
              <Text style={{ fontSize: 12 * scale, color: subColor, textAlign: 'center' }}>
                {t('settings.about.university')}
              </Text>
            </View>

            <TouchableOpacity
              onPress={vm.closeAbout}
              activeOpacity={0.8}
              style={{
                marginTop: 20,
                backgroundColor: ORANGE,
                paddingVertical: 12,
                paddingHorizontal: 32,
                borderRadius: 14,
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 * scale }}>
                {t('settings.about.close')}
              </Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* ── Modal "Termos e Privacidade" — CORRIGIDO ─ */}
      {/*
        ESTRUTURA NOVA:
        - View raiz preenche tela toda
        - TouchableOpacity transparente em cima funciona como overlay clicável
        - View do bottom-sheet em baixo, sem Pressable engolindo o scroll
      */}
      <Modal
        visible={vm.termsModalVisible}
        transparent
        animationType="slide"
        onRequestClose={vm.closeTerms}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          {/* Overlay clicável em cima — fecha quando toca fora */}
          <TouchableOpacity
            activeOpacity={1}
            onPress={vm.closeTerms}
            style={{ flex: 1 }}
          />

          {/* Bottom-sheet (View pura, não captura toques do scroll) */}
          <View
            style={{
              backgroundColor: cardBg,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              maxHeight: '85%',
              paddingTop: 8,
            }}
          >
            {/* Drag indicator */}
            <View style={{ alignItems: 'center', paddingVertical: 8 }}>
              <View style={{
                width: 40, height: 4, borderRadius: 2,
                backgroundColor: isDark ? '#3F4046' : '#D1D5DB',
              }} />
            </View>

            {/* Header do modal */}
            <View style={{
              paddingHorizontal: 24,
              paddingTop: 8,
              paddingBottom: 16,
              borderBottomWidth: 0.5,
              borderBottomColor: borderColor,
            }}>
              <Text style={{
                fontSize: 20 * scale,
                fontWeight: '700',
                color: colors.text,
                marginBottom: 4,
              }}>
                {t('settings.terms.title')}
              </Text>
              <Text style={{ fontSize: 11 * scale, color: subColor }}>
                {t('settings.terms.lastUpdate')}
              </Text>
            </View>

            {/* Conteúdo scrollável dos termos */}
            <ScrollView
              style={{ paddingHorizontal: 24 }}
              contentContainerStyle={{ paddingTop: 16, paddingBottom: 16 }}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled
            >
              {TERMS_SECTIONS.map((section) => (
                <View key={section} style={{ marginBottom: 18 }}>
                  <Text style={{
                    fontSize: 14 * scale,
                    fontWeight: '700',
                    color: colors.text,
                    marginBottom: 6,
                  }}>
                    {t(`settings.terms.sections.${section}.title`)}
                  </Text>
                  <Text style={{
                    fontSize: 13 * scale,
                    color: subColor,
                    lineHeight: 20 * scale,
                  }}>
                    {t(`settings.terms.sections.${section}.text`)}
                  </Text>
                </View>
              ))}
            </ScrollView>

            {/* Botão fechar fixo no fim */}
            <View style={{
              padding: 20,
              borderTopWidth: 0.5,
              borderTopColor: borderColor,
            }}>
              <TouchableOpacity
                onPress={vm.closeTerms}
                activeOpacity={0.8}
                style={{
                  backgroundColor: ORANGE,
                  paddingVertical: 14,
                  borderRadius: 14,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 * scale }}>
                  {t('settings.terms.close')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};