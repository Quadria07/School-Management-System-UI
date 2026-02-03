import React, { useState } from 'react';
import {
  Award,
  Download,
  TrendingUp,
  TrendingDown,
  BarChart3,
  FileText,
  AlertCircle,
  BookOpen,
  Video,
  Eye,
  Search,
  FolderOpen,
  ChevronRight,
  Calendar,
  CheckCircle2,
  File,
  Play,
  Image as ImageIcon,
  ClipboardCheck,
  Clock,
  MessageSquare,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { useParent } from '../../../contexts/ParentContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Input } from '../ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface SubjectScore {
  subject: string;
  ca1: number;
  ca2: number;
  exam: number;
  total: number;
  grade: string;
  trend: 'up' | 'down' | 'same';
  recommendation?: string;
}

interface Subject {
  id: string;
  name: string;
  teacher: string;
  totalNotes: number;
  lastUpdated: string;
  color: string;
}

interface LessonNote {
  id: string;
  title: string;
  topic: string;
  week: string;
  date: string;
  status: 'approved';
  materialsCount: number;
}

interface Material {
  id: string;
  name: string;
  type: 'pdf' | 'video' | 'ppt' | 'image';
  size: string;
  uploadedDate: string;
}

interface Assignment {
  id: string;
  title: string;
  subject: string;
  teacher: string;
  description: string;
  dueDate: string;
  maxScore: number;
  status: 'new' | 'submitted' | 'graded';
  score?: number;
  feedback?: string;
  submittedDate?: string;
}

export const AcademicMonitor: React.FC = () => {
  const parentContext = useParent();
  const selectedChild = parentContext?.selectedChild;
  
  const [selectedTerm, setSelectedTerm] = useState('first-2025');
  const [activeTab, setActiveTab] = useState('materials');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<LessonNote | null>(null);
  const [showMaterialDialog, setShowMaterialDialog] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [showMaterialViewer, setShowMaterialViewer] = useState(false);
  const [assignmentTab, setAssignmentTab] = useState<'new' | 'submitted' | 'graded'>('new');

  const [subjectScores] = useState<SubjectScore[]>([
    {
      subject: 'Mathematics',
      ca1: 18,
      ca2: 20,
      exam: 54,
      total: 92,
      grade: 'A',
      trend: 'up',
    },
    {
      subject: 'English Language',
      ca1: 17,
      ca2: 19,
      exam: 52,
      total: 88,
      grade: 'A',
      trend: 'up',
    },
    {
      subject: 'Biology',
      ca1: 16,
      ca2: 18,
      exam: 51,
      total: 85,
      grade: 'B+',
      trend: 'same',
    },
    {
      subject: 'Chemistry',
      ca1: 17,
      ca2: 19,
      exam: 51,
      total: 87,
      grade: 'A-',
      trend: 'up',
    },
    {
      subject: 'Physics',
      ca1: 16,
      ca2: 17,
      exam: 51,
      total: 84,
      grade: 'B+',
      trend: 'down',
      recommendation: 'Consider extra practice in motion and forces',
    },
    {
      subject: 'Economics',
      ca1: 18,
      ca2: 19,
      exam: 53,
      total: 90,
      grade: 'A',
      trend: 'up',
    },
  ]);

  const [subjects] = useState<Subject[]>([
    {
      id: '1',
      name: 'Mathematics',
      teacher: 'Mr. Adeyemi',
      totalNotes: 24,
      lastUpdated: '2 days ago',
      color: 'bg-blue-500',
    },
    {
      id: '2',
      name: 'English Language',
      teacher: 'Mrs. Okonkwo',
      totalNotes: 20,
      lastUpdated: '1 day ago',
      color: 'bg-purple-500',
    },
    {
      id: '3',
      name: 'Biology',
      teacher: 'Dr. Ibrahim',
      totalNotes: 18,
      lastUpdated: '3 days ago',
      color: 'bg-green-500',
    },
    {
      id: '4',
      name: 'Chemistry',
      teacher: 'Mrs. Eze',
      totalNotes: 22,
      lastUpdated: '1 day ago',
      color: 'bg-red-500',
    },
    {
      id: '5',
      name: 'Physics',
      teacher: 'Mr. Balogun',
      totalNotes: 21,
      lastUpdated: '4 days ago',
      color: 'bg-amber-500',
    },
    {
      id: '6',
      name: 'Economics',
      teacher: 'Mrs. Adeleke',
      totalNotes: 16,
      lastUpdated: '1 week ago',
      color: 'bg-teal-500',
    },
  ]);

  const [lessonNotes] = useState<LessonNote[]>([
    {
      id: '1',
      title: 'Quadratic Equations',
      topic: 'Solving quadratic equations using the quadratic formula',
      week: 'Week 12',
      date: 'Dec 28, 2025',
      status: 'approved',
      materialsCount: 4,
    },
    {
      id: '2',
      title: 'Simultaneous Equations',
      topic: 'Solving two equations with two unknowns',
      week: 'Week 11',
      date: 'Dec 21, 2025',
      status: 'approved',
      materialsCount: 3,
    },
    {
      id: '3',
      title: 'Logarithms and Indices',
      topic: 'Laws of logarithms and their applications',
      week: 'Week 10',
      date: 'Dec 14, 2025',
      status: 'approved',
      materialsCount: 5,
    },
    {
      id: '4',
      title: 'Trigonometry Basics',
      topic: 'Sine, cosine, and tangent ratios',
      week: 'Week 9',
      date: 'Dec 7, 2025',
      status: 'approved',
      materialsCount: 6,
    },
    {
      id: '5',
      title: 'Coordinate Geometry',
      topic: 'Distance between two points and midpoint formula',
      week: 'Week 8',
      date: 'Nov 30, 2025',
      status: 'approved',
      materialsCount: 3,
    },
  ]);

  const [materials] = useState<Material[]>([
    {
      id: '1',
      name: 'Quadratic Equations - Lesson Note.pdf',
      type: 'pdf',
      size: '2.4 MB',
      uploadedDate: 'Dec 28, 2025',
    },
    {
      id: '2',
      name: 'Solving Quadratic Equations - Video Tutorial.mp4',
      type: 'video',
      size: '45.8 MB',
      uploadedDate: 'Dec 28, 2025',
    },
    {
      id: '3',
      name: 'Practice Problems.pdf',
      type: 'pdf',
      size: '1.2 MB',
      uploadedDate: 'Dec 28, 2025',
    },
    {
      id: '4',
      name: 'Quadratic Formula Derivation.ppt',
      type: 'ppt',
      size: '3.5 MB',
      uploadedDate: 'Dec 28, 2025',
    },
  ]);

  const [assignments] = useState<Assignment[]>([
    {
      id: '1',
      title: 'Essay: The Impact of Technology on Education',
      subject: 'English Language',
      teacher: 'Mrs. Okonkwo',
      description:
        'Write a comprehensive essay (500-700 words) discussing how technology has transformed modern education. Include examples and personal observations.',
      dueDate: 'Tomorrow, 5:00 PM',
      maxScore: 20,
      status: 'new',
    },
    {
      id: '2',
      title: 'Chapter 5 Review Questions',
      subject: 'Biology',
      teacher: 'Dr. Ibrahim',
      description: 'Answer all questions from Chapter 5 (Questions 1-15) in your textbook.',
      dueDate: 'Thursday, 3:00 PM',
      maxScore: 15,
      status: 'submitted',
      submittedDate: 'Yesterday, 2:30 PM',
    },
    {
      id: '3',
      title: 'Quadratic Equations Practice Set',
      subject: 'Mathematics',
      teacher: 'Mr. Adeyemi',
      description:
        'Solve all 20 problems on quadratic equations. Show all working clearly.',
      dueDate: 'Dec 20, 2025',
      maxScore: 20,
      status: 'graded',
      score: 18,
      feedback:
        'Excellent work! You demonstrated a strong understanding of the quadratic formula. Minor error in question 15.',
      submittedDate: 'Dec 18, 2025',
    },
    {
      id: '4',
      title: 'Physics Lab Report - Motion and Forces',
      subject: 'Physics',
      teacher: 'Mr. Balogun',
      description:
        'Submit a detailed lab report on the motion and forces experiment conducted last week.',
      dueDate: 'Next Monday',
      maxScore: 25,
      status: 'new',
    },
  ]);

  const averageScore = subjectScores.reduce((sum, s) => sum + s.total, 0) / subjectScores.length;
  const classPosition = 5;
  const totalStudents = 45;

  const excellingSubjects = subjectScores.filter((s) => s.total >= 90);
  const needsAttentionSubjects = subjectScores.filter((s) => s.total < 85);

  const filteredSubjects = subjects.filter((subject) =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAssignments = assignments.filter((a) => a.status === assignmentTab);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-600" />;
      case 'video':
        return <Video className="w-5 h-5 text-purple-600" />;
      case 'ppt':
        return <File className="w-5 h-5 text-orange-600" />;
      case 'image':
        return <ImageIcon className="w-5 h-5 text-blue-600" />;
      default:
        return <File className="w-5 h-5 text-gray-600" />;
    }
  };

  const handleViewMaterial = (material: Material) => {
    setSelectedMaterial(material);
    setShowMaterialViewer(true);
  };

  const renderMaterialContent = () => {
    if (!selectedMaterial) return null;

    switch (selectedMaterial.type) {
      case 'video':
        return (
          <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
            <div className="w-full h-full flex items-center justify-center text-white">
              <div className="text-center">
                <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-sm opacity-75">Video Player</p>
                <p className="text-xs opacity-50 mt-2">{selectedMaterial.name}</p>
              </div>
            </div>
          </div>
        );
      case 'pdf':
        return (
          <div className="w-full h-[600px] bg-gray-100 rounded-lg overflow-hidden">
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 text-red-600" />
                <p className="text-sm text-gray-700">PDF Document Viewer</p>
                <p className="text-xs text-gray-500 mt-2">{selectedMaterial.name}</p>
                <p className="text-xs text-gray-400 mt-4">Document preview would appear here</p>
              </div>
            </div>
          </div>
        );
      case 'ppt':
        return (
          <div className="w-full h-[600px] bg-gray-100 rounded-lg overflow-hidden">
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <File className="w-16 h-16 mx-auto mb-4 text-orange-600" />
                <p className="text-sm text-gray-700">PowerPoint Presentation</p>
                <p className="text-xs text-gray-500 mt-2">{selectedMaterial.name}</p>
                <p className="text-xs text-gray-400 mt-4">Presentation preview would appear here</p>
              </div>
            </div>
          </div>
        );
      case 'image':
        return (
          <div className="w-full rounded-lg overflow-hidden bg-gray-100">
            <div className="w-full h-[600px] flex items-center justify-center">
              <div className="text-center">
                <ImageIcon className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                <p className="text-sm text-gray-700">Image Viewer</p>
                <p className="text-xs text-gray-500 mt-2">{selectedMaterial.name}</p>
                <p className="text-xs text-gray-400 mt-4">Image preview would appear here</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'new')
      return (
        <Badge className="bg-blue-600 text-white">
          <Clock className="w-3 h-3 mr-1" />
          New
        </Badge>
      );
    if (status === 'submitted')
      return (
        <Badge className="bg-amber-600 text-white">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Submitted
        </Badge>
      );
    return (
      <Badge className="bg-green-600 text-white">
        <CheckCircle2 className="w-3 h-3 mr-1" />
        Graded
      </Badge>
    );
  };

  if (!parentContext || !selectedChild) {
    return (
      <div className="p-4 sm:p-6">
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Error: Unable to load parent context. Please refresh the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl mb-2 text-blue-950">Academic Monitor</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Viewing academic progress for <strong>{selectedChild.name}</strong> ({selectedChild.class})
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={selectedTerm} onValueChange={setSelectedTerm}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select Term" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="first-2025">First Term 2024/2025</SelectItem>
              <SelectItem value="third-2024">Third Term 2023/2024</SelectItem>
              <SelectItem value="second-2024">Second Term 2023/2024</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="materials">Study Materials</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
        </TabsList>

        {/* Study Materials Tab */}
        <TabsContent value="materials" className="space-y-4 sm:space-y-6 mt-6">
          {/* Subject Grid View */}
          {!selectedSubject && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-blue-950">Study Materials by Subject</h2>
                <div className="w-full sm:w-auto max-w-xs">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search subjects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSubjects.map((subject) => (
                  <Card
                    key={subject.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedSubject(subject)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div
                          className={`w-12 h-12 ${subject.color} rounded-lg flex items-center justify-center mb-3`}
                        >
                          <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                      <CardTitle>{subject.name}</CardTitle>
                      <CardDescription>{subject.teacher}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Lesson Notes:</span>
                          <Badge variant="outline">{subject.totalNotes}</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Last Updated:</span>
                          <span className="text-xs text-gray-500">{subject.lastUpdated}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* Lesson Notes List View */}
          {selectedSubject && (
            <div className="space-y-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedSubject(null);
                  setSelectedLesson(null);
                }}
              >
                <ChevronRight className="w-4 h-4 mr-1 rotate-180" />
                Back to Subjects
              </Button>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FolderOpen className="w-5 h-5" />
                    {selectedSubject.name} - Lesson Notes
                  </CardTitle>
                  <CardDescription>
                    Teacher: {selectedSubject.teacher} • {selectedSubject.totalNotes} Lesson Notes Available
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {lessonNotes.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer"
                        onClick={() => {
                          setSelectedLesson(lesson);
                          setShowMaterialDialog(true);
                        }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs">
                                {lesson.week}
                              </Badge>
                              <Badge className="bg-green-600 text-white text-xs">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Approved
                              </Badge>
                            </div>
                            <h3 className="font-semibold mb-1">{lesson.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">{lesson.topic}</p>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {lesson.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                {lesson.materialsCount} materials
                              </span>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            View Materials
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments" className="space-y-4 sm:space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-blue-950">
              {selectedChild.name}'s Homework & Assignments
            </h2>
          </div>

          {/* Assignment Status Tabs */}
          <div className="flex gap-2 border-b">
            <Button
              variant="ghost"
              className={`rounded-none ${
                assignmentTab === 'new' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
              }`}
              onClick={() => setAssignmentTab('new')}
            >
              New ({assignments.filter((a) => a.status === 'new').length})
            </Button>
            <Button
              variant="ghost"
              className={`rounded-none ${
                assignmentTab === 'submitted'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600'
              }`}
              onClick={() => setAssignmentTab('submitted')}
            >
              Submitted ({assignments.filter((a) => a.status === 'submitted').length})
            </Button>
            <Button
              variant="ghost"
              className={`rounded-none ${
                assignmentTab === 'graded'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600'
              }`}
              onClick={() => setAssignmentTab('graded')}
            >
              Graded ({assignments.filter((a) => a.status === 'graded').length})
            </Button>
          </div>

          {/* Assignments List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredAssignments.map((assignment) => (
              <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusBadge(assignment.status)}
                        <Badge variant="outline">{assignment.subject}</Badge>
                      </div>
                      <CardTitle className="text-lg">{assignment.title}</CardTitle>
                      <CardDescription>{assignment.teacher}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-700">{assignment.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Due: {assignment.dueDate}
                    </span>
                    <span className="text-gray-600">Max: {assignment.maxScore} points</span>
                  </div>

                  {assignment.status === 'graded' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-green-900">Score:</span>
                        <span className="text-xl font-bold text-green-700">
                          {assignment.score}/{assignment.maxScore}
                        </span>
                      </div>
                      {assignment.feedback && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-green-900 mb-1 flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            Teacher's Feedback:
                          </p>
                          <p className="text-xs text-green-800">{assignment.feedback}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {assignment.status === 'submitted' && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <p className="text-sm text-amber-800">
                        <CheckCircle2 className="w-4 h-4 inline mr-1" />
                        Submitted on {assignment.submittedDate} • Awaiting grading
                      </p>
                    </div>
                  )}

                  {assignment.status === 'new' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-800">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Pending submission by {selectedChild.name}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredAssignments.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <ClipboardCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No {assignmentTab} assignments
                </h3>
                <p className="text-gray-600">
                  {assignmentTab === 'new' && "All caught up! No new assignments at the moment."}
                  {assignmentTab === 'submitted' && 'No submitted assignments yet.'}
                  {assignmentTab === 'graded' && 'No graded assignments to display.'}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Materials Dialog */}
      <Dialog
        open={showMaterialDialog}
        onOpenChange={(open) => {
          setShowMaterialDialog(open);
          if (!open) {
            setSelectedLesson(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedLesson?.title}</DialogTitle>
            <DialogDescription>{selectedLesson?.topic}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <CheckCircle2 className="w-4 h-4 inline mr-1" />
                This lesson note has been approved by the Principal.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Study Materials ({materials.length})</h4>
              {materials.map((material) => (
                <div
                  key={material.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {getFileIcon(material.type)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{material.name}</p>
                      <p className="text-xs text-gray-500">
                        {material.size} • {material.uploadedDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {material.type === 'video' ? (
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleViewMaterial(material)}
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Watch
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => handleViewMaterial(material)}>
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Material Viewer Dialog */}
      <Dialog
        open={showMaterialViewer}
        onOpenChange={(open) => {
          setShowMaterialViewer(open);
          if (!open) {
            setSelectedMaterial(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedMaterial?.name}</DialogTitle>
            <DialogDescription>
              {selectedMaterial?.type === 'video' 
                ? 'Watch the video tutorial below' 
                : 'View the study material below'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {renderMaterialContent()}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};