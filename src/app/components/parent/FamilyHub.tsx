import React, { useState } from 'react';
import {
  Users,
  DollarSign,
  Calendar,
  Bell,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  CreditCard,
  Award,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { useParent } from '../../../contexts/ParentContext';

interface SchoolEvent {
  id: string;
  title: string;
  date: string;
  type: 'holiday' | 'exam' | 'meeting' | 'event';
}

interface RecentAlert {
  id: string;
  childName: string;
  message: string;
  type: 'success' | 'warning' | 'info';
  timestamp: string;
}

interface FamilyHubProps {
  onNavigate?: (page: string) => void;
}

export const FamilyHub: React.FC<FamilyHubProps> = ({ onNavigate }) => {
  const { selectedChild, setSelectedChild, children } = useParent();

  const [schoolEvents] = useState<SchoolEvent[]>([
    {
      id: '1',
      title: 'New Year Holiday',
      date: 'Jan 1, 2026',
      type: 'holiday',
    },
    {
      id: '2',
      title: 'Mid-Term Examinations Begin',
      date: 'Jan 6 - Jan 10, 2026',
      type: 'exam',
    },
    {
      id: '3',
      title: 'PTA General Meeting',
      date: 'Jan 15, 2026 - 10:00 AM',
      type: 'meeting',
    },
    {
      id: '4',
      title: 'Inter-House Sports Competition',
      date: 'Jan 20, 2026',
      type: 'event',
    },
  ]);

  const [recentAlerts] = useState<RecentAlert[]>([
    {
      id: '1',
      childName: 'Oluwatunde',
      message: 'Completed Mathematics CBT exam - Score: 92%',
      type: 'success',
      timestamp: '2 hours ago',
    },
    {
      id: '2',
      childName: 'Adeola',
      message: 'Outstanding fee balance: ₦45,000',
      type: 'warning',
      timestamp: '1 day ago',
    },
    {
      id: '3',
      childName: 'Chinedu',
      message: 'Marked present today at 7:45 AM',
      type: 'success',
      timestamp: 'Today',
    },
    {
      id: '4',
      childName: 'Oluwatunde',
      message: 'New assignment posted in English Language',
      type: 'info',
      timestamp: 'Yesterday',
    },
    {
      id: '5',
      childName: 'Adeola',
      message: 'Report card for First Term is now available',
      type: 'info',
      timestamp: '2 days ago',
    },
  ]);

  const totalBalance = children.reduce((sum, child) => sum + child.outstandingBalance, 0);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'holiday':
        return '🎉';
      case 'exam':
        return '📝';
      case 'meeting':
        return '👥';
      case 'event':
        return '🏆';
      default:
        return '📅';
    }
  };

  const getAlertStyle = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl mb-2 text-blue-950">Family Hub</h1>
        <p className="text-sm sm:text-base text-gray-600">
          Your single window into your children's academic and school life
        </p>
      </div>

      {/* Household Financial Summary */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Household Financial Summary
          </CardTitle>
          <CardDescription>Combined financial status for all {children.length} children</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <p className="text-sm text-gray-600 mb-1">Total Outstanding</p>
              <p className="text-2xl font-bold text-red-600">
                ₦{totalBalance.toLocaleString()}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <p className="text-sm text-gray-600 mb-1">Children Paid Up</p>
              <p className="text-2xl font-bold text-green-600">
                {children.filter(c => c.outstandingBalance === 0).length}/{children.length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <p className="text-sm text-gray-600 mb-1">Payment Status</p>
              {totalBalance === 0 ? (
                <Badge className="bg-green-600 text-white mt-2">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  All Paid
                </Badge>
              ) : (
                <Badge className="bg-amber-600 text-white mt-2">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Action Required
                </Badge>
              )}
            </div>
          </div>
          
          {totalBalance > 0 && (
            <Button 
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => onNavigate && onNavigate('/fee-management')}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Make Payment
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Currently Viewing Alert */}
      <Alert className="border-blue-300 bg-blue-50">
        <Bell className="h-5 w-5 text-blue-600" />
        <AlertTitle className="text-blue-900">Currently Viewing</AlertTitle>
        <AlertDescription className="text-blue-800">
          All data below is for <strong>{selectedChild?.name}</strong> ({selectedChild?.class})
        </AlertDescription>
      </Alert>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column - 2 columns wide */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Quick Stats for Selected Child */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="pb-3">
                <CardDescription className="text-green-700">Current Average</CardDescription>
                <CardTitle className="text-3xl text-green-950">87.6%</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1 text-green-700">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">Excellent</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="pb-3">
                <CardDescription className="text-blue-700">Class Position</CardDescription>
                <CardTitle className="text-3xl text-blue-950">#5/45</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1 text-blue-700">
                  <Award className="w-4 h-4" />
                  <span className="text-sm font-medium">Top 11%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
              <CardHeader className="pb-3">
                <CardDescription className="text-amber-700">Attendance</CardDescription>
                <CardTitle className="text-3xl text-amber-950">95%</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1 text-amber-700">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Excellent</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Latest updates from all your children</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onNavigate && onNavigate('/activities')}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border ${getAlertStyle(alert.type)}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">{alert.childName}</span>
                          {alert.type === 'success' && (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          )}
                          {alert.type === 'warning' && (
                            <AlertCircle className="w-4 h-4 text-amber-600" />
                          )}
                        </div>
                        <p className="text-sm mb-1">{alert.message}</p>
                        <p className="text-xs opacity-70">{alert.timestamp}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Unified School Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                School Calendar
              </CardTitle>
              <CardDescription>Upcoming events and important dates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {schoolEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{getEventIcon(event.type)}</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm mb-1">{event.title}</h4>
                        <p className="text-xs text-gray-600">{event.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => onNavigate && onNavigate('/school-calendar')}
              >
                View Full Calendar
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};