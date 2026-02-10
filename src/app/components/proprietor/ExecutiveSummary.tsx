import React, { useState, useEffect } from 'react';
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
  Clock,
  Loader2
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AdminAPI } from '../../../utils/api';
import { useAuth } from '../../../contexts/AuthContext';

// Mock data (Charts will still use mock for now as backend doesn't provide historical data)
const enrollmentData: any[] = [];
const attendanceData: any[] = [];

export const ExecutiveSummary: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [financialStats, setFinancialStats] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, finRes] = await Promise.all([
          AdminAPI.getStats(),
          AdminAPI.getFinancialSummary()
        ]);
        if (statsRes.status === 'success') setStats(statsRes.data);
        if (finRes.status === 'success') setFinancialStats(finRes.data);
      } catch (error) {
        console.error('Error fetching proprietor stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const revenueVsDebt = [
    { category: 'Total Revenue', amount: financialStats?.total_collected || 0 },
    { category: 'Outstanding Debt', amount: (financialStats?.total_expected || 0) - (financialStats?.total_collected || 0) },
  ];

  return (
    <div className="p-8">
      <PageHeader
        title={`Welcome back, ${user?.name || 'Proprietor'}`}
        description="The pulse of Bishop Felix Owolabi International Academy"
        icon={TrendingUp}
      />

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          <span className="ml-3 text-lg text-gray-600">Loading executive overview...</span>
        </div>
      )}

      {!loading && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Enrollment"
              value={stats?.total_students || "0"}
              change={`${stats?.total_classes || 0} active classes`}
              changeType="positive"
              icon={Users}
              iconBgColor="bg-blue-500"
              iconColor="text-white"
            />
            <StatCard
              title="Revenue Collected"
              value={`₦${((financialStats?.total_collected || 0) / 1000000).toFixed(2)}M`}
              change={`${financialStats?.total_expected > 0 ? ((financialStats.total_collected / financialStats.total_expected) * 100).toFixed(1) : 0}% collection rate`}
              changeType="positive"
              icon={DollarSign}
              iconBgColor="bg-green-500"
              iconColor="text-white"
            />
            <StatCard
              title="Outstanding Debt"
              value={`₦${(((financialStats?.total_expected || 0) - (financialStats?.total_collected || 0)) / 1000).toFixed(0)}K`}
              change="Total balance due"
              changeType="negative"
              icon={AlertCircle}
              iconBgColor="bg-red-500"
              iconColor="text-white"
            />
            <StatCard
              title="Active Staff"
              value={stats?.total_teachers || "0"}
              change="Academic & support"
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
                <p className="text-2xl">0%</p>
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
              <p className="text-3xl mb-2">0</p>
              <p className="text-sm text-blue-100">All tasks caught up</p>
            </div>

            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg p-6 text-white">
              <AlertCircle className="w-8 h-8 mb-4" />
              <p className="text-lg mb-2">Critical Alerts</p>
              <p className="text-3xl mb-2">0</p>
              <p className="text-sm text-amber-100">No active alerts</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
              <TrendingUp className="w-8 h-8 mb-4" />
              <h4 className="text-lg mb-2">This Month's Growth</h4>
              <p className="text-3xl mb-2">0</p>
              <p className="text-sm text-green-100">New enrollments this month</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
