import React, { useState } from 'react';
import {
  CheckSquare,
  AlertTriangle,
  FileText,
  Calendar as CalendarIcon,
  Search,
  Filter,
  Download,
  Eye,
  Plus,
  UserX,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  Bell,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
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
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';
import { AttendanceBroadsheet } from './AttendanceBroadsheet';

interface AttendanceRecord {
  date: string;
  class: string;
  totalStudents: number;
  present: number;
  absent: number;
  late: number;
  attendanceRate: number;
  submittedBy: string;
  submittedAt: string;
}

interface DisciplineCase {
  id: string;
  studentName: string;
  studentId: string;
  class: string;
  offense: string;
  description: string;
  severity: 'minor' | 'major' | 'critical';
  reportedBy: string;
  reportedDate: string;
  actionTaken: string;
  status: 'pending' | 'reviewed' | 'resolved';
  notificationSent: boolean;
}

interface ExeatApplication {
  id: string;
  studentName: string;
  studentId: string;
  class: string;
  reason: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  parentContact: string;
  appliedDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

export const AttendanceDiscipline: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState('2024-12-29');
  const [showDisciplineDialog, setShowDisciplineDialog] = useState(false);
  const [showExeatDialog, setShowExeatDialog] = useState(false);
  const [selectedDiscipline, setSelectedDiscipline] = useState<DisciplineCase | null>(null);
  const [selectedExeat, setSelectedExeat] = useState<ExeatApplication | null>(null);
  const [actionTaken, setActionTaken] = useState('');
  const [showBroadsheet, setShowBroadsheet] = useState(false);
  const [selectedBroadsheetClass, setSelectedBroadsheetClass] = useState('SSS 1A');

  // Auto-generated attendance records from teacher submissions
  const [attendanceRecords] = useState<AttendanceRecord[]>([
    {
      date: 'Dec 29, 2024',
      class: 'SSS 1A',
      totalStudents: 40,
      present: 38,
      absent: 2,
      late: 0,
      attendanceRate: 95,
      submittedBy: 'Mrs. Sarah Johnson',
      submittedAt: '8:15 AM',
    },
    {
      date: 'Dec 29, 2024',
      class: 'SSS 1B',
      totalStudents: 42,
      present: 40,
      absent: 1,
      late: 1,
      attendanceRate: 95.2,
      submittedBy: 'Mr. David Okafor',
      submittedAt: '8:20 AM',
    },
    {
      date: 'Dec 29, 2024',
      class: 'JSS 2A',
      totalStudents: 38,
      present: 36,
      absent: 2,
      late: 0,
      attendanceRate: 94.7,
      submittedBy: 'Mrs. Blessing Eze',
      submittedAt: '8:18 AM',
    },
    {
      date: 'Dec 29, 2024',
      class: 'JSS 2B',
      totalStudents: 35,
      present: 33,
      absent: 2,
      late: 0,
      attendanceRate: 94.3,
      submittedBy: 'Mr. Emmanuel Adeleke',
      submittedAt: '8:25 AM',
    },
    {
      date: 'Dec 29, 2024',
      class: 'GRADE 4',
      totalStudents: 30,
      present: 29,
      absent: 1,
      late: 0,
      attendanceRate: 96.7,
      submittedBy: 'Mrs. Chioma Nwankwo',
      submittedAt: '8:10 AM',
    },
  ]);

  // Discipline cases submitted by teachers
  const [disciplineCases, setDisciplineCases] = useState<DisciplineCase[]>([
    {
      id: 'DC001',
      studentName: 'ADEBAYO TEMITOPE',
      studentId: 'STD2024001',
      class: 'SSS 1A',
      offense: 'Late Coming',
      description: 'Student arrived 30 minutes late without valid excuse',
      severity: 'minor',
      reportedBy: 'Mrs. Sarah Johnson',
      reportedDate: 'Dec 29, 2024 - 8:30 AM',
      actionTaken: '',
      status: 'pending',
      notificationSent: false,
    },
    {
      id: 'DC002',
      studentName: 'BLESSING CHIDERA',
      studentId: 'STD2024002',
      class: 'JSS 1',
      offense: 'Disruptive Behavior',
      description: 'Talking during lesson and disrupting classmates',
      severity: 'minor',
      reportedBy: 'Mr. David Okafor',
      reportedDate: 'Dec 28, 2024 - 2:15 PM',
      actionTaken: '',
      status: 'pending',
      notificationSent: false,
    },
    {
      id: 'DC003',
      studentName: 'CHARLES NNAMDI',
      studentId: 'STD2024003',
      class: 'JSS 2',
      offense: 'Fighting',
      description: 'Physical altercation with another student during break time',
      severity: 'major',
      reportedBy: 'Mr. Emmanuel Adeleke',
      reportedDate: 'Dec 28, 2024 - 11:00 AM',
      actionTaken: 'Suspended for 3 days and parents invited for meeting',
      status: 'reviewed',
      notificationSent: true,
    },
    {
      id: 'DC004',
      studentName: 'DEBORAH FUNMILAYO',
      studentId: 'STD2024004',
      class: 'SSS 1',
      offense: 'Cheating in Exam',
      description: 'Caught with notes during Mathematics examination',
      severity: 'critical',
      reportedBy: 'Dr. Amaka Peters',
      reportedDate: 'Dec 27, 2024 - 10:45 AM',
      actionTaken: '',
      status: 'pending',
      notificationSent: false,
    },
    {
      id: 'DC005',
      studentName: 'EMMANUEL AYOMIDE',
      studentId: 'STD2024005',
      class: 'JSS 1',
      offense: 'Incomplete Assignment',
      description: 'Failed to submit assignments for the past 2 weeks',
      severity: 'minor',
      reportedBy: 'Mrs. Blessing Eze',
      reportedDate: 'Dec 27, 2024 - 3:00 PM',
      actionTaken: 'Warning issued, must complete all pending assignments',
      status: 'resolved',
      notificationSent: true,
    },
  ]);

  // Exeat applications from students
  const [exeatApplications, setExeatApplications] = useState<ExeatApplication[]>([
    {
      id: 'EX001',
      studentName: 'ADEYEMI OLUWASEUN',
      studentId: 'STD2024006',
      class: 'GRADE 4',
      reason: 'Family Emergency',
      destination: 'Ibadan, Oyo State',
      departureDate: 'Dec 30, 2024',
      returnDate: 'Jan 2, 2025',
      parentContact: '0803-456-7890',
      appliedDate: 'Dec 28, 2024',
      status: 'pending',
    },
    {
      id: 'EX002',
      studentName: 'BUKOLA OLUWAKEMI',
      studentId: 'STD2024007',
      class: 'SSS 1',
      reason: 'Medical Appointment',
      destination: 'Lagos State University Teaching Hospital',
      departureDate: 'Dec 31, 2024',
      returnDate: 'Jan 1, 2025',
      parentContact: '0805-123-4567',
      appliedDate: 'Dec 29, 2024',
      status: 'pending',
    },
    {
      id: 'EX003',
      studentName: 'CHINEDU IKECHUKWU',
      studentId: 'STD2024008',
      class: 'JSS 2',
      reason: 'Grandfather\'s Birthday Celebration',
      destination: 'Enugu State',
      departureDate: 'Jan 3, 2025',
      returnDate: 'Jan 5, 2025',
      parentContact: '0807-890-1234',
      appliedDate: 'Dec 27, 2024',
      status: 'approved',
    },
    {
      id: 'EX004',
      studentName: 'FATIMA MOHAMMED',
      studentId: 'STD2024009',
      class: 'GRADE 4',
      reason: 'Weekend Visit Home',
      destination: 'Ilorin, Kwara State',
      departureDate: 'Dec 30, 2024',
      returnDate: 'Dec 31, 2024',
      parentContact: '0809-567-8901',
      appliedDate: 'Dec 28, 2024',
      status: 'rejected',
    },
  ]);

  const handleReviewDiscipline = (disciplineCase: DisciplineCase) => {
    setSelectedDiscipline(disciplineCase);
    setActionTaken(disciplineCase.actionTaken);
    setShowDisciplineDialog(true);
  };

  const handleSubmitAction = () => {
    if (!selectedDiscipline || !actionTaken.trim()) {
      toast.error('Please enter the action taken');
      return;
    }

    // Update the discipline case
    setDisciplineCases((prev) =>
      prev.map((dc) =>
        dc.id === selectedDiscipline.id
          ? {
              ...dc,
              actionTaken: actionTaken,
              status: 'reviewed' as const,
              notificationSent: true,
            }
          : dc
      )
    );

    // Send notifications
    toast.success('Action submitted successfully', {
      description: 'Notifications sent to all school admins, teachers, and parent',
    });

    setShowDisciplineDialog(false);
    setSelectedDiscipline(null);
    setActionTaken('');
  };

  const handleResolveCase = (caseId: string) => {
    setDisciplineCases((prev) =>
      prev.map((dc) =>
        dc.id === caseId ? { ...dc, status: 'resolved' as const } : dc
      )
    );
    toast.success('Case marked as resolved');
  };

  const handleExeatAction = (application: ExeatApplication, action: 'approve' | 'reject') => {
    setExeatApplications((prev) =>
      prev.map((app) =>
        app.id === application.id
          ? { ...app, status: action === 'approve' ? 'approved' : 'rejected' }
          : app
      )
    );

    toast.success(
      action === 'approve' ? 'Exeat application approved' : 'Exeat application rejected',
      {
        description: `Parent and student have been notified`,
      }
    );

    setShowExeatDialog(false);
    setSelectedExeat(null);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'minor':
        return 'bg-yellow-100 text-yellow-800';
      case 'major':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'reviewed':
        return 'bg-purple-100 text-purple-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2 text-blue-950">Attendance & Discipline Management</h1>
        <p className="text-gray-600">Monitor attendance and manage student discipline</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Today's Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-3xl text-blue-950">94.8%</p>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckSquare className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2">Auto-generated from teacher submissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-3xl text-blue-950">
                {disciplineCases.filter((dc) => dc.status === 'pending').length}
              </p>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2">Awaiting principal action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Exeat Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-3xl text-blue-950">
                {exeatApplications.filter((app) => app.status === 'pending').length}
              </p>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <UserX className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Critical Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-3xl text-blue-950">
                {disciplineCases.filter((dc) => dc.severity === 'critical').length}
              </p>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2">Requires immediate attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Broadsheet Dialog */}
      <Dialog open={showBroadsheet} onOpenChange={setShowBroadsheet}>
        <DialogContent className="max-w-[100vw] w-screen h-screen max-h-screen p-0 border-none rounded-none overflow-hidden flex flex-col">
          <DialogHeader className="sr-only">
            <DialogTitle>Attendance Broadsheet</DialogTitle>
            <DialogDescription>Full screen attendance broadsheet view</DialogDescription>
          </DialogHeader>
          <AttendanceBroadsheet 
            onClose={() => setShowBroadsheet(false)} 
            classLevel={selectedBroadsheetClass} 
          />
        </DialogContent>
      </Dialog>

      {/* Tabs */}
      <Tabs defaultValue="attendance" className="space-y-6">
        <TabsList>
          <TabsTrigger value="attendance">Attendance Reports</TabsTrigger>
          <TabsTrigger value="discipline">Discipline Log</TabsTrigger>
          <TabsTrigger value="exeat">Exeat Management</TabsTrigger>
        </TabsList>

        {/* Attendance Tab */}
        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Auto-Generated Attendance Summary</CardTitle>
                  <CardDescription>Reports generated from teacher submissions</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Input 
                    type="date" 
                    value={selectedDate} 
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-40" 
                  />
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Date</th>
                        <th className="text-left p-3">Class</th>
                        <th className="text-center p-3">Total Students</th>
                        <th className="text-center p-3">Present</th>
                        <th className="text-center p-3">Absent</th>
                        <th className="text-center p-3">Late</th>
                        <th className="text-center p-3">Rate</th>
                        <th className="text-left p-3">Submitted By</th>
                        <th className="text-center p-3">Time</th>
                        <th className="text-center p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceRecords.map((record, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-3">{record.date}</td>
                          <td className="p-3 font-medium">{record.class}</td>
                          <td className="p-3 text-center">{record.totalStudents}</td>
                          <td className="p-3 text-center text-green-600 font-medium">
                            {record.present}
                          </td>
                          <td className="p-3 text-center text-red-600 font-medium">
                            {record.absent}
                          </td>
                          <td className="p-3 text-center text-amber-600 font-medium">
                            {record.late}
                          </td>
                          <td className="p-3 text-center">
                            <Badge
                              variant={record.attendanceRate >= 95 ? 'default' : 'secondary'}
                            >
                              {record.attendanceRate}%
                            </Badge>
                          </td>
                          <td className="p-3 text-sm text-gray-600">{record.submittedBy}</td>
                          <td className="p-3 text-center text-sm text-gray-500">
                            {record.submittedAt}
                          </td>
                          <td className="p-3 text-center">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={() => {
                                setSelectedBroadsheetClass(record.class);
                                setShowBroadsheet(true);
                              }}
                              title="View Broadsheet"
                            >
                              <Eye className="w-4 h-4 text-blue-600" />
                              <span className="sr-only">View Broadsheet</span>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Discipline Tab */}
        <TabsContent value="discipline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Discipline Log</CardTitle>
              <CardDescription>
                Review teacher-reported offenses and take action
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {disciplineCases.map((disciplineCase) => (
                  <div
                    key={disciplineCase.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-blue-950">
                            {disciplineCase.studentName}
                          </h3>
                          <Badge variant="outline">{disciplineCase.studentId}</Badge>
                          <Badge className={getSeverityColor(disciplineCase.severity)}>
                            {disciplineCase.severity.toUpperCase()}
                          </Badge>
                          <Badge className={getStatusColor(disciplineCase.status)}>
                            {disciplineCase.status.toUpperCase()}
                          </Badge>
                          {disciplineCase.notificationSent && (
                            <Badge variant="outline" className="bg-blue-50">
                              <Bell className="w-3 h-3 mr-1" />
                              Notified
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-600">Class:</span>
                            <span className="ml-2 font-medium">{disciplineCase.class}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Reported By:</span>
                            <span className="ml-2 font-medium">{disciplineCase.reportedBy}</span>
                          </div>
                        </div>

                        <div className="text-sm">
                          <span className="text-gray-600">Offense:</span>
                          <span className="ml-2 font-semibold text-red-700">
                            {disciplineCase.offense}
                          </span>
                        </div>

                        <div className="text-sm">
                          <span className="text-gray-600">Description:</span>
                          <p className="mt-1 text-gray-700">{disciplineCase.description}</p>
                        </div>

                        {disciplineCase.actionTaken && (
                          <div className="text-sm bg-blue-50 p-3 rounded">
                            <span className="text-gray-600 font-medium">Action Taken:</span>
                            <p className="mt-1 text-blue-900">{disciplineCase.actionTaken}</p>
                          </div>
                        )}

                        <div className="text-xs text-gray-500">
                          Reported: {disciplineCase.reportedDate}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        {disciplineCase.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => handleReviewDiscipline(disciplineCase)}
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Take Action
                          </Button>
                        )}
                        {disciplineCase.status === 'reviewed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleResolveCase(disciplineCase.id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark Resolved
                          </Button>
                        )}
                        <Button size="sm" variant="ghost">
                          <Eye className="w-4 h-4 mr-2" />
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

        {/* Exeat Management Tab */}
        <TabsContent value="exeat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exeat Applications</CardTitle>
              <CardDescription>
                Review and approve/reject student exeat applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {exeatApplications.map((application) => (
                  <div
                    key={application.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-blue-950">
                            {application.studentName}
                          </h3>
                          <Badge variant="outline">{application.studentId}</Badge>
                          <Badge variant="outline">{application.class}</Badge>
                          <Badge className={getStatusColor(application.status)}>
                            {application.status.toUpperCase()}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-600">Reason:</span>
                            <span className="ml-2 font-medium">{application.reason}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Destination:</span>
                            <span className="ml-2 font-medium">{application.destination}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Departure:</span>
                            <span className="ml-2 font-medium">{application.departureDate}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Return:</span>
                            <span className="ml-2 font-medium">{application.returnDate}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Parent Contact:</span>
                            <span className="ml-2 font-medium">{application.parentContact}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Applied:</span>
                            <span className="ml-2 text-gray-500">{application.appliedDate}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        {application.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleExeatAction(application, 'approve')}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleExeatAction(application, 'reject')}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="ghost">
                          <Eye className="w-4 h-4 mr-2" />
                          Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Discipline Action Dialog */}
      <Dialog open={showDisciplineDialog} onOpenChange={setShowDisciplineDialog}>
        <DialogContent className="w-[95vw] max-w-2xl">
          <DialogHeader>
            <DialogTitle>Take Action on Discipline Case</DialogTitle>
            <DialogDescription>
              Review the offense and specify the action taken. Notifications will be sent to all
              school admins, teachers, and the student's parent.
            </DialogDescription>
          </DialogHeader>

          {selectedDiscipline && (
            <ScrollArea className="max-h-[400px] pr-4">
              <div className="space-y-4">
                {/* Student Info */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{selectedDiscipline.studentName}</h3>
                    <Badge variant="outline">{selectedDiscipline.studentId}</Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Class:</span>
                      <span className="ml-2 font-medium">{selectedDiscipline.class}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Severity:</span>
                      <Badge className={getSeverityColor(selectedDiscipline.severity) + ' ml-2'}>
                        {selectedDiscipline.severity.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Offense Details */}
                <div className="space-y-2">
                  <div>
                    <Label>Offense Type</Label>
                    <p className="mt-1 font-semibold text-red-700">{selectedDiscipline.offense}</p>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <p className="mt-1 text-gray-700">{selectedDiscipline.description}</p>
                  </div>
                  <div>
                    <Label>Reported By</Label>
                    <p className="mt-1 text-gray-700">{selectedDiscipline.reportedBy}</p>
                  </div>
                  <div>
                    <Label>Reported Date</Label>
                    <p className="mt-1 text-sm text-gray-500">{selectedDiscipline.reportedDate}</p>
                  </div>
                </div>

                {/* Action Input */}
                <div className="space-y-2">
                  <Label htmlFor="actionTaken">Action Taken *</Label>
                  <Textarea
                    id="actionTaken"
                    value={actionTaken}
                    onChange={(e) => setActionTaken(e.target.value)}
                    placeholder="Enter the disciplinary action taken (e.g., Warning issued, Suspension for 3 days, Parent meeting scheduled, etc.)"
                    rows={4}
                    className="resize-none"
                  />
                </div>

                {/* Notification Info */}
                <div className="bg-blue-50 p-3 rounded-lg text-sm">
                  <div className="flex items-start gap-2">
                    <Bell className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">Automatic Notifications</p>
                      <p className="text-blue-700 mt-1">
                        Once submitted, notifications will be sent to:
                      </p>
                      <ul className="list-disc list-inside text-blue-700 mt-1 space-y-1">
                        <li>All School Administrators</li>
                        <li>All Teachers</li>
                        <li>Student's Parent/Guardian</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDisciplineDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitAction}>
              <Send className="w-4 h-4 mr-2" />
              Submit Action & Notify All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
