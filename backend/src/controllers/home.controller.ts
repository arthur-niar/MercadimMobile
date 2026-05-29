import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { getSalesByUserId } from '../database/sales';
import { listProducts } from '../database/products';
import { HomeResponse, SalesItem } from '../types';
import { supabase } from '../config/supabase';
import { GoogleGenAI } from '@google/genai';

export const getHomeSummary = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      console.log('Usuário não autenticado');
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    const userId = req.user.userId;
    console.log('Buscando resumo para usuário:', userId);

    const [userSales, { data: estoqueData }] = await Promise.all([
      getSalesByUserId(userId),
      supabase.from('estoque').select('quantprodutos').eq('idusuario', parseInt(userId))
    ]);

    const totalStock = (estoqueData || []).reduce((sum, e) => sum + (e.quantprodutos || 0), 0);

    if (userSales.length === 0) {
      console.log('Nenhuma venda encontrada para o usuário');
      return res.json({
        summary: {
          totalSales: 0,
          itemsSold: 0,
          itemsReceived: totalStock,
          averageTicket: 0,
        },
        salesItems: [],
      });
    }

    const totalSales = userSales.reduce((sum, sale) => sum + sale.totalPrice, 0);
    
    
    const itemsSold = userSales.reduce((sum, sale) => {
      const itemsQtd = sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
      return sum + itemsQtd;
    }, 0);
    
    const averageTicket = totalSales / userSales.length;

    const productMap = new Map<string, number>();
    userSales.forEach(sale => {
      sale.items.forEach(item => {
        const current = productMap.get(item.productName) || 0;
        productMap.set(item.productName, current + item.quantity);
      });
    });

    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
    const salesItems: SalesItem[] = Array.from(productMap.entries())
      .map(([name, quantity], index) => ({
        name,
        quantity,
        color: colors[index % colors.length],
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);

    const itemsReceived = totalStock + itemsSold;

    const response: HomeResponse = {
      summary: {
        totalSales,
        itemsSold,
        itemsReceived,
        averageTicket,
      },
      salesItems,
    };

    console.log('Resumo gerado com sucesso');
    return res.json(response);
  } catch (error) {
    console.error('Erro ao buscar resumo:', error);
    return res.status(500).json({ message: 'Erro ao buscar resumo da home' });
  }
};

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

