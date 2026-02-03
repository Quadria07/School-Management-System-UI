import React, { useState } from 'react';
import {
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Download,
  CreditCard,
  Receipt,
  Calendar,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

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
  const [payments] = useState<Payment[]>([
    {
      id: '1',
      term: 'First Term 2024/2025',
      amount: 150000,
      paidAmount: 150000,
      dueDate: 'Sep 15, 2024',
      paymentDate: 'Sep 10, 2024',
      status: 'paid',
      receiptNumber: 'RCT-2024-001523',
    },
    {
      id: '2',
      term: 'Third Term 2023/2024',
      amount: 145000,
      paidAmount: 145000,
      dueDate: 'Apr 20, 2024',
      paymentDate: 'Apr 18, 2024',
      status: 'paid',
      receiptNumber: 'RCT-2024-000892',
    },
    {
      id: '3',
      term: 'Second Term 2023/2024',
      amount: 145000,
      paidAmount: 145000,
      dueDate: 'Jan 15, 2024',
      paymentDate: 'Jan 12, 2024',
      status: 'paid',
      receiptNumber: 'RCT-2024-000341',
    },
  ]);

  const currentBalance = 0;
  const totalPaid = payments.reduce((sum, p) => sum + p.paidAmount, 0);

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl mb-2 text-blue-950">Financial Overview</h1>
        <p className="text-sm sm:text-base text-gray-600">Fee status and payment history</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader>
            <CardDescription className="text-green-700">Current Status</CardDescription>
            <CardTitle className="text-2xl text-green-950 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6" />
              Paid in Full
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-green-700">No outstanding balance</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader>
            <CardDescription className="text-blue-700">Total Paid (Session)</CardDescription>
            <CardTitle className="text-2xl text-blue-950">
              ₦{totalPaid.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-700">Academic year 2024/2025</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader>
            <CardDescription className="text-purple-700">Outstanding Balance</CardDescription>
            <CardTitle className="text-2xl text-purple-950">
              ₦{currentBalance.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-purple-700">No pending payments</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
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
