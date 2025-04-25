
import { useEffect, useState } from 'react';
import UserDetails from '@/components/UserDetails';
import { FinancialCharts } from '@/components/dashboard/FinancialCharts';
import { FinancialSummaryCards } from '@/components/dashboard/FinancialSummaryCards';
import { getFinancialSummary, getIncomes, getExpenses } from '@/lib/data';

interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  totalInvestments: number;
  totalDebts: number;
  netWorth: number;
}

const Dashboard = () => {
  const [summary, setSummary] = useState<FinancialSummary>({
    totalIncome: 0,
    totalExpenses: 0,
    totalSavings: 0,
    totalInvestments: 0,
    totalDebts: 0,
    netWorth: 0,
  });

  const [chartData, setChartData] = useState<any[]>([]);
  const [expenseData, setExpenseData] = useState<any[]>([]);

  useEffect(() => {
    const summaryData = getFinancialSummary();
    setSummary(summaryData);
    
    const incomes = getIncomes();
    const expenses = getExpenses();
    
    const monthlyData = processMonthlyData(incomes, expenses);
    setChartData(monthlyData);
    
    const categoryData = processExpenseCategories(expenses);
    setExpenseData(categoryData);
  }, []);

  const processMonthlyData = (incomes: any[], expenses: any[]) => {
    const monthMap = new Map();
    
    incomes.forEach((income) => {
      const month = new Date(income.date).toLocaleDateString('en-US', { month: 'short' });
      if (!monthMap.has(month)) {
        monthMap.set(month, { month, income: 0, expenses: 0 });
      }
      const current = monthMap.get(month);
      monthMap.set(month, { ...current, income: current.income + income.amount });
    });
    
    expenses.forEach((expense) => {
      const month = new Date(expense.date).toLocaleDateString('en-US', { month: 'short' });
      if (!monthMap.has(month)) {
        monthMap.set(month, { month, income: 0, expenses: 0 });
      }
      const current = monthMap.get(month);
      monthMap.set(month, { ...current, expenses: current.expenses + expense.amount });
    });
    
    return Array.from(monthMap.values());
  };
  
  const processExpenseCategories = (expenses: any[]) => {
    const categoryMap = new Map();
    
    expenses.forEach((expense) => {
      if (!categoryMap.has(expense.category)) {
        categoryMap.set(expense.category, 0);
      }
      categoryMap.set(expense.category, categoryMap.get(expense.category) + expense.amount);
    });
    
    return Array.from(categoryMap.entries()).map(([category, value]) => ({ 
      category, 
      value 
    }));
  };

  const savingsProgress = summary.totalSavings > 0 ? 
    (summary.totalSavings / (summary.totalIncome * 0.2)) * 100 : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Financial Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your personal finance dashboard. Here's an overview of your financial data.
        </p>
      </div>
      
      <UserDetails />
      
      <FinancialSummaryCards 
        summary={summary}
        savingsProgress={savingsProgress}
      />
      
      <FinancialCharts 
        chartData={chartData}
        expenseData={expenseData}
      />
    </div>
  );
};

export default Dashboard;
