
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

const IncomePage = () => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [filteredIncomes, setFilteredIncomes] = useState<Income[]>([]);
  const [filterMonth, setFilterMonth] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { toast } = useToast();
  
  // Form state
  const [source, setSource] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState<string>('');
  
  useEffect(() => {
    // Load income data
    const loadedIncomes = getIncomes();
    setIncomes(loadedIncomes);
    setFilteredIncomes(loadedIncomes);
  }, []);
  
  useEffect(() => {
    filterIncomes();
  }, [filterMonth, searchTerm, incomes]);
  
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
    
    // Apply search filter
    if (searchTerm.trim() !== '') {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(income => 
        income.source.toLowerCase().includes(search) || 
        income.note.toLowerCase().includes(search)
      );
    }
    
    setFilteredIncomes(filtered);
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
      
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sources or notes..."
              className="pl-10 max-w-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={filterMonth} onValueChange={setFilterMonth}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by month" />
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
                Enter the details of your income source. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="source" className="text-right">
                  Source*
                </Label>
                <Input
                  id="source"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="col-span-3"
                  placeholder="Salary, Freelance, etc."
                  required
                />
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
  );
};

export default IncomePage;
