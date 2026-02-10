import React, { useState, useEffect } from 'react';
import {
  Calendar,
  BookOpen,
  Bell,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Target,
  Award,
  ClipboardCheck,
  ArrowRight,
  BarChart3,
  X,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Progress } from '../ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { StudentAPI } from '../../../utils/api';
import { useAuth } from '../../../contexts/AuthContext';

interface TimetableClass {
  id: string;
  time: string;
  subject: string;
  teacher: string;
  room: string;
  status: 'upcoming' | 'current' | 'completed';
}

interface Announcement {
  id: string;
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  date: string;
}

interface PendingTask {
  id: string;
  type: 'assignment' | 'exam' | 'project';
  title: string;
  subject: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
}

interface StudentCommandCenterProps {
  onNavigate?: (page: string) => void;
}

export const StudentCommandCenter: React.FC<StudentCommandCenterProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [showAllTasksDialog, setShowAllTasksDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [profileRes, statsRes] = await Promise.all([
          StudentAPI.getProfile(),
          StudentAPI.getStats()
        ]);

        if (profileRes.status === 'success') setProfile(profileRes.data);
        if (statsRes.status === 'success') setStats(statsRes.data);
      } catch (error) {
        console.error('Error fetching student data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const [todayClasses] = useState<TimetableClass[]>([]);
  const [announcements] = useState<Announcement[]>([]);
  const [pendingTasks] = useState<PendingTask[]>([]);

  // Performance data (derived from API where possible)
  const currentGPA = stats?.average_score ? (parseFloat(stats.average_score) / 20).toFixed(2) : '0.00'; // Mock conversion
  const classRank = 'N/A';
  const totalStudents = 'N/A';

  const subjects = [
    { name: 'Mathematics', grade: 'A', score: 92, trend: 'up' },
    { name: 'English', grade: 'A', score: 88, trend: 'up' },
  ];

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'exam':
        return <FileText className="w-4 h-4" />;
      case 'project':
        return <Target className="w-4 h-4" />;
      default:
        return <ClipboardCheck className="w-4 h-4" />;
    }
  };

  const getTaskColor = (type: string) => {
    switch (type) {
      case 'exam':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'project':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const handleNavigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl mb-2 text-blue-950">
            Welcome back, {profile?.full_name || user?.name || 'Student'}! 👋
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • {profile?.class_name || 'Generic Class'} • Academic Session 2024/2025
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700"
            onClick={() => handleNavigate('/timetable')}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Full Timetable
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Loading your command center...</span>
        </div>
      )}

      {/* Urgent Announcements */}
      {!loading && announcements.filter((a) => a.priority === 'high').length > 0 && (
        <Alert className="border-amber-200 bg-amber-50">
          <Bell className="h-5 w-5 text-amber-600" />
          <AlertTitle className="text-amber-900">Important Announcement</AlertTitle>
          <AlertDescription className="text-amber-800">
            {announcements.find((a) => a.priority === 'high')?.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Main Grid */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - 2 columns wide */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Today's Timetable */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Today's Classes
                    </CardTitle>
                    <CardDescription>Your schedule for today</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleNavigate('/timetable')}>
                    View Full Week
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todayClasses.map((classItem) => (
                    <div
                      key={classItem.id}
                      className={`p-4 rounded-lg border-2 ${classItem.status === 'current'
                        ? 'bg-blue-50 border-blue-300'
                        : classItem.status === 'completed'
                          ? 'bg-gray-50 border-gray-200 opacity-60'
                          : 'bg-white border-gray-200'
                        }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-gray-600">
                              {classItem.time}
                            </span>
                            {classItem.status === 'current' && (
                              <Badge className="bg-blue-600 text-white">
                                <Clock className="w-3 h-3 mr-1" />
                                Now
                              </Badge>
                            )}
                            {classItem.status === 'completed' && (
                              <Badge className="bg-green-600 text-white">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Done
                              </Badge>
                            )}
                          </div>
                          <h3 className="font-semibold text-lg mb-1">{classItem.subject}</h3>
                          <p className="text-sm text-gray-600">
                            {classItem.teacher} • {classItem.room}
                          </p>
                        </div>
                        {classItem.status !== 'completed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleNavigate('/learning-hub')}
                          >
                            <BookOpen className="w-3 h-3 mr-1" />
                            Materials
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pending Tasks */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <ClipboardCheck className="w-5 h-5" />
                      Pending Tasks
                    </CardTitle>
                    <CardDescription>Assignments and exams this week</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAllTasksDialog(true)}
                  >
                    View All
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingTasks.slice(0, 4).map((task) => (
                    <div
                      key={task.id}
                      className={`p-4 rounded-lg border ${task.status === 'submitted'
                        ? 'bg-green-50 border-green-200'
                        : getTaskColor(task.type)
                        }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {getTaskIcon(task.type)}
                            <h4 className="font-medium text-sm">{task.title}</h4>
                          </div>
                          <p className="text-xs text-gray-600 mb-1">
                            {task.subject}
                          </p>
                          <p className="text-xs text-gray-500">
                            <Clock className="w-3 h-3 inline mr-1" />
                            Due: {task.dueDate}
                          </p>
                        </div>
                        <div>
                          {task.status === 'submitted' ? (
                            <Badge className="bg-green-600 text-white">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Submitted
                            </Badge>
                          ) : (
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={() => {
                                if (task.type === 'exam') {
                                  handleNavigate('/exams');
                                } else {
                                  handleNavigate('/assignment-submit');
                                }
                              }}
                            >
                              {task.type === 'exam' ? 'Start Exam' : 'Submit'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Announcements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Announcements
                </CardTitle>
                <CardDescription>Latest school updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {announcements.slice(0, 3).map((announcement) => (
                    <div
                      key={announcement.id}
                      className={`p-3 rounded-lg border ${announcement.priority === 'high'
                        ? 'bg-red-50 border-red-200'
                        : 'bg-blue-50 border-blue-200'
                        }`}
                    >
                      <h4 className="font-medium text-sm mb-1">{announcement.title}</h4>
                      <p className="text-xs text-gray-600 mb-1">{announcement.message}</p>
                      <p className="text-xs text-gray-500">{announcement.date}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* All Tasks Dialog */}
      <Dialog open={showAllTasksDialog} onOpenChange={setShowAllTasksDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>All Pending Tasks</DialogTitle>
            <DialogDescription>Assignments and exams this week</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {pendingTasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-lg border ${task.status === 'submitted'
                  ? 'bg-green-50 border-green-200'
                  : getTaskColor(task.type)
                  }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getTaskIcon(task.type)}
                      <h4 className="font-medium text-sm">{task.title}</h4>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">
                      {task.subject}
                    </p>
                    <p className="text-xs text-gray-500">
                      <Clock className="w-3 h-3 inline mr-1" />
                      Due: {task.dueDate}
                    </p>
                  </div>
                  <div>
                    {task.status === 'submitted' ? (
                      <Badge className="bg-green-600 text-white">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Submitted
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => {
                          if (task.type === 'exam') {
                            handleNavigate('/exams');
                          } else {
                            handleNavigate('/assignment-submit');
                          }
                        }}
                      >
                        {task.type === 'exam' ? 'Start Exam' : 'Submit'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 mt-4"
            onClick={() => setShowAllTasksDialog(false)}
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};