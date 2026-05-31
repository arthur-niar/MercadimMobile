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
  produtovenda?: {
    quantidade: number;
    precounitario: number;
    produto?: {
      nome: string;
    };
  }[];
}

export async function getVendasByUserId(userId: string): Promise<VendaRow[]> {
  const { data, error } = await supabase
    .from('venda')
    .select(`
      idvenda,
      idusuario,
      quantproduto,
      precototal,
      datavenda,
      produtovenda (
        quantidade,
        precounitario,
        produto (
          nome
        )
      )
    `)
    .eq('idusuario', parseInt(userId))
    .order('datavenda', { ascending: false });

  if (error) {
    throw new Error(`Erro ao buscar vendas: ${error.message}`);
  }

  const mappedData: VendaRow[] = (data || []).map((v: any) => ({
    idvenda: v.idvenda,
    idusuario: v.idusuario,
    quantproduto: v.quantproduto,
    precototal: v.precototal,
    datavenda: v.datavenda,
    produtovenda: (v.produtovenda || []).map((pv: any) => {
      const prod = Array.isArray(pv.produto) ? pv.produto[0] : pv.produto;
      return {
        quantidade: pv.quantidade,
        precounitario: pv.precounitario,
        produto: prod ? { nome: prod.nome } : undefined
      };
    })
  }));

  return mappedData;
}

export async function getReportSummaryByUserId(userId: string): Promise<ReportSummary> {
  const vendas = await getVendasByUserId(userId);

  const numeroVendas = vendas.length;
  const totalVendas = vendas.reduce((sum, v) => sum + Number(v.precototal), 0);
  const itensVendidos = vendas.reduce((sum, v) => sum + Number(v.quantproduto), 0);
  const ticketMedio = numeroVendas > 0 ? totalVendas / numeroVendas : 0;

  return { totalVendas, itensVendidos, numeroVendas, ticketMedio };
}
