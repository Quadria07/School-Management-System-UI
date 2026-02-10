import React, { useState, useEffect } from 'react';
import {
  Clock,
  FileQuestion,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Flag,
  Maximize2,
  Award,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Progress } from '../ui/progress';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import * as dataFlowService from '../../../utils/dataFlowService';

interface Exam {
  id: string;
  title: string;
  subject: string;
  duration: number; // in minutes
  totalQuestions: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'upcoming';
  score?: number;
  maxScore?: number;
}

interface Question {
  id: string;
  questionNumber: number;
  text: string;
  options: string[];
  selectedAnswer?: number;
  flagged?: boolean;
}

export const CBTExamHall: React.FC = () => {
  const [activeView, setActiveView] = useState<'list' | 'exam' | 'results'>('list');
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showResultsDialog, setShowResultsDialog] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [exams, setExams] = useState<Exam[]>([]);

  // Load approved and published CBT assessments
  useEffect(() => {
    const approvedCBTs = dataFlowService.getStudentVisibleCBTAssessments();

    // Map to Exam interface with mock dates for display
    const mappedExams: Exam[] = approvedCBTs.map((cbt) => ({
      id: cbt.id,
      title: cbt.title,
      subject: cbt.subject,
      duration: cbt.duration,
      totalQuestions: cbt.questions.length,
      startDate: cbt.publishedDate ? new Date(cbt.publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
      endDate: cbt.dueDate ? new Date(cbt.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
      status: 'active' as const,
    }));

    setExams(mappedExams);
  }, []);

  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (activeView === 'exam' && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [activeView, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartExam = (exam: Exam) => {
    setSelectedExam(exam);
    setTimeRemaining(exam.duration * 60);
    setCurrentQuestionIndex(0);
    setActiveView('exam');
    // Request fullscreen
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    }
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, idx) =>
        idx === questionIndex ? { ...q, selectedAnswer: answerIndex } : q
      )
    );
  };

  const handleFlagQuestion = (questionIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, idx) =>
        idx === questionIndex ? { ...q, flagged: !q.flagged } : q
      )
    );
  };

  const handleAutoSubmit = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    setIsFullScreen(false);
    setActiveView('results');
    setShowResultsDialog(true);
  };

  const handleManualSubmit = () => {
    setShowSubmitDialog(false);
    handleAutoSubmit();
  };

  const answeredCount = questions.filter((q) => q.selectedAnswer !== undefined).length;
  const flaggedCount = questions.filter((q) => q.flagged).length;
  const progressPercentage = (answeredCount / questions.length) * 100;

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Exam List View */}
      {activeView === 'list' && (
        <>
          {/* Header */}
          <div>
            <h1 className="text-2xl sm:text-3xl mb-2 text-blue-950">CBT Exam Hall</h1>
            <p className="text-sm sm:text-base text-gray-600">
              Computer-Based Testing Assessment Center
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b">
            <Button
              variant="ghost"
              className="border-b-2 border-blue-600 text-blue-600 rounded-none"
            >
              Active Exams
            </Button>
            <Button variant="ghost" className="rounded-none text-gray-600">
              Upcoming
            </Button>
            <Button variant="ghost" className="rounded-none text-gray-600">
              Completed
            </Button>
          </div>

          {/* Active Exams */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {exams
              .filter((exam) => exam.status === 'active')
              .map((exam) => (
                <Card key={exam.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{exam.title}</CardTitle>
                        <CardDescription>{exam.subject}</CardDescription>
                      </div>
                      <Badge className="bg-green-600 text-white">Active</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-600">Duration</p>
                          <p className="font-semibold">{exam.duration} minutes</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Questions</p>
                          <p className="font-semibold">{exam.totalQuestions}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Start Date</p>
                          <p className="font-semibold">{exam.startDate}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">End Date</p>
                          <p className="font-semibold">{exam.endDate}</p>
                        </div>
                      </div>
                      <Alert className="border-blue-200 bg-blue-50">
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-800 text-xs">
                          Ensure stable internet connection before starting
                        </AlertDescription>
                      </Alert>
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleStartExam(exam)}
                      >
                        <Maximize2 className="w-4 h-4 mr-2" />
                        Start Exam
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>

          {/* Completed Exams */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Recent Results
              </CardTitle>
              <CardDescription>Your completed assessments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {exams
                  .filter((exam) => exam.status === 'completed')
                  .map((exam) => (
                    <div
                      key={exam.id}
                      className="p-4 rounded-lg border border-gray-200 flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{exam.title}</h4>
                        <p className="text-sm text-gray-600">{exam.subject}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-950">
                            {exam.score}%
                          </p>
                          <p className="text-xs text-gray-600">
                            {exam.score}/{exam.maxScore}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Exam Interface */}
      {activeView === 'exam' && selectedExam && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          {/* Exam Header */}
          <div className="bg-blue-950 text-white p-4 flex items-center justify-between">
            <div>
              <h2 className="font-semibold">{selectedExam.title}</h2>
              <p className="text-sm text-blue-200">{selectedExam.subject}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-sm text-blue-200">Time Remaining</p>
                <p className="text-2xl font-bold">{formatTime(timeRemaining)}</p>
              </div>
              <Button
                variant="outline"
                className="text-white border-white hover:bg-blue-900"
                onClick={() => setShowSubmitDialog(true)}
              >
                Submit Exam
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-gray-100 p-3 border-b">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="text-gray-600">
                Answered: {answeredCount}/{questions.length}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Main Exam Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">
                          Question {questions[currentQuestionIndex].questionNumber}
                        </Badge>
                        {questions[currentQuestionIndex].flagged && (
                          <Badge className="bg-amber-500 text-white">
                            <Flag className="w-3 h-3 mr-1" />
                            Flagged
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl">
                        {questions[currentQuestionIndex].text}
                      </CardTitle>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFlagQuestion(currentQuestionIndex)}
                    >
                      <Flag
                        className={`w-4 h-4 ${questions[currentQuestionIndex].flagged
                          ? 'fill-amber-500 text-amber-500'
                          : ''
                          }`}
                      />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={questions[currentQuestionIndex].selectedAnswer?.toString()}
                    onValueChange={(value) =>
                      handleAnswerSelect(currentQuestionIndex, parseInt(value))
                    }
                  >
                    <div className="space-y-3">
                      {questions[currentQuestionIndex].options.map((option, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${questions[currentQuestionIndex].selectedAnswer === idx
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                            }`}
                          onClick={() => handleAnswerSelect(currentQuestionIndex, idx)}
                        >
                          <RadioGroupItem value={idx.toString()} id={`option-${idx}`} />
                          <Label
                            htmlFor={`option-${idx}`}
                            className="flex-1 cursor-pointer"
                          >
                            <span className="font-medium mr-2">
                              {String.fromCharCode(65 + idx)}.
                            </span>
                            {option}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-6">
                <Button
                  variant="outline"
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
                <div className="flex gap-2">
                  {questions.map((q, idx) => (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${idx === currentQuestionIndex
                        ? 'bg-blue-600 text-white'
                        : q.selectedAnswer !== undefined
                          ? 'bg-green-100 text-green-800 border-2 border-green-300'
                          : q.flagged
                            ? 'bg-amber-100 text-amber-800 border-2 border-amber-300'
                            : 'bg-gray-100 text-gray-600 border-2 border-gray-300'
                        }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  disabled={currentQuestionIndex === questions.length - 1}
                  onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Exam?</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit your exam? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Alert className="border-amber-200 bg-amber-50">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                You have answered {answeredCount} out of {questions.length} questions.
                {flaggedCount > 0 && ` ${flaggedCount} question(s) are flagged for review.`}
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
              Continue Exam
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleManualSubmit}>
              Submit Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Results Dialog */}
      <Dialog open={showResultsDialog} onOpenChange={setShowResultsDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-center">Exam Submitted Successfully!</DialogTitle>
            <DialogDescription className="text-center">
              Your answers have been recorded
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-blue-950 mb-2">Well Done!</h3>
            <p className="text-gray-600 mb-4">
              You answered {answeredCount} out of {questions.length} questions
            </p>
            <Alert className="border-blue-200 bg-blue-50">
              <AlertDescription className="text-blue-800 text-sm">
                Your results will be available once the teacher grades the exam.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                setShowResultsDialog(false);
                setActiveView('list');
                setSelectedExam(null);
              }}
            >
              Back to Exams
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};