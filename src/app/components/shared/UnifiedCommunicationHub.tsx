import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Inbox,
  Mail,
  Search,
  Plus,
  Reply,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  Megaphone,
  Users,
  Filter,
  Star,
  ArrowLeft,
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
import { useAuth } from '../../../contexts/AuthContext';
import * as messagingService from '@/utils/messagingService';

interface UnifiedCommunicationHubProps {
  userRole: 'principal' | 'teacher' | 'student' | 'parent' | 'hr_manager' | 'bursar' | 'proprietor';
}

export const UnifiedCommunicationHub: React.FC<UnifiedCommunicationHubProps> = ({ userRole }) => {
  const { user } = useAuth();
  const [showComposeDialog, setShowComposeDialog] = useState(false);
  const [showAnnouncementDialog, setShowAnnouncementDialog] = useState(false);
  const [showMessageDetailDialog, setShowMessageDetailDialog] = useState(false);
  
  const [messages, setMessages] = useState<messagingService.Message[]>([]);
  const [sentMessages, setSentMessages] = useState<messagingService.Message[]>([]);
  const [announcements, setAnnouncements] = useState<messagingService.Announcement[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<messagingService.Message | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('inbox');
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Compose message form
  const [recipientRole, setRecipientRole] = useState<string>('');
  const [recipientId, setRecipientId] = useState<string>('');
  const [recipientName, setRecipientName] = useState<string>('');
  const [messageSubject, setMessageSubject] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [messagePriority, setMessagePriority] = useState<'low' | 'normal' | 'high' | 'urgent'>('normal');
  const [messageCategory, setMessageCategory] = useState<'academic' | 'administrative' | 'financial' | 'disciplinary' | 'general'>('general');
  
  // Announcement form
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementContent, setAnnouncementContent] = useState('');
  const [announcementAudience, setAnnouncementAudience] = useState<'all' | 'teachers' | 'students' | 'parents' | 'staff'>('all');
  const [announcementPriority, setAnnouncementPriority] = useState<'low' | 'normal' | 'high' | 'urgent'>('normal');
  const [announcementPinned, setAnnouncementPinned] = useState(false);
  
  // Load data on mount and set up polling
  useEffect(() => {
    messagingService.initializeSampleMessages();
    loadData();
    
    // Poll for new messages every 5 seconds
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);
  
  const loadData = () => {
    const inbox = messagingService.getInboxMessages(user.email, userRole);
    const sent = messagingService.getSentMessages(user.email);
    const unread = messagingService.getUnreadCount(user.email, userRole);
    const anns = messagingService.getAnnouncementsForUser(userRole);
    
    setMessages(inbox);
    setSentMessages(sent);
    setUnreadCount(unread);
    setAnnouncements(anns);
  };
  
  // Recipient options based on user role
  const getRecipientOptions = () => {
    const options: { label: string; value: string; id: string; name: string }[] = [];
    
    // Common recipients
    if (userRole !== 'principal') {
      options.push({ label: 'Principal', value: 'principal', id: 'principal@bfoia.edu.ng', name: 'Dr. Adeyemi (Principal)' });
    }
    
    if (userRole !== 'teacher') {
      options.push({ label: 'My Class Teacher', value: 'teacher', id: 'teacher@bfoia.edu.ng', name: 'Mrs. Bello (Mathematics)' });
    }
    
    if (userRole !== 'bursar') {
      options.push({ label: 'Bursar', value: 'bursar', id: 'bursar@bfoia.edu.ng', name: 'Mr. Okonkwo (Bursar)' });
    }
    
    if (userRole !== 'hr_manager') {
      options.push({ label: 'HR Manager', value: 'hr_manager', id: 'hr@bfoia.edu.ng', name: 'Mrs. Adeyemi (HR)' });
    }
    
    if (userRole !== 'proprietor') {
      options.push({ label: 'Proprietor', value: 'proprietor', id: 'proprietor@bfoia.edu.ng', name: 'Chief Williams (Proprietor)' });
    }
    
    // Broadcast options (only for admin roles)
    if (['principal', 'proprietor', 'hr_manager'].includes(userRole)) {
      options.push({ label: 'All Teachers', value: 'all_teachers', id: 'all_teachers', name: 'All Teachers' });
      options.push({ label: 'All Parents', value: 'all_parents', id: 'all_parents', name: 'All Parents' });
      options.push({ label: 'All Students', value: 'all_students', id: 'all_students', name: 'All Students' });
      options.push({ label: 'All Staff', value: 'all_staff', id: 'all_staff', name: 'All Staff' });
    }
    
    if (userRole === 'parent') {
      options.push({ label: 'My Child\'s Teacher', value: 'teacher', id: 'teacher@bfoia.edu.ng', name: 'Mrs. Bello (Mathematics)' });
    }
    
    return options;
  };
  
  const handleRecipientChange = (value: string) => {
    setRecipientRole(value);
    const option = getRecipientOptions().find(opt => opt.value === value);
    if (option) {
      setRecipientId(option.id);
      setRecipientName(option.label);
    }
  };
  
  const handleSendMessage = () => {
    if (!recipientRole || !messageSubject || !messageContent) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const newMessage = messagingService.sendMessage({
      senderId: user.email,
      senderName: user.name,
      senderRole: userRole,
      recipientId: recipientId,
      recipientName: recipientName,
      recipientRole: recipientRole as any,
      subject: messageSubject,
      content: messageContent,
      priority: messagePriority,
      category: messageCategory,
    });
    
    toast.success('Message sent successfully', {
      description: `Your message to ${recipientName} has been delivered.`,
    });
    
    loadData();
    resetComposeForm();
    setShowComposeDialog(false);
  };
  
  const handleReply = () => {
    if (!selectedMessage) return;
    
    setRecipientRole(selectedMessage.senderRole);
    setRecipientId(selectedMessage.senderId);
    setRecipientName(selectedMessage.senderName);
    setMessageSubject(selectedMessage.subject);
    setMessageContent(`\n\n--- Original Message ---\nFrom: ${selectedMessage.senderName}\nDate: ${messagingService.formatRelativeTime(selectedMessage.timestamp)}\n\n${selectedMessage.content}`);
    setMessageCategory(selectedMessage.category);
    setMessagePriority(selectedMessage.priority);
    
    setShowMessageDetailDialog(false);
    setShowComposeDialog(true);
  };
  
  const handleCreateAnnouncement = () => {
    if (!announcementTitle || !announcementContent) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    messagingService.createAnnouncement({
      authorId: user.email,
      authorName: user.name,
      authorRole: messagingService.getRoleDisplayName(userRole),
      title: announcementTitle,
      content: announcementContent,
      targetAudience: announcementAudience,
      priority: announcementPriority,
      isPinned: announcementPinned,
    });
    
    toast.success('Announcement published successfully', {
      description: `Your announcement has been sent to ${announcementAudience === 'all' ? 'everyone' : announcementAudience}.`,
    });
    
    loadData();
    resetAnnouncementForm();
    setShowAnnouncementDialog(false);
  };
  
  const handleViewMessage = (message: messagingService.Message) => {
    setSelectedMessage(message);
    
    // Mark as read if it's inbox message
    if (message.recipientId === user.email || message.recipientRole.startsWith('all_')) {
      messagingService.markAsRead(message.id);
      loadData();
    }
    
    setShowMessageDetailDialog(true);
  };
  
  const handleDeleteMessage = (messageId: string) => {
    messagingService.deleteMessage(messageId);
    toast.success('Message deleted');
    loadData();
    setShowMessageDetailDialog(false);
  };
  
  const resetComposeForm = () => {
    setRecipientRole('');
    setRecipientId('');
    setRecipientName('');
    setMessageSubject('');
    setMessageContent('');
    setMessagePriority('normal');
    setMessageCategory('general');
  };
  
  const resetAnnouncementForm = () => {
    setAnnouncementTitle('');
    setAnnouncementContent('');
    setAnnouncementAudience('all');
    setAnnouncementPriority('normal');
    setAnnouncementPinned(false);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" /> Sent</Badge>;
      case 'read':
        return <Badge variant="secondary"><CheckCircle className="w-3 h-3 mr-1" /> Read</Badge>;
      case 'replied':
        return <Badge variant="default"><Reply className="w-3 h-3 mr-1" /> Replied</Badge>;
      default:
        return null;
    }
  };
  
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="destructive">Urgent</Badge>;
      case 'high':
        return <Badge className="bg-orange-500">High</Badge>;
      case 'normal':
        return <Badge variant="secondary">Normal</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return null;
    }
  };
  
  const filteredInbox = messages.filter(msg =>
    msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.senderName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredSent = sentMessages.filter(msg =>
    msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.recipientName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredAnnouncements = announcements.filter(ann =>
    ann.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ann.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Communication Hub</h1>
          <p className="text-gray-600 mt-1">
            Professional messaging and announcements
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={() => setShowComposeDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Message
          </Button>
          
          {['principal', 'proprietor', 'hr_manager'].includes(userRole) && (
            <Button variant="outline" onClick={() => setShowAnnouncementDialog(true)}>
              <Megaphone className="w-4 h-4 mr-2" />
              Announcement
            </Button>
          )}
        </div>
      </div>
      
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Search messages, announcements, or people..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="inbox" className="relative">
            <Inbox className="w-4 h-4 mr-2" />
            Inbox
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="sent">
            <Mail className="w-4 h-4 mr-2" />
            Sent
          </TabsTrigger>
          <TabsTrigger value="announcements">
            <Megaphone className="w-4 h-4 mr-2" />
            Announcements
          </TabsTrigger>
        </TabsList>
        
        {/* Inbox Tab */}
        <TabsContent value="inbox" className="space-y-4">
          {filteredInbox.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Inbox className="w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages</h3>
                <p className="text-gray-600 text-center">
                  {searchQuery ? 'No messages match your search.' : 'Your inbox is empty.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredInbox.map((message) => (
              <Card
                key={message.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  message.status === 'sent' ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''
                }`}
                onClick={() => handleViewMessage(message)}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-base">{message.senderName}</CardTitle>
                        {message.status === 'sent' && (
                          <Badge variant="default" className="text-xs">New</Badge>
                        )}
                      </div>
                      <CardDescription className="font-semibold text-gray-900">
                        {message.subject}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getPriorityBadge(message.priority)}
                      <span className="text-xs text-gray-500">
                        {messagingService.formatRelativeTime(message.timestamp)}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {message.content}
                  </p>
                  <div className="flex gap-2 mt-3">
                    {getStatusBadge(message.status)}
                    <Badge variant="outline" className="text-xs capitalize">
                      {message.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
        
        {/* Sent Tab */}
        <TabsContent value="sent" className="space-y-4">
          {filteredSent.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Mail className="w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No sent messages</h3>
                <p className="text-gray-600 text-center">
                  {searchQuery ? 'No messages match your search.' : 'You haven\'t sent any messages yet.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredSent.map((message) => (
              <Card
                key={message.id}
                className="cursor-pointer transition-all hover:shadow-md"
                onClick={() => handleViewMessage(message)}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-base">To: {message.recipientName}</CardTitle>
                      </div>
                      <CardDescription className="font-semibold text-gray-900">
                        {message.subject}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getPriorityBadge(message.priority)}
                      <span className="text-xs text-gray-500">
                        {messagingService.formatRelativeTime(message.timestamp)}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {message.content}
                  </p>
                  <div className="flex gap-2 mt-3">
                    {getStatusBadge(message.status)}
                    <Badge variant="outline" className="text-xs capitalize">
                      {message.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
        
        {/* Announcements Tab */}
        <TabsContent value="announcements" className="space-y-4">
          {filteredAnnouncements.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Megaphone className="w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No announcements</h3>
                <p className="text-gray-600 text-center">
                  {searchQuery ? 'No announcements match your search.' : 'No announcements available.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredAnnouncements.map((announcement) => (
              <Card key={announcement.id} className={announcement.isPinned ? 'border-amber-500 border-2' : ''}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {announcement.isPinned && <Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
                        <CardTitle>{announcement.title}</CardTitle>
                      </div>
                      <CardDescription>
                        By {announcement.authorName} • {messagingService.formatRelativeTime(announcement.timestamp)}
                      </CardDescription>
                    </div>
                    {getPriorityBadge(announcement.priority)}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-line">{announcement.content}</p>
                  <div className="mt-4">
                    <Badge variant="outline" className="capitalize">
                      <Users className="w-3 h-3 mr-1" />
                      {announcement.targetAudience}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
      
      {/* Compose Message Dialog */}
      <Dialog open={showComposeDialog} onOpenChange={setShowComposeDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Compose New Message</DialogTitle>
            <DialogDescription>
              Send a professional message to staff, teachers, or parents
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Recipient *</label>
              <Select value={recipientRole} onValueChange={handleRecipientChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select recipient" />
                </SelectTrigger>
                <SelectContent>
                  {getRecipientOptions().map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Priority</label>
                <Select value={messagePriority} onValueChange={(v: any) => setMessagePriority(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select value={messageCategory} onValueChange={(v: any) => setMessageCategory(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="administrative">Administrative</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="disciplinary">Disciplinary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Subject *</label>
              <Input
                placeholder="Enter message subject"
                value={messageSubject}
                onChange={(e) => setMessageSubject(e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Message *</label>
              <Textarea
                placeholder="Type your message here..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                rows={8}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowComposeDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendMessage}>
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Create Announcement Dialog */}
      <Dialog open={showAnnouncementDialog} onOpenChange={setShowAnnouncementDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Announcement</DialogTitle>
            <DialogDescription>
              Broadcast an announcement to the school community
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Title *</label>
              <Input
                placeholder="Enter announcement title"
                value={announcementTitle}
                onChange={(e) => setAnnouncementTitle(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Target Audience *</label>
                <Select value={announcementAudience} onValueChange={(v: any) => setAnnouncementAudience(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Everyone</SelectItem>
                    <SelectItem value="teachers">Teachers Only</SelectItem>
                    <SelectItem value="students">Students Only</SelectItem>
                    <SelectItem value="parents">Parents Only</SelectItem>
                    <SelectItem value="staff">Staff Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Priority</label>
                <Select value={announcementPriority} onValueChange={(v: any) => setAnnouncementPriority(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Content *</label>
              <Textarea
                placeholder="Type your announcement here..."
                value={announcementContent}
                onChange={(e) => setAnnouncementContent(e.target.value)}
                rows={6}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="pinned"
                checked={announcementPinned}
                onChange={(e) => setAnnouncementPinned(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="pinned" className="text-sm font-medium cursor-pointer">
                Pin this announcement to the top
              </label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAnnouncementDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateAnnouncement}>
              <Megaphone className="w-4 h-4 mr-2" />
              Publish Announcement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Message Detail Dialog */}
      <Dialog open={showMessageDetailDialog} onOpenChange={setShowMessageDetailDialog}>
        <DialogContent className="max-w-2xl">
          {selectedMessage && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <DialogTitle>{selectedMessage.subject}</DialogTitle>
                    <DialogDescription>
                      From: {selectedMessage.senderName} • {messagingService.formatRelativeTime(selectedMessage.timestamp)}
                    </DialogDescription>
                  </div>
                  <div className="flex gap-2">
                    {getPriorityBadge(selectedMessage.priority)}
                  </div>
                </div>
              </DialogHeader>
              
              <div className="border-t border-b py-4 my-4">
                <p className="text-gray-700 whitespace-pre-line">{selectedMessage.content}</p>
              </div>
              
              <div className="flex gap-2">
                <Badge variant="outline" className="capitalize">
                  {message.category}
                </Badge>
                {getStatusBadge(selectedMessage.status)}
              </div>
              
              <DialogFooter className="flex gap-2">
                <Button variant="outline" onClick={() => handleDeleteMessage(selectedMessage.id)}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
                {selectedMessage.recipientId === user.email && (
                  <Button onClick={handleReply}>
                    <Reply className="w-4 h-4 mr-2" />
                    Reply
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};