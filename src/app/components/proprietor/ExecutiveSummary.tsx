import React from 'react';
import { PageHeader } from './PageHeader';
import { StatCard } from './StatCard';
import { 
  Users, 
  DollarSign, 
  UserCheck, 
  TrendingUp,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data
const enrollmentData = [
  { month: 'Jan', students: 245 },
  { month: 'Feb', students: 258 },
  { month: 'Mar', students: 271 },
  { month: 'Apr', students: 285 },
  { month: 'May', students: 298 },
  { month: 'Jun', students: 312 },
];

const attendanceData = [
  { name: 'Present', value: 289, color: '#10b981' },
  { name: 'Absent', value: 23, color: '#ef4444' },
  { name: 'Late', value: 12, color: '#f59e0b' },
];

const revenueVsDebt = [
  { category: 'Total Revenue', amount: 4500000 },
  { category: 'Outstanding Debt', amount: 850000 },
];

export const ExecutiveSummary: React.FC = () => {
  return (
    <div className="p-8">
      <PageHeader
        title="Executive Summary"
        description="The pulse of Bishop Felix Owolabi International Academy"
        icon={TrendingUp}
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Enrollment"
          value="312"
          change="+8.5% from last session"
          changeType="positive"
          icon={Users}
          iconBgColor="bg-blue-500"
          iconColor="text-white"
        />
        <StatCard
          title="Revenue Collected"
          value="₦4.5M"
          change="81% collection rate"
          changeType="positive"
          icon={DollarSign}
          iconBgColor="bg-green-500"
          iconColor="text-white"
        />
        <StatCard
          title="Outstanding Debt"
          value="₦850K"
          change="19% of total fees"
          changeType="negative"
          icon={AlertCircle}
          iconBgColor="bg-red-500"
          iconColor="text-white"
        />
        <StatCard
          title="Active Staff"
          value="42"
          change="3 on leave today"
          changeType="neutral"
          icon={UserCheck}
          iconBgColor="bg-amber-500"
          iconColor="text-blue-950"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Enrollment Trend */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg">Enrollment Trend</h3>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={enrollmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="students" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Today's Attendance */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg">Today's Attendance</h3>
            <CheckCircle className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={attendanceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {attendanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 text-center">
            <p className="text-2xl">92.3%</p>
            <p className="text-sm text-gray-600">Overall Attendance Rate</p>
          </div>
        </div>
      </div>

      {/* Financial Snapshot */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg">Financial Snapshot - Current Term</h3>
          <DollarSign className="w-5 h-5 text-gray-400" />
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueVsDebt}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip formatter={(value) => `₦${(Number(value) / 1000).toFixed(0)}K`} />
            <Legend />
            <Bar dataKey="amount" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <Clock className="w-8 h-8 mb-4" />
          <h4 className="text-lg mb-2">Pending Approvals</h4>
          <p className="text-3xl mb-2">7</p>
          <p className="text-sm text-blue-100">3 Lesson Notes, 2 Leave Requests, 2 Expense Claims</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg p-6 text-white">
          <AlertCircle className="w-8 h-8 mb-4" />
          <p className="text-lg mb-2">Critical Alerts</p>
          <p className="text-3xl mb-2">2</p>
          <p className="text-sm text-amber-100">1 Maintenance Issue, 1 Fee Reminder Due</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
          <TrendingUp className="w-8 h-8 mb-4" />
          <h4 className="text-lg mb-2">This Month's Growth</h4>
          <p className="text-3xl mb-2">+12</p>
          <p className="text-sm text-green-100">New enrollments vs. last month</p>
        </div>
      </div>
    </div>
  );
};
