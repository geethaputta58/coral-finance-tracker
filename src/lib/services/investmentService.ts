
import { Investment } from '../types';

// Mock user ID
const userId = 1;

// Mock data
const investmentData: Investment[] = [
  { id: 1, userId: 1, name: 'S&P 500 ETF', type: 'ETF', amount: 10000, date: '2022-01-15', returns: 7.5 },
  { id: 2, userId: 1, name: 'Tech Company Stock', type: 'Stock', amount: 5000, date: '2022-05-20', returns: 12.3 },
  { id: 3, userId: 1, name: '401(k)', type: 'Retirement', amount: 35000, date: '2020-03-10', returns: 6 },
];

// Mock API functions
export const getInvestments = (): Investment[] => {
  return investmentData.filter(investment => investment.userId === userId);
};

export const addInvestment = (data: Omit<Investment, 'id' | 'userId'>): Investment => {
  const newInvestment: Investment = {
    id: investmentData.length + 1,
    userId,
    ...data,
  };
  investmentData.push(newInvestment);
  return newInvestment;
};

export const updateInvestment = (id: number, data: Omit<Investment, 'id' | 'userId'>): Investment | null => {
  const index = investmentData.findIndex(investment => investment.id === id && investment.userId === userId);
  if (index === -1) return null;
  
  const updatedInvestment: Investment = {
    id,
    userId,
    ...data,
  };
  investmentData[index] = updatedInvestment;
  return updatedInvestment;
};

export const deleteInvestment = (id: number): boolean => {
  const index = investmentData.findIndex(investment => investment.id === id && investment.userId === userId);
  if (index === -1) return false;
  
  investmentData.splice(index, 1);
  return true;
};

// Re-export the Investment type
export type { Investment } from '../types';
