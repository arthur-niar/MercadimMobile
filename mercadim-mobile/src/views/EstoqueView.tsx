// View da tela de Estoque (UI)
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Pressable,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { Product } from '@/models/Product';
import { formatCurrency } from '@/utils';
import { useSettings } from '@/contexts/SettingsContext';
import { useTranslation } from '@/hooks/useTranslation';

// ── Icons ────────────────────────────────────────────────────────────────────

const UserIcon = ({ color = '#9CA3AF' }: { color?: string }) => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.8" />
    <Path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </Svg>
);

const SettingsIcon = ({ color = '#374151' }: { color?: string }) => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <Path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const BagIcon = () => (
  <Svg width="72" height="72" viewBox="0 0 80 80" fill="none">
    <Rect x="14" y="26" width="52" height="44" rx="8" stroke="#D1D5DB" strokeWidth="3" />
    <Path d="M28 26V22a12 12 0 0124 0v4" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round" />
    <Rect x="28" y="38" width="24" height="18" rx="4" stroke="#D1D5DB" strokeWidth="2.5" />
  </Svg>
);

const RefreshIcon = ({ color = '#6B7280' }: { color?: string }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path d="M1 4v6h6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M3.51 15a9 9 0 102.13-9.36L1 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const PlusIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
  </Svg>
);

// ── Sub-components ────────────────────────────────────────────────────────────

const Header = ({
  username,
  profilePhotoUrl,
  onSettingsPress,
  isDark,
  fontScale,
  t,
}: {
  username: string;
  profilePhotoUrl?: string | null;
  onSettingsPress: () => void;
  isDark: boolean;
  fontScale: number;
  t: any;
}) => {
  const headerBg = isDark ? '#0B0B0D' : '#fff';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : '#F3F4F6';
  const avatarBg = isDark ? '#27282C' : '#F3F4F6';
  const labelColor = isDark ? '#9CA3AF' : '#9CA3AF';
  const textColor = isDark ? '#F3F4F6' : '#111827';
  const iconBtnBg = isDark ? '#27282C' : '#F3F4F6';
  const iconColor = isDark ? '#D1D5DB' : '#374151';

  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 16,
      backgroundColor: headerBg,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={{
          width: 42, height: 42, borderRadius: 21,
          backgroundColor: avatarBg,
          alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
        }}>
          {profilePhotoUrl ? (
            <Image 
              source={{ uri: profilePhotoUrl }}
              style={{ width: 42, height: 42 }}
            />
          ) : (
            <UserIcon color={isDark ? '#9CA3AF' : '#9CA3AF'} />
          )}
        </View>
        <View>
          <Text style={{ fontSize: 12 * fontScale, color: labelColor }}>{t('stock.greeting')}</Text>
          <Text style={{ fontSize: 16 * fontScale, fontWeight: '700', color: textColor }}>
            {username || t('stock.user')}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={onSettingsPress}
        activeOpacity={0.7}
        style={{
          width: 42, height: 42, borderRadius: 12,
          backgroundColor: iconBtnBg,
          alignItems: 'center', justifyContent: 'center',
        }}
      >
        <SettingsIcon color={iconColor} />
      </TouchableOpacity>
    </View>
  );
};

const SummaryCardBase = ({ value, label, className }: { value: number; label: string; className: string }) => (
  <View className={`flex-1 rounded-2xl p-3.5 min-h-[80px] justify-end ${className}`}>
    <Text className="text-white text-[22px] font-extrabold mb-0.5">{value}</Text>
    <Text className="text-white/85 text-[10px] leading-[13px]">{label}</Text>
  </View>
);

const ErrorBanner = ({ message, onRetry, t }: { message: string; onRetry: () => void; t: any }) => (
  <View className="mx-4 mt-3 bg-red-50 border-l-4 border-red-400 rounded-xl p-3 flex-row items-center justify-between">
    <Text className="text-xs text-red-700 flex-1 mr-2" numberOfLines={2}>{message}</Text>
    <TouchableOpacity onPress={onRetry} activeOpacity={0.7}>
      <Text className="text-xs font-bold text-red-500">{t('stock.retry')}</Text>
    </TouchableOpacity>
  </View>
);

// ── Props ─────────────────────────────────────────────────────────────────────

interface EstoqueViewProps {
  username: string;
  profilePhotoUrl?: string | null;
  onSettingsPress: () => void;
  onCreatePress: () => void;
  products: Product[];
  loading: boolean;
  error: string | null;
  isEmpty: boolean;
  totalProducts: number;
  lowStockCount: number;
  onEditPress: (product: Product) => void;
  onDeletePress: (id: string) => void;
  onRefresh: () => void;
  onRetry: () => void;
}

