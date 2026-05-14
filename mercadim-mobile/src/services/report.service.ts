// Service do Relatório de Vendas
// Local final: src/services/report.service.ts
//
// Este service consome DADOS REAIS do backend, pelo endpoint /venda.
// Não tem mais nada mockado aqui.
//
// Formato que o /venda retorna:
//   { "venda": [
//       { "idvenda": 2, "idusuario": 4, "quantproduto": 17,
//         "precototal": 440.29, "datavenda": "2026-04-19" },
//       ...
//   ]}

import api from './api';
import { ReportData, PeriodFilter, SaleMovement } from '@/models/Report';

// ───────────────────────────────────────────────────────────────────────────
// O endpoint /venda fica na RAIZ do servidor (http://IP:3000/venda),
// e NÃO embaixo de /api como os outros endpoints.
// Como o "api" tem baseURL terminando em /api, a gente monta a URL da raiz
// removendo o "/api" do final. Assim continua respeitando o IP configurado
// no api.ts (cada pessoa do grupo usa o seu) sem hardcodar nada.
// ───────────────────────────────────────────────────────────────────────────
const getVendaEndpoint = (): string => {
  const base = api.defaults.baseURL || '';
  const root = base.replace(/\/api\/?$/, ''); // tira "/api" do final, se existir
  return `${root}/venda`;
};

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
  /**
   * Busca as vendas reais do backend (/venda) e monta o relatório
   * já filtrado pelo período escolhido.
   */
  async getReport(period: PeriodFilter): Promise<ReportData> {
    const url = getVendaEndpoint();

    // O /venda retorna { venda: [...] }
    const response = await api.get<{ venda: VendaApiItem[] }>(url);
    const allVendas = response.data?.venda ?? [];

    // Converte o formato do backend para o nosso SaleMovement
    const allMovements: SaleMovement[] = allVendas.map((v) => ({
      id: `MV-${String(v.idvenda).padStart(4, '0')}`,
      saleNumber: v.idvenda,
      quantity: v.quantproduto,
      value: v.precototal,
      date: v.datavenda,
    }));

    // Filtra pelo período
    const filtered = filterByPeriod(allMovements, period);

    // Ordena da venda mais recente para a mais antiga
    filtered.sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime());

    return buildReportData(filtered);
  }
}

export const reportService = new ReportService();