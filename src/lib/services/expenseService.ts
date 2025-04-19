
import { Expense } from '../types';
import { loadData, saveData } from '../utils/storage';
import { currentUserId, sampleExpenses } from '../utils/sampleData';

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
