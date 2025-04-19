
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getIncomes, addIncome, Income } from '@/lib/data';
import { PlusIcon, SearchIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const IncomePage = () => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [filteredIncomes, setFilteredIncomes] = useState<Income[]>([]);
  const [filterMonth, setFilterMonth] = useState<string>('all');
  const [filterSource, setFilterSource] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  
  const { toast } = useToast();
  
  // Form state
  const [source, setSource] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState<string>('');
  
  // Common income sources
  const incomeSources = [
    'Salary',
    'Freelance',
    'Business',
    'Investments',
    'Rental',
    'Side Hustle',
    'Pension',
    'Other',
  ];
  
  useEffect(() => {
    // Load income data
    const loadedIncomes = getIncomes();
    setIncomes(loadedIncomes);
    setFilteredIncomes(loadedIncomes);
    
    // Process chart data
    updateChartData(loadedIncomes);
  }, []);
  
  useEffect(() => {
    filterIncomes();
  }, [filterMonth, filterSource, searchTerm, incomes]);
  
  const filterIncomes = () => {
    let filtered = [...incomes];
    
    // Apply month filter
    if (filterMonth !== 'all') {
      const monthNumber = parseInt(filterMonth, 10);
      filtered = filtered.filter(income => {
        const incomeDate = new Date(income.date);
        return incomeDate.getMonth() === monthNumber - 1; // 0-indexed
      });
    }
    
    // Apply source filter
    if (filterSource !== 'all') {
      filtered = filtered.filter(income => 
        income.source.toLowerCase() === filterSource.toLowerCase()
      );
    }
    
    // Apply search filter
    if (searchTerm.trim() !== '') {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(income => 
        income.source.toLowerCase().includes(search) || 
        income.note.toLowerCase().includes(search)
      );
    }
    
    setFilteredIncomes(filtered);
    updateChartData(filtered);
  };
  
  const updateChartData = (data: Income[]) => {
    // Group by month
    const monthMap = new Map<string, number>();
    
    data.forEach(income => {
      const date = new Date(income.date);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      
      const existingAmount = monthMap.get(monthYear) || 0;
      monthMap.set(monthYear, existingAmount + income.amount);
    });
    
    // Sort by date
    const sortedEntries = Array.from(monthMap.entries()).sort((a, b) => {
      const [aMonth, aYear] = a[0].split('/').map(Number);
      const [bMonth, bYear] = b[0].split('/').map(Number);
      
      if (aYear !== bYear) return aYear - bYear;
      return aMonth - bMonth;
    });
    
    const chartData = sortedEntries.map(([month, amount]) => ({
      month,
      amount,
    }));
    
    setChartData(chartData);
  };
  
  const handleAddIncome = () => {
    if (!source || !amount || !date) {
      toast({
        title: 'Validation Error',
        description: 'Please fill all required fields.',
        variant: 'destructive',
      });
      return;
    }
    
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid positive number for the amount.',
        variant: 'destructive',
      });
      return;
    }
    
    const newIncome = addIncome({
      source,
      amount: amountValue,
      date,
      note,
    });
    
    setIncomes([...incomes, newIncome]);
    
    // Reset form
    setSource('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setNote('');
    
    setIsDialogOpen(false);
    
    toast({
      title: 'Income Added',
      description: 'Your income has been successfully recorded.',
    });
  };
  
  // Calculate total income
  const totalIncome = filteredIncomes.reduce((sum, income) => sum + income.amount, 0);
  
  const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Income Tracking</h1>
        <p className="text-muted-foreground">
          Track and manage all your sources of income.
        </p>
      </div>
      
      <div className="grid md:grid-cols-5 gap-6">
        <div className="md:col-span-3 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search sources or notes..."
                  className="pl-10 max-w-xs"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={filterMonth} onValueChange={setFilterMonth}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Months</SelectItem>
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={filterSource} onValueChange={setFilterSource}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    {incomeSources.map((source) => (
                      <SelectItem key={source} value={source}>
                        {source}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Income
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Income</DialogTitle>
                  <DialogDescription>
                    Enter the details of your income. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="source" className="text-right">
                      Source*
                    </Label>
                    <Select value={source} onValueChange={setSource} required>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a source" />
                      </SelectTrigger>
                      <SelectContent>
                        {incomeSources.map((src) => (
                          <SelectItem key={src} value={src}>
                            {src}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amount" className="text-right">
                      Amount*
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="col-span-3"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">
                      Date*
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="note" className="text-right">
                      Note
                    </Label>
                    <Textarea
                      id="note"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="col-span-3"
                      placeholder="Add note (optional)"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleAddIncome}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Income Summary</CardTitle>
              <CardDescription>
                Showing {filteredIncomes.length} {filteredIncomes.length === 1 ? 'entry' : 'entries'} with a total of ${totalIncome.toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted">
                        <th className="py-3 px-4 text-left">Date</th>
                        <th className="py-3 px-4 text-left">Source</th>
                        <th className="py-3 px-4 text-right">Amount</th>
                        <th className="py-3 px-4 text-left">Note</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredIncomes.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-6 text-center text-muted-foreground">
                            No income entries found.
                          </td>
                        </tr>
                      ) : (
                        filteredIncomes.map((income) => (
                          <tr key={income.id}>
                            <td className="py-3 px-4">
                              {new Date(income.date).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4 font-medium">{income.source}</td>
                            <td className="py-3 px-4 text-right">${income.amount.toLocaleString()}</td>
                            <td className="py-3 px-4 text-muted-foreground">{income.note}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Income Trend</CardTitle>
              <CardDescription>Monthly income over time</CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, '']} />
                    <Legend />
                    <Line type="monotone" dataKey="amount" name="Income" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  No income data to display
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IncomePage;
