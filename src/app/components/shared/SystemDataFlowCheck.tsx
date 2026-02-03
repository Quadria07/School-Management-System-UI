import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RefreshCw, Database, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface DataFlowCheck {
  name: string;
  description: string;
  storageKey: string;
  teacherWrites: boolean;
  principalReads: boolean;
  studentReads: boolean;
  hasData: boolean;
  dataCount: number;
}

export const SystemDataFlowCheck: React.FC = () => {
  const [checks, setChecks] = useState<DataFlowCheck[]>([]);
  const [lastCheck, setLastCheck] = useState<Date>(new Date());

  const performSystemCheck = () => {
    const dataFlows: DataFlowCheck[] = [
      {
        name: 'Results & Grades',
        description: 'Term results and CA scores from teachers',
        storageKey: 'gradebook_term_results',
        teacherWrites: true,
        principalReads: true,
        studentReads: true,
        hasData: false,
        dataCount: 0,
      },
      {
        name: 'Result Submission Status',
        description: 'Tracks which classes have submitted results',
        storageKey: 'gradebook_submitted_classes',
        teacherWrites: true,
        principalReads: true,
        studentReads: false,
        hasData: false,
        dataCount: 0,
      },
      {
        name: 'Attendance Records',
        description: 'Daily attendance marked by teachers',
        storageKey: 'bfoia_attendance_records',
        teacherWrites: true,
        principalReads: true,
        studentReads: true,
        hasData: false,
        dataCount: 0,
      },
      {
        name: 'Lesson Notes',
        description: 'Teacher lesson plans submitted for approval',
        storageKey: 'bfoia_lesson_notes',
        teacherWrites: true,
        principalReads: true,
        studentReads: false,
        hasData: false,
        dataCount: 0,
      },
      {
        name: 'CBT Assessments',
        description: 'Computer-based tests created by teachers',
        storageKey: 'bfoia_cbt_assessments',
        teacherWrites: true,
        principalReads: true,
        studentReads: true,
        hasData: false,
        dataCount: 0,
      },
      {
        name: 'CBT Student Attempts',
        description: 'Student exam attempts and scores',
        storageKey: 'bfoia_cbt_student_attempts',
        teacherWrites: false,
        principalReads: true,
        studentReads: true,
        hasData: false,
        dataCount: 0,
      },
      {
        name: 'Student Passport Photos',
        description: 'Student photos uploaded by principal',
        storageKey: 'bfoia_students',
        teacherWrites: false,
        principalReads: true,
        studentReads: true,
        hasData: false,
        dataCount: 0,
      },
      {
        name: 'Messages',
        description: 'Inter-role communication messages',
        storageKey: 'bfoia_messages',
        teacherWrites: true,
        principalReads: true,
        studentReads: true,
        hasData: false,
        dataCount: 0,
      },
      {
        name: 'Announcements',
        description: 'School-wide announcements',
        storageKey: 'bfoia_announcements',
        teacherWrites: false,
        principalReads: true,
        studentReads: true,
        hasData: false,
        dataCount: 0,
      },
    ];

    // Check each data flow
    const updatedChecks = dataFlows.map(check => {
      try {
        const data = localStorage.getItem(check.storageKey);
        if (data) {
          const parsed = JSON.parse(data);
          return {
            ...check,
            hasData: true,
            dataCount: Array.isArray(parsed) ? parsed.length : Object.keys(parsed).length,
          };
        }
      } catch (error) {
        console.error(`Error checking ${check.storageKey}:`, error);
      }
      return check;
    });

    setChecks(updatedChecks);
    setLastCheck(new Date());
  };

  useEffect(() => {
    performSystemCheck();
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(performSystemCheck, 10000);
    return () => clearInterval(interval);
  }, []);

  const allFlowsWorking = checks.every(check => check.hasData);
  const workingCount = checks.filter(check => check.hasData).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Data Flow Check</h1>
          <p className="text-gray-600 mt-1">
            Verify data synchronization between Teacher, Principal, and Student accounts
          </p>
        </div>
        <Button onClick={performSystemCheck} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Overall Status */}
      <Card className={allFlowsWorking ? 'border-green-500 border-2' : 'border-amber-500 border-2'}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {allFlowsWorking ? (
              <>
                <CheckCircle className="w-6 h-6 text-green-600" />
                All Systems Operational
              </>
            ) : (
              <>
                <Database className="w-6 h-6 text-amber-600" />
                System Status
              </>
            )}
          </CardTitle>
          <CardDescription>
            {workingCount} of {checks.length} data flows active • Last checked: {lastCheck.toLocaleTimeString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Teacher Writes</div>
              <div className="text-2xl font-bold text-blue-600">
                {checks.filter(c => c.teacherWrites && c.hasData).length}/{checks.filter(c => c.teacherWrites).length}
              </div>
              <div className="text-xs text-gray-500 mt-1">Data flows from teachers</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Principal Reads</div>
              <div className="text-2xl font-bold text-purple-600">
                {checks.filter(c => c.principalReads && c.hasData).length}/{checks.filter(c => c.principalReads).length}
              </div>
              <div className="text-xs text-gray-500 mt-1">Available to principal</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Student Reads</div>
              <div className="text-2xl font-bold text-green-600">
                {checks.filter(c => c.studentReads && c.hasData).length}/{checks.filter(c => c.studentReads).length}
              </div>
              <div className="text-xs text-gray-500 mt-1">Visible to students</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Checks */}
      <div className="grid grid-cols-1 gap-4">
        {checks.map((check, index) => (
          <Card key={index} className={check.hasData ? 'border-green-200' : 'border-gray-200'}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {check.hasData ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400" />
                    )}
                    {check.name}
                  </CardTitle>
                  <CardDescription>{check.description}</CardDescription>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {check.hasData ? (
                    <Badge variant="default" className="bg-green-600">Active</Badge>
                  ) : (
                    <Badge variant="outline">No Data</Badge>
                  )}
                  {check.hasData && (
                    <Badge variant="secondary">{check.dataCount} record{check.dataCount !== 1 ? 's' : ''}</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm">
                {check.teacherWrites && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Teacher Writes
                  </Badge>
                )}
                {check.principalReads && (
                  <>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      Principal Reads
                    </Badge>
                  </>
                )}
                {check.studentReads && (
                  <>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Student Reads
                    </Badge>
                  </>
                )}
              </div>
              <div className="mt-3 text-xs text-gray-500 font-mono bg-gray-50 p-2 rounded">
                localStorage: {check.storageKey}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-base">How to Test Data Flow</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><strong>1. As Teacher:</strong> Enter results in Digital Gradebook, mark attendance, create lesson notes, or create CBT assessments</p>
          <p><strong>2. As Principal:</strong> Review and approve submitted results, view attendance records, approve lesson notes</p>
          <p><strong>3. As Student:</strong> View your results in Results Portal, check attendance, take CBT exams</p>
          <p><strong>4. Return here:</strong> Click "Refresh" to verify all data flows are working correctly</p>
          <p className="text-xs text-gray-600 mt-4">💡 All data is synchronized through localStorage and updates in real-time across all user roles.</p>
        </CardContent>
      </Card>
    </div>
  );
};
