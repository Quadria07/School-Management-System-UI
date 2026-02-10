import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  Users,
  FileText,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  MessageSquare,
  ClipboardCheck,
  Upload,
  Bell,
  BarChart3,
  Monitor,
  FileEdit,
  ClipboardList,
  PlusCircle,
  MapPin,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { TeacherAPI } from '../../../utils/api';
import { useAuth } from '../../../contexts/AuthContext';

interface TodaySchedule {
  id: string;
  period: string;
  time: string;
  subject: string;
  class: string;
  room: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

interface AssignmentStatus {
  id: string;
  title: string;
  class: string;
  totalStudents: number;
  submitted: number;
  dueDate: string;
}

interface Duty {
  id: string;
  type: string;
  time: string;
  location: string;
  priority: 'high' | 'medium' | 'low';
}

interface PrincipalFeedback {
  id: string;
  lessonNote: string;
  subject: string;
  class: string;
  feedback: string;
  status: 'approved' | 'revision-needed';
  date: string;
}

interface ClassroomOverviewProps {
  onNavigate?: (page: string) => void;
}

export const ClassroomOverview: React.FC<ClassroomOverviewProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [teacherClasses, setTeacherClasses] = useState<any[]>([]);
  const [todaySchedule, setTodaySchedule] = useState<TodaySchedule[]>([]);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, classesRes] = await Promise.all([
          TeacherAPI.getStats(),
          TeacherAPI.getClasses()
        ]);

        if (statsRes.status === 'success') setStats(statsRes.data);
        if (classesRes.status === 'success') {
          const classesData = (classesRes.data || []) as any[];
          setTeacherClasses(classesData);
          setTodaySchedule([]);
        }
      } catch (error) {
        console.error('Error fetching teacher data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const [assignmentStatus] = useState<AssignmentStatus[]>([]);
  const [principalFeedback] = useState<PrincipalFeedback[]>([]);
  const [duties] = useState<Duty[]>([]);


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'ongoing':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'upcoming':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl mb-2 text-blue-950">
            Good Morning, {user?.name || 'Teacher'}
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • Academic Session {user?.academicSession || '2024/2025'}
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700"
            onClick={() => onNavigate && onNavigate('/daily-briefing')}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Daily Briefing
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Loading dashboard...</span>
        </div>
      )}

      {/* Quick Stats */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Classes Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl sm:text-3xl text-blue-950">{todaySchedule.length}</p>
                  <p className="text-xs text-gray-500 mt-1">Scheduled classes</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl sm:text-3xl text-blue-950">{stats?.total_students || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">Across {teacherClasses.length} classes</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pending Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl sm:text-3xl text-blue-950">0</p>
                  <p className="text-xs text-gray-500 mt-1">Assignments to grade</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <ClipboardCheck className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Lesson Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl sm:text-3xl text-blue-950">{stats?.total_lesson_notes || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">Total uploaded</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}


      {/* CBT Assessment Overview & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* CBT Assessment Stats */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="w-5 h-5" />
                  CBT Assessment Management
                </CardTitle>
                <CardDescription>Track your digital and paper-based assessments</CardDescription>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto" onClick={() => onNavigate && onNavigate('/assessments')}>
                <PlusCircle className="w-4 h-4 mr-2" />
                Create Assessment
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-blue-900">Total Assessments</p>
                  <ClipboardList className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-2xl text-blue-950">0</p>
                <p className="text-xs text-blue-600 mt-1">0 CBT • 0 Paper-based</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-green-900">Submitted</p>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-2xl text-green-950">0</p>
                <p className="text-xs text-green-600 mt-1">0 CBT • 0 Paper</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-amber-900">Draft</p>
                  <FileEdit className="w-5 h-5 text-amber-600" />
                </div>
                <p className="text-2xl text-amber-950">0</p>
                <p className="text-xs text-amber-600 mt-1">0 CBT • 0 Paper</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-center py-6 border-2 border-dashed rounded-lg">
                <Monitor className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">No assessments created yet</p>
                <Button variant="link" size="sm" className="text-blue-600" onClick={() => onNavigate && onNavigate('/assessments')}>
                  Create your first assessment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Frequently used tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700" onClick={() => onNavigate && onNavigate('/assessments')}>
                <Monitor className="w-4 h-4 mr-2" />
                Create CBT Assessment
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => onNavigate && onNavigate('/lesson-notes')}>
                <FileText className="w-4 h-4 mr-2" />
                Create Lesson Note
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => onNavigate && onNavigate('/lesson-notes')}>
                <Upload className="w-4 h-4 mr-2" />
                Upload Study Material
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => onNavigate && onNavigate('/gradebook')}>
                <BarChart3 className="w-4 h-4 mr-2" />
                Enter Grades
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => onNavigate && onNavigate('/class-management')}>
                <Users className="w-4 h-4 mr-2" />
                Mark Attendance
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => onNavigate && onNavigate('/communication')}>
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Today's Schedule */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Today's Schedule
            </CardTitle>
            <CardDescription>Your classes for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaySchedule.map((schedule) => (
                <div
                  key={schedule.id}
                  className={`p-3 sm:p-4 border rounded-lg ${getStatusColor(schedule.status)}`}
                >
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                      <h4 className="font-medium">{schedule.subject}</h4>
                      <Badge variant="outline" className="w-fit">
                        {schedule.class}
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {schedule.period} • {schedule.time} • {schedule.room}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Duties */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Today's Duties
            </CardTitle>
            <CardDescription>Administrative assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {duties.map((duty) => (
                <div
                  key={duty.id}
                  className={`p-3 rounded-lg border ${duty.priority === 'high'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-blue-50 border-blue-200'
                    }`}
                >
                  <div className="flex items-start gap-2">
                    {duty.priority === 'high' ? (
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Bell className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">{duty.type}</h4>
                      <p className="text-xs text-gray-600 mb-1">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {duty.time}
                      </p>
                      <p className="text-xs text-gray-600">
                        <MapPin className="w-3 h-3 inline mr-1" />
                        {duty.location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {duties.length === 0 && (
                <div className="text-center py-6">
                  <CheckCircle className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">No special duties today</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Assignment Submission Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Assignment Submissions
            </CardTitle>
            <CardDescription>Track student submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assignmentStatus.map((assignment) => (
                <div key={assignment.id} className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{assignment.title}</h4>
                      <p className="text-xs text-gray-600">{assignment.class}</p>
                    </div>
                    <Badge
                      variant={
                        assignment.submitted === assignment.totalStudents
                          ? 'default'
                          : 'secondary'
                      }
                      className="w-fit"
                    >
                      {assignment.submitted}/{assignment.totalStudents}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <Progress
                      value={(assignment.submitted / assignment.totalStudents) * 100}
                    />
                    <p className="text-xs text-gray-500">
                      Due: {assignment.dueDate}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Principal's Feedback */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Principal's Feedback
            </CardTitle>
            <CardDescription>Recent comments on your lesson notes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {principalFeedback.map((feedback) => (
                <div
                  key={feedback.id}
                  className={`p-3 sm:p-4 rounded-lg border ${feedback.status === 'approved'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-amber-50 border-amber-200'
                    }`}
                >
                  <div className="flex items-start gap-2 mb-2">
                    {feedback.status === 'approved' ? (
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm">{feedback.lessonNote}</h4>
                      <p className="text-xs text-gray-600">
                        {feedback.subject} • {feedback.class}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 mb-2">
                    {feedback.feedback}
                  </p>
                  <p className="text-xs text-gray-500">{feedback.date}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};