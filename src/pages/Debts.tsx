import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getDebts, addDebt, updateDebt, deleteDebt, Debt } from '@/lib/services/debtService';
import { PlusIcon, SearchIcon, AlertCircleIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { format, isBefore, parseISO } from 'date-fns';

const DebtsPage = () => {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [filteredDebts, setFilteredDebts] = useState<Debt[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);

  const { toast } = useToast();

  const [type, setType] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [interest, setInterest] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const debtTypes = [
    'Credit Card',
    'Student Loan',
    'Mortgage',
    'Auto Loan',
    'Personal Loan',
    'Medical Debt',
    'Tax Debt',
    'Other',
  ];

  useEffect(() => {
    const loadedDebts = getDebts();
    setDebts(loadedDebts);
    setFilteredDebts(loadedDebts);
    updateChartData(loadedDebts);
  }, []);

  useEffect(() => {
    filterDebts();
  }, [filterType, filterStatus, searchTerm, debts]);

  const filterDebts = () => {
    let filtered = [...debts];

    if (filterType !== 'all') {
      filtered = filtered.filter(debt => 
        debt.type.toLowerCase() === filterType.toLowerCase()
      );
    }

    if (filterStatus !== 'all') {
      const today = new Date();
      if (filterStatus === 'overdue') {
        filtered = filtered.filter(debt => isBefore(parseISO(debt.dueDate), today));
      } else if (filterStatus === 'upcoming') {
        filtered = filtered.filter(debt => !isBefore(parseISO(debt.dueDate), today));
      }
    }

    if (searchTerm.trim() !== '') {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(debt => 
        debt.type.toLowerCase().includes(search)
      );
    }

    setFilteredDebts(filtered);
    updateChartData(filtered);
  };

  const updateChartData = (data: Debt[]) => {
    const typeMap = new Map<string, number>();

    data.forEach(debt => {
      const existing = typeMap.get(debt.type) || 0;
      typeMap.set(debt.type, existing + debt.amount);
    });

    const chartData = Array.from(typeMap.entries()).map(([name, value]) => ({
      name,
      value,
    }));

    setChartData(chartData);
  };

  const handleAddDebt = () => {
    if (!type || !amount || !interest || !dueDate) {
      toast({
        title: 'Validation Error',
        description: 'Please fill all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const amountValue = parseFloat(amount);
    const interestValue = parseFloat(interest);

    if (isNaN(amountValue) || amountValue <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid positive number for the amount.',
        variant: 'destructive',
      });
      return;
    }

    if (isNaN(interestValue) || interestValue < 0) {
      toast({
        title: 'Invalid Interest',
        description: 'Please enter a valid non-negative number for interest rate.',
        variant: 'destructive',
      });
      return;
    }

    const newDebt = addDebt({
      type,
      amount: amountValue,
      interest: interestValue,
      dueDate,
    });

    setDebts([...debts, newDebt]);

    setType('');
    setAmount('');
    setInterest('');
    setDueDate(new Date().toISOString().split('T')[0]);
    setIsDialogOpen(false);

    toast({
      title: 'Debt Added',
      description: 'Your debt has been successfully recorded.',
    });
  };

  const handleEditDebt = () => {
    if (!editingDebt || !type || !amount || !interest || !dueDate) {
      toast({
        title: 'Validation Error',
        description: 'Please fill all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const amountValue = parseFloat(amount);
    const interestValue = parseFloat(interest);

    if (isNaN(amountValue) || amountValue <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid positive number for the amount.',
        variant: 'destructive',
      });
      return;
    }

    if (isNaN(interestValue) || interestValue < 0) {
      toast({
        title: 'Invalid Interest',
        description: 'Please enter a valid non-negative number for interest rate.',
        variant: 'destructive',
      });
      return;
    }

    const updatedDebt = updateDebt(editingDebt.id, {
      type,
      amount: amountValue,
      interest: interestValue,
      dueDate,
    });

    if (updatedDebt) {
      setDebts(debts.map(d => 
        d.id === editingDebt.id ? updatedDebt : d
      ));
      
      setType('');
      setAmount('');
      setInterest('');
      setDueDate(new Date().toISOString().split('T')[0]);
      setEditingDebt(null);
      setIsDialogOpen(false);

      toast({
        title: 'Debt Updated',
        description: 'Your debt has been successfully updated.',
      });
    }
  };

  const handleDeleteDebt = (id: number) => {
    if (deleteDebt(id)) {
      setDebts(debts.filter(d => d.id !== id));
      toast({
        title: 'Debt Deleted',
        description: 'Your debt has been successfully deleted.',
      });
    }
  };

  const openEditDialog = (debt: Debt) => {
    setEditingDebt(debt);
    setType(debt.type);
    setAmount(debt.amount.toString());
    setInterest(debt.interest.toString());
    setDueDate(debt.dueDate);
    setIsDialogOpen(true);
  };

  const totalDebt = filteredDebts.reduce((sum, debt) => sum + debt.amount, 0);
  const totalInterest = filteredDebts.reduce((sum, debt) => sum + (debt.amount * debt.interest / 100), 0);
  const averageInterestRate = totalDebt > 0 ? filteredDebts.reduce((sum, debt) => sum + (debt.amount / totalDebt * debt.interest), 0) : 0;

  const today = new Date();
  const overdueDebts = filteredDebts.filter(debt => isBefore(parseISO(debt.dueDate), today));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28AD1', '#FF6B6B', '#4CAF50', '#9C27B0'];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Debt Management</h1>
        <p className="text-muted-foreground">
          Track and manage your outstanding debts.
        </p>
      </div>
      
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Debt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalDebt.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Annual Interest Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalInterest.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Interest Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageInterestRate.toFixed(2)}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overdueDebts.length}</div>
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
                  placeholder="Search debts..."
                  className="pl-10 max-w-xs"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {debtTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  {editingDebt ? 'Edit Debt' : 'Add New Debt'}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingDebt ? 'Edit Debt' : 'Add New Debt'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingDebt 
                      ? "Update your debt details. Click save when you're done."
                      : "Enter your debt details. Click save when you're done."}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                      Type*
                    </Label>
                    <Select value={type} onValueChange={setType} required>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a debt type" />
                      </SelectTrigger>
                      <SelectContent>
                        {debtTypes.map((type) => (
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
                    <Label htmlFor="interest" className="text-right">
                      Interest %*
                    </Label>
                    <Input
                      id="interest"
                      type="number"
                      value={interest}
                      onChange={(e) => setInterest(e.target.value)}
                      className="col-span-3"
                      placeholder="0.00"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="dueDate" className="text-right">
                      Due Date*
                    </Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="col-span-3"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    type="submit" 
                    onClick={editingDebt ? handleEditDebt : handleAddDebt}
                  >
                    {editingDebt ? 'Update' : 'Save'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Debt List</CardTitle>
              <CardDescription>
                Showing {filteredDebts.length} {filteredDebts.length === 1 ? 'debt' : 'debts'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted">
                        <th className="py-3 px-4 text-left">Type</th>
                        <th className="py-3 px-4 text-right">Amount</th>
                        <th className="py-3 px-4 text-right">Interest</th>
                        <th className="py-3 px-4 text-left">Due Date</th>
                        <th className="py-3 px-4 text-right">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredDebts.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-6 text-center text-muted-foreground">
                            No debt entries found.
                          </td>
                        </tr>
                      ) : (
                        filteredDebts.map((debt) => {
                          const isOverdue = isBefore(parseISO(debt.dueDate), new Date());
                          return (
                            <tr key={debt.id}>
                              <td className="py-3 px-4 font-medium">{debt.type}</td>
                              <td className="py-3 px-4 text-right">${debt.amount.toLocaleString()}</td>
                              <td className="py-3 px-4 text-right">{debt.interest}%</td>
                              <td className="py-3 px-4">
                                {new Date(debt.dueDate).toLocaleDateString()}
                              </td>
                              <td className={`py-3 px-4 text-right ${isOverdue ? 'text-red-500 font-medium' : ''}`}>
                                {isOverdue ? (
                                  <div className="flex items-center justify-end space-x-1">
                                    <AlertCircleIcon className="h-4 w-4" />
                                    <span>Overdue</span>
                                  </div>
                                ) : 'Upcoming'}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => openEditDialog(debt)}
                                  >
                                    <PencilIcon className="h-4 w-4" />
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        className="text-destructive hover:text-destructive"
                                      >
                                        <TrashIcon className="h-4 w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Debt</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete this debt? This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDeleteDebt(debt.id)}
                                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </td>
                            </tr>
                          );
                        })
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
              <CardTitle>Debt Distribution</CardTitle>
              <CardDescription>By debt type</CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {chartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value}`, '']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  No debt data to display
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DebtsPage;
