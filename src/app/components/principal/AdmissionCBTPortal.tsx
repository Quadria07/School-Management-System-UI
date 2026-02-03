import React, { useState } from 'react';
import {
  GraduationCap,
  Plus,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Calendar as CalendarIcon,
  DollarSign,
  Award,
  Users,
  Filter,
  Search,
  UserPlus,
  Edit3,
  Trash2,
  Save,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
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
import { toast } from 'sonner';
import { 
  AdmitDialog, 
  DetailsDialog,
  CreateExamDialog,
  ExamSetupDialog,
  EditExamDialog,
  ScheduleInterviewDialog
} from './AdmissionDialogs';

interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  gender?: string;
  dateOfBirth?: string;
  parentName?: string;
  parentPhone?: string;
  previousSchool?: string;
  appliedClass: string;
  formStatus: 'paid' | 'pending';
  examStatus: 'completed' | 'scheduled' | 'not-taken';
  examScore?: number;
  examDate?: string;
  interviewStatus?: 'scheduled' | 'pending' | 'completed';
  interviewDate?: string;
  applicationDate: string;
}

interface CBTQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface CBTExam {
  id: string;
  subject: string;
  questionCount: number;
  duration: number;
  questions: CBTQuestion[];
}

export const AdmissionCBTPortal: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showAdmitDialog, setShowAdmitDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showCreateExamDialog, setShowCreateExamDialog] = useState(false);
  const [showExamSetupDialog, setShowExamSetupDialog] = useState(false);
  const [showEditExamDialog, setShowEditExamDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [selectedExam, setSelectedExam] = useState<CBTExam | null>(null);

  // Form states for CBT creation
  const [newExamSubject, setNewExamSubject] = useState('');
  const [newExamDuration, setNewExamDuration] = useState('45');
  const [newExamQuestions, setNewExamQuestions] = useState<CBTQuestion[]>([]);

  // Interview schedule form
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [interviewNotes, setInterviewNotes] = useState('');

  const [applicants] = useState<Applicant[]>([
    {
      id: 'APP001',
      name: 'Chidinma Okonkwo',
      email: 'chidinma.parent@example.com',
      phone: '08012345678',
      address: '23 Awolowo Road, Ikoyi, Lagos',
      gender: 'Female',
      dateOfBirth: 'March 15, 2012',
      parentName: 'Mr. & Mrs. Okonkwo',
      parentPhone: '08012345678',
      previousSchool: 'Star Primary School, Lagos',
      appliedClass: 'JSS 1',
      formStatus: 'paid',
      examStatus: 'completed',
      examScore: 85,
      examDate: 'Dec 15, 2024',
      interviewStatus: 'scheduled',
      interviewDate: 'Jan 5, 2025',
      applicationDate: 'Dec 10, 2024',
    },
    {
      id: 'APP002',
      name: 'Emmanuel Adebayo',
      email: 'emmanuel.parent@example.com',
      phone: '08098765432',
      address: '45 Victoria Island, Lagos',
      gender: 'Male',
      dateOfBirth: 'July 22, 2011',
      parentName: 'Dr. Adebayo',
      parentPhone: '08098765432',
      previousSchool: 'Grace Academy, Victoria Island',
      appliedClass: 'JSS 2',
      formStatus: 'paid',
      examStatus: 'completed',
      examScore: 92,
      examDate: 'Dec 15, 2024',
      interviewStatus: 'scheduled',
      interviewDate: 'Jan 5, 2025',
      applicationDate: 'Dec 8, 2024',
    },
    {
      id: 'APP003',
      name: 'Fatima Mohammed',
      email: 'fatima.parent@example.com',
      phone: '08123456789',
      address: '12 Ahmadu Bello Way, Abuja',
      gender: 'Female',
      dateOfBirth: 'January 5, 2010',
      parentName: 'Alhaji Mohammed',
      parentPhone: '08123456789',
      previousSchool: 'Unity Secondary School, Abuja',
      appliedClass: 'SSS 1',
      formStatus: 'paid',
      examStatus: 'completed',
      examScore: 78,
      examDate: 'Dec 15, 2024',
      interviewStatus: 'pending',
      applicationDate: 'Dec 12, 2024',
    },
    {
      id: 'APP004',
      name: 'Daniel Nwachukwu',
      email: 'daniel.parent@example.com',
      phone: '08087654321',
      address: '78 New Layout, Enugu',
      gender: 'Male',
      dateOfBirth: 'September 10, 2012',
      parentName: 'Engr. Nwachukwu',
      parentPhone: '08087654321',
      previousSchool: 'Kings Primary School, Enugu',
      appliedClass: 'JSS 1',
      formStatus: 'pending',
      examStatus: 'scheduled',
      examDate: 'Jan 10, 2025',
      interviewStatus: 'pending',
      applicationDate: 'Dec 20, 2024',
    },
    {
      id: 'APP005',
      name: 'Grace Okoro',
      email: 'grace.parent@example.com',
      phone: '08056781234',
      address: '34 Independence Layout, Port Harcourt',
      gender: 'Female',
      dateOfBirth: 'May 18, 2010',
      parentName: 'Chief Okoro',
      parentPhone: '08056781234',
      previousSchool: 'Bright Stars School, PH',
      appliedClass: 'JSS 3',
      formStatus: 'paid',
      examStatus: 'completed',
      examScore: 88,
      examDate: 'Dec 15, 2024',
      interviewStatus: 'completed',
      applicationDate: 'Dec 5, 2024',
    },
  ]);

  const [cbtExams, setCbtExams] = useState<CBTExam[]>([
    {
      id: 'EXAM001',
      subject: 'Mathematics',
      questionCount: 40,
      duration: 45,
      questions: [
        {
          id: 'Q1',
          question: 'What is 25 + 17?',
          options: ['40', '41', '42', '43'],
          correctAnswer: 2,
        },
        {
          id: 'Q2',
          question: 'Solve for x: 2x + 5 = 15',
          options: ['3', '4', '5', '6'],
          correctAnswer: 2,
        },
      ],
    },
    {
      id: 'EXAM002',
      subject: 'English Language',
      questionCount: 40,
      duration: 45,
      questions: [
        {
          id: 'Q1',
          question: 'Choose the correct spelling:',
          options: ['Recieve', 'Receive', 'Receeve', 'Recive'],
          correctAnswer: 1,
        },
      ],
    },
    {
      id: 'EXAM003',
      subject: 'General Paper',
      questionCount: 30,
      duration: 30,
      questions: [
        {
          id: 'Q1',
          question: 'What is the capital of Nigeria?',
          options: ['Lagos', 'Abuja', 'Kano', 'Port Harcourt'],
          correctAnswer: 1,
        },
      ],
    },
  ]);

  const stats = {
    totalApplicants: applicants.length,
    formsCompleted: applicants.filter((a) => a.formStatus === 'paid').length,
    examsCompleted: applicants.filter((a) => a.examStatus === 'completed').length,
    avgScore: Math.round(
      applicants
        .filter((a) => a.examScore)
        .reduce((sum, a) => sum + (a.examScore || 0), 0) /
        applicants.filter((a) => a.examScore).length
    ),
  };

  const filteredApplicants = applicants.filter((applicant) => {
    const matchesSearch =
      applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.id.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'paid') return matchesSearch && applicant.formStatus === 'paid';
    if (filterStatus === 'pending') return matchesSearch && applicant.formStatus === 'pending';
    if (filterStatus === 'high-score')
      return matchesSearch && applicant.examScore && applicant.examScore >= 80;

    return matchesSearch;
  });

  const handleAdmitStudent = () => {
    if (!selectedApplicant) return;

    toast.success(
      `${selectedApplicant.name} has been admitted! Student ID: STD${Date.now().toString().slice(-6)}`,
      {
        description: 'Admission letter PDF generated and sent to parent email.',
      }
    );

    setShowAdmitDialog(false);
    setSelectedApplicant(null);
  };

  const handleCreateExamSetup = () => {
    if (!newExamSubject || !newExamDuration) {
      toast.error('Please select subject and duration');
      return;
    }
    setShowCreateExamDialog(false);
    setShowExamSetupDialog(true);
    setNewExamQuestions([
      {
        id: `Q${Date.now()}`,
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
      },
    ]);
  };

  const handleAddQuestion = () => {
    setNewExamQuestions((prev) => [
      ...prev,
      {
        id: `Q${Date.now()}`,
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
      },
    ]);
  };

  const handleUpdateQuestion = (index: number, field: string, value: any) => {
    setNewExamQuestions((prev) =>
      prev.map((q, i) =>
        i === index ? { ...q, [field]: value } : q
      )
    );
  };

  const handleUpdateOption = (qIndex: number, optIndex: number, value: string) => {
    setNewExamQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? { ...q, options: q.options.map((opt, oi) => (oi === optIndex ? value : opt)) }
          : q
      )
    );
  };

  const handleSaveExam = () => {
    const newExam: CBTExam = {
      id: `EXAM${Date.now()}`,
      subject: newExamSubject,
      questionCount: newExamQuestions.length,
      duration: parseInt(newExamDuration),
      questions: newExamQuestions,
    };

    setCbtExams((prev) => [...prev, newExam]);
    toast.success(`${newExamSubject} exam created successfully!`);
    setShowExamSetupDialog(false);
    setNewExamSubject('');
    setNewExamDuration('45');
    setNewExamQuestions([]);
  };

  const handleEditExam = (exam: CBTExam) => {
    setSelectedExam(exam);
    setNewExamQuestions([...exam.questions]);
    setShowEditExamDialog(true);
  };

  const handleUpdateExam = () => {
    if (!selectedExam) return;

    setCbtExams((prev) =>
      prev.map((exam) =>
        exam.id === selectedExam.id
          ? { ...exam, questions: newExamQuestions, questionCount: newExamQuestions.length }
          : exam
      )
    );

    toast.success(`${selectedExam.subject} exam updated successfully!`);
    setShowEditExamDialog(false);
    setSelectedExam(null);
    setNewExamQuestions([]);
  };

  const handleScheduleInterview = () => {
    if (!selectedApplicant || !interviewDate || !interviewTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    toast.success(
      `Interview scheduled for ${selectedApplicant.name} on ${interviewDate} at ${interviewTime}`,
      {
        description: 'Email notification sent to parent.',
      }
    );

    setShowScheduleDialog(false);
    setSelectedApplicant(null);
    setInterviewDate('');
    setInterviewTime('');
    setInterviewNotes('');
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    return 'text-amber-600 bg-amber-100';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl mb-2 text-blue-950">Admission & CBT Portal</h1>
          <p className="text-gray-600">Manage entrance examinations and student admissions</p>
        </div>
        <Button onClick={() => setShowCreateExamDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create CBT Exam
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Applicants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-3xl text-blue-950">{stats.totalApplicants}</p>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Forms Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-3xl text-blue-950">{stats.formsCompleted}</p>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Exams Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-3xl text-blue-950">{stats.examsCompleted}</p>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-3xl text-blue-950">{stats.avgScore}%</p>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content - Tabs */}
      <Tabs defaultValue="applicants" className="space-y-6">
        <TabsList>
          <TabsTrigger value="applicants">Applicant Manager</TabsTrigger>
          <TabsTrigger value="cbt-creator">CBT Exam Creator</TabsTrigger>
          <TabsTrigger value="interview">Interview Scheduler</TabsTrigger>
        </TabsList>

        {/* Tab Content will continue in next message due to length */}
        <TabsContent value="applicants" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Applicant Manager</CardTitle>
                  <CardDescription>
                    View applicants, payment status, and CBT scores
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search by name or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="high-score">High Score (≥80%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredApplicants.map((applicant) => (
                  <div
                    key={applicant.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-blue-950">{applicant.name}</h3>
                          <Badge variant="outline">{applicant.id}</Badge>
                          <Badge
                            variant={
                              applicant.formStatus === 'paid' ? 'default' : 'secondary'
                            }
                          >
                            {applicant.formStatus === 'paid' ? 'Form Paid' : 'Payment Pending'}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Applied Class</p>
                            <p className="font-medium">{applicant.appliedClass}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Exam Status</p>
                            <div className="flex items-center gap-2 mt-1">
                              {applicant.examStatus === 'completed' && (
                                <>
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                  <span className="font-medium">Completed</span>
                                </>
                              )}
                              {applicant.examStatus === 'scheduled' && (
                                <>
                                  <Clock className="w-4 h-4 text-blue-600" />
                                  <span className="font-medium">Scheduled</span>
                                </>
                              )}
                              {applicant.examStatus === 'not-taken' && (
                                <>
                                  <XCircle className="w-4 h-4 text-gray-400" />
                                  <span className="font-medium">Not Taken</span>
                                </>
                              )}
                            </div>
                          </div>
                          {applicant.examScore && (
                            <div>
                              <p className="text-gray-500">CBT Score</p>
                              <div
                                className={`inline-flex items-center px-2 py-1 rounded-md font-medium mt-1 ${getScoreColor(
                                  applicant.examScore
                                )}`}
                              >
                                <Award className="w-4 h-4 mr-1" />
                                {applicant.examScore}%
                              </div>
                            </div>
                          )}
                          <div>
                            <p className="text-gray-500">Interview</p>
                            <p className="font-medium capitalize">
                              {applicant.interviewStatus || 'Pending'}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        {applicant.examStatus === 'completed' &&
                          applicant.examScore &&
                          applicant.examScore >= 60 && (
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedApplicant(applicant);
                                setShowAdmitDialog(true);
                              }}
                            >
                              <UserPlus className="w-4 h-4 mr-2" />
                              Admit
                            </Button>
                          )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedApplicant(applicant);
                            setShowDetailsDialog(true);
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cbt-creator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>CBT Exam Creator</CardTitle>
              <CardDescription>
                Create entrance examination questions for Mathematics, English, and General Paper
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg text-center">
                  <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-medium text-blue-950 mb-2">Create New CBT Exam</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Set up multiple-choice questions, configure timer, and publish exam for
                    applicants
                  </p>
                  <Button onClick={() => setShowCreateExamDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Start Exam Setup
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {cbtExams.map((exam) => (
                    <Card key={exam.id}>
                      <CardHeader>
                        <CardTitle className="text-base">{exam.subject}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-4">
                          {exam.questionCount} Questions • {exam.duration} Minutes
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => handleEditExam(exam)}
                        >
                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit Exam
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interview" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Interview Scheduler</CardTitle>
                  <CardDescription>
                    Schedule physical interviews for applicants after CBT
                  </CardDescription>
                </div>
                <Button
                  onClick={() => {
                    const eligible = applicants.filter(
                      (a) => a.examStatus === 'completed' && a.interviewStatus !== 'completed'
                    );
                    if (eligible.length > 0) {
                      setSelectedApplicant(eligible[0]);
                      setShowScheduleDialog(true);
                    } else {
                      toast.error('No eligible applicants for interview');
                    }
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Interview
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applicants
                  .filter((a) => a.examStatus === 'completed' && a.interviewStatus === 'scheduled')
                  .map((applicant) => (
                    <div key={applicant.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-blue-950 mb-1">{applicant.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="w-4 h-4" />
                              <span>{applicant.interviewDate}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Award className="w-4 h-4" />
                              <span>CBT Score: {applicant.examScore}%</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedApplicant(applicant);
                            setShowScheduleDialog(true);
                          }}
                        >
                          Reschedule
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs will be added in the next part... */}
      <AdmitDialog
        open={showAdmitDialog}
        onOpenChange={setShowAdmitDialog}
        onAdmit={handleAdmitStudent}
        applicant={selectedApplicant}
      />
      <DetailsDialog
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
        applicant={selectedApplicant}
      />
      <CreateExamDialog
        open={showCreateExamDialog}
        onOpenChange={setShowCreateExamDialog}
        subject={newExamSubject}
        duration={newExamDuration}
        onSubjectChange={setNewExamSubject}
        onDurationChange={setNewExamDuration}
        onNext={handleCreateExamSetup}
      />
      <ExamSetupDialog
        open={showExamSetupDialog}
        onOpenChange={setShowExamSetupDialog}
        subject={newExamSubject}
        questions={newExamQuestions}
        onAddQuestion={handleAddQuestion}
        onUpdateQuestion={handleUpdateQuestion}
        onUpdateOption={handleUpdateOption}
        onDeleteQuestion={(index) => setNewExamQuestions((prev) => prev.filter((_, i) => i !== index))}
        onSave={handleSaveExam}
      />
      <EditExamDialog
        open={showEditExamDialog}
        onOpenChange={setShowEditExamDialog}
        exam={selectedExam}
        questions={newExamQuestions}
        onAddQuestion={handleAddQuestion}
        onUpdateQuestion={handleUpdateQuestion}
        onUpdateOption={handleUpdateOption}
        onDeleteQuestion={(index) => setNewExamQuestions((prev) => prev.filter((_, i) => i !== index))}
        onUpdate={handleUpdateExam}
      />
      <ScheduleInterviewDialog
        open={showScheduleDialog}
        onOpenChange={setShowScheduleDialog}
        applicants={applicants}
        selectedApplicant={selectedApplicant}
        onApplicantChange={(id) => {
          const applicant = applicants.find((a) => a.id === id);
          setSelectedApplicant(applicant || null);
        }}
        interviewDate={interviewDate}
        interviewTime={interviewTime}
        interviewNotes={interviewNotes}
        onDateChange={setInterviewDate}
        onTimeChange={setInterviewTime}
        onNotesChange={setInterviewNotes}
        onSchedule={handleScheduleInterview}
      />
    </div>
  );
};