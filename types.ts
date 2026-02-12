
export enum Responsible {
  BRYANNE = 'Bryanne',
  TRICK = 'Trick',
  CASA = 'Casa'
}

export enum TransactionStatus {
  PAGO = 'Pago',
  PENDENTE = 'Pendente'
}

export enum TransactionType {
  EXPENSE = 'Despesa',
  INCOME = 'Receita'
}

export enum PaymentMethod {
  PIX = 'PIX',
  CARD = 'Cartão'
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export interface Transaction {
  id: string;
  date: string;
  idealPaymentDate?: string;
  description: string;
  totalValue: number;
  installmentValue: number;
  currentInstallment: number;
  totalInstallments: number;
  category: string;
  responsible: Responsible;
  status: TransactionStatus;
  type: TransactionType;
  paymentMethod: PaymentMethod;
  bankId: string;
  isFixed?: boolean;
  isRecurring?: boolean;
  receivableFrom?: string;
  groupId?: string;
}

export interface BankBalance {
  current: number;
  lastUpdate: string;
}

export interface MonthlyStats {
  income: number;
  expenses: number;
  netResult: number;
  pixTotal: number;
  cardTotal: number;
  bryanneTotal: number;
  trickTotal: number;
  casaTotal: number;
  fixedRemaining: number;
  totalTrick: number;
  totalCasa: number;
  trickToMari: number;
}
