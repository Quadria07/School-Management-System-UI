/**
 * Unified Messaging Service for BFOIA School Management System
 * Handles inter-role communication across all user types
 */

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'principal' | 'teacher' | 'student' | 'parent' | 'hr_manager' | 'bursar' | 'proprietor';
  recipientId: string;
  recipientName: string;
  recipientRole: 'principal' | 'teacher' | 'student' | 'parent' | 'hr_manager' | 'bursar' | 'proprietor' | 'all_teachers' | 'all_parents' | 'all_students' | 'all_staff';
  subject: string;
  content: string;
  timestamp: string;
  status: 'sent' | 'read' | 'replied';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  category: 'academic' | 'administrative' | 'financial' | 'disciplinary' | 'general';
  attachments?: string[];
  replyTo?: string; // ID of the message being replied to
  thread?: string; // Thread ID for conversations
}

export interface Announcement {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  title: string;
  content: string;
  targetAudience: 'all' | 'teachers' | 'students' | 'parents' | 'staff';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  timestamp: string;
  expiryDate?: string;
  isPinned: boolean;
}

const MESSAGES_KEY = 'bfoia_messages';
const ANNOUNCEMENTS_KEY = 'bfoia_announcements';

/**
 * Get all messages from localStorage
 */
export const getAllMessages = (): Message[] => {
  try {
    const messages = localStorage.getItem(MESSAGES_KEY);
    return messages ? JSON.parse(messages) : [];
  } catch (error) {
    console.error('Error loading messages:', error);
    return [];
  }
};

/**
 * Get messages for a specific user
 */
