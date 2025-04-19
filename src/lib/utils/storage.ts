
export const loadData = <T>(key: string, sampleData: T[] = []): T[] => {
  const storedData = localStorage.getItem(key);
  return storedData ? JSON.parse(storedData) : sampleData;
};

export const saveData = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};
