import { createSale, hasSales } from './sales';
import { findUserByEmail, createUser } from './users';

export const seedSalesData = async () => {
  if (await hasSales()) {
    console.log('Dados de vendas já existem. Seed ignorado.');
    return;
  }

  let testUser = await findUserByEmail('teste@mercadim.com');
  
  if (!testUser) {
    console.log('Criando usuário de teste...');
    testUser = await createUser('teste@mercadim.com', 'senha123', 'Usuário Teste');
  }

  const products = [
    { name: 'Arroz 5kg', unitPrice: 25.90 },
    { name: 'Feijão 1kg', unitPrice: 8.50 },
    { name: 'Óleo de Soja 900ml', unitPrice: 7.20 },
    { name: 'Açúcar 1kg', unitPrice: 4.80 },
    { name: 'Café 500g', unitPrice: 12.90 },
    { name: 'Macarrão 500g', unitPrice: 3.50 },
    { name: 'Leite 1L', unitPrice: 5.20 },
  ];

  for(const product of products) {
    const quantity = Math.floor(Math.random() * 15) + 5;
    await createSale({
      userId: testUser.id,
      productName: product.name,
      quantity,
      unitPrice: product.unitPrice,
      totalPrice: product.unitPrice * quantity,
    });
  }

  console.log('Dados de vendas criados com sucesso!');
};
