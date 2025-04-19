
import { Income, Expense, Saving, Investment, Debt, FinancialSummary } from './types';

// Mock user ID
const userId = 1;

// Mock data
const incomeData: Income[] = [
  { id: 1, userId: 1, source: 'Salary', amount: 5000, date: '2023-03-15', note: 'Monthly salary' },
  { id: 2, userId: 1, source: 'Freelance', amount: 1200, date: '2023-03-20', note: 'Website project' },
  { id: 3, userId: 1, source: 'Investments', amount: 450, date: '2023-03-10', note: 'Dividend payment' },
  { id: 4, userId: 1, source: 'Salary', amount: 5000, date: '2023-02-15', note: 'Monthly salary' },
  { id: 5, userId: 1, source: 'Side Hustle', amount: 800, date: '2023-02-25', note: 'Consulting work' },
  { id: 6, userId: 1, source: 'Salary', amount: 5000, date: '2023-01-15', note: 'Monthly salary' },
];

const expenseData: Expense[] = [
  { id: 1, userId: 1, category: 'Housing', amount: 1200, date: '2023-03-01', note: 'Monthly rent' },
  { id: 2, userId: 1, category: 'Food & Dining', amount: 450, date: '2023-03-10', note: 'Groceries' },
  { id: 3, userId: 1, category: 'Transportation', amount: 200, date: '2023-03-15', note: 'Gas' },
  { id: 4, userId: 1, category: 'Entertainment', amount: 150, date: '2023-03-18', note: 'Movie night' },
  { id: 5, userId: 1, category: 'Utilities', amount: 180, date: '2023-03-05', note: 'Electricity bill' },
  { id: 6, userId: 1, category: 'Housing', amount: 1200, date: '2023-02-01', note: 'Monthly rent' },
  { id: 7, userId: 1, category: 'Food & Dining', amount: 380, date: '2023-02-12', note: 'Groceries' },
  { id: 8, userId: 1, category: 'Healthcare', amount: 120, date: '2023-02-20', note: 'Prescription' },
];

const savingData: Saving[] = [
  { id: 1, userId: 1, goalName: 'Emergency Fund', targetAmount: 10000, currentAmount: 5000 },
  { id: 2, userId: 1, goalName: 'Vacation', targetAmount: 3000, currentAmount: 1500 },
  { id: 3, userId: 1, goalName: 'New Car', targetAmount: 20000, currentAmount: 3000 },
];

const investmentData: Investment[] = [
  { id: 1, userId: 1, name: 'S&P 500 ETF', type: 'ETF', amount: 10000, date: '2022-01-15', returns: 7.5 },
  { id: 2, userId: 1, name: 'Tech Company Stock', type: 'Stock', amount: 5000, date: '2022-05-20', returns: 12.3 },
  { id: 3, userId: 1, name: '401(k)', type: 'Retirement', amount: 35000, date: '2020-03-10', returns: 6 },
];

const debtData: Debt[] = [
  { id: 1, userId: 1, type: 'Student Loan', amount: 15000, interest: 4.5, dueDate: '2030-05-15' },
  { id: 2, userId: 1, type: 'Credit Card', amount: 2500, interest: 18.9, dueDate: '2023-04-10' },
  { id: 3, userId: 1, type: 'Mortgage', amount: 250000, interest: 3.2, dueDate: '2050-07-28' },
];

// Calculate financial summary based on mock data
const calculateFinancialSummary = (): FinancialSummary => {
  const totalIncome = incomeData.reduce((sum, income) => sum + income.amount, 0);
  const totalExpenses = expenseData.reduce((sum, expense) => sum + expense.amount, 0);
  const totalSavings = savingData.reduce((sum, saving) => sum + saving.currentAmount, 0);
  const totalInvestments = investmentData.reduce((sum, investment) => sum + investment.amount, 0);
  const totalDebts = debtData.reduce((sum, debt) => sum + debt.amount, 0);
  const netWorth = totalSavings + totalInvestments - totalDebts;
  
  return {
    totalIncome,
    totalExpenses,
    totalSavings,
    totalInvestments,
    totalDebts,
    netWorth,
  };
};

// Mock API functions
export const getIncomes = (): Income[] => {
  return incomeData.filter(income => income.userId === userId);
};

export const addIncome = (data: Omit<Income, 'id' | 'userId'>): Income => {
  const newIncome: Income = {
    id: incomeData.length + 1,
    userId,
    ...data,
  };
  incomeData.push(newIncome);
  return newIncome;
};

export const getExpenses = (): Expense[] => {
  return expenseData.filter(expense => expense.userId === userId);
};

export const addExpense = (data: Omit<Expense, 'id' | 'userId'>): Expense => {
  const newExpense: Expense = {
    id: expenseData.length + 1,
    userId,
    ...data,
  };
  expenseData.push(newExpense);
  return newExpense;
};

export const getSavings = (): Saving[] => {
  return savingData.filter(saving => saving.userId === userId);
};

export const addSaving = (data: Omit<Saving, 'id' | 'userId'>): Saving => {
  const newSaving: Saving = {
    id: savingData.length + 1,
    userId,
    ...data,
  };
  savingData.push(newSaving);
  return newSaving;
};

export const updateSaving = (id: number, data: Omit<Saving, 'id' | 'userId'>): Saving | null => {
  const index = savingData.findIndex(saving => saving.id === id && saving.userId === userId);
  if (index === -1) return null;
  
  const updatedSaving: Saving = {
    id,
    userId,
    ...data,
  };
  savingData[index] = updatedSaving;
  return updatedSaving;
};

export const getInvestments = (): Investment[] => {
  return investmentData.filter(investment => investment.userId === userId);
};

export const getDebts = (): Debt[] => {
  return debtData.filter(debt => debt.userId === userId);
};

export const getFinancialSummary = (): FinancialSummary => {
  return calculateFinancialSummary();
};

// Export types for convenience
export type { Income, Expense, Saving, Investment, Debt, FinancialSummary };
