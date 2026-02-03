import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Button } from '../ui/button';

// Temporary placeholder - help center feature disabled for now
export const HelpCenter: React.FC = () => {
  return (
    <Button
      variant="ghost"
      size="sm"
      title="Help & Support"
    >
      <HelpCircle className="w-5 h-5" />
    </Button>
  );
};
