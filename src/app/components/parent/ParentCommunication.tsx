import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Users,
  Bell,
  FileText,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { useParent } from '../../../contexts/ParentContext';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface Message {
  id: string;
  from: string;
  subject: string;
  preview: string;
  date: string;
  read: boolean;
}

export const ParentCommunication: React.FC = () => {
  const parentContext = useParent();
  const selectedChild = parentContext?.selectedChild;
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [recipient, setRecipient] = useState('class-teacher');
  const [messageText, setMessageText] = useState('');

  const [messages] = useState<Message[]>([
    {
      id: '1',
      from: 'Mrs. Okonkwo (Class Teacher)',
      subject: 'Excellent Progress This Term',
      preview: 'I wanted to inform you that Oluwatunde has shown remarkable improvement...',
      date: '2 days ago',
      read: false,
    },
    {
      id: '2',
      from: 'Principal',
      subject: 'PTA Meeting Reminder',
      preview: 'This is to remind all parents about the upcoming PTA meeting...',
      date: '1 week ago',
      read: true,
    },
  ]);

  const handleSendMessage = () => {
    if (!messageText.trim()) {
      toast.error('Please enter a message');
      return;
    }
    toast.success('Message sent successfully!');
    setShowMessageDialog(false);
    setMessageText('');
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl mb-2 text-blue-950">Communication Center</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Messages regarding <strong>{selectedChild?.name}</strong>
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowMessageDialog(true)}>
          <Send className="w-4 h-4 mr-2" />
          New Message
        </Button>
      </div>

      {/* Messages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Inbox
          </CardTitle>
          <CardDescription>Communications from teachers and school administration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-4 rounded-lg border cursor-pointer hover:shadow-md transition-shadow ${
                  !message.read ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{message.subject}</h4>
                      {!message.read && <Badge className="bg-blue-600 text-white">New</Badge>}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">From: {message.from}</p>
                    <p className="text-sm text-gray-700">{message.preview}</p>
                    <p className="text-xs text-gray-500 mt-2">{message.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* PTA Forum */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            PTA Forum & Announcements
          </CardTitle>
          <CardDescription>Parent-Teacher Association updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 rounded-lg border border-gray-200 bg-white">
              <h4 className="font-semibold mb-1">General Meeting - January 15, 2026</h4>
              <p className="text-sm text-gray-700 mb-2">
                All parents are invited to attend the PTA general meeting at 10:00 AM in the school hall.
              </p>
              <Button variant="outline" size="sm">Download Agenda</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teacher Remarks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Teacher Remarks & Feedback
          </CardTitle>
          <CardDescription>Behavioral and academic comments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800 mb-2">
              <strong>Class Teacher (Mrs. Okonkwo):</strong>
            </p>
            <p className="text-sm text-green-900">
              "Oluwatunde is an excellent student who shows great enthusiasm for learning. His participation in
              class discussions is outstanding, and he consistently completes assignments on time."
            </p>
          </div>
        </CardContent>
      </Card>

      {/* New Message Dialog */}
      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Send Message</DialogTitle>
            <DialogDescription>
              Send a secure message to school staff regarding {selectedChild?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Recipient:</label>
              <Select value={recipient} onValueChange={setRecipient}>
                <SelectTrigger>
                  <SelectValue placeholder="Select recipient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="class-teacher">Class Teacher (Mrs. Okonkwo)</SelectItem>
                  <SelectItem value="principal">Principal</SelectItem>
                  <SelectItem value="admin">School Administration</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Message:</label>
              <Textarea
                placeholder="Type your message here..."
                rows={8}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMessageDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSendMessage}>
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};