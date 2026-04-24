import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { Product } from '@/models/Product';
import { formatCurrency } from '@/utils';

// ── Icons ────────────────────────────────────────────────────────────────────

const UserIcon = () => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="4" stroke="#9CA3AF" strokeWidth="1.8" />
    <Path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" />
  </Svg>
);

const SettingsIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const BagIcon = () => (
  <Svg width="72" height="72" viewBox="0 0 80 80" fill="none">
    <Rect x="14" y="26" width="52" height="44" rx="8" stroke="#D1D5DB" strokeWidth="3" />
    <Path d="M28 26V22a12 12 0 0124 0v4" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round" />
    <Rect x="28" y="38" width="24" height="18" rx="4" stroke="#D1D5DB" strokeWidth="2.5" />
  </Svg>
);

const RefreshIcon = () => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path d="M1 4v6h6" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M3.51 15a9 9 0 102.13-9.36L1 10" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
  onSettingsPress,
}: {
  username: string;
  onSettingsPress: () => void;
}) => (
  <View className="flex-row items-center justify-between px-5 py-4 bg-white border-b border-gray-100">
    <View className="flex-row items-center gap-3">
      <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center">
        <UserIcon />
      </View>
      <View>
        <Text className="text-xs text-gray-400">Olá,</Text>
        <Text className="text-base font-bold text-gray-900">{username || 'Usuário'}</Text>
      </View>
    </View>
    <TouchableOpacity
      onPress={onSettingsPress}
      className="w-10 h-10 rounded-xl bg-gray-100 items-center justify-center"
      activeOpacity={0.7}
    >
      <SettingsIcon />
    </TouchableOpacity>
  </View>
);

const SummaryCardBase = ({ value, label, className }: { value: number; label: string; className: string }) => (
  <View className={`flex-1 rounded-2xl p-3.5 min-h-[80px] justify-end ${className}`}>
    <Text className="text-white text-[22px] font-extrabold mb-0.5">{value}</Text>
    <Text className="text-white/85 text-[10px] leading-[13px]">{label}</Text>
  </View>
);

const ErrorBanner = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <View className="mx-4 mt-3 bg-red-50 border-l-4 border-red-400 rounded-xl p-3 flex-row items-center justify-between">
    <Text className="text-xs text-red-700 flex-1 mr-2" numberOfLines={2}>{message}</Text>
    <TouchableOpacity onPress={onRetry} activeOpacity={0.7}>
      <Text className="text-xs font-bold text-red-500">Tentar novamente</Text>
    </TouchableOpacity>
  </View>
);

// ── Props ─────────────────────────────────────────────────────────────────────

interface EstoqueViewProps {
  username: string;
  onSettingsPress: () => void;
  onCreatePress: () => void;
  products: Product[];
  loading: boolean;
  error: string | null;
  isEmpty: boolean;
  totalProducts: number;
  lowStockCount: number;
  onEditPress: (product: Product) => void;
  onDeletePress: (id: string) => Promise<void>;
  onRefresh: () => void;
  onRetry: () => void;
}

// ── View ──────────────────────────────────────────────────────────────────────

