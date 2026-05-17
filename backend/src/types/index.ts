export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  url: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface PasswordResetCode {
  email: string;
  code: string;
  expiresAt: Date;
}

export interface AuthPayload {
  userId: string;
  email: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Sale {
  id: string;
  userId: string;
  items: SaleItem[];
  totalPrice: number;
  createdAt: Date;
}

export interface SaleItemRequest {
  productId: string;
  quantity: number;
}

export interface CreateSaleRequest {
  userId: string;
  items: SaleItemRequest[];
}

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

export interface Notification {
  id: number;
  userId: string;
  title: string;
  description: string;
  type?: string;
  date: string;
  read: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category?: string;
  createdAt: string;
  ativo?: boolean;
}

export interface CreateProductRequest {
  name: string;
  price: number;
  stock: number;
  category?: string;
}

export interface UpdateProductRequest {
  name?: string;
  price?: number;
  stock?: number;
  category?: string;
}

export interface ProductsListResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface Report {
  itensVendidos: number;
  numeroVendas: number;
  ticketMedio: number;
  totalVendas: number;
}
