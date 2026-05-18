import { supabase } from '../config/supabase';
import { Sale, SaleItem } from '../types';
import { getProductById } from './products';

export const createSale = async (data: { userId: string; items: { productId: string; quantity: number }[] }): Promise<Sale> => {

  let totalSalePrice = 0;
  let totalQuantity = 0;
  const processedItems: { productId: number; quantity: number; unitPrice: number; name: string; stockId: number; currentStock: number }[] = [];

  for (const item of data.items) {
    const productData = await getProductById(item.productId, data.userId);
    if (!productData) {
      throw new Error(`Produto com ID ${item.productId} não encontrado.`);
    }

    if (productData.stock < item.quantity) {
      throw new Error(`Estoque insuficiente para o produto ${productData.name}. Disponível: ${productData.stock}, Solicitado: ${item.quantity}.`);
    }


    const { data: rawProduct } = await supabase
      .from('produto')
      .select('idestoque')
      .eq('idproduto', parseInt(item.productId))
      .single();

    if (!rawProduct) throw new Error(`Erro interno ao buscar estoque do produto ${item.productId}`);

    processedItems.push({
      productId: parseInt(item.productId),
      quantity: item.quantity,
      unitPrice: productData.price,
      name: productData.name,
      stockId: rawProduct.idestoque,
      currentStock: productData.stock,
    });

    totalSalePrice += productData.price * item.quantity;
    totalQuantity += item.quantity;
  }


  const { data: vendaData, error: vendaError } = await supabase
    .from('venda')
    .insert([{
        idusuario: parseInt(data.userId),
        quantproduto: totalQuantity,
        precototal: totalSalePrice,
    }])
    .select()
    .single();

  if (vendaError) throw new Error(`Erro ao criar venda: ${vendaError.message}`);


  const finalItems: SaleItem[] = [];

  for (const item of processedItems) {
    const { error: pvError } = await supabase
      .from('produtovenda')
      .insert([{
           idproduto: item.productId,
           idvenda: vendaData.idvenda,
           quantidade: item.quantity,
           precounitario: item.unitPrice,
//           idrelatorio: relatorioId
      }]);

    if (pvError) throw new Error(`Erro ao inserir item na venda: ${pvError.message}`);


    const newStock = Math.max(0, item.currentStock - item.quantity);
    const { error: stockError } = await supabase
      .from('estoque')
      .update({
        quantprodutos: newStock,
        quantbaixoestoque: newStock < 5 ? 1 : 0,
      })
      .eq('idestoque', item.stockId);
      
    if (stockError) throw new Error(`Erro ao atualizar estoque: ${stockError.message}`);

    finalItems.push({
      productId: item.productId.toString(),
      productName: item.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    });
  }

  return {
    id: vendaData.idvenda.toString(),
    userId: data.userId,
    items: finalItems,
    totalPrice: totalSalePrice,
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

  return data.map(venda => {
    const items: SaleItem[] = (venda.produtovenda || []).map((pv: any) => ({
        productId: pv.idproduto?.toString() || '',
        productName: pv.produto ? pv.produto.nome : 'Produto Desconhecido',
        quantity: pv.quantidade,
        unitPrice: Number(pv.precounitario)
    }));

    return {
      id: venda.idvenda.toString(),
      userId: venda.idusuario.toString(),
      items,
      totalPrice: Number(venda.precototal),
      createdAt: new Date(venda.datavenda)
    };
  });
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
  
  return data.map(venda => {
    const items: SaleItem[] = (venda.produtovenda || []).map((pv: any) => ({
        productId: pv.idproduto?.toString() || '',
        productName: pv.produto ? pv.produto.nome : 'Produto Desconhecido',
        quantity: pv.quantidade,
        unitPrice: Number(pv.precounitario)
    }));

    return {
      id: venda.idvenda.toString(),
      userId: venda.idusuario.toString(),
      items,
      totalPrice: Number(venda.precototal),
      createdAt: new Date(venda.datavenda)
    };
  });
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
