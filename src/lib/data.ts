
// Simulating database models and operations

// Types
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

// Simulated user (would typically come from authentication)
const currentUserId = 1;

// Load data from localStorage or initialize with sample data
const loadData = <T>(key: string, sampleData: T[] = []): T[] => {
  const storedData = localStorage.getItem(key);
  return storedData ? JSON.parse(storedData) : sampleData;
};

// Save data to localStorage
const saveData = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Sample data
const sampleUser: User = { id: 1, name: 'John Doe', email: 'john@example.com' };

const sampleIncomes: Income[] = [
  { id: 1, userId: 1, source: 'Salary', amount: 5000, date: '2023-04-01', note: 'Monthly salary' },
  { id: 2, userId: 1, source: 'Freelance', amount: 1200, date: '2023-04-15', note: 'Web design project' },
  { id: 3, userId: 1, source: 'Investments', amount: 450, date: '2023-04-22', note: 'Dividend payment' },
];

const sampleExpenses: Expense[] = [
  { id: 1, userId: 1, category: 'Rent', amount: 1500, date: '2023-04-05', note: 'Monthly rent' },
  { id: 2, userId: 1, category: 'Groceries', amount: 350, date: '2023-04-10', note: 'Weekly groceries' },
  { id: 3, userId: 1, category: 'Utilities', amount: 200, date: '2023-04-15', note: 'Electricity and water' },
  { id: 4, userId: 1, category: 'Entertainment', amount: 120, date: '2023-04-20', note: 'Movie and dinner' },
];

const sampleSavings: Saving[] = [
  { id: 1, userId: 1, goalName: 'Emergency Fund', targetAmount: 10000, currentAmount: 6000 },
  { id: 2, userId: 1, goalName: 'Vacation', targetAmount: 3000, currentAmount: 1500 },
];

const sampleInvestments: Investment[] = [
  { id: 1, userId: 1, name: 'S&P 500 ETF', type: 'ETF', amount: 5000, date: '2023-01-15', returns: 8.5 },
  { id: 2, userId: 1, name: 'Amazon Stock', type: 'Stock', amount: 2000, date: '2023-02-10', returns: 12.3 },
];

const sampleDebts: Debt[] = [
  { id: 1, userId: 1, type: 'Student Loan', amount: 15000, interest: 4.5, dueDate: '2025-06-01' },
  { id: 2, userId: 1, type: 'Credit Card', amount: 2500, interest: 18.9, dueDate: '2023-05-15' },
];

// Initialize data
export const getUserData = (): User => {
  const users = loadData<User>('users', [sampleUser]);
  return users.find(user => user.id === currentUserId) || sampleUser;
};

// Income operations
export const getIncomes = (): Income[] => {
  return loadData<Income>('incomes', sampleIncomes).filter(income => income.userId === currentUserId);
};

export const addIncome = (income: Omit<Income, 'id' | 'userId'>): Income => {
  const incomes = getIncomes();
  const newIncome: Income = {
    id: incomes.length > 0 ? Math.max(...incomes.map(i => i.id)) + 1 : 1,
    userId: currentUserId,
    ...income,
  };
  saveData('incomes', [...incomes, newIncome]);
  return newIncome;
};

// Expense operations
export const getExpenses = (): Expense[] => {
  return loadData<Expense>('expenses', sampleExpenses).filter(expense => expense.userId === currentUserId);
};

export const addExpense = (expense: Omit<Expense, 'id' | 'userId'>): Expense => {
  const expenses = getExpenses();
  const newExpense: Expense = {
    id: expenses.length > 0 ? Math.max(...expenses.map(e => e.id)) + 1 : 1,
    userId: currentUserId,
    ...expense,
  };
  saveData('expenses', [...expenses, newExpense]);
  return newExpense;
};

// Savings operations
export const getSavings = (): Saving[] => {
  return loadData<Saving>('savings', sampleSavings).filter(saving => saving.userId === currentUserId);
};

export const addSaving = (saving: Omit<Saving, 'id' | 'userId'>): Saving => {
  const savings = getSavings();
  const newSaving: Saving = {
    id: savings.length > 0 ? Math.max(...savings.map(s => s.id)) + 1 : 1,
    userId: currentUserId,
    ...saving,
  };
  saveData('savings', [...savings, newSaving]);
  return newSaving;
};

export const updateSaving = (id: number, update: Partial<Saving>): Saving | null => {
  const savings = getSavings();
  const index = savings.findIndex(s => s.id === id);
  
  if (index === -1) return null;
  
  const updatedSaving = { ...savings[index], ...update };
  savings[index] = updatedSaving;
  saveData('savings', savings);
  
  return updatedSaving;
};

// Investment operations
export const getInvestments = (): Investment[] => {
  return loadData<Investment>('investments', sampleInvestments).filter(investment => investment.userId === currentUserId);
};

export const addInvestment = (investment: Omit<Investment, 'id' | 'userId'>): Investment => {
  const investments = getInvestments();
  const newInvestment: Investment = {
    id: investments.length > 0 ? Math.max(...investments.map(i => i.id)) + 1 : 1,
    userId: currentUserId,
    ...investment,
  };
  saveData('investments', [...investments, newInvestment]);
  return newInvestment;
};

// Debt operations
export const getDebts = (): Debt[] => {
  return loadData<Debt>('debts', sampleDebts).filter(debt => debt.userId === currentUserId);
};

export const addDebt = (debt: Omit<Debt, 'id' | 'userId'>): Debt => {
  const debts = getDebts();
  const newDebt: Debt = {
    id: debts.length > 0 ? Math.max(...debts.map(d => d.id)) + 1 : 1,
    userId: currentUserId,
    ...debt,
  };
  saveData('debts', [...debts, newDebt]);
  return newDebt;
};

// Financial Summary
export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  totalInvestments: number;
  totalDebts: number;
  netWorth: number;
}

export const getFinancialSummary = (): FinancialSummary => {
  const incomes = getIncomes();
  const expenses = getExpenses();
  const savings = getSavings();
  const investments = getInvestments();
  const debts = getDebts();
  
  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalSavings = savings.reduce((sum, saving) => sum + saving.currentAmount, 0);
  const totalInvestments = investments.reduce((sum, investment) => sum + investment.amount, 0);
  const totalDebts = debts.reduce((sum, debt) => sum + debt.amount, 0);
  
  const netWorth = (totalIncome - totalExpenses) + totalSavings + totalInvestments - totalDebts;
  
  return {
    totalIncome,
    totalExpenses,
    totalSavings,
    totalInvestments,
    totalDebts,
    netWorth,
  };
};
