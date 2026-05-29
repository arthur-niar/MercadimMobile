import api from './api';

export interface HomeSummary {
  totalSales: number;
  itemsSold: number;
  itemsReceived: number;
  averageTicket: number;
}

export interface SalesItem {
  name: string;
  quantity: number;
  color: string;
}

export interface HomeResponse {
  summary: HomeSummary;
  salesItems: SalesItem[];
}

class HomeService {
  async getHomeSummary(): Promise<HomeResponse> {
    try {
      const response = await api.get<HomeResponse>('/home/summary');
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar resumo da home:', error);
      
      if (error.response?.status === 401) {
        throw new Error('Sessão expirada. Faça login novamente.');
      }
      
      throw new Error('Erro ao carregar dados da home. Tente novamente.');
    }
  }

  async getHomeInsights(lang?: string): Promise<{ insights: string[] }> {
    try {
      const response = await api.get<{ insights: string[] }>('/home/insights', {
        headers: lang ? { 'Accept-Language': lang } : undefined
      });
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar insights da home:', error);
      
      if (error.response?.status === 401) {
        throw new Error('Sessão expirada. Faça login novamente.');
      }
      
      throw new Error('Erro ao carregar insights da home. Tente novamente.');
    }
  }
}

export const homeService = new HomeService();

