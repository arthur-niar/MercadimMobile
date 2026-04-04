import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StatusBar, SafeAreaView, ActivityIndicator, RefreshControl,
} from 'react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

interface SaleItem {
  name: string;
  quantity: number;
  color: string;
}

interface HomeViewProps {
  username: string;
  totalSales: number;
  itemsSold: number;
  itemsReceived: number;
  averageTicket: number;
  salesItems: SaleItem[];
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  onSettingsPress: () => void;
  onReportPress: () => void;
}

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

const ReportIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="3" width="18" height="18" rx="3" stroke="#374151" strokeWidth="1.6" />
    <Path d="M8 8h8M8 12h8M8 16h5" stroke="#374151" strokeWidth="1.6" strokeLinecap="round" />
  </Svg>
);

const SummaryCard = ({ value, label, color }: { value: string; label: string; color: string }) => (
  <View style={{
    flex: 1,
    backgroundColor: color,
    borderRadius: 16,
    padding: 14,
    minHeight: 80,
    justifyContent: 'flex-end',
  }}>
    <Text style={{ color: '#fff', fontSize: 17, fontWeight: '800', marginBottom: 2 }}>{value}</Text>
    <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 10, lineHeight: 13 }}>{label}</Text>
  </View>
);

export const HomeView: React.FC<HomeViewProps> = ({
  username,
  totalSales,
  itemsSold,
  itemsReceived,
  averageTicket,
  salesItems,
  loading = false,
  error = null,
  onRefresh,
  onSettingsPress,
  onReportPress,
}) => {
  const hasSales = salesItems.length > 0 && salesItems.some(i => i.quantity > 0);
  const totalQuantity = salesItems.reduce((sum, item) => sum + item.quantity, 0);

  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

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
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#FF662A" />
          <Text style={{ marginTop: 12, fontSize: 14, color: '#9CA3AF' }}>Carregando dados...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
              {username || 'Usuário'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={onSettingsPress}
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

      <ScrollView
        style={{ flex: 1, backgroundColor: '#F5F5F5' }}
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
            backgroundColor: '#FEE2E2',
            borderRadius: 12,
            padding: 14,
            marginBottom: 16,
            borderLeftWidth: 4,
            borderLeftColor: '#EF4444',
          }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#991B1B', marginBottom: 4 }}>
              Erro ao carregar dados
            </Text>
            <Text style={{ fontSize: 12, color: '#7F1D1D' }}>{error}</Text>
          </View>
        )}

        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
          <SummaryCard value={formatCurrency(totalSales)} label="Vendas Totais (Semana)" color="#FF8C3A" />
          <SummaryCard value={`${itemsSold} Unid.`} label="Itens Vendidos (Semana)" color="#FCA53A" />
        </View>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
          <SummaryCard value={`${itemsReceived} Unid.`} label="Itens Recebidos" color="#FF7A2A" />
          <SummaryCard value={formatCurrency(averageTicket)} label="Ticket Médio" color="#FFB84A" />
        </View>

        <TouchableOpacity
          onPress={onReportPress}
          style={{
            backgroundColor: '#fff',
            borderRadius: 14,
            padding: 14,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: '#E5E7EB',
          }}
          activeOpacity={0.7}
        >
          <ReportIcon />
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151' }}>Relatório de vendas</Text>
        </TouchableOpacity>

        {hasSales ? (
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 16 }}>
            <Text style={{ fontSize: 15, fontWeight: '800', color: '#111827', marginBottom: 12 }}>
              Venda de produto
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
                  <Text style={{ fontSize: 11, color: '#6B7280' }}>{item.name}</Text>
                </View>
              ))}
            </View>
            <View style={{ borderTopWidth: 1, borderTopColor: '#F3F4F6' }}>
              {salesItems.map((item, index) => (
                <View key={index} style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingVertical: 10,
                  borderBottomWidth: index < salesItems.length - 1 ? 1 : 0,
                  borderBottomColor: '#F9FAFB',
                }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827' }}>{item.name}</Text>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#111827' }}>{item.quantity}</Text>
                    <Text style={{ fontSize: 10, color: '#9CA3AF' }}>Vendas</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 28, alignItems: 'center' }}>
            <View style={{
              width: 52, height: 52, borderRadius: 26,
              backgroundColor: '#FFF7ED',
              alignItems: 'center', justifyContent: 'center',
              marginBottom: 12,
            }}>
              <Svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <Rect x="5" y="2" width="14" height="17" rx="2" stroke="#FF662A" strokeWidth="1.8" />
                <Path d="M9 2v2a1 1 0 001 1h4a1 1 0 001-1V2" stroke="#FF662A" strokeWidth="1.8" />
                <Path d="M9 10l1.5 1.5L13 8" stroke="#FF662A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </View>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 6 }}>
              Nenhuma venda ainda
            </Text>
            <Text style={{ fontSize: 12, color: '#9CA3AF', textAlign: 'center', lineHeight: 18 }}>
              Registre uma venda para ver o relatório de produtos
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};