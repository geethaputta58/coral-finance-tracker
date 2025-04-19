
import { User, Income, Expense, Saving, Investment, Debt } from '../types';

export const currentUserId = 1;

export const sampleUser: User = { 
  id: 1, 
  name: 'John Doe', 
  email: 'john@example.com' 
};

export const sampleIncomes: Income[] = [
  { id: 1, userId: 1, source: 'Salary', amount: 5000, date: '2023-04-01', note: 'Monthly salary' },
  { id: 2, userId: 1, source: 'Freelance', amount: 1200, date: '2023-04-15', note: 'Web design project' },
  { id: 3, userId: 1, source: 'Investments', amount: 450, date: '2023-04-22', note: 'Dividend payment' },
];

export const sampleExpenses: Expense[] = [
  { id: 1, userId: 1, category: 'Rent', amount: 1500, date: '2023-04-05', note: 'Monthly rent' },
  { id: 2, userId: 1, category: 'Groceries', amount: 350, date: '2023-04-10', note: 'Weekly groceries' },
  { id: 3, userId: 1, category: 'Utilities', amount: 200, date: '2023-04-15', note: 'Electricity and water' },
  { id: 4, userId: 1, category: 'Entertainment', amount: 120, date: '2023-04-20', note: 'Movie and dinner' },
];

export const sampleSavings: Saving[] = [
  { id: 1, userId: 1, goalName: 'Emergency Fund', targetAmount: 10000, currentAmount: 6000 },
  { id: 2, userId: 1, goalName: 'Vacation', targetAmount: 3000, currentAmount: 1500 },
];

export const sampleInvestments: Investment[] = [
  { id: 1, userId: 1, name: 'S&P 500 ETF', type: 'ETF', amount: 5000, date: '2023-01-15', returns: 8.5 },
  { id: 2, userId: 1, name: 'Amazon Stock', type: 'Stock', amount: 2000, date: '2023-02-10', returns: 12.3 },
];

export const sampleDebts: Debt[] = [
  { id: 1, userId: 1, type: 'Student Loan', amount: 15000, interest: 4.5, dueDate: '2025-06-01' },
  { id: 2, userId: 1, type: 'Credit Card', amount: 2500, interest: 18.9, dueDate: '2023-05-15' },
];
