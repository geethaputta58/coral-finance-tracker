
import { Income } from '../types';
import { loadData, saveData } from '../utils/storage';
import { currentUserId, sampleIncomes } from '../utils/sampleData';

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
