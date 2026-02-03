import React, { useState } from 'react';
import {
  DollarSign,
  Plus,
  Edit,
  Send,
  Tag,
  GraduationCap,
  CheckCircle2,
  Percent,
  FileText,
  Download,
  Mail,
  Printer,
  Search,
  Filter,
  MoreHorizontal,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../ui/card';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { toast } from 'sonner';
import { SchoolReportHeader } from './SchoolReportHeader';

// --- Types ---
interface FeeComponent {
  id: string;
  name: string;
  description: string;
  baseAmount: number;
  applicableClasses: string[];
}

interface ClassFeeStructure {
  class: string;
  totalAmount: number;
  components: { name: string; amount: number }[];
}

interface Invoice {
  id: string;
  studentName: string;
  admissionNo: string;
  class: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  dateGenerated: string;
  dueDate: string;
  items: { description: string; amount: number }[];
}

export const FeeConfiguration: React.FC = () => {
  // --- States ---
  const [activeTab, setActiveTab] = useState('invoicing');
  const [showAddFeeDialog, setShowAddFeeDialog] = useState(false);
  const [showBulkDiscountDialog, setShowBulkDiscountDialog] = useState(false);
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Form States
  const [newFeeName, setNewFeeName] = useState('');
  const [newFeeAmount, setNewFeeAmount] = useState('');
  const [newFeeDescription, setNewFeeDescription] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [discountCategory, setDiscountCategory] = useState('staff');
  const [searchQuery, setSearchQuery] = useState('');

  // --- Mock Data ---
  const [feeComponents] = useState<FeeComponent[]>([
    {
      id: '1',
      name: 'Tuition Fee',
      description: 'Core teaching and learning',
      baseAmount: 120000,
      applicableClasses: ['All Classes'],
    },
    {
      id: '2',
      name: 'Development Levy',
      description: 'Infrastructure maintenance',
      baseAmount: 25000,
      applicableClasses: ['All Classes'],
    },
    {
      id: '3',
      name: 'ICT & Computer Studies',
      description: 'Technology education',
      baseAmount: 15000,
      applicableClasses: ['JSS 1-3', 'SSS 1-3'],
    },
    {
      id: '4',
      name: 'Laboratory & Practical',
      description: 'Science experiments',
      baseAmount: 20000,
      applicableClasses: ['JSS 1-3', 'SSS 1-3'],
    },
  ]);

  const [classFeeStructures] = useState<ClassFeeStructure[]>([
    {
      class: 'JSS 1',
      totalAmount: 215000,
      components: [
        { name: 'Tuition Fee', amount: 120000 },
        { name: 'Development Levy', amount: 25000 },
        { name: 'ICT & Computer Studies', amount: 15000 },
        { name: 'Laboratory & Practical', amount: 20000 },
        { name: 'Sports & Extra-curricular', amount: 12000 },
        { name: 'Textbooks & Materials', amount: 25000 },
      ],
    },
    {
      class: 'SSS 3',
      totalAmount: 260000,
      components: [
        { name: 'Tuition Fee', amount: 120000 },
        { name: 'Development Levy', amount: 25000 },
        { name: 'ICT & Computer Studies', amount: 15000 },
        { name: 'Laboratory & Practical', amount: 20000 },
        { name: 'WAEC Examination Fee', amount: 45000 },
        { name: 'Sports & Extra-curricular', amount: 12000 },
        { name: 'Textbooks & Materials', amount: 25000 },
      ],
    },
  ]);

  const [invoices] = useState<Invoice[]>([
    {
      id: 'INV-2026-001',
      studentName: 'Adeleke Taiwo',
      admissionNo: 'STU0001',
      class: 'JSS 1',
      amount: 215000,
      status: 'pending',
      dateGenerated: '2026-01-05',
      dueDate: '2026-01-20',
      items: [
        { description: 'Tuition Fee', amount: 120000 },
        { description: 'Development Levy', amount: 25000 },
        { description: 'ICT & Computer Studies', amount: 15000 },
        { description: 'Laboratory & Practical', amount: 20000 },
        { description: 'Sports & Extra-curricular', amount: 12000 },
        { description: 'Textbooks & Materials', amount: 25000 },
      ]
    },
    {
      id: 'INV-2026-002',
      studentName: 'Blessing Chidera',
      admissionNo: 'STU0002',
      class: 'JSS 1',
      amount: 215000,
      status: 'paid',
      dateGenerated: '2026-01-05',
      dueDate: '2026-01-20',
      items: [
        { description: 'Tuition Fee', amount: 120000 },
        { description: 'Development Levy', amount: 25000 },
        { description: 'ICT & Computer Studies', amount: 15000 },
        { description: 'Laboratory & Practical', amount: 20000 },
        { description: 'Sports & Extra-curricular', amount: 12000 },
        { description: 'Textbooks & Materials', amount: 25000 },
      ]
    },
    {
      id: 'INV-2026-003',
      studentName: 'Adebayo Temitope',
      admissionNo: 'STU0541',
      class: 'SSS 1',
      amount: 260000,
      status: 'overdue',
      dateGenerated: '2025-12-15',
      dueDate: '2026-01-01',
      items: [
        { description: 'Tuition Fee', amount: 120000 },
        { description: 'Development Levy', amount: 25000 },
        { description: 'ICT & Computer Studies', amount: 15000 },
        { description: 'Laboratory & Practical', amount: 20000 },
        { description: 'WAEC Examination Fee', amount: 45000 },
        { description: 'Sports & Extra-curricular', amount: 12000 },
        { description: 'Textbooks & Materials', amount: 25000 },
      ]
    },
  ]);

  // --- Actions ---

  const handleAddFeeComponent = () => {
    if (!newFeeName || !newFeeAmount || !newFeeDescription) {
      toast.error('Please fill in all fields');
      return;
    }
    toast.success(`New fee category "${newFeeName}" created successfully!`);
    setShowAddFeeDialog(false);
    setNewFeeName('');
    setNewFeeAmount('');
    setNewFeeDescription('');
  };

  const handleGenerateInvoices = () => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
      loading: 'Generating termly invoices for 450 students...',
      success: () => {
        setActiveTab('invoicing');
        return 'Invoices generated successfully!';
      },
      error: 'Error generating invoices',
    });
  };

  const handleApplyBulkDiscount = () => {
    if (!discountPercentage) {
      toast.error('Please enter discount percentage');
      return;
    }
    toast.success(
      `${discountPercentage}% discount applied to all ${discountCategory === 'staff' ? 'staff children' : 'scholarship recipients'}`
    );
    setShowBulkDiscountDialog(false);
    setDiscountPercentage('');
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoicePreview(true);
  };

  const handlePrint = () => {
    toast.success('Sending to printer...');
  };

  const handleShare = () => {
    toast.success('Invoice sent to parent via email and SMS');
  };

  const handleDownload = () => {
    toast.success('Downloading Invoice PDF...');
  };

  // --- Filtering ---
  const filteredInvoices = invoices.filter(inv => 
    inv.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    inv.admissionNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl mb-2 text-blue-950">Fee Configuration & Invoicing</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Manage fee structures, generate bills, and track invoicing status
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            className="bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-none shadow-sm"
            onClick={handleGenerateInvoices}
          >
            <Send className="w-4 h-4 mr-2" />
            Generate New Bills
          </Button>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
            <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-blue-600 mb-1">Total Expected Revenue</p>
                        <h3 className="text-2xl font-bold text-blue-950">₦45.2M</h3>
                    </div>
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                        <DollarSign className="w-5 h-5" />
                    </div>
                </div>
                <p className="text-xs text-blue-400 mt-2">+12% from last term</p>
            </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100">
            <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-purple-600 mb-1">Invoices Generated</p>
                        <h3 className="text-2xl font-bold text-purple-950">450</h3>
                    </div>
                    <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                        <FileText className="w-5 h-5" />
                    </div>
                </div>
                 <p className="text-xs text-purple-400 mt-2">100% of active students</p>
            </CardContent>
        </Card>
         <Card className="bg-gradient-to-br from-green-50 to-white border-green-100">
            <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-green-600 mb-1">Collection Rate</p>
                        <h3 className="text-2xl font-bold text-green-950">68%</h3>
                    </div>
                    <div className="p-2 bg-green-100 rounded-lg text-green-600">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                </div>
                 <p className="text-xs text-green-400 mt-2">306 invoices paid</p>
            </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 w-full sm:w-auto grid grid-cols-2 sm:flex sm:justify-start">
          <TabsTrigger value="invoicing" className="px-6">Invoicing & Billing</TabsTrigger>
          <TabsTrigger value="configuration" className="px-6">Fee Configuration</TabsTrigger>
        </TabsList>

        {/* --- INVOICING TAB --- */}
        <TabsContent value="invoicing" className="space-y-4">
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div>
                            <CardTitle>Student Invoices</CardTitle>
                            <CardDescription>View and manage termly bills for all students</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                <Input 
                                    placeholder="Search student or ID..." 
                                    className="pl-8"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" size="icon">
                                <Filter className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Invoice ID</TableHead>
                                <TableHead>Student</TableHead>
                                <TableHead>Class</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredInvoices.map((invoice) => (
                                <TableRow key={invoice.id}>
                                    <TableCell className="font-mono text-xs">{invoice.id}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{invoice.studentName}</span>
                                            <span className="text-xs text-gray-500">{invoice.admissionNo}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{invoice.class}</TableCell>
                                    <TableCell className="font-medium">₦{invoice.amount.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            invoice.status === 'paid' ? 'default' : 
                                            invoice.status === 'overdue' ? 'destructive' : 'secondary'
                                        } className={
                                            invoice.status === 'paid' ? 'bg-green-600' : ''
                                        }>
                                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-600">{invoice.dueDate}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button size="sm" variant="ghost" onClick={() => handleViewInvoice(invoice)}>
                                                <Eye className="w-4 h-4 mr-1" /> View
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button size="icon" variant="ghost">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleShare()}>
                                                        <Mail className="w-4 h-4 mr-2" /> Email Parent
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handlePrint()}>
                                                        <Printer className="w-4 h-4 mr-2" /> Print Bill
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>

        {/* --- CONFIGURATION TAB (Existing Content) --- */}
        <TabsContent value="configuration" className="space-y-6">
             {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card
                className="border-2 border-dashed border-blue-300 bg-blue-50 hover:bg-blue-100 cursor-pointer transition-colors"
                onClick={() => setShowAddFeeDialog(true)}
                >
                <CardContent className="p-6">
                    <div className="flex items-start gap-4 text-left">
                    <div className="p-3 bg-blue-200 rounded-lg bg-opacity-50 shrink-0">
                        <Plus className="w-6 h-6 text-blue-700" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-blue-950 mb-1">Add New Fee Category</h3>
                        <p className="text-sm text-blue-700">
                            Create seasonal fees like Excursion or Inter-house sports
                        </p>
                    </div>
                    </div>
                </CardContent>
                </Card>

                <Card
                className="border-2 border-dashed border-purple-300 bg-purple-50 hover:bg-purple-100 cursor-pointer transition-colors"
                onClick={() => setShowBulkDiscountDialog(true)}
                >
                <CardContent className="p-6">
                    <div className="flex items-start gap-4 text-left">
                    <div className="p-3 bg-purple-200 rounded-lg bg-opacity-50 shrink-0">
                        <Percent className="w-6 h-6 text-purple-700" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-purple-950 mb-1">Bulk Apply Discount</h3>
                        <p className="text-sm text-purple-700">
                            Apply discounts for staff children or scholarship recipients
                        </p>
                    </div>
                    </div>
                </CardContent>
                </Card>
            </div>

            {/* Fee Components */}
            <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Tag className="w-5 h-5" />
                    Fee Components Master List
                </CardTitle>
                <CardDescription>All fee categories available for assignment</CardDescription>
                </CardHeader>
                <CardContent>
                <div className="space-y-3">
                    {feeComponents.map((component) => (
                    <div
                        key={component.id}
                        className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{component.name}</h3>
                            <Badge variant="outline">₦{component.baseAmount.toLocaleString()}</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{component.description}</p>
                            <div className="flex flex-wrap gap-1">
                            {component.applicableClasses.map((cls, idx) => (
                                <Badge key={idx} className="bg-blue-600 text-white text-xs">
                                {cls}
                                </Badge>
                            ))}
                            </div>
                        </div>
                        <Button variant="outline" size="sm">
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                        </Button>
                        </div>
                    </div>
                    ))}
                </div>
                </CardContent>
            </Card>

            {/* Class Fee Structures */}
            <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Class-Specific Fee Structures
                </CardTitle>
                <CardDescription>Complete fee breakdown by class level</CardDescription>
                </CardHeader>
                <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {classFeeStructures.map((structure, idx) => (
                    <div
                        key={idx}
                        className="p-4 rounded-lg border border-gray-200 bg-gradient-to-br from-gray-50 to-white"
                    >
                        <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-lg">{structure.class}</h3>
                        <Badge className="bg-green-600 text-white">
                            Total: ₦{structure.totalAmount.toLocaleString()}
                        </Badge>
                        </div>
                        <div className="space-y-2">
                        {structure.components.map((component, compIdx) => (
                            <div
                            key={compIdx}
                            className="flex items-center justify-between text-sm py-2 border-b border-gray-100 last:border-0"
                            >
                            <span className="text-gray-700">{component.name}</span>
                            <span className="font-medium">₦{component.amount.toLocaleString()}</span>
                            </div>
                        ))}
                        </div>
                    </div>
                    ))}
                </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>

      {/* --- DIALOGS --- */}

      {/* Invoice Detail Dialog */}
      <Dialog open={showInvoicePreview} onOpenChange={setShowInvoicePreview}>
        <DialogContent className="sm:max-w-[700px] bg-white max-h-[90vh] overflow-y-auto">
             <DialogHeader>
                <SchoolReportHeader title="Termly Invoice" subtitle={`Session: 2024/2025 • Term: First Term`} />
                <DialogTitle className="sr-only">Invoice Details</DialogTitle>
                <DialogDescription className="sr-only">
                    Detailed breakdown of fees for {selectedInvoice?.studentName}
                </DialogDescription>
             </DialogHeader>

             {selectedInvoice && (
                 <div className="space-y-6">
                     {/* Invoice Meta */}
                     <div className="flex justify-between items-start border-b pb-4">
                         <div>
                             <h4 className="font-bold text-lg text-blue-950">{selectedInvoice.studentName}</h4>
                             <p className="text-sm text-gray-500">Admission No: {selectedInvoice.admissionNo}</p>
                             <p className="text-sm text-gray-500">Class: {selectedInvoice.class}</p>
                         </div>
                         <div className="text-right">
                             <p className="text-sm font-semibold">Invoice #{selectedInvoice.id}</p>
                             <p className="text-xs text-gray-500">Date: {selectedInvoice.dateGenerated}</p>
                             <Badge className={`mt-2 ${
                                 selectedInvoice.status === 'paid' ? 'bg-green-600' : 
                                 selectedInvoice.status === 'overdue' ? 'bg-red-600' : 'bg-gray-600'
                             }`}>
                                 {selectedInvoice.status.toUpperCase()}
                             </Badge>
                         </div>
                     </div>

                     {/* Fee Breakdown */}
                     <div className="border rounded-lg overflow-hidden">
                         <div className="bg-gray-100 px-4 py-2 flex justify-between font-semibold text-sm">
                             <span>Fee Description</span>
                             <span>Amount (₦)</span>
                         </div>
                         <div className="divide-y">
                             {selectedInvoice.items.map((item, idx) => (
                                 <div key={idx} className="px-4 py-3 flex justify-between text-sm">
                                     <span>{item.description}</span>
                                     <span className="font-medium">{item.amount.toLocaleString()}</span>
                                 </div>
                             ))}
                         </div>
                         <div className="bg-blue-50 px-4 py-3 flex justify-between font-bold text-blue-950 border-t border-blue-100">
                             <span>TOTAL AMOUNT DUE</span>
                             <span>₦{selectedInvoice.amount.toLocaleString()}</span>
                         </div>
                     </div>

                     {/* Payment Instructions */}
                     <div className="bg-gray-50 p-4 rounded-lg text-xs text-gray-600">
                         <p className="font-bold mb-1">Payment Information:</p>
                         <p>Bank: Zenith Bank</p>
                         <p>Account Name: Bishop Felix Owolabi Int'l Academy</p>
                         <p>Account Number: 1012345678</p>
                         <p className="mt-2 text-red-500 italic">Please quote the Admission Number ({selectedInvoice.admissionNo}) in the payment description.</p>
                     </div>
                 </div>
             )}

             <DialogFooter className="gap-2 sm:gap-0">
                 <Button variant="outline" onClick={() => handlePrint()}>
                     <Printer className="w-4 h-4 mr-2" /> Print
                 </Button>
                 <Button variant="outline" onClick={() => handleDownload()}>
                     <Download className="w-4 h-4 mr-2" /> Download PDF
                 </Button>
                 <Button className="bg-blue-600" onClick={() => handleShare()}>
                     <Mail className="w-4 h-4 mr-2" /> Send to Parent
                 </Button>
             </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Fee Component Dialog */}
      <Dialog open={showAddFeeDialog} onOpenChange={setShowAddFeeDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Fee Category</DialogTitle>
            <DialogDescription>
              Create a new fee component to assign to classes
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Fee Name:</Label>
              <Input
                placeholder="e.g., Excursion Fee"
                value={newFeeName}
                onChange={(e) => setNewFeeName(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Amount (₦):</Label>
              <Input
                type="number"
                placeholder="e.g., 15000"
                value={newFeeAmount}
                onChange={(e) => setNewFeeAmount(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Description:</Label>
              <Input
                placeholder="e.g., Annual school excursion to National Museum"
                value={newFeeDescription}
                onChange={(e) => setNewFeeDescription(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Applicable Classes:</Label>
              <div className="grid grid-cols-2 gap-2">
                {['JSS 1', 'JSS 2', 'JSS 3', 'SSS 1', 'SSS 2', 'SSS 3'].map((cls) => (
                  <div key={cls} className="flex items-center space-x-2">
                    <Checkbox id={cls} />
                    <label htmlFor={cls} className="text-sm cursor-pointer">
                      {cls}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddFeeDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddFeeComponent}>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Create Fee Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Discount Dialog */}
      <Dialog open={showBulkDiscountDialog} onOpenChange={setShowBulkDiscountDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Apply Bulk Discount</DialogTitle>
            <DialogDescription>
              Set discount percentage for specific student categories
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Discount Category:</Label>
              <Select value={discountCategory} onValueChange={setDiscountCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="staff">Staff Children</SelectItem>
                  <SelectItem value="scholarship">Scholarship Recipients</SelectItem>
                  <SelectItem value="siblings">Sibling Discount (3+ children)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Discount Percentage:</Label>
              <Input
                type="number"
                placeholder="e.g., 20"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(e.target.value)}
                min="0"
                max="100"
              />
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-800">
                <strong>Preview:</strong> A {discountPercentage || '0'}% discount will be applied to
                all students in the selected category. This will affect their termly invoices.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkDiscountDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleApplyBulkDiscount}>
              <Percent className="w-4 h-4 mr-2" />
              Apply Discount
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};