import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  FileText,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  BookOpen,
  Shield,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import schoolLogo from 'figma:asset/05e5dcd127c3f9119091f655ee2db41390342c66.png';

interface FinancialReport {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
}

export const AuditReporting: React.FC = () => {
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [activeReport, setActiveReport] = useState<FinancialReport | null>(null);

  const financialReports: FinancialReport[] = [
    {
      id: '1',
      title: 'Income vs. Expenditure Report',
      description: 'Comprehensive profit/loss statement for selected period',
      icon: <BarChart3 className="w-8 h-8 text-blue-600" />,
      category: 'financial',
    },
    {
      id: '2',
      title: 'Daily Cash Book',
      description: 'Chronological log of all transactions for today',
      icon: <BookOpen className="w-8 h-8 text-green-600" />,
      category: 'cashbook',
    },
    {
      id: '3',
      title: 'Fee Collection Summary',
      description: 'Class-wise fee collection analysis with outstanding balances',
      icon: <Users className="w-8 h-8 text-purple-600" />,
      category: 'revenue',
    },
    {
      id: '4',
      title: 'Expenditure Breakdown',
      description: 'Category-wise expense analysis against budget',
      icon: <TrendingDown className="w-8 h-8 text-red-600" />,
      category: 'expense',
    },
    {
      id: '5',
      title: 'Tax & Pension Compliance',
      description: 'Statutory deductions summary for remittance',
      icon: <Shield className="w-8 h-8 text-amber-600" />,
      category: 'compliance',
    },
    {
      id: '6',
      title: 'Payroll Summary Report',
      description: 'Monthly staff salary disbursement records',
      icon: <DollarSign className="w-8 h-8 text-teal-600" />,
      category: 'payroll',
    },
    {
      id: '7',
      title: 'Student Ledger Report',
      description: 'Individual student payment history and balances',
      icon: <FileText className="w-8 h-8 text-indigo-600" />,
      category: 'revenue',
    },
    {
      id: '8',
      title: 'Bank Reconciliation',
      description: 'Compare bank statements with internal records',
      icon: <TrendingUp className="w-8 h-8 text-cyan-600" />,
      category: 'financial',
    },
  ];

  const termFinancialSummary = {
    totalIncome: 38250000,
    totalExpense: 12875000,
    netProfit: 25375000,
    profitMargin: 66.3,
  };

  const handleGenerateReport = (reportId: string) => {
    const report = financialReports.find((r) => r.id === reportId);
    if (report) {
      setActiveReport(report);
      setShowReportDialog(true);
      toast.success(`Generated ${report.title}`);
    }
  };

  const handleDownloadReport = (reportId: string) => {
    const report = financialReports.find((r) => r.id === reportId);
    toast.success(`Preparing ${report?.title} for download...`);
    setTimeout(() => {
        window.print();
    }, 500);
  };

  const renderReportContent = (reportId: string) => {
      switch (reportId) {
          case '1': // Income vs Expenditure
              return (
                <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-4 border-b">
                        <h3 className="font-bold text-center text-lg">PROFIT & LOSS STATEMENT</h3>
                        <p className="text-center text-sm text-gray-500">For the period ending {new Date().toLocaleDateString()}</p>
                    </div>
                    <div className="p-4 space-y-4">
                        <div>
                            <h4 className="font-semibold text-green-700 mb-2 border-b pb-1">REVENUE</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="text-gray-600">Tuition Fees</div>
                                <div className="text-right font-medium">₦25,400,000.00</div>
                                <div className="text-gray-600">Books & Uniforms</div>
                                <div className="text-right font-medium">₦8,500,000.00</div>
                                <div className="text-gray-600">Other Income</div>
                                <div className="text-right font-medium">₦4,350,000.00</div>
                                <div className="font-bold text-gray-800 pt-2">TOTAL REVENUE</div>
                                <div className="text-right font-bold text-green-700 pt-2 border-t">₦38,250,000.00</div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-red-700 mb-2 border-b pb-1">OPERATING EXPENSES</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="text-gray-600">Staff Salaries</div>
                                <div className="text-right font-medium">₦8,500,000.00</div>
                                <div className="text-gray-600">Utilities & Maintenance</div>
                                <div className="text-right font-medium">₦2,100,000.00</div>
                                <div className="text-gray-600">Admin & Supplies</div>
                                <div className="text-right font-medium">₦1,275,000.00</div>
                                <div className="text-gray-600">Tax & Pension</div>
                                <div className="text-right font-medium">₦1,000,000.00</div>
                                <div className="font-bold text-gray-800 pt-2">TOTAL EXPENSES</div>
                                <div className="text-right font-bold text-red-700 pt-2 border-t">₦12,875,000.00</div>
                            </div>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-md mt-4">
                             <div className="grid grid-cols-2 gap-2 text-lg">
                                <div className="font-bold text-blue-900">NET PROFIT / (LOSS)</div>
                                <div className="text-right font-bold text-blue-900">₦25,375,000.00</div>
                             </div>
                        </div>
                    </div>
                </div>
              );
          case '2': // Daily Cash Book
             return (
                 <div className="border rounded-lg overflow-hidden">
                     <div className="bg-gray-50 p-4 border-b text-center">
                         <h3 className="font-bold text-lg">DAILY CASH BOOK SUMMARY</h3>
                         <p className="text-sm text-gray-500">Date: {new Date().toLocaleDateString()}</p>
                     </div>
                     <div className="p-4">
                         <table className="w-full text-sm">
                             <thead>
                                 <tr className="border-b">
                                     <th className="text-left py-2">Item</th>
                                     <th className="text-right py-2">Amount</th>
                                 </tr>
                             </thead>
                             <tbody>
                                 <tr>
                                     <td className="py-2">Opening Balance</td>
                                     <td className="text-right font-mono">₦2,450,000.00</td>
                                 </tr>
                                 <tr>
                                     <td className="py-2 text-green-600">Total Inflow</td>
                                     <td className="text-right font-mono text-green-600">+ ₦363,000.00</td>
                                 </tr>
                                 <tr>
                                     <td className="py-2 text-red-600">Total Outflow</td>
                                     <td className="text-right font-mono text-red-600">- ₦130,000.00</td>
                                 </tr>
                                 <tr className="font-bold border-t">
                                     <td className="py-2">Closing Balance</td>
                                     <td className="text-right font-mono">₦2,683,000.00</td>
                                 </tr>
                             </tbody>
                         </table>
                         <div className="mt-4 text-xs text-gray-500">
                             * Full detailed log available in Cash Book section.
                         </div>
                     </div>
                 </div>
             );
          case '3': // Fee Collection
              return (
                  <div className="border rounded-lg overflow-hidden">
                      <div className="bg-purple-50 p-4 border-b text-center">
                          <h3 className="font-bold text-purple-900 text-lg">FEE COLLECTION ANALYSIS</h3>
                          <p className="text-sm text-purple-700">First Term 2024/2025</p>
                      </div>
                      <div className="p-4">
                          <div className="space-y-4">
                              <div className="grid grid-cols-3 gap-2 text-center text-sm font-medium">
                                  <div>Class</div>
                                  <div>Collected</div>
                                  <div>Outstanding</div>
                              </div>
                              <div className="grid grid-cols-3 gap-2 text-sm border-b pb-2">
                                  <div>JSS 1</div>
                                  <div className="text-green-600">85%</div>
                                  <div className="text-red-600">₦2.5M</div>
                              </div>
                              <div className="grid grid-cols-3 gap-2 text-sm border-b pb-2">
                                  <div>JSS 2</div>
                                  <div className="text-green-600">92%</div>
                                  <div className="text-red-600">₦1.2M</div>
                              </div>
                              <div className="grid grid-cols-3 gap-2 text-sm border-b pb-2">
                                  <div>JSS 3</div>
                                  <div className="text-green-600">78%</div>
                                  <div className="text-red-600">₦3.1M</div>
                              </div>
                              <div className="grid grid-cols-3 gap-2 text-sm pt-2 font-bold">
                                  <div>Total</div>
                                  <div className="text-green-700">84% Avg</div>
                                  <div className="text-red-700">₦6.8M</div>
                              </div>
                          </div>
                      </div>
                  </div>
              );
          case '4': // Expenditure Breakdown
              return (
                  <div className="border rounded-lg overflow-hidden">
                       <div className="bg-red-50 p-4 border-b text-center">
                          <h3 className="font-bold text-red-900 text-lg">EXPENDITURE BREAKDOWN</h3>
                          <p className="text-sm text-red-700">Categorical Analysis</p>
                      </div>
                      <div className="p-4">
                          <table className="w-full text-sm">
                              <thead className="bg-gray-100">
                                  <tr>
                                      <th className="text-left p-2">Category</th>
                                      <th className="text-right p-2">Amount</th>
                                      <th className="text-right p-2">%</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  <tr>
                                      <td className="p-2">Salaries</td>
                                      <td className="text-right p-2">₦8.5M</td>
                                      <td className="text-right p-2">66%</td>
                                  </tr>
                                  <tr>
                                      <td className="p-2">Maintenance</td>
                                      <td className="text-right p-2">₦2.1M</td>
                                      <td className="text-right p-2">16%</td>
                                  </tr>
                                  <tr>
                                      <td className="p-2">Admin</td>
                                      <td className="text-right p-2">₦1.2M</td>
                                      <td className="text-right p-2">10%</td>
                                  </tr>
                                  <tr>
                                      <td className="p-2">Others</td>
                                      <td className="text-right p-2">₦1.0M</td>
                                      <td className="text-right p-2">8%</td>
                                  </tr>
                              </tbody>
                          </table>
                      </div>
                  </div>
              );
          case '5': // Tax Compliance
              return (
                  <div className="border rounded-lg overflow-hidden">
                      <div className="bg-amber-50 p-4 border-b text-center">
                          <h3 className="font-bold text-amber-900 text-lg">STATUTORY REMITTANCE SCHEDULE</h3>
                          <p className="text-sm text-amber-700">Month: January 2026</p>
                      </div>
                      <div className="p-4">
                          <div className="space-y-4">
                              <div className="flex justify-between border-b pb-2">
                                  <span className="font-medium">PAYE Tax</span>
                                  <span className="font-bold">₦1,250,000.00</span>
                              </div>
                              <div className="flex justify-between border-b pb-2">
                                  <span className="font-medium">Pension (Employer)</span>
                                  <span className="font-bold">₦490,000.00</span>
                              </div>
                              <div className="flex justify-between border-b pb-2">
                                  <span className="font-medium">Pension (Employee)</span>
                                  <span className="font-bold">₦490,000.00</span>
                              </div>
                              <div className="flex justify-between pt-2 text-lg">
                                  <span className="font-bold">Total Remittance</span>
                                  <span className="font-bold text-amber-700">₦2,230,000.00</span>
                              </div>
                          </div>
                      </div>
                  </div>
              );
          case '6': // Payroll Summary
              return (
                  <div className="border rounded-lg overflow-hidden">
                      <div className="bg-teal-50 p-4 border-b text-center">
                          <h3 className="font-bold text-teal-900 text-lg">MONTHLY PAYROLL SUMMARY</h3>
                          <p className="text-sm text-teal-700">January 2026</p>
                      </div>
                      <div className="p-4">
                          <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-white p-3 border rounded shadow-sm">
                                    <p className="text-xs text-gray-500 uppercase">Total Staff</p>
                                    <p className="text-xl font-bold text-teal-900">45</p>
                                </div>
                                <div className="bg-white p-3 border rounded shadow-sm">
                                    <p className="text-xs text-gray-500 uppercase">Payment Date</p>
                                    <p className="text-xl font-bold text-teal-900">25th Jan</p>
                                </div>
                          </div>
                          <table className="w-full text-sm">
                              <thead>
                                  <tr className="bg-teal-100 text-teal-900">
                                      <th className="text-left p-2">Component</th>
                                      <th className="text-right p-2">Amount</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  <tr className="border-b">
                                      <td className="p-2">Basic Salary</td>
                                      <td className="text-right p-2">₦6,500,000.00</td>
                                  </tr>
                                  <tr className="border-b">
                                      <td className="p-2">Allowances</td>
                                      <td className="text-right p-2">₦2,000,000.00</td>
                                  </tr>
                                  <tr className="border-b font-semibold bg-gray-50">
                                      <td className="p-2">Gross Salary</td>
                                      <td className="text-right p-2">₦8,500,000.00</td>
                                  </tr>
                                  <tr className="border-b text-red-600">
                                      <td className="p-2">Deductions (Tax/Pension/Loan)</td>
                                      <td className="text-right p-2">(₦2,500,000.00)</td>
                                  </tr>
                                  <tr className="font-bold text-lg text-teal-900">
                                      <td className="p-2">Net Payable</td>
                                      <td className="text-right p-2">₦6,000,000.00</td>
                                  </tr>
                              </tbody>
                          </table>
                      </div>
                  </div>
              );
          case '7': // Student Ledger Report
              return (
                  <div className="border rounded-lg overflow-hidden">
                      <div className="bg-indigo-50 p-4 border-b text-center">
                          <h3 className="font-bold text-indigo-900 text-lg">STUDENT LEDGER SUMMARY</h3>
                          <p className="text-sm text-indigo-700">Outstanding Balances Report</p>
                      </div>
                      <div className="p-4">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="bg-green-50 p-3 rounded border border-green-200">
                                    <p className="text-xs text-green-700 uppercase">Fully Cleared</p>
                                    <p className="text-lg font-bold text-green-900">850 Students</p>
                                </div>
                                <div className="bg-red-50 p-3 rounded border border-red-200">
                                    <p className="text-xs text-red-700 uppercase">Debtors</p>
                                    <p className="text-lg font-bold text-red-900">150 Students</p>
                                </div>
                          </div>
                          <table className="w-full text-sm">
                              <thead>
                                  <tr className="bg-indigo-100 text-indigo-900">
                                      <th className="text-left p-2">Class</th>
                                      <th className="text-right p-2">Total Billed</th>
                                      <th className="text-right p-2">Total Paid</th>
                                      <th className="text-right p-2">Outstanding</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  <tr className="border-b">
                                      <td className="p-2 font-medium">JSS 1</td>
                                      <td className="text-right p-2">₦15.5M</td>
                                      <td className="text-right p-2">₦12.5M</td>
                                      <td className="text-right p-2 text-red-600">₦3.0M</td>
                                  </tr>
                                  <tr className="border-b">
                                      <td className="p-2 font-medium">JSS 2</td>
                                      <td className="text-right p-2">₦14.2M</td>
                                      <td className="text-right p-2">₦13.0M</td>
                                      <td className="text-right p-2 text-red-600">₦1.2M</td>
                                  </tr>
                                  <tr className="border-b">
                                      <td className="p-2 font-medium">JSS 3</td>
                                      <td className="text-right p-2">₦16.8M</td>
                                      <td className="text-right p-2">₦13.8M</td>
                                      <td className="text-right p-2 text-red-600">₦3.0M</td>
                                  </tr>
                                  <tr className="font-bold bg-indigo-50">
                                      <td className="p-2">Grand Total</td>
                                      <td className="text-right p-2">₦46.5M</td>
                                      <td className="text-right p-2">₦39.3M</td>
                                      <td className="text-right p-2 text-red-700">₦7.2M</td>
                                  </tr>
                              </tbody>
                          </table>
                      </div>
                  </div>
              );
          case '8': // Bank Reconciliation
              return (
                  <div className="border rounded-lg overflow-hidden">
                      <div className="bg-cyan-50 p-4 border-b text-center">
                          <h3 className="font-bold text-cyan-900 text-lg">BANK RECONCILIATION STATEMENT</h3>
                          <p className="text-sm text-cyan-700">As at: {new Date().toLocaleDateString()}</p>
                      </div>
                      <div className="p-4 text-sm space-y-3">
                          <div className="flex justify-between">
                              <span>Balance per Cash Book:</span>
                              <span className="font-mono">₦25,450,000.00</span>
                          </div>
                          <div className="flex justify-between text-green-600">
                              <span>Add: Unpresented Cheques</span>
                              <span className="font-mono">₦150,000.00</span>
                          </div>
                          <div className="flex justify-between text-red-600">
                              <span>Less: Uncredited Lodgements</span>
                              <span className="font-mono">(₦200,000.00)</span>
                          </div>
                          <div className="flex justify-between pt-2 border-t font-bold text-blue-900">
                              <span>Balance per Bank Statement:</span>
                              <span className="font-mono">₦25,400,000.00</span>
                          </div>
                      </div>
                  </div>
              );
          default:
              return (
                  <div className="p-8 text-center text-gray-500">
                      <p>Report data is being generated...</p>
                  </div>
              );
      }
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl mb-2 text-blue-950">
            Audit & Financial Reporting
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Prepare data for Proprietor and external auditors
          </p>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-3">
            <CardDescription className="text-green-700 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              Total Income
            </CardDescription>
            <CardTitle className="text-3xl text-green-950">
              ₦{(termFinancialSummary.totalIncome / 1000000).toFixed(2)}M
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-green-700">First Term 2024/2025</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="pb-3">
            <CardDescription className="text-red-700 flex items-center gap-1">
              <TrendingDown className="w-4 h-4" />
              Total Expense
            </CardDescription>
            <CardTitle className="text-3xl text-red-950">
              ₦{(termFinancialSummary.totalExpense / 1000000).toFixed(2)}M
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-700">Operating costs</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-3">
            <CardDescription className="text-blue-700 flex items-center gap-1">
              <BarChart3 className="w-4 h-4" />
              Net Profit
            </CardDescription>
            <CardTitle className="text-3xl text-blue-950">
              ₦{(termFinancialSummary.netProfit / 1000000).toFixed(2)}M
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-700">
              {termFinancialSummary.profitMargin.toFixed(1)}% margin
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-3">
            <CardDescription className="text-purple-700 flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Reporting Period
            </CardDescription>
            <CardTitle className="text-lg text-purple-950">First Term</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-purple-700">2024/2025 Session</p>
          </CardContent>
        </Card>
      </div>

      {/* Financial Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {financialReports.map((report) => (
            <Card
            key={report.id}
            className="hover:shadow-lg transition-shadow cursor-pointer border-2"
            >
            <CardContent className="p-6">
                <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-100 rounded-lg">{report.icon}</div>
                <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{report.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{report.description}</p>
                    <div className="flex gap-2">
                    <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleGenerateReport(report.id)}
                    >
                        <BarChart3 className="w-3 h-3 mr-1" />
                        Generate
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadReport(report.id)}
                    >
                        <Download className="w-3 h-3 mr-1" />
                        Download
                    </Button>
                    </div>
                </div>
                </div>
            </CardContent>
            </Card>
        ))}
      </div>

      {/* Generated Report Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {/* Header Section - Report Card Style */}
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

          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl text-blue-950">
              <FileText className="w-5 h-5" />
              {activeReport?.title}
            </DialogTitle>
            <DialogDescription>
              Report Generated on: {new Date().toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
             {activeReport && renderReportContent(activeReport.id)}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReportDialog(false)}>Close</Button>
            <Button onClick={() => window.print()}>
                <Download className="w-4 h-4 mr-2" />
                Print / Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};