export const getHomeInsights = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    const userId = req.user.userId;

    // 1. Buscar vendas dos últimos 7 dias no Supabase
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const startDate = sevenDaysAgo.toISOString().split('T')[0];

    const [salesResponse, productsResponse, cacheResponse] = await Promise.all([
      supabase
        .from('venda')
        .select(`
          *,
          produtovenda (
            *,
            produto (*)
          )
        `)
        .eq('idusuario', parseInt(userId))
        .gte('datavenda', startDate),
      listProducts(userId, 1, 1000),
      supabase
        .from('insights_cache')
        .select('*')
        .eq('idusuario', parseInt(userId))
    ]);

    const salesData = salesResponse.data || [];
    const products = productsResponse.products || [];

    // Formatar vendas da semana
    const formattedSales = salesData.map(venda => {
      const items = (venda.produtovenda || []).map((pv: any) => ({
        productName: pv.produto ? pv.produto.nome : 'Produto Desconhecido',
        quantity: pv.quantidade,
        unitPrice: Number(pv.precounitario),
        totalItemPrice: pv.quantidade * Number(pv.precounitario)
      }));

      return {
        id: venda.idvenda,
        totalPrice: Number(venda.precototal),
        date: venda.datavenda,
        items
      };
    });

    // Formatar estoque atual
    const formattedProducts = products.map(p => ({
      name: p.name,
      price: p.price,
      stock: p.stock,
      category: p.category
    }));

    // Métricas calculadas para contextualização
    const totalSalesAmount = formattedSales.reduce((sum: number, s) => sum + s.totalPrice, 0);
    const totalItemsSold = formattedSales.reduce((sum: number, s) => {
      const itemsQtd = s.items.reduce((itemSum: number, item: any) => itemSum + item.quantity, 0);
      return sum + itemsQtd;
    }, 0);
    const numSales = formattedSales.length;
    const averageTicket = numSales > 0 ? totalSalesAmount / numSales : 0;

    // Identificar estoque baixo e sem saída
    const lowStockProducts = formattedProducts.filter(p => p.stock < 5);
    const soldProductNames = new Set(
      formattedSales.flatMap(s => s.items.map((item: any) => item.productName))
    );
    const deadStockProducts = formattedProducts.filter(p => p.stock >= 10 && !soldProductNames.has(p.name));

    const acceptLanguage = req.headers['accept-language'] || '';
    const isEnglish = acceptLanguage.toLowerCase().startsWith('en');
    const langKey = isEnglish ? 'en' : 'pt';
    const totalStock = formattedProducts.reduce((sum, p) => sum + (p.stock || 0), 0);
    const dataFingerprint = `${userId}_${numSales}_${totalSalesAmount.toFixed(2)}_${totalItemsSold}_${totalStock}_${langKey}`;

    const cachedData = cacheResponse.data && cacheResponse.data.length > 0 ? cacheResponse.data[0] : null;
    if (cachedData && cachedData.fingerprint === dataFingerprint) {
      const expiresAt = new Date(cachedData.expiraat).getTime();
      if (Date.now() < expiresAt) {
        console.log(`[Cache HIT] Dados idênticos para userId=${userId}. Servido do cache.`);
        return res.json({ insights: cachedData.insights, cached: true });
      }
    }

    console.log(`[Cache MISS] Dados de vendas ou estoque mudaram para userId=${userId}. Gerando novos insights...`);

    const apiKey = process.env.GEMINI_API_KEY;
    const isMock = !apiKey || apiKey === 'sua_chave_do_gemini_aqui' || apiKey.trim() === '';

    let insights: string[] = [];

    if (!isMock) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        
        const prompt = isEnglish ? `
You are an intelligent business agent for Mercadim, a sales and inventory management app for small merchants.
Your task is to analyze the merchant's sales and inventory data from the last week and generate predictive, actionable, and contextual insights.

Here is the actual merchant data from last week:
- Total sales value: R$ ${totalSalesAmount.toFixed(2)}
- Total quantity of items sold: ${totalItemsSold}
- Total number of sales: ${numSales}
- Average ticket: R$ ${averageTicket.toFixed(2)}

=== Weekly Detailed Sales ===
${JSON.stringify(formattedSales, null, 2)}

=== Current Product Inventory ===
${JSON.stringify(formattedProducts, null, 2)}

Generate exactly 2 to 4 short, direct, and highly actionable insights in English.
Examples of rules and crossovers to observe to generate insights:
1. High inventory + Low/zero sales: "Product X is sitting in inventory (N units), consider creating a promotion."
2. Performance drop/increase: Tips on average ticket or sales fluctuations.
3. Critical inventory + High output: "Product Y is your best seller and is running out (only N units left). Restock soon!"
4. Opportunities based on categories or items that sell the most.

Critical format instructions:
- Be short and focused: maximum 2 sentences per insight.
- Be friendly and encourage the merchant.
- Return ONLY a JSON string array in the format below, without markdown (do NOT use \`\`\`json blocks or additional text):
[
  "Insight 1",
  "Insight 2",
  "Insight 3"
]
` : `
Você é um agente inteligente de negócios para o Mercadim, um aplicativo de gestão de vendas e estoque de pequenos comerciantes.
Sua tarefa é analisar os dados de vendas e estoque do comerciante na última semana e gerar insights preditivos, acionáveis e contextuais.

Aqui estão os dados reais do lojista na última semana:
- Valor total de vendas: R$ ${totalSalesAmount.toFixed(2)}
- Quantidade total de itens vendidos: ${totalItemsSold}
- Número total de vendas: ${numSales}
- Ticket médio: R$ ${averageTicket.toFixed(2)}

=== Vendas Detalhadas da Semana ===
${JSON.stringify(formattedSales, null, 2)}

=== Estoque Atual de Produtos ===
${JSON.stringify(formattedProducts, null, 2)}

Gere exatamente de 2 a 4 insights curtos, diretos e altamente acionáveis em Português.
Exemplos de regras e cruzamentos a observar para gerar insights:
1. Estoque alto + Vendas baixas/zero: "O produto X está parado no estoque (N unidades), considere fazer uma promoção."
2. Queda/Aumento de performance: Dicas sobre ticket médio ou flutuações.
3. Estoque crítico + Saída alta: "O produto Y é o mais vendido e está acabando (apenas N unidades). Reabasteça logo!"
4. Oportunidades baseadas nas categorias ou itens que mais vendem.

Instruções críticas de formato:
- Seja curto e focado: no máximo 2 frases por insight.
- Seja amigável e incentive o comerciante.
- Retorne APENAS um array JSON de strings no formato abaixo, sem markdown (NÃO use blocos \`\`\`json ou texto adicional):
[
  "Insight 1",
  "Insight 2",
  "Insight 3"
]
`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-lite',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          }
        });

        const text = response.text?.trim() || '[]';
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        insights = JSON.parse(cleanedText);

        if (!Array.isArray(insights) || insights.length === 0) {
          throw new Error('Retorno da IA não é um array válido.');
        }
      } catch (aiError) {
        console.error('Erro ao chamar API do Gemini, usando fallback:', aiError);
        insights = generateMockInsights(totalSalesAmount, totalItemsSold, averageTicket, lowStockProducts, deadStockProducts, isEnglish);
      }
    } else {
      console.log('Chave do Gemini não configurada ou inválida. Usando insights simulados.');
      insights = generateMockInsights(totalSalesAmount, totalItemsSold, averageTicket, lowStockProducts, deadStockProducts, isEnglish);
    }

    const expiresAt = new Date(Date.now() + CACHE_TTL_MS).toISOString();
    await supabase.from('insights_cache').upsert(
      {
        idusuario: parseInt(userId),
        insights,
        fingerprint: dataFingerprint,
        expiraat: expiresAt
      },
      { onConflict: 'idusuario' }
    );
    console.log(`[Cache SET] Insights salvos no cache para userId=${userId} por 24h.`);

    return res.json({ insights, cached: false });
  } catch (error) {
    console.error('Erro na rota de insights:', error);
    return res.status(500).json({ message: 'Erro ao gerar insights de negócios' });
  }
};

