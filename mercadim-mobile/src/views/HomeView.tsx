import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator, RefreshControl, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { formatCurrency } from '@/utils';
import { useSettings } from '@/contexts/SettingsContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useRouter } from 'expo-router'; 

interface SaleItem {
  name: string;
  quantity: number;
  color: string;
}

interface HomeViewProps {
  username: string;
  profilePhotoUrl?: string | null;
  totalSales: number;
  itemsSold: number;
  itemsReceived: number;
  averageTicket: number;
  salesItems: SaleItem[];
  unreadCount?: number;
  latestNotification?: { title: string; description: string } | null;
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  onSettingsPress: () => void;
  onReportPress: () => void;
}

const UserIcon = ({ color = '#9CA3AF' }: { color?: string }) => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.8" />
    <Path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </Svg>
);

const SettingsIcon = ({ color = '#374151' }: { color?: string }) => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 15a3 3 0 100-6 3 3 0 000 6z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);


const NotificationIcon = ({ color = '#374151' }: { color?: string }) => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9 17a3 3 0 006 0"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </Svg>
);

const ReportIcon = ({ color = '#374151' }: { color?: string }) => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="3" width="18" height="18" rx="3" stroke={color} strokeWidth="1.6" />
    <Path d="M8 8h8M8 12h8M8 16h5" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
  </Svg>
);

const SummaryCard = ({ value, label, color, fontScale }: { value: string; label: string; color: string; fontScale: number }) => (
  <View style={{
    flex: 1,
    backgroundColor: color,
    borderRadius: 16,
    padding: 14,
    minHeight: 80,
    justifyContent: 'flex-end',
  }}>
    <Text style={{ color: '#fff', fontSize: 17 * fontScale, fontWeight: '800', marginBottom: 2 }}>{value}</Text>
    <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 10 * fontScale, lineHeight: 13 }}>{label}</Text>
  </View>
);

