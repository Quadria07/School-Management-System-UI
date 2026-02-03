import React, { useState, useMemo } from 'react';
import {
  Download,
  Eye,
  FileText,
  Monitor,
  TrendingUp,
  Lock,
  Unlock,
  Clock,
  AlertCircle,
  CheckCircle2,
  School,
  FileBarChart,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '../ui/alert';
import { useParent } from '../../../contexts/ParentContext';
import { Progress } from '../ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { StudentReportCard } from '../principal/StudentReportCard';
import { BroadsheetData } from '../principal/ExaminationManagement';
import schoolLogo from 'figma:asset/05e5dcd127c3f9119091f655ee2db41390342c66.png';

interface CBTResult {
  id: string;
  examTitle: string;
  subject: string;
  date: string;
  score: number;
  totalQuestions: number;
  timeSpent: string;
  status: 'completed' | 'pending' | 'missed';
  grade: string;
  session: string;
  term: string;
}

interface TermlyReport {
  id: string;
  term: string;
  session: string;
  releaseDate: string;
  status: 'released' | 'locked' | 'in-progress' | 'published';
  overallAverage?: number;
  position?: number;
  totalStudents?: number;
  type: 'CA Result' | 'Term Result';
}

export const AssessmentResultCenter: React.FC = () => {
  const parentContext = useParent();
  const selectedChild = parentContext?.selectedChild;
  
  const [selectedSession, setSelectedSession] = useState<string>('2024/2025');
  const [selectedTerm, setSelectedTerm] = useState<string>('First Term');
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<TermlyReport | null>(null);

  // Mock data stored in state, simulating data fetched from an API
  const [allCbtResults] = useState<Record<string, CBTResult[]>>({
    '1': [ // Child 1
      {
        id: '1',
        examTitle: 'Mid-Term Mathematics Test',
        subject: 'Mathematics',
        date: 'Dec 28, 2024',
        score: 92,
        totalQuestions: 40,
        timeSpent: '35 mins',
        status: 'completed',
        grade: 'A',
        session: '2024/2025',
        term: 'First Term'
      },
      {
        id: '2',
        examTitle: 'English Comprehension Quiz',
        subject: 'English Language',
        date: 'Dec 27, 2024',
        score: 88,
        totalQuestions: 30,
        timeSpent: '28 mins',
        status: 'completed',
        grade: 'A',
        session: '2024/2025',
        term: 'First Term'
      },
    ],
    '2': [ // Child 2
       {
        id: '3',
        examTitle: 'Biology Chapter Test',
        subject: 'Biology',
        date: 'Dec 26, 2024',
        score: 85,
        totalQuestions: 35,
        timeSpent: '32 mins',
        status: 'completed',
        grade: 'B+',
        session: '2024/2025',
        term: 'First Term'
      },
    ]
  });

  const [allTermlyReports] = useState<Record<string, TermlyReport[]>>({
    '1': [ // Child 1
      {
        id: '1',
        term: 'First Term',
        session: '2024/2025',
        releaseDate: 'Oct 25, 2024',
        status: 'released',
        overallAverage: 82.5,
        position: 6,
        totalStudents: 45,
        type: 'CA Result' // Mid-Term / CA Report
      },
      {
        id: '2',
        term: 'First Term',
        session: '2024/2025',
        releaseDate: 'Dec 20, 2024',
        status: 'released',
        overallAverage: 87.6,
        position: 5,
        totalStudents: 45,
        type: 'Term Result' // Full End of Term Report
      },
      {
        id: '3',
        term: 'Third Term',
        session: '2023/2024',
        releaseDate: 'Jul 15, 2024',
        status: 'released',
        overallAverage: 84.2,
        position: 8,
        totalStudents: 45,
        type: 'Term Result'
      }
    ],
    '2': [] // Child 2 has no reports yet
  });

  // Filter results based on selected child, session, and term
  const cbtResults = selectedChild ? (allCbtResults[selectedChild.id] || []).filter(
    r => r.session === selectedSession && r.term === selectedTerm
  ) : [];

  const termlyReports = selectedChild ? (allTermlyReports[selectedChild.id] || []).filter(
    r => r.session === selectedSession && r.term === selectedTerm
  ) : [];

  // Separate CA and Term reports for the selected term
  const caReport = termlyReports.find(r => r.type === 'CA Result' && (r.status === 'released' || r.status === 'published'));
  const termReport = termlyReports.find(r => r.type === 'Term Result' && (r.status === 'released' || r.status === 'published'));


  const completedTests = cbtResults.filter((r) => r.status === 'completed').length;
  const averageCBTScore =
    completedTests > 0
      ? cbtResults
          .filter((r) => r.status === 'completed')
          .reduce((sum, r) => sum + (r.score / r.totalQuestions) * 100, 0) / completedTests
      : 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-600 text-white">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-amber-600 text-white">
            <Clock className="w-3 h-3 mr-1" />
            Scheduled
          </Badge>
        );
      case 'missed':
        return (
          <Badge className="bg-red-600 text-white">
            <AlertCircle className="w-3 h-3 mr-1" />
            Missed
          </Badge>
        );
      default:
        return null;
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-700 bg-green-100';
    if (grade.startsWith('B')) return 'text-blue-700 bg-blue-100';
    if (grade.startsWith('C')) return 'text-amber-700 bg-amber-100';
    return 'text-gray-700 bg-gray-100';
  };

  const handleViewReport = (report: TermlyReport) => {
    setSelectedReport(report);
    setShowReportModal(true);
  };

  const handleDownloadResult = () => {
    toast.info('Generating PDF Report...');
    setTimeout(() => {
        toast.success('Report card downloaded successfully');
    }, 1500);
  };

  // Convert selectedChild to BroadsheetData format for the report card
  // Also generate the "subjects" array for the new format
  const { mockStudentData, subjectList } = useMemo(() => {
    if (!selectedChild || !selectedReport) return { mockStudentData: null, subjectList: [] };

    const subjects = [
        { subject: "MATHEMATICS", periodicTest: 9, midTermTest: 8, qp: 4, cp: 5, exam: 60, total: 86, grade: 'A', remark: 'EXCELLENT' },
        { subject: "ENGLISH LANGUAGE", periodicTest: 8, midTermTest: 8, qp: 5, cp: 4, exam: 55, total: 80, grade: 'A', remark: 'VERY GOOD' },
        { subject: "BASIC SCIENCE", periodicTest: 8, midTermTest: 7, qp: 4, cp: 5, exam: 52, total: 76, grade: 'B', remark: 'GOOD' },
        { subject: "BUSINESS STUDIES", periodicTest: 7, midTermTest: 8, qp: 3, cp: 4, exam: 58, total: 80, grade: 'A', remark: 'VERY GOOD' },
        { subject: "CIVIC EDUCATION", periodicTest: 9, midTermTest: 9, qp: 5, cp: 5, exam: 62, total: 90, grade: 'A', remark: 'EXCELLENT' },
    ];
    
    // Map subjects to the format expected by StudentReportCard based on report type
    const mappedSubjects = subjects.map(s => {
        if (selectedReport.type === 'CA Result') {
            const caTotal = s.periodicTest + s.midTermTest + s.qp + s.cp;
            return {
                ...s,
                caTotal,
                percentScore: (caTotal / 30) * 100
            };
        } else {
             // Term Result
             const caTotal = s.periodicTest + s.midTermTest + s.qp + s.cp;
             return {
                 ...s,
                 ca: caTotal,
                 average: 75.5, // Mock class average
                 rank: '5th'
             };
        }
    });

    const data: BroadsheetData = {
      sn: 1,
      studentName: selectedChild.name,
      class: selectedChild.class,
      // Leaving legacy fields as mock if needed by older logic, though mappedSubjects is what we rely on now
      totalScore: subjects.reduce((acc, curr) => acc + curr.total, 0),
      overallAverage: selectedReport.overallAverage || 0,
      percentAverage: Math.round((selectedReport.overallAverage || 0) * 5),
      overallPosition: selectedReport.position || 0,
      grade: 'A',
      remarks: 'Excellent Performance',
    };

    return { mockStudentData: data, subjectList: mappedSubjects };
  }, [selectedChild, selectedReport]);

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl mb-2 text-blue-950">
          Assessment & Result Center
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          View CBT exam results and official termly reports for{' '}
          <strong>{selectedChild?.name}</strong> ({selectedChild?.class})
        </p>
      </div>

      {/* Filter Controls */}
      <Card className="bg-white border-blue-100">
        <CardContent className="p-4 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="session-select">Academic Session</Label>
                    <Select value={selectedSession} onValueChange={setSelectedSession}>
                        <SelectTrigger id="session-select">
                            <SelectValue placeholder="Select Session" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2024/2025">2024/2025</SelectItem>
                            <SelectItem value="2023/2024">2023/2024</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="term-select">Term</Label>
                    <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                        <SelectTrigger id="term-select">
                            <SelectValue placeholder="Select Term" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="First Term">First Term</SelectItem>
                            <SelectItem value="Second Term">Second Term</SelectItem>
                            <SelectItem value="Third Term">Third Term</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </CardContent>
      </Card>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-3">
            <CardDescription className="text-blue-700">CBT Tests Completed</CardDescription>
            <CardTitle className="text-3xl text-blue-950">{completedTests}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-blue-700">
              <Monitor className="w-4 h-4" />
              <span className="text-sm font-medium">{selectedTerm}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-3">
            <CardDescription className="text-green-700">Average CBT Score</CardDescription>
            <CardTitle className="text-3xl text-green-950">
              {averageCBTScore.toFixed(1)}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-green-700">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">Performance Check</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-3">
            <CardDescription className="text-purple-700">Reports Available</CardDescription>
            <CardTitle className="text-xl sm:text-2xl text-purple-950 truncate">
               {caReport && termReport ? '2 New Reports' : caReport || termReport ? '1 New Report' : 'Pending'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-purple-700">
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">{selectedTerm}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* CBT Exam Results */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="w-5 h-5" />
                  CBT Exam Results
                </CardTitle>
                <CardDescription>Computer-Based Test performance for {selectedTerm}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {cbtResults.length > 0 ? (
                cbtResults.map((result) => (
                  <div
                    key={result.id}
                    className="p-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h4 className="font-semibold text-sm">{result.examTitle}</h4>
                          {getStatusBadge(result.status)}
                        </div>
                        <div className="space-y-1 text-xs text-gray-600 mb-2">
                          <p>
                            <strong>Subject:</strong> {result.subject}
                          </p>
                          <p>
                            <strong>Date:</strong> {result.date}
                          </p>
                          {result.status === 'completed' && (
                            <>
                              <p>
                                <strong>Score:</strong> {result.score}/{result.totalQuestions} (
                                {((result.score / result.totalQuestions) * 100).toFixed(1)}%)
                              </p>
                              <p>
                                <strong>Time Spent:</strong> {result.timeSpent}
                              </p>
                            </>
                          )}
                        </div>
                        {result.status === 'completed' && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-600">Grade:</span>
                            <Badge className={getGradeColor(result.grade)}>{result.grade}</Badge>
                            <Progress
                              value={(result.score / result.totalQuestions) * 100}
                              className="flex-1 h-2"
                            />
                          </div>
                        )}
                      </div>
                      {result.status === 'completed' && (
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3 mr-1" />
                          View Details
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed">
                    <p>No CBT results found for this term.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Official Academy Reports Section */}
        <div className="space-y-4">
            
            {/* Term Result Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <School className="w-5 h-5" />
                  Term Result
                </CardTitle>
                <CardDescription>
                    End of Term Academic Report
                </CardDescription>
              </CardHeader>
              <CardContent>
                  {termReport ? (
                    <div
                      className="p-4 rounded-lg border border-green-200 bg-green-50"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-sm mb-1">
                              {termReport.term} {termReport.session}
                            </h4>
                            <p className="text-xs text-gray-600 mb-2">
                              Released: {termReport.releaseDate}
                            </p>
                          </div>
                          <div className="flex flex-col items-end">
                              <Unlock className="w-4 h-4 text-green-600 mb-1" />
                              <Badge className="bg-green-600 hover:bg-green-700 text-[10px]">Principal Approved</Badge>
                          </div>
                        </div>

                        <div className="space-y-1 text-xs mt-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Average:</span>
                            <span className="font-semibold text-green-700">
                              {termReport.overallAverage}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Position:</span>
                            <span className="font-semibold">
                              #{termReport.position}/{termReport.totalStudents}
                            </span>
                          </div>
                        </div>

                        <Button 
                            size="sm" 
                            className="w-full bg-blue-600 hover:bg-blue-700 mt-2"
                            onClick={() => handleViewReport(termReport)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View Report
                        </Button>
                      </div>
                    </div>
                  ) : (
                     <div className="p-6 rounded-lg border border-gray-200 bg-gray-50 text-center">
                        <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <h4 className="font-semibold text-gray-600 mb-1">Result Not Available</h4>
                        <p className="text-xs text-gray-500 font-medium">
                            NO UPLOADED RESULT FOR THIS TERM
                        </p>
                     </div>
                  )}
              </CardContent>
            </Card>

            {/* CA Result Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileBarChart className="w-5 h-5" />
                  CA Result
                </CardTitle>
                <CardDescription>
                    Mid-Term / Continuous Assessment
                </CardDescription>
              </CardHeader>
              <CardContent>
                  {caReport ? (
                    <div
                      className="p-4 rounded-lg border border-blue-200 bg-blue-50"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-sm mb-1">
                              {caReport.term} (Mid-Term)
                            </h4>
                            <p className="text-xs text-gray-600 mb-2">
                              Released: {caReport.releaseDate}
                            </p>
                          </div>
                          <div className="flex flex-col items-end">
                              <Unlock className="w-4 h-4 text-blue-600 mb-1" />
                              <Badge variant="outline" className="bg-white text-blue-700 border-blue-200 text-[10px]">CA Report</Badge>
                          </div>
                        </div>

                        <div className="space-y-1 text-xs mt-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Average:</span>
                            <span className="font-semibold text-blue-700">
                              {caReport.overallAverage}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Position:</span>
                            <span className="font-semibold">
                              #{caReport.position}/{caReport.totalStudents}
                            </span>
                          </div>
                        </div>

                        <Button 
                            size="sm" 
                            variant="outline"
                            className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 mt-2"
                            onClick={() => handleViewReport(caReport)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View Report
                        </Button>
                      </div>
                    </div>
                  ) : (
                     <div className="p-6 rounded-lg border border-gray-200 bg-gray-50 text-center">
                        <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <h4 className="font-semibold text-gray-600 mb-1">Result Not Available</h4>
                        <p className="text-xs text-gray-500 font-medium">
                            NO UPLOADED RESULT FOR THIS TERM
                        </p>
                     </div>
                  )}
              </CardContent>
            </Card>

        </div>
      </div>

      {/* Report Card Modal */}
      <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
        <DialogContent className="!max-w-[1400px] max-h-[95vh] p-0 w-[95vw]">
            <DialogHeader className="px-3 sm:px-4 lg:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b bg-white sticky top-0 z-10">
                <DialogTitle className="flex items-center justify-between">
                    <span>
                        {selectedReport?.type === 'CA Result' ? 'Mid-Term Continuous Assessment Report' : 'Official Term Result Sheet'}
                    </span>
                </DialogTitle>
                <DialogDescription>
                  Detailed academic performance and assessment breakdown.
                </DialogDescription>
            </DialogHeader>
            <div 
              className="h-[calc(95vh-180px)] overflow-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {selectedReport && mockStudentData && selectedChild && (
                <StudentReportCard
                  student={mockStudentData}
                  term={selectedReport.term}
                  session={selectedReport.session}
                  class={selectedChild.class}
                  schoolLogo={schoolLogo}
                  adminSignature={null} // Parents just view
                  principalSignature="Signed" // Mock signature present
                  principalRemark={mockStudentData.remarks}
                  onPrincipalRemarkChange={() => {}} // Read-only for parents
                  onPrincipalSignatureUpload={() => {}} // Read-only
                  onRemovePrincipalSignature={() => {}} // Read-only
                  onAdminSignatureUpload={() => {}} // Read-only
                  onRemoveAdminSignature={() => {}} // Read-only
                  resultType={selectedReport.type === 'CA Result' ? 'ca' : 'term'}
                  userRole="Parent"
                  subjects={subjectList}
                />
              )}
            </div>
            <DialogFooter className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-t bg-gray-50">
                 <Button 
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                    onClick={handleDownloadResult}
                 >
                    <Download className="w-4 h-4 mr-2" />
                    Download as PDF
                 </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Important Note */}
      <Alert className="border-blue-300 bg-blue-50">
        <AlertCircle className="h-5 w-5 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Secure Access:</strong> All results and report cards are digitally signed and
          encrypted. Only authorized parents can access these documents. For entrance exam
          results, check the admission portal or contact the school office.
        </AlertDescription>
      </Alert>
    </div>
  );
};