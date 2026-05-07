import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StatusBar, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { useSettings } from '@/contexts/SettingsContext';
import { useNotificationsViewModel } from '@/viewmodels/NotificationsViewModel';
import { useTranslation } from '@/hooks/useTranslation';

const BackIcon = ({ color = '#374151' }: { color?: string }) => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 18l-6-6 6-6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const TrashIcon = ({ color = '#EF4444' }: { color?: string }) => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const NotificationsView: React.FC = () => {
  const router = useRouter();
  const viewModel = useNotificationsViewModel();
  const { isDark } = useSettings();
  const { t } = useTranslation();

  const screenBg = isDark ? '#0B0B0D' : '#fff';
  const contentBg = isDark ? '#0B0B0D' : '#F5F5F5';
  const cardBg = isDark ? '#17181B' : '#fff';
  const cardBorder = isDark ? 'rgba(255,255,255,0.06)' : '#E5E7EB';
  const textColor = isDark ? '#F3F4F6' : '#111827';
  const subTextColor = isDark ? '#9CA3AF' : '#6B7280';
  const iconBtnBg = isDark ? '#27282C' : '#F3F4F6';
  const iconColor = isDark ? '#D1D5DB' : '#374151';

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
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              backgroundColor: iconBtnBg,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            activeOpacity={0.7}
          >
            <BackIcon color={iconColor} />
          </TouchableOpacity>

          <View>
            <Text style={{ fontSize: 20, fontWeight: '800', color: textColor }}>
              {t('notifications.title')}
            </Text>
            <Text style={{ fontSize: 12, color: subTextColor }}>
              {t('notifications.subtitle')}
            </Text>
          </View>
        </View>

        {viewModel.notifications.length > 0 && (
          <TouchableOpacity
            onPress={viewModel.clearAllNotifications}
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              backgroundColor: isDark ? 'rgba(239, 68, 68, 0.1)' : '#FEE2E2',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            activeOpacity={0.7}
          >
            <TrashIcon />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={{ flex: 1, backgroundColor: contentBg }}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {viewModel.notifications.length === 0 ? (
          <View style={{
            backgroundColor: cardBg,
            borderRadius: 16,
            padding: 28,
            alignItems: 'center',
            borderWidth: 0.5,
            borderColor: cardBorder,
          }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: textColor, marginBottom: 6 }}>
              {t('notifications.none')}
            </Text>
            <Text style={{ fontSize: 12, color: subTextColor, textAlign: 'center' }}>
              {t('notifications.noneDesc')}
            </Text>
          </View>
        ) : (
          viewModel.notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              onPress={() => viewModel.openNotification(notification)}
              activeOpacity={0.75}
              style={{
                backgroundColor: cardBg,
                borderRadius: 16,
                padding: 16,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: notification.read ? cardBorder : '#FFB084',
                borderLeftWidth: 4,
                borderLeftColor: notification.read ? cardBorder : '#FF662A',
              }}
            >
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 12,
              }}>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 14,
                    fontWeight: notification.read ? '600' : '800',
                    color: textColor,
                    marginBottom: 4,
                  }}>
                    {notification.type === 'venda' ? t('notifications.saleTitle') : 
                     notification.type === 'estoque_baixo' ? t('notifications.lowStockTitle') :
                     notification.type === 'estoque_entrada' ? t('notifications.estoqueEntradaTitle') :
                     notification.title}
                  </Text>

                  <Text style={{ fontSize: 12, color: subTextColor, lineHeight: 18 }}>
                    {notification.type === 'venda' ? t('notifications.saleDesc') :
                     notification.type === 'estoque_baixo' ? t('notifications.lowStockDesc', { name: notification.description }) :
                     notification.type === 'estoque_entrada' ? t('notifications.estoqueEntradaDesc', { name: notification.description }) :
                     notification.description}
                  </Text>

                  <Text style={{ fontSize: 11, color: subTextColor, marginTop: 8 }}>
                    {notification.date}
                  </Text>
                </View>

                {!notification.read && (
                  <View style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: '#FF662A',
                    marginTop: 4,
                  }} />
                )}
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <Modal
        visible={!!viewModel.selectedNotification}
        transparent
        animationType="fade"
        onRequestClose={viewModel.closeNotification}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.45)',
          justifyContent: 'center',
          padding: 24,
        }}>
          <View style={{
            backgroundColor: cardBg,
            borderRadius: 20,
            padding: 20,
            borderWidth: 1,
            borderColor: cardBorder,
          }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: textColor, marginBottom: 8 }}>
              {viewModel.selectedNotification?.type === 'venda' ? t('notifications.saleTitle') : 
               viewModel.selectedNotification?.type === 'estoque_baixo' ? t('notifications.lowStockTitle') :
               viewModel.selectedNotification?.type === 'estoque_entrada' ? t('notifications.estoqueEntradaTitle') :
               viewModel.selectedNotification?.title}
            </Text>

            <Text style={{ fontSize: 14, color: subTextColor, lineHeight: 22, marginBottom: 16 }}>
              {viewModel.selectedNotification?.type === 'venda' ? t('notifications.saleDesc') :
               viewModel.selectedNotification?.type === 'estoque_baixo' ? t('notifications.lowStockDesc', { name: viewModel.selectedNotification?.description }) :
               viewModel.selectedNotification?.type === 'estoque_entrada' ? t('notifications.estoqueEntradaDesc', { name: viewModel.selectedNotification?.description }) :
               viewModel.selectedNotification?.description}
            </Text>

            <Text style={{ fontSize: 12, color: subTextColor, marginBottom: 20 }}>
              {viewModel.selectedNotification?.date}
            </Text>

            <TouchableOpacity
              onPress={viewModel.closeNotification}
              style={{
                backgroundColor: '#FF662A',
                borderRadius: 14,
                paddingVertical: 14,
                alignItems: 'center',
              }}
              activeOpacity={0.8}
            >
              <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700' }}>
                {t('notifications.close')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};