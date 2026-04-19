import { supabase } from '../config/supabase';
import { Sale } from '../types';

export const createSale = async (sale: Omit<Sale, 'id' | 'createdAt'>): Promise<Sale> => {
  const { data: vendaData, error: vendaError } = await supabase
      .from('venda')
      .insert([{
          idusuario: parseInt(sale.userId),
          quantproduto: sale.quantity,
          precototal: sale.totalPrice,
      }])
      .select()
      .single();

   if (vendaError) throw vendaError;

   let produtoId;
   const { data: existingProduto, error: existingError } = await supabase
        .from('produto')
        .select('*')
        .eq('nome', sale.productName)
        .limit(1)
        .single();

   if (existingProduto) {
       produtoId = existingProduto.idproduto;
   } else {
       const { data: estoqueData, error: estoqueError } = await supabase
           .from('estoque')
           .insert([{ quantprodutos: 100, quantbaixoestoque: 10 }])
           .select()
           .single();
           
       if (estoqueError) throw estoqueError;

       const { data: newProduto, error: newProdutoError } = await supabase
          .from('produto')
          .insert([{
              nome: sale.productName,
              preco: sale.unitPrice,
              idestoque: estoqueData.idestoque
          }])
          .select()
          .single();
          
       if (newProdutoError) throw newProdutoError;
       produtoId = newProduto.idproduto;
   }

   let relatorioId;
   const { data: existRelatorio } = await supabase.from('relatorio').select('*').limit(1).single();
   if (existRelatorio) {
        relatorioId = existRelatorio.idrelatorio;
   } else {
        const { data: rootRelatorio, error: relError } = await supabase
            .from('relatorio')
            .insert([{
               nomeproduto: 'Geral', lucrototal: 0, vendastotais: 0, vendassemanais: 0, aumentoestoque: 0
            }])
            .select()
            .single();
        if (relError) throw relError;
        relatorioId = rootRelatorio.idrelatorio;
   }

   const { error: pvError } = await supabase
        .from('produtovenda')
        .insert([{
             idproduto: produtoId,
             idvenda: vendaData.idvenda,
             quantidade: sale.quantity,
             precounitario: sale.unitPrice,
             idrelatorio: relatorioId
        }]);

   if (pvError) throw pvError;

  return {
    id: vendaData.idvenda.toString(),
    userId: sale.userId,
    productName: sale.productName,
    quantity: sale.quantity,
    unitPrice: sale.unitPrice,
    totalPrice: sale.totalPrice,
    createdAt: new Date(vendaData.datavenda),
  };
};

export const getSalesByUserId = async (userId: string): Promise<Sale[]> => {
  const { data, error } = await supabase
    .from('venda')
    .select(`
        *,
        produtovenda (
            *,
            produto (*)
        )
    `)
    .eq('idusuario', parseInt(userId));

  if (error || !data) return [];

  const sales: Sale[] = [];

  for (const venda of data) {
      if (venda.produtovenda && venda.produtovenda.length > 0) {
          const pv = venda.produtovenda[0];
          sales.push({
             id: venda.idvenda.toString(),
             userId: venda.idusuario.toString(),
             productName: pv.produto ? pv.produto.nome : 'Produto Desconhecido',
             quantity: pv.quantidade,
             unitPrice: Number(pv.precounitario),
             totalPrice: Number(venda.precototal),
             createdAt: new Date(venda.datavenda)
          });
      }
  }

  return sales;
};

export const getAllSales = async (): Promise<Sale[]> => {
  const { data, error } = await supabase
    .from('venda')
    .select(`
        *,
        produtovenda (
            *,
            produto (*)
        )
    `);

  if (error || !data) return [];
  
  const sales: Sale[] = [];

  for (const venda of data) {
      if (venda.produtovenda && venda.produtovenda.length > 0) {
          const pv = venda.produtovenda[0];
          sales.push({
             id: venda.idvenda.toString(),
             userId: venda.idusuario.toString(),
             productName: pv.produto ? pv.produto.nome : 'Produto Desconhecido',
             quantity: pv.quantidade,
             unitPrice: Number(pv.precounitario),
             totalPrice: Number(venda.precototal),
             createdAt: new Date(venda.datavenda)
          });
      }
  }
  return sales;
};

export const hasSales = async (): Promise<boolean> => {
  const { count } = await supabase
    .from('venda')
    .select('*', { count: 'exact', head: true });
    
  return (count || 0) > 0;
};

export const deleteSale = async (id: string): Promise<boolean> => {
   const { error: pvError } = await supabase
       .from('produtovenda')
       .delete()
       .eq('idvenda', parseInt(id));
       
   if (pvError) return false;

   const { error } = await supabase
       .from('venda')
       .delete()
       .eq('idvenda', parseInt(id));

   return !error;
};
