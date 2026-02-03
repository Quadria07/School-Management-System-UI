import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Users,
  Award,
  AlertTriangle,
  Search,
  Filter,
  Download,
  Eye,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Progress } from '../ui/progress';

interface StudentPerformance {
  id: string;
  name: string;
  admissionNumber: string;
  ca1: number;
  ca2: number;
  midterm: number;
  exam: number;
  total: number;
  grade: string;
  position: number;
  trend: 'up' | 'down' | 'stable';
  attendanceRate: number;
}

export const StudentPerformanceAnalytics: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState('JSS 3A');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [searchQuery, setSearchQuery] = useState('');
  const [showStudentDialog, setShowStudentDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentPerformance | null>(null);

  const students: StudentPerformance[] = [
    {
      id: '1',
      name: 'Adebayo Oluwaseun',
      admissionNumber: 'BFO/2023/001',
      ca1: 10,
      ca2: 10,
      midterm: 15,
      exam: 60,
      total: 95,
      grade: 'A',
      position: 1,
      trend: 'up',
      attendanceRate: 98,
    },
    {
      id: '2',
      name: 'Chioma Nwosu',
      admissionNumber: 'BFO/2023/002',
      ca1: 9,
      ca2: 9,
      midterm: 14,
      exam: 55,
      total: 87,
      grade: 'A',
      position: 2,
      trend: 'stable',
      attendanceRate: 100,
    },
    {
      id: '3',
      name: 'Ibrahim Yusuf',
      admissionNumber: 'BFO/2023/003',
      ca1: 8,
      ca2: 8,
      midterm: 12,
      exam: 50,
      total: 78,
      grade: 'B',
      position: 3,
      trend: 'up',
      attendanceRate: 95,
    },
    {
      id: '4',
      name: 'Grace Okonkwo',
      admissionNumber: 'BFO/2023/004',
      ca1: 7,
      ca2: 7,
      midterm: 10,
      exam: 45,
      total: 69,
      grade: 'C',
      position: 4,
      trend: 'down',
      attendanceRate: 97,
    },
    {
      id: '5',
      name: 'Daniel Akintola',
      admissionNumber: 'BFO/2023/005',
      ca1: 6,
      ca2: 6,
      midterm: 9,
      exam: 38,
      total: 59,
      grade: 'D',
      position: 5,
      trend: 'down',
      attendanceRate: 85,
    },
  ];

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const classAverage = students.reduce((sum, s) => sum + s.total, 0) / students.length;
  const highestScore = Math.max(...students.map((s) => s.total));
  const lowestScore = Math.min(...students.map((s) => s.total));
  const strugglingStudents = students.filter((s) => s.total < 60).length;

  const handleViewStudent = (student: StudentPerformance) => {
    setSelectedStudent(student);
    setShowStudentDialog(true);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl mb-2 text-blue-950">
            Student Performance Analytics
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Track individual and class performance
          </p>
        </div>
        <Button
          variant="outline"
          className="w-full sm:w-auto"
          onClick={() => alert('Exporting report...')}
        >
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Class Average
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl sm:text-3xl text-blue-950">
                  {classAverage.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500 mt-1">Grade B+</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Top Performer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl sm:text-3xl text-blue-950">{highestScore}%</p>
                <p className="text-xs text-gray-500 mt-1">
                  {students.find((s) => s.total === highestScore)?.name.split(' ')[0]}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Lowest Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl sm:text-3xl text-blue-950">{lowestScore}%</p>
                <p className="text-xs text-gray-500 mt-1">Needs attention</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Struggling Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl sm:text-3xl text-blue-950">
                  {strugglingStudents}
                </p>
                <p className="text-xs text-gray-500 mt-1">Below 60%</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Class Selection & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Class</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="JSS 3A">JSS 3A</SelectItem>
                  <SelectItem value="JSS 2B">JSS 2B</SelectItem>
                  <SelectItem value="JSS 1C">JSS 1C</SelectItem>
                  <SelectItem value="SSS 2A">SSS 2A</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Subject</label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="Further Mathematics">
                    Further Mathematics
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Term</label>
              <Select defaultValue="first">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="first">First Term</SelectItem>
                  <SelectItem value="second">Second Term</SelectItem>
                  <SelectItem value="third">Third Term</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Search Student</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Performance - {selectedClass}</CardTitle>
          <CardDescription>Click on any student to view detailed performance history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[800px]">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3 font-medium">Position</th>
                  <th className="text-left p-3 font-medium">Student Name</th>
                  <th className="text-center p-3 font-medium">CA1</th>
                  <th className="text-center p-3 font-medium">CA2</th>
                  <th className="text-center p-3 font-medium">Mid-term</th>
                  <th className="text-center p-3 font-medium">Exam</th>
                  <th className="text-center p-3 font-medium">Total</th>
                  <th className="text-center p-3 font-medium">Grade</th>
                  <th className="text-center p-3 font-medium">Trend</th>
                  <th className="text-center p-3 font-medium">Attendance</th>
                  <th className="text-center p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-center">
                      <Badge
                        className={
                          student.position === 1
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-gray-100 text-gray-700'
                        }
                      >
                        {student.position}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-xs text-gray-500">{student.admissionNumber}</p>
                      </div>
                    </td>
                    <td className="p-3 text-center">{student.ca1}</td>
                    <td className="p-3 text-center">{student.ca2}</td>
                    <td className="p-3 text-center">{student.midterm}</td>
                    <td className="p-3 text-center">{student.exam}</td>
                    <td className="p-3 text-center font-medium">{student.total}</td>
                    <td className="p-3 text-center">
                      <Badge
                        className={
                          student.grade === 'A'
                            ? 'bg-green-100 text-green-700'
                            : student.grade === 'B'
                            ? 'bg-blue-100 text-blue-700'
                            : student.grade === 'C'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-100 text-red-700'
                        }
                      >
                        {student.grade}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      {student.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-green-600 mx-auto" />
                      ) : student.trend === 'down' ? (
                        <TrendingDown className="w-4 h-4 text-red-600 mx-auto" />
                      ) : (
                        <div className="w-4 h-0.5 bg-gray-400 mx-auto" />
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={
                          student.attendanceRate >= 95
                            ? 'text-green-600 font-medium'
                            : student.attendanceRate >= 85
                            ? 'text-amber-600 font-medium'
                            : 'text-red-600 font-medium'
                        }
                      >
                        {student.attendanceRate}%
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewStudent(student)}
                        className="text-xs"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Student Detail Dialog */}
      <Dialog open={showStudentDialog} onOpenChange={setShowStudentDialog}>
        <DialogContent className="w-[95vw] sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Student Performance History</DialogTitle>
            <DialogDescription>
              {selectedStudent?.name} - {selectedStudent?.admissionNumber}
            </DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-600 mb-1">Current Total</p>
                  <p className="text-2xl font-bold text-blue-950">
                    {selectedStudent.total}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Grade: {selectedStudent.grade}
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-600 mb-1">Class Position</p>
                  <p className="text-2xl font-bold text-blue-950">
                    {selectedStudent.position}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Out of {students.length}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Score Breakdown</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>CA1 (10 marks)</span>
                      <span className="font-medium">{selectedStudent.ca1}/10</span>
                    </div>
                    <Progress value={(selectedStudent.ca1 / 10) * 100} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>CA2 (10 marks)</span>
                      <span className="font-medium">{selectedStudent.ca2}/10</span>
                    </div>
                    <Progress value={(selectedStudent.ca2 / 10) * 100} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Mid-term (15 marks)</span>
                      <span className="font-medium">{selectedStudent.midterm}/15</span>
                    </div>
                    <Progress value={(selectedStudent.midterm / 15) * 100} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Exam (60 marks)</span>
                      <span className="font-medium">{selectedStudent.exam}/60</span>
                    </div>
                    <Progress value={(selectedStudent.exam / 60) * 100} />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Additional Info</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Attendance Rate:</span>
                    <span className="font-medium">{selectedStudent.attendanceRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Performance Trend:</span>
                    <span className="font-medium flex items-center gap-1">
                      {selectedStudent.trend === 'up' ? (
                        <>
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          Improving
                        </>
                      ) : selectedStudent.trend === 'down' ? (
                        <>
                          <TrendingDown className="w-4 h-4 text-red-600" />
                          Declining
                        </>
                      ) : (
                        'Stable'
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => alert('Opening message dialog...')}
                >
                  Message Parent
                </Button>
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => alert('Generating detailed report...')}
                >
                  Full Report
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
