// Tipos do Relatório de Vendas
// Local final: src/models/Report.ts

// Filtro de período do relatório
export type PeriodFilter = 'hoje' | 'semana' | 'mes';

// Uma venda individual, já convertida do formato do backend (/venda)
// Backend retorna: { idvenda, idusuario, quantproduto, precototal, datavenda }
export interface SaleMovement {
  id: string;          // Ex: "MV-0002" (montado a partir do idvenda)
  saleNumber: number;  // idvenda — o número da venda
  quantity: number;    // quantproduto — total de itens nessa venda
  value: number;       // precototal — valor total da venda em R$
  date: string;        // datavenda — ex: "2026-04-19"
}

// Resumo agregado do período
export interface ReportSummary {
  totalSales: number;     // Soma de todos os precototal (R$)
  itemsSold: number;      // Soma de todos os quantproduto
  salesCount: number;     // Quantidade de vendas
  averageTicket: number;  // totalSales / salesCount (R$)
}

// Ponto do gráfico de vendas diárias
export interface DailySales {
  label: string;   // Ex: "Seg", "Ter"...
  total: number;   // Total vendido nesse dia (R$)
}

// Estrutura completa que a tela de Relatório consome
export interface ReportData {
  summary: ReportSummary;
  dailySales: DailySales[];
  movements: SaleMovement[];
}