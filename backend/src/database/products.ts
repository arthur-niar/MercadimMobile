import { supabase } from '../config/supabase';
import { Product, CreateProductRequest, UpdateProductRequest } from '../types';


export async function listProducts(
  userId: string,
  page: number = 1,
  limit: number = 100
): Promise<{ products: Product[]; total: number }> {
  const offset = (page - 1) * limit;

 
  const { data: produtos, error, count } = await supabase
    .from('produto')
    .select('*', { count: 'exact' })
    .eq('ativo', true)
    .order('datacriacao', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Erro ao listar produtos:', error);
    throw new Error('Erro ao buscar produtos');
  }

  
  const productsWithStock = await Promise.all(
    (produtos || []).map(async (p) => {
      
      const { data: estoqueData } = await supabase
        .from('estoque')
        .select('quantprodutos')
        .eq('idestoque', p.idestoque)
        .single();

     
      const { data: vendasData } = await supabase
        .from('produtovenda')
        .select('quantidade')
        .eq('idproduto', p.idproduto);

      const quantidadeVendida = vendasData?.reduce((sum, v) => sum + (v.quantidade || 0), 0) || 0;
      const quantidadeInicial = estoqueData?.quantprodutos || 0;
      const stock = Math.max(0, quantidadeInicial - quantidadeVendida);

      return {
        id: p.idproduto.toString(),
        name: p.nome,
        price: parseFloat(p.preco),
        stock,
        category: p.categoria || undefined,
        createdAt: p.datacriacao,
        ativo: p.ativo ?? true,
      };
    })
  );

  return {
    products: productsWithStock,
    total: count || 0,
  };
}


export async function getProductById(productId: string, userId: string): Promise<Product | null> {
  const { data: produto, error } = await supabase
    .from('produto')
    .select('*, estoque(quantprodutos)')
    .eq('idproduto', parseInt(productId))
    .eq('ativo', true)
    .single();

  if (error || !produto) {
    return null;
  }

 
  const { data: vendasData } = await supabase
    .from('produtovenda')
    .select('quantidade')
    .eq('idproduto', produto.idproduto);

  const quantidadeVendida = vendasData?.reduce((sum, v) => sum + (v.quantidade || 0), 0) || 0;
  const quantidadeInicial = produto.estoque?.quantprodutos || 0;
  const stock = Math.max(0, quantidadeInicial - quantidadeVendida);

  return {
    id: produto.idproduto.toString(),
    name: produto.nome,
    price: parseFloat(produto.preco),
    stock,
    category: produto.categoria || undefined,
    createdAt: produto.datacriacao,
    ativo: produto.ativo ?? true,
  };
}


export async function createProduct(
  userId: string,
  productData: CreateProductRequest
): Promise<Product> {
  
  const { data: estoqueData, error: estoqueError } = await supabase
    .from('estoque')
    .insert({
      quantprodutos: productData.stock,
      quantbaixoestoque: productData.stock < 5 ? 1 : 0,
    })
    .select()
    .single();

  if (estoqueError || !estoqueData) {
    console.error('Erro ao criar estoque:', estoqueError);
    throw new Error('Erro ao criar estoque do produto');
  }

  
  const now = new Date().toISOString().split('T')[0];
  const { data: produto, error: produtoError } = await supabase
    .from('produto')
    .insert({
      nome: productData.name,
      preco: productData.price,
      categoria: productData.category || null,
      idestoque: estoqueData.idestoque,
      datacriacao: now,
      dataatualizacao: now,
      ativo: true,
    })
    .select()
    .single();

  if (produtoError || !produto) {
    console.error('Erro ao criar produto:', produtoError);
    
    await supabase.from('estoque').delete().eq('idestoque', estoqueData.idestoque);
    throw new Error('Erro ao criar produto');
  }

  return {
    id: produto.idproduto.toString(),
    name: produto.nome,
    price: parseFloat(produto.preco),
    stock: productData.stock,
    category: produto.categoria || undefined,
    createdAt: produto.datacriacao,
    ativo: true,
  };
}


