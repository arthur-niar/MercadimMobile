import { supabase } from '../config/supabase';

export interface ReportSummary {
  totalVendas: number;
  itensVendidos: number;
  numeroVendas: number;
  ticketMedio: number;
}

export interface VendaRow {
  idvenda: number;
  idusuario: number;
  quantproduto: number;
  precototal: number;
  datavenda: string;
}

export async function getVendasByUserId(userId: string): Promise<VendaRow[]> {
  const { data, error } = await supabase
    .from('venda')
    .select('idvenda, idusuario, quantproduto, precototal, datavenda')
    .eq('idusuario', parseInt(userId))
    .order('datavenda', { ascending: false });

  if (error) {
    throw new Error(`Erro ao buscar vendas: ${error.message}`);
  }

  return (data || []) as VendaRow[];
}

export async function getReportSummaryByUserId(userId: string): Promise<ReportSummary> {
  const vendas = await getVendasByUserId(userId);

  const numeroVendas = vendas.length;
  const totalVendas = vendas.reduce((sum, v) => sum + Number(v.precototal), 0);
  const itensVendidos = vendas.reduce((sum, v) => sum + Number(v.quantproduto), 0);
  const ticketMedio = numeroVendas > 0 ? totalVendas / numeroVendas : 0;

  return { totalVendas, itensVendidos, numeroVendas, ticketMedio };
}
