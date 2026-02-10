import React, { useState, useEffect } from 'react';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  Award,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import * as dataFlowService from '../../../utils/dataFlowService';
import { useAuth } from '../../../contexts/AuthContext';
import { format } from 'date-fns';

interface AttendanceDay {
  date: string;
  status: 'present' | 'absent' | 'late';
  remarks?: string;
}

interface BehavioralRecord {
  id: string;
  type: 'merit' | 'demerit';
  title: string;
  description: string;
  points: number;
  date: string;
  teacher: string;
}

export const AttendanceConduct: React.FC = () => {
  const [selectedMonth] = useState('December 2025');
  const [attendanceData, setAttendanceData] = useState<AttendanceDay[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const loadAttendance = () => {
      try {
        const records = dataFlowService.getAllAttendanceRecords();

        if (records && records.length > 0 && user) {
          const studentName = user.name.toUpperCase();
          const className = 'JSS 3A';

          const attendanceDays: AttendanceDay[] = [];

          records.forEach((record: any) => {
            if (record.class === className) {
              const studentRecord = record.students.find((s: any) =>
                s.studentName.toUpperCase().includes(studentName.split(' ')[0]) ||
                s.studentName.toUpperCase() === studentName
              );

              if (studentRecord) {
                attendanceDays.push({
                  date: format(new Date(record.date), 'MMM d'),
                  status: studentRecord.status as 'present' | 'absent' | 'late',
                  remarks: record.subject,
                });
              }
            }
          });

          attendanceDays.sort((a, b) => {
            const dateA = new Date(a.date + ', 2025');
            const dateB = new Date(b.date + ', 2025');
            return dateB.getTime() - dateA.getTime();
          });

          setAttendanceData(attendanceDays);
        } else {
          setAttendanceData([]);
        }
      } catch (error) {
        console.error('Error loading attendance:', error);
      }
    };

    loadAttendance();

    const interval = setInterval(loadAttendance, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const [behavioralRecords] = useState<BehavioralRecord[]>([]);

  const totalDays = attendanceData.length;
  const presentDays = attendanceData.filter((d: AttendanceDay) => d.status === 'present').length;
  const lateDays = attendanceData.filter((d: AttendanceDay) => d.status === 'late').length;
  const absentDays = attendanceData.filter((d: AttendanceDay) => d.status === 'absent').length;
  const attendanceRate = totalDays > 0 ? ((presentDays + lateDays) / totalDays) * 100 : 0;

  const totalMerits = behavioralRecords
    .filter((r: BehavioralRecord) => r.type === 'merit')
    .reduce((sum: number, r: BehavioralRecord) => sum + r.points, 0);
  const totalDemerits = Math.abs(
    behavioralRecords.filter((r: BehavioralRecord) => r.type === 'demerit').reduce((sum: number, r: BehavioralRecord) => sum + r.points, 0)
  );
  const netPoints = totalMerits - totalDemerits;

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl mb-2 text-blue-950">Attendance & Conduct</h1>
        <p className="text-sm sm:text-base text-gray-600">
          Track your attendance and behavioral performance
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-3">
            <CardDescription className="text-green-700">Attendance Rate</CardDescription>
            <CardTitle className="text-3xl text-green-950">
              {attendanceRate.toFixed(1)}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={attendanceRate} className="h-2" />
            <p className="text-xs text-green-700 mt-2">Excellent attendance!</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-3">
            <CardDescription className="text-blue-700">Days Present</CardDescription>
            <CardTitle className="text-3xl text-blue-950 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6" />
              {presentDays}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-700">Out of {totalDays} school days</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardHeader className="pb-3">
            <CardDescription className="text-amber-700">Late Arrivals</CardDescription>
            <CardTitle className="text-3xl text-amber-950 flex items-center gap-2">
              <Clock className="w-6 h-6" />
              {lateDays}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-amber-700">Try to arrive on time</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="pb-3">
            <CardDescription className="text-red-700">Absences</CardDescription>
            <CardTitle className="text-3xl text-red-950 flex items-center gap-2">
              <XCircle className="w-6 h-6" />
              {absentDays}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-700">Keep absences low</p>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Calendar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Attendance Record
              </CardTitle>
              <CardDescription>{selectedMonth}</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              Change Month
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {attendanceData.map((day, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border-2 ${day.status === 'present'
                  ? 'bg-green-50 border-green-300'
                  : day.status === 'late'
                    ? 'bg-amber-50 border-amber-300'
                    : 'bg-red-50 border-red-300'
                  }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-600">{day.date}</span>
                  {day.status === 'present' && (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  )}
                  {day.status === 'late' && <Clock className="w-4 h-4 text-amber-600" />}
                  {day.status === 'absent' && <XCircle className="w-4 h-4 text-red-600" />}
                </div>
                <p className="text-xs font-semibold capitalize">{day.status}</p>
                {day.remarks && <p className="text-xs text-gray-600 mt-1">{day.remarks}</p>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Behavioral Points */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Behavioral Points System
          </CardTitle>
          <CardDescription>Merit and demerit tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-sm text-green-700 mb-1">Merit Points</p>
              <p className="text-3xl font-bold text-green-900">+{totalMerits}</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-sm text-red-700 mb-1">Demerit Points</p>
              <p className="text-3xl font-bold text-red-900">-{totalDemerits}</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-sm text-blue-700 mb-1">Net Score</p>
              <p className="text-3xl font-bold text-blue-900">{netPoints}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Recent Records:</h4>
            {behavioralRecords.map((record) => (
              <div
                key={record.id}
                className={`p-4 rounded-lg border ${record.type === 'merit'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
                  }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-semibold text-sm">{record.title}</h5>
                      <Badge
                        className={
                          record.type === 'merit'
                            ? 'bg-green-600 text-white'
                            : 'bg-red-600 text-white'
                        }
                      >
                        {record.type === 'merit' ? '+' : ''}
                        {record.points}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-1">{record.description}</p>
                    <p className="text-xs text-gray-600">
                      {record.teacher} • {record.date}
                    </p>
                  </div>
                  {record.type === 'merit' ? (
                    <Award className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};