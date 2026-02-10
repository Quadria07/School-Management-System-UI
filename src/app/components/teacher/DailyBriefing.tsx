import React, { useState } from 'react';
import {
  Clock,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Coffee,
  Bell,
  Users,
  Cake,
  ClipboardCheck,
  MessageSquare,
  Calendar,
  MapPin,
  Briefcase,
  FileWarning,
  TrendingUp,
  UserX,
  Heart,
  Flag,
  X,
  ExternalLink,
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
import { toast } from 'sonner';
import { TeacherAPI, SchoolAPI } from '../../../utils/api';
import { useAuth } from '../../../contexts/AuthContext';

interface PeriodSchedule {
  id: string;
  startTime: string;
  endTime: string;
  type: 'class' | 'break' | 'free';
  subject?: string;
  class?: string;
  room?: string;
  lessonNoteStatus?: 'approved' | 'missing' | 'pending';
  topic?: string;
  resourcesNeeded?: string[];
}

interface Duty {
  id: string;
  type: string;
  time: string;
  location: string;
  priority: 'high' | 'medium' | 'low';
}

interface StudentHighlight {
  id: string;
  type: 'birthday' | 'absence' | 'medical' | 'special';
  studentName: string;
  class: string;
  message: string;
  time?: string;
}

interface PendingTask {
  id: string;
  type: 'grading' | 'feedback' | 'submission';
  title: string;
  description: string;
  deadline: string;
  urgent: boolean;
}

interface DailyBriefingProps {
  onNavigate?: (page: string) => void;
}

export const DailyBriefing: React.FC<DailyBriefingProps> = ({ onNavigate }) => {
  // Dialog states
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodSchedule | null>(null);
  const [selectedTask, setSelectedTask] = useState<PendingTask | null>(null);
  const [showLessonNoteDialog, setShowLessonNoteDialog] = useState(false);
  const [showTaskDialog, setShowTaskDialog] = useState(false);

  const [loading, setLoading] = useState(true);
  const [todaySchedule, setTodaySchedule] = useState<PeriodSchedule[]>([]);
  const [duties, setDuties] = useState<Duty[]>([]);
  const [studentHighlights, setStudentHighlights] = useState<StudentHighlight[]>([]);
  const [pendingTasks, setPendingTasks] = useState<PendingTask[]>([]);
  const { user } = useAuth();
  const [academicSettings, setAcademicSettings] = useState<{
    term: string;
    session: string;
  }>({ term: '', session: '' });

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, settingsRes] = await Promise.all([
          TeacherAPI.getStats(),
          SchoolAPI.getAcademicSettings()
        ]);

        if (statsRes.status === 'success' && statsRes.data) {
          const statsData = statsRes.data as any;
          if (statsData.todaySchedule) setTodaySchedule(statsData.todaySchedule);
          if (statsData.duties) setDuties(statsData.duties);
          if (statsData.studentHighlights) setStudentHighlights(statsData.studentHighlights);
          if (statsData.pendingTasks) setPendingTasks(statsData.pendingTasks);
        }

        if (settingsRes.status === 'success' && settingsRes.data) {
          const data = settingsRes.data as any;
          setAcademicSettings({
            term: data.currentTerm || '',
            session: data.currentSession || ''
          });
        }
      } catch (error) {
        console.error('Error fetching briefing data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return hours * 60 + minutes; // Convert to minutes since midnight
  };

  const getTimeInMinutes = (timeStr: string) => {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  const isPeriodCurrent = (period: PeriodSchedule) => {
    const currentTime = getCurrentTime();
    const startTime = getTimeInMinutes(period.startTime);
    const endTime = getTimeInMinutes(period.endTime);
    return currentTime >= startTime && currentTime < endTime;
  };

  const isPeriodUpcoming = (period: PeriodSchedule) => {
    const currentTime = getCurrentTime();
    const startTime = getTimeInMinutes(period.startTime);
    return currentTime < startTime;
  };

  const getHighlightIcon = (type: string) => {
    switch (type) {
      case 'birthday':
        return <Cake className="w-5 h-5 text-pink-600" />;
      case 'absence':
        return <UserX className="w-5 h-5 text-red-600" />;
      case 'medical':
        return <Heart className="w-5 h-5 text-blue-600" />;
      case 'special':
        return <Flag className="w-5 h-5 text-amber-600" />;
      default:
        return <Users className="w-5 h-5 text-gray-600" />;
    }
  };

  const getHighlightColor = (type: string) => {
    switch (type) {
      case 'birthday':
        return 'bg-pink-50 border-pink-200';
      case 'absence':
        return 'bg-red-50 border-red-200';
      case 'medical':
        return 'bg-blue-50 border-blue-200';
      case 'special':
        return 'bg-amber-50 border-amber-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const approvedNotesCount = todaySchedule.filter(
    (p) => p.type === 'class' && p.lessonNoteStatus === 'approved'
  ).length;
  const missingNotesCount = todaySchedule.filter(
    (p) => p.type === 'class' && p.lessonNoteStatus === 'missing'
  ).length;
  const totalClasses = todaySchedule.filter((p) => p.type === 'class').length;

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl mb-2 text-blue-950 flex items-center gap-2">
            <Calendar className="w-7 h-7 sm:w-8 sm:h-8" />
            Daily Briefing
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • {academicSettings.term || user?.currentTerm || 'First Term'} • Session {academicSettings.session || user?.academicSession || '2024/2025'}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-green-600 text-white px-4 py-2">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            {approvedNotesCount}/{totalClasses} Notes Ready
          </Badge>
          {missingNotesCount > 0 && (
            <Badge className="bg-red-600 text-white px-4 py-2">
              <AlertCircle className="w-4 h-4 mr-2" />
              {missingNotesCount} Missing
            </Badge>
          )}
        </div>
      </div>

      {/* Critical Alerts */}
      {missingNotesCount > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <AlertTitle className="text-red-900">Action Required: Missing Lesson Notes</AlertTitle>
          <AlertDescription className="text-red-800">
            You have {missingNotesCount} class(es) today without approved lesson notes. Create them now to avoid issues.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Timeline - 2 columns on large screens */}
        <div className="lg:col-span-2 space-y-4">
          {/* Today's Schedule Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Today's Timeline
              </CardTitle>
              <CardDescription>Your complete schedule from first bell to last bell</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todaySchedule.map((period, index) => (
                  <div
                    key={period.id}
                    className={`relative ${index !== todaySchedule.length - 1
                      ? 'border-l-2 border-gray-200 pl-6 pb-6 ml-3'
                      : 'pl-6 ml-3'
                      }`}
                  >
                    {/* Timeline Dot */}
                    <div
                      className={`absolute left-[-9px] top-2 w-4 h-4 rounded-full border-2 ${isPeriodCurrent(period)
                        ? 'bg-blue-600 border-blue-600 animate-pulse'
                        : isPeriodUpcoming(period)
                          ? 'bg-white border-gray-400'
                          : 'bg-green-600 border-green-600'
                        }`}
                    />

                    {period.type === 'class' ? (
                      <div
                        className={`p-4 rounded-lg border-2 ${isPeriodCurrent(period)
                          ? 'bg-blue-50 border-blue-300'
                          : 'bg-white border-gray-200'
                          }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="font-medium text-gray-600 text-sm">
                                {period.startTime} – {period.endTime}
                              </span>
                              {isPeriodCurrent(period) && (
                                <Badge className="bg-blue-600 text-white">
                                  <Clock className="w-3 h-3 mr-1" />
                                  Now
                                </Badge>
                              )}
                            </div>
                            <h3 className="text-lg font-semibold mb-1">
                              {period.subject} | {period.class}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                              <MapPin className="w-4 h-4" />
                              {period.room}
                            </div>
                            <p className="text-sm text-gray-700 mb-2">
                              <span className="font-medium">Topic:</span> {period.topic}
                            </p>

                            {/* Lesson Note Status */}
                            <div className="flex items-center gap-2 mb-3">
                              {period.lessonNoteStatus === 'approved' ? (
                                <Badge className="bg-green-100 text-green-800">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Lesson Note Approved
                                </Badge>
                              ) : period.lessonNoteStatus === 'pending' ? (
                                <Badge className="bg-amber-100 text-amber-800">
                                  <Clock className="w-3 h-3 mr-1" />
                                  Pending Approval
                                </Badge>
                              ) : (
                                <Badge className="bg-red-100 text-red-800">
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  No Approved Note!
                                </Badge>
                              )}
                            </div>

                            {/* Resources Needed */}
                            {period.resourcesNeeded && period.resourcesNeeded.length > 0 && (
                              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                <p className="text-sm font-medium text-amber-900 mb-1 flex items-center gap-2">
                                  <Briefcase className="w-4 h-4" />
                                  Resources to Bring:
                                </p>
                                <ul className="text-xs text-amber-800 list-disc list-inside">
                                  {period.resourcesNeeded.map((resource, idx) => (
                                    <li key={idx}>{resource}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col gap-2">
                            {period.lessonNoteStatus === 'missing' ? (
                              <Button
                                size="sm"
                                className="bg-red-600 hover:bg-red-700 text-xs"
                                onClick={() => {
                                  if (onNavigate) {
                                    onNavigate('/lesson-notes');
                                  }
                                  toast.info('Create a lesson note for ' + period.topic);
                                }}
                              >
                                <FileWarning className="w-3 h-3 mr-1" />
                                Create Note
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs"
                                onClick={() => {
                                  setSelectedPeriod(period);
                                  setShowLessonNoteDialog(true);
                                }}
                              >
                                <BookOpen className="w-3 h-3 mr-1" />
                                View Note
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : period.type === 'break' ? (
                      <div className="p-3 bg-gray-100 rounded-lg border border-gray-300">
                        <div className="flex items-center gap-2">
                          <Coffee className="w-5 h-5 text-gray-600" />
                          <div>
                            <p className="font-medium text-gray-700">Break Time</p>
                            <p className="text-sm text-gray-600">
                              {period.startTime} – {period.endTime}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="font-medium text-green-700">Free Period</p>
                            <p className="text-sm text-green-600">
                              {period.startTime} – {period.endTime} • Mark scripts or prepare notes
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5" />
                Pending Tasks
              </CardTitle>
              <CardDescription>Action items that need your attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-lg border ${task.urgent
                      ? 'bg-red-50 border-red-200'
                      : 'bg-white border-gray-200'
                      }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">{task.title}</h4>
                          {task.urgent && (
                            <Badge className="bg-red-600 text-white text-xs">Urgent</Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-700 mb-2">{task.description}</p>
                        <p className="text-xs text-gray-500">
                          <Clock className="w-3 h-3 inline mr-1" />
                          Due: {task.deadline}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={() => {
                          setSelectedTask(task);
                          setShowTaskDialog(true);
                        }}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                ))}

                {pendingTasks.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
                    <p className="text-gray-600">All caught up! No pending tasks.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          {/* Administrative & Extra-Curricular Duties */}
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
                    <CheckCircle2 className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">No special duties today</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Student Highlights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Student Highlights
              </CardTitle>
              <CardDescription>Important student information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {studentHighlights.map((highlight) => (
                  <div
                    key={highlight.id}
                    className={`p-3 rounded-lg border ${getHighlightColor(highlight.type)}`}
                  >
                    <div className="flex items-start gap-2">
                      {getHighlightIcon(highlight.type)}
                      <div className="flex-1">
                        <h4 className="font-medium text-sm mb-1">
                          {highlight.studentName}
                          <Badge variant="outline" className="ml-2 text-xs">
                            {highlight.class}
                          </Badge>
                        </h4>
                        <p className="text-xs text-gray-700">{highlight.message}</p>
                        {highlight.time && (
                          <p className="text-xs text-gray-500 mt-1">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {highlight.time}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {studentHighlights.length === 0 && (
                  <div className="text-center py-6">
                    <Users className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">No student highlights today</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats Summary */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-950">
                <TrendingUp className="w-5 h-5" />
                Day Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-900">Total Classes:</span>
                <span className="font-semibold text-blue-950">{totalClasses}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-900">Free Periods:</span>
                <span className="font-semibold text-blue-950">
                  {todaySchedule.filter((p) => p.type === 'free').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-900">Special Duties:</span>
                <span className="font-semibold text-blue-950">{duties.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-900">Pending Tasks:</span>
                <span className="font-semibold text-red-600">
                  {pendingTasks.filter((t) => t.urgent).length} urgent
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Lesson Note Dialog */}
      <Dialog open={showLessonNoteDialog} onOpenChange={setShowLessonNoteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Lesson Note Details</DialogTitle>
            <DialogDescription>
              View lesson note information for {selectedPeriod?.subject} | {selectedPeriod?.class}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Topic:</p>
              <p className="text-sm text-gray-700">{selectedPeriod?.topic}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Class:</p>
              <p className="text-sm text-gray-700">{selectedPeriod?.class}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Room:</p>
              <p className="text-sm text-gray-700">{selectedPeriod?.room}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Time:</p>
              <p className="text-sm text-gray-700">
                {selectedPeriod?.startTime} – {selectedPeriod?.endTime}
              </p>
            </div>
            {selectedPeriod?.resourcesNeeded && selectedPeriod.resourcesNeeded.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Resources Needed:</p>
                <ul className="text-sm text-gray-700 list-disc list-inside">
                  {selectedPeriod?.resourcesNeeded?.map((resource, idx) => (
                    <li key={idx}>{resource}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <CheckCircle2 className="w-4 h-4 inline mr-1" />
                This lesson note has been approved by the Principal.
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowLessonNoteDialog(false)}
            >
              Close
            </Button>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                setShowLessonNoteDialog(false);
                toast.info('Opening lesson notes...');
                if (onNavigate) {
                  onNavigate('/lesson-notes');
                }
              }}
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              View Full Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Task Dialog */}
      <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedTask?.urgent && (
                <Badge className="bg-red-600 text-white">Urgent</Badge>
              )}
              Task Details
            </DialogTitle>
            <DialogDescription>
              {selectedTask?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Description:</p>
              <p className="text-sm text-gray-700">{selectedTask?.description}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Deadline:</p>
              <p className="text-sm text-red-600 font-semibold">{selectedTask?.deadline}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Type:</p>
              <Badge variant="outline">
                {selectedTask?.type === 'grading'
                  ? 'Grading Task'
                  : selectedTask?.type === 'feedback'
                    ? 'Principal Feedback'
                    : 'Assessment Submission'}
              </Badge>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowTaskDialog(false)}
            >
              Close
            </Button>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                setShowTaskDialog(false);
                if (selectedTask?.type === 'grading') {
                  toast.info('Opening gradebook...');
                  if (onNavigate) {
                    onNavigate('/gradebook');
                  }
                } else if (selectedTask?.type === 'feedback') {
                  toast.info('Opening lesson notes...');
                  if (onNavigate) {
                    onNavigate('/lesson-notes');
                  }
                } else if (selectedTask?.type === 'submission') {
                  toast.info('Opening assessments...');
                  if (onNavigate) {
                    onNavigate('/assessments');
                  }
                }
              }}
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              {selectedTask?.type === 'grading'
                ? 'Open Gradebook'
                : selectedTask?.type === 'feedback'
                  ? 'View Lesson Note'
                  : 'Open Assessment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};