// ── View ──────────────────────────────────────────────────────────────────────

export const EstoqueView: React.FC<EstoqueViewProps> = ({
  username,
  profilePhotoUrl,
  onSettingsPress,
  onCreatePress,
  products,
  loading,
  error,
  isEmpty,
  totalProducts,
  lowStockCount,
  onEditPress,
  onDeletePress,
  onRefresh,
  onRetry,
}) => {
  const { t, isDark, fontScale } = useTranslation();
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [menuTop, setMenuTop] = useState(0);
  const rowRefs = useRef<Record<string, View | null>>({});

  // Cores adaptadas ao tema
  const screenBg = isDark ? '#0B0B0D' : '#fff';
  const contentBg = isDark ? '#0B0B0D' : '#F5F5F5';
  const cardBg = isDark ? '#17181B' : '#fff';
  const cardBorder = isDark ? 'rgba(255,255,255,0.06)' : '#F3F4F6';
  const textColor = isDark ? '#F3F4F6' : '#111827';
  const subTextColor = isDark ? '#9CA3AF' : '#6B7280';
  const menuBtnBg = isDark ? '#27282C' : '#F3F4F6';
  const menuBtnColor = isDark ? '#D1D5DB' : '#6B7280';
  const refreshBtnBg = isDark
    ? (loading ? '#1F2024' : '#27282C')
    : (loading ? '#F9FAFB' : '#F3F4F6');

  const openMenu = (id: string) => {
    const ref = rowRefs.current[id];
    if (ref) {
      ref.measure((_x, _y, _w, h, _pageX, pageY) => {
        setMenuTop(pageY + h / 2);
        setMenuOpenId(id);
      });
    }
  };

  const closeMenu = () => setMenuOpenId(null);

  const handleDelete = (id: string) => {
    closeMenu();
    Alert.alert(
      t('stock.confirmDelete'),
      t('stock.confirmDeleteDescription'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => onDeletePress(id) },
      ],
    );
  };

  // ── Loading inicial ────────────────────────────────────────────────────────
  if (loading && products.length === 0) {
    return (
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: screenBg }}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={screenBg} />
        <Header username={username} profilePhotoUrl={profilePhotoUrl} onSettingsPress={onSettingsPress} isDark={isDark} fontScale={fontScale} t={t} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: screenBg }}>
          <ActivityIndicator size="large" color="#FF8C3A" />
          <Text style={{ marginTop: 12, fontSize: 14 * fontScale, color: subTextColor }}>
            {t('stock.loadingProducts')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: screenBg }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={screenBg} />
      <Header username={username} profilePhotoUrl={profilePhotoUrl} onSettingsPress={onSettingsPress} isDark={isDark} fontScale={fontScale} t={t} />

      <View style={{ flex: 1, backgroundColor: contentBg }}>

        {/* ── Estado A — vazio ─────────────────────────────────────────────── */}
        {isEmpty && (
          <ScrollView
            style={{ flex: 1, backgroundColor: contentBg }}
            contentContainerStyle={{ flexGrow: 1, padding: 16, justifyContent: 'center' }}
            showsVerticalScrollIndicator={false}
          >
            {error && <ErrorBanner message={error} onRetry={onRetry} t={t} />}
            <View style={{
              backgroundColor: cardBg,
              borderRadius: 16,
              padding: 32,
              width: '100%',
              alignItems: 'center',
              gap: 20,
              borderWidth: 0.5,
              borderColor: cardBorder,
            }}>
              <Text style={{
                fontSize: 18 * fontScale,
                fontWeight: '800',
                color: textColor,
                textAlign: 'center',
                lineHeight: 24,
              }}>
                {t('stock.noProducts')}
              </Text>
              <BagIcon />
              <TouchableOpacity
                onPress={onCreatePress}
                activeOpacity={0.8}
                style={{
                  backgroundColor: '#FF8C3A',
                  borderRadius: 999,
                  paddingVertical: 12,
                  width: '100%',
                }}
              >
                <Text style={{ color: '#fff', fontSize: 14 * fontScale, fontWeight: '700', textAlign: 'center' }}>
                  {t('stock.addProduct')}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {/* ── Estado C — lista ─────────────────────────────────────────────── */}
        {!isEmpty && (
          <>
            {error && <ErrorBanner message={error} onRetry={onRetry} t={t} />}

            <ScrollView
              style={{ flex: 1, backgroundColor: contentBg }}
              contentContainerStyle={{ paddingBottom: 112 }}
              showsVerticalScrollIndicator={false}
            >
              {/* Cards de resumo */}
              <View className="flex-row gap-3 px-4 pt-4 pb-2">
                <SummaryCardBase value={totalProducts} label={t('stock.totalProducts')} className="bg-orange" />
                <SummaryCardBase value={lowStockCount} label={t('stock.lowStock') + '(<5)'} className="bg-orange-light" />
              </View>

              {/* Cabeçalho da seção */}
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingVertical: 12,
              }}>
                <Text style={{ fontSize: 16 * fontScale, fontWeight: '800', color: textColor }}>
                  Seus Produtos
                </Text>
                <TouchableOpacity
                  onPress={onRefresh}
                  disabled={loading}
                  activeOpacity={0.7}
                  style={{
                    width: 32, height: 32, borderRadius: 8,
                    backgroundColor: refreshBtnBg,
                    alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  {loading
                    ? <ActivityIndicator size="small" color="#FF8C3A" />
                    : <RefreshIcon color={isDark ? '#D1D5DB' : '#6B7280'} />
                  }
                </TouchableOpacity>
              </View>

              {/* Lista de produtos */}
              <View style={{ paddingHorizontal: 16, gap: 8 }}>
                {products.map(item => (
                  <View
                    key={item.id}
                    ref={el => { rowRefs.current[item.id] = el; }}
                    style={{
                      backgroundColor: cardBg,
                      borderRadius: 12,
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderWidth: 0.5,
                      borderColor: cardBorder,
                    }}
                  >
                    <View style={{ flex: 1, marginRight: 12 }}>
                      <Text style={{ fontSize: 14 * fontScale, fontWeight: '700', color: textColor }}>
                        {item.name}
                      </Text>
                      <Text style={{ fontSize: 12 * fontScale, color: subTextColor, marginTop: 2 }}>
                        {formatCurrency(item.price)}
                        {'  |  '}
                        <Text style={item.stock < 5 ? { color: '#EF4444', fontWeight: '700' } : undefined}>
                          {item.stock} {t('stock.units')}
                        </Text>
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => openMenu(item.id)}
                      activeOpacity={0.7}
                      style={{
                        width: 32, height: 32, borderRadius: 8,
                        backgroundColor: menuBtnBg,
                        alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <Text style={{ color: menuBtnColor, fontSize: 16 * fontScale, fontWeight: '800', letterSpacing: 1 }}>
                        ···
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </ScrollView>

            {/* Backdrop do menu */}
            {menuOpenId !== null && (
              <Pressable className="absolute inset-0 z-40" onPress={closeMenu} />
            )}

            {/* Popup do menu */}
            {menuOpenId !== null && (
              <View
                style={{
                  position: 'absolute',
                  right: 16,
                  top: menuTop,
                  backgroundColor: cardBg,
                  borderRadius: 12,
                  overflow: 'hidden',
                  zIndex: 50,
                  borderWidth: 0.5,
                  borderColor: cardBorder,
                  shadowColor: '#000',
                  shadowOpacity: 0.12,
                  shadowRadius: 12,
                  shadowOffset: { width: 0, height: 4 },
                  elevation: 8,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    const product = products.find(p => p.id === menuOpenId);
                    closeMenu();
                    if (product) onEditPress(product);
                  }}
                  activeOpacity={0.7}
                  style={{
                    paddingHorizontal: 24,
                    paddingVertical: 12,
                    borderBottomWidth: 0.5,
                    borderBottomColor: cardBorder,
                  }}
                >
                  <Text style={{ fontSize: 14 * fontScale, fontWeight: '600', color: textColor }}>
                    {t('stock.edit')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(menuOpenId)}
                  activeOpacity={0.7}
                  style={{ paddingHorizontal: 24, paddingVertical: 12 }}
                >
                  <Text style={{ fontSize: 14 * fontScale, fontWeight: '600', color: '#EF4444' }}>
                    {t('stock.delete')}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* FAB */}
            <TouchableOpacity
              onPress={onCreatePress}
              activeOpacity={0.85}
              style={{
                position: 'absolute',
                bottom: 24,
                right: 20,
                width: 56,
                height: 56,
                backgroundColor: '#FF662A',
                borderRadius: 28,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#FF662A',
                shadowOpacity: 0.45,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 4 },
                elevation: 8,
              }}
            >
              <PlusIcon />
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};