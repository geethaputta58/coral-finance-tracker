
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getExpenses, getIncomes, getSavings, getInvestments, getDebts, getFinancialSummary, Expense, Income, FinancialSummary } from '@/lib/data';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { FileTextIcon, TrendingUpIcon, TrendingDownIcon, DollarSignIcon } from 'lucide-react';

const ReportsPage = () => {
  const [timeFrame, setTimeFrame] = useState<string>('month');
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<FinancialSummary>({} as FinancialSummary);
  const [incomeByPeriod, setIncomeByPeriod] = useState<any[]>([]);
  const [expenseByPeriod, setExpenseByPeriod] = useState<any[]>([]);
  const [cashFlow, setCashFlow] = useState<any[]>([]);
  const [expensesByCategory, setExpensesByCategory] = useState<any[]>([]);
  const [incomeBySource, setIncomeBySource] = useState<any[]>([]);
  
  useEffect(() => {
    // Load data
    const loadedIncomes = getIncomes();
    const loadedExpenses = getExpenses();
    const financialSummary = getFinancialSummary();
    
    setIncomes(loadedIncomes);
    setExpenses(loadedExpenses);
    setSummary(financialSummary);
    
    // Process data for charts
    processTimeBasedData(loadedIncomes, loadedExpenses, timeFrame);
    processCategoryData(loadedExpenses);
    processSourceData(loadedIncomes);
  }, []);
  
  useEffect(() => {
    processTimeBasedData(incomes, expenses, timeFrame);
  }, [timeFrame, incomes, expenses]);
  
  const processTimeBasedData = (incomes: Income[], expenses: Expense[], timeFrame: string) => {
    const incomeMap = new Map<string, number>();
    const expenseMap = new Map<string, number>();
    const cashFlowMap = new Map<string, { income: number; expense: number; net: number }>();
    
    // Get date format based on time frame
    const formatDate = (date: Date): string => {
      if (timeFrame === 'year') {
        return date.getFullYear().toString();
      } else if (timeFrame === 'quarter') {
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        return `Q${quarter} ${date.getFullYear()}`;
      } else {
        // month
        return `${date.getMonth() + 1}/${date.getFullYear()}`;
      }
    };
    
    // Process income data
    incomes.forEach(income => {
      const date = new Date(income.date);
      const period = formatDate(date);
      
      incomeMap.set(period, (incomeMap.get(period) || 0) + income.amount);
      
      const existing = cashFlowMap.get(period) || { income: 0, expense: 0, net: 0 };
      cashFlowMap.set(period, {
        ...existing,
        income: existing.income + income.amount,
        net: existing.net + income.amount
      });
    });
    
    // Process expense data
    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const period = formatDate(date);
      
      expenseMap.set(period, (expenseMap.get(period) || 0) + expense.amount);
      
      const existing = cashFlowMap.get(period) || { income: 0, expense: 0, net: 0 };
      cashFlowMap.set(period, {
        ...existing,
        expense: existing.expense + expense.amount,
        net: existing.net - expense.amount
      });
    });
    
    // Convert maps to arrays for charts
    const incomeArray = Array.from(incomeMap).map(([name, value]) => ({ name, value }));
    const expenseArray = Array.from(expenseMap).map(([name, value]) => ({ name, value }));
    const cashFlowArray = Array.from(cashFlowMap).map(([name, values]) => ({
      name,
      income: values.income,
      expense: values.expense,
      net: values.net
    }));
    
    // Sort arrays by date
    const sortByDate = (a: any, b: any) => {
      if (timeFrame === 'year') {
        return parseInt(a.name) - parseInt(b.name);
      } else if (timeFrame === 'quarter') {
        const aYear = parseInt(a.name.split(' ')[1]);
        const bYear = parseInt(b.name.split(' ')[1]);
        if (aYear !== bYear) return aYear - bYear;
        
        const aQuarter = parseInt(a.name.split('Q')[1].split(' ')[0]);
        const bQuarter = parseInt(b.name.split('Q')[1].split(' ')[0]);
        return aQuarter - bQuarter;
      } else {
        // month/year
        const [aMonth, aYear] = a.name.split('/');
        const [bMonth, bYear] = b.name.split('/');
        if (aYear !== bYear) return parseInt(aYear) - parseInt(bYear);
        return parseInt(aMonth) - parseInt(bMonth);
      }
    };
    
    incomeArray.sort(sortByDate);
    expenseArray.sort(sortByDate);
    cashFlowArray.sort(sortByDate);
    
    setIncomeByPeriod(incomeArray);
    setExpenseByPeriod(expenseArray);
    setCashFlow(cashFlowArray);
  };
  
  const processCategoryData = (expenses: Expense[]) => {
    const categoryMap = new Map<string, number>();
    
    expenses.forEach(expense => {
      const existing = categoryMap.get(expense.category) || 0;
      categoryMap.set(expense.category, existing + expense.amount);
    });
    
    const categoryArray = Array.from(categoryMap).map(([name, value]) => ({ name, value }));
    setExpensesByCategory(categoryArray);
  };
  
  const processSourceData = (incomes: Income[]) => {
    const sourceMap = new Map<string, number>();
    
    incomes.forEach(income => {
      const existing = sourceMap.get(income.source) || 0;
      sourceMap.set(income.source, existing + income.amount);
    });
    
    const sourceArray = Array.from(sourceMap).map(([name, value]) => ({ name, value }));
    setIncomeBySource(sourceArray);
  };
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28AD1', '#FF6B6B'];
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Financial Reports</h1>
        <p className="text-muted-foreground">
          Analyze your financial data with detailed reports and insights.
        </p>
      </div>
      
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <DollarSignIcon className="mr-2 h-4 w-4" />
                Net Worth
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary.netWorth?.toLocaleString() || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <TrendingUpIcon className="mr-2 h-4 w-4" />
                Total Income
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary.totalIncome?.toLocaleString() || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <TrendingDownIcon className="mr-2 h-4 w-4" />
                Total Expenses
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary.totalExpenses?.toLocaleString() || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <FileTextIcon className="mr-2 h-4 w-4" />
                Savings Rate
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary.totalIncome ? `${((summary.totalIncome - summary.totalExpenses) / summary.totalIncome * 100).toFixed(1)}%` : '0%'}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-end">
        <Select value={timeFrame} onValueChange={setTimeFrame}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Time Frame" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Monthly</SelectItem>
            <SelectItem value="quarter">Quarterly</SelectItem>
            <SelectItem value="year">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Tabs defaultValue="cash-flow" className="space-y-4">
        <TabsList>
          <TabsTrigger value="cash-flow">Cash Flow</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cash-flow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cash Flow Analysis</CardTitle>
              <CardDescription>Income vs Expenses over time</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              {cashFlow.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={cashFlow}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                    <Legend />
                    <Bar dataKey="income" name="Income" fill="#4CAF50" />
                    <Bar dataKey="expense" name="Expenses" fill="#FF5722" />
                    <Line type="monotone" dataKey="net" name="Net Cash Flow" stroke="#2196F3" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[350px] text-muted-foreground">
                  No cash flow data to display
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="income" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Income Trends</CardTitle>
                <CardDescription>Income over time</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                {incomeByPeriod.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={incomeByPeriod}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                      <Legend />
                      <Line type="monotone" dataKey="value" name="Income" stroke="#4CAF50" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    No income data to display
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Income Sources</CardTitle>
                <CardDescription>Distribution by source</CardDescription>
              </CardHeader>
              <CardContent>
                {incomeBySource.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={incomeBySource}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {incomeBySource.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    No income source data to display
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Income Sources</CardTitle>
                <CardDescription>Breakdown by amount</CardDescription>
              </CardHeader>
              <CardContent>
                {incomeBySource.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={incomeBySource}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                      <Bar dataKey="value" fill="#4CAF50" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    No income source data to display
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="expenses" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Expense Trends</CardTitle>
                <CardDescription>Expenses over time</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                {expenseByPeriod.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={expenseByPeriod}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                      <Legend />
                      <Line type="monotone" dataKey="value" name="Expenses" stroke="#FF5722" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    No expense data to display
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Expense Categories</CardTitle>
                <CardDescription>Distribution by category</CardDescription>
              </CardHeader>
              <CardContent>
                {expensesByCategory.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={expensesByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {expensesByCategory.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    No expense category data to display
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Expense Categories</CardTitle>
                <CardDescription>Breakdown by amount</CardDescription>
              </CardHeader>
              <CardContent>
                {expensesByCategory.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={expensesByCategory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                      <Bar dataKey="value" fill="#FF5722" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    No expense category data to display
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="breakdown" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Assets Distribution</CardTitle>
                <CardDescription>Savings and Investments</CardDescription>
              </CardHeader>
              <CardContent>
                {summary.totalSavings !== undefined && summary.totalInvestments !== undefined ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Savings', value: summary.totalSavings },
                          { name: 'Investments', value: summary.totalInvestments }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        <Cell fill="#4CAF50" />
                        <Cell fill="#2196F3" />
                      </Pie>
                      <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    No asset data to display
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Financial Health</CardTitle>
                <CardDescription>Assets vs Liabilities</CardDescription>
              </CardHeader>
              <CardContent>
                {summary.totalSavings !== undefined && summary.totalInvestments !== undefined && summary.totalDebts !== undefined ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={[
                        {
                          name: 'Financial Health',
                          assets: summary.totalSavings + summary.totalInvestments,
                          debts: summary.totalDebts,
                          netWorth: (summary.totalSavings + summary.totalInvestments) - summary.totalDebts
                        }
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                      <Legend />
                      <Bar dataKey="assets" name="Assets" fill="#4CAF50" />
                      <Bar dataKey="debts" name="Debts" fill="#FF5722" />
                      <Bar dataKey="netWorth" name="Net Worth" fill="#2196F3" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    No financial health data to display
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Financial Summary</CardTitle>
              <CardDescription>Complete overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted">
                        <th className="py-3 px-4 text-left">Category</th>
                        <th className="py-3 px-4 text-right">Amount</th>
                        <th className="py-3 px-4 text-right">Percentage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="py-3 px-4 font-medium">Total Income</td>
                        <td className="py-3 px-4 text-right">${summary.totalIncome?.toLocaleString() || 0}</td>
                        <td className="py-3 px-4 text-right">100%</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium">Total Expenses</td>
                        <td className="py-3 px-4 text-right">${summary.totalExpenses?.toLocaleString() || 0}</td>
                        <td className="py-3 px-4 text-right">
                          {summary.totalIncome ? `${(summary.totalExpenses / summary.totalIncome * 100).toFixed(1)}%` : '0%'}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium">Savings</td>
                        <td className="py-3 px-4 text-right">${summary.totalSavings?.toLocaleString() || 0}</td>
                        <td className="py-3 px-4 text-right">
                          {summary.totalIncome ? `${(summary.totalSavings / summary.totalIncome * 100).toFixed(1)}%` : '0%'}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium">Investments</td>
                        <td className="py-3 px-4 text-right">${summary.totalInvestments?.toLocaleString() || 0}</td>
                        <td className="py-3 px-4 text-right">
                          {summary.totalIncome ? `${(summary.totalInvestments / summary.totalIncome * 100).toFixed(1)}%` : '0%'}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium">Debts</td>
                        <td className="py-3 px-4 text-right">${summary.totalDebts?.toLocaleString() || 0}</td>
                        <td className="py-3 px-4 text-right">
                          {summary.totalIncome ? `${(summary.totalDebts / summary.totalIncome * 100).toFixed(1)}%` : '0%'}
                        </td>
                      </tr>
                      <tr className="bg-muted/50">
                        <td className="py-3 px-4 font-bold">Net Worth</td>
                        <td className="py-3 px-4 text-right font-bold">${summary.netWorth?.toLocaleString() || 0}</td>
                        <td className="py-3 px-4 text-right">-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;
