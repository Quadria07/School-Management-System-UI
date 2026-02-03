import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Award,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  PieChart,
  Activity,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import * as dataFlowService from '@/utils/dataFlowService';

interface AnalyticsData {
  totalStudents: number;
  totalTeachers: number;
  averageAttendance: number;
  pendingApprovals: number;
  approvedResults: number;
  rejectedResults: number;
  activeCBTs: number;
  approvedLessonNotes: number;
  topPerformingClasses: Array<{ class: string; average: number }>;
  attendanceTrend: Array<{ date: string; percentage: number }>;
  subjectPerformance: Array<{ subject: string; average: number }>;
  teacherActivity: Array<{ name: string; submissions: number }>;
}

export const AnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalStudents: 0,
    totalTeachers: 0,
    averageAttendance: 0,
    pendingApprovals: 0,
    approvedResults: 0,
    rejectedResults: 0,
    activeCBTs: 0,
    approvedLessonNotes: 0,
    topPerformingClasses: [],
    attendanceTrend: [],
    subjectPerformance: [],
    teacherActivity: [],
  });

  useEffect(() => {
    loadAnalytics();
    
    // Refresh every minute
    const interval = setInterval(loadAnalytics, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadAnalytics = () => {
    // Get pending approvals
    const pendingResults = dataFlowService.getPendingResultsForApproval() || [];
    const pendingNotes = dataFlowService.getPendingLessonNotes() || [];
    const pendingExams = dataFlowService.getPendingExamsForApproval() || [];
    
    // Get approved items
    const approvedResults = dataFlowService.getApprovedResults() || [];
    const approvedNotes = dataFlowService.getApprovedLessonNotes() || [];
    const publishedExams = dataFlowService.getPublishedExams() || [];
    
    // Get attendance data
    const attendanceRecords = dataFlowService.getAllAttendanceRecords() || [];
    
    // Calculate average attendance
    let totalAttendance = 0;
    let attendanceCount = 0;
    attendanceRecords.forEach(record => {
      const presentCount = record.students.filter(s => s.status === 'present').length;
      const totalStudents = record.students.length;
      if (totalStudents > 0) {
        totalAttendance += (presentCount / totalStudents) * 100;
        attendanceCount++;
      }
    });
    const averageAttendance = attendanceCount > 0 ? totalAttendance / attendanceCount : 0;

    // Calculate top performing classes
    const classPerformance: Record<string, { total: number; count: number }> = {};
    approvedResults.forEach(result => {
      if (!classPerformance[result.class]) {
        classPerformance[result.class] = { total: 0, count: 0 };
      }
      result.students.forEach(student => {
        if (student.totalScore) {
          classPerformance[result.class].total += student.totalScore;
          classPerformance[result.class].count++;
        }
      });
    });
    
    const topPerformingClasses = Object.entries(classPerformance)
      .map(([className, data]) => ({
        class: className,
        average: data.count > 0 ? data.total / data.count : 0,
      }))
      .sort((a, b) => b.average - a.average)
      .slice(0, 5);

    // Calculate subject performance
    const subjectPerformance: Record<string, { total: number; count: number }> = {};
    approvedResults.forEach(result => {
      if (!subjectPerformance[result.subject]) {
        subjectPerformance[result.subject] = { total: 0, count: 0 };
      }
      result.students.forEach(student => {
        if (student.totalScore) {
          subjectPerformance[result.subject].total += student.totalScore;
          subjectPerformance[result.subject].count++;
        }
      });
    });
    
    const subjectPerformanceArray = Object.entries(subjectPerformance)
      .map(([subject, data]) => ({
        subject,
        average: data.count > 0 ? data.total / data.count : 0,
      }))
      .sort((a, b) => b.average - a.average);

    // Mock data for students and teachers (would come from backend)
    const totalStudents = 450;
    const totalTeachers = 35;

    setAnalytics({
      totalStudents,
      totalTeachers,
      averageAttendance: Math.round(averageAttendance),
      pendingApprovals: pendingResults.length + pendingNotes.length + pendingExams.length,
      approvedResults: approvedResults.length,
      rejectedResults: 0, // Would track rejections in backend
      activeCBTs: publishedExams.length,
      approvedLessonNotes: approvedNotes.length,
      topPerformingClasses,
      attendanceTrend: [], // Would be calculated from historical data
      subjectPerformance: subjectPerformanceArray,
      teacherActivity: [], // Would come from backend
    });
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl mb-2 text-blue-950">
          Analytics Dashboard
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          School-wide performance insights and metrics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl text-blue-950">{analytics.totalStudents}</p>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +5% from last term
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Average Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl text-blue-950">{analytics.averageAttendance}%</p>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Excellent
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending Approvals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl text-blue-950">{analytics.pendingApprovals}</p>
                <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Needs attention
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Teachers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl text-blue-950">{analytics.totalTeachers}</p>
                <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                  <Activity className="w-3 h-3" />
                  All active
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="performance">
            <Award className="w-4 h-4 mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="attendance">
            <Calendar className="w-4 h-4 mr-2" />
            Attendance
          </TabsTrigger>
          <TabsTrigger value="approvals">
            <CheckCircle className="w-4 h-4 mr-2" />
            Approvals
          </TabsTrigger>
        </TabsList>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Top Performing Classes */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Classes</CardTitle>
                <CardDescription>
                  Classes ranked by average performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.topPerformingClasses.length > 0 ? (
                    analytics.topPerformingClasses.map((item, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">
                            {index + 1}. {item.class}
                          </span>
                          <span className="text-sm text-gray-600">
                            {item.average.toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={item.average} className="h-2" />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No performance data yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Subject Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Subject Performance</CardTitle>
                <CardDescription>
                  Average scores by subject
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.subjectPerformance.length > 0 ? (
                    analytics.subjectPerformance.slice(0, 5).map((item, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{item.subject}</span>
                          <Badge
                            className={
                              item.average >= 70
                                ? 'bg-green-100 text-green-700'
                                : item.average >= 50
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-red-100 text-red-700'
                            }
                          >
                            {item.average.toFixed(1)}%
                          </Badge>
                        </div>
                        <Progress value={item.average} className="h-2" />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <PieChart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No subject data yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Overview</CardTitle>
              <CardDescription>
                School-wide attendance statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-green-100 mb-4">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-green-600">
                        {analytics.averageAttendance}%
                      </p>
                      <p className="text-xs text-gray-600">Average</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">
                      {Math.round(analytics.averageAttendance)}%
                    </p>
                    <p className="text-xs text-gray-600">Present</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-red-600">
                      {Math.round(100 - analytics.averageAttendance)}%
                    </p>
                    <p className="text-xs text-gray-600">Absent</p>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-lg">
                    <Clock className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-amber-600">5%</p>
                    <p className="text-xs text-gray-600">Late</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Approvals Tab */}
        <TabsContent value="approvals" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Results Approved</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-950">
                  {analytics.approvedResults}
                </p>
                <p className="text-xs text-gray-600 mt-1">This term</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Lesson Notes Approved</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-950">
                  {analytics.approvedLessonNotes}
                </p>
                <p className="text-xs text-gray-600 mt-1">This term</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Active CBT Exams</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-950">
                  {analytics.activeCBTs}
                </p>
                <p className="text-xs text-gray-600 mt-1">Published</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>
                Items requiring your attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.pendingApprovals > 0 ? (
                <div className="p-6 bg-amber-50 rounded-lg border border-amber-200 text-center">
                  <Clock className="w-12 h-12 text-amber-600 mx-auto mb-3" />
                  <p className="text-lg font-semibold text-amber-900">
                    {analytics.pendingApprovals} items pending approval
                  </p>
                  <p className="text-sm text-amber-700 mt-2">
                    Check the notification bell for details
                  </p>
                </div>
              ) : (
                <div className="p-6 bg-green-50 rounded-lg border border-green-200 text-center">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <p className="text-lg font-semibold text-green-900">
                    All caught up!
                  </p>
                  <p className="text-sm text-green-700 mt-2">
                    No pending approvals at this time
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