export const getMessagesForUser = (userId: string, userRole: string): Message[] => {
  const allMessages = getAllMessages();
  
  return allMessages.filter(message => {
    // User is the recipient
    if (message.recipientId === userId) return true;
    
    // User is the sender
    if (message.senderId === userId) return true;
    
    // Broadcast messages
    if (message.recipientRole === 'all_teachers' && userRole === 'teacher') return true;
    if (message.recipientRole === 'all_parents' && userRole === 'parent') return true;
    if (message.recipientRole === 'all_students' && userRole === 'student') return true;
    if (message.recipientRole === 'all_staff' && ['teacher', 'hr_manager', 'bursar'].includes(userRole)) return true;
    
    return false;
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

/**
 * Get inbox messages (received by user)
 */
export const getInboxMessages = (userId: string, userRole: string): Message[] => {
  const allMessages = getAllMessages();
  
  return allMessages.filter(message => {
    if (message.recipientId === userId) return true;
    if (message.recipientRole === 'all_teachers' && userRole === 'teacher') return true;
    if (message.recipientRole === 'all_parents' && userRole === 'parent') return true;
    if (message.recipientRole === 'all_students' && userRole === 'student') return true;
    if (message.recipientRole === 'all_staff' && ['teacher', 'hr_manager', 'bursar'].includes(userRole)) return true;
    
    return false;
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

/**
 * Get sent messages (sent by user)
 */
export const getSentMessages = (userId: string): Message[] => {
  const allMessages = getAllMessages();
  
  return allMessages
    .filter(message => message.senderId === userId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

/**
 * Send a new message
 */
export const sendMessage = (message: Omit<Message, 'id' | 'timestamp' | 'status'>): Message => {
  const allMessages = getAllMessages();
  
  const newMessage: Message = {
    ...message,
    id: `MSG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    status: 'sent',
  };
  
  allMessages.push(newMessage);
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(allMessages));
  
  return newMessage;
};

/**
 * Mark message as read
 */
export const markAsRead = (messageId: string): void => {
  const allMessages = getAllMessages();
  const messageIndex = allMessages.findIndex(m => m.id === messageId);
  
  if (messageIndex !== -1) {
    allMessages[messageIndex].status = 'read';
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(allMessages));
  }
};

/**
 * Mark message as replied
 */
export const markAsReplied = (messageId: string): void => {
  const allMessages = getAllMessages();
  const messageIndex = allMessages.findIndex(m => m.id === messageId);
  
  if (messageIndex !== -1) {
    allMessages[messageIndex].status = 'replied';
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(allMessages));
  }
};

/**
 * Get unread message count
 */
export const getUnreadCount = (userId: string, userRole: string): number => {
  const inbox = getInboxMessages(userId, userRole);
  return inbox.filter(m => m.status === 'sent').length;
};

/**
 * Get message thread
 */
export const getMessageThread = (threadId: string): Message[] => {
  const allMessages = getAllMessages();
  
  return allMessages
    .filter(message => message.thread === threadId || message.id === threadId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

/**
 * Reply to a message
 */
export const replyToMessage = (
  originalMessageId: string,
  replyContent: Omit<Message, 'id' | 'timestamp' | 'status' | 'replyTo' | 'thread'>
): Message => {
  const allMessages = getAllMessages();
  const originalMessage = allMessages.find(m => m.id === originalMessageId);
  
  const threadId = originalMessage?.thread || originalMessageId;
  
  const reply = sendMessage({
    ...replyContent,
    replyTo: originalMessageId,
    thread: threadId,
    subject: `Re: ${replyContent.subject}`,
  });
  
  // Mark original message as replied
  markAsReplied(originalMessageId);
  
  return reply;
};

/**
 * Delete a message
 */
export const deleteMessage = (messageId: string): void => {
  const allMessages = getAllMessages();
  const filteredMessages = allMessages.filter(m => m.id !== messageId);
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(filteredMessages));
};

// ============ ANNOUNCEMENTS ============

/**
 * Get all announcements
 */
export const getAllAnnouncements = (): Announcement[] => {
  try {
    const announcements = localStorage.getItem(ANNOUNCEMENTS_KEY);
    return announcements ? JSON.parse(announcements) : [];
  } catch (error) {
    console.error('Error loading announcements:', error);
    return [];
  }
};

/**
 * Get announcements for a specific user role
 */
export const getAnnouncementsForUser = (userRole: string): Announcement[] => {
  const allAnnouncements = getAllAnnouncements();
  const now = new Date();
  
  return allAnnouncements
    .filter(announcement => {
      // Check if expired
      if (announcement.expiryDate && new Date(announcement.expiryDate) < now) {
        return false;
      }
      
      // Check target audience
      if (announcement.targetAudience === 'all') return true;
      if (announcement.targetAudience === 'teachers' && userRole === 'teacher') return true;
      if (announcement.targetAudience === 'students' && userRole === 'student') return true;
      if (announcement.targetAudience === 'parents' && userRole === 'parent') return true;
      if (announcement.targetAudience === 'staff' && ['teacher', 'hr_manager', 'bursar'].includes(userRole)) return true;
      
      return false;
    })
    .sort((a, b) => {
      // Pinned items first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      // Then by timestamp
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
};

/**
 * Create an announcement
 */
export const createAnnouncement = (announcement: Omit<Announcement, 'id' | 'timestamp'>): Announcement => {
  const allAnnouncements = getAllAnnouncements();
  
  const newAnnouncement: Announcement = {
    ...announcement,
    id: `ANN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
  };
  
  allAnnouncements.push(newAnnouncement);
  localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(allAnnouncements));
  
  return newAnnouncement;
};

/**
 * Delete an announcement
 */
export const deleteAnnouncement = (announcementId: string): void => {
  const allAnnouncements = getAllAnnouncements();
  const filteredAnnouncements = allAnnouncements.filter(a => a.id !== announcementId);
  localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(filteredAnnouncements));
};

/**
 * Initialize sample messages for demo
 */
export const initializeSampleMessages = (): void => {
  const existingMessages = getAllMessages();
  
  if (existingMessages.length === 0) {
    const sampleMessages: Message[] = [
      {
        id: 'MSG-001',
        senderId: 'principal@bfoia.edu.ng',
        senderName: 'Dr. Adeyemi (Principal)',
        senderRole: 'principal',
        recipientId: 'teacher@bfoia.edu.ng',
        recipientName: 'Mrs. Bello (Mathematics)',
        recipientRole: 'teacher',
        subject: 'First Term Results Submission',
        content: 'Dear Mrs. Bello,\n\nPlease ensure all first term results for JSS 3A are submitted by Friday. The broadsheet looks excellent so far.\n\nBest regards,\nDr. Adeyemi',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: 'read',
        priority: 'normal',
        category: 'academic',
      },
      {
        id: 'MSG-002',
        senderId: 'teacher@bfoia.edu.ng',
        senderName: 'Mrs. Bello (Mathematics)',
        senderRole: 'teacher',
        recipientId: 'principal@bfoia.edu.ng',
        recipientName: 'Dr. Adeyemi (Principal)',
        recipientRole: 'principal',
        subject: 'Re: First Term Results Submission',
        content: 'Dear Principal,\n\nThank you for the reminder. I have just submitted all JSS 3A results. Please review and approve.\n\nRespectfully,\nMrs. Bello',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        status: 'read',
        priority: 'normal',
        category: 'academic',
        replyTo: 'MSG-001',
        thread: 'MSG-001',
      },
    ];
    
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(sampleMessages));
  }
  
  const existingAnnouncements = getAllAnnouncements();
  
  if (existingAnnouncements.length === 0) {
    const sampleAnnouncements: Announcement[] = [
      {
        id: 'ANN-001',
        authorId: 'principal@bfoia.edu.ng',
        authorName: 'Dr. Adeyemi',
        authorRole: 'Principal',
        title: 'Mid-Term Break Announcement',
        content: 'The mid-term break will commence on Friday, January 31st, 2026. Students are expected to resume on Monday, February 10th, 2026. Have a wonderful break!',
        targetAudience: 'all',
        priority: 'high',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        isPinned: true,
      },
      {
        id: 'ANN-002',
        authorId: 'bursar@bfoia.edu.ng',
        authorName: 'Mr. Okonkwo',
        authorRole: 'Bursar',
        title: 'School Fees Payment Deadline',
        content: 'Parents are reminded that the deadline for second term fees payment is February 15th, 2026. Late payment attracts a 10% penalty.',
        targetAudience: 'parents',
        priority: 'urgent',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        isPinned: false,
      },
    ];
    
    localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(sampleAnnouncements));
  }
};

/**
 * Get role display name
 */
export const getRoleDisplayName = (role: string): string => {
  const roleMap: Record<string, string> = {
    principal: 'Principal',
    teacher: 'Teacher',
    student: 'Student',
    parent: 'Parent',
    hr_manager: 'HR Manager',
    bursar: 'Bursar',
    proprietor: 'Proprietor',
    all_teachers: 'All Teachers',
    all_parents: 'All Parents',
    all_students: 'All Students',
    all_staff: 'All Staff',
  };
  
  return roleMap[role] || role;
};

/**
 * Format timestamp to relative time
 */
export const formatRelativeTime = (timestamp: string): string => {
  const now = new Date();
  const messageDate = new Date(timestamp);
  const diffMs = now.getTime() - messageDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return messageDate.toLocaleDateString();
};
