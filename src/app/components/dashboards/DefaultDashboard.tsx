import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Activity,
  GraduationCap,
  BookCheck,
  Calendar,
  Receipt
} from 'lucide-react';

export const DefaultDashboard: React.FC = () => {
  const { user } = useAuth();

  const getDashboardData = () => {
    switch (user?.role) {
      case 'proprietor':
        return {
          title: 'Proprietor Dashboard',
          subtitle: 'Overview of school operations and financial performance',
          stats: [
            { label: 'Total Revenue', value: '₦45.2M', icon: DollarSign, color: 'bg-green-500', change: '+12.5%' },
            { label: 'Student Population', value: '1,247', icon: Users, color: 'bg-blue-500', change: '+8.3%' },
            { label: 'Staff Count', value: '156', icon: Users, color: 'bg-purple-500', change: '+3.2%' },
            { label: 'Active Programs', value: '12', icon: GraduationCap, color: 'bg-amber-500', change: '0%' },
          ],
          recentActivities: [
            { action: 'New student registration', user: 'John Doe', time: '5 minutes ago' },
            { action: 'Fee payment received', user: 'Jane Smith - JSS 2A', time: '15 minutes ago' },
            { action: 'Staff leave approved', user: 'Mr. Johnson', time: '1 hour ago' },
            { action: 'Lesson note approved', user: 'Mrs. Williams', time: '2 hours ago' },
          ],
        };

      case 'principal':
        return {
          title: 'Principal Dashboard',
          subtitle: 'Academic oversight and administrative management',
          stats: [
            { label: 'Pending Approvals', value: '8', icon: BookCheck, color: 'bg-amber-500', change: '-2' },
            { label: 'Total Students', value: '1,247', icon: Users, color: 'bg-blue-500', change: '+15' },
            { label: 'Active Teachers', value: '78', icon: Users, color: 'bg-green-500', change: '+2' },
            { label: 'Entrance Applicants', value: '45', icon: GraduationCap, color: 'bg-purple-500', change: '+12' },
          ],
          recentActivities: [
            { action: 'Lesson note submitted', user: 'Mr. Teacher - Mathematics', time: '10 minutes ago' },
            { action: 'Entrance exam completed', user: 'Applicant #234', time: '30 minutes ago' },
            { action: 'Teacher attendance marked', user: 'Mrs. Williams', time: '1 hour ago' },
            { action: 'Student disciplinary report', user: 'SSS 2B', time: '3 hours ago' },
          ],
        };

      case 'hr':
        return {
          title: 'HR Manager Dashboard',
          subtitle: 'Human resources and staff management',
          stats: [
            { label: 'Total Staff', value: '156', icon: Users, color: 'bg-blue-500', change: '+3' },
            { label: 'Pending Leave', value: '12', icon: Calendar, color: 'bg-amber-500', change: '+4' },
            { label: 'Active Recruitment', value: '5', icon: Users, color: 'bg-green-500', change: '+2' },
            { label: 'Attendance Rate', value: '97%', icon: Activity, color: 'bg-purple-500', change: '+1.2%' },
          ],
          recentActivities: [
            { action: 'Leave request submitted', user: 'Mr. Johnson', time: '20 minutes ago' },
            { action: 'New staff onboarded', user: 'Mrs. Anderson', time: '2 hours ago' },
            { action: 'Performance review completed', user: 'Mr. Davis', time: '4 hours ago' },
            { action: 'Training scheduled', user: 'All Teaching Staff', time: '1 day ago' },
          ],
        };

      case 'bursar':
        return {
          title: 'Bursar Dashboard',
          subtitle: 'Financial management and fee tracking',
          stats: [
            { label: 'Total Collections', value: '₦12.8M', icon: DollarSign, color: 'bg-green-500', change: '+15.2%' },
            { label: 'Outstanding Fees', value: '₦3.4M', icon: Receipt, color: 'bg-red-500', change: '-8.1%' },
            { label: 'Transactions Today', value: '34', icon: Activity, color: 'bg-blue-500', change: '+12' },
            { label: 'Payment Rate', value: '78%', icon: TrendingUp, color: 'bg-amber-500', change: '+5.3%' },
          ],
          recentActivities: [
            { action: 'Fee payment received', user: 'Student #1234 - ₦50,000', time: '5 minutes ago' },
            { action: 'Invoice generated', user: 'JSS 1A - Full Class', time: '30 minutes ago' },
            { action: 'Expense recorded', user: 'Maintenance - ₦25,000', time: '2 hours ago' },
            { action: 'Payment reminder sent', user: '45 students', time: '4 hours ago' },
          ],
        };

      case 'parent':
        return {
          title: 'Parent Dashboard',
          subtitle: 'Monitor your ward\'s academic progress',
          stats: [
            { label: 'My Wards', value: '2', icon: Users, color: 'bg-blue-500', change: '' },
            { label: 'Outstanding Fees', value: '₦0', icon: Receipt, color: 'bg-green-500', change: 'Paid' },
            { label: 'Average Score', value: '82%', icon: TrendingUp, color: 'bg-purple-500', change: '+3%' },
            { label: 'Attendance', value: '96%', icon: Calendar, color: 'bg-amber-500', change: '+1%' },
          ],
          recentActivities: [
            { action: 'Test result published', user: 'Mathematics - 85%', time: '1 day ago' },
            { action: 'Fee payment successful', user: '2nd Term Fees - ₦50,000', time: '3 days ago' },
            { action: 'Teacher comment added', user: 'English Language', time: '5 days ago' },
            { action: 'Attendance recorded', user: '100% this week', time: '1 week ago' },
          ],
        };

      default:
        return {
          title: 'Dashboard',
          subtitle: 'Welcome to BFOIA School Management System',
          stats: [],
          recentActivities: [],
        };
    }
  };

  const data = getDashboardData();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl text-blue-950">{data.title}</h1>
        <p className="text-gray-500">{data.subtitle}</p>
      </div>

      {/* Stats Cards */}
      {data.stats.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          {data.stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <p className="text-3xl">{stat.value}</p>
                    {stat.change && (
                      <Badge variant="secondary" className="text-xs">
                        {stat.change}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Recent Activities */}
      {data.recentActivities.length > 0 && (
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Live updates from the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-b-0">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.user}</p>
                    </div>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {user?.role === 'proprietor' && (
                  <>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4 text-center">
                        <TrendingUp className="w-6 h-6 mx-auto mb-2 text-blue-950" />
                        <p className="text-sm">View Analytics</p>
                      </CardContent>
                    </Card>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4 text-center">
                        <Activity className="w-6 h-6 mx-auto mb-2 text-blue-950" />
                        <p className="text-sm">Audit Trail</p>
                      </CardContent>
                    </Card>
                  </>
                )}
                {user?.role === 'principal' && (
                  <>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4 text-center">
                        <GraduationCap className="w-6 h-6 mx-auto mb-2 text-blue-950" />
                        <p className="text-sm">Create Exam</p>
                      </CardContent>
                    </Card>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4 text-center">
                        <BookCheck className="w-6 h-6 mx-auto mb-2 text-blue-950" />
                        <p className="text-sm">Review Notes</p>
                      </CardContent>
                    </Card>
                  </>
                )}
                {(user?.role === 'hr' || user?.role === 'bursar' || user?.role === 'parent') && (
                  <>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4 text-center">
                        <Users className="w-6 h-6 mx-auto mb-2 text-blue-950" />
                        <p className="text-sm">View Records</p>
                      </CardContent>
                    </Card>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4 text-center">
                        <Receipt className="w-6 h-6 mx-auto mb-2 text-blue-950" />
                        <p className="text-sm">Generate Report</p>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
