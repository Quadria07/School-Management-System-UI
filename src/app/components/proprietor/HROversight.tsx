import React, { useState } from 'react';
import { PageHeader } from './PageHeader';
import { 
  Users, 
  DollarSign, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  FileText,
  Briefcase,
  ArrowRight,
  Clock,
  Calendar,
  Building2,
  MoreHorizontal,
  Search,
  Filter,
  Download,
  ChevronRight,
  Phone,
  Mail
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter
} from "../ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../ui/tabs";

// --- Mock Data ---

const kpiData = [
  { 
    label: "Total Headcount", 
    value: "72", 
    trend: "+3 this term", 
    trendUp: true,
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-50"
  },
  { 
    label: "Monthly Payroll", 
    value: "₦6.63M", 
    trend: "Due in 5 days", 
    trendUp: false, 
    icon: DollarSign,
    color: "text-green-600",
    bg: "bg-green-50"
  },
  { 
    label: "Avg. Attendance", 
    value: "96%", 
    trend: "+1.2% vs last mo", 
    trendUp: true,
    icon: Calendar,
    color: "text-purple-600",
    bg: "bg-purple-50"
  },
  { 
    label: "Pending Approvals", 
    value: "4", 
    trend: "Requires action", 
    trendUp: false, 
    icon: AlertCircle,
    color: "text-amber-600",
    bg: "bg-amber-50"
  }
];

const payrollHistory = [
  { month: 'Aug', payroll: 4.2, revenue: 12.5 },
  { month: 'Sep', payroll: 4.5, revenue: 15.2 },
  { month: 'Oct', payroll: 4.5, revenue: 14.8 },
  { month: 'Nov', payroll: 4.6, revenue: 15.0 },
  { month: 'Dec', payroll: 4.8, revenue: 11.5 },
  { month: 'Jan', payroll: 6.6, revenue: 18.2 },
];

const pendingActionsData = [
  {
    id: 1,
    type: 'Recruitment',
    title: 'Hire Senior Math Teacher',
    requester: 'Mrs. Sarah Johnson',
    requesterRole: 'Principal',
    details: 'Salary: ₦150,000/mo',
    date: '2 hours ago',
    avatar: 'SJ',
    fullDescription: 'Request to hire Mr. David Okon for the Senior Mathematics position. He has 8 years of experience and performed excellently in the interview.',
    financialImpact: '₦1.8M / year'
  },
  {
    id: 2,
    type: 'Expense',
    title: 'Staff Training Workshop',
    requester: 'HR Department',
    requesterRole: 'Human Resources',
    details: 'Cost: ₦250,000',
    date: 'Yesterday',
    avatar: 'HR',
    fullDescription: 'Two-day intensive workshop on "Modern Pedagogical Methods" for all academic staff. Includes materials and lunch.',
    financialImpact: '₦250,000 one-off'
  },
  {
    id: 3,
    type: 'Leave',
    title: 'Maternity Leave Approval',
    requester: 'Mrs. Adebayo',
    requesterRole: 'Vice Principal',
    details: 'Duration: 3 Months',
    date: '2 days ago',
    avatar: 'MA',
    fullDescription: 'Standard maternity leave request. Cover teacher has been arranged internally.',
    financialImpact: 'None (Paid Leave)'
  },
  {
    id: 4,
    type: 'Policy',
    title: 'New Grading Policy',
    requester: 'Academic Board',
    requesterRole: 'Committee',
    details: 'Requires Ratification',
    date: '3 days ago',
    avatar: 'AB',
    fullDescription: 'Proposal to change the CA/Exam weight ratio from 30/70 to 40/60 for Junior Secondary classes.',
    financialImpact: 'None'
  }
];

const departmentCosts = [
  { name: 'Sciences', amount: 1800000, staff: 12 },
  { name: 'Arts', amount: 1500000, staff: 10 },
  { name: 'Admin', amount: 1200000, staff: 8 },
  { name: 'Junior School', amount: 1100000, staff: 15 },
  { name: 'Support', amount: 960000, staff: 12 },
];

