
import { Investment } from '../types';
import { loadData, saveData } from '../utils/storage';
import { currentUserId, sampleInvestments } from '../utils/sampleData';

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

export const updateInvestment = (id: number, update: Partial<Investment>): Investment | null => {
  const investments = getInvestments();
  const index = investments.findIndex(i => i.id === id);
  
  if (index === -1) return null;
  
  const updatedInvestment = { ...investments[index], ...update };
  investments[index] = updatedInvestment;
  saveData('investments', investments);
  
  return updatedInvestment;
};

export const deleteInvestment = (id: number): boolean => {
  const investments = getInvestments();
  const index = investments.findIndex(i => i.id === id);
  
  if (index === -1) return false;
  
  investments.splice(index, 1);
  saveData('investments', investments);
  return true;
};
