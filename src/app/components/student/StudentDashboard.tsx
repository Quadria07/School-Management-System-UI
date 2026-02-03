import React, { useState } from 'react';
import { CBTExam, CBTQuestion, CBTResult } from '../../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { CBTExamInterface } from './CBTExamInterface';
import { BookOpen, FileQuestion, Award, Calendar, Clock, Target } from 'lucide-react';

// Mock exam data
const mockExam: CBTExam = {
  id: '1',
  title: 'Mathematics Entrance Examination',
  subject: 'Mathematics',
  duration: 60,
  totalQuestions: 20,
  cutoffMark: 50,
  isActive: true,
  createdBy: 'principal@bfoia.edu',
  createdAt: new Date(),
  questions: [
    {
      id: '1',
      questionNumber: 1,
      question: 'What is 15 + 27?',
      options: {
        a: '40',
        b: '42',
        c: '43',
        d: '45',
      },
      correctAnswer: 'b',
      subject: 'Mathematics',
    },
    {
      id: '2',
      questionNumber: 2,
      question: 'Solve: 3x + 5 = 20. What is x?',
      options: {
        a: '3',
        b: '4',
        c: '5',
        d: '6',
      },
      correctAnswer: 'c',
      subject: 'Mathematics',
    },
    {
      id: '3',
      questionNumber: 3,
      question: 'What is the area of a rectangle with length 8cm and width 5cm?',
      options: {
        a: '13 cm²',
        b: '26 cm²',
        c: '40 cm²',
        d: '45 cm²',
      },
      correctAnswer: 'c',
      subject: 'Mathematics',
    },
    {
      id: '4',
      questionNumber: 4,
      question: 'If a triangle has angles 60° and 80°, what is the third angle?',
      options: {
        a: '20°',
        b: '30°',
        c: '40°',
        d: '50°',
      },
      correctAnswer: 'c',
      subject: 'Mathematics',
    },
    {
      id: '5',
      questionNumber: 5,
      question: 'What is 144 ÷ 12?',
      options: {
        a: '10',
        b: '11',
        c: '12',
        d: '13',
      },
      correctAnswer: 'c',
      subject: 'Mathematics',
    },
  ],
};

// Generate additional questions to make it 20 total
for (let i = 6; i <= 20; i++) {
  mockExam.questions.push({
    id: i.toString(),
    questionNumber: i,
    question: `Sample question ${i}. Choose the correct answer.`,
    options: {
      a: `Option A for question ${i}`,
      b: `Option B for question ${i}`,
      c: `Option C for question ${i}`,
      d: `Option D for question ${i}`,
    },
    correctAnswer: ['a', 'b', 'c', 'd'][Math.floor(Math.random() * 4)] as any,
    subject: 'Mathematics',
  });
}

export const StudentDashboard: React.FC = () => {
  const [activeExam, setActiveExam] = useState<CBTExam | null>(null);
  const [completedResults, setCompletedResults] = useState<CBTResult[]>([]);

  const handleStartExam = (exam: CBTExam) => {
    setActiveExam(exam);
  };

  const handleCompleteExam = (result: CBTResult) => {
    setCompletedResults(prev => [...prev, result]);
    setActiveExam(null);
  };

  const handleExitExam = () => {
    setActiveExam(null);
  };

  if (activeExam) {
    return (
      <CBTExamInterface
        exam={activeExam}
        onComplete={handleCompleteExam}
        onExit={handleExitExam}
      />
    );
  }

  const subjects = [
    { name: 'Mathematics', lessons: 12, icon: '📐', color: 'bg-blue-100 text-blue-700' },
    { name: 'English Language', lessons: 15, icon: '📚', color: 'bg-green-100 text-green-700' },
    { name: 'Physics', lessons: 10, icon: '⚛️', color: 'bg-purple-100 text-purple-700' },
    { name: 'Chemistry', lessons: 8, icon: '🧪', color: 'bg-amber-100 text-amber-700' },
    { name: 'Biology', lessons: 9, icon: '🔬', color: 'bg-emerald-100 text-emerald-700' },
    { name: 'Economics', lessons: 7, icon: '💹', color: 'bg-red-100 text-red-700' },
  ];

  const stats = [
    { label: 'Active Subjects', value: '6', icon: BookOpen, color: 'bg-blue-500' },
    { label: 'Pending Exams', value: '1', icon: FileQuestion, color: 'bg-amber-500' },
    { label: 'Average Score', value: '78%', icon: Award, color: 'bg-green-500' },
    { label: 'Attendance', value: '95%', icon: Calendar, color: 'bg-purple-500' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl text-blue-950">Student Dashboard</h1>
        <p className="text-gray-500">Welcome back! Ready to learn today?</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, index) => {
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

      {/* Available Exams */}
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileQuestion className="w-5 h-5" />
                Available Entrance Exam
              </CardTitle>
              <CardDescription>Complete your entrance examination</CardDescription>
            </div>
            <Badge className="bg-amber-500">Active</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-amber-200">
            <div>
              <h3 className="mb-2">{mockExam.title}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {mockExam.duration} minutes
                </div>
                <div className="flex items-center gap-1">
                  <FileQuestion className="w-4 h-4" />
                  {mockExam.totalQuestions} questions
                </div>
                <div className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  Pass mark: {mockExam.cutoffMark}%
                </div>
              </div>
            </div>
            <Button 
              onClick={() => handleStartExam(mockExam)}
              className="bg-blue-950 hover:bg-blue-900"
            >
              Start Exam
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Learning Hub */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Hub</CardTitle>
          <CardDescription>Access your subject materials and resources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {subjects.map((subject, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg ${subject.color} flex items-center justify-center text-2xl mb-3`}>
                    {subject.icon}
                  </div>
                  <h3 className="mb-1">{subject.name}</h3>
                  <p className="text-sm text-gray-500">{subject.lessons} lessons available</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Results */}
      {completedResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Exam Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="mb-1">Mathematics Entrance Exam</h3>
                    <p className="text-sm text-gray-500">
                      Score: {result.score}/{result.totalQuestions} ({result.percentage.toFixed(1)}%)
                    </p>
                  </div>
                  <Badge className={result.passed ? 'bg-green-500' : 'bg-red-500'}>
                    {result.passed ? 'PASSED' : 'FAILED'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