const staffList = [
  { id: 'ST001', name: 'Dr. John Doe', role: 'Principal', department: 'Management', status: 'Active', salary: 350000, joinDate: '2020-01-15', email: 'john.doe@school.edu', phone: '+234 801 234 5678' },
  { id: 'ST002', name: 'Mrs. Sarah Smith', role: 'Vice Principal', department: 'Management', status: 'Active', salary: 280000, joinDate: '2020-02-01', email: 'sarah.smith@school.edu', phone: '+234 802 345 6789' },
  { id: 'ST003', name: 'Mr. Michael Brown', role: 'Physics Teacher', department: 'Sciences', status: 'Active', salary: 150000, joinDate: '2021-05-10', email: 'm.brown@school.edu', phone: '+234 803 456 7890' },
  { id: 'ST004', name: 'Ms. Emily Davis', role: 'English Teacher', department: 'Arts', status: 'On Leave', salary: 145000, joinDate: '2021-09-01', email: 'e.davis@school.edu', phone: '+234 804 567 8901' },
  { id: 'ST005', name: 'Mr. David Wilson', role: 'Math Teacher', department: 'Sciences', status: 'Active', salary: 160000, joinDate: '2019-11-20', email: 'd.wilson@school.edu', phone: '+234 805 678 9012' },
  { id: 'ST006', name: 'Mrs. Lisa Taylor', role: 'Accountant', department: 'Admin', status: 'Active', salary: 200000, joinDate: '2020-03-15', email: 'l.taylor@school.edu', phone: '+234 806 789 0123' },
  { id: 'ST007', name: 'Mr. James Anderson', role: 'Security Head', department: 'Support', status: 'Active', salary: 120000, joinDate: '2022-01-10', email: 'j.anderson@school.edu', phone: '+234 807 890 1234' },
  { id: 'ST008', name: 'Ms. Patricia Thomas', role: 'Secretary', department: 'Admin', status: 'Active', salary: 100000, joinDate: '2022-06-01', email: 'p.thomas@school.edu', phone: '+234 808 901 2345' },
];

