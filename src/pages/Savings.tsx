
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { getSavings, addSaving, updateSaving, Saving } from '@/lib/data';
import { PlusIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const SavingsPage = () => {
  const [savings, setSavings] = useState<Saving[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSavingId, setEditingSavingId] = useState<number | null>(null);
  
  // Form state
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  
  const { toast } = useToast();
  
  useEffect(() => {
    // Load savings data
    const loadedSavings = getSavings();
    setSavings(loadedSavings);
  }, []);
  
  const handleAddSaving = () => {
    if (!goalName || !targetAmount || !currentAmount) {
      toast({
        title: 'Validation Error',
        description: 'Please fill all required fields.',
        variant: 'destructive',
      });
      return;
    }
    
    const targetValue = parseFloat(targetAmount);
    const currentValue = parseFloat(currentAmount);
    
    if (isNaN(targetValue) || targetValue <= 0 || isNaN(currentValue) || currentValue < 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter valid numbers for the amounts.',
        variant: 'destructive',
      });
      return;
    }
    
    if (currentValue > targetValue) {
      toast({
        title: 'Invalid Amount',
        description: 'Current amount cannot be greater than target amount.',
        variant: 'destructive',
      });
      return;
    }
    
    const newSaving = addSaving({
      goalName,
      targetAmount: targetValue,
      currentAmount: currentValue,
    });
    
    setSavings([...savings, newSaving]);
    
    // Reset form
    setGoalName('');
    setTargetAmount('');
    setCurrentAmount('');
    
    setIsAddDialogOpen(false);
    
    toast({
      title: 'Saving Goal Added',
      description: 'Your saving goal has been successfully created.',
    });
  };
  
  const handleEditSaving = () => {
    if (!editingSavingId || !goalName || !targetAmount || !currentAmount) {
      toast({
        title: 'Validation Error',
        description: 'Please fill all required fields.',
        variant: 'destructive',
      });
      return;
    }
    
    const targetValue = parseFloat(targetAmount);
    const currentValue = parseFloat(currentAmount);
    
    if (isNaN(targetValue) || targetValue <= 0 || isNaN(currentValue) || currentValue < 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter valid numbers for the amounts.',
        variant: 'destructive',
      });
      return;
    }
    
    if (currentValue > targetValue) {
      toast({
        title: 'Invalid Amount',
        description: 'Current amount cannot be greater than target amount.',
        variant: 'destructive',
      });
      return;
    }
    
    const updatedSaving = updateSaving(editingSavingId, {
      goalName,
      targetAmount: targetValue,
      currentAmount: currentValue,
    });
    
    if (updatedSaving) {
      setSavings(savings.map(saving => 
        saving.id === editingSavingId ? updatedSaving : saving
      ));
      
      setIsEditDialogOpen(false);
      
      toast({
        title: 'Saving Goal Updated',
        description: 'Your saving goal has been successfully updated.',
      });
    }
  };
  
  const handleEditClick = (saving: Saving) => {
    setEditingSavingId(saving.id);
    setGoalName(saving.goalName);
    setTargetAmount(saving.targetAmount.toString());
    setCurrentAmount(saving.currentAmount.toString());
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteSaving = (id: number) => {
    // In a real app, this would call an API to delete the saving
    // For the demo, we'll just update the state
    setSavings(savings.filter(saving => saving.id !== id));
    
    toast({
      title: 'Saving Goal Deleted',
      description: 'Your saving goal has been successfully deleted.',
    });
  };
  
  const resetForm = () => {
    setGoalName('');
    setTargetAmount('');
    setCurrentAmount('');
    setEditingSavingId(null);
  };
  
  // Calculate total savings
  const totalSavings = savings.reduce((sum, saving) => sum + saving.currentAmount, 0);
  const totalTarget = savings.reduce((sum, saving) => sum + saving.targetAmount, 0);
  const overallProgress = totalTarget > 0 ? (totalSavings / totalTarget) * 100 : 0;
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Savings Goals</h1>
        <p className="text-muted-foreground">
          Set and track your savings goals.
        </p>
      </div>
      
      <div className="flex justify-between items-start">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Overall Savings Progress</CardTitle>
            <CardDescription>
              ${totalSavings.toLocaleString()} saved of ${totalTarget.toLocaleString()} total goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={overallProgress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              {overallProgress.toFixed(1)}% of total goals
            </p>
          </CardContent>
        </Card>
        
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Savings Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Savings Goal</DialogTitle>
              <DialogDescription>
                Create a new savings goal to track your progress.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="goalName" className="text-right">
                  Goal Name*
                </Label>
                <Input
                  id="goalName"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  className="col-span-3"
                  placeholder="e.g., Emergency Fund, Vacation"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="targetAmount" className="text-right">
                  Target Amount*
                </Label>
                <Input
                  id="targetAmount"
                  type="number"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="col-span-3"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="currentAmount" className="text-right">
                  Current Amount*
                </Label>
                <Input
                  id="currentAmount"
                  type="number"
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(e.target.value)}
                  className="col-span-3"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddSaving}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Savings Goal</DialogTitle>
              <DialogDescription>
                Update your savings goal details.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editGoalName" className="text-right">
                  Goal Name*
                </Label>
                <Input
                  id="editGoalName"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editTargetAmount" className="text-right">
                  Target Amount*
                </Label>
                <Input
                  id="editTargetAmount"
                  type="number"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="col-span-3"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editCurrentAmount" className="text-right">
                  Current Amount*
                </Label>
                <Input
                  id="editCurrentAmount"
                  type="number"
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(e.target.value)}
                  className="col-span-3"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleEditSaving}>Update</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savings.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 rounded-full bg-primary/10 mb-4">
              <PlusIcon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">No savings goals yet</h3>
            <p className="text-muted-foreground max-w-sm mt-2 mb-4">
              Start by creating your first savings goal to track your progress towards financial milestones.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              Create Your First Goal
            </Button>
          </div>
        ) : (
          savings.map((saving) => {
            const progress = (saving.currentAmount / saving.targetAmount) * 100;
            
            return (
              <Card key={saving.id}>
                <CardHeader>
                  <CardTitle>{saving.goalName}</CardTitle>
                  <CardDescription>
                    ${saving.currentAmount.toLocaleString()} of ${saving.targetAmount.toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Progress value={progress} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    {progress.toFixed(1)}% complete
                  </p>
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleEditClick(saving)}
                    >
                      <PencilIcon className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDeleteSaving(saving.id)}
                    >
                      <Trash2Icon className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SavingsPage;
