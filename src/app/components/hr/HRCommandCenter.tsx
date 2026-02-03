import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  UserX,
  AlertTriangle,
  Clock,
  FileWarning,
  TrendingUp,
  Calendar,
  Award,
  Briefcase,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface StaffingSummary {
  department: string;
  required: number;
  current: number;
  gap: number;
}

interface ExpiringDocument {
  staffName: string;
  documentType: string;
  expiryDate: string;
  daysLeft: number;
}

interface HRCommandCenterProps {
  onNavigate?: (page: string) => void;
}

export const HRCommandCenter: React.FC<HRCommandCenterProps> = ({ onNavigate }) => {
  const totalStaff = 85;
  const academicStaff = 62;
  const nonAcademicStaff = 23;
  const presentToday = 78;
  const absentToday = 5;
  const onLeave = 2;

  const [staffingGaps] = useState<StaffingSummary[]>([
    { department: 'Mathematics', required: 8, current: 6, gap: 2 },
    { department: 'Physics', required: 6, current: 5, gap: 1 },
    { department: 'Security', required: 6, current: 5, gap: 1 },
  ]);

  const [expiringDocs] = useState<ExpiringDocument[]>([
    { staffName: 'Mr. Adeyemi Tunde', documentType: 'Teaching License', expiryDate: 'Jan 15, 2026', daysLeft: 15 },
    { staffName: 'Mrs. Okonkwo Mary', documentType: 'Health Certification', expiryDate: 'Jan 20, 2026', daysLeft: 20 },
    { staffName: 'Mr. Ibrahim Yusuf', documentType: 'Contract Renewal', expiryDate: 'Feb 1, 2026', daysLeft: 32 },
    { staffName: 'Mrs. Eze Chioma', documentType: 'ID Card', expiryDate: 'Jan 10, 2026', daysLeft: 10 },
  ]);

  const attendanceRate = (presentToday / totalStaff) * 100;

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl mb-2 text-blue-950">HR Command Center</h1>
        <p className="text-sm sm:text-base text-gray-600">
          Workforce overview for Wednesday, December 31, 2025
        </p>
      </div>

      {/* Main Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-3">
            <CardDescription className="text-blue-700">Total Staff</CardDescription>
            <CardTitle className="text-4xl text-blue-950">{totalStaff}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">Academic:</span>
                <span className="font-semibold text-blue-900">{academicStaff}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Non-Academic:</span>
                <span className="font-semibold text-blue-900">{nonAcademicStaff}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-3">
            <CardDescription className="text-green-700">Present Today</CardDescription>
            <CardTitle className="text-4xl text-green-950 flex items-center gap-2">
              <UserCheck className="w-8 h-8" />
              {presentToday}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={attendanceRate} className="h-2 mb-2" />
            <p className="text-sm text-green-700">{attendanceRate.toFixed(1)}% Attendance Rate</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="pb-3">
            <CardDescription className="text-red-700">Absent Today</CardDescription>
            <CardTitle className="text-4xl text-red-950 flex items-center gap-2">
              <UserX className="w-8 h-8" />
              {absentToday}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-700">Unauthorized absences</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardHeader className="pb-3">
            <CardDescription className="text-amber-700">On Leave</CardDescription>
            <CardTitle className="text-4xl text-amber-950 flex items-center gap-2">
              <Calendar className="w-8 h-8" />
              {onLeave}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-amber-700">Approved leave requests</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Staffing Gaps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Staffing Gaps
            </CardTitle>
            <CardDescription>Departments requiring immediate recruitment</CardDescription>
          </CardHeader>
          <CardContent>
            {staffingGaps.length > 0 ? (
              <div className="space-y-3">
                {staffingGaps.map((gap, idx) => (
                  <Alert key={idx} className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertTitle className="text-red-900">{gap.department}</AlertTitle>
                    <AlertDescription className="text-red-800">
                      <div className="flex items-center justify-between mt-1">
                        <span>Required: {gap.required} | Current: {gap.current}</span>
                        <Badge className="bg-red-600 text-white">
                          {gap.gap} Position{gap.gap > 1 ? 's' : ''} Vacant
                        </Badge>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
                <Button
                  className="w-full bg-red-600 hover:bg-red-700"
                  onClick={() => onNavigate?.('/recruitment')}
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  View Recruitment Dashboard
                </Button>
              </div>
            ) : (
              <p className="text-center py-4 text-gray-600">No staffing gaps</p>
            )}
          </CardContent>
        </Card>

        {/* Expiring Documents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileWarning className="w-5 h-5 text-amber-600" />
              Expiring Documents
            </CardTitle>
            <CardDescription>Certifications and contracts requiring renewal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expiringDocs.map((doc, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border ${
                    doc.daysLeft <= 15
                      ? 'bg-red-50 border-red-200'
                      : 'bg-amber-50 border-amber-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">{doc.staffName}</h4>
                      <p className="text-xs text-gray-600 mb-1">{doc.documentType}</p>
                      <p className="text-xs text-gray-600">Expires: {doc.expiryDate}</p>
                    </div>
                    <Badge
                      className={
                        doc.daysLeft <= 15 ? 'bg-red-600 text-white' : 'bg-amber-600 text-white'
                      }
                    >
                      {doc.daysLeft} days
                    </Badge>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => onNavigate?.('/staff-directory')}
              >
                View All Staff Documents
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Latest HR actions and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
              <UserCheck className="w-5 h-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">New Staff Onboarded</p>
                <p className="text-xs text-gray-600">Mrs. Adeleke joined as Economics Teacher</p>
                <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
              <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Leave Request Approved</p>
                <p className="text-xs text-gray-600">Mr. Balogun's sick leave (3 days) approved</p>
                <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Query Issued</p>
                <p className="text-xs text-gray-600">Late coming query sent to Mr. Johnson</p>
                <p className="text-xs text-gray-500 mt-1">Yesterday</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};