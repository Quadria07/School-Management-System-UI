import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { 
  ArrowLeftRight, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Calculator,
  Plus,
  Trash2,
  Save,
  Download,
  History,
  Eye,
  Printer,
  FileDown
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '../ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { toast } from 'sonner';

// Types
interface Transaction {
  id: string;
  date: string;
  description: string;
  ref: string;
  debit: number; // Money Out
  credit: number; // Money In
  matched: boolean;
}

interface HistoricalReport {
  id: string;
  period: string;
  account: string;
  dateCompleted: string;
  closingBalance: number;
}

import { SchoolReportHeader } from './SchoolReportHeader';

export const BankReconciliation: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('jan-2026');
  const [selectedAccount, setSelectedAccount] = useState('zenith-1');
  const [showHistory, setShowHistory] = useState(false);
  const [viewingReport, setViewingReport] = useState<HistoricalReport | null>(null);
  
  // Mock System Data (Cash Book)
  // In a real app, this comes from the database based on the selected month
  const [ledgerItems, setLedgerItems] = useState<Transaction[]>([
    { id: '1', date: '2026-01-02', description: 'School Fees - Grade 4', ref: 'DEP-001', debit: 0, credit: 1500000, matched: true },
    { id: '2', date: '2026-01-05', description: 'Office Supplies', ref: 'CHQ-101', debit: 45000, credit: 0, matched: true },
    { id: '3', date: '2026-01-10', description: 'Diesel Purchase', ref: 'CHQ-102', debit: 120000, credit: 0, matched: true },
    { id: '4', date: '2026-01-15', description: 'School Fees - Grade 2', ref: 'DEP-002', debit: 0, credit: 850000, matched: true },
    { id: '5', date: '2026-01-20', description: 'Plumbing Repairs', ref: 'CHQ-103', debit: 15000, credit: 0, matched: false }, // Unpresented Cheque
    { id: '6', date: '2026-01-25', description: 'Textbook Sales', ref: 'DEP-003', debit: 0, credit: 45000, matched: false }, // Uncredited Lodgement
  ]);

  // User Inputs
  const [statementBalance, setStatementBalance] = useState<string>('2215000'); // Input as string for easy editing
  const [bankCharges, setBankCharges] = useState<string>('5000'); // Input as string

  // Computed Values
  const [reconciled, setReconciled] = useState(false);
  const [diff, setDiff] = useState(0);

  // 1. Calculate System Balance (Opening + Credits - Debits)
  // Assuming opening balance for simplicity or calculating running total
  const openingBalance = 0; 
  const totalDebits = ledgerItems.reduce((sum, item) => sum + item.debit, 0);
  const totalCredits = ledgerItems.reduce((sum, item) => sum + item.credit, 0);
  const systemClosingBalance = openingBalance + totalCredits - totalDebits;

  // 2. Adjust System Balance for Missing Items (Bank Charges) to get "Adjusted Cash Book Balance"
  // In reality, you'd add a "Bank Charges" transaction to the ledger, but here we just calculate it.
  const adjustedCashBookBalance = systemClosingBalance - (parseFloat(bankCharges) || 0);

  // 3. Calculate "Adjusted Bank Balance"
  // Bank Stmt Bal + Uncredited Lodgements - Unpresented Cheques
  const uncreditedLodgements = ledgerItems.filter(i => !i.matched && i.credit > 0).reduce((sum, i) => sum + i.credit, 0);
  const unpresentedCheques = ledgerItems.filter(i => !i.matched && i.debit > 0).reduce((sum, i) => sum + i.debit, 0);
  
  const targetReconciliationValues = () => {
    const stmtBal = parseFloat(statementBalance) || 0;
    return stmtBal + uncreditedLodgements - unpresentedCheques;
  };

  useEffect(() => {
    const adjustedBank = targetReconciliationValues();
    const difference = adjustedCashBookBalance - adjustedBank;
    setDiff(difference);
    setReconciled(Math.abs(difference) < 0.01);
  }, [ledgerItems, statementBalance, bankCharges]);

  const toggleMatch = (id: string) => {
    setLedgerItems(ledgerItems.map(item => 
      item.id === id ? { ...item, matched: !item.matched } : item
    ));
  };

  const handleReconcile = () => {
    if (reconciled) {
        toast.success("Account Reconciled Successfully!", {
            description: "The reconciliation statement has been saved."
        });
    } else {
        toast.error("Accounts do not balance", {
            description: "Please check for missing transactions or incorrect amounts."
        });
    }
  };

  const handleDownload = (format: 'pdf' | 'csv') => {
      toast.success(`Downloading Report as ${format.toUpperCase()}`, {
          description: "Your file will start downloading shortly."
      });
      // In a real app, this would trigger the actual file download
  };

  const mockHistory: HistoricalReport[] = [
      { id: '1', period: 'December 2025', account: 'Zenith Bank', dateCompleted: 'Jan 5, 2026', closingBalance: 2450000 },
      { id: '2', period: 'November 2025', account: 'Zenith Bank', dateCompleted: 'Dec 3, 2025', closingBalance: 1980000 },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl mb-2 text-blue-950">
            Bank Reconciliation
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Compare system records against your monthly bank statement
          </p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowHistory(true)}>
                <FileText className="w-4 h-4 mr-2" /> View Previous Reports
            </Button>
            <Button className={reconciled ? "bg-green-600 hover:bg-green-700" : "bg-gray-400"} onClick={handleReconcile} disabled={!reconciled}>
                <CheckCircle2 className="w-4 h-4 mr-2" /> Complete Reconciliation
            </Button>
        </div>
      </div>

      {/* Control Panel */}
      <Card className="bg-slate-50 border-slate-200">
          <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                      <Label>Bank Account</Label>
                      <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                          <SelectTrigger className="bg-white">
                              <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="zenith-1">Zenith Bank - Main (***2938)</SelectItem>
                              <SelectItem value="gtb-1">GTBank - Tuition (***9921)</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>
                  <div className="space-y-2">
                      <Label>Statement Period</Label>
                      <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                          <SelectTrigger className="bg-white">
                              <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="dec-2025">December 2025</SelectItem>
                              <SelectItem value="jan-2026">January 2026</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>
                  <div className="space-y-2">
                      <Label className="text-blue-800">Statement Closing Balance (₦)</Label>
                      <Input 
                        type="number" 
                        className="bg-white border-blue-200 font-bold text-blue-900" 
                        value={statementBalance}
                        onChange={(e) => setStatementBalance(e.target.value)}
                      />
                  </div>
                  <div className="space-y-2">
                      <Label>Bank Charges / Interest (₦)</Label>
                      <Input 
                        type="number" 
                        className="bg-white" 
                        value={bankCharges}
                        onChange={(e) => setBankCharges(e.target.value)}
                        placeholder="Enter amount not in ledger"
                      />
                  </div>
              </div>
          </CardContent>
      </Card>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left: Transaction Checklist */}
          <Card className="lg:col-span-2 h-fit">
              <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex justify-between items-center">
                      <span>Ledger Transactions</span>
                      <Badge variant="outline" className="font-normal">
                          {ledgerItems.filter(i => i.matched).length} / {ledgerItems.length} Matched
                      </Badge>
                  </CardTitle>
                  <CardDescription>
                      Tick items that appear on your physical bank statement. 
                      Unticked items will be treated as Unpresented/Uncredited.
                  </CardDescription>
              </CardHeader>
              <CardContent>
                  <Table>
                      <TableHeader>
                          <TableRow>
                              <TableHead className="w-[50px]"></TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead className="text-right">Debit (Out)</TableHead>
                              <TableHead className="text-right">Credit (In)</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {ledgerItems.map((item) => (
                              <TableRow key={item.id} className={item.matched ? "bg-slate-50 opacity-60" : ""}>
                                  <TableCell>
                                      <input 
                                        type="checkbox" 
                                        className="w-4 h-4 accent-blue-600 cursor-pointer"
                                        checked={item.matched}
                                        onChange={() => toggleMatch(item.id)}
                                      />
                                  </TableCell>
                                  <TableCell className="font-medium text-xs">{item.date}</TableCell>
                                  <TableCell>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">{item.description}</span>
                                        <span className="text-xs text-gray-500">{item.ref}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-right text-red-600">
                                      {item.debit > 0 ? `(${item.debit.toLocaleString()})` : '-'}
                                  </TableCell>
                                  <TableCell className="text-right text-green-600">
                                      {item.credit > 0 ? item.credit.toLocaleString() : '-'}
                                  </TableCell>
                              </TableRow>
                          ))}
                      </TableBody>
                  </Table>
              </CardContent>
          </Card>

          {/* Right: Reconciliation Summary */}
          <div className="space-y-6">
              <Card className={`border-t-4 ${reconciled ? 'border-t-green-500' : 'border-t-red-500'}`}>
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                          <Calculator className="w-5 h-5" /> Summary
                      </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      
                      <div className="space-y-2 pb-4 border-b">
                          <div className="flex justify-between text-sm">
                              <span className="text-gray-600">System Balance (Calculated)</span>
                              <span className="font-medium">{systemClosingBalance.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Less: Bank Charges</span>
                              <span className="font-medium text-red-600">({parseFloat(bankCharges || '0').toLocaleString()})</span>
                          </div>
                          <div className="flex justify-between font-bold pt-1">
                              <span>Adjusted Cash Book</span>
                              <span>₦{adjustedCashBookBalance.toLocaleString()}</span>
                          </div>
                      </div>

                      <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Bank Statement Balance</span>
                              <span className="font-medium">{parseFloat(statementBalance || '0').toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Add: Uncredited Lodgements</span>
                              <span className="font-medium text-green-600">+{uncreditedLodgements.toLocaleString()}</span>
                          </div>
                           <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Less: Unpresented Cheques</span>
                              <span className="font-medium text-red-600">({unpresentedCheques.toLocaleString()})</span>
                          </div>
                          <div className="flex justify-between font-bold pt-1 border-t mt-2">
                              <span>Adjusted Bank Balance</span>
                              <span>₦{targetReconciliationValues().toLocaleString()}</span>
                          </div>
                      </div>

                      <div className={`p-4 rounded-lg mt-4 flex items-center justify-between ${reconciled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          <span className="font-bold">Difference</span>
                          <span className="font-mono text-xl">₦{Math.abs(diff).toLocaleString()}</span>
                      </div>
                      
                      {!reconciled && (
                          <p className="text-xs text-red-600 text-center">
                              Target mismatch. Please check your statement balance or untick pending items.
                          </p>
                      )}

                  </CardContent>
                  <CardFooter>
                      {reconciled && (
                          <Button className="w-full bg-blue-600">
                              <Download className="w-4 h-4 mr-2" /> Download Report
                          </Button>
                      )}
                  </CardFooter>
              </Card>
          </div>

      </div>

      {/* History Dialog */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
                <DialogTitle className="sr-only">Reconciliation History</DialogTitle>
                <SchoolReportHeader title="Reconciliation History" />
                <DialogDescription>
                    Access and manage past reconciliation reports.
                </DialogDescription>
            </DialogHeader>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Period</TableHead>
                        <TableHead>Account</TableHead>
                        <TableHead>Completed On</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mockHistory.map((report) => (
                         <TableRow key={report.id}>
                            <TableCell className="font-medium">{report.period}</TableCell>
                            <TableCell>{report.account}</TableCell>
                            <TableCell>{report.dateCompleted}</TableCell>
                            <TableCell className="text-right">
                                 <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                    onClick={() => {
                                        setViewingReport(report);
                                        // Optional: close the list dialog if you want only one open
                                        // setShowHistory(false); 
                                    }}
                                 >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View
                                 </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </DialogContent>
      </Dialog>

      {/* Report Details Dialog */}
      <Dialog open={!!viewingReport} onOpenChange={(open) => !open && setViewingReport(null)}>
        <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
                <SchoolReportHeader 
                    title="Reconciliation Report" 
                    subtitle={`${viewingReport?.period} • ${viewingReport?.account}`} 
                />
                <DialogTitle className="sr-only">Reconciliation Report</DialogTitle>
                <div className="flex items-start justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="bg-blue-600">
                                <Download className="w-4 h-4 mr-2" /> Download
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Choose Format</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDownload('pdf')}>
                                <FileDown className="w-4 h-4 mr-2" /> Save as PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownload('csv')}>
                                <FileText className="w-4 h-4 mr-2" /> Export to Excel/CSV
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </DialogHeader>
            
            {/* Report Content Visualization (Mock) */}
            <div className="py-6 space-y-6">
                <div className="grid grid-cols-3 gap-4 text-left">
                    <div className="p-4 bg-slate-50 rounded-lg">
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Statement Balance</p>
                        <p className="text-xl font-bold text-slate-900 mt-1">₦{viewingReport?.closingBalance.toLocaleString()}</p>
                    </div>
                     <div className="p-4 bg-slate-50 rounded-lg">
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Uncredited Lodgements</p>
                        <p className="text-xl font-bold text-green-600 mt-1">+ ₦45,000</p>
                    </div>
                     <div className="p-4 bg-slate-50 rounded-lg">
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Unpresented Cheques</p>
                        <p className="text-xl font-bold text-red-600 mt-1">- ₦15,000</p>
                    </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 border-b">
                        Reconciliation Summary
                    </div>
                    <div className="p-4 space-y-3">
                         <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Balance as per Cash Book</span>
                            <span className="font-mono">₦{(viewingReport?.closingBalance! + 30000).toLocaleString()}</span>
                        </div>
                         <div className="flex justify-between text-sm text-green-600">
                            <span>Add: Unpresented Cheques</span>
                            <span className="font-mono">+ ₦15,000</span>
                        </div>
                         <div className="flex justify-between text-sm text-red-600">
                            <span>Less: Uncredited Lodgements</span>
                            <span className="font-mono">- ₦45,000</span>
                        </div>
                        <div className="flex justify-between font-bold pt-3 border-t">
                            <span>Balance as per Bank Statement</span>
                            <span className="font-mono">₦{viewingReport?.closingBalance.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-gray-400 justify-center">
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                    Verified by Bursar on {viewingReport?.dateCompleted}
                </div>
            </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};