export const HomeView: React.FC<HomeViewProps> = ({
  username,
  profilePhotoUrl,
  totalSales,
  itemsSold,
  itemsReceived,
  averageTicket,
  salesItems,
  unreadCount = 0,
  latestNotification = null,
  loading = false,
  error = null,
  onRefresh,
  onSettingsPress,
  onReportPress,
}) => {
  const { isDark, fontScale } = useSettings();
  const { t } = useTranslation();

  const router = useRouter(); 
  
  const [showNotificationPopup, setShowNotificationPopup] = React.useState(false);

  React.useEffect(() => {
    if (latestNotification) {
      setShowNotificationPopup(true);
      const timer = setTimeout(() => {
        setShowNotificationPopup(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [latestNotification]);

  const screenBg = isDark ? '#0B0B0D' : '#fff';
  const contentBg = isDark ? '#0B0B0D' : '#F5F5F5';
  const cardBg = isDark ? '#17181B' : '#fff';
  const cardBorder = isDark ? 'rgba(255,255,255,0.06)' : '#E5E7EB';
  const textColor = isDark ? '#F3F4F6' : '#111827';
  const subTextColor = isDark ? '#9CA3AF' : '#6B7280';
  const labelColor = isDark ? '#9CA3AF' : '#9CA3AF';
  const iconBtnBg = isDark ? '#27282C' : '#F3F4F6';
  const iconColor = isDark ? '#D1D5DB' : '#374151';
  const dividerColor = isDark ? 'rgba(255,255,255,0.06)' : '#F3F4F6';
  const emptyIconBg = isDark ? '#3A2412' : '#FFF7ED';

  const hasSales = salesItems.length > 0 && salesItems.some(i => i.quantity > 0);
  const totalQuantity = salesItems.reduce((sum, item) => sum + item.quantity, 0);

  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    if (onRefresh) {
      setRefreshing(true);
      await onRefresh();
      setRefreshing(false);
    }
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: screenBg }}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={screenBg} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#FF662A" />
          <Text style={{ marginTop: 12, fontSize: 14 * fontScale, color: subTextColor }}>{t('home.loadingData')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: screenBg }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={screenBg} />

      <View style={{
        backgroundColor: screenBg,
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{
            width: 42, height: 42, borderRadius: 21,
            backgroundColor: iconBtnBg,
            alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}>
            {profilePhotoUrl ? (
              <Image
                source={{ uri: profilePhotoUrl }}
                style={{ width: 42, height: 42 }}
              />
            ) : (
              <UserIcon />
            )}
          </View>
          <View>
            <Text style={{ fontSize: 12 * fontScale, color: labelColor }}>{t('home.greeting')}</Text>
            <Text style={{ fontSize: 16 * fontScale, fontWeight: '700', color: textColor }}>
              {username || t('home.user')}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity
            onPress={() => router.push('/notifications' as any)}
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              backgroundColor: iconBtnBg,
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
            activeOpacity={0.7}
          >
            <NotificationIcon color={iconColor} />

            {unreadCount > 0 && (
              <View style={{
                position: 'absolute',
                top: -4,
                right: -4,
                backgroundColor: '#EF4444',
                borderRadius: 10,
                minWidth: 16,
                height: 16,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 4,
              }}>
                <Text style={{ color: '#fff', fontSize: 10 * fontScale, fontWeight: '700' }}>
                  {unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onSettingsPress}
            style={{
              width: 42, height: 42, borderRadius: 12,
              backgroundColor: iconBtnBg,
              alignItems: 'center', justifyContent: 'center',
            }}
            activeOpacity={0.7}
          >
            <SettingsIcon color={iconColor} />
          </TouchableOpacity>
        </View>
      </View>

      {showNotificationPopup && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 999,
          paddingHorizontal: 24,
        }}>
          <View style={{
            width: '100%',
            backgroundColor: cardBg,
            borderRadius: 20,
            padding: 20,
            borderWidth: 1,
            borderColor: cardBorder,
          }}>

            <TouchableOpacity
              onPress={() => setShowNotificationPopup(false)}
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                width: 28,
                height: 28,
                borderRadius: 14,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              activeOpacity={0.7}
            >
              <Text style={{ color: subTextColor, fontSize: 18 * fontScale, fontWeight: '700' }}>
                ×
              </Text>
            </TouchableOpacity>

            <Text style={{
              color: textColor,
              fontSize: 16 * fontScale,
              fontWeight: '800',
              marginBottom: 8,
              paddingRight: 28,
            }}>
              {latestNotification?.type === 'venda' ? t('notifications.saleTitle') : 
               latestNotification?.type === 'estoque_baixo' ? t('notifications.lowStockTitle') :
               latestNotification?.type === 'estoque_entrada' ? t('notifications.estoqueEntradaTitle') :
               latestNotification?.title}
            </Text>

            <Text style={{
              color: subTextColor,
              fontSize: 13 * fontScale,
              lineHeight: 20,
            }}>
              {latestNotification?.type === 'venda' ? t('notifications.saleDesc') :
               latestNotification?.type === 'estoque_baixo' ? t('notifications.lowStockDesc', { name: latestNotification?.description }) :
               latestNotification?.type === 'estoque_entrada' ? t('notifications.estoqueEntradaDesc', { name: latestNotification?.description }) :
               latestNotification?.description}
            </Text>
          </View>
        </View>
      )}

      <ScrollView
        style={{ flex: 1, backgroundColor: contentBg }}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#FF662A']}
            tintColor="#FF662A"
          />
        }
      >
        {error && (
          <View style={{
            backgroundColor: isDark ? '#3F1212' : '#FEE2E2',
            borderRadius: 12,
            padding: 14,
            marginBottom: 16,
            borderLeftWidth: 4,
            borderLeftColor: '#EF4444',
          }}>
            <Text style={{ fontSize: 13 * fontScale, fontWeight: '600', color: isDark ? '#FCA5A5' : '#991B1B', marginBottom: 4 }}>
              {t('home.errorLoading')}
            </Text>
            <Text style={{ fontSize: 12 * fontScale, color: isDark ? '#F87171' : '#7F1D1D' }}>{error}</Text>
          </View>
        )}

        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
          <SummaryCard value={formatCurrency(totalSales)} label={t('home.totalSales')} color="#FF8C3A" fontScale={fontScale} />
          <SummaryCard value={`${itemsSold} Unid.`} label={t('home.itemsSold')} color="#FCA53A" fontScale={fontScale} />
        </View>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
          <SummaryCard value={`${itemsReceived} Unid.`} label={t('home.itemsReceived')} color="#FF7A2A" fontScale={fontScale} />
          <SummaryCard value={formatCurrency(averageTicket)} label={t('home.averageTicket')} color="#FFB84A" fontScale={fontScale} />
        </View>

        <TouchableOpacity
          onPress={onReportPress}
          style={{
            backgroundColor: cardBg,
            borderRadius: 14,
            padding: 14,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: cardBorder,
          }}
          activeOpacity={0.7}
        >
          <ReportIcon color={iconColor} />
          <Text style={{ fontSize: 14 * fontScale, fontWeight: '600', color: isDark ? '#D1D5DB' : '#374151' }}>
            {t('home.salesReport')}
          </Text>
        </TouchableOpacity>

        {hasSales ? (
          <View style={{ backgroundColor: cardBg, borderRadius: 16, padding: 16, borderWidth: 0.5, borderColor: cardBorder }}>
            <Text style={{ fontSize: 15 * fontScale, fontWeight: '800', color: textColor, marginBottom: 12 }}>
              {t('home.productSales')}
            </Text>
            <View style={{ height: 10, borderRadius: 5, overflow: 'hidden', flexDirection: 'row', marginBottom: 10 }}>
              {salesItems.map((item, index) => (
                <View key={index} style={{ flex: item.quantity / totalQuantity, backgroundColor: item.color }} />
              ))}
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
              {salesItems.map((item, index) => (
                <View key={index} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: item.color }} />
                  <Text style={{ fontSize: 11 * fontScale, color: subTextColor }}>{item.name}</Text>
                </View>
              ))}
            </View>
            <View style={{ borderTopWidth: 1, borderTopColor: dividerColor }}>
              {salesItems.map((item, index) => (
                <View key={index} style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingVertical: 10,
                  borderBottomWidth: index < salesItems.length - 1 ? 1 : 0,
                  borderBottomColor: dividerColor,
                }}>
                  <Text style={{ fontSize: 14 * fontScale, fontWeight: '600', color: textColor }}>{item.name}</Text>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 14 * fontScale, fontWeight: '700', color: textColor }}>{item.quantity}</Text>
                    <Text style={{ fontSize: 10 * fontScale, color: labelColor }}>{t('home.sales')}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={{ backgroundColor: cardBg, borderRadius: 16, padding: 28, alignItems: 'center', borderWidth: 0.5, borderColor: cardBorder }}>
            <View style={{
              width: 52, height: 52, borderRadius: 26,
              backgroundColor: emptyIconBg,
              alignItems: 'center', justifyContent: 'center',
              marginBottom: 12,
            }}>
              <Svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <Rect x="5" y="2" width="14" height="17" rx="2" stroke="#FF662A" strokeWidth="1.8" />
                <Path d="M9 2v2a1 1 0 001 1h4a1 1 0 001-1V2" stroke="#FF662A" strokeWidth="1.8" />
                <Path d="M9 10l1.5 1.5L13 8" stroke="#FF662A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </View>
            <Text style={{ fontSize: 14 * fontScale, fontWeight: '700', color: textColor, marginBottom: 6 }}>
              {t('home.noSales')}
            </Text>
            <Text style={{ fontSize: 12 * fontScale, color: labelColor, textAlign: 'center', lineHeight: 18 }}>
              {t('home.noSalesDescription')}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};