import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import {
  Shield,
  AlertTriangle,
  History,
  CheckCircle2,
  Calendar,
  Download,
  Plus,
  FileText
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';

interface RemittanceRecord {
  id: string;
  type: 'PAYE' | 'Pension' | 'VAT';
  period: string;
  amount: number;
  datePaid: string;
  reference: string;
  status: 'pending' | 'completed';
}

export const TaxCompliance: React.FC = () => {
  const [showRemitDialog, setShowRemitDialog] = useState(false);
  const [remittanceType, setRemittanceType] = useState<'PAYE' | 'Pension' | 'VAT'>('PAYE');
  
  // Mock Data
  const [history, setHistory] = useState<RemittanceRecord[]>([
    {
      id: '1',
      type: 'PAYE',
      period: 'December 2025',
      amount: 1150000,
      datePaid: '2026-01-05',
      reference: 'RRR-2398-4492',
      status: 'completed'
    },
    {
      id: '2',
      type: 'Pension',
      period: 'December 2025',
      amount: 920000,
      datePaid: '2026-01-05',
      reference: 'PEN-992-1102',
      status: 'completed'
    }
  ]);

  const liabilities = {
    paye: 1250000,
    pension: 980000
  };

  const handleRecordRemittance = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit to backend
    const newRecord: RemittanceRecord = {
        id: Math.random().toString(),
        type: remittanceType,
        period: 'January 2026',
        amount: remittanceType === 'PAYE' ? liabilities.paye : liabilities.pension,
        datePaid: new Date().toISOString().split('T')[0],
        reference: `RRR-${Math.floor(Math.random() * 10000)}-${Math.floor(Math.random() * 10000)}`,
        status: 'completed'
    };
    
    setHistory([newRecord, ...history]);
    setShowRemitDialog(false);
    toast.success(`${remittanceType} Remittance Recorded Successfully`);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl mb-2 text-blue-950">
            Tax & Compliance Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Track statutory liabilities and record remittances to government bodies
          </p>
        </div>
        <Button onClick={() => setShowRemitDialog(true)} className="bg-blue-600">
            <Plus className="w-4 h-4 mr-2" /> Record New Remittance
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* PAYE Card */}
        <Card className="bg-amber-50 border-amber-200">
            <CardHeader className="pb-2">
                <CardTitle className="text-amber-900 flex items-center justify-between text-base">
                    <span className="flex items-center gap-2">
                         <Shield className="w-4 h-4" /> PAYE Liability
                    </span>
                    <Badge className="bg-amber-200 text-amber-800 hover:bg-amber-300 border-0">Due Now</Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mt-2">
                     <p className="text-3xl font-bold text-amber-950">₦{liabilities.paye.toLocaleString()}</p>
                     <p className="text-sm text-amber-700 mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Due: Jan 15, 2026
                     </p>
                </div>
                <div className="mt-4 pt-4 border-t border-amber-200">
                     <p className="text-xs text-amber-800 font-medium">Auto-calculated from Jan Payroll</p>
                </div>
            </CardContent>
        </Card>

        {/* Pension Card */}
        <Card className="bg-green-50 border-green-200">
            <CardHeader className="pb-2">
                <CardTitle className="text-green-900 flex items-center justify-between text-base">
                    <span className="flex items-center gap-2">
                         <Shield className="w-4 h-4" /> Pension Liability
                    </span>
                    <Badge className="bg-green-200 text-green-800 hover:bg-green-300 border-0">Due Now</Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mt-2">
                     <p className="text-3xl font-bold text-green-950">₦{liabilities.pension.toLocaleString()}</p>
                     <p className="text-sm text-green-700 mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Due: Jan 15, 2026
                     </p>
                </div>
                <div className="mt-4 pt-4 border-t border-green-200">
                     <p className="text-xs text-green-800 font-medium">Auto-calculated from Jan Payroll</p>
                </div>
            </CardContent>
        </Card>
        
        {/* Compliance Score Card */}
        <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-2">
                <CardTitle className="text-blue-900 flex items-center gap-2 text-base">
                     <CheckCircle2 className="w-4 h-4" /> Compliance Score
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mt-2 flex items-baseline gap-2">
                     <p className="text-3xl font-bold text-blue-950">95%</p>
                     <p className="text-sm text-blue-700">Excellent</p>
                </div>
                <div className="mt-4 space-y-2">
                     <div className="flex justify-between text-xs text-blue-800">
                         <span>FIRS Filing</span>
                         <span className="text-green-600 font-bold">Up to date</span>
                     </div>
                     <div className="flex justify-between text-xs text-blue-800">
                         <span>Annual Returns</span>
                         <span className="text-amber-600 font-bold">Due Soon</span>
                     </div>
                </div>
            </CardContent>
        </Card>
      </div>

      {/* Remittance History */}
      <Card>
          <CardHeader>
              <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                      <History className="w-5 h-5 text-gray-500" />
                      <CardTitle>Remittance History</CardTitle>
                  </div>
                  <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" /> Export Report
                  </Button>
              </div>
              <CardDescription>
                  Log of all statutory payments made to government bodies
              </CardDescription>
          </CardHeader>
          <CardContent>
              <Table>
                  <TableHeader>
                      <TableRow>
                          <TableHead>Date Paid</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Period Covered</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead>Reference (RRR/ID)</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead></TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {history.map((record) => (
                          <TableRow key={record.id}>
                              <TableCell className="font-medium">{record.datePaid}</TableCell>
                              <TableCell>
                                  <Badge variant="outline" className={
                                      record.type === 'PAYE' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                                      'bg-green-50 text-green-700 border-green-200'
                                  }>
                                      {record.type}
                                  </Badge>
                              </TableCell>
                              <TableCell>{record.period}</TableCell>
                              <TableCell className="text-right font-bold">
                                  ₦{record.amount.toLocaleString()}
                              </TableCell>
                              <TableCell className="font-mono text-xs text-gray-500">
                                  {record.reference}
                              </TableCell>
                              <TableCell>
                                  <div className="flex items-center gap-1 text-green-600 text-xs font-medium bg-green-50 px-2 py-1 rounded w-fit">
                                      <CheckCircle2 className="w-3 h-3" />
                                      Verified
                                  </div>
                              </TableCell>
                              <TableCell>
                                  <Button variant="ghost" size="sm">
                                      <FileText className="w-4 h-4 text-gray-400" />
                                  </Button>
                              </TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
              </Table>
          </CardContent>
      </Card>

      {/* Record Payment Dialog */}
      <Dialog open={showRemitDialog} onOpenChange={setShowRemitDialog}>
          <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                  <DialogTitle>Record Tax/Pension Payment</DialogTitle>
                  <DialogDescription>
                      Enter details from the bank teller or RRR receipt.
                  </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleRecordRemittance} className="space-y-4 py-4">
                  <div className="space-y-2">
                      <Label>Remittance Type</Label>
                      <Select 
                        value={remittanceType} 
                        onValueChange={(val: any) => setRemittanceType(val)}
                      >
                          <SelectTrigger>
                              <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="PAYE">PAYE Tax (State Govt)</SelectItem>
                              <SelectItem value="Pension">Pension (PFA)</SelectItem>
                              <SelectItem value="VAT">VAT / WHT (Federal)</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>

                  <div className="space-y-2">
                      <Label>Payment Period</Label>
                      <Select defaultValue="jan-2026">
                          <SelectTrigger>
                              <SelectValue placeholder="Select Month" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="dec-2025">December 2025</SelectItem>
                              <SelectItem value="jan-2026">January 2026</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>

                  <div className="space-y-2">
                      <Label>Amount Paid (₦)</Label>
                      <Input 
                        type="number" 
                        defaultValue={remittanceType === 'PAYE' ? liabilities.paye : liabilities.pension}
                      />
                  </div>

                  <div className="space-y-2">
                      <Label>Reference Number (RRR / Teller ID)</Label>
                      <Input placeholder="e.g. RRR-0000-0000-0000" required />
                  </div>
                  
                  <div className="space-y-2">
                      <Label>Payment Date</Label>
                      <Input type="date" required />
                  </div>

                  <DialogFooter className="mt-4">
                      <Button type="button" variant="outline" onClick={() => setShowRemitDialog(false)}>
                          Cancel
                      </Button>
                      <Button type="submit" className="bg-blue-600">
                          Record Payment
                      </Button>
                  </DialogFooter>
              </form>
          </DialogContent>
      </Dialog>

    </div>
  );
};