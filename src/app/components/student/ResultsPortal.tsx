import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { mergeStudentPhotos } from '@/utils/studentPhotoHelper';
import * as dataFlowService from '@/utils/dataFlowService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Download, Award, TrendingUp, Calendar } from 'lucide-react';
import type { BroadsheetData } from '../principal/types';

export const ResultsPortal: React.FC = () => {
  const { user } = useAuth();
  const [selectedTerm, setSelectedTerm] = useState('first-2025');
  const [selectedView, setSelectedView] = useState<'ca' | 'term'>('term');
  const [studentData, setStudentData] = useState<BroadsheetData | null>(null);
  const [availableResults, setAvailableResults] = useState<any[]>([]);

  // Load student results from localStorage (synced from teacher's gradebook)
  useEffect(() => {
    const loadStudentResults = () => {
      try {
        // ✅ CRITICAL: Students can ONLY see APPROVED results
        // Get APPROVED results only (not pending teacher submissions)
        const approvedResults = dataFlowService.getApprovedResults();
        
        if (approvedResults && approvedResults.length > 0) {
          setAvailableResults(approvedResults);
          
          // Find this student's result from APPROVED results only
          const currentStudentName = user.name.toUpperCase();
          const currentClass = 'JSS 3A'; // TODO: Get from student profile
          
          // Filter by selected term and result type
          const term = selectedTerm === 'first-2025' ? 'First Term' : 
                      selectedTerm === 'third-2024' ? 'Third Term' : 'Second Term';
          
          let studentResult = approvedResults.find((r: any) => 
            (r.studentName.toUpperCase().includes(currentStudentName.split(' ')[0]) ||
             r.studentName.toUpperCase() === currentStudentName) &&
            r.resultType === selectedView &&
            (r.term === term || !r.term) &&
            r.approvalStatus === 'approved' // ✅ MUST be approved
          );
          
          // If no exact match, try to find first result for this class and type
          if (!studentResult) {
            studentResult = approvedResults.find((r: any) => 
              r.class === currentClass &&
              r.resultType === selectedView &&
              r.approvalStatus === 'approved'
            );
          }
          
          if (studentResult) {
            // Merge with photos
            const resultsWithPhotos = mergeStudentPhotos([studentResult]);
            const dataWithPhoto = resultsWithPhotos[0];
            
            // Transform to BroadsheetData format
            const transformedData: BroadsheetData = {
              id: studentResult.id || '1',
              studentName: studentResult.studentName,
              class: studentResult.class || 'JSS 3A',
              passportPhoto: dataWithPhoto.passportPhoto,
              sn: 1,
              totalScore: studentResult.totalScore || 0,
              overallAverage: studentResult.average || 0,
              percentAverage: Math.round(studentResult.average || 0),
              overallPosition: studentResult.position || 1,
              grade: studentResult.grade || 'A',
              remarks: studentResult.remark || 'Good performance',
              // Map subjects if available
              english: studentResult.subjects?.find((s: any) => s.subject.toLowerCase().includes('english'))
                ? {
                    first: 0,
                    second: 0,
                    third: 0,
                    total: studentResult.subjects.find((s: any) => s.subject.toLowerCase().includes('english')).total,
                    average: studentResult.subjects.find((s: any) => s.subject.toLowerCase().includes('english')).total,
                    position: 0
                  }
                : undefined,
              mathematics: studentResult.subjects?.find((s: any) => s.subject.toLowerCase().includes('math'))
                ? {
                    first: 0,
                    second: 0,
                    third: 0,
                    total: studentResult.subjects.find((s: any) => s.subject.toLowerCase().includes('math')).total,
                    average: studentResult.subjects.find((s: any) => s.subject.toLowerCase().includes('math')).total,
                    position: 0
                  }
                : undefined,
            };
            
            setStudentData(transformedData);
          } else {
            // No approved results for this student/term/type
            setStudentData(null);
          }
        } else {
          // No approved results at all
          setStudentData(null);
        }
      } catch (error) {
        console.error('Error loading student results:', error);
        setStudentData(null);
      }
    };
    
    loadStudentResults();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(loadStudentResults, 30000);
    return () => clearInterval(interval);
  }, [selectedTerm, selectedView, user]);

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl mb-2 text-blue-950">
            My Results & Report Cards
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            View your academic performance and progress
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Select Term & Assessment Type</CardTitle>
          <CardDescription>Choose which results you want to view</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Academic Term</label>
              <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="first-2025">First Term 2025</SelectItem>
                  <SelectItem value="second-2025">Second Term 2025</SelectItem>
                  <SelectItem value="third-2024">Third Term 2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Result Type</label>
              <Select value={selectedView} onValueChange={(v: 'ca' | 'term') => setSelectedView(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ca">Continuous Assessment (CA)</SelectItem>
                  <SelectItem value="term">Terminal Report Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Display */}
      {studentData ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Your Academic Performance</CardTitle>
                <CardDescription>
                  {selectedView === 'ca' ? 'Continuous Assessment Results' : 'Terminal Report Card'}
                </CardDescription>
              </div>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Student Info */}
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
              {studentData.passportPhoto ? (
                <img
                  src={studentData.passportPhoto}
                  alt={studentData.studentName}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-blue-200 flex items-center justify-center border-4 border-white shadow-md">
                  <span className="text-2xl font-bold text-blue-700">
                    {studentData.studentName.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold text-blue-950">{studentData.studentName}</h3>
                <p className="text-sm text-gray-600">{studentData.class}</p>
              </div>
            </div>

            {/* Overall Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Total Score</CardDescription>
                  <CardTitle className="text-2xl">{studentData.totalScore}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Average</CardDescription>
                  <CardTitle className="text-2xl">{studentData.percentAverage}%</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Position</CardDescription>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Award className="w-6 h-6 text-amber-500" />
                    {studentData.overallPosition}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Grade</CardDescription>
                  <CardTitle className="text-2xl">
                    <Badge className="text-lg">{studentData.grade}</Badge>
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Remarks */}
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Teacher's Remarks</h4>
              <p className="text-green-800">{studentData.remarks}</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Results Available
            </h3>
            <p className="text-gray-600 text-center max-w-md">
              Results for {selectedView === 'ca' ? 'Continuous Assessment' : 'Terminal Report'} in {selectedTerm.replace('-', ' ')} have not been published yet.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              ✅ Results must be approved by the Principal before they appear here
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
