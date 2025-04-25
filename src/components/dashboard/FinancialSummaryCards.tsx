
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowUpIcon, ArrowDownIcon, PiggyBankIcon, TrendingUpIcon, CreditCardIcon } from 'lucide-react';

interface FinancialSummaryCardsProps {
  summary: {
    totalIncome: number;
    totalExpenses: number;
    totalSavings: number;
    totalInvestments: number;
    totalDebts: number;
    netWorth: number;
  };
  savingsProgress: number;
}

export const FinancialSummaryCards = ({ summary, savingsProgress }: FinancialSummaryCardsProps) => {
  return (
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
  );
};
