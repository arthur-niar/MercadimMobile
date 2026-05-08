

import React from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  Modal, StatusBar, Image, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useSalesViewModel } from '@/viewmodels/SalesViewModel';
import { CartIcon } from '@/components/cart-icon';
import { CheckIcon } from '@/components/check-icon';
import Svg, { Path, Circle } from 'react-native-svg';
import { router } from 'expo-router';
import { useSettings } from '@/contexts/SettingsContext';
import { useTranslation } from '@/hooks/useTranslation';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, FadeInRight, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const ORANGE = '#FF662A';
const YELLOW = '#FCA537';

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

const PlusIcon = ({ size = 18, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth="3" strokeLinecap="round" />
  </Svg>
);

export const SalesView = () => {
  const vm = useSalesViewModel();
  const { isDark, fontScale } = useSettings();
  const { t } = useTranslation();

  // Cores adaptadas ao tema
  const screenBg = isDark ? '#0B0B0D' : '#fff';
  const contentBg = isDark ? '#0B0B0D' : '#F3F4F6';
  const cardBg = isDark ? '#17181B' : '#fff';
  const cardBorder = isDark ? 'rgba(255,255,255,0.06)' : '#F3F4F6';
  const textColor = isDark ? '#F3F4F6' : '#111827';
  const subTextColor = isDark ? '#9CA3AF' : '#6B7280';
  const labelColor = isDark ? '#9CA3AF' : '#9CA3AF';
  const iconBtnBg = isDark ? '#27282C' : '#F3F4F6';
  const iconColor = isDark ? '#D1D5DB' : '#374151';
  const dividerColor = isDark ? 'rgba(255,255,255,0.08)' : '#eee';
  const chipBg = isDark ? '#27282C' : '#F3F4F6';
  const inputBg = isDark ? '#27282C' : '#F3F4F6';

  const styles = makeStyles({ textColor, subTextColor, labelColor, dividerColor, cardBg, chipBg, inputBg, fontScale });

  const handleFinalize = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await vm.finalizeSale();
  };

  React.useEffect(() => {
    if (vm.successMessage) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [vm.successMessage]);

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
        borderBottomWidth: 1,
        borderBottomColor: cardBorder,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{
            width: 42, height: 42, borderRadius: 21,
            backgroundColor: iconBtnBg,
            alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}>
            {vm.profilePhotoUrl ? (
              <Image 
                source={{ uri: vm.profilePhotoUrl }}
                style={{ width: 42, height: 42 }}
              />
            ) : (
              <UserIcon />
            )}
          </View>
          <View>
            <Text style={{ fontSize: 12 * fontScale, color: labelColor }}>{t('sales.greeting')}</Text>
            <Text style={{ fontSize: 16 * fontScale, fontWeight: '700', color: textColor }}>
              {vm.username || t('sales.user')}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/configuracoes' as any)}
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

      <View style={{ flex: 1, backgroundColor: contentBg }}>
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 140 }}>
          <LinearGradient colors={[ORANGE, YELLOW]} style={styles.summaryCard}>
            <View>
              <Text style={styles.summaryValue}>
                R$ {vm.total.toFixed(2).replace('.', ',')}
              </Text>
              <Text style={styles.summaryLabel}>{t('sales.total')}</Text>
            </View>

            <View>
              <Text style={styles.summaryValue}>{vm.totalItems}</Text>
              <Text style={styles.summaryLabel}>{t('sales.items')}</Text>
            </View>
          </LinearGradient>

          <View style={styles.card}>
            <Text style={styles.title}>{t('sales.yourCart')}</Text>

            {vm.cart.length === 0 ? (
              <View style={styles.empty}>
                <Text style={styles.emptyText}>{t('sales.addProducts')}</Text>
                <CartIcon size={40} color={isDark ? '#6B7280' : '#9CA3AF'} />
              </View>
            ) : (
              vm.cart.map((item, index) => (
                <Animated.View 
                  key={item.id} 
                  entering={FadeInDown.delay(index * 100).springify()}
                  style={styles.item}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.detail}>
                      {t('sales.quantity')}: {item.quantity}
                    </Text>
                  </View>

                  <View style={styles.itemRight}>
                    <Text style={styles.total}>
                      R$ {(item.quantity * item.price).toFixed(2).replace('.', ',')}
                    </Text>

                    <View style={styles.itemActions}>
                      <TouchableOpacity onPress={() => vm.openEditItem(item)}>
                        <Text style={styles.edit}>{t('sales.edit')}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => vm.removeItem(item.id)}>
                        <Text style={styles.remove}>{t('sales.remove')}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Animated.View>
              ))
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <CartIcon color={textColor} size={22} />
            <Text style={styles.footerTotal}>
              R$ {vm.total.toFixed(2).replace('.', ',')}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.finish, vm.cart.length === 0 && { opacity: 0.4 }]}
            onPress={handleFinalize}
            disabled={vm.cart.length === 0}
            activeOpacity={0.7}
          >
            <CheckIcon />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.floating} 
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            vm.openAddProduct();
          }}
        >
          <PlusIcon size={26} />
        </TouchableOpacity>

        <Modal
          visible={vm.isFinalizing || !!vm.successMessage}
          transparent
          animationType="fade"
        >
          <View style={styles.confirmationOverlay}>
            <View style={styles.confirmationBox}>
              {vm.isFinalizing ? (
                <ActivityIndicator size="large" color="#fff" />
              ) : (
                <>
                  <View style={styles.checkCircle}>
                    <CheckIcon size={40} color="#fff" />
                  </View>
                  <Text style={styles.confirmationText}>
                    {vm.successMessage}
                  </Text>
                </>
              )}
            </View>
          </View>
        </Modal>
      </View>

      <Modal visible={vm.modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.title}>
                {vm.editingItem ? t('sales.editProduct') : t('sales.addProduct')}
              </Text>

              <TouchableOpacity onPress={vm.closeModal}>
                <Text style={styles.closeText}>×</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>{t('sales.productLabel')}</Text>

            <View style={styles.productSelector}>
              {vm.products.map((product) => {
                const active = vm.selectedProduct?.id === product.id;

                return (
                  <TouchableOpacity
                    key={product.id}
                    onPress={() => !vm.editingItem && vm.setSelectedProduct(product)}
                    disabled={!!vm.editingItem}
                    style={[
                      styles.productChip,
                      active && { backgroundColor: ORANGE },
                      vm.editingItem && !active && { opacity: 0.35 },
                    ]}
                  >
                    <Text style={{ color: active ? '#fff' : textColor, fontWeight: '700', fontSize: 14 * fontScale }}>
                      {product.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.label}>{t('sales.quantity')}</Text>

            <View style={styles.qtyBox}>
              <TouchableOpacity onPress={vm.decreaseQuantity} style={styles.qtyBtn}>
                <Text style={styles.qtyText}>-</Text>
              </TouchableOpacity>

              <TextInput
                value={vm.quantity}
                onChangeText={vm.setQuantity}
                keyboardType="numeric"
                style={styles.input}
              />

              <TouchableOpacity onPress={vm.increaseQuantity} style={styles.qtyBtn}>
                <PlusIcon size={18} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.addBtn} onPress={vm.addOrUpdateCart}>
              <Text style={styles.addBtnText}>
                {vm.editingItem ? t('sales.saveChange') : t('sales.addBtn')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Styles dinâmicos baseados no tema
const makeStyles = ({ textColor, subTextColor, labelColor, dividerColor, cardBg, chipBg, inputBg, fontScale }: {
  textColor: string;
  subTextColor: string;
  labelColor: string;
  dividerColor: string;
  cardBg: string;
  chipBg: string;
  inputBg: string;
  fontScale: number;
}) => ({
  summaryCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
  },
  summaryValue: {
    color: '#fff',
    fontWeight: '900' as const,
    fontSize: 20 * fontScale,
  },
  summaryLabel: {
    color: '#fff',
    fontSize: 14 * fontScale,
  },
  card: {
    backgroundColor: cardBg,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontWeight: '800' as const,
    marginBottom: 10,
    color: textColor,
    fontSize: 16 * fontScale,
  },
  empty: {
    alignItems: 'center' as const,
    padding: 20,
    gap: 12,
  },
  emptyText: {
    color: labelColor,
    fontSize: 14 * fontScale,
  },
  item: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: dividerColor,
    gap: 12,
  },
  itemRight: {
    alignItems: 'flex-end' as const,
  },
  itemActions: {
    flexDirection: 'row' as const,
    gap: 12,
    marginTop: 4,
  },
  name: {
    fontWeight: '700' as const,
    color: textColor,
    fontSize: 14 * fontScale,
  },
  detail: {
    color: subTextColor,
    fontSize: 12 * fontScale,
    marginTop: 2,
  },
  total: {
    fontWeight: '800' as const,
    color: textColor,
    fontSize: 14 * fontScale,
  },
  edit: {
    color: YELLOW,
    fontSize: 12 * fontScale,
    fontWeight: '700' as const,
  },
  remove: {
    color: ORANGE,
    fontSize: 12 * fontScale,
    fontWeight: '700' as const,
  },
  footer: {
    position: 'absolute' as const,
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: cardBg,
    borderRadius: 20,
    padding: 12,
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  footerTotal: {
    fontWeight: '900' as const,
    color: textColor,
    fontSize: 16 * fontScale,
  },
  finish: {
    backgroundColor: '#22C55E',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  floating: {
    position: 'absolute' as const,
    right: 24,
    bottom: 100,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF662A',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    shadowColor: '#FF662A',
    shadowOpacity: 0.45,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000099',
    justifyContent: 'center' as const,
    padding: 20,
  },
  modal: {
    backgroundColor: cardBg,
    borderRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  closeText: {
    fontSize: 26 * fontScale,
    color: textColor,
    lineHeight: 28,
  },
  label: {
    marginTop: 10,
    marginBottom: 8,
    color: textColor,
    fontWeight: '700' as const,
    fontSize: 14 * fontScale,
  },
  productSelector: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 8,
    marginBottom: 8,
  },
  productChip: {
    backgroundColor: chipBg,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  qtyBox: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginTop: 6,
    backgroundColor: inputBg,
    borderRadius: 14,
    padding: 8,
  },
  qtyBtn: {
    backgroundColor: YELLOW,
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  qtyText: {
    color: '#fff',
    fontSize: 24 * fontScale,
    fontWeight: '900' as const,
    lineHeight: 26,
    includeFontPadding: false,
  },
  input: {
    flex: 1,
    textAlign: 'center' as const,
    fontSize: 20 * fontScale,
    fontWeight: '800' as const,
    color: textColor,
  },
  addBtn: {
    marginTop: 20,
    backgroundColor: YELLOW,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center' as const,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: '700' as const,
    fontSize: 14 * fontScale,
  },
  confirmationOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  confirmationBox: {
    width: 160,
    height: 160,
    backgroundColor: 'rgba(30, 30, 30, 0.95)',
    borderRadius: 28,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  checkCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2.5,
    borderColor: '#fff',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginBottom: 16,
  },
  confirmationText: {
    color: '#fff',
    fontSize: 14 * fontScale,
    fontWeight: '700' as const,
    textAlign: 'center' as const,
    lineHeight: 18,
  },
});