export const HROversight: React.FC = () => {
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [selectedAction, setSelectedAction] = useState<any>(null);
  const [payrollAuthorized, setPayrollAuthorized] = useState(false);
  const [showPayrollConfirm, setShowPayrollConfirm] = useState(false);
  const [showStaffSheet, setShowStaffSheet] = useState(false);
  const [staffSearch, setStaffSearch] = useState('');
  const [pendingActions, setPendingActions] = useState(pendingActionsData);

  const handleActionClick = (action: any) => {
    setSelectedAction(action);
    setShowApprovalDialog(true);
  };

  const handleApproveAction = () => {
    toast.success("Request authorized successfully.");
    setPendingActions(prev => prev.filter(a => a.id !== selectedAction.id));
    setShowApprovalDialog(false);
  };

  const handleRejectAction = () => {
    toast.error("Request rejected.");
    setPendingActions(prev => prev.filter(a => a.id !== selectedAction.id));
    setShowApprovalDialog(false);
  };

  const handlePayrollAuthorize = () => {
    setPayrollAuthorized(true);
    setShowPayrollConfirm(false);
    toast.success("Payroll disbursement authorized successfully.", {
      description: "Finance department has been notified to proceed."
    });
  };

  const filteredStaff = staffList.filter(staff => 
    staff.name.toLowerCase().includes(staffSearch.toLowerCase()) ||
    staff.role.toLowerCase().includes(staffSearch.toLowerCase()) ||
    staff.department.toLowerCase().includes(staffSearch.toLowerCase())
  );

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 bg-gray-50/50 min-h-screen">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Executive HR Oversight</h1>
          <p className="text-gray-500">Monitor workforce stability, costs, and pending executive decisions.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="hidden sm:flex" onClick={() => toast.info("Downloading HR Report...")}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          
          <Sheet open={showStaffSheet} onOpenChange={setShowStaffSheet}>
            <SheetTrigger asChild>
              <Button className="bg-blue-900 hover:bg-blue-800">
                <Users className="w-4 h-4 mr-2" />
                View Staff Directory
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-3xl overflow-y-auto">
              <SheetHeader className="mb-6">
                <SheetTitle>Staff Directory</SheetTitle>
                <SheetDescription>
                  Complete list of all active employees and their details.
                </SheetDescription>
              </SheetHeader>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input 
                      placeholder="Search by name, role, or department..." 
                      className="pl-9" 
                      value={staffSearch}
                      onChange={(e) => setStaffSearch(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>

                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Salary</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStaff.map((staff) => (
                        <TableRow key={staff.id}>
                          <TableCell className="font-medium">
                            <div>{staff.name}</div>
                            <div className="text-xs text-gray-500">{staff.id}</div>
                          </TableCell>
                          <TableCell>{staff.role}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="font-normal">{staff.department}</Badge>
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              staff.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {staff.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">₦{(staff.salary).toLocaleString()}</TableCell>
                          <TableCell className="text-right">
                             <Button variant="ghost" size="sm" onClick={() => toast.info(`Viewing details for ${staff.name}`)}>
                               View
                             </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => (
          <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow cursor-default">
            <CardContent className="p-6 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{kpi.label}</p>
                <h3 className="text-2xl font-bold mt-2 text-gray-900">{kpi.value}</h3>
                <p className={`text-xs mt-1 font-medium ${kpi.trendUp ? 'text-green-600' : 'text-amber-600'}`}>
                  {kpi.trend}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${kpi.bg}`}>
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN (2/3 Width) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Payroll Control Center - HERO SECTION */}
          <Card className={`border-none shadow-lg overflow-hidden relative transition-all duration-500 ${payrollAuthorized ? 'bg-green-50' : 'bg-gradient-to-br from-blue-900 to-blue-950 text-white'}`}>
            {!payrollAuthorized && (
               <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            )}
            <CardHeader className="pb-2 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <Badge className={`${payrollAuthorized ? 'bg-green-200 text-green-800' : 'bg-blue-500/20 text-blue-100'} hover:bg-opacity-50 border-0 mb-2`}>
                    {payrollAuthorized ? 'Payroll Status: Authorized' : 'Current Payroll Cycle'}
                  </Badge>
                  <CardTitle className={`text-xl font-medium ${payrollAuthorized ? 'text-green-900' : 'text-blue-100'}`}>
                    January 2026 Disbursement
                  </CardTitle>
                </div>
                {payrollAuthorized ? (
                  <CheckCircle className="w-12 h-12 text-green-600" />
                ) : (
                  <Building2 className="w-12 h-12 text-blue-800/50" />
                )}
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mt-4">
                <div>
                  <p className={`${payrollAuthorized ? 'text-green-700' : 'text-blue-200'} text-sm mb-1`}>Total Net Payable</p>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-4xl font-bold tracking-tight ${payrollAuthorized ? 'text-green-900' : 'text-white'}`}>₦6,630,000.00</span>
                    <span className={`text-sm ${payrollAuthorized ? 'text-green-700' : 'text-blue-300'}`}>/ 72 Staff</span>
                  </div>
                  <p className={`text-xs mt-2 flex items-center gap-1 ${payrollAuthorized ? 'text-green-600' : 'text-blue-300'}`}>
                    <CheckCircle className="w-3 h-3" />
                    Verified by Bursar & HR Manager
                  </p>
                </div>
                
                {payrollAuthorized ? (
                  <Button size="lg" disabled className="bg-green-200 text-green-800 border-0 opacity-100 cursor-not-allowed">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Authorized
                  </Button>
                ) : (
                  <Dialog open={showPayrollConfirm} onOpenChange={setShowPayrollConfirm}>
                    <DialogTrigger asChild>
                      <Button size="lg" className="bg-white text-blue-950 hover:bg-blue-50 font-semibold shadow-none border-0 transition-transform hover:scale-105">
                        Authorize Disbursement
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirm Payroll Authorization</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to authorize the disbursement of ₦6,630,000.00 for January 2026?
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4 space-y-4 bg-amber-50 p-4 rounded-lg">
                        <div className="flex gap-3">
                          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                          <p className="text-sm text-amber-800">
                            This action is final and will trigger the bank transfer process. Please ensure all department totals have been verified.
                          </p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowPayrollConfirm(false)}>Cancel</Button>
                        <Button onClick={handlePayrollAuthorize} className="bg-blue-900 hover:bg-blue-800">
                          Confirm & Authorize
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Cost Analytics */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Payroll vs Revenue Trend</CardTitle>
              <CardDescription>6-Month financial efficiency analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={payrollHistory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorPayroll" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `₦${value}M`} />
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      formatter={(value: number) => [`₦${value}M`, '']}
                    />
                    <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                    <Area type="monotone" dataKey="payroll" name="Payroll Cost" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorPayroll)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Department Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-sm">
               <CardHeader>
                <CardTitle className="text-lg">Cost by Department</CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="space-y-4">
                    {departmentCosts.map((dept, i) => (
                      <div key={i} className="flex items-center justify-between group hover:bg-gray-50 p-2 rounded-lg transition-colors cursor-default">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <span className="text-sm font-medium text-gray-700">{dept.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-semibold block">₦{(dept.amount/1000000).toFixed(1)}M</span>
                          <span className="text-xs text-gray-500">{dept.staff} Staff</span>
                        </div>
                      </div>
                    ))}
                 </div>
               </CardContent>
            </Card>

             <Card className="border-none shadow-sm bg-indigo-50/50">
               <CardHeader>
                <CardTitle className="text-lg text-indigo-900">Retention Insight</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100 hover:shadow-md transition-shadow">
                      <p className="text-xs text-indigo-500 font-bold uppercase mb-1">Top Performer Retention</p>
                      <h4 className="text-2xl font-bold text-gray-900">92%</h4>
                      <p className="text-sm text-gray-500 mt-1">Key staff retained this academic year.</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100 hover:shadow-md transition-shadow">
                      <p className="text-xs text-indigo-500 font-bold uppercase mb-1">Avg Tenure</p>
                      <h4 className="text-2xl font-bold text-gray-900">4.5 Yrs</h4>
                      <p className="text-sm text-gray-500 mt-1">Above industry average (3.2 yrs).</p>
                    </div>
                  </div>
               </CardContent>
            </Card>
          </div>

        </div>

        {/* RIGHT COLUMN (1/3 Width) - ACTION CENTER */}
        <div className="lg:col-span-1 space-y-6">
          
          <Card className="h-full border-none shadow-sm flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  Executive Inbox
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100">{pendingActions.length}</Badge>
                </CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
              <CardDescription>Approvals requiring your attention</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-[600px]">
                <div className="px-6 pb-6 space-y-1">
                  {pendingActions.length > 0 ? pendingActions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => handleActionClick(action)}
                      className="w-full text-left group p-4 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-200 hover:shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                          <AvatarFallback className={`${
                            action.type === 'Recruitment' ? 'bg-blue-100 text-blue-700' :
                            action.type === 'Expense' ? 'bg-green-100 text-green-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {action.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{action.type}</span>
                            <span className="text-xs text-gray-400 whitespace-nowrap flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {action.date}
                            </span>
                          </div>
                          <h4 className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-700 transition-colors">
                            {action.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1 truncate">
                            From: <span className="text-gray-700 font-medium">{action.requester}</span>
                          </p>
                          <div className="mt-3 flex items-center justify-between">
                             <Badge variant="outline" className="bg-white font-normal text-gray-600">
                               {action.details}
                             </Badge>
                             <div className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 text-xs font-medium flex items-center transform translate-x-2 group-hover:translate-x-0 duration-200">
                               Review <ArrowRight className="w-3 h-3 ml-1" />
                             </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  )) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center h-full">
                      <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle className="w-8 h-8 text-green-500" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">All Clear!</h3>
                      <p className="text-sm text-gray-500 max-w-[200px] mt-2">
                        You've handled all pending approvals for now.
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="border-t p-4 bg-gray-50/50">
               <Button variant="ghost" className="w-full text-xs text-gray-500 hover:text-gray-900">
                 View Action History
               </Button>
            </CardFooter>
          </Card>

        </div>
      </div>

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="outline" className="capitalize">
                {selectedAction?.type} Request
              </Badge>
              <span className="text-xs text-gray-500">{selectedAction?.date}</span>
            </div>
            <DialogTitle className="text-xl">{selectedAction?.title}</DialogTitle>
            <DialogDescription>
              Review the details below before authorizing.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 space-y-4">
              <div className="flex justify-between items-start">
                 <div className="flex gap-3">
                   <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-blue-100 text-blue-700">{selectedAction?.avatar}</AvatarFallback>
                   </Avatar>
                   <div>
                     <p className="text-sm font-medium text-gray-900">{selectedAction?.requester}</p>
                     <p className="text-xs text-gray-500">{selectedAction?.requesterRole}</p>
                   </div>
                 </div>
              </div>
              <Separator />
              <div className="space-y-3">
                 <div>
                   <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Description</span>
                   <p className="text-sm text-gray-700 mt-1 leading-relaxed">{selectedAction?.fullDescription}</p>
                 </div>
                 <div>
                   <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Financial Impact</span>
                   <p className="text-sm font-medium text-gray-900 mt-1">{selectedAction?.financialImpact}</p>
                 </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-md flex gap-3 items-start border border-blue-100">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
              <p className="text-sm text-blue-700 leading-relaxed">
                Authorizing this request is an executive action. Notification will be sent to the {selectedAction?.requesterRole} and HR Department immediately.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleRejectAction} className="w-full sm:w-auto text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100">
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </Button>
            <Button onClick={handleApproveAction} className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
              <CheckCircle className="w-4 h-4 mr-2" />
              Authorize Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};