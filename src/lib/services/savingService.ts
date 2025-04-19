
import { Saving } from '../types';
import { loadData, saveData } from '../utils/storage';
import { currentUserId, sampleSavings } from '../utils/sampleData';

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
