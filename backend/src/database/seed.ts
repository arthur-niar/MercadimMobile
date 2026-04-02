import { createSale, hasSales } from './sales';
import { findUserByEmail } from './users';

export const seedSalesData = () => {
  if (hasSales()) {
    console.log('Dados de vendas já existem. Seed ignorado.');
    return;
  }

  const testUser = findUserByEmail('teste@mercadim.com');
  
  if (!testUser) {
    console.log('Usuário de teste não encontrado. Execute o login primeiro.');
    return;
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

  products.forEach(product => {
    const quantity = Math.floor(Math.random() * 15) + 5;
    createSale({
      userId: testUser.id,
      productName: product.name,
      quantity,
      unitPrice: product.unitPrice,
      totalPrice: product.unitPrice * quantity,
    });
  });

  console.log('Dados de vendas criados com sucesso!');
};
