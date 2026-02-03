import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from '../ui/button';

// Temporary placeholder - notification bell uses existing Navbar notifications
export const NotificationBell: React.FC = () => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="relative"
      aria-label="Notifications"
    >
      <Bell className="w-5 h-5" />
    </Button>
  );
};
