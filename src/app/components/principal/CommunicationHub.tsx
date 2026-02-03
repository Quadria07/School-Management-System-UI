import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Calendar as CalendarIcon,
  Users,
  Search,
  Plus,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
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

interface Message {
  id: string;
  recipient: string;
  subject: string;
  preview: string;
  date: string;
  status: 'sent' | 'read' | 'replied';
}

interface PTMeeting {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  attendees: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export const CommunicationHub: React.FC = () => {
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [showPTMDialog, setShowPTMDialog] = useState(false);
  const [messageRecipient, setMessageRecipient] = useState('');
  const [messageSubject, setMessageSubject] = useState('');
  const [messageContent, setMessageContent] = useState('');

  const [messages] = useState<Message[]>([
    {
      id: 'MSG001',
      recipient: 'Mrs. Sarah Johnson (Mathematics Dept.)',
      subject: 'Lesson Note Submission Reminder',
      preview: 'Please ensure all lesson notes for this week are submitted by...',
      date: '2 hours ago',
      status: 'read',
    },
    {
      id: 'MSG002',
      recipient: 'Science Department (5 teachers)',
      subject: 'Laboratory Equipment Maintenance',
      preview: 'The science labs will undergo maintenance this weekend...',
      date: '1 day ago',
      status: 'sent',
    },
    {
      id: 'MSG003',
      recipient: 'Mr. David Okafor (English Dept.)',
      subject: 'Student Performance Review',
      preview: 'I would like to discuss the performance of SSS 1B in...',
      date: '2 days ago',
      status: 'replied',
    },
  ]);

  const [ptmMeetings, setPtmMeetings] = useState<PTMeeting[]>([
    {
      id: 'PTM001',
      title: 'First Term Parent-Teacher Meeting',
      date: 'Jan 15, 2025',
      time: '10:00 AM - 2:00 PM',
      venue: 'School Hall',
      attendees: 'All parents and teachers',
      status: 'scheduled',
    },
    {
      id: 'PTM002',
      title: 'SSS 3 Academic Performance Review',
      date: 'Jan 20, 2025',
      time: '9:00 AM - 12:00 PM',
      venue: 'Conference Room',
      attendees: 'SSS 3 parents and subject teachers',
      status: 'scheduled',
    },
    {
      id: 'PTM003',
      title: 'End of Year General Meeting',
      date: 'Dec 20, 2024',
      time: '11:00 AM - 3:00 PM',
      venue: 'School Hall',
      attendees: 'All stakeholders',
      status: 'completed',
    },
  ]);

  const handleSendMessage = () => {
    if (!messageRecipient || !messageSubject || !messageContent) {
      toast.error('Please fill in all fields');
      return;
    }

    toast.success('Message sent successfully', {
      description: `Your message to ${messageRecipient} has been delivered.`,
    });

    setShowMessageDialog(false);
    setMessageRecipient('');
    setMessageSubject('');
    setMessageContent('');
  };

  const handleSchedulePTM = () => {
    toast.success('Parent-Teacher Meeting scheduled successfully', {
      description: 'Notification emails have been sent to all participants.',
    });
    setShowPTMDialog(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'default';
      case 'read':
        return 'secondary';
      case 'replied':
        return 'outline';
      default:
        return 'default';
    }
  };

