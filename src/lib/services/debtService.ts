
import { Debt } from '../types';

// Mock user ID
const userId = 1;

// Mock data
const debtData: Debt[] = [
  { id: 1, userId: 1, type: 'Student Loan', amount: 15000, interest: 4.5, dueDate: '2030-05-15' },
  { id: 2, userId: 1, type: 'Credit Card', amount: 2500, interest: 18.9, dueDate: '2023-04-10' },
  { id: 3, userId: 1, type: 'Mortgage', amount: 250000, interest: 3.2, dueDate: '2050-07-28' },
];

// Mock API functions
export const getDebts = (): Debt[] => {
  return debtData.filter(debt => debt.userId === userId);
};

export const addDebt = (data: Omit<Debt, 'id' | 'userId'>): Debt => {
  const newDebt: Debt = {
    id: debtData.length + 1,
    userId,
    ...data,
  };
  debtData.push(newDebt);
  return newDebt;
};

export const updateDebt = (id: number, data: Omit<Debt, 'id' | 'userId'>): Debt | null => {
  const index = debtData.findIndex(debt => debt.id === id && debt.userId === userId);
  if (index === -1) return null;
  
  const updatedDebt: Debt = {
    id,
    userId,
    ...data,
  };
  debtData[index] = updatedDebt;
  return updatedDebt;
};

export const deleteDebt = (id: number): boolean => {
  const index = debtData.findIndex(debt => debt.id === id && debt.userId === userId);
  if (index === -1) return false;
  
  debtData.splice(index, 1);
  return true;
};

// Re-export the Debt type
export type { Debt } from '../types';
