import React, { useState } from 'react';
import {
  Award,
  AlertTriangle,
  TrendingUp,
  Search,
  Plus,
  MoreHorizontal,
  FileText,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
} from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
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
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { toast } from 'sonner';

// --- Interfaces ---

interface Appraisal {
  id: string;
  staffName: string;
  role: string;
  department: string;
  rating: number; // 1.0 to 5.0
  period: string; // e.g. "2025 Q4"
  status: 'Pending' | 'Completed';
  lastReviewDate: string;
}

interface DisciplinaryCase {
  id: string;
  caseNumber: string;
  staffName: string;
  type: 'Query' | 'Warning' | 'Suspension' | 'Termination';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'Resolved';
  dateReported: string;
  description: string;
}

interface PromotionCandidate {
  id: string;
  staffName: string;
  currentRole: string;
  proposedRole: string;
  eligibilityScore: number; // %
  yearsOfService: number;
}

export const PerformanceManagement: React.FC = () => {
  // --- State ---
  const [activeTab, setActiveTab] = useState("appraisals");
  const [showAppraisalDialog, setShowAppraisalDialog] = useState(false);
  const [showIncidentDialog, setShowIncidentDialog] = useState(false);

  // Mock Data
  const [appraisals, setAppraisals] = useState<Appraisal[]>([
    { id: '1', staffName: 'Mr. Adeyemi Tunde', role: 'Mathematics Teacher', department: 'Sciences', rating: 4.8, period: '2025 Q4', status: 'Completed', lastReviewDate: 'Dec 15, 2025' },
    { id: '2', staffName: 'Mrs. Okonkwo Mary', role: 'Physics Teacher', department: 'Sciences', rating: 3.5, period: '2025 Q4', status: 'Completed', lastReviewDate: 'Dec 20, 2025' },
    { id: '3', staffName: 'Mr. Johnson Peter', role: 'Security Officer', department: 'Admin', rating: 0, period: '2025 Q4', status: 'Pending', lastReviewDate: '-' },
  ]);

  const [disciplinaryCases, setDisciplinaryCases] = useState<DisciplinaryCase[]>([
    { id: '1', caseNumber: 'CASE-001', staffName: 'Mr. Johnson Peter', type: 'Query', severity: 'Medium', status: 'Open', dateReported: 'Jan 4, 2026', description: 'Repeated lateness to duty post.' },
    { id: '2', caseNumber: 'CASE-002', staffName: 'Ms. Sarah Lee', type: 'Warning', severity: 'Low', status: 'Resolved', dateReported: 'Dec 12, 2025', description: 'Improper dressing code violation.' },
  ]);

  const [promotions] = useState<PromotionCandidate[]>([
    { id: '1', staffName: 'Mr. Adeyemi Tunde', currentRole: 'Level 8 Teacher', proposedRole: 'Level 10 Senior Teacher', eligibilityScore: 95, yearsOfService: 4 },
  ]);

  // --- Form State ---
  const [newAppraisal, setNewAppraisal] = useState({ staffName: '', rating: 3, notes: '' });
  const [newIncident, setNewIncident] = useState({ staffName: '', type: 'Query', description: '' });

  // --- Handlers ---
  const handleSaveAppraisal = () => {
    if (!newAppraisal.staffName) {
      toast.error("Please enter staff name");
      return;
    }
    const appraisal: Appraisal = {
      id: Date.now().toString(),
      staffName: newAppraisal.staffName,
      role: 'Staff', // Default for mock
      department: 'General',
      rating: Number(newAppraisal.rating),
      period: '2026 Q1',
      status: 'Completed',
      lastReviewDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    setAppraisals([appraisal, ...appraisals]);
    setShowAppraisalDialog(false);
    setNewAppraisal({ staffName: '', rating: 3, notes: '' });
    toast.success("Appraisal submitted successfully");
  };

  const handleLogIncident = () => {
     if (!newIncident.staffName || !newIncident.description) {
        toast.error("Please fill in all incident details");
        return;
     }
     const incident: DisciplinaryCase = {
        id: Date.now().toString(),
        caseNumber: `CASE-${Math.floor(Math.random() * 1000)}`,
        staffName: newIncident.staffName,
        type: newIncident.type as any,
        severity: 'Medium', // Default
        status: 'Open',
        dateReported: new Date().toLocaleDateString(),
        description: newIncident.description
     };
     setDisciplinaryCases([incident, ...disciplinaryCases]);
     setShowIncidentDialog(false);
     setNewIncident({ staffName: '', type: 'Query', description: '' });
     toast.success("Incident logged and case opened.");
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600 bg-green-50 border-green-200";
    if (rating >= 3.0) return "text-blue-600 bg-blue-50 border-blue-200";
    if (rating >= 2.0) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Performance & Discipline</h1>
          <p className="text-slate-500 mt-1">Monitor staff performance, handle disciplinary actions, and track promotions.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowIncidentDialog(true)} className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 hover:border-red-300">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Log Issue
          </Button>
          <Button onClick={() => setShowAppraisalDialog(true)} className="bg-blue-600 hover:bg-blue-700 shadow-sm">
            <Award className="w-4 h-4 mr-2" />
            New Appraisal
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
               <p className="text-sm font-medium text-slate-500">Avg. Performance Score</p>
               <h3 className="text-2xl font-bold text-slate-900">4.2 <span className="text-sm font-normal text-slate-400">/ 5.0</span></h3>
            </div>
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
               <TrendingUp className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500 shadow-sm">
           <CardContent className="p-4 flex items-center justify-between">
            <div>
               <p className="text-sm font-medium text-slate-500">Pending Reviews</p>
               <h3 className="text-2xl font-bold text-slate-900">12</h3>
            </div>
            <div className="h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
               <Clock className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500 shadow-sm">
           <CardContent className="p-4 flex items-center justify-between">
            <div>
               <p className="text-sm font-medium text-slate-500">Active Disciplinary Cases</p>
               <h3 className="text-2xl font-bold text-slate-900">{disciplinaryCases.filter(c => c.status === 'Open').length}</h3>
            </div>
            <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
               <AlertTriangle className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white p-1 border border-slate-200 rounded-lg w-full justify-start">
          <TabsTrigger value="appraisals" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Staff Appraisals</TabsTrigger>
          <TabsTrigger value="disciplinary" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Disciplinary Log</TabsTrigger>
          <TabsTrigger value="promotions" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Promotions</TabsTrigger>
        </TabsList>

        {/* --- Tab 1: Appraisals --- */}
        <TabsContent value="appraisals" className="space-y-4">
          <Card>
             <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                   <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                   <Input placeholder="Search staff..." className="pl-9 bg-slate-50 border-slate-200" />
                </div>
                <Button variant="outline" size="sm" className="hidden sm:flex">
                   <Filter className="w-4 h-4 mr-2" /> Filter
                </Button>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                     <tr>
                        <th className="p-4">Staff Name</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">Review Period</th>
                        <th className="p-4 text-center">Rating</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {appraisals.map((appraisal) => (
                        <tr key={appraisal.id} className="hover:bg-slate-50/50">
                           <td className="p-4 font-medium text-slate-900">{appraisal.staffName}</td>
                           <td className="p-4 text-slate-500">{appraisal.role}</td>
                           <td className="p-4 text-slate-500">{appraisal.period}</td>
                           <td className="p-4 text-center">
                              {appraisal.status === 'Completed' ? (
                                 <Badge variant="outline" className={`font-mono ${getRatingColor(appraisal.rating)}`}>
                                    {appraisal.rating.toFixed(1)}
                                 </Badge>
                              ) : (
                                 <span className="text-slate-400">-</span>
                              )}
                           </td>
                           <td className="p-4">
                              {appraisal.status === 'Completed' ? (
                                 <div className="flex items-center text-green-600 text-xs font-medium">
                                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Reviewed
                                 </div>
                              ) : (
                                 <div className="flex items-center text-amber-600 text-xs font-medium">
                                    <Clock className="w-3.5 h-3.5 mr-1.5" /> Pending
                                 </div>
                              )}
                           </td>
                           <td className="p-4 text-right">
                              <Button variant="ghost" size="sm" className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                 View Report
                              </Button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
             </div>
          </Card>
        </TabsContent>

        {/* --- Tab 2: Disciplinary --- */}
        <TabsContent value="disciplinary" className="space-y-4">
          <Card>
             <CardHeader>
                <CardTitle>Case History</CardTitle>
                <CardDescription>Track queries, warnings, and other disciplinary actions.</CardDescription>
             </CardHeader>
             <CardContent>
                <div className="space-y-4">
                   {disciplinaryCases.map((incident) => (
                      <div key={incident.id} className="flex flex-col sm:flex-row items-start gap-4 p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors bg-white">
                         <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                            incident.type === 'Suspension' || incident.type === 'Termination' ? 'bg-red-100 text-red-600' :
                            incident.type === 'Query' ? 'bg-amber-100 text-amber-600' : 'bg-orange-100 text-orange-600'
                         }`}>
                            <AlertTriangle className="w-5 h-5" />
                         </div>
                         <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                               <h4 className="text-base font-semibold text-slate-900">{incident.staffName}</h4>
                               <Badge className={
                                  incident.status === 'Open' ? 'bg-red-100 text-red-700 hover:bg-red-100 border-red-200' : 'bg-green-100 text-green-700 hover:bg-green-100 border-green-200'
                               }>
                                  {incident.status}
                               </Badge>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                               <span className="text-xs font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{incident.caseNumber}</span>
                               <span className="text-xs text-slate-500">• {incident.dateReported}</span>
                               <span className="text-xs font-medium text-slate-700">• {incident.type}</span>
                            </div>
                            <p className="text-sm text-slate-600 line-clamp-2">{incident.description}</p>
                         </div>
                         <div className="flex sm:flex-col gap-2 shrink-0">
                            <Button variant="outline" size="sm" className="h-8">Details</Button>
                            {incident.status === 'Open' && (
                               <Button size="sm" className="h-8 bg-slate-900 text-white hover:bg-slate-800">Resolve</Button>
                            )}
                         </div>
                      </div>
                   ))}
                </div>
             </CardContent>
          </Card>
        </TabsContent>

        {/* --- Tab 3: Promotions --- */}
        <TabsContent value="promotions" className="space-y-4">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                 <CardHeader>
                    <CardTitle>Recommended for Promotion</CardTitle>
                    <CardDescription>Staff meeting eligibility criteria based on tenure and performance.</CardDescription>
                 </CardHeader>
                 <CardContent>
                    {promotions.map((promo) => (
                       <div key={promo.id} className="flex items-center justify-between p-4 border rounded-lg bg-white mb-3">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                                <TrendingUp className="w-6 h-6" />
                             </div>
                             <div>
                                <h4 className="font-bold text-slate-900">{promo.staffName}</h4>
                                <div className="text-sm text-slate-500 flex items-center gap-2 mt-0.5">
                                   <span>{promo.currentRole}</span>
                                   <ArrowRight className="w-3 h-3" />
                                   <span className="font-medium text-purple-700">{promo.proposedRole}</span>
                                </div>
                             </div>
                          </div>
                          <div className="text-right">
                             <div className="mb-2">
                                <span className="text-xs font-bold uppercase text-slate-400">Eligibility Score</span>
                                <div className="text-xl font-bold text-slate-900">{promo.eligibilityScore}%</div>
                             </div>
                             <Button size="sm" className="bg-purple-600 hover:bg-purple-700">Approve</Button>
                          </div>
                       </div>
                    ))}
                 </CardContent>
              </Card>

              <Card className="bg-slate-50 border-slate-200">
                 <CardHeader>
                    <CardTitle className="text-base">Promotion Criteria</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4 text-sm">
                    <div className="flex justify-between items-center py-2 border-b border-slate-200">
                       <span className="text-slate-600">Minimum Tenure</span>
                       <span className="font-medium text-slate-900">3 Years</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-200">
                       <span className="text-slate-600">Avg Performance Score</span>
                       <span className="font-medium text-slate-900">4.0+</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-200">
                       <span className="text-slate-600">Disciplinary Record</span>
                       <span className="font-medium text-slate-900">Clean</span>
                    </div>
                    <Button variant="outline" className="w-full mt-4">Edit Criteria</Button>
                 </CardContent>
              </Card>
           </div>
        </TabsContent>
      </Tabs>

      {/* --- Dialogs --- */}

      {/* New Appraisal Dialog */}
      <Dialog open={showAppraisalDialog} onOpenChange={setShowAppraisalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Staff Appraisal</DialogTitle>
            <DialogDescription>Record performance review for the current period.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
             <div className="space-y-2">
                <Label>Staff Name</Label>
                <Input placeholder="Search staff..." value={newAppraisal.staffName} onChange={e => setNewAppraisal({...newAppraisal, staffName: e.target.value})} />
             </div>
             <div className="space-y-2">
                <div className="flex justify-between">
                   <Label>Overall Rating (1-5)</Label>
                   <span className="font-bold text-blue-600">{newAppraisal.rating}</span>
                </div>
                <input 
                   type="range" min="1" max="5" step="0.5" 
                   className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                   value={newAppraisal.rating}
                   onChange={e => setNewAppraisal({...newAppraisal, rating: Number(e.target.value)})}
                />
                <div className="flex justify-between text-xs text-slate-400">
                   <span>Poor</span>
                   <span>Average</span>
                   <span>Excellent</span>
                </div>
             </div>
             <div className="space-y-2">
                <Label>Notes / Key Achievements</Label>
                <Textarea placeholder="Describe performance details..." value={newAppraisal.notes} onChange={e => setNewAppraisal({...newAppraisal, notes: e.target.value})} />
             </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAppraisalDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveAppraisal} className="bg-blue-600 hover:bg-blue-700">Submit Appraisal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Log Incident Dialog */}
      <Dialog open={showIncidentDialog} onOpenChange={setShowIncidentDialog}>
        <DialogContent>
          <DialogHeader>
             <div className="flex items-center gap-2 text-red-600 mb-1">
                <AlertTriangle className="w-5 h-5" />
                <DialogTitle className="text-slate-900">Log Disciplinary Incident</DialogTitle>
             </div>
             <DialogDescription>Create a new case file for a staff infraction.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
             <div className="space-y-2">
                <Label>Staff Involved</Label>
                <Input placeholder="Staff name..." value={newIncident.staffName} onChange={e => setNewIncident({...newIncident, staffName: e.target.value})} />
             </div>
             <div className="space-y-2">
                <Label>Type of Infraction</Label>
                <Select value={newIncident.type} onValueChange={(val) => setNewIncident({...newIncident, type: val})}>
                   <SelectTrigger><SelectValue /></SelectTrigger>
                   <SelectContent>
                      <SelectItem value="Query">Query (Formal Inquiry)</SelectItem>
                      <SelectItem value="Warning">Warning Letter</SelectItem>
                      <SelectItem value="Suspension">Suspension</SelectItem>
                      <SelectItem value="Termination">Termination Recommendation</SelectItem>
                   </SelectContent>
                </Select>
             </div>
             <div className="space-y-2">
                <Label>Incident Description</Label>
                <Textarea placeholder="What happened? Include dates and times if applicable." className="h-24" value={newIncident.description} onChange={e => setNewIncident({...newIncident, description: e.target.value})} />
             </div>
          </div>
          <DialogFooter>
             <Button variant="outline" onClick={() => setShowIncidentDialog(false)}>Cancel</Button>
             <Button onClick={handleLogIncident} className="bg-red-600 hover:bg-red-700 text-white">Log Incident</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
