import React from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  Modal, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSalesViewModel } from '@/viewmodels/SalesViewModel';
import { CartIcon } from '@/components/cart-icon';
import { CheckIcon } from '@/components/check-icon';
import Svg, { Path } from 'react-native-svg';
import { router } from 'expo-router';

const ORANGE = '#FF662A';
const YELLOW = '#FCA537';
const BG = '#F3F4F6';
const DARK = '#111827';
const GRAY = '#6B7280';

const SettingsIcon = () => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <Path d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" stroke="#4B5563" strokeWidth="1.8" />
    <Path d="M19.4 15a1.7 1.7 0 00.34 1.87l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.7 1.7 0 00-1.87-.34 1.7 1.7 0 00-1 1.55V21a2 2 0 11-4 0v-.09a1.7 1.7 0 00-1-1.55 1.7 1.7 0 00-1.87.34l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.7 1.7 0 00.34-1.87 1.7 1.7 0 00-1.55-1H3a2 2 0 110-4h.09a1.7 1.7 0 001.55-1 1.7 1.7 0 00-.34-1.87l-.06-.06a2 2 0 112.83-2.83l.06.06a1.7 1.7 0 001.87.34h.02A1.7 1.7 0 0011 3.09V3a2 2 0 114 0v.09c0 .7.4 1.33 1.02 1.55a1.7 1.7 0 001.87-.34l.06-.06a2 2 0 112.83 2.83l-.06.06a1.7 1.7 0 00-.34 1.87v.02c.22.62.85 1.02 1.55 1.02H21a2 2 0 110 4h-.09c-.7 0-1.33.4-1.55 1z" stroke="#4B5563" strokeWidth="1.5" />
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
    <View style={{ flex: 1, backgroundColor: BG }}>
      <StatusBar barStyle="dark-content" />

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 140 }}>
        <View style={styles.header}>
          <View>
            <Text style={styles.hello}>Olá,</Text>
            <Text style={styles.userName}>Usuário Teste</Text>
          </View>

          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => router.push('/(tabs)/perfil' as any)}
          >
            <SettingsIcon />
          </TouchableOpacity>
        </View>

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
    </View>
  );
};

const styles = {
  header: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  hello: {
    color: '#9CA3AF',
  },
  userName: {
    fontSize: 18,
    fontWeight: '800' as const,
    color: DARK,
  },
  settingsButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
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
    top: 55,
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