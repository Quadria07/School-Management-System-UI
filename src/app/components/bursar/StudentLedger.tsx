import React, { useState } from 'react';
import {
  Users,
  Search,
  FileText,
  Mail,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Unlock,
  Eye,
  Download,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { toast } from 'sonner';
import { Progress } from '../ui/progress';
import schoolLogo from 'figma:asset/05e5dcd127c3f9119091f655ee2db41390342c66.png';

interface StudentLedger {
  id: string;
  name: string;
  admissionNumber: string;
  class: string;
  totalBilled: number;
  totalPaid: number;
  balance: number;
  lastPayment: string;
  academicAccessRestricted: boolean;
  paymentHistory: PaymentRecord[];
}

interface PaymentRecord {
  date: string;
  amount: number;
  reference: string;
  description: string;
}

export const StudentLedgerManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentLedger | null>(null);
  const [showLedgerDialog, setShowLedgerDialog] = useState(false);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'debtors' | 'cleared'>('all');

  const [studentLedgers] = useState<StudentLedger[]>([
    {
      id: '1',
      name: 'Oluwatunde Adebayo',
      admissionNumber: 'BFOIA/2022/1234',
      class: 'JSS 3A',
      totalBilled: 218000,
      totalPaid: 218000,
      balance: 0,
      lastPayment: 'Jan 2, 2026',
      academicAccessRestricted: false,
      paymentHistory: [
        {
          date: 'Jan 2, 2026',
          amount: 218000,
          reference: 'PAY-2025-001523',
          description: 'First Term 2024/2025 Full Payment',
        },
        {
          date: 'Apr 15, 2024',
          amount: 215000,
          reference: 'PAY-2024-001234',
          description: 'Third Term 2023/2024 Full Payment',
        },
      ],
    },
    {
      id: '2',
      name: 'Chinedu Okoro',
      admissionNumber: 'BFOIA/2023/0456',
      class: 'SSS 2B',
      totalBilled: 235000,
      totalPaid: 145000,
      balance: 90000,
      lastPayment: 'Jan 2, 2026',
      academicAccessRestricted: false,
      paymentHistory: [
        {
          date: 'Jan 2, 2026',
          amount: 145000,
          reference: 'TRF-2025-000892',
          description: 'Partial Payment - First Term',
        },
      ],
    },
    {
      id: '3',
      name: 'Fatima Abdullahi',
      admissionNumber: 'BFOIA/2024/0234',
      class: 'JSS 1A',
      totalBilled: 215000,
      totalPaid: 98000,
      balance: 117000,
      lastPayment: 'Jan 2, 2026',
      academicAccessRestricted: true,
      paymentHistory: [
        {
          date: 'Jan 2, 2026',
          amount: 98000,
          reference: 'TRF-2025-000893',
          description: 'Partial Payment',
        },
      ],
    },
    {
      id: '4',
      name: 'Grace Adeola',
      admissionNumber: 'BFOIA/2023/0789',
      class: 'JSS 2A',
      totalBilled: 218000,
      totalPaid: 218000,
      balance: 0,
      lastPayment: 'Jan 1, 2026',
      academicAccessRestricted: false,
      paymentHistory: [
        {
          date: 'Jan 1, 2026',
          amount: 218000,
          reference: 'PAY-2025-001520',
          description: 'Full Term Payment',
        },
      ],
    },
    {
      id: '5',
      name: 'Ibrahim Musa',
      admissionNumber: 'BFOIA/2022/0987',
      class: 'SSS 1C',
      totalBilled: 230000,
      totalPaid: 230000,
      balance: 0,
      lastPayment: 'Jan 1, 2026',
      academicAccessRestricted: false,
      paymentHistory: [
        {
          date: 'Jan 1, 2026',
          amount: 175000,
          reference: 'TRF-2025-000888',
          description: 'Final Payment - Balance Cleared',
        },
        {
          date: 'Sep 15, 2024',
          amount: 55000,
          reference: 'PAY-2024-001456',
          description: 'Initial Deposit',
        },
      ],
    },
    {
      id: '6',
      name: 'Chiamaka Nwosu',
      admissionNumber: 'BFOIA/2023/0567',
      class: 'SSS 3A',
      totalBilled: 260000,
      totalPaid: 120000,
      balance: 140000,
      lastPayment: 'Dec 10, 2025',
      academicAccessRestricted: true,
      paymentHistory: [
        {
          date: 'Dec 10, 2025',
          amount: 120000,
          reference: 'PAY-2025-001450',
          description: 'Partial Payment',
        },
      ],
    },
  ]);

  const filteredStudents = studentLedgers.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.class.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'debtors' && student.balance > 0) ||
      (filterStatus === 'cleared' && student.balance === 0);

    return matchesSearch && matchesFilter;
  });

  const totalDebtors = studentLedgers.filter((s) => s.balance > 0).length;
  const totalDebt = studentLedgers.reduce((sum, s) => sum + s.balance, 0);

  const handleSendReminder = (student: StudentLedger) => {
    toast.success(`Payment reminder sent to parent of ${student.name} via SMS and Email`);
  };

  const handleToggleAccess = (student: StudentLedger) => {
    const action = student.academicAccessRestricted ? 'restored' : 'restricted';
    toast.success(`Academic access ${action} for ${student.name}`);
  };

  const handleViewFullLedger = (student: StudentLedger) => {
    setSelectedStudent(student);
    setShowLedgerDialog(true);
  };

  const handleGenerateOfficialReceipt = (student: StudentLedger) => {
    setSelectedStudent(student);
    setShowReceiptDialog(true);
  };

  const handleDownloadReceipt = () => {
    toast.info('Preparing receipt for download...');
    setTimeout(() => {
        toast.success('Receipt PDF downloaded successfully');
    }, 1500);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl mb-2 text-blue-950">
            Student Ledger & Debtor Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Track individual financial history and enforce payment policies
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-3">
            <CardDescription className="text-blue-700">Total Students</CardDescription>
            <CardTitle className="text-3xl text-blue-950">{studentLedgers.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-700">Active accounts</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="pb-3">
            <CardDescription className="text-red-700">Outstanding Debtors</CardDescription>
            <CardTitle className="text-3xl text-red-950">{totalDebtors}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-700">Students with balance</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardHeader className="pb-3">
            <CardDescription className="text-amber-700">Total Debt</CardDescription>
            <CardTitle className="text-3xl text-amber-950">
              ₦{(totalDebt / 1000000).toFixed(2)}M
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-amber-700">Requires collection</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by name, admission number, or class..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('all')}
          >
            All
          </Button>
          <Button
            variant={filterStatus === 'debtors' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('debtors')}
            className={filterStatus === 'debtors' ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            Debtors Only
          </Button>
          <Button
            variant={filterStatus === 'cleared' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('cleared')}
            className={filterStatus === 'cleared' ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            Cleared
          </Button>
        </div>
      </div>

      {/* Student Ledgers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Student Financial Records
          </CardTitle>
          <CardDescription>Comprehensive payment tracking for all students</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left p-3 font-semibold">Student Details</th>
                  <th className="text-right p-3 font-semibold">Total Billed</th>
                  <th className="text-right p-3 font-semibold">Total Paid</th>
                  <th className="text-right p-3 font-semibold">Balance</th>
                  <th className="text-center p-3 font-semibold">Status</th>
                  <th className="text-center p-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => {
                  const paymentProgress = (student.totalPaid / student.totalBilled) * 100;
                  return (
                    <tr
                      key={student.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-3">
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-gray-600">{student.admissionNumber}</p>
                          <p className="text-xs text-gray-500">{student.class}</p>
                        </div>
                      </td>
                      <td className="text-right p-3">₦{student.totalBilled.toLocaleString()}</td>
                      <td className="text-right p-3 text-green-700 font-semibold">
                        ₦{student.totalPaid.toLocaleString()}
                      </td>
                      <td className="text-right p-3">
                        {student.balance === 0 ? (
                          <span className="text-green-700 font-semibold">₦0</span>
                        ) : (
                          <span className="text-red-700 font-semibold">
                            ₦{student.balance.toLocaleString()}
                          </span>
                        )}
                      </td>
                      <td className="text-center p-3">
                        <div className="space-y-1">
                          {student.balance === 0 ? (
                            <Badge className="bg-green-600 text-white">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Cleared
                            </Badge>
                          ) : (
                            <Badge className="bg-red-600 text-white">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Debtor
                            </Badge>
                          )}
                          {student.academicAccessRestricted && (
                            <Badge variant="outline" className="border-red-300 text-red-700">
                              <Lock className="w-3 h-3 mr-1" />
                              Restricted
                            </Badge>
                          )}
                          <div className="mt-2">
                            <Progress
                              value={paymentProgress}
                              className={`h-1 ${
                                paymentProgress === 100
                                  ? '[&>div]:bg-green-600'
                                  : '[&>div]:bg-amber-600'
                              }`}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="text-center p-3">
                        <div className="flex gap-1 justify-center flex-wrap">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewFullLedger(student)}
                            title="View Ledger"
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                          {student.balance === 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleGenerateOfficialReceipt(student)}
                                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                title="Generate Official Receipt"
                            >
                                <FileText className="w-3 h-3" />
                            </Button>
                          )}
                          {student.balance > 0 && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSendReminder(student)}
                              >
                                <Mail className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleAccess(student)}
                                className={
                                  student.academicAccessRestricted
                                    ? 'border-green-300 text-green-700'
                                    : 'border-red-300 text-red-700'
                                }
                              >
                                {student.academicAccessRestricted ? (
                                  <Unlock className="w-3 h-3" />
                                ) : (
                                  <Lock className="w-3 h-3" />
                                )}
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Full Ledger Dialog */}
      <Dialog open={showLedgerDialog} onOpenChange={setShowLedgerDialog}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Complete Financial Ledger</DialogTitle>
            <DialogDescription>
              {selectedStudent?.name} ({selectedStudent?.admissionNumber})
            </DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-xs text-blue-700">Total Billed</p>
                  <p className="font-bold text-blue-950">
                    ₦{selectedStudent.totalBilled.toLocaleString()}
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <p className="text-xs text-green-700">Total Paid</p>
                  <p className="font-bold text-green-950">
                    ₦{selectedStudent.totalPaid.toLocaleString()}
                  </p>
                </div>
                <div className="bg-red-50 p-3 rounded">
                  <p className="text-xs text-red-700">Balance</p>
                  <p className="font-bold text-red-950">
                    ₦{selectedStudent.balance.toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Payment History</h4>
                <div className="space-y-2">
                  {selectedStudent.paymentHistory.map((payment, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded border border-gray-200 bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">{payment.description}</p>
                          <p className="text-xs text-gray-600">
                            {payment.date} • {payment.reference}
                          </p>
                        </div>
                        <p className="font-bold text-green-700">
                          ₦{payment.amount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLedgerDialog(false)}>
              Close
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <FileText className="w-4 h-4 mr-2" />
              Export Ledger
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Official Receipt Dialog */}
      <Dialog open={showReceiptDialog} onOpenChange={setShowReceiptDialog}>
        <DialogContent className="sm:max-w-[700px] bg-white p-0 overflow-hidden flex flex-col max-h-[90vh]">
          <DialogHeader className="sr-only">
            <DialogTitle>School Fees Receipt</DialogTitle>
            <DialogDescription>
              Detailed official receipt for {selectedStudent?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-6 md:p-8 overflow-y-auto flex-1" id="official-receipt">
            {/* 1. Header Section */}
            <div className="border border-blue-950 p-2 mb-4">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
                <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center flex-shrink-0">
                  <img
                    src={schoolLogo}
                    alt="BFOIA Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 text-center">
                  <h1 className="text-lg sm:text-xl font-bold text-blue-950 mb-0 leading-tight">
                    BISHOP FELIX OWOLABI INT'L ACADEMY
                  </h1>
                  <p className="text-[10px] sm:text-xs text-gray-700 mb-1 leading-snug">
                    1, Faithtriumph Drive, Behind Galaxy Hotel, West
                    Bye Pass, Ring Road, Osogbo, Osun State
                  </p>
                  <p className="text-[10px] font-semibold text-blue-900 italic">
                    MOTTO ..... learning for an Exceptional Nation
                  </p>
                </div>
              </div>
            </div>

            {/* Receipt Title */}
            <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-blue-900 underline uppercase tracking-wide">
                    OFFICIAL SCHOOL FEES RECEIPT
                </h2>
                <p className="text-sm font-semibold text-gray-500 mt-1">
                    First Term 2024/2025 Session
                </p>
            </div>

            {/* 2. Student Details Section */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 mb-6 text-sm">
                <div className="flex border-b border-gray-200 pb-1">
                    <span className="font-semibold text-gray-600 w-24">Name:</span>
                    <span className="font-bold text-gray-900 flex-1">{selectedStudent?.name}</span>
                </div>
                <div className="flex border-b border-gray-200 pb-1">
                    <span className="font-semibold text-gray-600 w-24">Receipt No:</span>
                    <span className="font-mono text-gray-900 flex-1">RCPT-{selectedStudent?.admissionNumber.replace(/\//g, '-')}-001</span>
                </div>
                <div className="flex border-b border-gray-200 pb-1">
                    <span className="font-semibold text-gray-600 w-24">Class:</span>
                    <span className="font-bold text-gray-900 flex-1">{selectedStudent?.class}</span>
                </div>
                <div className="flex border-b border-gray-200 pb-1">
                    <span className="font-semibold text-gray-600 w-24">Date:</span>
                    <span className="font-medium text-gray-900 flex-1">{new Date().toLocaleDateString()}</span>
                </div>
            </div>

            {/* 3. Details Table */}
            <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-700 uppercase mb-2 border-b-2 border-gray-300 pb-1 inline-block">
                    Payment Details
                </h3>
                <div className="border border-gray-300 rounded-sm overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 border-b border-gray-300">
                            <tr>
                                <th className="text-left p-2 border-r border-gray-300">Description</th>
                                <th className="text-right p-2 w-32">Amount (₦)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                             <tr className="bg-white">
                                <td className="p-2 border-r border-gray-200">Tuition & School Fees (Consolidated)</td>
                                <td className="p-2 text-right text-gray-700">
                                    {selectedStudent?.totalPaid.toLocaleString()}
                                </td>
                            </tr>
                        </tbody>
                        <tfoot className="bg-blue-50 border-t-2 border-blue-200">
                             <tr>
                                <td className="p-3 text-right font-bold text-blue-900 border-r border-blue-200 uppercase">
                                    Grand Total
                                </td>
                                <td className="p-3 text-right font-bold text-blue-900 text-base">
                                    ₦{selectedStudent?.totalPaid.toLocaleString()}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                
                {/* Payment Status Badge */}
                <div className="mt-4 flex justify-end">
                    <div className="border-2 font-bold px-4 py-1 rounded uppercase text-sm transform -rotate-2 border-green-600 text-green-700">
                        PAID IN FULL
                    </div>
                </div>
            </div>

            {/* 4. Footer & Signature */}
            <div className="mt-12 pt-4 border-t border-gray-300 flex justify-between items-end">
                <div className="text-xs text-gray-500 italic">
                    <p>Generated on {new Date().toLocaleDateString()}</p>
                    <p>This receipt is system generated.</p>
                </div>
                
                <div className="flex flex-col items-center">
                    <div className="mb-2 h-12 flex items-end">
                         <div className="font-script text-2xl text-blue-900">Bursar</div>
                    </div>
                    <div className="w-48 border-t border-gray-800"></div>
                    <p className="text-xs font-bold text-gray-900 mt-1 uppercase">Authorised Signature</p>
                </div>
            </div>
          </div>

          <DialogFooter className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex-shrink-0">
             <Button variant="outline" onClick={() => setShowReceiptDialog(false)}>
               Close
             </Button>
             <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleDownloadReceipt}>
                <Download className="w-4 h-4 mr-2" />
                Download Receipt PDF
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
