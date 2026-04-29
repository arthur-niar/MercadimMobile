import React from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  Modal, StatusBar, SafeAreaView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSalesViewModel } from '@/viewmodels/SalesViewModel';
import { CartIcon } from '@/components/cart-icon';
import { CheckIcon } from '@/components/check-icon';
import Svg, { Path, Circle } from 'react-native-svg';
import { router } from 'expo-router';

const ORANGE = '#FF662A';
const YELLOW = '#FCA537';
const BG = '#F3F4F6';
const DARK = '#111827';
const GRAY = '#6B7280';

const UserIcon = () => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="4" stroke="#9CA3AF" strokeWidth="1.8" />
    <Path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" />
  </Svg>
);

const SettingsIcon = () => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 15a3 3 0 100-6 3 3 0 000 6z"
      stroke="#374151"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
      stroke="#374151"
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />


      <View style={{
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6'
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{
            width: 42, height: 42, borderRadius: 21,
            backgroundColor: '#F3F4F6',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <UserIcon />
          </View>
          <View>
            <Text style={{ fontSize: 12, color: '#9CA3AF' }}>Olá,</Text>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827' }}>
              {vm.username || 'Usuário'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/(tabs)/perfil' as any)}
          style={{
            width: 42, height: 42, borderRadius: 12,
            backgroundColor: '#F3F4F6',
            alignItems: 'center', justifyContent: 'center',
          }}
          activeOpacity={0.7}
        >
          <SettingsIcon />
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, backgroundColor: BG }}>
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 140 }}>
          <LinearGradient colors={[ORANGE, YELLOW]} style={styles.summaryCard}>
            <View>
              <Text style={styles.summaryValue}>
                R$ {vm.total.toFixed(2).replace('.', ',')}
              </Text>
              <Text style={styles.summaryLabel}>Total</Text>
            </View>

            <View>
              <Text style={styles.summaryValue}>{vm.totalItems}</Text>
              <Text style={styles.summaryLabel}>Itens</Text>
            </View>
          </LinearGradient>

          <View style={styles.card}>
            <Text style={styles.title}>Seu carrinho</Text>

            {vm.cart.length === 0 ? (
              <View style={styles.empty}>
                <Text style={styles.emptyText}>Adicione produtos</Text>
                <CartIcon size={40} color="#9CA3AF" />
              </View>
            ) : (
              vm.cart.map((item) => (
                <View key={item.id} style={styles.item}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.detail}>
                      Quantidade: {item.quantity}
                    </Text>
                  </View>

                  <View style={styles.itemRight}>
                    <Text style={styles.total}>
                      R$ {(item.quantity * item.price).toFixed(2).replace('.', ',')}
                    </Text>

                    <View style={styles.itemActions}>
                      <TouchableOpacity onPress={() => vm.openEditItem(item)}>
                        <Text style={styles.edit}>Editar</Text>
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => vm.removeItem(item.id)}>
                        <Text style={styles.remove}>Remover</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <CartIcon color={DARK} size={22} />
            <Text style={styles.footerTotal}>
              R$ {vm.total.toFixed(2).replace('.', ',')}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.finish, vm.cart.length === 0 && { opacity: 0.4 }]}
            onPress={vm.finalizeSale}
            disabled={vm.cart.length === 0}
          >
            <CheckIcon />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.floating} onPress={vm.openAddProduct}>
          <PlusIcon size={26} />
        </TouchableOpacity>

        {vm.successMessage ? (
          <View style={styles.successBox}>
            <Text style={styles.successText}>{vm.successMessage}</Text>
          </View>
        ) : null}
      </View>

      <Modal visible={vm.modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.title}>
                {vm.editingItem ? 'Editar produto' : 'Adicionar produto'}
              </Text>

              <TouchableOpacity onPress={vm.closeModal}>
                <Text style={styles.closeText}>×</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Produto</Text>

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
                    <Text style={{ color: active ? '#fff' : DARK, fontWeight: '700' }}>
                      {product.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.label}>Quantidade</Text>

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
                {vm.editingItem ? 'Salvar alteração' : 'Adicionar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = {
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
    fontSize: 20,
  },
  summaryLabel: {
    color: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontWeight: '800' as const,
    marginBottom: 10,
    color: DARK,
  },
  empty: {
    alignItems: 'center' as const,
    padding: 20,
    gap: 12,
  },
  emptyText: {
    color: '#9CA3AF',
  },
  item: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
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
    color: DARK,
  },
  detail: {
    color: GRAY,
    fontSize: 12,
    marginTop: 2,
  },
  total: {
    fontWeight: '800' as const,
    color: DARK,
  },
  edit: {
    color: YELLOW,
    fontSize: 12,
    fontWeight: '700' as const,
  },
  remove: {
    color: ORANGE,
    fontSize: 12,
    fontWeight: '700' as const,
  },
  footer: {
    position: 'absolute' as const,
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 12,
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  footerTotal: {
    fontWeight: '900' as const,
    color: DARK,
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
    backgroundColor: YELLOW,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  successBox: {
    position: 'absolute' as const,
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: '#22C55E',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center' as const,
  },
  successText: {
    color: '#fff',
    fontWeight: '800' as const,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000055',
    justifyContent: 'center' as const,
    padding: 20,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  closeText: {
    fontSize: 26,
    color: DARK,
    lineHeight: 28,
  },
  label: {
    marginTop: 10,
    marginBottom: 8,
    color: DARK,
    fontWeight: '700' as const,
  },
  productSelector: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 8,
    marginBottom: 8,
  },
  productChip: {
    backgroundColor: '#F3F4F6',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  qtyBox: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginTop: 6,
    backgroundColor: '#F3F4F6',
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
    fontSize: 24,
    fontWeight: '900' as const,
    lineHeight: 26,
    includeFontPadding: false,
  },
  input: {
    flex: 1,
    textAlign: 'center' as const,
    fontSize: 20,
    fontWeight: '800' as const,
    color: DARK,
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
  },
};