import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { BookOpen, FileQuestion, Award, Calendar, Clock, Target, Loader2, AlertCircle, DollarSign, RefreshCw } from 'lucide-react';
import { StudentAPI } from '../../../utils/api';
import { useAuth } from '../../../contexts/AuthContext';

interface StudentStats {
  total_subjects: string;
  attendance_percentage: string;
  average_score: string;
  pending_assignments: string;
}

interface StudentProfile {
  id: string;
  full_name: string;
  email: string;
  class_name: string;
  student_id: string;
}

interface FeeBalance {
  balance: number;
  payment_status: string;
  total_amount?: number;
  amount_paid?: number;
}

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();

  // API Data States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [feeBalance, setFeeBalance] = useState<FeeBalance | null>(null);

  // Fetch data on mount
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch all data in parallel
      const [profileRes, statsRes, feeRes] = await Promise.all([
        StudentAPI.getProfile(),
        StudentAPI.getStats(),
        StudentAPI.getFeeBalance(),
      ]);

      if (profileRes.status === 'success') {
        setProfile(profileRes.data);
      }

      if (statsRes.status === 'success') {
        setStats(statsRes.data);
      }

      if (feeRes.status === 'success') {
        setFeeBalance(feeRes.data);
      }

    } catch (err: any) {
      console.error('Dashboard fetch error:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Build stats array from API data
  const statsCards = [
    {
      label: 'Active Subjects',
      value: stats?.total_subjects || '0',
      icon: BookOpen,
      color: 'bg-blue-500'
    },
    {
      label: 'Pending Assignments',
      value: stats?.pending_assignments || '0',
      icon: FileQuestion,
      color: 'bg-amber-500'
    },
    {
      label: 'Average Score',
      value: stats?.average_score ? `${parseFloat(stats.average_score).toFixed(0)}%` : 'N/A',
      icon: Award,
      color: 'bg-green-500'
    },
    {
      label: 'Attendance',
      value: stats?.attendance_percentage ? `${parseFloat(stats.attendance_percentage).toFixed(0)}%` : 'N/A',
      icon: Calendar,
      color: 'bg-purple-500'
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl text-blue-950">Student Dashboard</h1>
          <p className="text-gray-500">
            Welcome back, {profile?.full_name || user?.name || 'Student'}!
            {profile?.class_name && <span className="ml-2 text-blue-600">({profile.class_name})</span>}
          </p>
          {profile?.student_id && (
            <p className="text-sm text-gray-400">Student ID: {profile.student_id}</p>
          )}
        </div>
        <Button variant="outline" onClick={fetchDashboardData} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Loading dashboard...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700">{error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchDashboardData}
              className="ml-auto"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                      <p className="text-3xl mt-2">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Fee Balance Card */}
      {!loading && !error && feeBalance && (
        <Card className={feeBalance.balance > 0 ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DollarSign className={`w-6 h-6 ${feeBalance.balance > 0 ? 'text-red-500' : 'text-green-500'}`} />
              <div>
                <p className="text-sm text-gray-600">Fee Status</p>
                <p className="font-semibold">
                  {feeBalance.balance > 0
                    ? `Balance: ₦${feeBalance.balance.toLocaleString()}`
                    : 'Fees Cleared ✓'}
                </p>
              </div>
            </div>
            <Badge className={feeBalance.payment_status === 'paid' ? 'bg-green-500' : 'bg-amber-500'}>
              {feeBalance.payment_status?.toUpperCase() || 'PENDING'}
            </Badge>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      {!loading && !error && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Access common features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-24 flex-col gap-2">
                <Award className="w-6 h-6 text-blue-600" />
                <span>View Results</span>
              </Button>
              <Button variant="outline" className="h-24 flex-col gap-2">
                <DollarSign className="w-6 h-6 text-green-600" />
                <span>Fee Status</span>
              </Button>
              <Button variant="outline" className="h-24 flex-col gap-2">
                <Calendar className="w-6 h-6 text-purple-600" />
                <span>Attendance</span>
              </Button>
              <Button variant="outline" className="h-24 flex-col gap-2">
                <BookOpen className="w-6 h-6 text-amber-600" />
                <span>Study Materials</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Welcome Message for New Users */}
      {!loading && !error && !stats?.total_subjects && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900">Welcome to BFOIA Portal!</h3>
              <p className="text-sm text-blue-700">
                Your dashboard will populate with data as your teachers update your records.
                Check back soon for your results, attendance, and assignments.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
