import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Download,
  CreditCard,
  Receipt,
  Calendar,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { StudentAPI } from '../../../utils/api';

interface FeeData {
  total_amount: number;
  amount_paid: number;
  balance: number;
  payment_status: 'pending' | 'partial' | 'paid' | 'overdue' | 'none';
}

interface Payment {
  id: string;
  term: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  paymentDate?: string;
  status: 'paid' | 'pending' | 'overdue';
  receiptNumber?: string;
}

export const FinancialOverview: React.FC = () => {
  // API States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feeData, setFeeData] = useState<FeeData | null>(null);

  // Mock payment history (until we have payment history API)
  const [payments] = useState<Payment[]>([]);

  const fetchFeeBalance = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await StudentAPI.getFeeBalance();

      if (response.status === 'success') {
        setFeeData(response.data as FeeData);
      } else {
        setError(response.error || response.message || 'Failed to load fee data');
      }
    } catch (err: any) {
      console.error('Error fetching fee balance:', err);
      setError(err.message || 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeBalance();
  }, []);

  const currentBalance = feeData?.balance || 0;
  const totalAmount = feeData?.total_amount || 0;
  const amountPaid = feeData?.amount_paid || 0;
  const paymentStatus = feeData?.payment_status || 'none';
  const totalPaid = payments.reduce((sum, p) => sum + p.paidAmount, 0);

  const getStatusColor = () => {
    if (paymentStatus === 'paid' || currentBalance === 0) return 'from-green-50 to-green-100 border-green-200';
    if (paymentStatus === 'partial') return 'from-amber-50 to-amber-100 border-amber-200';
    if (paymentStatus === 'overdue') return 'from-red-50 to-red-100 border-red-200';
    return 'from-gray-50 to-gray-100 border-gray-200';
  };

  const getStatusText = () => {
    if (paymentStatus === 'paid' || currentBalance === 0) return { text: 'Paid in Full', icon: CheckCircle2, color: 'text-green-700' };
    if (paymentStatus === 'partial') return { text: 'Partial Payment', icon: AlertCircle, color: 'text-amber-700' };
    if (paymentStatus === 'overdue') return { text: 'Overdue', icon: AlertCircle, color: 'text-red-700' };
    if (paymentStatus === 'none') return { text: 'No Bill Yet', icon: Calendar, color: 'text-gray-700' };
    return { text: 'Pending', icon: Calendar, color: 'text-blue-700' };
  };

  const status = getStatusText();
  const StatusIcon = status.icon;

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl mb-2 text-blue-950">Financial Overview</h1>
          <p className="text-sm sm:text-base text-gray-600">Fee status and payment history</p>
        </div>
        <Button variant="outline" onClick={fetchFeeBalance} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Loading fee information...</p>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700">{error}</span>
            <Button variant="outline" size="sm" onClick={fetchFeeBalance} className="ml-auto">
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Status Cards */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className={`bg-gradient-to-br ${getStatusColor()}`}>
            <CardHeader>
              <CardDescription className={status.color}>Current Status</CardDescription>
              <CardTitle className={`text-2xl flex items-center gap-2 ${status.color}`}>
                <StatusIcon className="w-6 h-6" />
                {status.text}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-sm ${status.color}`}>
                {currentBalance === 0 ? 'No outstanding balance' : `₦${currentBalance.toLocaleString()} outstanding`}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader>
              <CardDescription className="text-blue-700">Total Paid (Session)</CardDescription>
              <CardTitle className="text-2xl text-blue-950">
                ₦{amountPaid.toLocaleString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-700">Academic year 2024/2025</p>
            </CardContent>
          </Card>

          <Card className={`bg-gradient-to-br ${currentBalance > 0 ? 'from-red-50 to-red-100 border-red-200' : 'from-purple-50 to-purple-100 border-purple-200'}`}>
            <CardHeader>
              <CardDescription className={currentBalance > 0 ? 'text-red-700' : 'text-purple-700'}>
                Outstanding Balance
              </CardDescription>
              <CardTitle className={`text-2xl ${currentBalance > 0 ? 'text-red-950' : 'text-purple-950'}`}>
                ₦{currentBalance.toLocaleString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-sm ${currentBalance > 0 ? 'text-red-700' : 'text-purple-700'}`}>
                {currentBalance > 0 ? 'Please pay before deadline' : 'No pending payments'}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Progress Bar for Partial Payments */}
      {!loading && totalAmount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Progress</CardTitle>
            <CardDescription>Term fee payment status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Paid: ₦{amountPaid.toLocaleString()}</span>
                <span>Total: ₦{totalAmount.toLocaleString()}</span>
              </div>
              <Progress value={(amountPaid / totalAmount) * 100} className="h-3" />
              <p className="text-sm text-gray-500 text-center">
                {((amountPaid / totalAmount) * 100).toFixed(0)}% Complete
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment History */}
      {!loading && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-5" />
              Payment History
            </CardTitle>
            <CardDescription>All fee payments and receipts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="p-4 rounded-lg border border-gray-200 bg-white hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{payment.term}</h4>
                        <Badge className="bg-green-600 text-white">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Paid
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-600">Amount:</p>
                          <p className="font-semibold">₦{payment.amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Payment Date:</p>
                          <p className="font-semibold">{payment.paymentDate}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-gray-600">Receipt Number:</p>
                          <p className="font-mono text-sm">{payment.receiptNumber}</p>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-3 h-3 mr-1" />
                      Receipt
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-950">
            <CreditCard className="w-5 h-5" />
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-blue-800 mb-3">
            While parents handle fee payments, you can view your status here to stay informed.
            If you notice any discrepancies, please inform your parents or guardian.
          </p>
          <div className="bg-white border border-blue-300 rounded-lg p-3">
            <p className="text-xs text-gray-700">
              <strong>Note:</strong> Students with outstanding fees may be restricted from writing
              exams or collecting report cards. Please ensure all fees are paid before the deadline.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
