import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '../ui/button';

// Temporary placeholder - global search feature disabled for now
export const GlobalSearch: React.FC = () => {
  return (
    <Button
      variant="outline"
      size="sm"
      className="hidden sm:flex items-center gap-2 text-gray-600"
    >
      <Search className="w-4 h-4" />
      <span className="text-sm">Search</span>
    </Button>
  );
};
