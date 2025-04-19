
import { Debt } from '../types';
import { loadData, saveData } from '../utils/storage';
import { currentUserId, sampleDebts } from '../utils/sampleData';

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

export const updateDebt = (id: number, update: Partial<Debt>): Debt | null => {
  const debts = getDebts();
  const index = debts.findIndex(d => d.id === id);
  
  if (index === -1) return null;
  
  const updatedDebt = { ...debts[index], ...update };
  debts[index] = updatedDebt;
  saveData('debts', debts);
  
  return updatedDebt;
};

export const deleteDebt = (id: number): boolean => {
  const debts = getDebts();
  const index = debts.findIndex(d => d.id === id);
  
  if (index === -1) return false;
  
  debts.splice(index, 1);
  saveData('debts', debts);
  return true;
};
