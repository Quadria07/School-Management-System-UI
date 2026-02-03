import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ArrowLeft, CheckCircle2, AlertCircle, Info, Clock } from 'lucide-react';
import { useParent } from '../../../contexts/ParentContext';

interface ParentActivitiesPageProps {
  onNavigate?: (page: string) => void;
}

interface Activity {
  id: string;
  childName: string;
  childId: string;
  title: string;
  description: string;
  type: 'success' | 'warning' | 'info';
  timestamp: string;
  date: Date;
}

export const ParentActivitiesPage: React.FC<ParentActivitiesPageProps> = ({ onNavigate }) => {
  const { children } = useParent();

  // Generate mock activities for all children
  const activities: Activity[] = [
    {
      id: '1',
      childName: children[0]?.name || 'Child 1',
      childId: children[0]?.id || '1',
      title: 'Exam Result Released',
      description: 'Mathematics CBT exam score: 92%',
      type: 'success',
      timestamp: '2 hours ago',
      date: new Date()
    },
    {
      id: '2',
      childName: children[1]?.name || 'Child 2',
      childId: children[1]?.id || '2',
      title: 'Fee Payment Due',
      description: 'Outstanding balance: ₦45,000 for 2nd Term',
      type: 'warning',
      timestamp: '1 day ago',
      date: new Date(Date.now() - 86400000)
    },
    {
      id: '3',
      childName: children[0]?.name || 'Child 1',
      childId: children[0]?.id || '1',
      title: 'Attendance Marked',
      description: 'Marked present at 7:45 AM',
      type: 'success',
      timestamp: 'Today',
      date: new Date()
    },
    {
      id: '4',
      childName: children[0]?.name || 'Child 1',
      childId: children[0]?.id || '1',
      title: 'New Assignment',
      description: 'New assignment posted in English Language',
      type: 'info',
      timestamp: 'Yesterday',
      date: new Date(Date.now() - 86400000)
    },
    {
      id: '5',
      childName: children[1]?.name || 'Child 2',
      childId: children[1]?.id || '2',
      title: 'Report Card Available',
      description: 'Report card for First Term is now available for download',
      type: 'info',
      timestamp: '2 days ago',
      date: new Date(Date.now() - 172800000)
    },
    {
      id: '6',
      childName: children[0]?.name || 'Child 1',
      childId: children[0]?.id || '1',
      title: 'Library Book Due',
      description: 'Please return "Introduction to Physics" by tomorrow',
      type: 'warning',
      timestamp: '3 days ago',
      date: new Date(Date.now() - 259200000)
    },
     {
      id: '7',
      childName: children[1]?.name || 'Child 2',
      childId: children[1]?.id || '2',
      title: 'Teacher Message',
      description: 'Mrs. Johnson sent a note about class participation',
      type: 'info',
      timestamp: '4 days ago',
      date: new Date(Date.now() - 345600000)
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-amber-600" />;
      default: return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getStyle = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-amber-50 border-amber-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => onNavigate && onNavigate('/dashboard')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recent Activity</h1>
          <p className="text-gray-500">All updates from your children</p>
        </div>
      </div>

      <div className="grid gap-4">
        {activities.map((activity) => (
          <Card key={activity.id} className={`border-l-4 ${
            activity.type === 'success' ? 'border-l-green-500' : 
            activity.type === 'warning' ? 'border-l-amber-500' : 'border-l-blue-500'
          }`}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full ${getStyle(activity.type)}`}>
                  {getIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                      <p className="text-sm text-blue-600 font-medium mb-1">
                        {activity.childName}
                      </p>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {activity.timestamp}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{activity.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};