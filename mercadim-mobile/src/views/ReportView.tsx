
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useReportViewModel } from '@/viewmodels/ReportViewModel';
import { useSettings } from '@/contexts/SettingsContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Skeleton } from '@/components/Skeleton';
import { formatCurrency } from '@/utils';
import { PeriodFilter, SaleMovement } from '@/models/Report';

// ── Icons ─────────────────────────────────────────────────────────────────────

const BackIcon = ({ color }: { color: string }) => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <Path d="M15 18l-6-6 6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CalendarIcon = ({ color }: { color: string }) => (
  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <Path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// ── Helper: formata "2026-04-19" em "19/04" ──────────────────────────────────
const formatShortDate = (dateStr: string): string => {
  const [, month, day] = dateStr.split('-');
  return `${day}/${month}`;
};

// ── Sub-components ────────────────────────────────────────────────────────────

interface PeriodChipsProps {
  active: PeriodFilter;
  onSelect: (p: PeriodFilter) => void;
  isDark: boolean;
  fontScale: number;
  labels: Record<PeriodFilter, string>;
}
const PeriodChips = ({ active, onSelect, isDark, fontScale, labels }: PeriodChipsProps) => {
  const options: PeriodFilter[] = ['hoje', 'semana', 'mes'];
  const inactiveBg = isDark ? '#17181B' : '#fff';
  const inactiveColor = isDark ? '#9CA3AF' : '#6B7280';
  const inactiveBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

  return (
    <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 12, paddingTop: 14, paddingBottom: 10 }}>
      {options.map((opt) => {
        const isActive = opt === active;
        return (
          <TouchableOpacity
            key={opt}
            onPress={() => onSelect(opt)}
            activeOpacity={0.7}
            style={{
              flex: 1,
              paddingVertical: 9,
              borderRadius: 20,
              alignItems: 'center',
              backgroundColor: isActive ? '#111827' : inactiveBg,
              borderWidth: isActive ? 0 : 0.5,
              borderColor: inactiveBorder,
            }}
          >
            <Text style={{
              fontSize: 12 * fontScale,
              fontWeight: '600',
              color: isActive ? '#fff' : inactiveColor,
            }}>
              {labels[opt]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

interface MiniCardProps {
  value: string;
  label: string;
  bgColor: string;
  fontScale: number;
}
const MiniCard = ({ value, label, bgColor, fontScale }: MiniCardProps) => (
  <View style={{
    flex: 1,
    backgroundColor: bgColor,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
  }}>
    <Text style={{ fontSize: 15 * fontScale, fontWeight: '800', color: '#fff' }} numberOfLines={1}>
      {value}
    </Text>
    <Text style={{ fontSize: 9 * fontScale, color: 'rgba(255,255,255,0.9)', marginTop: 3, fontWeight: '500', textAlign: 'center' }}>
      {label}
    </Text>
  </View>
);

interface MovementRowProps {
  movement: SaleMovement;
  isDark: boolean;
  fontScale: number;
  textColor: string;
  subColor: string;
  borderColor: string;
  isLast: boolean;
  saleLabel: string;
  itemsLabel: string;
}
const MovementRow = ({
  movement, isDark, fontScale, textColor, subColor, borderColor, isLast, saleLabel, itemsLabel,
}: MovementRowProps) => {
  // Todas as movimentações aqui são saídas (vendas)
  const iconBg = isDark ? '#3A2412' : '#FFEEDB';
  const iconColor = '#FF662A';

  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 11,
      paddingHorizontal: 14,
      borderBottomWidth: isLast ? 0 : 0.5,
      borderBottomColor: borderColor,
    }}>
      <View style={{
        width: 32, height: 32, borderRadius: 10,
        backgroundColor: iconBg,
        alignItems: 'center', justifyContent: 'center',
        marginRight: 11,
      }}>
        <Text style={{ fontSize: 13 * fontScale, fontWeight: '700', color: iconColor }}>S</Text>
      </View>

      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={{ fontSize: 13 * fontScale, fontWeight: '700', color: textColor }} numberOfLines={1}>
          {movement.productNames || 'Produto Desconhecido'}
        </Text>
        <Text style={{ fontSize: 10 * fontScale, color: subColor, marginTop: 2 }}>
          {saleLabel} #{movement.saleNumber} · {movement.quantity} {itemsLabel} · {formatShortDate(movement.date)}
        </Text>
      </View>

      <Text style={{ fontSize: 12 * fontScale, fontWeight: '700', color: '#FF662A' }}>
        {formatCurrency(movement.value)}
      </Text>
    </View>
  );
};

// ── Gráfico de barras (vendas por dia) — AGORA INTERATIVO ────────────────────
//
// Como funciona o tooltip:
// - Cada barra é um Pressable
// - onPressIn  → seta o índice ativo → mostra o balãozinho
// - onPressOut → limpa o índice → esconde o balãozinho
// - O balão fica posicionado absolutamente em cima da barra ativa

interface ChartBarsProps {
  data: { label: string; total: number; count: number }[];
  subColor: string;
  fontScale: number;
  salesLabel: string;
}
const ChartBars = ({ data, subColor, fontScale, salesLabel }: ChartBarsProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const maxValue = Math.max(1, ...data.map((d) => d.total));
  const CHART_HEIGHT = 64;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 110, gap: 6 }}>
      {data.map((day, index) => {
        const barHeight = (day.total / maxValue) * CHART_HEIGHT;
        const isActive = activeIndex === index;
        const hasData = day.total > 0;

        return (
          <Pressable
            key={day.label}
            onPressIn={() => setActiveIndex(index)}
            onPressOut={() => setActiveIndex(null)}
            style={{ flex: 1, alignItems: 'center', gap: 4 }}
          >
            {/* Área da barra com espaço para o tooltip em cima */}
            <View style={{
              width: '100%',
              height: CHART_HEIGHT + 36, // espaço extra em cima pro tooltip caber
              justifyContent: 'flex-end',
              position: 'relative',
            }}>
              {/* Tooltip — só aparece quando essa barra está ativa */}
              {isActive && (
                <View style={{
                  position: 'absolute',
                  bottom: barHeight + 8, // 8px acima do topo da barra
                  left: '50%',
                  transform: [{ translateX: -45 }], // centraliza (largura do balão ~90)
                  width: 90,
                  backgroundColor: '#111827',
                  paddingVertical: 5,
                  paddingHorizontal: 8,
                  borderRadius: 8,
                  alignItems: 'center',
                  zIndex: 10,
                }}>
                  <Text style={{ fontSize: 11 * fontScale, fontWeight: '700', color: '#fff' }} numberOfLines={1}>
                    {hasData ? formatCurrency(day.total) : '—'}
                  </Text>
                  <Text style={{ fontSize: 9 * fontScale, color: 'rgba(255,255,255,0.85)', marginTop: 1 }}>
                    {day.count} {salesLabel}
                  </Text>
                  {/* Setinha do balão apontando pra barra */}
                  <View style={{
                    position: 'absolute',
                    bottom: -4,
                    left: '50%',
                    marginLeft: -4,
                    width: 0,
                    height: 0,
                    borderLeftWidth: 4,
                    borderRightWidth: 4,
                    borderTopWidth: 4,
                    borderLeftColor: 'transparent',
                    borderRightColor: 'transparent',
                    borderTopColor: '#111827',
                  }} />
                </View>
              )}

              {/* A barra */}
              <View style={{
                height: Math.max(barHeight, hasData ? 4 : 0),
                backgroundColor: isActive ? '#C04E1F' : '#FF662A', // escurece quando ativa
                borderRadius: 4,
              }} />
            </View>
            <Text style={{
              fontSize: 8 * fontScale,
              color: isActive ? '#FF662A' : subColor,
              fontWeight: isActive ? '600' : '400',
            }}>
              {day.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

// ── View ──────────────────────────────────────────────────────────────────────

export const ReportView: React.FC = () => {
  const vm = useReportViewModel();
  const { isDark, fontScale } = useSettings();
  const { t } = useTranslation();

  // Cores adaptadas ao tema
  const screenBg = isDark ? '#0B0B0D' : '#F5F5F5';
  const headerBg = isDark ? '#17181B' : '#fff';
  const cardBg = isDark ? '#17181B' : '#fff';
  const cardBorder = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';
  const textColor = isDark ? '#F3F4F6' : '#111827';
  const subColor = isDark ? '#9CA3AF' : '#6B7280';
  const dividerColor = isDark ? 'rgba(255,255,255,0.06)' : '#F3F4F6';

  // Labels dos chips de filtro
  const periodChipLabels: Record<PeriodFilter, string> = {
    hoje: t('report.periods.today'),
    semana: t('report.periods.week'),
    mes: t('report.periods.month'),
  };

  // Label da faixa de data
  const periodSubtitleLabels: Record<PeriodFilter, string> = {
    hoje: t('report.periodLabels.today'),
    semana: t('report.periodLabels.week'),
    mes: t('report.periodLabels.month'),
  };

  // Dados enriquecidos do gráfico — adiciona "count" (nº de vendas) por dia
  // O service só guarda o "total" (R$) por dia. Aqui a gente calcula o "count"
  // a partir das movimentações, pra mostrar no tooltip junto com o valor.
  const chartData = useMemo(() => {
    if (!vm.reportData) return [];

    const dayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const orderedLabels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

    // Conta quantas vendas em cada dia
    const countMap: Record<string, number> = {};
    orderedLabels.forEach((l) => { countMap[l] = 0; });

    vm.reportData.movements.forEach((mv) => {
      const [year, month, day] = mv.date.split('-').map(Number);
      const d = new Date(year, (month || 1) - 1, day || 1);
      const label = dayLabels[d.getDay()];
      countMap[label] = (countMap[label] || 0) + 1;
    });

    return vm.reportData.dailySales.map((ds) => ({
      label: ds.label,
      total: ds.total,
      count: countMap[ds.label] || 0,
    }));
  }, [vm.reportData]);

  // ── Loading com Skeleton ──────────────────────────────────────────────────
  if (vm.loading && !vm.reportData) {
    return (
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: screenBg }}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={headerBg} />
        <View style={{
          flexDirection: 'row', alignItems: 'center',
          paddingHorizontal: 16, paddingVertical: 14,
          backgroundColor: headerBg,
          borderBottomWidth: 0.5, borderBottomColor: cardBorder,
        }}>
          <TouchableOpacity onPress={vm.handleBack} activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <BackIcon color={textColor} />
            <Text style={{ fontSize: 16 * fontScale, fontWeight: '500', color: textColor }}>
              {t('report.title')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ padding: 16 }}>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
            <Skeleton height={36} style={{ flex: 1 }} borderRadius={20} />
            <Skeleton height={36} style={{ flex: 1 }} borderRadius={20} />
            <Skeleton height={36} style={{ flex: 1 }} borderRadius={20} />
          </View>
          <Skeleton height={100} borderRadius={18} style={{ marginBottom: 12 }} />
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
            <Skeleton height={70} style={{ flex: 1 }} borderRadius={14} />
            <Skeleton height={70} style={{ flex: 1 }} borderRadius={14} />
            <Skeleton height={70} style={{ flex: 1 }} borderRadius={14} />
          </View>
          <Skeleton height={160} borderRadius={16} style={{ marginBottom: 16 }} />
          <Skeleton height={240} borderRadius={16} />
        </View>
      </SafeAreaView>
    );
  }

  const data = vm.reportData;

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: screenBg }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={headerBg} />

      {/* Header */}
      <View style={{
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, paddingVertical: 14,
        backgroundColor: headerBg,
        borderBottomWidth: 0.5, borderBottomColor: cardBorder,
      }}>
        <TouchableOpacity onPress={vm.handleBack} activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <BackIcon color={textColor} />
          <Text style={{ fontSize: 16 * fontScale, fontWeight: '500', color: textColor }}>
            {t('report.title')}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1, backgroundColor: screenBg }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Filtro de período */}
        <PeriodChips
          active={vm.period}
          onSelect={vm.handleSelectPeriod}
          isDark={isDark}
          fontScale={fontScale}
          labels={periodChipLabels}
        />

        {/* Faixa de data */}
        <View style={{
          flexDirection: 'row', alignItems: 'center', gap: 8,
          backgroundColor: cardBg,
          borderRadius: 10, padding: 10,
          marginHorizontal: 12, marginBottom: 12,
          borderWidth: 0.5, borderColor: cardBorder,
        }}>
          <CalendarIcon color={subColor} />
          <Text style={{ fontSize: 11 * fontScale, color: textColor }}>
            {periodSubtitleLabels[vm.period]}
          </Text>
        </View>

        {/* Erro */}
        {vm.error && (
          <View style={{
            backgroundColor: isDark ? '#3F1212' : '#FEE2E2',
            borderRadius: 12, padding: 14,
            marginHorizontal: 12, marginBottom: 12,
            borderLeftWidth: 4, borderLeftColor: '#EF4444',
          }}>
            <Text style={{ fontSize: 12 * fontScale, color: isDark ? '#FCA5A5' : '#991B1B' }}>
              {vm.error}
            </Text>
          </View>
        )}

        {data && (
          <>
            {/* Hero card — Total de Vendas */}
            <Animated.View entering={FadeInDown.delay(100)}>
              <View style={{
                marginHorizontal: 12, marginBottom: 10,
                borderRadius: 18, padding: 18,
                backgroundColor: '#FF662A',
              }}>
                <Text style={{ fontSize: 11 * fontScale, color: 'rgba(255,255,255,0.9)', fontWeight: '500' }}>
                  {t('report.totalSales')}
                </Text>
                <Text style={{ fontSize: 30 * fontScale, fontWeight: '800', color: '#fff', marginTop: 4 }}>
                  {formatCurrency(data.summary.totalSales)}
                </Text>
              </View>
            </Animated.View>

            {/* 3 cards menores */}
            <Animated.View entering={FadeInDown.delay(200)}>
              <View style={{ flexDirection: 'row', gap: 8, marginHorizontal: 12, marginBottom: 14 }}>
                <MiniCard
                  value={String(data.summary.itemsSold)}
                  label={t('report.itemsSold')}
                  bgColor="#16A34A"
                  fontScale={fontScale}
                />
                <MiniCard
                  value={String(data.summary.salesCount)}
                  label={t('report.salesCount')}
                  bgColor="#FF662A"
                  fontScale={fontScale}
                />
                <MiniCard
                  value={formatCurrency(data.summary.averageTicket)}
                  label={t('report.averageTicket')}
                  bgColor="#7C3AED"
                  fontScale={fontScale}
                />
              </View>
            </Animated.View>

            {/* Gráfico de vendas por dia — agora interativo! */}
            <Animated.View entering={FadeInDown.delay(300)}>
              <View style={{
                marginHorizontal: 12, marginBottom: 12,
                backgroundColor: cardBg, borderRadius: 16, padding: 14,
                borderWidth: 0.5, borderColor: cardBorder,
              }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <Text style={{ fontSize: 12 * fontScale, fontWeight: '700', color: textColor }}>
                    {t('report.dailySales')}
                  </Text>
                  <Text style={{ fontSize: 9 * fontScale, color: subColor }}>
                    {t('report.last7days')}
                  </Text>
                </View>

                <ChartBars
                  data={chartData}
                  subColor={subColor}
                  fontScale={fontScale}
                  salesLabel={t('report.salesShort')}
                />

                {/* Dica abaixo do gráfico */}
                <Text style={{
                  fontSize: 9 * fontScale,
                  color: subColor,
                  textAlign: 'center',
                  marginTop: 8,
                  fontStyle: 'italic',
                }}>
                  {t('report.chartHint')}
                </Text>
              </View>
            </Animated.View>

            {/* Lista de movimentações */}
            <Animated.View entering={FadeInDown.delay(400)}>
              <View style={{
                flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                paddingHorizontal: 16, marginBottom: 10,
              }}>
                <Text style={{ fontSize: 12 * fontScale, fontWeight: '700', color: textColor }}>
                  {t('report.movements')}
                </Text>
                <View style={{
                  backgroundColor: cardBg,
                  paddingHorizontal: 9, paddingVertical: 3,
                  borderRadius: 8,
                  borderWidth: 0.5, borderColor: cardBorder,
                }}>
                  <Text style={{ fontSize: 9 * fontScale, color: subColor }}>
                    {data.movements.length} {t('report.records')}
                  </Text>
                </View>
              </View>

              <View style={{
                marginHorizontal: 12,
                backgroundColor: cardBg,
                borderRadius: 16,
                borderWidth: 0.5, borderColor: cardBorder,
                overflow: 'hidden',
              }}>
                {data.movements.length === 0 ? (
                  <View style={{ padding: 28, alignItems: 'center' }}>
                    <Text style={{ fontSize: 13 * fontScale, fontWeight: '600', color: textColor, marginBottom: 4 }}>
                      {t('report.noMovements')}
                    </Text>
                    <Text style={{ fontSize: 11 * fontScale, color: subColor, textAlign: 'center' }}>
                      {t('report.noMovementsDesc')}
                    </Text>
                  </View>
                ) : (
                  data.movements.map((mv, index) => (
                    <MovementRow
                      key={mv.id}
                      movement={mv}
                      isDark={isDark}
                      fontScale={fontScale}
                      textColor={textColor}
                      subColor={subColor}
                      borderColor={dividerColor}
                      isLast={index === data.movements.length - 1}
                      saleLabel={t('report.sale')}
                      itemsLabel={t('report.items')}
                    />
                  ))
                )}
              </View>
            </Animated.View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};