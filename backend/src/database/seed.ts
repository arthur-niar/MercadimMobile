import { createSale, hasSales } from "./sales";
import { findUserByEmail, createUser } from "./users";
import { createProduct, listProducts } from "./products";

export const seedSalesData = async () => {
  if (await hasSales()) {
    console.log("Dados de vendas já existem. Seed ignorado.");
    return;
  }

  let testUser = await findUserByEmail("teste@mercadim.com");

  if (!testUser) {
    console.log("Criando usuário de teste...");
    testUser = await createUser(
      "teste@mercadim.com",
      "senha123",
      "Usuário Teste",
    );
  }

  const productData = [
    { name: "Arroz 5kg", price: 25.9, stock: 50 },
    { name: "Feijão 1kg", price: 8.5, stock: 40 },
    { name: "Óleo de Soja 900ml", price: 7.2, stock: 35 },
    { name: "Açúcar 1kg", price: 4.8, stock: 45 },
    { name: "Café 500g", price: 12.9, stock: 30 },
    { name: "Macarrão 500g", price: 3.5, stock: 60 },
    { name: "Leite 1L", price: 5.2, stock: 55 },
  ];

  // Criar produtos
  const createdProducts = [];
  for (const prodData of productData) {
    try {
      const product = await createProduct(testUser.id, {
        name: prodData.name,
        price: prodData.price,
        stock: prodData.stock,
        category: "Alimentos",
      });
      createdProducts.push(product);
    } catch (error) {
      console.log(`Produto ${prodData.name} já existe ou houve erro ao criar`);
    }
  }

  // Criar vendas com os produtos criados
  for (const product of createdProducts) {
    const quantity = Math.floor(Math.random() * 10) + 2;
    try {
      await createSale({
        userId: testUser.id,
        items: [
          {
            productId: product.id,
            quantity,
          },
        ],
      });
    } catch (error) {
      console.log(`Erro ao criar venda para ${product.name}`);
    }
  }

  console.log("Dados de vendas criados com sucesso!");
};
