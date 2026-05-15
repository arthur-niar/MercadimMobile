import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSettings } from '@/contexts/SettingsContext';
import { useTranslation } from '@/hooks/useTranslation';
import { formatCurrency } from '@/utils';
import { Product } from '@/models/Product';
import { ProductMovement } from '@/viewmodels/ProductDetailViewModel';



const BackIcon = ({ color }: { color: string }) => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <Path d="M15 18l-6-6 6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const TrendingUpIcon = ({ color }: { color: string }) => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Path d="M23 6l-9.5 9.5-5-5L1 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M17 6h6v6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const TrendingDownIcon = ({ color }: { color: string }) => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Path d="M23 18l-9.5-9.5-5 5L1 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M17 18h6v-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);



const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  
  let d = new Date(dateStr);
  
 
  if (dateStr.length === 10 && dateStr.includes('-')) {
    const [year, month, day] = dateStr.split('-');
    d = new Date(Number(year), Number(month) - 1, Number(day), 8, 0);
  }

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};



interface ProductDetailViewProps {
  product: Product | null;
  history: ProductMovement[];
  loading: boolean;
  error: string | null;
  onBack: () => void;
}



export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  history,
  loading,
  error,
  onBack,
}) => {
  const { isDark, fontScale } = useSettings();
  const { t } = useTranslation();

  const screenBg = isDark ? '#0B0B0D' : '#F5F5F5';
  const headerBg = isDark ? '#17181B' : '#fff';
  const cardBg = isDark ? '#17181B' : '#fff';
  const cardBorder = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';
  const textColor = isDark ? '#F3F4F6' : '#111827';
  const subColor = isDark ? '#9CA3AF' : '#6B7280';
  const dividerColor = isDark ? 'rgba(255,255,255,0.06)' : '#F3F4F6';

  if (loading) {
    return (
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: screenBg }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#FF662A" />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: screenBg }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <Text style={{ color: '#EF4444', textAlign: 'center', marginBottom: 20 }}>{error || 'Produto não encontrado'}</Text>
          <TouchableOpacity onPress={onBack} style={{ padding: 10, backgroundColor: '#FF662A', borderRadius: 8 }}>
            <Text style={{ color: '#fff' }}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: screenBg }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={headerBg} />
      
      {}
      <View style={{
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, paddingVertical: 14,
        backgroundColor: headerBg,
        borderBottomWidth: 0.5, borderBottomColor: cardBorder,
      }}>
        <TouchableOpacity onPress={onBack} activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <BackIcon color={textColor} />
          <Text style={{ fontSize: 16 * fontScale, fontWeight: '500', color: textColor }}>
            Detalhes do Produto
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        
        {}
        <Animated.View entering={FadeInDown.delay(100)}>
          <View style={{
            backgroundColor: cardBg,
            borderRadius: 16,
            padding: 20,
            marginBottom: 20,
            borderWidth: 0.5,
            borderColor: cardBorder,
          }}>
            <Text style={{ fontSize: 20 * fontScale, fontWeight: '800', color: textColor, marginBottom: 8 }}>
              {product.name}
            </Text>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
              <View>
                <Text style={{ fontSize: 12 * fontScale, color: subColor, marginBottom: 2 }}>Preço</Text>
                <Text style={{ fontSize: 18 * fontScale, fontWeight: '700', color: '#FF662A' }}>
                  {formatCurrency(product.price)}
                </Text>
              </View>
              
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 12 * fontScale, color: subColor, marginBottom: 2 }}>Estoque Atual</Text>
                <Text style={{ fontSize: 18 * fontScale, fontWeight: '700', color: product.stock < 5 ? '#EF4444' : '#22C55E' }}>
                  {product.stock} un
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {}
        <Animated.View entering={FadeInDown.delay(200)}>
          <Text style={{ fontSize: 16 * fontScale, fontWeight: '700', color: textColor, marginBottom: 12, marginLeft: 4 }}>
            Histórico de Movimentação
          </Text>

          <View style={{
            backgroundColor: cardBg,
            borderRadius: 16,
            borderWidth: 0.5,
            borderColor: cardBorder,
            overflow: 'hidden',
          }}>
            {history.length === 0 ? (
              <View style={{ padding: 32, alignItems: 'center' }}>
                <Text style={{ fontSize: 14 * fontScale, color: subColor }}>Nenhuma movimentação</Text>
              </View>
            ) : (
              history.map((mov, index) => {
                const isEntry = mov.type === 'entrada';
                const Icon = isEntry ? TrendingUpIcon : TrendingDownIcon;
                const iconColor = isEntry ? '#22C55E' : '#EF4444';
                const iconBg = isEntry ? (isDark ? '#143120' : '#DCFCE7') : (isDark ? '#3F1212' : '#FEE2E2');

                return (
                  <View key={mov.id} style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 16,
                    borderBottomWidth: index === history.length - 1 ? 0 : 0.5,
                    borderBottomColor: dividerColor,
                  }}>
                    <View style={{
                      width: 40, height: 40, borderRadius: 12,
                      backgroundColor: iconBg,
                      alignItems: 'center', justifyContent: 'center',
                      marginRight: 12,
                    }}>
                      <Icon color={iconColor} />
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14 * fontScale, fontWeight: '600', color: textColor }}>
                        {mov.description}
                      </Text>
                      <Text style={{ fontSize: 11 * fontScale, color: subColor, marginTop: 2 }}>
                        {formatDate(mov.date)}
                      </Text>
                    </View>

                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={{ fontSize: 15 * fontScale, fontWeight: '700', color: iconColor }}>
                        {isEntry ? '+' : '-'}{mov.quantity}
                      </Text>
                      {mov.value && (
                        <Text style={{ fontSize: 11 * fontScale, color: subColor, marginTop: 2 }}>
                          {formatCurrency(mov.value)}
                        </Text>
                      )}
                    </View>
                  </View>
                );
              })
            )}
          </View>
        </Animated.View>

      </ScrollView>
    </SafeAreaView>
  );
};