export async function updateProduct(
  productId: string,
  userId: string,
  updates: UpdateProductRequest
): Promise<Product> {
  
  const { data: produtoExistente, error: checkError } = await supabase
    .from('produto')
    .select('*, estoque(idestoque, quantprodutos)')
    .eq('idproduto', parseInt(productId))
    .single();

  if (checkError || !produtoExistente) {
    throw new Error('Produto não encontrado');
  }

  
  if (updates.stock !== undefined) {
    const { error: estoqueError } = await supabase
      .from('estoque')
      .update({
        quantprodutos: updates.stock,
        quantbaixoestoque: updates.stock < 5 ? 1 : 0,
      })
      .eq('idestoque', produtoExistente.estoque.idestoque);

    if (estoqueError) {
      console.error('Erro ao atualizar estoque:', estoqueError);
      throw new Error('Erro ao atualizar estoque');
    }
  }

 
  const updateData: any = {
    dataatualizacao: new Date().toISOString().split('T')[0],
  };

  if (updates.name !== undefined) updateData.nome = updates.name;
  if (updates.price !== undefined) updateData.preco = updates.price;
  if (updates.category !== undefined) updateData.categoria = updates.category;

  const { data: produto, error: produtoError } = await supabase
    .from('produto')
    .update(updateData)
    .eq('idproduto', parseInt(productId))
    .select()
    .single();

  if (produtoError || !produto) {
    console.error('Erro ao atualizar produto:', produtoError);
    throw new Error('Erro ao atualizar produto');
  }

  return {
    id: produto.idproduto.toString(),
    name: produto.nome,
    price: parseFloat(produto.preco),
    stock: updates.stock ?? produtoExistente.estoque.quantprodutos,
    category: produto.categoria || undefined,
    createdAt: produto.datacriacao,
    ativo: produto.ativo ?? true,
  };
}


export async function deleteProduct(productId: string, userId: string): Promise<void> {
 
  const { data: produto, error: checkError } = await supabase
    .from('produto')
    .select('*, estoque(idestoque)')
    .eq('idproduto', parseInt(productId))
    .eq('ativo', true)
    .single();

  if (checkError || !produto) {
    throw new Error('Produto não encontrado');
  }

  
  const { data: vendas } = await supabase
    .from('produtovenda')
    .select('idprodutovenda')
    .eq('idproduto', parseInt(productId))
    .limit(1);

  if (vendas && vendas.length > 0) {
   
    const { error: updateError } = await supabase
      .from('produto')
      .update({ ativo: false })
      .eq('idproduto', parseInt(productId));

    if (updateError) {
      console.error('Erro ao desativar produto:', updateError);
      throw new Error('Erro ao desativar produto');
    }
  } else {
   
    const { error: deleteError } = await supabase
      .from('produto')
      .delete()
      .eq('idproduto', parseInt(productId));

    if (deleteError) {
      console.error('Erro ao deletar produto:', deleteError);
      throw new Error('Erro ao deletar produto');
    }

 
    await supabase
      .from('estoque')
      .delete()
      .eq('idestoque', produto.estoque.idestoque);
  }
}


export async function updateStockAfterSale(
  productId: string,
  quantitySold: number
): Promise<void> {
  const { data: produto, error } = await supabase
    .from('produto')
    .select('idestoque, estoque(quantprodutos)')
    .eq('idproduto', parseInt(productId))
    .single();

  if (error || !produto) {
    throw new Error('Produto não encontrado');
  }

  const currentStock = produto.estoque?.quantprodutos || 0;
  const newStock = Math.max(0, currentStock - quantitySold);

  const { error: updateError } = await supabase
    .from('estoque')
    .update({
      quantprodutos: newStock,
      quantbaixoestoque: newStock < 5 ? 1 : 0,
    })
    .eq('idestoque', produto.idestoque);

  if (updateError) {
    console.error('Erro ao atualizar estoque após venda:', updateError);
    throw new Error('Erro ao atualizar estoque');
  }
}
