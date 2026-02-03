import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Search,
  FileText,
  Download,
  Mail,
  CreditCard,
  AlertCircle,
  X,
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
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface Payment {
  id: string;
  studentName: string;
  admissionNumber: string;
  class: string;
  amount: number;
  paymentType: 'online' | 'bank' | 'cash';
  reference: string;
  date: string;
  status: 'pending' | 'verified' | 'rejected';
  description: string;
}

export const PaymentVerification: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'verified'>('pending');

  const [payments] = useState<Payment[]>([
    {
      id: '1',
      studentName: 'Chinedu Okoro',
      admissionNumber: 'BFOIA/2023/0456',
      class: 'SSS 2B',
      amount: 145000,
      paymentType: 'bank',
      reference: 'TRF-2025-000892',
      date: 'Jan 2, 2026 - 10:15 AM',
      status: 'pending',
      description: 'First Term 2024/2025 School Fees',
    },
    {
      id: '2',
      studentName: 'Fatima Abdullahi',
      admissionNumber: 'BFOIA/2024/0234',
      class: 'JSS 1A',
      amount: 98000,
      paymentType: 'bank',
      reference: 'TRF-2025-000893',
      date: 'Jan 2, 2026 - 11:30 AM',
      status: 'pending',
      description: 'Partial Payment - First Term Fees',
    },
    {
      id: '3',
      studentName: 'Oluwatunde Adebayo',
      admissionNumber: 'BFOIA/2022/1234',
      class: 'JSS 3A',
      amount: 218000,
      paymentType: 'online',
      reference: 'PAY-2025-001523',
      date: 'Jan 2, 2026 - 9:45 AM',
      status: 'verified',
      description: 'First Term 2024/2025 Full Payment',
    },
    {
      id: '4',
      studentName: 'Grace Adeola',
      admissionNumber: 'BFOIA/2023/0789',
      class: 'JSS 2A',
      amount: 218000,
      paymentType: 'online',
      reference: 'PAY-2025-001520',
      date: 'Jan 1, 2026 - 3:20 PM',
      status: 'verified',
      description: 'First Term 2024/2025 Full Payment',
    },
    {
      id: '5',
      studentName: 'Ibrahim Musa',
      admissionNumber: 'BFOIA/2022/0987',
      class: 'SSS 1C',
      amount: 175000,
      paymentType: 'bank',
      reference: 'TRF-2025-000888',
      date: 'Jan 1, 2026 - 2:10 PM',
      status: 'verified',
      description: 'Term Payment - Outstanding Balance Cleared',
    },
  ]);

  const filteredPayments = payments.filter(
    (payment) =>
      payment.status === activeTab &&
      (payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.reference.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleApprovePayment = (payment: Payment) => {
    toast.success(`Payment verified for ${payment.studentName}. Student ledger updated.`);
    setSelectedPayment(null);
  };

  const handleRejectPayment = (payment: Payment) => {
    toast.error(`Payment rejected for ${payment.studentName}. Parent will be notified.`);
    setSelectedPayment(null);
  };

  const handlePrintReceipt = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowReceiptDialog(true);
  };

  const handleEmailReceipt = (payment: Payment) => {
    toast.success(`Receipt emailed to parent of ${payment.studentName}`);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl mb-2 text-blue-950">
            Payment Verification & Receipting
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Reconcile payments and issue official receipts
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search by student name, admission number, or reference..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as 'pending' | 'verified')}>
        <TabsList className="w-full sm:w-auto grid grid-cols-2 sm:flex sm:justify-start mb-4">
          <TabsTrigger value="pending" className="px-6">
            Pending Verification ({payments.filter((p) => p.status === 'pending').length})
          </TabsTrigger>
          <TabsTrigger value="verified" className="px-6">
            Verified ({payments.filter((p) => p.status === 'verified').length})
          </TabsTrigger>
        </TabsList>

        {/* Pending Payments */}
        <TabsContent value="pending" className="space-y-4 mt-6">
          {filteredPayments.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <CheckCircle2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">All Caught Up!</h3>
                <p className="text-gray-600">No pending payments to verify at the moment.</p>
              </CardContent>
            </Card>
          ) : (
            filteredPayments.map((payment) => (
              <Card key={payment.id} className="border-amber-200 bg-amber-50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-amber-600 text-white">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending Verification
                        </Badge>
                        <Badge variant="outline">
                          <CreditCard className="w-3 h-3 mr-1" />
                          {payment.paymentType.toUpperCase()}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-lg mb-1">{payment.studentName}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {payment.admissionNumber} • {payment.class}
                      </p>
                      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                        <div>
                          <p className="text-gray-600">Amount:</p>
                          <p className="font-semibold text-green-700 text-lg">
                            ₦{payment.amount.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Reference:</p>
                          <p className="font-mono text-xs">{payment.reference}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-gray-600">Description:</p>
                          <p className="font-medium">{payment.description}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-gray-600">Date/Time:</p>
                          <p className="text-xs">{payment.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          className="bg-green-600 hover:bg-green-700"
                          size="sm"
                          onClick={() => handleApprovePayment(payment)}
                        >
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Approve & Receipt
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-300 text-red-700 hover:bg-red-50"
                          onClick={() => handleRejectPayment(payment)}
                        >
                          <X className="w-3 h-3 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Verified Payments */}
        <TabsContent value="verified" className="space-y-4 mt-6">
          {filteredPayments.map((payment) => (
            <Card key={payment.id} className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-green-600 text-white">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                      <Badge variant="outline">
                        <CreditCard className="w-3 h-3 mr-1" />
                        {payment.paymentType.toUpperCase()}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{payment.studentName}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {payment.admissionNumber} • {payment.class}
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                      <div>
                        <p className="text-gray-600">Amount:</p>
                        <p className="font-semibold text-green-700 text-lg">
                          ₦{payment.amount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Reference:</p>
                        <p className="font-mono text-xs">{payment.reference}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-gray-600">Description:</p>
                        <p className="font-medium">{payment.description}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-gray-600">Date/Time:</p>
                        <p className="text-xs">{payment.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePrintReceipt(payment)}
                      >
                        <FileText className="w-3 h-3 mr-1" />
                        Print Receipt
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEmailReceipt(payment)}>
                        <Mail className="w-3 h-3 mr-1" />
                        Email Receipt
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Receipt Dialog */}
      <Dialog open={showReceiptDialog} onOpenChange={setShowReceiptDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Official Payment Receipt</DialogTitle>
            <DialogDescription>
              Watermarked PDF receipt - Non-editable once generated
            </DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="border-2 border-blue-600 rounded-lg p-6 bg-white">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-blue-950">
                  Bishop Felix Owolabi International Academy
                </h2>
                <p className="text-sm text-gray-600">Official Payment Receipt</p>
                <p className="text-xs text-gray-500">Non-Editable • Digitally Signed</p>
              </div>
              <div className="space-y-3 mb-6">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">Receipt No:</p>
                    <p className="font-mono font-bold">{selectedPayment.reference}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Date:</p>
                    <p className="font-medium">{selectedPayment.date}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Student Name:</p>
                    <p className="font-medium">{selectedPayment.studentName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Admission Number:</p>
                    <p className="font-medium">{selectedPayment.admissionNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Class:</p>
                    <p className="font-medium">{selectedPayment.class}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Payment Method:</p>
                    <p className="font-medium">{selectedPayment.paymentType.toUpperCase()}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-600">Description:</p>
                    <p className="font-medium">{selectedPayment.description}</p>
                  </div>
                  <div className="col-span-2 bg-green-50 p-3 rounded border border-green-200">
                    <p className="text-gray-600 text-xs">Amount Paid:</p>
                    <p className="font-bold text-2xl text-green-700">
                      ₦{selectedPayment.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-center text-xs text-gray-500 border-t pt-3">
                <p>This is an official computer-generated receipt and requires no signature.</p>
                <p>For inquiries: bursar@bfoia.edu.ng | +234 803 123 4567</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReceiptDialog(false)}>
              Close
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
