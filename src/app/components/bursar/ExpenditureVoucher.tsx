import React, { useState } from 'react';
import {
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  XCircle,
  Filter,
  Search,
  Eye,
  Download,
  AlertCircle,
  Plus,
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
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';

interface FundRequest {
  id: string;
  requestedBy: string;
  department: string;
  amount: number;
  category: string;
  description: string;
  dateRequested: string;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  voucherNumber?: string;
  budgetAllocation?: number;
}

interface PaymentVoucher {
  id: string;
  voucherNumber: string;
  vendor: string;
  amount: number;
  category: string;
  description: string;
  dateCreated: string;
  datePaid: string;
  paymentMethod: string;
  receiptAttached: boolean;
  approvedBy: string;
}

export const ExpenditureVoucher: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'requests' | 'vouchers'>('requests');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateVoucherDialog, setShowCreateVoucherDialog] = useState(false);
  const [showViewVoucherDialog, setShowViewVoucherDialog] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<PaymentVoucher | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'paid'>('all');

  // Form states
  const [voucherVendor, setVoucherVendor] = useState('');
  const [voucherAmount, setVoucherAmount] = useState('');
  const [voucherCategory, setVoucherCategory] = useState('');
  const [voucherDescription, setVoucherDescription] = useState('');
  const [voucherPaymentMethod, setVoucherPaymentMethod] = useState('bank');

  const [fundRequests] = useState<FundRequest[]>([
    {
      id: '1',
      requestedBy: 'Mr. Adeyemi (Science HOD)',
      department: 'Science Department',
      amount: 85000,
      category: 'Equipment',
      description: 'Laboratory equipment purchase - Microscopes and beakers',
      dateRequested: 'Dec 28, 2025',
      status: 'pending',
      budgetAllocation: 150000,
    },
    {
      id: '2',
      requestedBy: 'Maintenance Manager',
      department: 'Facilities',
      amount: 45000,
      category: 'Utilities',
      description: 'Diesel for backup generator - January supply',
      dateRequested: 'Jan 1, 2026',
      status: 'approved',
      budgetAllocation: 200000,
    },
    {
      id: '3',
      requestedBy: 'Principal',
      department: 'Administration',
      amount: 120000,
      category: 'Administrative',
      description: 'Office supplies and stationery for new term',
      dateRequested: 'Dec 30, 2025',
      status: 'paid',
      voucherNumber: 'PV-2025-00232',
      budgetAllocation: 300000,
    },
    {
      id: '4',
      requestedBy: 'ICT Coordinator',
      department: 'ICT Department',
      amount: 250000,
      category: 'Technology',
      description: 'Printer cartridges and computer accessories',
      dateRequested: 'Dec 20, 2025',
      status: 'rejected',
      budgetAllocation: 400000,
    },
  ]);

  const [paymentVouchers] = useState<PaymentVoucher[]>([
    {
      id: '1',
      voucherNumber: 'PV-2025-00234',
      vendor: 'Scientific Equipment Ltd',
      amount: 85000,
      category: 'Equipment',
      description: 'Science Lab Equipment Purchase',
      dateCreated: 'Jan 2, 2026',
      datePaid: 'Jan 2, 2026',
      paymentMethod: 'Bank Transfer',
      receiptAttached: true,
      approvedBy: 'Principal',
    },
    {
      id: '2',
      voucherNumber: 'PV-2025-00233',
      vendor: 'Diesel Depot Nigeria',
      amount: 45000,
      category: 'Utilities',
      description: 'Diesel for Generator',
      dateCreated: 'Jan 2, 2026',
      datePaid: 'Jan 2, 2026',
      paymentMethod: 'Cash',
      receiptAttached: true,
      approvedBy: 'Bursar',
    },
    {
      id: '3',
      voucherNumber: 'PV-2025-00232',
      vendor: 'Office Mart Nigeria',
      amount: 120000,
      category: 'Administrative',
      description: 'Office Supplies & Stationery',
      dateCreated: 'Jan 1, 2026',
      datePaid: 'Jan 1, 2026',
      paymentMethod: 'Bank Transfer',
      receiptAttached: true,
      approvedBy: 'Principal',
    },
  ]);

  const budgetCategories = [
    { name: 'Equipment', allocated: 150000, spent: 85000 },
    { name: 'Utilities', allocated: 200000, spent: 45000 },
    { name: 'Administrative', allocated: 300000, spent: 120000 },
    { name: 'Technology', allocated: 400000, spent: 0 },
    { name: 'Maintenance', allocated: 180000, spent: 95000 },
  ];

  const filteredRequests = fundRequests.filter((request) => {
    const matchesSearch =
      request.requestedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === 'all' || request.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const handleApproveRequest = (request: FundRequest) => {
    toast.success(`Fund request approved for ${request.requestedBy}`);
  };

  const handleRejectRequest = (request: FundRequest) => {
    toast.error(`Fund request rejected for ${request.requestedBy}`);
  };

  const handleCreateVoucher = () => {
    if (!voucherVendor || !voucherAmount || !voucherCategory || !voucherDescription) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success(`Payment voucher created successfully! Voucher No: PV-2026-00${Math.floor(Math.random() * 1000)}`);
    setShowCreateVoucherDialog(false);
    // Reset form
    setVoucherVendor('');
    setVoucherAmount('');
    setVoucherCategory('');
    setVoucherDescription('');
    setVoucherPaymentMethod('bank');
  };

  const handleViewVoucher = (voucher: PaymentVoucher) => {
    setSelectedVoucher(voucher);
    setShowViewVoucherDialog(true);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl mb-2 text-blue-950">
            Expenditure & Voucher System
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Manage outflow and ensure every naira spent is authorized
          </p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
          onClick={() => setShowCreateVoucherDialog(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Expense Voucher
        </Button>
      </div>

      {/* Budget Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Allocation Overview</CardTitle>
          <CardDescription>Category-wise budget tracking for current term</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {budgetCategories.map((category, idx) => {
              const percentage = (category.spent / category.allocated) * 100;
              const remaining = category.allocated - category.spent;
              return (
                <div key={idx} className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{category.name}</h4>
                    <Badge variant="outline">
                      {percentage.toFixed(1)}% Used
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm mb-2">
                    <div>
                      <p className="text-gray-600">Allocated:</p>
                      <p className="font-semibold">₦{category.allocated.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Spent:</p>
                      <p className="font-semibold text-red-700">₦{category.spent.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Remaining:</p>
                      <p className="font-semibold text-green-700">₦{remaining.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        percentage > 80 ? 'bg-red-600' : percentage > 60 ? 'bg-amber-600' : 'bg-green-600'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search requests by requester, category, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={(val: any) => setFilterStatus(val)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Requests</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(val: any) => setActiveTab(val)}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="requests">
            Fund Requests ({fundRequests.length})
          </TabsTrigger>
          <TabsTrigger value="vouchers">
            Payment Vouchers ({paymentVouchers.length})
          </TabsTrigger>
        </TabsList>

        {/* Fund Requests Tab */}
        <TabsContent value="requests" className="space-y-4 mt-6">
          {filteredRequests.map((request) => (
            <Card key={request.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge
                        className={
                          request.status === 'pending'
                            ? 'bg-amber-600 text-white'
                            : request.status === 'approved'
                            ? 'bg-blue-600 text-white'
                            : request.status === 'paid'
                            ? 'bg-green-600 text-white'
                            : 'bg-red-600 text-white'
                        }
                      >
                        {request.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                        {request.status === 'approved' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {request.status === 'paid' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {request.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                        {request.status.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">{request.category}</Badge>
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{request.description}</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Requested by: <span className="font-medium">{request.requestedBy}</span> • {request.department}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-gray-600">Amount:</p>
                        <p className="font-semibold text-lg text-red-700">₦{request.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Budget Allocated:</p>
                        <p className="font-medium">₦{request.budgetAllocation?.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Date Requested:</p>
                        <p className="font-medium">{request.dateRequested}</p>
                      </div>
                      {request.voucherNumber && (
                        <div>
                          <p className="text-gray-600">Voucher No:</p>
                          <p className="font-mono text-xs">{request.voucherNumber}</p>
                        </div>
                      )}
                    </div>
                    {request.status === 'pending' && (
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApproveRequest(request)}
                        >
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-300 text-red-700 hover:bg-red-50"
                          onClick={() => handleRejectRequest(request)}
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Payment Vouchers Tab */}
        <TabsContent value="vouchers" className="space-y-4 mt-6">
          {paymentVouchers.map((voucher) => (
            <Card key={voucher.id} className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-green-600 text-white">
                        <FileText className="w-3 h-3 mr-1" />
                        {voucher.voucherNumber}
                      </Badge>
                      <Badge variant="outline">{voucher.category}</Badge>
                      {voucher.receiptAttached && (
                        <Badge className="bg-blue-600 text-white">
                          <Upload className="w-3 h-3 mr-1" />
                          Receipt Attached
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{voucher.description}</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Vendor: <span className="font-medium">{voucher.vendor}</span>
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-gray-600">Amount:</p>
                        <p className="font-semibold text-lg text-red-700">₦{voucher.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Payment Method:</p>
                        <p className="font-medium">{voucher.paymentMethod}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Date Paid:</p>
                        <p className="font-medium">{voucher.datePaid}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Approved By:</p>
                        <p className="font-medium">{voucher.approvedBy}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewVoucher(voucher)}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Create Voucher Dialog */}
      <Dialog open={showCreateVoucherDialog} onOpenChange={setShowCreateVoucherDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Expense Voucher</DialogTitle>
            <DialogDescription>
              Record payment details and attach physical receipt
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Vendor/Supplier Name:</Label>
                <Input
                  placeholder="e.g., Office Mart Nigeria"
                  value={voucherVendor}
                  onChange={(e) => setVoucherVendor(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">Amount (₦):</Label>
                <Input
                  type="number"
                  placeholder="e.g., 85000"
                  value={voucherAmount}
                  onChange={(e) => setVoucherAmount(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Category:</Label>
                <Select value={voucherCategory} onValueChange={setVoucherCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Equipment">Equipment</SelectItem>
                    <SelectItem value="Utilities">Utilities</SelectItem>
                    <SelectItem value="Administrative">Administrative</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">Payment Method:</Label>
                <Select value={voucherPaymentMethod} onValueChange={setVoucherPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Description:</Label>
              <Textarea
                placeholder="Detailed description of the expense"
                rows={3}
                value={voucherDescription}
                onChange={(e) => setVoucherDescription(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Upload Receipt/Invoice:</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 5MB)</p>
              </div>
            </div>
            <Alert className="border-amber-200 bg-amber-50">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800 text-xs">
                <strong>Audit Requirement:</strong> Physical receipt must be uploaded within 24 hours.
                Voucher cannot be edited once created - only voided with documented reason.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateVoucherDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleCreateVoucher}>
              <FileText className="w-4 h-4 mr-2" />
              Create Voucher
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Voucher Dialog */}
      <Dialog open={showViewVoucherDialog} onOpenChange={setShowViewVoucherDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Payment Voucher Details</DialogTitle>
            <DialogDescription>Complete voucher information and audit trail</DialogDescription>
          </DialogHeader>
          {selectedVoucher && (
            <div className="border-2 border-blue-600 rounded-lg p-6 bg-white">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-blue-950">
                  Bishop Felix Owolabi International Academy
                </h2>
                <p className="text-sm text-gray-600">Payment Voucher</p>
                <p className="text-lg font-bold mt-2">{selectedVoucher.voucherNumber}</p>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">Vendor:</p>
                    <p className="font-medium">{selectedVoucher.vendor}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Amount:</p>
                    <p className="font-bold text-lg text-red-700">₦{selectedVoucher.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Category:</p>
                    <p className="font-medium">{selectedVoucher.category}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Payment Method:</p>
                    <p className="font-medium">{selectedVoucher.paymentMethod}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-600">Description:</p>
                    <p className="font-medium">{selectedVoucher.description}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Date Created:</p>
                    <p className="font-medium">{selectedVoucher.dateCreated}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Date Paid:</p>
                    <p className="font-medium">{selectedVoucher.datePaid}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Approved By:</p>
                    <p className="font-medium">{selectedVoucher.approvedBy}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Receipt Status:</p>
                    <p className="font-medium text-green-700">
                      {selectedVoucher.receiptAttached ? '✓ Attached' : '✗ Not Attached'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-center text-xs text-gray-500 border-t pt-3 mt-4">
                <p>This is an official payment voucher. Non-editable once created.</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewVoucherDialog(false)}>
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
