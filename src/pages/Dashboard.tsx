import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getFinancialSummary, getIncomes, getExpenses } from '@/lib/data';
import { ArrowUpIcon, ArrowDownIcon, PiggyBankIcon, TrendingUpIcon, CreditCardIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import UserDetails from '@/components/UserDetails';

const Dashboard = () => {
  const { user } = useAuth();
  
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
    // Load summary data
    const summaryData = getFinancialSummary();
    setSummary(summaryData);
    
    // Process income and expense data for the chart
    const incomes = getIncomes();
    const expenses = getExpenses();
    
    // Group by month for the chart data
    const monthlyData = processMonthlyData(incomes, expenses);
    setChartData(monthlyData);
    
    // Process expense categories for pie chart
    const categoryData = processExpenseCategories(expenses);
    setExpenseData(categoryData);
  }, []);

  // Process monthly income and expense data
  const processMonthlyData = (incomes: any[], expenses: any[]) => {
    const monthMap = new Map();
    
    // Process incomes
    incomes.forEach((income) => {
      const month = new Date(income.date).toLocaleDateString('en-US', { month: 'short' });
      if (!monthMap.has(month)) {
        monthMap.set(month, { month, income: 0, expenses: 0 });
      }
      const current = monthMap.get(month);
      monthMap.set(month, { ...current, income: current.income + income.amount });
    });
    
    // Process expenses
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
  
  // Process expense categories
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

  // Calculate savings progress
  const savingsProgress = summary.totalSavings > 0 ? 
    (summary.totalSavings / (summary.totalIncome * 0.2)) * 100 : 0;
    
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28AD1', '#FF6B6B'];
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Financial Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your personal finance dashboard. Here's an overview of your financial data.
        </p>
      </div>
      
      <UserDetails user={user} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <ArrowUpIcon className="h-4 w-4 mr-2 text-green-500" />
              Income
            </CardTitle>
            <CardDescription>Total income received</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary.totalIncome.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <ArrowDownIcon className="h-4 w-4 mr-2 text-red-500" />
              Expenses
            </CardTitle>
            <CardDescription>Total expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary.totalExpenses.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <PiggyBankIcon className="h-4 w-4 mr-2 text-primary" />
              Savings
            </CardTitle>
            <CardDescription>Total savings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary.totalSavings.toLocaleString()}</div>
            <Progress value={savingsProgress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">{savingsProgress.toFixed(0)}% of recommended</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <TrendingUpIcon className="h-4 w-4 mr-2 text-blue-500" />
              Investments
            </CardTitle>
            <CardDescription>Total investments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary.totalInvestments.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <CreditCardIcon className="h-4 w-4 mr-2 text-yellow-500" />
              Debts
            </CardTitle>
            <CardDescription>Total debts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary.totalDebts.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Net Worth</CardTitle>
            <CardDescription>Total assets minus liabilities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${summary.netWorth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ${summary.netWorth.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="income-expense">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="income-expense">Income vs Expenses</TabsTrigger>
          <TabsTrigger value="expense-breakdown">Expense Breakdown</TabsTrigger>
        </TabsList>
        
        <TabsContent value="income-expense" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Income vs Expenses</CardTitle>
              <CardDescription>Monthly comparison of income and expenses</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, '']} />
                  <Bar dataKey="income" name="Income" fill="#10b981" />
                  <Bar dataKey="expenses" name="Expenses" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="expense-breakdown" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
              <CardDescription>Categorization of your expenses</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, percent }) => `${category}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expenseData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value}`, '']} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
