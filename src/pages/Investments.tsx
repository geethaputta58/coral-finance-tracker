
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getInvestments, addInvestment, Investment } from '@/lib/data';
import { PlusIcon, SearchIcon, TrendingUpIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const InvestmentsPage = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [filteredInvestments, setFilteredInvestments] = useState<Investment[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  
  const { toast } = useToast();
  
  // Form state
  const [name, setName] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [returns, setReturns] = useState<string>('0');
  
  // Investment types
  const investmentTypes = [
    'ETF',
    'Stock',
    'Mutual Fund',
    'Bond',
    'Real Estate',
    'Cryptocurrency',
    'Retirement',
    'Savings',
    'Other',
  ];
  
  useEffect(() => {
    // Load investment data
    const loadedInvestments = getInvestments();
    setInvestments(loadedInvestments);
    setFilteredInvestments(loadedInvestments);
    
    // Process chart data
    updateChartData(loadedInvestments);
  }, []);
  
  useEffect(() => {
    filterInvestments();
  }, [filterType, searchTerm, investments]);
  
  const filterInvestments = () => {
    let filtered = [...investments];
    
    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(investment => 
        investment.type.toLowerCase() === filterType.toLowerCase()
      );
    }
    
    // Apply search filter
    if (searchTerm.trim() !== '') {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(investment => 
        investment.name.toLowerCase().includes(search) || 
        investment.type.toLowerCase().includes(search)
      );
    }
    
    setFilteredInvestments(filtered);
    updateChartData(filtered);
  };
  
  const updateChartData = (data: Investment[]) => {
    const typeMap = new Map<string, { amount: number, returns: number }>();
    
    data.forEach(investment => {
      const existing = typeMap.get(investment.type) || { amount: 0, returns: 0 };
      typeMap.set(investment.type, {
        amount: existing.amount + investment.amount,
        returns: existing.returns + (investment.amount * investment.returns / 100)
      });
    });
    
    const chartData = Array.from(typeMap.entries()).map(([name, values]) => ({
      name,
      amount: values.amount,
      returns: values.returns
    }));
    
    setChartData(chartData);
  };
  
  const handleAddInvestment = () => {
    if (!name || !type || !amount || !date) {
      toast({
        title: 'Validation Error',
        description: 'Please fill all required fields.',
        variant: 'destructive',
      });
      return;
    }
    
    const amountValue = parseFloat(amount);
    const returnsValue = parseFloat(returns);
    
    if (isNaN(amountValue) || amountValue <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid positive number for the amount.',
        variant: 'destructive',
      });
      return;
    }
    
    if (isNaN(returnsValue)) {
      toast({
        title: 'Invalid Returns',
        description: 'Please enter a valid number for returns percentage.',
        variant: 'destructive',
      });
      return;
    }
    
    const newInvestment = addInvestment({
      name,
      type,
      amount: amountValue,
      date,
      returns: returnsValue,
    });
    
    setInvestments([...investments, newInvestment]);
    
    // Reset form
    setName('');
    setType('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setReturns('0');
    
    setIsDialogOpen(false);
    
    toast({
      title: 'Investment Added',
      description: 'Your investment has been successfully recorded.',
    });
  };
  
  // Calculate totals
  const totalInvested = filteredInvestments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalReturns = filteredInvestments.reduce((sum, inv) => sum + (inv.amount * inv.returns / 100), 0);
  const averageReturn = totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0;
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Investment Portfolio</h1>
        <p className="text-muted-foreground">
          Track and manage your investment portfolio.
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalInvested.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Estimated Returns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalReturns.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Return</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageReturn.toFixed(2)}%</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid md:grid-cols-5 gap-6">
        <div className="md:col-span-3 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search investments..."
                  className="pl-10 max-w-xs"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {investmentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
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
                  Add Investment
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Investment</DialogTitle>
                  <DialogDescription>
                    Enter your investment details. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name*
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="col-span-3"
                      placeholder="Amazon Stock, S&P 500 ETF, etc."
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                      Type*
                    </Label>
                    <Select value={type} onValueChange={setType} required>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                      <SelectContent>
                        {investmentTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
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
                    <Label htmlFor="returns" className="text-right">
                      Returns %
                    </Label>
                    <Input
                      id="returns"
                      type="number"
                      value={returns}
                      onChange={(e) => setReturns(e.target.value)}
                      className="col-span-3"
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleAddInvestment}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Investment List</CardTitle>
              <CardDescription>
                Showing {filteredInvestments.length} {filteredInvestments.length === 1 ? 'investment' : 'investments'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted">
                        <th className="py-3 px-4 text-left">Name</th>
                        <th className="py-3 px-4 text-left">Type</th>
                        <th className="py-3 px-4 text-left">Date</th>
                        <th className="py-3 px-4 text-right">Amount</th>
                        <th className="py-3 px-4 text-right">Returns (%)</th>
                        <th className="py-3 px-4 text-right">Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredInvestments.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-6 text-center text-muted-foreground">
                            No investment entries found.
                          </td>
                        </tr>
                      ) : (
                        filteredInvestments.map((investment) => (
                          <tr key={investment.id}>
                            <td className="py-3 px-4 font-medium">{investment.name}</td>
                            <td className="py-3 px-4">{investment.type}</td>
                            <td className="py-3 px-4">
                              {new Date(investment.date).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4 text-right">${investment.amount.toLocaleString()}</td>
                            <td className="py-3 px-4 text-right">{investment.returns}%</td>
                            <td className="py-3 px-4 text-right">
                              ${(investment.amount + (investment.amount * investment.returns / 100)).toLocaleString()}
                            </td>
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
              <CardTitle>Investment Distribution</CardTitle>
              <CardDescription>By investment type</CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, '']} />
                    <Legend />
                    <Bar dataKey="amount" name="Invested" fill="#8884d8" />
                    <Bar dataKey="returns" name="Returns" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  No investment data to display
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InvestmentsPage;
