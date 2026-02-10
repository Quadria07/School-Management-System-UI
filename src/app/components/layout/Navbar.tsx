import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Bell, LogOut, Menu, ChevronDown, Settings, HelpCircle, Clock, CheckCircle, AlertCircle, Send, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { useParent } from '../../../contexts/ParentContext';
import { NotificationBell } from '../common/NotificationBell';
import { HelpCenter } from '../common/HelpCenter';
import { GlobalSearch } from '../common/GlobalSearch';

// Navigation bar component - no role switching in production mode
interface NavbarProps {
  onToggleSidebar?: () => void;
  onNavigate?: (page: string) => void;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning';
  read: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, onNavigate }) => {
  const { user, logout } = useAuth();
  const parentContext = useParent();

  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSubject, setSupportSubject] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([]);

  if (!user) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleEmail = (role: string) => {
    const emailMap: Record<string, string> = {
      proprietor: 'proprietor@bfoia.edu.ng',
      principal: 'principal@bfoia.edu.ng',
      hr: 'hr@bfoia.edu.ng',
      bursar: 'bursar@bfoia.edu.ng',
      teacher: 'teacher@bfoia.edu.ng',
      student: 'student@bfoia.edu.ng',
      parent: 'parent@bfoia.edu.ng',
    };
    return emailMap[role] || user.email;
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      default:
        return <Bell className="w-5 h-5 text-blue-600" />;
    }
  };

  const handleProfileSettings = () => {
    if (onNavigate) {
      onNavigate('/account-settings');
    }
  };

  const handleSendSupport = () => {
    if (!supportSubject.trim() || !supportMessage.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    // Simulate sending email
    toast.success('Support request sent successfully! We\'ll get back to you soon.');
    setShowHelpDialog(false);
    setSupportMessage('');
    setSupportSubject('');
  };

  return (
    <>
      {/* Sticky Navigation Bar - Always visible at top */}
      <nav className="sticky top-0 z-50 h-14 sm:h-16 bg-white border-b border-gray-200 px-3 sm:px-4 lg:px-6 flex items-center justify-between shadow-sm">
        {/* Left Section */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="h-8 w-8 sm:h-10 sm:w-10"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>

          <div className="hidden sm:block">
            <p className="text-[10px] sm:text-xs text-gray-500">Academic Session</p>
            <p className="text-xs sm:text-sm text-blue-950">{user.academicSession}</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1 sm:gap-2 lg:gap-4">
          {/* Global Search */}
          <GlobalSearch />

          {/* Child Switcher for Parent Role */}
          {user.role === 'parent' && parentContext && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 sm:h-8 text-[11px] sm:text-xs flex items-center gap-1 px-2 sm:px-2.5">
                  <Users className="w-3 h-3" />
                  <span className="hidden sm:inline truncate max-w-16 lg:max-w-20">
                    {parentContext.selectedChild?.name.split(' ')[0]}
                  </span>
                  <span className="sm:hidden">{parentContext.selectedChild?.photo}</span>
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 sm:w-64">
                <DropdownMenuLabel className="text-[11px] sm:text-xs flex items-center gap-2 py-2">
                  <Users className="w-3.5 h-3.5" />
                  Your Children
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {parentContext.children.map((child) => (
                  <DropdownMenuItem
                    key={child.id}
                    onClick={() => {
                      parentContext.setSelectedChild(child);
                      toast.success(`Switched to ${child.name}'s dashboard`);
                    }}
                    className={`text-[11px] sm:text-xs p-2 ${parentContext.selectedChild?.id === child.id
                        ? 'bg-blue-50 border-l-4 border-blue-600'
                        : ''
                      }`}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <div className="text-xl flex-shrink-0">{child.photo}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium truncate text-xs">{child.name}</span>
                          {parentContext.selectedChild?.id === child.id && (
                            <CheckCircle className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-[10px] text-gray-600">{child.class}</p>
                        {child.outstandingBalance > 0 ? (
                          <Badge className="bg-red-600 text-white text-[10px] mt-0.5 px-1.5 py-0">
                            ₦{child.outstandingBalance.toLocaleString()} due
                          </Badge>
                        ) : (
                          <Badge className="bg-green-600 text-white text-[10px] mt-0.5 px-1.5 py-0">
                            <CheckCircle className="w-2.5 h-2.5 mr-0.5" />
                            Paid
                          </Badge>
                        )}
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Notifications Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-8 w-8 sm:h-10 sm:w-10">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center p-0 bg-red-500 text-white text-[10px] sm:text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 sm:w-80 p-0" align="end">
              <div className="flex items-center justify-between border-b p-3">
                <p className="font-medium">Notifications</p>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs h-auto p-1"
                  >
                    Mark all as read
                  </Button>
                )}
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No notifications</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => markAsRead(notification.id)}
                      className={`p-3 border-b cursor-pointer hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50' : ''
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-sm ${!notification.read ? 'font-medium' : ''}`}>
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1"></span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{notification.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 sm:gap-3 hover:bg-gray-50 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 transition-colors">
                <Avatar className="h-7 w-7 sm:h-9 sm:w-9">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-blue-950 text-white text-xs sm:text-sm">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left hidden lg:block">
                  <p className="text-xs sm:text-sm truncate max-w-32">{user.name}</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 hidden lg:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 sm:w-56">
              <DropdownMenuLabel className="text-xs sm:text-sm">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <div className="flex flex-col">
                  <span className="font-medium text-xs sm:text-sm truncate">{user.name}</span>
                  <span className="text-[10px] sm:text-xs text-gray-500 truncate">{getRoleEmail(user.role)}</span>
                </div>
              </DropdownMenuItem>
              {user.department && (
                <DropdownMenuItem>
                  <div className="flex flex-col">
                    <span className="text-[10px] sm:text-xs text-gray-500">Department</span>
                    <span className="text-xs sm:text-sm">{user.department}</span>
                  </div>
                </DropdownMenuItem>
              )}
              {user.class && (
                <DropdownMenuItem>
                  <div className="flex flex-col">
                    <span className="text-[10px] sm:text-xs text-gray-500">Class</span>
                    <span className="text-xs sm:text-sm">{user.class}</span>
                  </div>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfileSettings} className="text-xs sm:text-sm">
                <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowHelpDialog(true)} className="text-xs sm:text-sm">
                <HelpCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-600 text-xs sm:text-sm">
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      {/* Help & Support Dialog */}
      <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
        <DialogContent className="w-[95vw] sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Help & Support</DialogTitle>
            <DialogDescription>
              Send your inquiry or complaint to our support team at Kinat Digitals.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="developer-email">Developer Email (Support)</Label>
              <Input
                id="developer-email"
                value="info@kinatdigitals.com"
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                value={supportSubject}
                onChange={(e) => setSupportSubject(e.target.value)}
                placeholder="Brief description of your issue"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={supportMessage}
                onChange={(e) => setSupportMessage(e.target.value)}
                placeholder="Describe your issue or inquiry in detail..."
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
                setShowHelpDialog(false);
                setSupportMessage('');
                setSupportSubject('');
              }}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleSendSupport}>
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};