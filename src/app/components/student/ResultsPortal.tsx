import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { StudentAPI } from '@/utils/api';
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
import { Download, Award, TrendingUp, Calendar, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

interface SubjectResult {
  subject_name: string;
  subject_code: string;
  ca_score: string;
  exam_score: string;
  total_score: string;
  grade: string;
  teacher_remarks: string | null;
  term: string;
}

export const ResultsPortal: React.FC = () => {
  const { user } = useAuth();
  const [selectedTerm, setSelectedTerm] = useState('First Term');
  const [selectedSession, setSelectedSession] = useState('2024/2025');

  // API States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SubjectResult[]>([]);

  // Calculate summary stats
  const totalScore = results.reduce((sum, r) => sum + parseFloat(r.total_score || '0'), 0);
  const averageScore = results.length > 0 ? totalScore / results.length : 0;
  const overallGrade = averageScore >= 70 ? 'A' : averageScore >= 60 ? 'B' : averageScore >= 50 ? 'C' : averageScore >= 40 ? 'D' : 'F';

  // Fetch results from API
  const fetchResults = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await StudentAPI.getResults(selectedTerm, selectedSession);

      if (response.status === 'success') {
        setResults(response.data || []);
      } else {
        setError(response.error || response.message || 'Failed to load results');
      }
    } catch (err: any) {
      console.error('Error fetching results:', err);
      setError(err.message || 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [selectedTerm, selectedSession]);

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-500';
      case 'B': return 'bg-blue-500';
      case 'C': return 'bg-amber-500';
      case 'D': return 'bg-orange-500';
      case 'F': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

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
        <Button variant="outline" onClick={fetchResults} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Select Term & Session</CardTitle>
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
                  <SelectItem value="First Term">First Term</SelectItem>
                  <SelectItem value="Second Term">Second Term</SelectItem>
                  <SelectItem value="Third Term">Third Term</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Academic Session</label>
              <Select value={selectedSession} onValueChange={setSelectedSession}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024/2025">2024/2025</SelectItem>
                  <SelectItem value="2023/2024">2023/2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Loading your results...</p>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700">{error}</span>
            <Button variant="outline" size="sm" onClick={fetchResults} className="ml-auto">
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Results Display */}
      {!loading && !error && results.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Your Academic Performance</CardTitle>
                <CardDescription>
                  {selectedTerm} - {selectedSession}
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
              <div className="w-16 h-16 rounded-full bg-blue-200 flex items-center justify-center border-4 border-white shadow-md">
                <span className="text-xl font-bold text-blue-700">
                  {user?.name?.charAt(0) || 'S'}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-blue-950">{user?.name || 'Student'}</h3>
                <p className="text-sm text-gray-600">{user?.class || 'Class'}</p>
              </div>
            </div>

            {/* Overall Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Subjects</CardDescription>
                  <CardTitle className="text-2xl">{results.length}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Total Score</CardDescription>
                  <CardTitle className="text-2xl">{totalScore.toFixed(0)}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Average</CardDescription>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    {averageScore.toFixed(1)}%
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Overall Grade</CardDescription>
                  <CardTitle className="text-2xl">
                    <Badge className={`text-lg ${getGradeColor(overallGrade)}`}>{overallGrade}</Badge>
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Subject Breakdown */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Subject Results</h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-left p-3 border">Subject</th>
                      <th className="text-center p-3 border">CA</th>
                      <th className="text-center p-3 border">Exam</th>
                      <th className="text-center p-3 border">Total</th>
                      <th className="text-center p-3 border">Grade</th>
                      <th className="text-left p-3 border">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="p-3 border">
                          <div>
                            <div className="font-medium">{result.subject_name}</div>
                            <div className="text-xs text-gray-500">{result.subject_code}</div>
                          </div>
                        </td>
                        <td className="text-center p-3 border">{parseFloat(result.ca_score).toFixed(0)}</td>
                        <td className="text-center p-3 border">{parseFloat(result.exam_score).toFixed(0)}</td>
                        <td className="text-center p-3 border font-semibold">{parseFloat(result.total_score).toFixed(0)}</td>
                        <td className="text-center p-3 border">
                          <Badge className={getGradeColor(result.grade)}>{result.grade}</Badge>
                        </td>
                        <td className="p-3 border text-sm text-gray-600">
                          {result.teacher_remarks || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary Remarks */}
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Performance Summary</h4>
              <p className="text-green-800">
                {averageScore >= 70 ? 'Excellent performance! Keep up the great work.' :
                  averageScore >= 60 ? 'Good performance. Continue to strive for excellence.' :
                    averageScore >= 50 ? 'Satisfactory performance. There is room for improvement.' :
                      averageScore >= 40 ? 'Fair performance. More effort is needed.' :
                        'Needs improvement. Please seek additional help.'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Results State */}
      {!loading && !error && results.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Results Available
            </h3>
            <p className="text-gray-600 text-center max-w-md">
              Results for {selectedTerm} ({selectedSession}) have not been published yet.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              ✅ Results will appear here once they are uploaded and approved.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
