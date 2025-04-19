
import { FinancialSummary } from '../types';
import { getIncomes } from './incomeService';
import { getExpenses } from './expenseService';
import { getSavings } from './savingService';
import { getInvestments } from './investmentService';
import { getDebts } from './debtService';

export const getFinancialSummary = (): FinancialSummary => {
  const incomes = getIncomes();
  const expenses = getExpenses();
  const savings = getSavings();
  const investments = getInvestments();
  const debts = getDebts();
  
  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalSavings = savings.reduce((sum, saving) => sum + saving.currentAmount, 0);
  const totalInvestments = investments.reduce((sum, investment) => sum + investment.amount, 0);
  const totalDebts = debts.reduce((sum, debt) => sum + debt.amount, 0);
  
  const netWorth = (totalIncome - totalExpenses) + totalSavings + totalInvestments - totalDebts;
  
  return {
    totalIncome,
    totalExpenses,
    totalSavings,
    totalInvestments,
    totalDebts,
    netWorth,
  };
};
