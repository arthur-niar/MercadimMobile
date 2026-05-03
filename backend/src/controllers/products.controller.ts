import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../database/products';
import { CreateProductRequest, UpdateProductRequest } from '../types';


export async function getProducts(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 100;

    const { products, total } = await listProducts(userId, page, limit);

    return res.status(200).json({
      products,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    return res.status(500).json({ message: 'Erro ao buscar produtos' });
  }
}


export async function getProduct(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    const { id } = req.params;
    const product = await getProductById(id, userId);

    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    return res.status(500).json({ message: 'Erro ao buscar produto' });
  }
}

export async function createNewProduct(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    const productData: CreateProductRequest = req.body;

    
    if (!productData.name || productData.name.trim().length === 0) {
      return res.status(400).json({ message: 'Nome do produto é obrigatório' });
    }

    if (productData.price === undefined || productData.price < 0) {
      return res.status(400).json({ message: 'Preço inválido' });
    }

    if (productData.stock === undefined || productData.stock < 0) {
      return res.status(400).json({ message: 'Quantidade em estoque inválida' });
    }

    const product = await createProduct(userId, productData);

    return res.status(201).json(product);
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    return res.status(500).json({ message: 'Erro ao criar produto' });
  }
}

export async function updateExistingProduct(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    const { id } = req.params;
    const updates: UpdateProductRequest = req.body;

    
    if (updates.name !== undefined && updates.name.trim().length === 0) {
      return res.status(400).json({ message: 'Nome do produto não pode ser vazio' });
    }

    if (updates.price !== undefined && updates.price < 0) {
      return res.status(400).json({ message: 'Preço inválido' });
    }

    if (updates.stock !== undefined && updates.stock < 0) {
      return res.status(400).json({ message: 'Quantidade em estoque inválida' });
    }

    const product = await updateProduct(id, userId, updates);

    return res.status(200).json(product);
  } catch (error: any) {
    console.error('Erro ao atualizar produto:', error);
    if (error.message === 'Produto não encontrado ou não pertence ao usuário') {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Erro ao atualizar produto' });
  }
}


export async function deleteExistingProduct(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    const { id } = req.params;

    await deleteProduct(id, userId);

    return res.status(200).json({ message: 'Produto removido com sucesso' });
  } catch (error: any) {
    console.error('Erro ao deletar produto:', error);
    if (error.message === 'Produto não encontrado ou não pertence ao usuário') {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === 'Não é possível excluir produto com vendas associadas') {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Erro ao deletar produto' });
  }
}
