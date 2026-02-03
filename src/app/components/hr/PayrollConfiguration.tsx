import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  AlertCircle,
  Download,
  Plus,
  Trash2,
  Edit2,
  FileText,
  Settings,
  Calendar,
  CheckCircle2,
  ArrowRight,
  User,
  Search
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'sonner';
import schoolLogo from 'figma:asset/05e5dcd127c3f9119091f655ee2db41390342c66.png';

// --- Interfaces ---

interface SalaryGrade {
  id: string;
  gradeLevel: string; // e.g. "Level 8"
  description: string; // e.g. "Senior Teacher"
  baseSalary: number;
  housingAllowance: number;
  transportAllowance: number;
}

interface MonthlyVariation {
  id: string;
  staffId: string;
  staffName: string;
  type: 'Bonus' | 'Deduction';
  category: string; // e.g. "Lateness", "Performance Award"
  amount: number;
  note: string;
}

interface StatutorySetting {
  id: string;
  name: string; // e.g. "Pension (Employee)"
  type: 'Percentage' | 'Fixed';
  value: number;
  isDeduction: boolean;
}

interface Employee {
  id: string;
  name: string;
  gradeId: string;
}

export const PayrollConfiguration: React.FC = () => {
  // --- State ---
  const [activeTab, setActiveTab] = useState("salary-scale");
  const [showGradeDialog, setShowGradeDialog] = useState(false);
  const [showVariationDialog, setShowVariationDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock Data: Salary Grades (Master Data)
  const [salaryGrades, setSalaryGrades] = useState<SalaryGrade[]>([
    { id: '1', gradeLevel: 'Lvl 12 (Executive)', description: 'Principal / VP', baseSalary: 350000, housingAllowance: 80000, transportAllowance: 50000 },
    { id: '2', gradeLevel: 'Lvl 10 (Senior)', description: 'Senior Teachers / HODs', baseSalary: 180000, housingAllowance: 40000, transportAllowance: 25000 },
    { id: '3', gradeLevel: 'Lvl 08 (Intermediate)', description: 'Teachers', baseSalary: 120000, housingAllowance: 25000, transportAllowance: 15000 },
    { id: '4', gradeLevel: 'Lvl 05 (Junior)', description: 'Support Staff / Security', baseSalary: 60000, housingAllowance: 15000, transportAllowance: 10000 },
  ]);

  // Mock Data: Employees to generate the table
  const [employees] = useState<Employee[]>([
     { id: 'ST-001', name: 'Dr. Johnson Okafor', gradeId: '1' }, // Principal
     { id: 'ST-002', name: 'Mrs. Sarah Adeleke', gradeId: '2' }, // Senior
     { id: 'ST-003', name: 'Mr. Emmanuel Okon', gradeId: '2' }, // Senior
     { id: 'ST-004', name: 'Ms. Grace Effiong', gradeId: '3' }, // Teacher
     { id: 'ST-005', name: 'Mr. David Yusuf', gradeId: '3' }, // Teacher
     { id: 'ST-006', name: 'Mr. Musa Ibrahim', gradeId: '4' }, // Security
     { id: 'ST-007', name: 'Mrs. Chioma Obi', gradeId: '4' }, // Support
  ]);

  // Mock Data: Monthly Variations (Current Month)
  const [variations, setVariations] = useState<MonthlyVariation[]>([
    { id: '1', staffId: 'ST-004', staffName: 'Ms. Grace Effiong', type: 'Bonus', category: 'Performance Award', amount: 25000, note: 'Teacher of the Month' },
    { id: '2', staffId: 'ST-006', staffName: 'Mr. Musa Ibrahim', type: 'Deduction', category: 'Lateness Fine', amount: 5000, note: 'Late 5 times' },
  ]);

  // Mock Data: Statutory (Global Settings)
  const [statutory] = useState<StatutorySetting[]>([
    { id: '1', name: 'Tax (PAYE)', type: 'Percentage', value: 7.5, isDeduction: true },
    { id: '2', name: 'Pension (Employee)', type: 'Percentage', value: 8.0, isDeduction: true },
    { id: '3', name: 'Health Insurance', type: 'Fixed', value: 3000, isDeduction: false }, 
  ]);

  // --- Form States ---
  const [newGrade, setNewGrade] = useState<Partial<SalaryGrade>>({ gradeLevel: '', description: '', baseSalary: 0, housingAllowance: 0, transportAllowance: 0 });
  const [newVariation, setNewVariation] = useState<Partial<MonthlyVariation>>({ staffName: '', type: 'Bonus', amount: 0, category: '', note: '' });

  // --- Handlers ---

  const handleEditGrade = (grade: SalaryGrade) => {
    setNewGrade(grade);
    setShowGradeDialog(true);
  };

  const handleSaveGrade = () => {
    if (!newGrade.gradeLevel || !newGrade.baseSalary) {
      toast.error("Please fill in the Grade Level and Base Salary.");
      return;
    }

    if (newGrade.id) {
        // Edit existing
        setSalaryGrades(salaryGrades.map(g => g.id === newGrade.id ? { ...g, ...newGrade } as SalaryGrade : g));
        toast.success("Salary Grade updated successfully.");
    } else {
        // Add new
        const grade: SalaryGrade = {
          id: Date.now().toString(),
          gradeLevel: newGrade.gradeLevel!,
          description: newGrade.description || '',
          baseSalary: Number(newGrade.baseSalary),
          housingAllowance: Number(newGrade.housingAllowance || 0),
          transportAllowance: Number(newGrade.transportAllowance || 0),
        };
        setSalaryGrades([...salaryGrades, grade]);
        toast.success("Salary Grade added successfully.");
    }
    
    setShowGradeDialog(false);
    setNewGrade({ gradeLevel: '', description: '', baseSalary: 0, housingAllowance: 0, transportAllowance: 0 });
  };


  const handleSaveVariation = () => {
    if (!newVariation.staffName || !newVariation.amount) {
      toast.error("Please enter staff name and amount.");
      return;
    }
    const variation: MonthlyVariation = {
      id: Date.now().toString(),
      staffId: 'TEMP-' + Math.floor(Math.random() * 1000),
      staffName: newVariation.staffName!,
      type: newVariation.type as 'Bonus' | 'Deduction',
      category: newVariation.category || 'Adjustment',
      amount: Number(newVariation.amount),
      note: newVariation.note || '',
    };
    setVariations([...variations, variation]);
    setShowVariationDialog(false);
    setNewVariation({ staffName: '', type: 'Bonus', amount: 0, category: '', note: '' });
    toast.success("Variation recorded for this month.");
  };

  const handleDeleteVariation = (id: string) => {
    setVariations(variations.filter(v => v.id !== id));
    toast.success("Adjustment removed.");
  };

  const calculateTotalPayroll = () => {
    let totalGross = 0;
    let totalNet = 0;
    let totalTax = 0;
    let totalPension = 0;

    employees.forEach(emp => {
       const grade = salaryGrades.find(g => g.id === emp.gradeId);
       if (!grade) return;
       const gross = grade.baseSalary + grade.housingAllowance + grade.transportAllowance;
       
       // Variations (matched loosely by name for this mock, or ID if available)
       // In a real app we'd match by ID. Here let's try to match by name or fallback to none.
       const empVariations = variations.filter(v => v.staffName.toLowerCase().includes(emp.name.toLowerCase().split(' ')[1]?.toLowerCase() || ''));
       const bonus = empVariations.filter(v => v.type === 'Bonus').reduce((acc, curr) => acc + curr.amount, 0);
       const deduction = empVariations.filter(v => v.type === 'Deduction').reduce((acc, curr) => acc + curr.amount, 0);

       const tax = (gross * 0.075);
       const pension = (gross * 0.08);
       
       totalGross += gross;
       totalTax += tax;
       totalPension += pension;
       totalNet += (gross + bonus - deduction - tax - pension);
    });

    return { totalGross, totalNet, totalTax, totalPension };
  };

  const { totalGross, totalNet } = calculateTotalPayroll();

  const handleExportToBursar = () => {
    setIsSubmitting(true);
    setTimeout(() => {
       setIsSubmitting(false);
       toast.success(
         "Payroll successfully submitted to Bursar! Notifications sent to Finance Department.", 
         { duration: 5000, icon: <CheckCircle2 className="w-5 h-5 text-green-600"/> }
       );
    }, 2000);
  };

  const getEmployeePayrollData = (employee: Employee) => {
      const grade = salaryGrades.find(g => g.id === employee.gradeId);
      if (!grade) return null;
      
      const gross = grade.baseSalary + grade.housingAllowance + grade.transportAllowance;
      
      // Find variations for this employee
      // Matching logic: simple contains for mock purposes since we don't have consistent IDs across all mocks
      const empVariations = variations.filter(v => 
          v.staffName === employee.name || 
          employee.name.includes(v.staffName) || 
          v.staffName.includes(employee.name.split(' ').pop() || 'XYZ')
      );

      const bonuses = empVariations.filter(v => v.type === 'Bonus').reduce((sum, v) => sum + v.amount, 0);
      const deductions = empVariations.filter(v => v.type === 'Deduction').reduce((sum, v) => sum + v.amount, 0);
      
      const tax = gross * 0.075;
      const pension = gross * 0.08;
      const netPay = gross + bonuses - deductions - tax - pension;

      return {
          grade: grade.gradeLevel,
          gross,
          bonuses,
          deductions,
          tax,
          pension,
          netPay
      };
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Payroll Configuration</h1>
          <p className="text-slate-500 mt-1">Manage salary scales, benefits, and prepare monthly payroll instructions for the Bursar.</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg border border-blue-100">
          <Calendar className="w-4 h-4" />
          <span className="font-medium">Period: January 2026</span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white p-1 border border-slate-200 rounded-lg w-full justify-start overflow-x-auto">
          <TabsTrigger value="salary-scale" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Salary Scales (Master)</TabsTrigger>
          <TabsTrigger value="variations" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Monthly Variations</TabsTrigger>
          <TabsTrigger value="summary" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Review & Submit</TabsTrigger>
        </TabsList>

        {/* --- Tab 1: Salary Scales --- */}
        <TabsContent value="salary-scale" className="space-y-6">
          <Alert className="bg-slate-50 border-slate-200">
            <Settings className="h-4 w-4 text-slate-600" />
            <AlertTitle className="text-slate-800">Master Configuration</AlertTitle>
            <AlertDescription className="text-slate-600">
              Define the base pay and standard allowances for each staff grade. This data changes rarely.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Grade Level Definitions</CardTitle>
                <CardDescription>Standard compensation packages by role level</CardDescription>
              </div>
              <Button onClick={() => setShowGradeDialog(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" /> Add New Grade
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-slate-200 overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-4">Grade Level</th>
                      <th className="p-4">Description</th>
                      <th className="p-4 text-right">Base Salary</th>
                      <th className="p-4 text-right">Housing</th>
                      <th className="p-4 text-right">Transport</th>
                      <th className="p-4 text-right bg-slate-100">Total Gross</th>
                      <th className="p-4 w-[100px]"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {salaryGrades.map((grade) => (
                      <tr key={grade.id} className="hover:bg-slate-50/50">
                        <td className="p-4 font-medium text-slate-900">{grade.gradeLevel}</td>
                        <td className="p-4 text-slate-600">{grade.description}</td>
                        <td className="p-4 text-right font-mono text-slate-600">₦{grade.baseSalary.toLocaleString()}</td>
                        <td className="p-4 text-right font-mono text-slate-600">₦{grade.housingAllowance.toLocaleString()}</td>
                        <td className="p-4 text-right font-mono text-slate-600">₦{grade.transportAllowance.toLocaleString()}</td>
                        <td className="p-4 text-right font-mono font-bold text-slate-900 bg-slate-50">
                          ₦{(grade.baseSalary + grade.housingAllowance + grade.transportAllowance).toLocaleString()}
                        </td>
                        <td className="p-4 text-right">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-slate-400 hover:text-blue-600"
                            onClick={() => handleEditGrade(grade)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- Tab 2: Monthly Variations --- */}
        <TabsContent value="variations" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-6">
               <Alert className="bg-blue-50 border-blue-200">
                <FileText className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800">January 2026 Adjustments</AlertTitle>
                <AlertDescription className="text-blue-700">
                  Enter any one-off bonuses, performance awards, or disciplinary deductions for the current month only.
                </AlertDescription>
              </Alert>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle>Adjustments List</CardTitle>
                  <Button onClick={() => setShowVariationDialog(true)} variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                    <Plus className="w-4 h-4 mr-2" /> Add Adjustment
                  </Button>
                </CardHeader>
                <CardContent>
                  {variations.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 border-2 border-dashed border-slate-200 rounded-lg">
                      <p>No adjustments recorded for this month yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {variations.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-blue-300 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.type === 'Bonus' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                              <DollarSign className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{item.staffName}</p>
                              <div className="flex items-center gap-2 text-xs text-slate-500">
                                <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200">{item.category}</span>
                                <span>{item.note}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right flex items-center gap-4">
                            <span className={`font-mono font-bold text-lg ${item.type === 'Bonus' ? 'text-green-600' : 'text-red-600'}`}>
                              {item.type === 'Bonus' ? '+' : '-'} ₦{item.amount.toLocaleString()}
                            </span>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteVariation(item.id)} className="text-slate-400 hover:text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Side Panel: Summary of Variations */}
            <div className="w-full md:w-80">
              <Card className="bg-slate-50 border-slate-200 sticky top-4">
                <CardHeader>
                  <CardTitle className="text-base text-slate-700">Variations Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Total Bonuses</span>
                    <span className="font-mono font-medium text-green-600">
                      +₦{variations.filter(v => v.type === 'Bonus').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Total Deductions</span>
                    <span className="font-mono font-medium text-red-600">
                      -₦{variations.filter(v => v.type === 'Deduction').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* --- Tab 3: Summary & Submit --- */}
        <TabsContent value="summary" className="space-y-6">
          <Card className="border-blue-200 shadow-sm">
             <CardHeader className="bg-blue-50/50 border-b border-blue-100">
                {/* School Header for Official Report Look */}
                <div className="border border-blue-950 p-4 mb-4 bg-white rounded-sm">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* School Logo */}
                    <div className="w-16 h-16 flex items-center justify-center flex-shrink-0">
                      <img
                        src={schoolLogo}
                        alt="BFOIA Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* School Info */}
                    <div className="flex-1 text-center">
                      <h1 className="text-lg sm:text-xl font-bold text-blue-950 mb-1">
                        BISHOP FELIX OWOLABI INT'L ACADEMY
                      </h1>
                      <p className="text-xs text-gray-700 mb-1">
                        1, Faithtriumph Drive, Behind Galaxy Hotel, West
                        Bye Pass, Ring Road, Osogbo, Osun State
                      </p>
                      <p className="text-xs font-semibold text-blue-900 italic">
                        MOTTO: ...learning for an Exceptional Nation
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 border-t border-gray-200 pt-2 text-center">
                      <h2 className="text-md font-bold text-gray-800 uppercase tracking-wide">Monthly Payroll Schedule - January 2026</h2>
                  </div>
                </div>

                <div className="flex flex-row items-center justify-between">
                   <div>
                     <CardTitle className="text-blue-900">Payroll Final Review</CardTitle>
                     <CardDescription>Review individual calculations before submission.</CardDescription>
                   </div>
                   <div className="text-right">
                      <p className="text-xs text-slate-500 uppercase font-bold">Total Net Payable</p>
                      <p className="text-2xl font-bold font-mono text-slate-900">₦{totalNet.toLocaleString()}</p>
                   </div>
                </div>
             </CardHeader>
             <CardContent className="p-0">
               <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                       <tr>
                          <th className="p-4">Staff Name</th>
                          <th className="p-4">Grade</th>
                          <th className="p-4 text-right">Gross Pay</th>
                          <th className="p-4 text-right text-green-700">Bonus</th>
                          <th className="p-4 text-right text-red-700">Fine/Ded.</th>
                          <th className="p-4 text-right text-slate-600">PAYE (7.5%)</th>
                          <th className="p-4 text-right text-slate-600">Pension (8%)</th>
                          <th className="p-4 text-right bg-blue-50/50 font-bold text-slate-900">Net Pay</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {employees.map((emp) => {
                          const data = getEmployeePayrollData(emp);
                          if (!data) return null;
                          return (
                             <tr key={emp.id} className="hover:bg-slate-50/50">
                                <td className="p-4 font-medium text-slate-900">{emp.name}</td>
                                <td className="p-4 text-slate-500 text-xs">{data.grade}</td>
                                <td className="p-4 text-right font-mono">₦{data.gross.toLocaleString()}</td>
                                <td className="p-4 text-right font-mono text-green-600">{data.bonuses > 0 ? `+${data.bonuses.toLocaleString()}` : '-'}</td>
                                <td className="p-4 text-right font-mono text-red-600">{data.deductions > 0 ? `-${data.deductions.toLocaleString()}` : '-'}</td>
                                <td className="p-4 text-right font-mono text-slate-600">-₦{data.tax.toLocaleString()}</td>
                                <td className="p-4 text-right font-mono text-slate-600">-₦{data.pension.toLocaleString()}</td>
                                <td className="p-4 text-right font-mono font-bold text-blue-900 bg-blue-50/30">₦{data.netPay.toLocaleString()}</td>
                             </tr>
                          );
                       })}
                    </tbody>
                 </table>
               </div>
             </CardContent>
             <CardContent className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-lg">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                   <div className="flex items-start gap-3 max-w-2xl text-sm text-slate-600">
                      <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <p>
                         Please verify all figures. <strong>PAYE Tax</strong> and <strong>Pension</strong> are automatically deducted from the Gross Salary. 
                         Monthly variations (Bonuses/Fines) are applied before the final Net Pay calculation. 
                         Clicking "Submit" will lock this period and forward the payment schedule to the Bursar.
                      </p>
                   </div>
                   <Button 
                      onClick={handleExportToBursar} 
                      disabled={isSubmitting}
                      className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-bold h-12 px-8 text-lg shadow-lg shadow-green-200 transition-all"
                   >
                      {isSubmitting ? 'Processing...' : (
                         <>Submit to Bursar <ArrowRight className="ml-2 w-5 h-5" /></>
                      )}
                   </Button>
                </div>
             </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* --- Dialogs --- */}

      {/* Add Grade Dialog */}
      <Dialog open={showGradeDialog} onOpenChange={setShowGradeDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{newGrade.id ? 'Edit Grade Level' : 'Define New Grade Level'}</DialogTitle>
            <DialogDescription>{newGrade.id ? 'Modify compensation package details.' : 'Create a compensation package for a specific staff level.'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Grade Title</Label>
                <Input placeholder="e.g. Level 04" value={newGrade.gradeLevel} onChange={e => setNewGrade({...newGrade, gradeLevel: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input placeholder="e.g. Junior Staff" value={newGrade.description} onChange={e => setNewGrade({...newGrade, description: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Base Salary (₦)</Label>
              <Input type="number" placeholder="0.00" value={newGrade.baseSalary || ''} onChange={e => setNewGrade({...newGrade, baseSalary: parseFloat(e.target.value)})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                <Label>Housing Allow. (₦)</Label>
                <Input type="number" placeholder="0.00" value={newGrade.housingAllowance || ''} onChange={e => setNewGrade({...newGrade, housingAllowance: parseFloat(e.target.value)})} />
              </div>
              <div className="space-y-2">
                <Label>Transport Allow. (₦)</Label>
                <Input type="number" placeholder="0.00" value={newGrade.transportAllowance || ''} onChange={e => setNewGrade({...newGrade, transportAllowance: parseFloat(e.target.value)})} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGradeDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveGrade} className="bg-blue-600">{newGrade.id ? 'Update Grade' : 'Save Grade'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Variation Dialog */}
      <Dialog open={showVariationDialog} onOpenChange={setShowVariationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Monthly Adjustment</DialogTitle>
            <DialogDescription>Add a bonus or deduction for a specific staff member.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Staff Member</Label>
              <Select 
                value={newVariation.staffName} 
                onValueChange={(val) => setNewVariation({...newVariation, staffName: val})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select staff member" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map(emp => (
                     <SelectItem key={emp.id} value={emp.name}>{emp.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={newVariation.type} onValueChange={(val) => setNewVariation({...newVariation, type: val as any})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bonus">Bonus / Credit</SelectItem>
                    <SelectItem value="Deduction">Deduction / Debit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Amount (₦)</Label>
                <Input type="number" placeholder="0.00" value={newVariation.amount || ''} onChange={e => setNewVariation({...newVariation, amount: parseFloat(e.target.value)})} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={newVariation.category} onValueChange={(val) => setNewVariation({...newVariation, category: val})}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Performance Award">Performance Award</SelectItem>
                  <SelectItem value="Overtime">Overtime</SelectItem>
                  <SelectItem value="Lateness Fine">Lateness Fine</SelectItem>
                  <SelectItem value="Loan Repayment">Loan Repayment</SelectItem>
                  <SelectItem value="Damage">Damage to Property</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Note (Optional)</Label>
              <Input placeholder="Short description..." value={newVariation.note} onChange={e => setNewVariation({...newVariation, note: e.target.value})} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVariationDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveVariation} className="bg-blue-600">Add Adjustment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};