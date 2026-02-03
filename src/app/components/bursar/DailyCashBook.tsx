import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Download, Filter, Search, Plus, ArrowUpCircle, ArrowDownCircle, Wallet } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import { SchoolReportHeader } from './SchoolReportHeader';

interface CashEntry {
  id: string;
  time: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  reference: string;
  balance: number;
}

export const DailyCashBook: React.FC = () => {
    const [entries, setEntries] = useState<CashEntry[]>([
        {
          id: '1',
          time: '08:30 AM',
          type: 'income',
          category: 'Opening Balance',
          description: 'Opening Balance (Brought Forward)',
          amount: 0,
          reference: 'B/F',
          balance: 2450000,
        },
        {
          id: '2',
          time: '09:15 AM',
          type: 'income',
          category: 'Tuition',
          description: 'Tuition Payment - Oluwatunde Adebayo (JSS 3A)',
          amount: 218000,
          reference: 'PAY-2025-001523',
          balance: 2668000,
        },
        {
          id: '3',
          time: '10:30 AM',
          type: 'expense',
          category: 'Supplies',
          description: 'Science Lab Equipment Purchase',
          amount: 85000,
          reference: 'PV-2025-00234',
          balance: 2583000,
        },
        {
          id: '4',
          time: '11:45 AM',
          type: 'income',
          category: 'Tuition',
          description: 'School Fees - Chinedu Okoro (SSS 2B)',
          amount: 145000,
          reference: 'TRF-2025-000892',
          balance: 2728000,
        },
        {
          id: '5',
          time: '01:20 PM',
          type: 'expense',
          category: 'Utilities',
          description: 'Diesel for Generator',
          amount: 45000,
          reference: 'PV-2025-00233',
          balance: 2683000,
        },
    ]);

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newEntry, setNewEntry] = useState<{
        type: 'income' | 'expense';
        amount: string;
        description: string;
        category: string;
        reference: string;
    }>({
        type: 'income',
        amount: '',
        description: '',
        category: 'Tuition',
        reference: '',
    });

    const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Computed Summaries
    const openingBalance = 2450000; // Fixed for today example
    const totalInflow = entries
        .filter(e => e.type === 'income' && e.id !== '1') // Exclude opening balance entry
        .reduce((sum, e) => sum + e.amount, 0);
    const totalOutflow = entries
        .filter(e => e.type === 'expense')
        .reduce((sum, e) => sum + e.amount, 0);
    const closingBalance = openingBalance + totalInflow - totalOutflow;

    const handleAddEntry = () => {
        if (!newEntry.amount || !newEntry.description) {
            toast.error("Please fill in all required fields");
            return;
        }

        const amount = parseFloat(newEntry.amount);
        const currentBalance = entries[entries.length - 1].balance;
        const newBalance = newEntry.type === 'income' 
            ? currentBalance + amount 
            : currentBalance - amount;

        const entry: CashEntry = {
            id: Math.random().toString(36).substr(2, 9),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: newEntry.type,
            category: newEntry.category,
            description: newEntry.description,
            amount: amount,
            reference: newEntry.reference || `REF-${Math.floor(Math.random() * 10000)}`,
            balance: newBalance
        };

        setEntries([...entries, entry]);
        setIsAddOpen(false);
        setNewEntry({
            type: 'income',
            amount: '',
            description: '',
            category: 'Tuition',
            reference: '',
        });
        toast.success("Transaction recorded successfully");
    };

    const filteredEntries = entries.filter(entry => {
        const matchesFilter = filter === 'all' || entry.type === filter;
        const matchesSearch = entry.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              entry.reference.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl mb-2 text-blue-950">
            Daily Cash Book
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
             Manage and track daily cash flow
          </p>
        </div>
        <div className="flex gap-2">
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" /> New Entry
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <SchoolReportHeader title="Record New Transaction" />
                        <DialogTitle className="sr-only">Record New Transaction</DialogTitle>
                        <DialogDescription>Add a new income or expense entry to today's ledger.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="type" className="text-right">Type</Label>
                            <Select 
                                value={newEntry.type} 
                                onValueChange={(v: 'income' | 'expense') => setNewEntry({...newEntry, type: v})}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="income">Income (Money In)</SelectItem>
                                    <SelectItem value="expense">Expense (Money Out)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category" className="text-right">Category</Label>
                            <Select 
                                value={newEntry.category} 
                                onValueChange={(v) => setNewEntry({...newEntry, category: v})}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {newEntry.type === 'income' ? (
                                        <>
                                            <SelectItem value="Tuition">Tuition Fees</SelectItem>
                                            <SelectItem value="Uniforms">Uniform Sales</SelectItem>
                                            <SelectItem value="Books">Book Sales</SelectItem>
                                            <SelectItem value="Donation">Donation</SelectItem>
                                            <SelectItem value="Other">Other Income</SelectItem>
                                        </>
                                    ) : (
                                        <>
                                            <SelectItem value="Supplies">Office Supplies</SelectItem>
                                            <SelectItem value="Utilities">Utilities (Power/Water)</SelectItem>
                                            <SelectItem value="Maintenance">Maintenance</SelectItem>
                                            <SelectItem value="Transport">Transport/Fuel</SelectItem>
                                            <SelectItem value="Petty Cash">Petty Cash Replenishment</SelectItem>
                                        </>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="amount" className="text-right">Amount (₦)</Label>
                            <Input
                                id="amount"
                                type="number"
                                className="col-span-3"
                                value={newEntry.amount}
                                onChange={(e) => setNewEntry({...newEntry, amount: e.target.value})}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">Description</Label>
                            <Input
                                id="description"
                                className="col-span-3"
                                value={newEntry.description}
                                onChange={(e) => setNewEntry({...newEntry, description: e.target.value})}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="reference" className="text-right">Ref No.</Label>
                            <Input
                                id="reference"
                                className="col-span-3"
                                placeholder="Optional"
                                value={newEntry.reference}
                                onChange={(e) => setNewEntry({...newEntry, reference: e.target.value})}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddEntry}>Save Transaction</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" /> Report
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                        <SchoolReportHeader title="Daily Cash Book Report" subtitle={`Date: ${new Date().toLocaleDateString()}`} />
                        <DialogTitle className="sr-only">Daily Cash Book Report</DialogTitle>
                        <DialogDescription className="sr-only">Report details for daily transactions</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="p-3 bg-blue-50 rounded border border-blue-100">
                                <span className="text-xs text-blue-600 uppercase">Opening</span>
                                <p className="font-bold text-lg">₦{openingBalance.toLocaleString()}</p>
                            </div>
                            <div className="p-3 bg-green-50 rounded border border-green-100">
                                <span className="text-xs text-green-600 uppercase">Inflow</span>
                                <p className="font-bold text-lg text-green-700">+₦{totalInflow.toLocaleString()}</p>
                            </div>
                             <div className="p-3 bg-red-50 rounded border border-red-100">
                                <span className="text-xs text-red-600 uppercase">Outflow</span>
                                <p className="font-bold text-lg text-red-700">-₦{totalOutflow.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="border rounded overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="p-2 text-left">Time</th>
                                        <th className="p-2 text-left">Description</th>
                                        <th className="p-2 text-right">Debit</th>
                                        <th className="p-2 text-right">Credit</th>
                                        <th className="p-2 text-right">Bal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {entries.map((e, i) => (
                                        <tr key={i} className="border-t">
                                            <td className="p-2 text-gray-500">{e.time}</td>
                                            <td className="p-2">{e.description}</td>
                                            <td className="p-2 text-right text-red-600">{e.type === 'expense' ? e.amount.toLocaleString() : '-'}</td>
                                            <td className="p-2 text-right text-green-600">{e.type === 'income' && e.id !== '1' ? e.amount.toLocaleString() : '-'}</td>
                                            <td className="p-2 text-right font-medium">₦{e.balance.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <DialogFooter>
                         <Button onClick={() => toast.success("Report downloaded")}>
                            <Download className="w-4 h-4 mr-2" /> Download PDF
                         </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500 mb-1">Opening Balance</p>
                    <p className="text-2xl font-bold text-slate-900">₦{openingBalance.toLocaleString()}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-slate-600" />
                </div>
            </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200 shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
                <div>
                    <p className="text-sm text-green-700 mb-1">Total Inflow</p>
                    <p className="text-2xl font-bold text-green-900">₦{totalInflow.toLocaleString()}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <ArrowDownCircle className="w-5 h-5 text-green-600" />
                </div>
            </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-200 shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
                <div>
                    <p className="text-sm text-red-700 mb-1">Total Outflow</p>
                    <p className="text-2xl font-bold text-red-900">₦{totalOutflow.toLocaleString()}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                    <ArrowUpCircle className="w-5 h-5 text-red-600" />
                </div>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle>Transactions - {new Date().toLocaleDateString()}</CardTitle>
              <div className="flex items-center gap-2">
                  <div className="flex bg-slate-100 rounded-lg p-1">
                      <button 
                        onClick={() => setFilter('all')}
                        className={`px-3 py-1 text-sm rounded-md transition-all ${filter === 'all' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                          All
                      </button>
                      <button 
                        onClick={() => setFilter('income')}
                        className={`px-3 py-1 text-sm rounded-md transition-all ${filter === 'income' ? 'bg-white shadow text-green-700' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                          In
                      </button>
                      <button 
                        onClick={() => setFilter('expense')}
                        className={`px-3 py-1 text-sm rounded-md transition-all ${filter === 'expense' ? 'bg-white shadow text-red-700' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                          Out
                      </button>
                  </div>
                  <div className="relative w-48 md:w-64">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search..." 
                        className="pl-8 h-9" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                  </div>
              </div>
           </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50">
                  <th className="text-left p-3 font-medium text-gray-500 text-sm">Time</th>
                  <th className="text-left p-3 font-medium text-gray-500 text-sm">Description</th>
                  <th className="text-left p-3 font-medium text-gray-500 text-sm">Category</th>
                  <th className="text-right p-3 font-medium text-gray-500 text-sm">Amount</th>
                  <th className="text-right p-3 font-medium text-gray-500 text-sm">Balance</th>
                  <th className="text-left p-3 font-medium text-gray-500 text-sm pl-6">Ref</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry, idx) => (
                  <tr
                    key={entry.id}
                    className="border-b border-gray-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="p-3 text-sm text-gray-500 font-mono">{entry.time}</td>
                    <td className="p-3 font-medium text-slate-700">{entry.description}</td>
                    <td className="p-3">
                        <Badge variant="secondary" className="font-normal text-xs bg-slate-100 text-slate-600 border-slate-200">
                            {entry.category}
                        </Badge>
                    </td>
                    <td className="text-right p-3 font-semibold">
                      {entry.type === 'income' ? (
                          <span className={entry.id === '1' ? 'text-slate-500' : 'text-green-600'}>
                              {entry.id === '1' ? '' : '+'}₦{entry.amount.toLocaleString()}
                          </span>
                      ) : (
                          <span className="text-red-600">
                              -₦{entry.amount.toLocaleString()}
                          </span>
                      )}
                    </td>
                    <td className="text-right p-3 font-bold text-slate-700">
                      ₦{entry.balance.toLocaleString()}
                    </td>
                    <td className="p-3 text-xs font-mono text-gray-400 pl-6">{entry.reference}</td>
                  </tr>
                ))}
                {filteredEntries.length === 0 && (
                    <tr>
                        <td colSpan={6} className="text-center py-8 text-gray-500">
                            No transactions found matching your criteria.
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};