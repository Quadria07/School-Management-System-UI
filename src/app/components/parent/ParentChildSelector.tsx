import React from 'react';
import { Users, CheckCircle2 } from 'lucide-react';
import { useParent } from '../../../contexts/ParentContext';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

export const ParentChildSelector: React.FC = () => {
  const { selectedChild, setSelectedChild, children } = useParent();

  return (
    <div className="sticky top-0 z-30 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200 shadow-sm mb-6">
      <div className="px-4 py-2 sm:px-6">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-semibold text-gray-700">Select Child Context:</h2>
        </div>
        
        {/* Desktop View: Horizontal List */}
        <div className="hidden md:flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {children.map((child) => (
            <button
              key={child.id}
              onClick={() => setSelectedChild(child)}
              className={`flex items-center gap-2 p-2 rounded-md border transition-all min-w-[140px] ${
                selectedChild?.id === child.id
                  ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex-1 text-left min-w-0">
                <p className="font-medium text-sm truncate">{child.name}</p>
                <p className="text-xs text-gray-500 truncate">{child.class}</p>
              </div>
              {child.outstandingBalance > 0 ? (
                <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>

        {/* Mobile View: Dropdown */}
        <div className="block md:hidden pb-2">
          <Select
            value={selectedChild?.id}
            onValueChange={(value) => {
              const child = children.find((c) => c.id === value);
              if (child) setSelectedChild(child);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a child" />
            </SelectTrigger>
            <SelectContent>
              {children.map((child) => (
                <SelectItem key={child.id} value={child.id}>
                  <div className="flex items-center justify-between w-full gap-2">
                    <span className="font-medium">{child.name}</span>
                    <span className="text-muted-foreground text-xs">({child.class})</span>
                    {child.outstandingBalance > 0 ? (
                      <div className="w-2 h-2 rounded-full bg-red-500 ml-auto" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-green-500 ml-auto" />
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};