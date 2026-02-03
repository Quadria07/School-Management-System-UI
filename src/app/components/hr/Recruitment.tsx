import React, { useState } from 'react';
import {
  Briefcase,
  Users,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  UserPlus,
  Plus,
  ChevronRight,
  MoreHorizontal,
  Edit,
  Trash2,
  Lock,
  Search,
  Check
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { toast } from 'sonner';

interface JobOpening {
  id: string;
  title: string;
  department: string;
  type: 'Full-Time' | 'Part-Time' | 'Contract';
  applicants: number;
  status: 'Open' | 'Closed';
  postedDate: string;
}

interface Applicant {
  id: string;
  name: string;
  position: string;
  stage: 'Applied' | 'Shortlisted' | 'Interviewed' | 'Hired' | 'Rejected' | 'Passed Interview';
  appliedDate: string;
  experience: string;
}

export const Recruitment: React.FC = () => {
  const [showJobDialog, setShowJobDialog] = useState(false);
  const [editingJob, setEditingJob] = useState<JobOpening | null>(null);
  
  const [newJob, setNewJob] = useState({
    title: '',
    department: 'Mathematics',
    type: 'Full-Time'
  });

  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>([
    { id: '1', title: 'Senior Mathematics Teacher', department: 'Mathematics', type: 'Full-Time', applicants: 12, status: 'Open', postedDate: 'Dec 15, 2025' },
    { id: '2', title: 'Physics Teacher', department: 'Sciences', type: 'Full-Time', applicants: 8, status: 'Open', postedDate: 'Dec 20, 2025' },
  ]);

  const [applicants, setApplicants] = useState<Applicant[]>([
    { id: '1', name: 'Miss Sarah Oladele', position: 'Mathematics Teacher', stage: 'Shortlisted', appliedDate: 'Dec 18', experience: '5 years' },
    { id: '2', name: 'Mr. David Okafor', position: 'Mathematics Teacher', stage: 'Interviewed', appliedDate: 'Dec 16', experience: '3 years' },
    { id: '3', name: 'Mrs. Grace Amadi', position: 'Physics Teacher', stage: 'Applied', appliedDate: 'Dec 22', experience: '7 years' },
    { id: '4', name: 'Mr. Paul Adewale', position: 'Mathematics Teacher', stage: 'Passed Interview', appliedDate: 'Dec 10', experience: '6 years' },
  ]);
  
  const [checklist, setChecklist] = useState([
    { id: 1, task: 'Create system account and email', completed: true },
    { id: 2, task: 'Generate staff ID card', completed: false },
    { id: 3, task: 'Assign to department', completed: false },
    { id: 4, task: 'Complete HR documentation', completed: true },
    { id: 5, task: 'Schedule orientation', completed: false },
  ]);

  // Task adding state
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');

  const openNewJobDialog = () => {
     setEditingJob(null);
     setNewJob({ title: '', department: 'Mathematics', type: 'Full-Time' });
     setShowJobDialog(true);
  };

  const openEditJobDialog = (job: JobOpening) => {
     setEditingJob(job);
     setNewJob({ 
        title: job.title, 
        department: job.department, 
        type: job.type 
     });
     setShowJobDialog(true);
  };

  const handleSaveJob = () => {
    if (!newJob.title) {
       toast.error("Please enter a job title");
       return;
    }

    if (editingJob) {
       // Update existing job
       setJobOpenings(prev => prev.map(job => 
         job.id === editingJob.id ? { 
            ...job, 
            title: newJob.title, 
            department: newJob.department, 
            type: newJob.type as any 
         } : job
       ));
       toast.success("Job opening updated successfully");
    } else {
       // Create new job
       const job: JobOpening = {
         id: Math.random().toString(36).substr(2, 9),
         title: newJob.title,
         department: newJob.department,
         type: newJob.type as any,
         applicants: 0,
         status: 'Open',
         postedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
       };
       setJobOpenings([job, ...jobOpenings]);
       toast.success("New job opening posted!");
    }

    setShowJobDialog(false);
    setNewJob({ title: '', department: 'Mathematics', type: 'Full-Time' });
    setEditingJob(null);
  };

  const closeJob = (id: string) => {
     setJobOpenings(prev => prev.map(job => 
        job.id === id ? { ...job, status: 'Closed' } : job
     ));
     toast.success("Job opening closed");
  };

  const deleteJob = (id: string) => {
     setJobOpenings(prev => prev.filter(job => job.id !== id));
     toast.success("Job opening deleted");
  };

  const handleUpdateStage = (id: string, newStage: Applicant['stage']) => {
     setApplicants(prev => prev.map(app => 
       app.id === id ? { ...app, stage: newStage } : app
     ));
     toast.success(`Applicant status updated to ${newStage}`);
  };
  
  const toggleChecklist = (id: number) => {
     setChecklist(prev => prev.map(item => 
       item.id === id ? { ...item, completed: !item.completed } : item
     ));
  };

  const handleAddTask = () => {
     if (!newTaskName.trim()) return;
     const newTask = {
        id: Date.now(),
        task: newTaskName,
        completed: false
     };
     setChecklist([...checklist, newTask]);
     setNewTaskName('');
     setIsAddingTask(false);
     toast.success("New task added to checklist");
  };

  const passedApplicants = applicants.filter(app => app.stage === 'Passed Interview');

  const handleSendToManagement = () => {
      toast.success("Selected candidates list sent to Principal & Proprietor");
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl mb-2 text-blue-950">Recruitment & Onboarding</h1>
          <p className="text-sm sm:text-base text-gray-600">Streamline hiring and manage new staff integration.</p>
        </div>
        <Button onClick={openNewJobDialog} className="bg-blue-600 hover:bg-blue-700">
          <Briefcase className="w-4 h-4 mr-2" />
          Post New Job
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Selected Candidates for Approval */}
        {passedApplicants.length > 0 && (
          <Card className="lg:col-span-2 border-green-200 bg-green-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                 <div>
                    <CardTitle className="flex items-center gap-2 text-green-800">
                      <CheckCircle2 className="w-5 h-5" />
                      Candidates for Final Approval
                    </CardTitle>
                    <CardDescription>Applicants who have passed the interview stage</CardDescription>
                 </div>
                 <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleSendToManagement}>
                    Send to Principal & Proprietor
                 </Button>
              </div>
            </CardHeader>
            <CardContent>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {passedApplicants.map(app => (
                     <div key={app.id} className="bg-white p-3 rounded-md border border-green-200 flex items-center justify-between shadow-sm">
                        <div>
                           <p className="font-semibold text-gray-900">{app.name}</p>
                           <p className="text-xs text-gray-500">{app.position}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">Recommended</Badge>
                     </div>
                  ))}
               </div>
            </CardContent>
          </Card>
        )}

        {/* Job Openings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Active Job Openings
            </CardTitle>
            <CardDescription>Current vacancies and application counts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobOpenings.map((job) => (
                <div key={job.id} className="p-4 rounded-lg border border-gray-200 bg-white hover:border-blue-300 transition-colors group relative">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-lg text-blue-950">{job.title}</h4>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                         <Badge variant="secondary" className="bg-gray-100 text-gray-700 font-normal">{job.department}</Badge>
                         <Badge variant="secondary" className="bg-blue-50 text-blue-700 font-normal">{job.type}</Badge>
                         <Badge className={job.status === 'Open' ? 'bg-green-600' : 'bg-gray-500'}>{job.status}</Badge>
                      </div>
                      <div className="flex items-center text-xs text-gray-500 gap-3">
                         <span>Posted: {job.postedDate}</span>
                         <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                         <span className="font-medium text-blue-600">{job.applicants} Applicants</span>
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                         <DropdownMenuLabel>Manage Job</DropdownMenuLabel>
                         <DropdownMenuSeparator />
                         <DropdownMenuItem onClick={() => openEditJobDialog(job)}>
                            <Edit className="w-3 h-3 mr-2" /> Edit Details
                         </DropdownMenuItem>
                         {job.status === 'Open' && (
                            <DropdownMenuItem onClick={() => closeJob(job.id)}>
                               <Lock className="w-3 h-3 mr-2" /> Close Application
                            </DropdownMenuItem>
                         )}
                         <DropdownMenuSeparator />
                         <DropdownMenuItem className="text-red-600" onClick={() => deleteJob(job.id)}>
                            <Trash2 className="w-3 h-3 mr-2" /> Delete Job
                         </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Applicant Tracking System */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Applicant Tracking
            </CardTitle>
            <CardDescription>Manage candidates through hiring stages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {applicants.map((applicant) => (
                <div key={applicant.id} className="p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-sm truncate pr-2">{applicant.name}</h4>
                        <Badge className={`text-[10px] h-5 px-1.5 ${
                          applicant.stage === 'Hired' ? 'bg-green-600 text-white' :
                          applicant.stage === 'Rejected' ? 'bg-red-600 text-white' :
                          applicant.stage === 'Interviewed' ? 'bg-blue-600 text-white' :
                          applicant.stage === 'Shortlisted' ? 'bg-purple-600 text-white' :
                          applicant.stage === 'Passed Interview' ? 'bg-teal-600 text-white' :
                          'bg-gray-500 text-white'
                        }`}>
                          {applicant.stage}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-0.5">{applicant.position}</p>
                      <p className="text-[10px] text-gray-400">Exp: {applicant.experience}</p>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleUpdateStage(applicant.id, 'Shortlisted')}>
                           Mark as Shortlisted
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateStage(applicant.id, 'Interviewed')}>
                           Mark as Interviewed
                        </DropdownMenuItem>
                         <DropdownMenuItem onClick={() => handleUpdateStage(applicant.id, 'Passed Interview')}>
                           <Check className="w-3 h-3 mr-2 text-teal-600" /> Passed Interview
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleUpdateStage(applicant.id, 'Hired')} className="text-green-600">
                           <CheckCircle2 className="w-3 h-3 mr-2" /> Hire Applicant
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateStage(applicant.id, 'Rejected')} className="text-red-600">
                           <XCircle className="w-3 h-3 mr-2" /> Reject Applicant
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Onboarding Checklist */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Onboarding Checklist
            </CardTitle>
            <CardDescription>Tasks for new hires (e.g., Mr. David Okafor)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {checklist.map((item) => (
                <div 
                  key={item.id} 
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                     item.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => toggleChecklist(item.id)}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                     item.completed ? 'bg-green-600 border-green-600' : 'border-gray-300'
                  }`}>
                     {item.completed && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <span className={`text-sm ${item.completed ? 'text-green-800 line-through decoration-green-800/50' : 'text-gray-700'}`}>
                     {item.task}
                  </span>
                </div>
              ))}
              
              {isAddingTask ? (
                <div className="mt-2 flex gap-2">
                   <Input 
                      value={newTaskName}
                      onChange={(e) => setNewTaskName(e.target.value)}
                      placeholder="Enter task name..."
                      className="h-8 text-sm"
                      autoFocus
                      onKeyDown={(e) => {
                         if (e.key === 'Enter') handleAddTask();
                         if (e.key === 'Escape') setIsAddingTask(false);
                      }}
                   />
                   <Button size="sm" onClick={handleAddTask} className="h-8 bg-blue-600">Add</Button>
                   <Button size="sm" variant="ghost" onClick={() => setIsAddingTask(false)} className="h-8">Cancel</Button>
                </div>
              ) : (
                <Button 
                   variant="ghost" 
                   className="w-full mt-2 text-xs text-gray-500 hover:text-blue-600"
                   onClick={() => setIsAddingTask(true)}
                >
                   <Plus className="w-3 h-3 mr-1" /> Add Custom Task
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Post/Edit Job Dialog */}
      <Dialog open={showJobDialog} onOpenChange={setShowJobDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingJob ? 'Edit Job Opening' : 'Post New Job Opening'}</DialogTitle>
            <DialogDescription>{editingJob ? 'Update vacancy details' : 'Create a new vacancy listing'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
             <div className="space-y-2">
                <Label>Job Title</Label>
                <Input 
                   placeholder="e.g. History Teacher" 
                   value={newJob.title}
                   onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                />
             </div>
             <div className="space-y-2">
                <Label>Department</Label>
                <Select 
                   value={newJob.department}
                   onValueChange={(val) => setNewJob({...newJob, department: val})}
                >
                  <SelectTrigger>
                     <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="Mathematics">Mathematics</SelectItem>
                     <SelectItem value="Sciences">Sciences</SelectItem>
                     <SelectItem value="Languages">Languages</SelectItem>
                     <SelectItem value="Humanities">Humanities</SelectItem>
                     <SelectItem value="Admin">Administration</SelectItem>
                  </SelectContent>
                </Select>
             </div>
             <div className="space-y-2">
                <Label>Employment Type</Label>
                <Select 
                   value={newJob.type}
                   onValueChange={(val) => setNewJob({...newJob, type: val})}
                >
                  <SelectTrigger>
                     <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="Full-Time">Full-Time</SelectItem>
                     <SelectItem value="Part-Time">Part-Time</SelectItem>
                     <SelectItem value="Contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
             </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowJobDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveJob} className="bg-blue-600 hover:bg-blue-700">
               {editingJob ? 'Update Job' : 'Post Opening'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};