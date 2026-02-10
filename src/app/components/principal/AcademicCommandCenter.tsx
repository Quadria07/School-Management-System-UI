import React, { useState, useEffect } from 'react';
import {
  Bell,
  Calendar,
  Users,
  UserCheck,
  ClipboardCheck,
  Clock,
  AlertCircle,
  TrendingUp,
  FileText,
  Plus,
  Send,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
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
import { AdminAPI } from '../../../utils/api';
import { useAuth } from '../../../contexts/AuthContext';

interface PendingApproval {
  id: string;
  type: 'lesson-note' | 'result';
  teacher: string;
  subject: string;
  class: string;
  submittedDate: string;
}

interface TodayClass {
  time: string;
  subject: string;
  teacher: string;
  class: string;
  status: 'ongoing' | 'upcoming' | 'completed';
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
}

export const AcademicCommandCenter: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [schoolStats, setSchoolStats] = useState<any>(null);
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const [showAnnouncementDialog, setShowAnnouncementDialog] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementContent, setAnnouncementContent] = useState('');
  const [currentPeriod, setCurrentPeriod] = useState('9:00 - 10:00 AM');

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, notesRes] = await Promise.all([
          AdminAPI.getStats(),
          AdminAPI.getPendingLessonNotes()
        ]);

        if (statsRes.status === 'success') setSchoolStats(statsRes.data);
        if (notesRes.status === 'success') {
          const notesData = (notesRes.data || []) as any[];
          setPendingApprovals(notesData.map(n => ({
            id: n.id,
            type: 'lesson-note',
            teacher: n.teacher_name,
            subject: n.subject_name,
            class: n.class_name,
            submittedDate: 'Recently'
          })));
        }
      } catch (error) {
        console.error('Error fetching principal data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const [todaySchedule] = useState<TodayClass[]>([]);
  const lessonPeriods = [
    '8:00 - 9:00 AM',
    '9:00 - 10:00 AM',
    '10:00 - 11:00 AM',
    '11:00 - 12:00 PM',
    '12:00 - 1:00 PM',
  ];

  const currentClasses = todaySchedule.filter((cls) => cls.time === currentPeriod);

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const handlePostAnnouncement = () => {
    if (!announcementTitle.trim() || !announcementContent.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    const newAnnouncement: Announcement = {
      id: Date.now().toString(),
      title: announcementTitle,
      content: announcementContent,
      date: 'Just now',
      author: 'Principal',
    };

    setAnnouncements([newAnnouncement, ...announcements]);
    toast.success('Announcement posted successfully');
    setShowAnnouncementDialog(false);
    setAnnouncementTitle('');
    setAnnouncementContent('');
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl mb-2 text-blue-950">Academic Command Center</h1>
          <p className="text-sm sm:text-base text-gray-600">Daily Operations Dashboard - {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <Button onClick={() => setShowAnnouncementDialog(true)} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          New Announcement
        </Button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Loading principal dashboard...</span>
        </div>
      )}

      {/* Stats Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pending Approvals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl text-blue-950">{pendingApprovals.length}</p>
                  <p className="text-xs text-gray-500 mt-1">Requires your review</p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <ClipboardCheck className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Students Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl text-blue-950">
                    {schoolStats?.total_students || 0}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Total Enrolled
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Staff Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl text-blue-950">
                    {schoolStats?.total_teachers || 0}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Active Teachers
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active Classes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl text-blue-950">
                    {schoolStats?.total_classes || 0}
                  </p>
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    Across levels
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}


      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pending Approvals</CardTitle>
              <Badge variant="destructive">{pendingApprovals.length}</Badge>
            </div>
            <CardDescription>
              Review and approve lesson notes or results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingApprovals.map((approval) => (
                <div
                  key={approval.id}
                  className="p-4 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={approval.type === 'lesson-note' ? 'default' : 'secondary'}>
                          {approval.type === 'lesson-note' ? 'Lesson Note' : 'Result'}
                        </Badge>
                        <span className="text-xs text-gray-500">{approval.submittedDate}</span>
                      </div>
                      <p className="font-medium text-blue-950">{approval.subject}</p>
                      <p className="text-sm text-gray-600">
                        {approval.teacher} • {approval.class}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ongoing Classes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-3">
              <div>
                <CardTitle>Ongoing Classes</CardTitle>
                <CardDescription>All classes from KG to Grade 12</CardDescription>
              </div>
              <Select value={currentPeriod} onValueChange={setCurrentPeriod}>
                <SelectTrigger className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {lessonPeriods.map((period) => (
                    <SelectItem key={period} value={period}>
                      {period}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto space-y-2">
              {currentClasses.map((classItem, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg border bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-16 h-16 bg-blue-950 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-center leading-tight px-1">
                          {classItem.class}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-blue-950 truncate">{classItem.subject}</p>
                        <p className="text-sm text-gray-600 truncate">{classItem.teacher}</p>
                      </div>
                    </div>
                    {classItem.status === 'ongoing' && (
                      <Badge className="bg-green-600 flex-shrink-0 ml-2">Live</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t">
              <p className="text-xs text-gray-500 text-center">
                Showing {currentClasses.length} classes for {currentPeriod}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Announcements Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Staff Room Announcements</CardTitle>
              <CardDescription>
                Important notices for teachers and HR only
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="p-4 bg-blue-50 border border-blue-200 rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bell className="w-5 h-5 text-blue-950" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-blue-950">{announcement.title}</h3>
                      <span className="text-xs text-gray-500">{announcement.date}</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{announcement.content}</p>
                    <p className="text-xs text-gray-500">Posted by: {announcement.author}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* New Announcement Dialog */}
      <Dialog open={showAnnouncementDialog} onOpenChange={setShowAnnouncementDialog}>
        <DialogContent className="w-[95vw] sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Post New Announcement</DialogTitle>
            <DialogDescription>
              This will be visible to all teachers and HR staff in the Staff Room.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title *</label>
              <Input
                value={announcementTitle}
                onChange={(e) => setAnnouncementTitle(e.target.value)}
                placeholder="e.g., Staff Meeting Tomorrow"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Content *</label>
              <Textarea
                value={announcementContent}
                onChange={(e) => setAnnouncementContent(e.target.value)}
                placeholder="Write your announcement here..."
                rows={6}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowAnnouncementDialog(false);
                setAnnouncementTitle('');
                setAnnouncementContent('');
              }}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handlePostAnnouncement}>
              <Send className="w-4 h-4 mr-2" />
              Post Announcement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};