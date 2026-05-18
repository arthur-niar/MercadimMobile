
import api from './api';
import { ReportData, PeriodFilter, SaleMovement } from '@/models/Report';


// Formato cru que vem do backend
interface VendaApiItem {
  idvenda: number;
  idusuario: number;
  quantproduto: number;
  precototal: number;
  datavenda: string; // "2026-04-19"
}

// Converte "2026-04-19" em Date local (evita problema de fuso horário,
// que aconteceria se usássemos new Date("2026-04-19") direto)
const parseDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
};

// Filtra as vendas pelo período selecionado
const filterByPeriod = (movements: SaleMovement[], period: PeriodFilter): SaleMovement[] => {
  const now = new Date();
  now.setHours(23, 59, 59, 999);

  const start = new Date();
  start.setHours(0, 0, 0, 0);

  if (period === 'semana') {
    start.setDate(start.getDate() - 6); // hoje + 6 dias atrás = 7 dias
  } else if (period === 'mes') {
    start.setDate(start.getDate() - 29); // hoje + 29 dias atrás = 30 dias
  }
  // 'hoje' = start já está no início de hoje

  return movements.filter((m) => {
    const d = parseDate(m.date);
    return d >= start && d <= now;
  });
};

// Monta os dados agregados a partir das vendas filtradas
const buildReportData = (movements: SaleMovement[]): ReportData => {
  const totalSales = movements.reduce((sum, m) => sum + m.value, 0);
  const itemsSold = movements.reduce((sum, m) => sum + m.quantity, 0);
  const salesCount = movements.length;
  const averageTicket = salesCount > 0 ? totalSales / salesCount : 0;

  // Gráfico: total vendido (R$) por dia da semana
  const dayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const dailyMap: Record<string, number> = {};
  dayLabels.forEach((label) => { dailyMap[label] = 0; });

  movements.forEach((m) => {
    const label = dayLabels[parseDate(m.date).getDay()];
    dailyMap[label] += m.value;
  });

  // Reordena de Seg a Dom
  const orderedLabels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  const dailySales = orderedLabels.map((label) => ({
    label,
    total: dailyMap[label],
  }));

  return {
    summary: { totalSales, itemsSold, salesCount, averageTicket },
    dailySales,
    movements,
  };
};

// ───────────────────────────────────────────────────────────────────────────
// SERVICE — interface pública
// ───────────────────────────────────────────────────────────────────────────

class ReportService {
  async getReport(period: PeriodFilter): Promise<ReportData> {
    const response = await api.get<{ venda: VendaApiItem[] }>('/report/vendas');
    const allVendas = response.data?.venda ?? [];

    const allMovements: SaleMovement[] = allVendas.map((v) => ({
      id: `MV-${String(v.idvenda).padStart(4, '0')}`,
      saleNumber: v.idvenda,
      quantity: v.quantproduto,
      value: v.precototal,
      date: v.datavenda,
    }));

    const filtered = filterByPeriod(allMovements, period);

    filtered.sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime());

    return buildReportData(filtered);
  }
}

export const reportService = new ReportService();
