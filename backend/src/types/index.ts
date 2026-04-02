export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
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

export interface Sale {
  id: string;
  userId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: Date;
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
