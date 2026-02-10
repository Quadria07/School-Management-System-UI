import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Check, X, Clock, Users, Download, TrendingDown, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import * as dataFlowService from '../../../utils/dataFlowService';
import { useAuth } from '../../../contexts/AuthContext';
import { AttendanceBroadsheet } from '../principal/AttendanceBroadsheet';

interface Student {
  id: string;
  name: string;
  admissionNumber: string;
  status: 'present' | 'absent' | 'late' | null;
  attendanceRate: number;
  totalAbsences: number;
}

export const AttendanceRegister: React.FC = () => {
  const { user } = useAuth();
  const [selectedClass, setSelectedClass] = useState('JSS 3A');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [showBroadsheet, setShowBroadsheet] = useState(false);

  const [students, setStudents] = useState<Student[]>([]);
  const [teacherClasses, setTeacherClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Initial load: fetch classes
  React.useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await TeacherAPI.getClasses();
        if (res.status === 'success' && res.data) {
          const classes = res.data as any[];
          setTeacherClasses(classes);
          if (classes.length > 0 && !selectedClass) {
            setSelectedClass(classes[0].name || classes[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };
    fetchClasses();
  }, []);

  // Fetch students when class changes
  React.useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedClass) return;
      setLoading(true);
      try {
        const res = await TeacherAPI.getStudentsByClass(selectedClass);
        if (res.status === 'success' && res.data) {
          const fetchedStudents = (res.data as any[]).map(s => ({
            id: s.id,
            name: s.name || s.studentName,
            admissionNumber: s.admissionNumber,
            status: null,
            attendanceRate: 95, // Mock value if not in API
            totalAbsences: 0
          }));
          setStudents(fetchedStudents);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [selectedClass]);

  const handleStatusChange = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId ? { ...student, status } : student
      )
    );
  };

  const handleMarkAll = (status: 'present' | 'absent') => {
    setStudents((prev) =>
      prev.map((student) => ({ ...student, status }))
    );
    toast.success(`All students marked as ${status}`);
  };

  const handleSaveAttendance = () => {
    const unmarked = students.filter((s) => s.status === null);
    if (unmarked.length > 0) {
      toast.error(`Please mark attendance for ${unmarked.length} student(s)`);
      return;
    }

    // ✅ Save attendance to localStorage
    const attendanceRecord: dataFlowService.AttendanceRecord = {
      id: `att_${Date.now()}_${selectedClass}`,
      teacherId: user.id,
      teacherName: user.name,
      class: selectedClass,
      subject: selectedSubject,
      date: format(selectedDate, 'yyyy-MM-dd'),
      students: students.map(s => ({
        id: s.id,
        studentName: s.name,
        admissionNumber: s.admissionNumber,
        status: s.status as 'present' | 'absent' | 'late' | 'excused',
      })),
      timestamp: new Date().toISOString(),
    };

    dataFlowService.saveAttendanceRecord(attendanceRecord);
    toast.success('Attendance saved successfully');
  };

  const handleSubmitAttendance = () => {
    const unmarked = students.filter((s) => s.status === null);
    if (unmarked.length > 0) {
      toast.error(`Please mark attendance for ${unmarked.length} student(s)`);
      return;
    }

    // ✅ Save and submit attendance to localStorage
    const attendanceRecord: dataFlowService.AttendanceRecord = {
      id: `att_${Date.now()}_${selectedClass}`,
      teacherId: user.id,
      teacherName: user.name,
      class: selectedClass,
      subject: selectedSubject,
      date: format(selectedDate, 'yyyy-MM-dd'),
      students: students.map(s => ({
        id: s.id,
        studentName: s.name,
        admissionNumber: s.admissionNumber,
        status: s.status as 'present' | 'absent' | 'late' | 'excused',
      })),
      timestamp: new Date().toISOString(),
    };

    dataFlowService.saveAttendanceRecord(attendanceRecord);
    toast.success('Attendance submitted to Administration', {
      description: `${presentCount} present, ${absentCount} absent, ${lateCount} late`,
    });
  };

  const presentCount = students.filter((s) => s.status === 'present').length;
  const absentCount = students.filter((s) => s.status === 'absent').length;
  const lateCount = students.filter((s) => s.status === 'late').length;
  const unmarkedCount = students.filter((s) => s.status === null).length;

  const frequentAbsentees = students
    .filter((s) => s.attendanceRate < 90)
    .sort((a, b) => a.attendanceRate - b.attendanceRate);

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Broadsheet Dialog/Overlay */}
      <Dialog open={showBroadsheet} onOpenChange={setShowBroadsheet}>
        <DialogContent className="max-w-[95vw] w-full h-[95vh] p-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>Attendance Broadsheet</DialogTitle>
            <DialogDescription>
              Comprehensive attendance register for the term.
            </DialogDescription>
          </DialogHeader>
          <AttendanceBroadsheet
            onClose={() => setShowBroadsheet(false)}
            classLevel={selectedClass}
          />
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl mb-2 text-blue-950">
            Attendance Register
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Daily Roll-Call & Attendance Management
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto flex-wrap">
          <Button
            variant="outline"
            onClick={() => setShowBroadsheet(true)}
            className="flex-1 sm:flex-none text-xs sm:text-sm bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
          >
            <Download className="w-4 h-4 mr-2" />
            View Attendance Sheet
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.success('Attendance report downloaded')}
            className="flex-1 sm:flex-none text-xs sm:text-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            variant="outline"
            onClick={handleSaveAttendance}
            className="flex-1 sm:flex-none text-xs sm:text-sm"
          >
            Save
          </Button>
          <Button
            onClick={handleSubmitAttendance}
            className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm"
          >
            Submit
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Present</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl sm:text-3xl text-blue-950">{presentCount}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {((presentCount / students.length) * 100).toFixed(0)}%
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Check className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Absent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl sm:text-3xl text-blue-950">{absentCount}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {((absentCount / students.length) * 100).toFixed(0)}%
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Late</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl sm:text-3xl text-blue-950">{lateCount}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {((lateCount / students.length) * 100).toFixed(0)}%
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Unmarked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl sm:text-3xl text-blue-950">{unmarkedCount}</p>
                <p className="text-xs text-gray-500 mt-1">Pending</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Attendance Roll Call */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Daily Roll Call</CardTitle>
                <CardDescription>
                  {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleMarkAll('present')}
                  className="text-xs"
                >
                  <Check className="w-3 h-3 mr-1" />
                  All Present
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleMarkAll('absent')}
                  className="text-xs"
                >
                  <X className="w-3 h-3 mr-1" />
                  All Absent
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="text-sm font-medium mb-2 block">Class</label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {teacherClasses.map(c => (
                      <SelectItem key={c.id || c.name} value={c.name}>{c.name}</SelectItem>
                    ))}
                    {teacherClasses.length === 0 && (
                      <>
                        <SelectItem value="JSS 3A">JSS 3A</SelectItem>
                        <SelectItem value="JSS 2B">JSS 2B</SelectItem>
                        <SelectItem value="JSS 1C">JSS 1C</SelectItem>
                        <SelectItem value="SSS 2A">SSS 2A</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Subject</label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Further Mathematics">
                      Further Mathematics
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Period</label>
                <Select defaultValue="2nd">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st">1st Period</SelectItem>
                    <SelectItem value="2nd">2nd Period</SelectItem>
                    <SelectItem value="3rd">3rd Period</SelectItem>
                    <SelectItem value="4th">4th Period</SelectItem>
                    <SelectItem value="5th">5th Period</SelectItem>
                    <SelectItem value="6th">6th Period</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Student List */}
            <div className="space-y-2">
              {students.map((student, index) => (
                <div
                  key={student.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-gray-50 gap-3"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-gray-500 font-medium w-6">{index + 1}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{student.name}</h4>
                      <p className="text-xs text-gray-500">
                        {student.admissionNumber} • {student.attendanceRate}% attendance
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={student.status === 'present' ? 'default' : 'outline'}
                      onClick={() => handleStatusChange(student.id, 'present')}
                      className={`flex-1 sm:flex-none ${student.status === 'present'
                        ? 'bg-green-600 hover:bg-green-700'
                        : ''
                        }`}
                    >
                      <Check className="w-3 h-3 sm:mr-1" />
                      <span className="hidden sm:inline">Present</span>
                    </Button>
                    <Button
                      size="sm"
                      variant={student.status === 'late' ? 'default' : 'outline'}
                      onClick={() => handleStatusChange(student.id, 'late')}
                      className={`flex-1 sm:flex-none ${student.status === 'late'
                        ? 'bg-amber-600 hover:bg-amber-700'
                        : ''
                        }`}
                    >
                      <Clock className="w-3 h-3 sm:mr-1" />
                      <span className="hidden sm:inline">Late</span>
                    </Button>
                    <Button
                      size="sm"
                      variant={student.status === 'absent' ? 'default' : 'outline'}
                      onClick={() => handleStatusChange(student.id, 'absent')}
                      className={`flex-1 sm:flex-none ${student.status === 'absent' ? 'bg-red-600 hover:bg-red-700' : ''
                        }`}
                    >
                      <X className="w-3 h-3 sm:mr-1" />
                      <span className="hidden sm:inline">Absent</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Attendance Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5" />
              Frequent Absentees
            </CardTitle>
            <CardDescription>Students requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            {frequentAbsentees.length > 0 ? (
              <div className="space-y-3">
                {frequentAbsentees.map((student) => (
                  <div
                    key={student.id}
                    className="p-3 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{student.name}</h4>
                        <p className="text-xs text-gray-600">
                          {student.admissionNumber}
                        </p>
                      </div>
                      <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Attendance Rate:</span>
                      <Badge className="bg-red-100 text-red-700">
                        {student.attendanceRate}%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs mt-1">
                      <span className="text-gray-600">Total Absences:</span>
                      <span className="font-medium">{student.totalAbsences} days</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full mt-3 text-xs"
                      onClick={() =>
                        toast.success(`Report sent to Principal and Parent`)
                      }
                    >
                      Report to Principal/Parent
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Check className="w-12 h-12 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  All students have good attendance!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};