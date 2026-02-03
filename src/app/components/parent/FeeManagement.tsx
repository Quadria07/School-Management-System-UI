import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Download,
  CheckCircle2,
  AlertCircle,
  Receipt,
  Calendar,
  DollarSign,
  Eye,
  FileText,
  Building2,
  Send,
  Clock,
  Landmark,
  User,
  Copy,
  Plus
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
import { Checkbox } from '../ui/checkbox';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { useParent } from '../../../contexts/ParentContext';
import schoolLogo from 'figma:asset/05e5dcd127c3f9119091f655ee2db41390342c66.png';

interface FeeBreakdown {
  item: string;
  amount: number;
  paid: number;
  outstanding: number;
}

interface Payment {
  id: string;
  date: string;
  amount: number;
  method: string;
  reference: string;
  description: string;
  isOfficial?: boolean;
  status: 'confirmed' | 'pending';
}

const PAYMENT_PURPOSES = [
  'Tuition Fee',
  'School Bus Fee',
  'Uniform & Books',
  'Examination Fee',
  'Other'
];

export const FeeManagement: React.FC = () => {
  const parentContext = useParent();
  const selectedChild = parentContext?.selectedChild;
  
  // Dialog States
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [showSubmitProofDialog, setShowSubmitProofDialog] = useState(false);
  
  // Selection States
  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [amountToPay, setAmountToPay] = useState(0);

  // Submit Proof Form States
  const [proofAmount, setProofAmount] = useState('');
  const [proofSenderName, setProofSenderName] = useState('');
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>([]);
  const [otherPurposeText, setOtherPurposeText] = useState('');
  const [proofDate, setProofDate] = useState(new Date().toISOString().split('T')[0]);

  // Initialize fee breakdown based on selected child
  const [feeBreakdown, setFeeBreakdown] = useState<FeeBreakdown[]>([]);

  useEffect(() => {
    // Logic to switch data based on child
    if (selectedChild?.outstandingBalance && selectedChild.outstandingBalance > 0) {
       setFeeBreakdown([
        { item: 'Tuition Fee', amount: 150000, paid: 105000, outstanding: 45000 },
        { item: 'Bus Transportation', amount: 35000, paid: 35000, outstanding: 0 },
        { item: 'Textbooks & Materials', amount: 25000, paid: 25000, outstanding: 0 },
        { item: 'School Uniform', amount: 18000, paid: 18000, outstanding: 0 },
        { item: 'Extra-Curricular Activities', amount: 12000, paid: 12000, outstanding: 0 },
        { item: 'Examination Fees', amount: 8000, paid: 8000, outstanding: 0 },
      ]);
    } else {
      setFeeBreakdown([
        { item: 'Tuition Fee', amount: 120000, paid: 120000, outstanding: 0 },
        { item: 'Bus Transportation', amount: 35000, paid: 35000, outstanding: 0 },
        { item: 'Textbooks & Materials', amount: 25000, paid: 25000, outstanding: 0 },
        { item: 'School Uniform', amount: 18000, paid: 18000, outstanding: 0 },
        { item: 'Extra-Curricular Activities', amount: 12000, paid: 12000, outstanding: 0 },
        { item: 'Examination Fees', amount: 8000, paid: 8000, outstanding: 0 },
      ]);
    }
  }, [selectedChild]);

  const [payments, setPayments] = useState<Payment[]>([
    {
      id: '1',
      date: 'Sep 10, 2024',
      amount: 150000,
      method: 'Bank Transfer',
      reference: 'TRX-2024-001523',
      description: 'First Term 2024/2025 Full Payment',
      status: 'confirmed'
    },
    {
      id: '2',
      date: 'Apr 18, 2024',
      amount: 145000,
      method: 'Debit Card',
      reference: 'TRX-2024-000892',
      description: 'Third Term 2023/2024 Full Payment',
      status: 'confirmed'
    },
    {
      id: '3',
      date: 'Jan 12, 2024',
      amount: 145000,
      method: 'Cash',
      reference: 'CASH-2024-000341',
      description: 'Second Term 2023/2024 Full Payment',
      status: 'confirmed'
    },
  ]);

  const totalFees = feeBreakdown.reduce((sum, item) => sum + item.amount, 0);
  const totalPaid = feeBreakdown.reduce((sum, item) => sum + item.paid, 0);
  const totalOutstanding = feeBreakdown.reduce((sum, item) => sum + item.outstanding, 0);
  const paymentProgress = (totalPaid / totalFees) * 100;

  const handlePayNow = (amount: number) => {
    setAmountToPay(amount);
    setShowPaymentDialog(true);
  };

  const handlePayment = () => {
    toast.success(`Payment of ₦${amountToPay.toLocaleString()} initiated successfully!`);
    setShowPaymentDialog(false);
    setAmountToPay(0);
  };

  const handleDownloadReceipt = () => {
    toast.info('Preparing receipt for download...');
    setTimeout(() => {
        toast.success('Receipt PDF downloaded successfully');
    }, 1500);
  };

  const handleViewReceipt = (payment: Payment) => {
    setSelectedReceipt(payment);
    setShowReceiptDialog(true);
  };

  const handleViewOfficialReceipt = () => {
    const officialReceipt: Payment = {
        id: 'OFFICIAL-' + Math.random().toString(36).substr(2, 9),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        amount: totalFees,
        method: 'Consolidated',
        reference: 'RCPT-OFFICIAL-' + Math.floor(Math.random() * 10000),
        description: 'Official School Fees Receipt - First Term 2024/2025',
        isOfficial: true,
        status: 'confirmed'
    };
    setSelectedReceipt(officialReceipt);
    setShowReceiptDialog(true);
  };

  const togglePurpose = (purpose: string) => {
    setSelectedPurposes(prev => {
        if (prev.includes(purpose)) {
            return prev.filter(p => p !== purpose);
        } else {
            return [...prev, purpose];
        }
    });
  };

  const handleSubmitProof = () => {
    if (!proofAmount || !proofSenderName || selectedPurposes.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (selectedPurposes.includes('Other') && !otherPurposeText) {
        toast.error('Please specify the purpose for "Other"');
        return;
    }

    const amount = parseFloat(proofAmount.replace(/,/g, ''));
    
    // Construct description from selected purposes
    let description = selectedPurposes.filter(p => p !== 'Other').join(', ');
    if (selectedPurposes.includes('Other')) {
        description += description ? `, ${otherPurposeText}` : otherPurposeText;
    }
    
    // Add new pending payment
    const newPayment: Payment = {
      id: 'PENDING-' + Math.random().toString(36).substr(2, 9),
      date: new Date(proofDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      amount: amount,
      method: 'Bank Transfer',
      reference: 'PENDING-' + Math.floor(Math.random() * 10000),
      description: description,
      status: 'pending'
    };

    setPayments([newPayment, ...payments]);
    setShowSubmitProofDialog(false);
    
    // Reset form
    setProofAmount('');
    setProofSenderName('');
    setSelectedPurposes([]);
    setOtherPurposeText('');

    toast.success('Payment proof submitted successfully! Awaiting Admin verification.');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl mb-2 text-blue-950">Financial & Fee Management</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Viewing fees for <strong>{selectedChild?.name}</strong> ({selectedChild?.class})
          </p>
        </div>
      </div>

      {/* Fee Status Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-3">
            <CardDescription className="text-blue-700">Total Fees (This Term)</CardDescription>
            <CardTitle className="text-3xl text-blue-950">
              ₦{totalFees.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-700">First Term 2024/2025</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-3">
            <CardDescription className="text-green-700">Amount Paid</CardDescription>
            <CardTitle className="text-3xl text-green-950">
              ₦{totalPaid.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-green-700">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm font-medium">{paymentProgress.toFixed(0)}% Complete</span>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`bg-gradient-to-br ${
            totalOutstanding > 0
              ? 'from-red-50 to-red-100 border-red-200'
              : 'from-green-50 to-green-100 border-green-200'
          }`}
        >
          <CardHeader className="pb-3">
            <CardDescription
              className={totalOutstanding > 0 ? 'text-red-700' : 'text-green-700'}
            >
              Outstanding Balance
            </CardDescription>
            <CardTitle
              className={`text-3xl ${totalOutstanding > 0 ? 'text-red-950' : 'text-green-950'}`}
            >
              ₦{totalOutstanding.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {totalOutstanding > 0 ? (
              <Button
                className="w-full bg-red-600 hover:bg-red-700"
                size="sm"
                onClick={() => handlePayNow(totalOutstanding)}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Pay Now
              </Button>
            ) : (
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                size="sm"
                onClick={handleViewOfficialReceipt}
              >
                <FileText className="w-4 h-4 mr-2" />
                View Official Receipt
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Payment Progress Messages */}
      {totalOutstanding === 0 && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Excellent!</strong> All fees for {selectedChild?.name} have been paid in full
            for this term. No outstanding balance.
          </AlertDescription>
        </Alert>
      )}

      {totalOutstanding > 0 && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Payment Required:</strong> There is an outstanding balance of ₦
            {totalOutstanding.toLocaleString()} for {selectedChild?.name}. Please clear before the
            deadline to avoid restrictions.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="statement" className="w-full space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="statement">Statement of Account</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
        </TabsList>

        <TabsContent value="statement">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                    <Receipt className="w-5 h-5" />
                    Statement of Account - First Term 2024/2025
                    </CardTitle>
                    <CardDescription>Detailed fee breakdown for {selectedChild?.name}</CardDescription>
                </div>
                {totalOutstanding > 0 && (
                    <Button
                        className="bg-red-600 hover:bg-red-700"
                        size="sm"
                        onClick={() => handlePayNow(totalOutstanding)}
                    >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Pay Now
                    </Button>
                )}
                </CardHeader>
                <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full">
                    <thead>
                        <tr className="border-b-2 border-gray-300">
                        <th className="text-left p-3 font-semibold">Fee Item</th>
                        <th className="text-right p-3 font-semibold">Total Amount</th>
                        <th className="text-right p-3 font-semibold">Paid</th>
                        <th className="text-right p-3 font-semibold">Outstanding</th>
                        <th className="text-center p-3 font-semibold">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feeBreakdown.map((item, idx) => (
                        <tr
                            key={idx}
                            className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                            <td className="p-3 font-medium">{item.item}</td>
                            <td className="text-right p-3">₦{item.amount.toLocaleString()}</td>
                            <td className="text-right p-3 text-green-700 font-semibold">
                            ₦{item.paid.toLocaleString()}
                            </td>
                            <td className="text-right p-3 text-red-700 font-semibold">
                            ₦{item.outstanding.toLocaleString()}
                            </td>
                            <td className="text-center p-3">
                            {item.outstanding === 0 ? (
                                <Badge className="bg-green-600 text-white">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Paid
                                </Badge>
                            ) : (
                                <Badge className="bg-red-600 text-white">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Pending
                                </Badge>
                            )}
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="bg-blue-50 border-t-2 border-blue-300">
                        <td className="p-3 font-bold">Total</td>
                        <td className="text-right p-3 font-bold">₦{totalFees.toLocaleString()}</td>
                        <td className="text-right p-3 font-bold text-green-700">
                            ₦{totalPaid.toLocaleString()}
                        </td>
                        <td className="text-right p-3 font-bold text-red-700">
                            ₦{totalOutstanding.toLocaleString()}
                        </td>
                        <td className="text-center p-3">
                            <Progress value={paymentProgress} className="h-2" />
                        </td>
                        </tr>
                    </tfoot>
                    </table>
                </div>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="history">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column: Payment History (2/3 width) */}
                <Card className="lg:col-span-2 h-fit">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Payment History
                    </CardTitle>
                    <CardDescription>Verified payments and pending approvals</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                    {payments.map((payment) => (
                        <div
                        key={payment.id}
                        className={`p-4 rounded-lg border bg-white transition-shadow ${
                            payment.status === 'pending' ? 'border-amber-200 bg-amber-50/50' : 'border-gray-200 hover:shadow-md'
                        }`}
                        >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                            <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                {payment.status === 'confirmed' ? (
                                <Badge className="bg-green-600 text-white">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Confirmed
                                </Badge>
                                ) : (
                                <Badge className="bg-amber-500 text-white">
                                    <Clock className="w-3 h-3 mr-1" />
                                    Pending
                                </Badge>
                                )}
                                <span className="text-xs text-gray-600">{payment.date}</span>
                            </div>
                            <h4 className="font-semibold mb-1">{payment.description}</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                <p className="text-gray-600">Amount:</p>
                                <p className={`font-semibold ${payment.status === 'pending' ? 'text-amber-700' : 'text-green-700'}`}>
                                    ₦{payment.amount.toLocaleString()}
                                </p>
                                </div>
                                <div>
                                <p className="text-gray-600">Method:</p>
                                <p className="font-semibold">{payment.method}</p>
                                </div>
                                <div className="col-span-2">
                                <p className="text-gray-600">Reference:</p>
                                <p className="font-mono text-xs">{payment.reference}</p>
                                </div>
                            </div>
                            </div>
                            
                            <div className="flex items-start">
                                {payment.status === 'confirmed' ? (
                                    <Button variant="outline" size="sm" onClick={() => handleViewReceipt(payment)}>
                                        <Eye className="w-3 h-3 mr-1" />
                                        View Receipt
                                    </Button>
                                ) : (
                                    <Button variant="outline" size="sm" onClick={() => handleViewReceipt(payment)}>
                                        <FileText className="w-3 h-3 mr-1" />
                                        View Slip
                                    </Button>
                                )}
                            </div>
                        </div>
                        </div>
                    ))}
                    
                    {payments.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No payment history found.
                        </div>
                    )}
                    </div>
                </CardContent>
                </Card>

                {/* Right Column: Bank Details & Action (1/3 width) */}
                <div className="space-y-6">
                    <Card className="bg-blue-950 text-white border-none shadow-lg overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Landmark className="w-32 h-32" />
                        </div>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-blue-100">
                                <Building2 className="w-5 h-5" />
                                School Bank Details
                            </CardTitle>
                            <CardDescription className="text-blue-300">
                                Transfer fees directly to this account
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 relative z-10">
                            <div className="space-y-1">
                                <p className="text-xs text-blue-300 uppercase tracking-wider">Bank Name</p>
                                <p className="text-lg font-bold">Zenith Bank Plc</p>
                            </div>
                            
                            <div className="space-y-1">
                                <p className="text-xs text-blue-300 uppercase tracking-wider">Account Number</p>
                                <div className="flex items-center justify-between bg-blue-900/50 p-3 rounded border border-blue-800">
                                    <span className="text-2xl font-mono font-bold tracking-widest">1011223344</span>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8 text-blue-300 hover:text-white hover:bg-blue-800"
                                        onClick={() => copyToClipboard('1011223344')}
                                    >
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <p className="text-xs text-blue-300 uppercase tracking-wider">Account Name</p>
                                <p className="text-sm font-medium leading-tight">Bishop Felix Owolabi Int'l Academy</p>
                            </div>

                            <div className="pt-4">
                                <Button 
                                    className="w-full bg-white text-blue-950 hover:bg-blue-50 font-bold"
                                    onClick={() => setShowSubmitProofDialog(true)}
                                >
                                    <Send className="w-4 h-4 mr-2" />
                                    Submit Payment Info
                                </Button>
                                <p className="text-center text-[10px] text-blue-300 mt-2">
                                    Click above after making a transfer to notify the bursary.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                            Please ensure you use the student's name as the transfer remark/description.
                        </AlertDescription>
                    </Alert>
                </div>
            </div>
        </TabsContent>
      </Tabs>

      {/* Submit Payment Proof Dialog */}
      <Dialog open={showSubmitProofDialog} onOpenChange={setShowSubmitProofDialog}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Submit Payment Proof</DialogTitle>
                <DialogDescription>
                    Fill in the details of the transfer you made to the school account.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
                <div className="space-y-2">
                    <Label htmlFor="student-name">Student Name</Label>
                    <Input id="student-name" value={selectedChild?.name || ''} disabled className="bg-gray-50" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="amount">Amount Sent (₦)</Label>
                    <Input 
                        id="amount" 
                        placeholder="e.g. 50,000" 
                        value={proofAmount}
                        onChange={(e) => setProofAmount(e.target.value)}
                        type="number"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="sender">Account Name (Sender)</Label>
                    <Input 
                        id="sender" 
                        placeholder="Name of the account money was sent from" 
                        value={proofSenderName}
                        onChange={(e) => setProofSenderName(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="date">Date of Transfer</Label>
                    <Input 
                        id="date" 
                        type="date"
                        value={proofDate}
                        onChange={(e) => setProofDate(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label className="block mb-2">Payment For (Select all that apply)</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {PAYMENT_PURPOSES.map((purpose) => (
                            <div key={purpose} className="flex items-center space-x-2">
                                <Checkbox 
                                    id={`purpose-${purpose}`} 
                                    checked={selectedPurposes.includes(purpose)}
                                    onCheckedChange={() => togglePurpose(purpose)}
                                />
                                <Label 
                                    htmlFor={`purpose-${purpose}`} 
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                    {purpose}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

                {selectedPurposes.includes('Other') && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                        <Label htmlFor="other-purpose">Specify Other Purpose</Label>
                        <Textarea 
                            id="other-purpose" 
                            placeholder="Please specify what this payment is for..." 
                            value={otherPurposeText}
                            onChange={(e) => setOtherPurposeText(e.target.value)}
                            rows={2}
                        />
                    </div>
                )}
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setShowSubmitProofDialog(false)}>Cancel</Button>
                <Button onClick={handleSubmitProof} className="bg-blue-600 hover:bg-blue-700">
                    <Send className="w-4 h-4 mr-2" />
                    Notify Admin
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog (For online payment) */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Online Payment</DialogTitle>
            <DialogDescription>
              Make a secure payment for {selectedChild?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-900">Amount to Pay:</span>
                <span className="text-2xl font-bold text-blue-950">
                  ₦{amountToPay.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-blue-700">First Term 2024/2025 - {selectedChild?.name}</p>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Payment Method:</Label>
              <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                <div className="space-y-3">
                  <div
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer ${
                      selectedPaymentMethod === 'card'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedPaymentMethod('card')}
                  >
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        <span className="font-medium">Debit/Credit Card</span>
                      </div>
                      <p className="text-xs text-gray-600">Visa, Mastercard, Verve</p>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handlePayment}>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Proceed to Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Receipt Dialog */}
      <Dialog open={showReceiptDialog} onOpenChange={setShowReceiptDialog}>
        <DialogContent className="sm:max-w-[700px] bg-white p-0 overflow-hidden flex flex-col max-h-[90vh]">
          <DialogHeader className="sr-only">
            <DialogTitle>School Fees Receipt</DialogTitle>
            <DialogDescription>
              Detailed receipt for school fees payment
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 md:p-8 overflow-y-auto flex-1" id="school-receipt">
            {/* 1. Header Section - Same as Report Card */}
            <div className="border border-blue-950 p-2 mb-4">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
                {/* School Logo */}
                <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center flex-shrink-0">
                  <img
                    src={schoolLogo}
                    alt="BFOIA Logo"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* School Info */}
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
                    {selectedReceipt?.status === 'pending' 
                        ? 'TEMPORARY PAYMENT SLIP' 
                        : (selectedReceipt?.isOfficial ? 'OFFICIAL SCHOOL FEES RECEIPT' : 'PAYMENT RECEIPT')}
                </h2>
                <p className="text-sm font-semibold text-gray-500 mt-1">
                    First Term 2024/2025 Session
                </p>
                {selectedReceipt?.status === 'pending' && (
                    <div className="mt-2 inline-block bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded font-medium border border-amber-200">
                        PENDING VERIFICATION
                    </div>
                )}
            </div>

            {/* 2. Student Details Section */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 mb-6 text-sm">
                <div className="flex border-b border-gray-200 pb-1">
                    <span className="font-semibold text-gray-600 w-24">Name:</span>
                    <span className="font-bold text-gray-900 flex-1">{selectedChild?.name}</span>
                </div>
                <div className="flex border-b border-gray-200 pb-1">
                    <span className="font-semibold text-gray-600 w-24">Receipt No:</span>
                    <span className="font-mono text-gray-900 flex-1">{selectedReceipt?.reference}</span>
                </div>
                <div className="flex border-b border-gray-200 pb-1">
                    <span className="font-semibold text-gray-600 w-24">Class:</span>
                    <span className="font-bold text-gray-900 flex-1">{selectedChild?.class}</span>
                </div>
                <div className="flex border-b border-gray-200 pb-1">
                    <span className="font-semibold text-gray-600 w-24">Date:</span>
                    <span className="font-medium text-gray-900 flex-1">{selectedReceipt?.date}</span>
                </div>
            </div>

            {/* 3. Details Table */}
            <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-700 uppercase mb-2 border-b-2 border-gray-300 pb-1 inline-block">
                    {selectedReceipt?.isOfficial ? 'Statement of Account' : 'Payment Details'}
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
                            {selectedReceipt?.isOfficial ? (
                                // Render Full Statement of Account for Official Receipt
                                <>
                                    {feeBreakdown.map((item, idx) => (
                                        <tr key={idx} className="bg-white">
                                            <td className="p-2 border-r border-gray-200">{item.item}</td>
                                            <td className="p-2 text-right text-gray-700">{item.amount.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </>
                            ) : (
                                // Render Single Payment Item
                                <tr className="bg-white">
                                    <td className="p-2 border-r border-gray-200">{selectedReceipt?.description}</td>
                                    <td className="p-2 text-right text-gray-700">{selectedReceipt?.amount.toLocaleString()}</td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot className="bg-blue-50 border-t-2 border-blue-200">
                             <tr>
                                <td className="p-3 text-right font-bold text-blue-900 border-r border-blue-200 uppercase">
                                    {selectedReceipt?.isOfficial ? 'Grand Total' : 'Total Paid'}
                                </td>
                                <td className="p-3 text-right font-bold text-blue-900 text-base">
                                    ₦{selectedReceipt?.amount.toLocaleString()}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                
                {/* Payment Status Badge */}
                <div className="mt-4 flex justify-end">
                    <div className={`border-2 font-bold px-4 py-1 rounded uppercase text-sm transform -rotate-2 ${
                        selectedReceipt?.status === 'pending' 
                        ? 'border-amber-500 text-amber-600'
                        : 'border-green-600 text-green-700'
                    }`}>
                        {selectedReceipt?.status === 'pending' 
                            ? 'AWAITING CONFIRMATION' 
                            : (selectedReceipt?.isOfficial ? 'PAID IN FULL' : 'PAYMENT CONFIRMED')}
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
                         {/* Mock Signature Line - Only show if confirmed */}
                         {selectedReceipt?.status === 'confirmed' && (
                             <div className="font-script text-2xl text-blue-900">Administrator</div>
                         )}
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
             {selectedReceipt?.status === 'confirmed' && (
                 <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleDownloadReceipt}>
                    <Download className="w-4 h-4 mr-2" />
                    Download Receipt PDF
                 </Button>
             )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};