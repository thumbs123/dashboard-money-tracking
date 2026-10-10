export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string | number;
  amount: number;
  type: TransactionType;
  date: string;
  description: string;
  merchant?: string | null;
  category: string;
  account: string;
  source?: string;
  created_at?: string;
}

export interface CategorySummary {
  name: string;
  type: TransactionType;
  total: number;
  count: number;
  percentage: number;
  color?: string;
}

export interface MonthlyTrend {
  month: string;
  monthLabel: string;
  income: number;
  expense: number;
  net: number;
}

export interface AccountSummary {
  id: string | number;
  name: string;
  balance: number;
  type?: string;
}

export interface UserProfile {
  id: number | string;
  name: string;
  telegramId: string;
}

export interface DashboardOverview {
  currentUser?: UserProfile | null;
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  monthlyNet: number;
  savingsRate: number;
  transactionCount: number;
  selectedMonth: string;
  categories: CategorySummary[];
  trends: MonthlyTrend[];
  recentTransactions: Transaction[];
  accounts: AccountSummary[];
  isLiveDb: boolean;
  lastSyncTime: string;
}
