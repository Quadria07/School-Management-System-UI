import React, { useState } from 'react';
import {
  Briefcase,
  Download,
  Send,
  CheckCircle2,
  FileText,
  Users,
  DollarSign,
  Clock,
  AlertCircle,
  Eye,
  Plus,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '../ui/alert';
import { SchoolReportHeader } from './SchoolReportHeader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface StaffPayroll {
  id: string;
  staffName: string;
  staffId: string;
  department: string;
  position: string;
  grossSalary: number;
  tax: number;
  pension: number;
  otherDeductions: number;
  netSalary: number;
  bankName: string;
  accountNumber: string;
  status: 'pending' | 'disbursed';
}

interface PayrollCycle {
  month: string;
  year: string;
  totalStaff: number;
  totalGross: number;
  totalDeductions: number;
  totalNet: number;
  status: 'draft' | 'approved' | 'disbursed';
  approvedBy?: string;
  approvedDate?: string;
  disbursedDate?: string;
}

export const PayrollFulfillment: React.FC = () => {
  const [showPayrollDetailsDialog, setShowPayrollDetailsDialog] = useState(false);
  const [showBankScheduleDialog, setShowBankScheduleDialog] = useState(false);
  const [showNewCycleDialog, setShowNewCycleDialog] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState<PayrollCycle | null>(null);

  const [currentPayrollCycle, setCurrentPayrollCycle] = useState<PayrollCycle>({
    month: 'January',
    year: '2026',
    totalStaff: 45,
    totalGross: 18750000,
    totalDeductions: 3125000,
    totalNet: 15625000,
    status: 'approved',
    approvedBy: 'Principal',
    approvedDate: 'Jan 1, 2026',
  });

  const [staffPayrolls] = useState<StaffPayroll[]>([
    {
      id: '1',
      staffName: 'Mr. Adeyemi Johnson',
      staffId: 'BFOIA/STAFF/2020/001',
      department: 'Mathematics',
      position: 'Senior Teacher',
      grossSalary: 450000,
      tax: 45000,
      pension: 36000,
      otherDeductions: 0,
      netSalary: 369000,
      bankName: 'First Bank',
      accountNumber: '3012345678',
      status: 'pending',
    },
    {
      id: '2',
      staffName: 'Mrs. Chiamaka Nwosu',
      staffId: 'BFOIA/STAFF/2019/015',
      department: 'English',
      position: 'Head of Department',
      grossSalary: 520000,
      tax: 52000,
      pension: 41600,
      otherDeductions: 5000,
      netSalary: 421400,
      bankName: 'GTBank',
      accountNumber: '0123456789',
      status: 'pending',
    },
    {
      id: '3',
      staffName: 'Mr. Ibrahim Musa',
      staffId: 'BFOIA/STAFF/2021/032',
      department: 'Science',
      position: 'Laboratory Technician',
      grossSalary: 280000,
      tax: 22400,
      pension: 22400,
      otherDeductions: 0,
      netSalary: 235200,
      bankName: 'Access Bank',
      accountNumber: '0987654321',
      status: 'pending',
    },
    {
      id: '4',
      staffName: 'Dr. Grace Adeola',
      staffId: 'BFOIA/STAFF/2018/008',
      department: 'Administration',
      position: 'Vice Principal',
      grossSalary: 750000,
      tax: 90000,
      pension: 60000,
      otherDeductions: 0,
      netSalary: 600000,
      bankName: 'Zenith Bank',
      accountNumber: '2012345678',
      status: 'pending',
    },
    {
      id: '5',
      staffName: 'Mr. Oluwaseun Bakare',
      staffId: 'BFOIA/STAFF/2022/045',
      department: 'ICT',
      position: 'Computer Instructor',
      grossSalary: 320000,
      tax: 28800,
      pension: 25600,
      otherDeductions: 10000,
      netSalary: 255600,
      bankName: 'UBA',
      accountNumber: '1234567890',
      status: 'pending',
    },
  ]);

  const [payrollHistory] = useState<PayrollCycle[]>([
    {
      month: 'December',
      year: '2025',
      totalStaff: 45,
      totalGross: 18750000,
      totalDeductions: 3125000,
      totalNet: 15625000,
      status: 'disbursed',
      approvedBy: 'Principal',
      approvedDate: 'Dec 1, 2025',
      disbursedDate: 'Dec 5, 2025',
    },
    {
      month: 'November',
      year: '2025',
      totalStaff: 44,
      totalGross: 18300000,
      totalDeductions: 3050000,
      totalNet: 15250000,
      status: 'disbursed',
      approvedBy: 'Principal',
      approvedDate: 'Nov 1, 2025',
      disbursedDate: 'Nov 5, 2025',
    },
  ]);

  const handleDownloadBankSchedule = () => {
    setShowBankScheduleDialog(true);
    toast.success('Bank schedule generated successfully!');
  };

  const handleMarkAsDisbursed = () => {
    setCurrentPayrollCycle({
        ...currentPayrollCycle,
        status: 'disbursed',
        disbursedDate: new Date().toLocaleDateString()
    });
    toast.success('Payroll marked as disbursed! Payslips will be published to staff dashboards.');
  };

  const handlePublishPayslips = () => {
    toast.success('Digital payslips sent to all staff dashboards!');
  };

  const handleViewPayrollDetails = (cycle: PayrollCycle) => {
    setSelectedCycle(cycle);
    setShowPayrollDetailsDialog(true);
  };

  const handleStartNewCycle = () => {
      setShowNewCycleDialog(false);
      toast.success("New Payroll Cycle Initialized", {
          description: "Staff data has been pulled from HR records."
      });
      // Logic to actually switch the cycle would go here
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl mb-2 text-blue-950">Payroll Fulfillment</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Execute staff salary payments based on HR records
          </p>
        </div>
        <Button className="bg-blue-600" onClick={() => setShowNewCycleDialog(true)}>
            <Plus className="w-4 h-4 mr-2" /> Start New Month
        </Button>
      </div>

      {/* Current Payroll Summary */}
      <Card className="border-2 border-blue-600 bg-gradient-to-br from-blue-50 to-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <DollarSign className="w-32 h-32 text-blue-900" />
        </div>
        <CardHeader>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Calendar className="w-6 h-6 text-blue-700" />
                {currentPayrollCycle.month} {currentPayrollCycle.year} Payroll
              </CardTitle>
              <CardDescription>Current month salary processing status</CardDescription>
            </div>
            <Badge className={`text-lg px-4 py-2 ${currentPayrollCycle.status === 'disbursed' ? 'bg-green-600' : 'bg-blue-600'} text-white`}>
              {currentPayrollCycle.status === 'disbursed' ? (
                  <CheckCircle2 className="w-5 h-5 mr-2" />
              ) : (
                  <Clock className="w-5 h-5 mr-2" />
              )}
              {currentPayrollCycle.status.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/80 backdrop-blur p-4 rounded-lg border border-blue-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-blue-600" />
                <p className="text-sm text-gray-600">Total Staff</p>
              </div>
              <p className="text-3xl font-bold text-blue-950">{currentPayrollCycle.totalStaff}</p>
            </div>
            <div className="bg-white/80 backdrop-blur p-4 rounded-lg border border-green-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <p className="text-sm text-gray-600">Gross Salary</p>
              </div>
              <p className="text-2xl font-bold text-green-950">
                ₦{(currentPayrollCycle.totalGross / 1000000).toFixed(2)}M
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur p-4 rounded-lg border border-red-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-sm text-gray-600">Total Deductions</p>
              </div>
              <p className="text-2xl font-bold text-red-950">
                ₦{(currentPayrollCycle.totalDeductions / 1000000).toFixed(2)}M
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur p-4 rounded-lg border border-purple-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-5 h-5 text-purple-600" />
                <p className="text-sm text-gray-600">Net Payable</p>
              </div>
              <p className="text-2xl font-bold text-purple-950">
                ₦{(currentPayrollCycle.totalNet / 1000000).toFixed(2)}M
              </p>
            </div>
          </div>

          {currentPayrollCycle.status === 'approved' && (
            <Alert className="border-blue-200 bg-blue-50/80 mb-4">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Payroll Approved by {currentPayrollCycle.approvedBy}</strong> on{' '}
                {currentPayrollCycle.approvedDate}. Ready for disbursement.
              </AlertDescription>
            </Alert>
          )}

          {currentPayrollCycle.status === 'disbursed' && (
             <Alert className="border-green-200 bg-green-50/80 mb-4">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Disbursed Successfully</strong> on {currentPayrollCycle.disbursedDate}.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-wrap gap-3">
            <Button
              className="bg-white text-blue-700 hover:bg-blue-50 border border-blue-200"
              onClick={handleDownloadBankSchedule}
            >
              <Download className="w-4 h-4 mr-2" />
              Download Bank Schedule
            </Button>
            {currentPayrollCycle.status !== 'disbursed' && (
                <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={handleMarkAsDisbursed}
                >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Mark as Disbursed
                </Button>
            )}
            <Button
              className="bg-purple-600 hover:bg-purple-700"
              onClick={handlePublishPayslips}
            >
              <Send className="w-4 h-4 mr-2" />
              Publish Payslips
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Staff Payroll Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Staff Payroll Breakdown
          </CardTitle>
          <CardDescription>
            Individual salary details for {currentPayrollCycle.month} {currentPayrollCycle.year}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left p-3 font-semibold">Staff Details</th>
                  <th className="text-right p-3 font-semibold">Gross Salary</th>
                  <th className="text-right p-3 font-semibold">Deductions</th>
                  <th className="text-right p-3 font-semibold">Net Salary</th>
                  <th className="text-left p-3 font-semibold">Bank Details</th>
                  <th className="text-center p-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {staffPayrolls.map((staff) => {
                  const totalDeductions = staff.tax + staff.pension + staff.otherDeductions;
                  return (
                    <tr
                      key={staff.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-3">
                        <div>
                          <p className="font-medium">{staff.staffName}</p>
                          <p className="text-sm text-gray-600">{staff.staffId}</p>
                          <p className="text-xs text-gray-500">
                            {staff.position} • {staff.department}
                          </p>
                        </div>
                      </td>
                      <td className="text-right p-3 font-semibold text-green-700">
                        ₦{staff.grossSalary.toLocaleString()}
                      </td>
                      <td className="text-right p-3">
                        <div className="text-sm">
                          <p className="text-red-700 font-semibold">
                            -₦{totalDeductions.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-600">
                            Tax: ₦{staff.tax.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-600">
                            Pension: ₦{staff.pension.toLocaleString()}
                          </p>
                          {staff.otherDeductions > 0 && (
                            <p className="text-xs text-gray-600">
                              Other: ₦{staff.otherDeductions.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="text-right p-3 font-bold text-lg text-blue-950">
                        ₦{staff.netSalary.toLocaleString()}
                      </td>
                      <td className="p-3">
                        <div className="text-sm">
                          <p className="font-medium">{staff.bankName}</p>
                          <p className="text-xs text-gray-600 font-mono">{staff.accountNumber}</p>
                        </div>
                      </td>
                      <td className="text-center p-3">
                        <Badge
                          className={
                            staff.status === 'pending'
                              ? 'bg-amber-600 text-white'
                              : 'bg-green-600 text-white'
                          }
                        >
                          {staff.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                          {staff.status === 'disbursed' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {staff.status.toUpperCase()}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Payroll History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Payroll History
          </CardTitle>
          <CardDescription>Previous months disbursement records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {payrollHistory.map((cycle, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow bg-gray-50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">
                        {cycle.month} {cycle.year}
                      </h3>
                      <Badge className="bg-green-600 text-white">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        {cycle.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-gray-600">Staff Count:</p>
                        <p className="font-semibold">{cycle.totalStaff}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total Gross:</p>
                        <p className="font-semibold text-green-700">
                          ₦{(cycle.totalGross / 1000000).toFixed(2)}M
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total Net:</p>
                        <p className="font-semibold text-blue-950">
                          ₦{(cycle.totalNet / 1000000).toFixed(2)}M
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Disbursed:</p>
                        <p className="font-medium text-xs">{cycle.disbursedDate}</p>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewPayrollDetails(cycle)}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* New Cycle Dialog */}
      <Dialog open={showNewCycleDialog} onOpenChange={setShowNewCycleDialog}>
          <DialogContent>
              <DialogHeader>
                  <SchoolReportHeader title="Initialize New Payroll Cycle" />
                  <DialogTitle className="sr-only">Initialize New Payroll Cycle</DialogTitle>
                  <DialogDescription>
                      Start processing payroll for the upcoming month.
                  </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                      <span className="text-right text-sm font-medium">Month</span>
                      <Select defaultValue="february">
                          <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select Month" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="february">February 2026</SelectItem>
                              <SelectItem value="march">March 2026</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                      <span className="text-right text-sm font-medium">Source</span>
                      <Select defaultValue="hr">
                          <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Data Source" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="hr">Live HR Database (Active Staff)</SelectItem>
                              <SelectItem value="previous">Copy Previous Month</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>
                  <Alert className="col-span-4 bg-blue-50 border-blue-200">
                      <AlertCircle className="w-4 h-4 text-blue-600" />
                      <AlertDescription className="text-xs text-blue-800">
                          This will pull the latest salary structures, tax configurations, and deduction rules from the HR module.
                      </AlertDescription>
                  </Alert>
              </div>
              <DialogFooter>
                  <Button variant="outline" onClick={() => setShowNewCycleDialog(false)}>Cancel</Button>
                  <Button onClick={handleStartNewCycle} className="bg-blue-600">
                      Initialize Cycle <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>

      {/* Bank Schedule Dialog */}
      <Dialog open={showBankScheduleDialog} onOpenChange={setShowBankScheduleDialog}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <SchoolReportHeader 
                title="Bank Payment Schedule" 
                subtitle={`For: ${currentPayrollCycle.month} ${currentPayrollCycle.year} Salaries`} 
            />
            <DialogTitle className="sr-only">Bank Schedule Export</DialogTitle>
            <div className="mt-4">
                <h3 className="font-semibold text-lg">Bank Schedule Export</h3>
                <DialogDescription>
                CSV/Excel format ready for corporate banking portal upload
                </DialogDescription>
            </div>
          </DialogHeader>
          <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
            <h3 className="font-semibold mb-3">Preview - First 5 Records</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="text-left p-2">Account Name</th>
                    <th className="text-left p-2">Account Number</th>
                    <th className="text-left p-2">Bank</th>
                    <th className="text-right p-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {staffPayrolls.slice(0, 5).map((staff) => (
                    <tr key={staff.id} className="border-b border-gray-200">
                      <td className="p-2">{staff.staffName}</td>
                      <td className="p-2 font-mono text-xs">{staff.accountNumber}</td>
                      <td className="p-2">{staff.bankName}</td>
                      <td className="text-right p-2 font-semibold">
                        ₦{staff.netSalary.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-600 mt-3">
              ... and {staffPayrolls.length - 5} more records
            </p>
          </div>
          <Alert className="border-blue-200 bg-blue-50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 text-xs">
              <strong>File Format:</strong> Compatible with First Bank, GTBank, Access Bank, Zenith,
              and UBA corporate banking portals. Contains Account Name, Account Number, Bank Code,
              and Amount fields.
            </AlertDescription>
          </Alert>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBankScheduleDialog(false)}>
              Close
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" />
              Download CSV
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              <Download className="w-4 h-4 mr-2" />
              Download Excel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payroll Details Dialog */}
      <Dialog open={showPayrollDetailsDialog} onOpenChange={setShowPayrollDetailsDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
             <SchoolReportHeader 
                title="Payroll Cycle Report" 
                subtitle={`${selectedCycle?.month} ${selectedCycle?.year} Summary`} 
            />
            <DialogTitle className="sr-only">Payroll Cycle Report</DialogTitle>
            <DialogDescription className="sr-only">Detailed summary of payroll cycle</DialogDescription>
          </DialogHeader>
          {selectedCycle && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-xs text-blue-700">Total Staff</p>
                  <p className="text-2xl font-bold text-blue-950">{selectedCycle.totalStaff}</p>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <p className="text-xs text-green-700">Gross Salary</p>
                  <p className="text-2xl font-bold text-green-950">
                    ₦{(selectedCycle.totalGross / 1000000).toFixed(2)}M
                  </p>
                </div>
                <div className="bg-red-50 p-3 rounded">
                  <p className="text-xs text-red-700">Deductions</p>
                  <p className="text-2xl font-bold text-red-950">
                    ₦{(selectedCycle.totalDeductions / 1000000).toFixed(2)}M
                  </p>
                </div>
                <div className="bg-purple-50 p-3 rounded">
                  <p className="text-xs text-purple-700">Net Paid</p>
                  <p className="text-2xl font-bold text-purple-950">
                    ₦{(selectedCycle.totalNet / 1000000).toFixed(2)}M
                  </p>
                </div>
              </div>
              <div className="border-t pt-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">Approved By:</p>
                    <p className="font-medium">{selectedCycle.approvedBy}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Approved Date:</p>
                    <p className="font-medium">{selectedCycle.approvedDate}</p>
                  </div>
                  {selectedCycle.disbursedDate && (
                    <div>
                      <p className="text-gray-600">Disbursed Date:</p>
                      <p className="font-medium">{selectedCycle.disbursedDate}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-600">Status:</p>
                    <Badge className="bg-green-600 text-white">
                      {selectedCycle.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPayrollDetailsDialog(false)}>
              Close
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <FileText className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};