import React, { useState, useEffect } from 'react';
import { CBTExam, CBTQuestion, CBTAnswer, CBTResult } from '../../../types';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Clock, ChevronLeft, ChevronRight, CircleCheck, CircleAlert } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { cn } from '../ui/utils';

interface CBTExamInterfaceProps {
  exam: CBTExam;
  onComplete: (result: CBTResult) => void;
  onExit: () => void;
}

export const CBTExamInterface: React.FC<CBTExamInterfaceProps> = ({
  exam,
  onComplete,
  onExit,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<CBTAnswer[]>(
    exam.questions.map(q => ({ questionId: q.id, selectedAnswer: null }))
  );
  const [timeRemaining, setTimeRemaining] = useState(exam.duration * 60); // Convert minutes to seconds
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [result, setResult] = useState<CBTResult | null>(null);
  const [startTime] = useState(Date.now());

  const currentQuestion = exam.questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex];

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Prevent page navigation
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (option: 'a' | 'b' | 'c' | 'd') => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = {
      ...newAnswers[currentQuestionIndex],
      selectedAnswer: option,
    };
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleQuestionNavigation = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const calculateResult = (): CBTResult => {
    let correctCount = 0;
    
    answers.forEach((answer, index) => {
      const question = exam.questions[index];
      if (answer.selectedAnswer === question.correctAnswer) {
        correctCount++;
      }
    });

    const percentage = (correctCount / exam.totalQuestions) * 100;
    const passed = percentage >= exam.cutoffMark;
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    return {
      examId: exam.id,
      studentId: 'current-student-id',
      studentName: 'Current Student',
      score: correctCount,
      totalQuestions: exam.totalQuestions,
      percentage,
      passed,
      completedAt: new Date(),
      timeTaken,
    };
  };

  const handleSubmit = () => {
    const examResult = calculateResult();
    setResult(examResult);
    setShowSubmitDialog(false);
    setShowResultDialog(true);
  };

  const handleAutoSubmit = () => {
    const examResult = calculateResult();
    setResult(examResult);
    setShowResultDialog(true);
  };

  const handleCompleteExam = () => {
    if (result) {
      onComplete(result);
    }
  };

  const answeredCount = answers.filter(a => a.selectedAnswer !== null).length;
  const progressPercentage = (answeredCount / exam.totalQuestions) * 100;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="bg-blue-950 text-white px-6 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg">{exam.title}</h1>
            <p className="text-sm text-blue-200">{exam.subject}</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs text-blue-200">Time Remaining</p>
              <div className={cn(
                "flex items-center gap-2 text-lg",
                timeRemaining < 300 && "text-red-400"
              )}>
                <Clock className="w-5 h-5" />
                <span>{formatTime(timeRemaining)}</span>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs text-blue-200">Progress</p>
              <p className="text-lg">{answeredCount} / {exam.totalQuestions}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-2 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto">
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* Question Card */}
          <Card className="mb-6">
            <CardContent className="p-8">
              {/* Question Number */}
              <div className="flex items-center justify-between mb-6">
                <Badge variant="outline" className="text-base px-4 py-2">
                  Question {currentQuestionIndex + 1} of {exam.totalQuestions}
                </Badge>
                {currentAnswer.selectedAnswer && (
                  <Badge className="bg-green-500">
                    <CircleCheck className="w-4 h-4 mr-1" />
                    Answered
                  </Badge>
                )}
              </div>

              {/* Question Text */}
              <div className="mb-8">
                <p className="text-lg leading-relaxed">
                  {currentQuestion.question}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {(['a', 'b', 'c', 'd'] as const).map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswerSelect(option)}
                    className={cn(
                      "w-full text-left p-4 rounded-lg border-2 transition-all",
                      "hover:border-blue-500 hover:bg-blue-50",
                      currentAnswer.selectedAnswer === option
                        ? "border-blue-950 bg-blue-950 text-white"
                        : "border-gray-200 bg-white"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                        currentAnswer.selectedAnswer === option
                          ? "bg-white text-blue-950"
                          : "bg-gray-100 text-gray-700"
                      )}>
                        {option.toUpperCase()}
                      </div>
                      <span className="flex-1 pt-1">
                        {currentQuestion.options[option]}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <Button
              onClick={() => setShowSubmitDialog(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              Submit Exam
            </Button>

            <Button
              variant="outline"
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === exam.questions.length - 1}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Question Navigator */}
          <Card>
            <CardContent className="p-6">
              <p className="text-sm mb-4">Question Navigator</p>
              <div className="grid grid-cols-10 gap-2">
                {exam.questions.map((_, index) => {
                  const isAnswered = answers[index].selectedAnswer !== null;
                  const isCurrent = index === currentQuestionIndex;

                  return (
                    <button
                      key={index}
                      onClick={() => handleQuestionNavigation(index)}
                      className={cn(
                        "w-10 h-10 rounded-lg border-2 transition-all",
                        isCurrent && "ring-2 ring-blue-500",
                        isAnswered
                          ? "bg-green-500 border-green-500 text-white"
                          : "bg-white border-gray-300 hover:border-blue-500"
                      )}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Exam?</DialogTitle>
            <DialogDescription>
              You have answered {answeredCount} out of {exam.totalQuestions} questions.
              {answeredCount < exam.totalQuestions && (
                <span className="block mt-2 text-amber-600">
                  <CircleAlert className="w-4 h-4 inline mr-1" />
                  Warning: You have {exam.totalQuestions - answeredCount} unanswered question(s).
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
              Go Back
            </Button>
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
              Confirm Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Result Dialog */}
      <Dialog open={showResultDialog} onOpenChange={() => {}}>
        <DialogContent className="w-[95vw] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              Exam Completed!
            </DialogTitle>
          </DialogHeader>
          
          {result && (
            <div className="space-y-6 py-4">
              {/* Pass/Fail Badge */}
              <div className="text-center">
                {result.passed ? (
                  <Badge className="bg-green-500 text-white text-lg px-6 py-2">
                    <CircleCheck className="w-5 h-5 mr-2" />
                    PASSED
                  </Badge>
                ) : (
                  <Badge className="bg-red-500 text-white text-lg px-6 py-2">
                    <CircleAlert className="w-5 h-5 mr-2" />
                    FAILED
                  </Badge>
                )}
              </div>

              {/* Score Display */}
              <div className="text-center">
                <div className="text-6xl text-blue-950 mb-2">
                  {result.percentage.toFixed(1)}%
                </div>
                <p className="text-gray-600">
                  {result.score} out of {result.totalQuestions} correct
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Time Taken</p>
                  <p>{formatTime(result.timeTaken)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Cut-off Mark</p>
                  <p>{exam.cutoffMark}%</p>
                </div>
              </div>

              {/* Feedback */}
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-700">
                  {result.passed
                    ? "Congratulations! You have successfully passed this exam."
                    : "Unfortunately, you did not meet the cut-off mark. Keep studying and try again."}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={handleCompleteExam} className="w-full bg-blue-950 hover:bg-blue-900">
              View Results Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
