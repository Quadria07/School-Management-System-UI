import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  FileText,
  Clock,
  Download,
  Plus,
  Activity,
  CreditCard,
  Wallet,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';
import { BursarAPI } from '../../../utils/api';
import { useAuth } from '../../../contexts/AuthContext';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  method: 'online' | 'bank' | 'cash';
  reference: string;
  timestamp: string;
  status: 'completed' | 'pending';
}

export const FinancialCommandCenter: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [financialStats, setFinancialStats] = useState<any>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [showPettyCashDialog, setShowPettyCashDialog] = useState(false);
  const [pettyCashAmount, setPettyCashAmount] = useState('');
  const [pettyCashPurpose, setPettyCashPurpose] = useState('');

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, transRes] = await Promise.all([
          BursarAPI.getFinancialStats(),
          BursarAPI.getTransactions(10)
        ]);

        if (statsRes.status === 'success') setFinancialStats(statsRes.data);
        if (transRes.status === 'success') {
          const transData = (transRes.data || []) as any[];
          setRecentTransactions(transData.map(t => ({
            id: t.id,
            type: t.type,
            amount: parseFloat(t.amount),
            description: t.description,
            category: t.category,
            method: t.payment_method || 'bank',
            reference: t.reference_number || 'N/A',
            timestamp: t.created_at,
            status: t.status === 'approved' ? 'completed' : 'pending'
          })));
        }
      } catch (error) {
        console.error('Error fetching bursar data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Financial Summary Data (Derived from API)
  const currentTerm = 'First Term 2024/2025';
  const totalExpectedFees = financialStats?.total_expected || 0;
  const totalCollected = financialStats?.total_collected || 0;
  const totalOutstanding = totalExpectedFees - totalCollected;
  const collectionRate = totalExpectedFees > 0 ? (totalCollected / totalExpectedFees) * 100 : 0;

  const monthlyBudget = financialStats?.monthly_budget || 0;
  const monthlySpend = financialStats?.monthly_spend || 0;
  const budgetRemaining = monthlyBudget - monthlySpend;
  const budgetUsage = monthlyBudget > 0 ? (monthlySpend / monthlyBudget) * 100 : 0;

  const handleGenerateQuickReport = () => {
    toast.success('Daily collection report generated successfully!');
  };

  const handleLogPettyCash = async () => {
    if (!pettyCashAmount || !pettyCashPurpose) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const response = await BursarAPI.logPettyCash({
        amount: pettyCashAmount,
        description: pettyCashPurpose
      });

      if (response.status === 'success') {
        toast.success(`Petty cash expense of ₦${parseFloat(pettyCashAmount).toLocaleString()} logged successfully`);
        setShowPettyCashDialog(false);
        setPettyCashAmount('');
        setPettyCashPurpose('');
        // Refresh transactions
        const transRes = await BursarAPI.getTransactions(10);
        if (transRes.status === 'success') {
          const transData = (transRes.data || []) as any[];
          setRecentTransactions(transData.map(t => ({
            id: t.id,
            type: t.type,
            amount: parseFloat(t.amount),
            description: t.description,
            category: t.category,
            method: t.payment_method || 'bank',
            reference: t.reference_number || 'N/A',
            timestamp: t.created_at,
            status: t.status === 'approved' ? 'completed' : 'pending'
          })));
        }
      } else {
        toast.error(response.message || 'Failed to log petty cash');
      }
    } catch (error) {
      toast.error('Error logging petty cash');
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl mb-2 text-blue-950">Financial Command Center</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Real-time financial overview for {currentTerm}
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            className="bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-none"
            onClick={handleGenerateQuickReport}
          >
            <Download className="w-4 h-4 mr-2" />
            Quick Report
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none"
            onClick={() => setShowPettyCashDialog(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Log Petty Cash
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Loading financial data...</span>
        </div>
      )}

      {/* Revenue Gauge */}
      {!loading && (
        <>
          <div>
            <h2 className="text-lg font-semibold mb-3 text-blue-950">Revenue Gauge</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardHeader className="pb-3">
                  <CardDescription className="text-blue-700">Total Expected Fees</CardDescription>
                  <CardTitle className="text-3xl text-blue-950">
                    ₦{(totalExpectedFees / 1000000).toFixed(1)}M
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-blue-700">{currentTerm}</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardHeader className="pb-3">
                  <CardDescription className="text-green-700">Total Collected</CardDescription>
                  <CardTitle className="text-3xl text-green-950">
                    ₦{(totalCollected / 1000000).toFixed(2)}M
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-1 text-green-700">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm font-medium">{collectionRate.toFixed(1)}% Collected</span>
                    </div>
                    <Progress value={collectionRate} className="h-2 [&>div]:bg-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                <CardHeader className="pb-3">
                  <CardDescription className="text-amber-700">Outstanding Balance</CardDescription>
                  <CardTitle className="text-3xl text-amber-950">
                    ₦{(totalOutstanding / 1000).toFixed(2)}K
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-amber-700">Requires follow-up</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Expense Tracker */}
          <div>
            <h2 className="text-lg font-semibold mb-3 text-blue-950">Monthly Expense Tracker</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardHeader className="pb-3">
                  <CardDescription className="text-purple-700">Monthly Budget</CardDescription>
                  <CardTitle className="text-3xl text-purple-950">
                    ₦{(monthlyBudget / 1000).toFixed(2)}K
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-purple-700">{new Date().toLocaleString('default', { month: 'long' })} {new Date().getFullYear()}</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                <CardHeader className="pb-3">
                  <CardDescription className="text-red-700">Current Spend</CardDescription>
                  <CardTitle className="text-3xl text-red-950">
                    ₦{(monthlySpend / 1000).toFixed(2)}K
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-red-700">{budgetUsage.toFixed(1)}% of budget used</p>
                    <Progress value={budgetUsage} className="h-2 [&>div]:bg-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
                <CardHeader className="pb-3">
                  <CardDescription className="text-teal-700">Budget Remaining</CardDescription>
                  <CardTitle className="text-3xl text-teal-950">
                    ₦{(budgetRemaining / 1000).toFixed(2)}K
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-teal-700">Available for allocation</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}


      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Transactions
              </CardTitle>
              <CardDescription>Live feed of the last 10 financial activities</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        className={
                          transaction.type === 'income'
                            ? 'bg-green-600 text-white'
                            : 'bg-red-600 text-white'
                        }
                      >
                        {transaction.type === 'income' ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {transaction.type === 'income' ? 'Income' : 'Expense'}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {transaction.method === 'online' && <CreditCard className="w-3 h-3 mr-1" />}
                        {transaction.method === 'bank' && <DollarSign className="w-3 h-3 mr-1" />}
                        {transaction.method === 'cash' && <Wallet className="w-3 h-3 mr-1" />}
                        {transaction.method.toUpperCase()}
                      </Badge>
                      {transaction.status === 'pending' && (
                        <Badge className="bg-amber-600 text-white text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                    </div>
                    <h4 className="font-semibold mb-1">{transaction.description}</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-600">Amount:</p>
                        <p
                          className={`font-semibold ${transaction.type === 'income' ? 'text-green-700' : 'text-red-700'
                            }`}
                        >
                          {transaction.type === 'income' ? '+' : '-'}₦
                          {transaction.amount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Reference:</p>
                        <p className="font-mono text-xs">{transaction.reference}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Category:</p>
                        <p className="font-medium">{transaction.category}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Time:</p>
                        <p className="text-xs text-gray-500">{transaction.timestamp}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Health Alert */}
      <Alert className="border-blue-200 bg-blue-50">
        <AlertCircle className="h-5 w-5 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Financial System Status:</strong> All payment gateways operational. Last bank
          reconciliation completed 2 hours ago. Next scheduled reconciliation in 22 hours.
        </AlertDescription>
      </Alert>

      {/* Petty Cash Dialog */}
      <Dialog open={showPettyCashDialog} onOpenChange={setShowPettyCashDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Log Petty Cash Expense</DialogTitle>
            <DialogDescription>
              Record minor immediate expenses for audit trail purposes
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Amount (₦):</Label>
              <Input
                type="number"
                placeholder="e.g., 5000"
                value={pettyCashAmount}
                onChange={(e) => setPettyCashAmount(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Purpose/Description:</Label>
              <Textarea
                placeholder="e.g., Office refreshments for staff meeting"
                rows={4}
                value={pettyCashPurpose}
                onChange={(e) => setPettyCashPurpose(e.target.value)}
              />
            </div>
            <Alert className="border-amber-200 bg-amber-50">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800 text-xs">
                <strong>Note:</strong> All petty cash transactions are logged with timestamp and
                require physical receipt upload within 24 hours for audit compliance.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPettyCashDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleLogPettyCash}>
              <Plus className="w-4 h-4 mr-2" />
              Log Expense
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
