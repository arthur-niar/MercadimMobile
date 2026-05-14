// ViewModel da tela de Relatório
// Local final: src/viewmodels/ReportViewModel.ts

import { useState, useCallback } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { reportService } from '@/services/report.service';
import { ReportData, PeriodFilter } from '@/models/Report';
import { useTranslation } from '@/hooks/useTranslation';

export const useReportViewModel = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const [period, setPeriod] = useState<PeriodFilter>('semana');
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReport = async (selectedPeriod: PeriodFilter = period) => {
    try {
      setLoading(true);
      setError(null);
      const data = await reportService.getReport(selectedPeriod);
      setReportData(data);
    } catch (err: any) {
      console.error('Erro ao carregar relatório:', err);
      setError(err.message || t('report.loadError'));
    } finally {
      setLoading(false);
    }
  };

  // Recarrega sempre que a tela ganha foco (padrão do projeto)
  useFocusEffect(
    useCallback(() => {
      loadReport(period);
    }, []),
  );

  // Troca o filtro de período e recarrega
  const handleSelectPeriod = (newPeriod: PeriodFilter) => {
    setPeriod(newPeriod);
    loadReport(newPeriod);
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)' as any);
    }
  };

  return {
    period,
    reportData,
    loading,
    error,
    handleSelectPeriod,
    handleBack,
    refresh: () => loadReport(period),
  };
};