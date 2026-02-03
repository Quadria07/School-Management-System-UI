import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Users,
  User,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

interface Message {
  id: string;
  type: 'parent' | 'class';
  recipient: string;
  subject: string;
  message: string;
  status: 'sent' | 'delivered' | 'read';
  date: string;
}

export const CommunicationHub: React.FC = () => {
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [messageType, setMessageType] = useState<'parent' | 'class'>('parent');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedClass, setSelectedClass] = useState('JSS 3A');
  const [messageSubject, setMessageSubject] = useState('');
  const [messageContent, setMessageContent] = useState('');

  const [messages] = useState<Message[]>([
    {
      id: '1',
      type: 'parent',
      recipient: 'Mrs. Oluwaseun (Parent of Adebayo)',
      subject: 'Outstanding Performance',
      message: 'Your son has shown excellent improvement...',
      status: 'read',
      date: '2025-12-29',
    },
    {
      id: '2',
      type: 'class',
      recipient: 'JSS 3A - All Students',
      subject: 'Assignment Reminder',
      message: 'Please submit your Quadratic Equations assignment...',
      status: 'delivered',
      date: '2025-12-30',
    },
    {
      id: '3',
      type: 'parent',
      recipient: 'Mr. Akintola (Parent of Daniel)',
      subject: 'Academic Concern',
      message: 'I would like to discuss Daniel\'s recent performance...',
      status: 'sent',
      date: '2025-12-30',
    },
  ]);

  const students = [
    { id: '1', name: 'Adebayo Oluwaseun', class: 'JSS 3A', parentPhone: '+234 803 123 4567' },
    { id: '2', name: 'Chioma Nwosu', class: 'JSS 3A', parentPhone: '+234 805 234 5678' },
    { id: '3', name: 'Ibrahim Yusuf', class: 'JSS 3A', parentPhone: '+234 806 345 6789' },
    { id: '4', name: 'Grace Okonkwo', class: 'JSS 3A', parentPhone: '+234 807 456 7890' },
    { id: '5', name: 'Daniel Akintola', class: 'JSS 3A', parentPhone: '+234 808 567 8901' },
  ];

  const handleSendMessage = () => {
    if (!messageSubject || !messageContent) {
      toast.error('Please fill in all fields');
      return;
    }

    if (messageType === 'parent' && !selectedStudent) {
      toast.error('Please select a student');
      return;
    }

    toast.success('Message sent successfully');
    setShowMessageDialog(false);
    setMessageSubject('');
    setMessageContent('');
    setSelectedStudent('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'read':
        return 'bg-green-100 text-green-700';
      case 'delivered':
        return 'bg-blue-100 text-blue-700';
      case 'sent':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl mb-2 text-blue-950">
            Communication Hub
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Connect with parents and students
          </p>
        </div>
        <Button
          onClick={() => setShowMessageDialog(true)}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
        >
          <Send className="w-4 h-4 mr-2" />
          New Message
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Messages Sent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl sm:text-3xl text-blue-950">
                  {messages.length}
                </p>
                <p className="text-xs text-gray-500 mt-1">This month</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Parent Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl sm:text-3xl text-blue-950">
                  {messages.filter((m) => m.type === 'parent').length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Individual</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Class Broadcasts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl sm:text-3xl text-blue-950">
                  {messages.filter((m) => m.type === 'class').length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Group messages</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Read Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl sm:text-3xl text-blue-950">
                  {messages.filter((m) => m.status === 'read').length}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {((messages.filter((m) => m.status === 'read').length / messages.length) * 100).toFixed(0)}% rate
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Message History */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Message History</CardTitle>
            <CardDescription>Your sent messages and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className="p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 className="font-medium">{message.subject}</h4>
                        <Badge className={getStatusColor(message.status)}>
                          {message.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        To: {message.recipient}
                      </p>
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {message.message}
                      </p>
                    </div>
                    <div className="flex sm:flex-col items-end gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{message.date}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" className="flex-1 sm:flex-none text-xs">
                      View Full
                    </Button>
                    {message.type === 'parent' && (
                      <Button size="sm" variant="outline" className="flex-1 sm:flex-none text-xs">
                        <Phone className="w-3 h-3 mr-1" />
                        Call Parent
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Contact</CardTitle>
            <CardDescription>Student parent contacts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <h4 className="font-medium text-sm mb-1">{student.name}</h4>
                  <p className="text-xs text-gray-600 mb-2">{student.class}</p>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs flex-1"
                      onClick={() => {
                        setMessageType('parent');
                        setSelectedStudent(student.id);
                        setShowMessageDialog(true);
                      }}
                    >
                      <Mail className="w-3 h-3 mr-1" />
                      Message
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs flex-1"
                      onClick={() => toast.success(`Calling ${student.parentPhone}`)}
                    >
                      <Phone className="w-3 h-3 mr-1" />
                      Call
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Message Dialog */}
      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        <DialogContent className="w-[95vw] sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Send New Message</DialogTitle>
            <DialogDescription>
              Communicate with parents or broadcast to your class
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Message Type</Label>
              <RadioGroup
                value={messageType}
                onValueChange={(value: 'parent' | 'class') => setMessageType(value)}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="parent" id="parent" />
                  <Label htmlFor="parent" className="font-normal flex items-center gap-1">
                    <User className="w-4 h-4" />
                    Parent Message
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="class" id="class" />
                  <Label htmlFor="class" className="font-normal flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    Class Broadcast
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {messageType === 'parent' ? (
              <div>
                <Label htmlFor="student">Select Student *</Label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name} - {student.class}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div>
                <Label htmlFor="class">Select Class *</Label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="JSS 3A">JSS 3A</SelectItem>
                    <SelectItem value="JSS 2B">JSS 2B</SelectItem>
                    <SelectItem value="JSS 1C">JSS 1C</SelectItem>
                    <SelectItem value="SSS 2A">SSS 2A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                placeholder="e.g., Assignment Reminder"
                value={messageSubject}
                onChange={(e) => setMessageSubject(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                placeholder="Type your message here..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                rows={6}
              />
              <p className="text-xs text-gray-500 mt-2">
                {messageType === 'parent'
                  ? 'This message will be sent to the parent via SMS and email'
                  : 'This message will be sent to all students in the selected class'}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMessageDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSendMessage}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