export const EstoqueView: React.FC<EstoqueViewProps> = ({
  username,
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
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [menuTop, setMenuTop] = useState(0);
  const rowRefs = useRef<Record<string, View | null>>({});

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

  const handleDelete = async (id: string) => {
    closeMenu();
    Alert.alert(
      'Excluir produto',
      'Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive', 
          onPress: async () => {
            try {
              await onDeletePress(id);
              // Mostrar mensagem de sucesso
              Alert.alert(
                'Sucesso',
                'Produto excluído com sucesso!',
                [{ text: 'OK' }]
              );
            } catch (error: any) {
              // Mostrar mensagem de erro amigável
              const errorMessage = error.message || 'Não foi possível excluir o produto';
              Alert.alert(
                'Erro ao excluir',
                errorMessage,
                [{ text: 'OK' }]
              );
            }
          }
        },
      ],
    );
  };

  // ── Loading inicial ────────────────────────────────────────────────────────
  if (loading && products.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <Header username={username} onSettingsPress={onSettingsPress} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#FF8C3A" />
          <Text style={{ marginTop: 12, fontSize: 14, color: '#9CA3AF' }}>Carregando produtos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Header username={username} onSettingsPress={onSettingsPress} />

      <View style={{ flex: 1 }}>

        {/* ── Estado A — vazio ─────────────────────────────────────────────── */}
        {isEmpty && (
          <ScrollView
            style={{ flex: 1, backgroundColor: '#F5F5F5' }}
            contentContainerStyle={{ flexGrow: 1, padding: 16, justifyContent: 'center' }}
            showsVerticalScrollIndicator={false}
          >
            {error && <ErrorBanner message={error} onRetry={onRetry} />}
            <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 32, width: '100%', alignItems: 'center', gap: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#111827', textAlign: 'center', lineHeight: 24 }}>
                Crie o seu Primeiro{'\n'}Produto!
              </Text>
              <BagIcon />
              <TouchableOpacity
                onPress={onCreatePress}
                style={{ backgroundColor: '#FF8C3A', borderRadius: 999, paddingVertical: 12, width: '100%' }}
                activeOpacity={0.8}
              >
                <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700', textAlign: 'center' }}>Criar Produto</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {/* ── Estado C — lista ─────────────────────────────────────────────── */}
        {!isEmpty && (
          <>
            {error && <ErrorBanner message={error} onRetry={onRetry} />}

            <ScrollView
              style={{ flex: 1, backgroundColor: '#F5F5F5' }}
              contentContainerStyle={{ paddingBottom: 180 }}
              showsVerticalScrollIndicator={false}
            >
              {/* Cards de resumo */}
              <View style={{ flexDirection: 'row', gap: 12, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
                <SummaryCardBase value={totalProducts} label="Total de Produtos" className="bg-orange" />
                <SummaryCardBase value={lowStockCount} label="Baixo Estoque(<5)" className="bg-orange-light" />
              </View>

              {/* Cabeçalho da seção */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 }}>
                <Text style={{ fontSize: 16, fontWeight: '800', color: '#111827' }}>Seus Produtos</Text>
                <TouchableOpacity
                  onPress={onRefresh}
                  disabled={loading}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: loading ? '#F9FAFB' : '#F3F4F6'
                  }}
                  activeOpacity={0.7}
                >
                  {loading
                    ? <ActivityIndicator size="small" color="#FF8C3A" />
                    : <RefreshIcon />
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
                      backgroundColor: '#fff',
                      borderRadius: 12,
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: '#F3F4F6'
                    }}
                  >
                    <View style={{ flex: 1, marginRight: 12 }}>
                      <Text style={{ fontSize: 14, fontWeight: '700', color: '#111827' }}>{item.name}</Text>
                      <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>
                        {formatCurrency(item.price)}
                        {'  |  Estoque: '}
                        <Text style={item.stock < 5 ? { color: '#EF4444', fontWeight: '700' } : {}}>
                          {item.stock}
                        </Text>
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => openMenu(item.id)}
                      style={{
                        width: 32,
                        height: 32,
                        backgroundColor: '#F3F4F6',
                        borderRadius: 8,
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={{ color: '#6B7280', fontSize: 16, fontWeight: '800', letterSpacing: 1 }}>
                        ···
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </ScrollView>

            {/* Backdrop do menu */}
            {menuOpenId !== null && (
              <Pressable style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 40 }} onPress={closeMenu} />
            )}

            {/* Popup do menu */}
            {menuOpenId !== null && (
              <View
                style={{
                  position: 'absolute',
                  right: 16,
                  top: menuTop,
                  backgroundColor: '#fff',
                  borderRadius: 12,
                  overflow: 'hidden',
                  zIndex: 50,
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
                  style={{ paddingHorizontal: 24, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}
                  activeOpacity={0.7}
                >
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#1F2937' }}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(menuOpenId)}
                  style={{ paddingHorizontal: 24, paddingVertical: 12 }}
                  activeOpacity={0.7}
                >
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#EF4444' }}>Excluir</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* FAB */}
            <TouchableOpacity
              onPress={onCreatePress}
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
              activeOpacity={0.85}
            >
              <PlusIcon />
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};
