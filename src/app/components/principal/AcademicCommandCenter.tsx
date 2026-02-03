import React, { useState } from 'react';
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
  const [showAnnouncementDialog, setShowAnnouncementDialog] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementContent, setAnnouncementContent] = useState('');
  const [currentPeriod, setCurrentPeriod] = useState('9:00 - 10:00 AM');

  const [pendingApprovals] = useState<PendingApproval[]>([
    {
      id: '1',
      type: 'lesson-note',
      teacher: 'Mrs. Sarah Johnson',
      subject: 'Mathematics',
      class: 'JSS 2A',
      submittedDate: '2 hours ago',
    },
    {
      id: '2',
      type: 'lesson-note',
      teacher: 'Mr. David Okafor',
      subject: 'English Language',
      class: 'SSS 1B',
      submittedDate: '4 hours ago',
    },
    {
      id: '3',
      type: 'result',
      teacher: 'Dr. Amaka Peters',
      subject: 'Chemistry',
      class: 'SSS 3A',
      submittedDate: '1 day ago',
    },
    {
      id: '4',
      type: 'lesson-note',
      teacher: 'Mr. John Adebayo',
      subject: 'Physics',
      class: 'SSS 2A',
      submittedDate: '1 day ago',
    },
  ]);

  const [todaySchedule] = useState<TodayClass[]>([
    // 8:00 - 9:00 AM Period
    { time: '8:00 - 9:00 AM', subject: 'Number Work', teacher: 'Mrs. Grace Eze', class: 'KG 1', status: 'ongoing' },
    { time: '8:00 - 9:00 AM', subject: 'Phonics', teacher: 'Miss Joy Okeke', class: 'KG 2', status: 'ongoing' },
    { time: '8:00 - 9:00 AM', subject: 'English Language', teacher: 'Mrs. Faith Nwankwo', class: 'Grade 1', status: 'ongoing' },
    { time: '8:00 - 9:00 AM', subject: 'Mathematics', teacher: 'Mr. Peter Adeyemi', class: 'Grade 2', status: 'ongoing' },
    { time: '8:00 - 9:00 AM', subject: 'Science', teacher: 'Mrs. Helen Okonkwo', class: 'Grade 3', status: 'ongoing' },
    { time: '8:00 - 9:00 AM', subject: 'Social Studies', teacher: 'Mr. Daniel Ojo', class: 'Grade 4', status: 'ongoing' },
    { time: '8:00 - 9:00 AM', subject: 'Mathematics', teacher: 'Mrs. Blessing Ajayi', class: 'Grade 5', status: 'ongoing' },
    { time: '8:00 - 9:00 AM', subject: 'English Language', teacher: 'Miss Victoria Bello', class: 'Grade 6', status: 'ongoing' },
    { time: '8:00 - 9:00 AM', subject: 'Mathematics', teacher: 'Mrs. Sarah Johnson', class: 'JSS 1A', status: 'ongoing' },
    { time: '8:00 - 9:00 AM', subject: 'English Language', teacher: 'Mr. David Okafor', class: 'JSS 1B', status: 'ongoing' },
    { time: '8:00 - 9:00 AM', subject: 'Basic Science', teacher: 'Dr. Amaka Peters', class: 'JSS 2A', status: 'ongoing' },
    { time: '8:00 - 9:00 AM', subject: 'Mathematics', teacher: 'Mr. John Adebayo', class: 'JSS 2B', status: 'ongoing' },
    { time: '8:00 - 9:00 AM', subject: 'Civic Education', teacher: 'Mrs. Ngozi Obi', class: 'JSS 3A', status: 'ongoing' },
    { time: '8:00 - 9:00 AM', subject: 'Computer Science', teacher: 'Mr. Emmanuel Nwosu', class: 'JSS 3B', status: 'ongoing' },
    { time: '8:00 - 9:00 AM', subject: 'Physics', teacher: 'Mr. Ahmed Mohammed', class: 'SSS 1A', status: 'ongoing' },
    { time: '8:00 - 9:00 AM', subject: 'Chemistry', teacher: 'Dr. Chinedu Eze', class: 'SSS 1B', status: 'ongoing' },
    { time: '8:00 - 9:00 AM', subject: 'Biology', teacher: 'Mrs. Aisha Bello', class: 'SSS 2A', status: 'ongoing' },
    { time: '8:00 - 9:00 AM', subject: 'Economics', teacher: 'Mr. Tunde Adeyemi', class: 'SSS 2B', status: 'ongoing' },
    { time: '8:00 - 9:00 AM', subject: 'Further Mathematics', teacher: 'Mrs. Funmi Oladele', class: 'SSS 3A', status: 'ongoing' },
    { time: '8:00 - 9:00 AM', subject: 'Government', teacher: 'Mr. Ibrahim Yusuf', class: 'SSS 3B', status: 'ongoing' },
    
    // 9:00 - 10:00 AM Period
    { time: '9:00 - 10:00 AM', subject: 'Rhymes & Songs', teacher: 'Mrs. Grace Eze', class: 'KG 1', status: 'upcoming' },
    { time: '9:00 - 10:00 AM', subject: 'Number Work', teacher: 'Miss Joy Okeke', class: 'KG 2', status: 'upcoming' },
    { time: '9:00 - 10:00 AM', subject: 'Mathematics', teacher: 'Mrs. Faith Nwankwo', class: 'Grade 1', status: 'upcoming' },
    { time: '9:00 - 10:00 AM', subject: 'English Language', teacher: 'Mr. Peter Adeyemi', class: 'Grade 2', status: 'upcoming' },
    { time: '9:00 - 10:00 AM', subject: 'Social Studies', teacher: 'Mrs. Helen Okonkwo', class: 'Grade 3', status: 'upcoming' },
    { time: '9:00 - 10:00 AM', subject: 'Mathematics', teacher: 'Mr. Daniel Ojo', class: 'Grade 4', status: 'upcoming' },
    { time: '9:00 - 10:00 AM', subject: 'English Language', teacher: 'Mrs. Blessing Ajayi', class: 'Grade 5', status: 'upcoming' },
    { time: '9:00 - 10:00 AM', subject: 'Science', teacher: 'Miss Victoria Bello', class: 'Grade 6', status: 'upcoming' },
    { time: '9:00 - 10:00 AM', subject: 'English Language', teacher: 'Mr. David Okafor', class: 'JSS 1A', status: 'upcoming' },
    { time: '9:00 - 10:00 AM', subject: 'Mathematics', teacher: 'Mrs. Sarah Johnson', class: 'JSS 1B', status: 'upcoming' },
    { time: '9:00 - 10:00 AM', subject: 'Mathematics', teacher: 'Mr. John Adebayo', class: 'JSS 2A', status: 'upcoming' },
    { time: '9:00 - 10:00 AM', subject: 'Basic Science', teacher: 'Dr. Amaka Peters', class: 'JSS 2B', status: 'upcoming' },
    { time: '9:00 - 10:00 AM', subject: 'English Language', teacher: 'Mr. David Okafor', class: 'JSS 3A', status: 'upcoming' },
    { time: '9:00 - 10:00 AM', subject: 'Mathematics', teacher: 'Mrs. Sarah Johnson', class: 'JSS 3B', status: 'upcoming' },
    { time: '9:00 - 10:00 AM', subject: 'Chemistry', teacher: 'Dr. Chinedu Eze', class: 'SSS 1A', status: 'upcoming' },
    { time: '9:00 - 10:00 AM', subject: 'Physics', teacher: 'Mr. Ahmed Mohammed', class: 'SSS 1B', status: 'upcoming' },
    { time: '9:00 - 10:00 AM', subject: 'Mathematics', teacher: 'Mrs. Funmi Oladele', class: 'SSS 2A', status: 'upcoming' },
    { time: '9:00 - 10:00 AM', subject: 'English Language', teacher: 'Mr. David Okafor', class: 'SSS 2B', status: 'upcoming' },
    { time: '9:00 - 10:00 AM', subject: 'Physics', teacher: 'Mr. Ahmed Mohammed', class: 'SSS 3A', status: 'upcoming' },
    { time: '9:00 - 10:00 AM', subject: 'Literature in English', teacher: 'Mrs. Mercy Adewale', class: 'SSS 3B', status: 'upcoming' },
    
    // 10:00 - 11:00 AM Period
    { time: '10:00 - 11:00 AM', subject: 'Play Time', teacher: 'Mrs. Grace Eze', class: 'KG 1', status: 'upcoming' },
    { time: '10:00 - 11:00 AM', subject: 'Creative Arts', teacher: 'Miss Joy Okeke', class: 'KG 2', status: 'upcoming' },
    { time: '10:00 - 11:00 AM', subject: 'Creative Arts', teacher: 'Mrs. Faith Nwankwo', class: 'Grade 1', status: 'upcoming' },
    { time: '10:00 - 11:00 AM', subject: 'Basic Science', teacher: 'Mr. Peter Adeyemi', class: 'Grade 2', status: 'upcoming' },
    { time: '10:00 - 11:00 AM', subject: 'English Language', teacher: 'Mrs. Helen Okonkwo', class: 'Grade 3', status: 'upcoming' },
    { time: '10:00 - 11:00 AM', subject: 'Computer Studies', teacher: 'Mr. Emmanuel Nwosu', class: 'Grade 4', status: 'upcoming' },
    { time: '10:00 - 11:00 AM', subject: 'Creative Arts', teacher: 'Mrs. Blessing Ajayi', class: 'Grade 5', status: 'upcoming' },
    { time: '10:00 - 11:00 AM', subject: 'History', teacher: 'Mr. Ibrahim Yusuf', class: 'Grade 6', status: 'upcoming' },
    { time: '10:00 - 11:00 AM', subject: 'Basic Technology', teacher: 'Mr. Emmanuel Nwosu', class: 'JSS 1A', status: 'upcoming' },
    { time: '10:00 - 11:00 AM', subject: 'French Language', teacher: 'Mme. Francoise Dubois', class: 'JSS 1B', status: 'upcoming' },
    { time: '10:00 - 11:00 AM', subject: 'Physical Education', teacher: 'Coach Samuel Okon', class: 'JSS 2A', status: 'upcoming' },
    { time: '10:00 - 11:00 AM', subject: 'Agricultural Science', teacher: 'Mr. Benson Uche', class: 'JSS 2B', status: 'upcoming' },
    { time: '10:00 - 11:00 AM', subject: 'Business Studies', teacher: 'Mrs. Comfort Ezeh', class: 'JSS 3A', status: 'upcoming' },
    { time: '10:00 - 11:00 AM', subject: 'Home Economics', teacher: 'Mrs. Patience Nnamani', class: 'JSS 3B', status: 'upcoming' },
    { time: '10:00 - 11:00 AM', subject: 'English Language', teacher: 'Mr. David Okafor', class: 'SSS 1A', status: 'upcoming' },
    { time: '10:00 - 11:00 AM', subject: 'Biology', teacher: 'Mrs. Aisha Bello', class: 'SSS 1B', status: 'upcoming' },
    { time: '10:00 - 11:00 AM', subject: 'Chemistry', teacher: 'Dr. Chinedu Eze', class: 'SSS 2A', status: 'upcoming' },
    { time: '10:00 - 11:00 AM', subject: 'Commerce', teacher: 'Mrs. Comfort Ezeh', class: 'SSS 2B', status: 'upcoming' },
    { time: '10:00 - 11:00 AM', subject: 'English Language', teacher: 'Mr. David Okafor', class: 'SSS 3A', status: 'upcoming' },
    { time: '10:00 - 11:00 AM', subject: 'Agricultural Science', teacher: 'Mr. Benson Uche', class: 'SSS 3B', status: 'upcoming' },
  ]);

  const lessonPeriods = [
    '8:00 - 9:00 AM',
    '9:00 - 10:00 AM',
    '10:00 - 11:00 AM',
    '11:00 - 12:00 PM',
    '12:00 - 1:00 PM',
  ];

  const currentClasses = todaySchedule.filter((cls) => cls.time === currentPeriod);

  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: '1',
      title: 'Staff Meeting Tomorrow',
      content: 'All teachers are required to attend the staff meeting tomorrow at 2:00 PM in the conference room.',
      date: '2 hours ago',
      author: 'Principal',
    },
    {
      id: '2',
      title: 'Midterm Break Schedule',
      content: 'The midterm break will commence on January 15th. Please ensure all lesson notes are submitted before the break.',
      date: '1 day ago',
      author: 'Principal',
    },
  ]);

  const stats = {
    studentsTotal: 1250,
    studentsPresent: 1198,
    studentsAbsent: 52,
    staffTotal: 75,
    staffPresent: 72,
    staffAbsent: 3,
  };

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
          <p className="text-sm sm:text-base text-gray-600">Daily Operations Dashboard - Monday, December 29, 2025</p>
        </div>
        <Button onClick={() => setShowAnnouncementDialog(true)} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          New Announcement
        </Button>
      </div>

      {/* Stats Grid */}
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
                  {stats.studentsPresent}/{stats.studentsTotal}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.studentsAbsent} absent
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
                  {stats.staffPresent}/{stats.staffTotal}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.staffAbsent} absent
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
              Attendance Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl text-blue-950">
                  {Math.round((stats.studentsPresent / stats.studentsTotal) * 100)}%
                </p>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +2% vs yesterday
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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