function generateMockInsights(
  totalSales: number,
  itemsSold: number,
  averageTicket: number,
  lowStock: any[],
  deadStock: any[],
  isEnglish: boolean
): string[] {
  const insights: string[] = [];

  if (isEnglish) {
    if (totalSales > 0) {
      insights.push(
        `Your sales totaled R$ ${totalSales.toFixed(2)} this week with an average ticket of R$ ${averageTicket.toFixed(2)}. Great job!`
      );
    } else {
      insights.push(
        "No sales registered this week. How about registering and promoting more products to attract new customers?"
      );
    }

    if (lowStock.length > 0) {
      const mainLow = lowStock[0];
      insights.push(
        `Inventory alert! Product "${mainLow.name}" has only ${mainLow.stock} units left. Restock before the weekend.`
      );
    }

    if (deadStock.length > 0) {
      const mainDead = deadStock[0];
      insights.push(
        `Dead stock: "${mainDead.name}" has ${mainDead.stock} units and had no sales this week. Consider creating a promotion or combo.`
      );
    }

    if (insights.length < 3) {
      insights.push(
        "Tip: Monitor your sales and inventory daily to make faster decisions and avoid product loss."
      );
    }
  } else {
    if (totalSales > 0) {
      insights.push(
        `Suas vendas somaram R$ ${totalSales.toFixed(2)} nesta semana com um ticket médio de R$ ${averageTicket.toFixed(2)}. Ótimo trabalho!`
      );
    } else {
      insights.push(
        "Nenhuma venda registrada nesta semana. Que tal cadastrar e divulgar mais produtos para atrair novos clientes?"
      );
    }

    if (lowStock.length > 0) {
      const mainLow = lowStock[0];
      insights.push(
        `Alerta de estoque! O produto "${mainLow.name}" está com apenas ${mainLow.stock} unidades. Reabasteça antes do fim de semana.`
      );
    }

    if (deadStock.length > 0) {
      const mainDead = deadStock[0];
      insights.push(
        `Estoque parado: "${mainDead.name}" tem ${mainDead.stock} unidades e não teve vendas esta semana. Considere criar uma promoção ou combo.`
      );
    }

    if (insights.length < 3) {
      insights.push(
        "Dica: Acompanhe diariamente suas vendas e estoque para tomar decisões mais rápidas e evitar perdas de produtos."
      );
    }
  }

  return insights.slice(0, 4);
}

