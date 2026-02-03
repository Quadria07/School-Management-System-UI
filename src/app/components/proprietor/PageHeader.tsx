import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  icon: Icon,
  action,
}) => {
  return (
    <div className="flex items-start justify-between mb-6">
      <div className="flex items-start gap-4">
        {Icon && (
          <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center">
            <Icon className="w-6 h-6 text-blue-950" />
          </div>
        )}
        <div>
          <h1 className="text-3xl mb-2">{title}</h1>
          {description && <p className="text-gray-600">{description}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};
