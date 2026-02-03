import React, { useState } from 'react';
import { PageHeader } from './PageHeader';
import { 
  MessageSquare, 
  Send,
  Mail,
  MessageCircle,
  Users,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  X
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

// Mock data
const messageHistory = [
  {
    id: 1,
    subject: 'Mid-Term Break Announcement',
    content: 'Dear Parents, This is to inform you that the mid-term break will commence from December 21st to January 8th. School resumes on January 9th, 2025. Please ensure your wards return on time. Thank you.',
    recipients: 'All Parents',
    recipientCount: 312,
    sentDate: '2024-12-20',
    type: 'WhatsApp & Email',
    status: 'Delivered',
    deliveryRate: 98,
  },
  {
    id: 2,
    subject: 'Staff Meeting - Monday 9AM',
    content: 'All staff members are required to attend the mandatory staff meeting on Monday at 9:00 AM in the main hall. Agenda: Term review and planning for next term.',
    recipients: 'All Staff',
    recipientCount: 42,
    sentDate: '2024-12-18',
    type: 'Email',
    status: 'Delivered',
    deliveryRate: 100,
  },
  {
    id: 3,
    subject: 'Fee Payment Reminder',
    content: 'This is a friendly reminder that the second term fees are due by January 15th, 2025. Please make necessary arrangements to avoid late payment penalties.',
    recipients: 'Parents with Outstanding Fees',
    recipientCount: 28,
    sentDate: '2024-12-15',
    type: 'WhatsApp',
    status: 'Delivered',
    deliveryRate: 96,
  },
];

const suggestionBox = [
  {
    id: 1,
    from: 'Mrs. Adeyemi (Parent - JSS 2A)',
    category: 'Facilities',
    subject: 'Playground Equipment Needs Repair',
    message: 'The swing set in the junior playground has a broken chain and poses a safety risk.',
    date: '2024-12-27',
    status: 'Unread',
    priority: 'High',
  },
  {
    id: 2,
    from: 'Mr. Okonkwo (Teacher - Mathematics)',
    category: 'Academic',
    subject: 'Request for Additional Teaching Materials',
    message: 'We need more geometry sets for the SS1 classes. Current supply is insufficient.',
    date: '2024-12-26',
    status: 'Read',
    priority: 'Medium',
  },
  {
    id: 3,
    from: 'Anonymous Parent',
    category: 'Transport',
    subject: 'School Bus Late Arrivals',
    message: 'The bus for Ikeja route has been consistently late by 15-20 minutes for the past week.',
    date: '2024-12-25',
    status: 'Read',
    priority: 'Medium',
  },
];

export const CommunicationCenter: React.FC = () => {
  const [messageType, setMessageType] = useState<'whatsapp' | 'email' | 'both'>('whatsapp');
  const [recipientGroup, setRecipientGroup] = useState<string>('all-parents');
  const [messageSubject, setMessageSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [selectedSuggestion, setSelectedSuggestion] = useState<number | null>(null);
  const [showRespondDialog, setShowRespondDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [respondMessage, setRespondMessage] = useState('');
  const [previewMessage, setPreviewMessage] = useState<any>(null);

  const handleSendMessage = () => {
    if (!messageSubject || !messageBody) {
      toast.error('Please fill in all required fields');
      return;
    }

    toast.success(`Message sent successfully via ${messageType.toUpperCase()}!`);
    setMessageSubject('');
    setMessageBody('');
  };

  const handleRespond = (suggestion: any) => {
    setSelectedSuggestion(suggestion.id);
    setShowRespondDialog(true);
  };

  const handleSendResponse = () => {
    if (!respondMessage.trim()) {
      toast.error('Please enter a response message');
      return;
    }
    toast.success('Response sent successfully!');
    setShowRespondDialog(false);
    setRespondMessage('');
  };

  const handleMarkAsResolved = (suggestionId: number) => {
    toast.success('Marked as resolved. Notification sent to the sender.');
  };

  const handlePreview = (msg: any) => {
    setPreviewMessage(msg);
    setShowPreviewDialog(true);
  };

  const getRecipientCount = () => {
    switch (recipientGroup) {
      case 'all-parents':
        return 312;
      case 'all-staff':
        return 42;
      case 'all-students':
        return 312;
      case 'fee-defaulters':
        return 28;
      default:
        return 0;
    }
  };

  return (
    <div className="p-8">
      <PageHeader
        title="Communication & Broadcast Center"
        description="Send mass notifications and manage feedback"
        icon={MessageSquare}
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <Mail className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Messages Sent (This Month)</p>
          <p className="text-3xl">47</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Delivery Rate</p>
          <p className="text-3xl">98%</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <MessageCircle className="w-8 h-8 text-purple-500" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Pending Suggestions</p>
          <p className="text-3xl">1</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-amber-500" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Recipients</p>
          <p className="text-3xl">354</p>
        </div>
      </div>

      {/* Mass Notification Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Send className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg">Mass Notification</h3>
            <p className="text-sm text-gray-600">Send emergency or important messages to multiple recipients</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Recipient Selection */}
          <div>
            <Label htmlFor="recipientGroup">Recipient Group *</Label>
            <select
              id="recipientGroup"
              value={recipientGroup}
              onChange={(e) => setRecipientGroup(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all-parents">All Parents ({312} recipients)</option>
              <option value="all-staff">All Staff ({42} recipients)</option>
              <option value="all-students">All Students ({312} recipients)</option>
              <option value="fee-defaulters">Parents with Outstanding Fees ({28} recipients)</option>
              <option value="class-specific">Specific Class...</option>
            </select>
            <p className="text-sm text-gray-600 mt-1">
              This message will be sent to <strong>{getRecipientCount()} recipients</strong>
            </p>
          </div>

          {/* Message Type */}
          <div>
            <Label>Delivery Method *</Label>
            <div className="flex gap-4 mt-2">
              <button
                onClick={() => setMessageType('whatsapp')}
                className={`flex-1 p-4 border-2 rounded-lg transition-colors ${
                  messageType === 'whatsapp'
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <MessageCircle className={`w-6 h-6 mx-auto mb-2 ${messageType === 'whatsapp' ? 'text-green-600' : 'text-gray-400'}`} />
                <p className="font-medium text-sm">WhatsApp Only</p>
                <p className="text-xs text-gray-600 mt-1">Instant delivery (Primary)</p>
              </button>
              <button
                onClick={() => setMessageType('email')}
                className={`flex-1 p-4 border-2 rounded-lg transition-colors ${
                  messageType === 'email'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Mail className={`w-6 h-6 mx-auto mb-2 ${messageType === 'email' ? 'text-blue-600' : 'text-gray-400'}`} />
                <p className="font-medium text-sm">Email Only</p>
                <p className="text-xs text-gray-600 mt-1">Detailed messages</p>
              </button>
              <button
                onClick={() => setMessageType('both')}
                className={`flex-1 p-4 border-2 rounded-lg transition-colors ${
                  messageType === 'both'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Send className={`w-6 h-6 mx-auto mb-2 ${messageType === 'both' ? 'text-blue-600' : 'text-gray-400'}`} />
                <p className="font-medium text-sm">WhatsApp & Email</p>
                <p className="text-xs text-gray-600 mt-1">Maximum reach</p>
              </button>
            </div>
          </div>

          {/* Message Subject */}
          <div>
            <Label htmlFor="messageSubject">Subject *</Label>
            <Input
              id="messageSubject"
              value={messageSubject}
              onChange={(e) => setMessageSubject(e.target.value)}
              placeholder="e.g., Emergency School Closure Notice"
              className="mt-1"
            />
          </div>

          {/* Message Body */}
          <div>
            <Label htmlFor="messageBody">Message Content *</Label>
            <Textarea
              id="messageBody"
              value={messageBody}
              onChange={(e) => setMessageBody(e.target.value)}
              placeholder="Type your message here..."
              rows={6}
              className="mt-1"
            />
            <p className="text-sm text-gray-600 mt-1">
              {messageBody.length} characters
              {messageType === 'whatsapp' && messageBody.length > 1000 && (
                <span className="text-amber-600 ml-2">
                  (Long message - consider using Email instead)
                </span>
              )}
            </p>
          </div>

          {/* Preview & Send */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <p>
                This message will be sent immediately to all selected recipients. Please review carefully before sending.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Preview</Button>
              <Button onClick={handleSendMessage}>
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Message History */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="text-lg mb-4">Recent Messages</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-sm">Subject</th>
                <th className="text-left px-4 py-3 text-sm">Recipients</th>
                <th className="text-left px-4 py-3 text-sm">Type</th>
                <th className="text-left px-4 py-3 text-sm">Sent Date</th>
                <th className="text-left px-4 py-3 text-sm">Status</th>
                <th className="text-left px-4 py-3 text-sm">Delivery</th>
                <th className="text-left px-4 py-3 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {messageHistory.map((msg) => (
                <tr key={msg.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{msg.subject}</td>
                  <td className="px-4 py-3 text-sm">
                    <div>
                      <p>{msg.recipients}</p>
                      <p className="text-xs text-gray-600">{msg.recipientCount} recipients</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{msg.type}</td>
                  <td className="px-4 py-3 text-sm">{new Date(msg.sentDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                      {msg.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${msg.deliveryRate}%` }}
                        />
                      </div>
                      <span className="text-sm">{msg.deliveryRate}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handlePreview(msg)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Suggestion Box */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg">Suggestion Box</h3>
              <p className="text-sm text-gray-600">Private feedback and complaints from parents and staff</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Mark All as Read
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {suggestionBox.map((suggestion) => (
            <div
              key={suggestion.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                suggestion.status === 'Unread'
                  ? 'border-blue-200 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedSuggestion(selectedSuggestion === suggestion.id ? null : suggestion.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{suggestion.subject}</h4>
                    {suggestion.status === 'Unread' && (
                      <span className="px-2 py-0.5 text-xs bg-blue-600 text-white rounded-full">New</span>
                    )}
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        suggestion.priority === 'High'
                          ? 'bg-red-100 text-red-700'
                          : suggestion.priority === 'Medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {suggestion.priority} Priority
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{suggestion.from} • {suggestion.category}</p>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <Clock className="w-4 h-4 inline mr-1" />
                  {new Date(suggestion.date).toLocaleDateString()}
                </div>
              </div>

              {selectedSuggestion === suggestion.id && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-700 mb-4">{suggestion.message}</p>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={(e) => {
                      e.stopPropagation();
                      handleRespond(suggestion);
                    }}>
                      Respond
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsResolved(suggestion.id);
                      }}
                    >
                      Mark as Resolved
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Respond Dialog */}
      <Dialog open={showRespondDialog} onOpenChange={setShowRespondDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Respond to Suggestion</DialogTitle>
            <DialogDescription>
              Send a response message to address this suggestion or complaint.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="respondMessage">Your Response</Label>
            <Textarea
              id="respondMessage"
              value={respondMessage}
              onChange={(e) => setRespondMessage(e.target.value)}
              placeholder="Type your response here..."
              rows={6}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRespondDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendResponse}>
              <Send className="w-4 h-4 mr-2" />
              Send Response
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="w-[95vw] max-w-2xl">
          <DialogHeader>
            <DialogTitle>Message Preview</DialogTitle>
            <DialogDescription>
              View the message subject and content
            </DialogDescription>
          </DialogHeader>
          {previewMessage && (
            <div className="py-4 space-y-4">
              <div>
                <Label>Subject</Label>
                <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200">
                  <p className="font-medium">{previewMessage.subject}</p>
                </div>
              </div>
              <div>
                <Label>Content</Label>
                <div className="mt-2 p-4 bg-gray-50 rounded-md border border-gray-200 max-h-80 overflow-y-auto">
                  <p className="text-sm whitespace-pre-wrap">{previewMessage.content}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-600">Recipients</Label>
                  <p className="text-sm">{previewMessage.recipients}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Delivery Method</Label>
                  <p className="text-sm">{previewMessage.type}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreviewDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};