  const getPTMStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl mb-2 text-blue-950">Communication Hub</h1>
          <p className="text-gray-600">Internal messaging and parent-teacher coordination</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowPTMDialog(true)}>
            <CalendarIcon className="w-4 h-4 mr-2" />
            Schedule PTM
          </Button>
          <Button onClick={() => setShowMessageDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Message
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Messages Sent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-3xl text-blue-950">{messages.length}</p>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Messages Read
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-3xl text-blue-950">
                {messages.filter((m) => m.status === 'read' || m.status === 'replied').length}
              </p>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Upcoming PTMs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-3xl text-blue-950">
                {ptmMeetings.filter((m) => m.status === 'scheduled').length}
              </p>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <CalendarIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Teachers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-3xl text-blue-950">75</p>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="messages" className="space-y-6">
        <TabsList>
          <TabsTrigger value="messages">Teacher Messaging</TabsTrigger>
          <TabsTrigger value="ptm">PTM Scheduler</TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Message History</CardTitle>
                  <CardDescription>
                    Direct messages to teachers and departments
                  </CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input placeholder="Search messages..." className="pl-9" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-blue-950">{message.subject}</h3>
                          <Badge variant={getStatusColor(message.status)}>
                            {message.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">To: {message.recipient}</p>
                        <p className="text-sm text-gray-500">{message.preview}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 ml-4">
                        <span className="text-xs text-gray-500">{message.date}</span>
                        <Button size="sm" variant="ghost">
                          <Mail className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ptm" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Parent-Teacher Meetings</CardTitle>
              <CardDescription>
                Schedule and manage parent-teacher meetings and open days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ptmMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className={`p-4 border rounded-lg ${
                      meeting.status === 'scheduled' ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium text-blue-950">{meeting.title}</h3>
                          <Badge className={getPTMStatusColor(meeting.status)}>
                            {meeting.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">{meeting.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">{meeting.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">{meeting.venue}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">{meeting.attendees}</span>
                          </div>
                        </div>
                      </div>
                      {meeting.status === 'scheduled' && (
                        <div className="flex gap-2 ml-4">
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                          <Button size="sm" variant="outline">
                            Send Reminder
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Message Dialog */}
      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        <DialogContent className="w-[95vw] sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Send Message to Teacher</DialogTitle>
            <DialogDescription>
              Send a direct message to individual teachers or entire departments
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Recipient *</label>
              <Select value={messageRecipient} onValueChange={setMessageRecipient}>
                <SelectTrigger>
                  <SelectValue placeholder="Select teacher or department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sarah">Mrs. Sarah Johnson (Mathematics)</SelectItem>
                  <SelectItem value="david">Mr. David Okafor (English)</SelectItem>
                  <SelectItem value="amaka">Dr. Amaka Peters (Science)</SelectItem>
                  <SelectItem value="math-dept">Mathematics Department (8 teachers)</SelectItem>
                  <SelectItem value="science-dept">Science Department (12 teachers)</SelectItem>
                  <SelectItem value="all-teachers">All Teachers (75 teachers)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject *</label>
              <Input
                value={messageSubject}
                onChange={(e) => setMessageSubject(e.target.value)}
                placeholder="e.g., Lesson Note Submission Reminder"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message *</label>
              <Textarea
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Write your message here..."
                rows={6}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowMessageDialog(false);
                setMessageRecipient('');
                setMessageSubject('');
                setMessageContent('');
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSendMessage}>
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule PTM Dialog */}
      <Dialog open={showPTMDialog} onOpenChange={setShowPTMDialog}>
        <DialogContent className="w-[95vw] sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Schedule Parent-Teacher Meeting</DialogTitle>
            <DialogDescription>
              Organize and notify parents of upcoming meetings or open day events
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Meeting Title *</label>
              <Input placeholder="e.g., First Term Parent-Teacher Meeting" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date *</label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Time *</label>
                <Input type="time" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Venue *</label>
              <Input placeholder="e.g., School Hall" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Attendees *</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select attendees" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All parents and teachers</SelectItem>
                  <SelectItem value="jss">JSS parents only</SelectItem>
                  <SelectItem value="sss">SSS parents only</SelectItem>
                  <SelectItem value="sss3">SSS 3 parents only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Agenda (Optional)</label>
              <Textarea
                placeholder="Brief description of the meeting agenda..."
                rows={4}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPTMDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSchedulePTM}>
              <CalendarIcon className="w-4 h-4 mr-2" />
              Schedule Meeting
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
