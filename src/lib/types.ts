
export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Income {
  id: number;
  userId: number;
  source: string;
  amount: number;
  date: string;
  note: string;
}

export interface Expense {
  id: number;
  userId: number;
  category: string;
  amount: number;
  date: string;
  note: string;
}

export interface Saving {
  id: number;
  userId: number;
  goalName: string;
  targetAmount: number;
  currentAmount: number;
}

export interface Investment {
  id: number;
  userId: number;
  name: string;
  type: string;
  amount: number;
  date: string;
  returns: number;
}

export interface Debt {
  id: number;
  userId: number;
  type: string;
  amount: number;
  interest: number;
  dueDate: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  totalInvestments: number;
  totalDebts: number;
  netWorth: number;
}
