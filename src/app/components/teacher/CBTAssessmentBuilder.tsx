import React, { useState, useEffect } from 'react';
import { TeacherAPI } from '../../../utils/api';
import {
  Plus,
  Trash2,
  Edit,
  Eye,
  Clock,
  FileQuestion,
  CheckCircle2,
  Save,
  Send,
  Calendar,
  Shuffle,
  BookOpen,
  Image as ImageIcon,
  Copy,
  Search,
  Circle,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Settings,
  List,
  BarChart3,
  Shield,
  Users,
  PlayCircle,
  Archive,
  Filter,
  MoreVertical,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Checkbox } from '../ui/checkbox';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
// @ts-ignore
import schoolLogo from 'figma:asset/05e5dcd127c3f9119091f655ee2db41390342c66.png';

interface Question {
  id: string;
  questionText: string;
  questionType: 'multiple-choice' | 'true-false' | 'theory';
  options: string[];
  correctAnswer: string | number;
  marks: number;
  status: 'draft' | 'ready';
  explanation?: string;
}

interface Assessment {
  id: string;
  title: string;
  assessmentType: 'mid-term-test' | 'termly-exam' | 'quiz';
  subject: string;
  class: string;
  timeLimit: number;
  totalMarks: number;
  shuffleQuestions: boolean;
  deliveryMode: 'cbt' | 'paper'; // Add delivery mode
  questions: Question[];
  status: 'draft' | 'published';
  createdAt: Date;
}

export const CBTAssessmentBuilder: React.FC = () => {
  const [activeView, setActiveView] = useState<'hub' | 'builder'>('hub'); // Change default to 'hub'
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [statusTab, setStatusTab] = useState<'drafts' | 'scheduled' | 'archived'>('drafts');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const [loading, setLoading] = useState(false);
  const [assessmentLibrary, setAssessmentLibrary] = useState<Assessment[]>([]);

  useEffect(() => {
    const fetchAssessments = async () => {
      setLoading(true);
      try {
        const res = await TeacherAPI.getAssessments();
        if (res.status === 'success' && res.data) {
          setAssessmentLibrary(res.data as Assessment[]);
        }
      } catch (error) {
        console.error('Error fetching assessments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssessments();
  }, []);

  // Assessment State
  const [assessment, setAssessment] = useState<Assessment>({
    id: 'new-assessment',
    title: '',
    assessmentType: 'quiz',
    subject: '',
    class: '',
    timeLimit: 60,
    totalMarks: 0,
    shuffleQuestions: true,
    deliveryMode: 'cbt',
    questions: [],
    status: 'draft',
    createdAt: new Date(),
  });

  // Current Question State
  const currentQuestion = assessment.questions[currentQuestionIndex];

  // Update Current Question
  const updateCurrentQuestion = (updates: Partial<Question>) => {
    const updatedQuestions = [...assessment.questions];
    updatedQuestions[currentQuestionIndex] = {
      ...updatedQuestions[currentQuestionIndex],
      ...updates,
    };
    setAssessment({ ...assessment, questions: updatedQuestions });
  };

  // Update Question Text
  const updateQuestionText = (text: string) => {
    updateCurrentQuestion({ questionText: text });
  };

  // Update Question Type
  const updateQuestionType = (type: 'multiple-choice' | 'true-false' | 'theory') => {
    if (type === 'true-false') {
      updateCurrentQuestion({
        questionType: type,
        options: ['True', 'False'],
        correctAnswer: 0,
      });
    } else if (type === 'theory') {
      updateCurrentQuestion({
        questionType: type,
        options: [],
        correctAnswer: '',
      });
    } else {
      updateCurrentQuestion({
        questionType: type,
        options: currentQuestion.options.length === 2 ? ['', '', '', ''] : currentQuestion.options,
      });
    }
  };

  // Update Option
  const updateOption = (index: number, value: string) => {
    const updatedOptions = [...currentQuestion.options];
    updatedOptions[index] = value;
    updateCurrentQuestion({ options: updatedOptions });
  };

  // Set Correct Answer
  const setCorrectAnswer = (index: number) => {
    updateCurrentQuestion({ correctAnswer: index });
  };

  // Add Option
  const addOption = () => {
    if (currentQuestion.options.length < 5) {
      updateCurrentQuestion({
        options: [...currentQuestion.options, ''],
      });
    }
  };

  // Remove Option
  const removeOption = (index: number) => {
    if (currentQuestion.options.length > 2) {
      const updatedOptions = currentQuestion.options.filter((_, i) => i !== index);
      updateCurrentQuestion({
        options: updatedOptions,
        correctAnswer: currentQuestion.correctAnswer === index ? 0 : currentQuestion.correctAnswer,
      });
    }
  };

  // Add New Question
  const addNewQuestion = () => {
    const newQuestion: Question = {
      id: `q${assessment.questions.length + 1}`,
      questionText: '',
      questionType: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: 0,
      marks: 5,
      status: 'draft',
    };
    setAssessment({
      ...assessment,
      questions: [...assessment.questions, newQuestion],
    });
    setCurrentQuestionIndex(assessment.questions.length);
  };

  // Delete Question
  const deleteQuestion = (index: number) => {
    if (assessment.questions.length > 1) {
      const updatedQuestions = assessment.questions.filter((_, i) => i !== index);
      setAssessment({ ...assessment, questions: updatedQuestions });
      setCurrentQuestionIndex(Math.min(index, updatedQuestions.length - 1));
      toast.success('Question deleted');
    } else {
      toast.error('Cannot delete the last question');
    }
  };

  // Mark Question as Ready
  const markQuestionReady = () => {
    if (!currentQuestion.questionText.trim()) {
      toast.error('Please add a question text');
      return;
    }
    if (
      currentQuestion.questionType !== 'theory' &&
      currentQuestion.options.some((opt) => !opt.trim())
    ) {
      toast.error('Please fill all options');
      return;
    }
    updateCurrentQuestion({ status: 'ready' });
    toast.success('Question marked as ready');
  };

  // Save Assessment
  const saveAssessment = () => {
    toast.success('Assessment saved as draft');
  };

  // Submit Assessment
  const publishAssessment = () => {
    const draftQuestions = assessment.questions.filter((q) => q.status === 'draft');
    if (draftQuestions.length > 0) {
      toast.error(`${draftQuestions.length} question(s) are still in draft. Please complete them first.`);
      return;
    }
    setAssessment({ ...assessment, status: 'published' });
    toast.success('Assessment submitted successfully!');
  };

  // Calculate Total Marks
  const calculateTotalMarks = () => {
    return assessment.questions.reduce((total, q) => total + q.marks, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl text-blue-950">CBT & Assessment Builder</h1>
              <p className="text-sm text-gray-600 mt-1">
                Create and manage computer-based tests and assessments
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setActiveView(activeView === 'builder' ? 'hub' : 'builder')}
              >
                {activeView === 'builder' ? (
                  <>
                    <List className="w-4 h-4 mr-2" />
                    View Library
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4 mr-2" />
                    New Assessment
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {activeView === 'builder' ? (
        /* BUILDER VIEW */
        <div className="flex h-[calc(100vh-120px)]">
          {/* LEFT SIDEBAR - Question Navigation */}
          <div className="w-64 bg-white border-r overflow-y-auto hidden lg:block">
            <div className="p-4 border-b bg-blue-50">
              <h3 className="font-semibold text-blue-950 mb-2">Questions</h3>
              <p className="text-xs text-gray-600">
                {assessment.questions.filter((q) => q.status === 'ready').length} of{' '}
                {assessment.questions.length} ready
              </p>
            </div>

            <div className="p-2">
              {assessment.questions.map((question, index) => (
                <button
                  key={question.id}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-full flex items-center justify-between p-3 mb-1 rounded-lg transition-all ${currentQuestionIndex === index
                    ? 'bg-blue-100 border-2 border-blue-500'
                    : 'hover:bg-gray-100 border-2 border-transparent'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${currentQuestionIndex === index
                        ? 'bg-blue-600 text-white'
                        : question.status === 'ready'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-200 text-gray-600'
                        }`}
                    >
                      {index + 1}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium truncate max-w-[120px]">
                        {question.questionText || 'Untitled'}
                      </p>
                      <p className="text-xs text-gray-500">{question.marks} marks</p>
                    </div>
                  </div>
                  {question.status === 'ready' ? (
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  )}
                </button>
              ))}

              <Button
                onClick={addNewQuestion}
                variant="outline"
                className="w-full mt-3 border-dashed border-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </div>
          </div>

          {/* RIGHT MAIN WORKSPACE */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
              {/* Assessment Settings Card */}
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Assessment Settings</CardTitle>
                      <CardDescription>Configure your assessment details</CardDescription>
                    </div>
                    <Badge variant={assessment.status === 'published' ? 'default' : 'secondary'}>
                      {assessment.status === 'published' ? 'Submitted' : 'Draft'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Delivery Mode */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="delivery-mode">Delivery Mode</Label>
                      <Select
                        value={assessment.deliveryMode}
                        onValueChange={(value: any) =>
                          setAssessment({ ...assessment, deliveryMode: value })
                        }
                      >
                        <SelectTrigger id="delivery-mode">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cbt">
                            <div className="flex items-center gap-2">
                              <BookOpen className="w-4 h-4" />
                              <span>Computer-Based Test (CBT)</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="paper">
                            <div className="flex items-center gap-2">
                              <FileQuestion className="w-4 h-4" />
                              <span>Paper-Based Assessment</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {assessment.deliveryMode === 'cbt' && (
                        <p className="text-xs text-blue-600 mt-1">
                          Student details will be auto-filled when they login and start the assessment
                        </p>
                      )}
                    </div>

                    {/* Assessment Type */}
                    <div className="space-y-2">
                      <Label htmlFor="assessment-type">Assessment Type</Label>
                      <Select
                        value={assessment.assessmentType}
                        onValueChange={(value: any) =>
                          setAssessment({ ...assessment, assessmentType: value })
                        }
                      >
                        <SelectTrigger id="assessment-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mid-term-test">Mid-Term Test</SelectItem>
                          <SelectItem value="termly-exam">Termly Exam</SelectItem>
                          <SelectItem value="quiz">Quiz</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Subject */}
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Select
                        value={assessment.subject}
                        onValueChange={(value) => setAssessment({ ...assessment, subject: value })}
                      >
                        <SelectTrigger id="subject">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mathematics">Mathematics</SelectItem>
                          <SelectItem value="English Language">English Language</SelectItem>
                          <SelectItem value="Physics">Physics</SelectItem>
                          <SelectItem value="Chemistry">Chemistry</SelectItem>
                          <SelectItem value="Biology">Biology</SelectItem>
                          <SelectItem value="Further Mathematics">Further Mathematics</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Class */}
                    <div className="space-y-2">
                      <Label htmlFor="class">Class</Label>
                      <Select
                        value={assessment.class}
                        onValueChange={(value) => setAssessment({ ...assessment, class: value })}
                      >
                        <SelectTrigger id="class">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="JSS 1A">JSS 1A</SelectItem>
                          <SelectItem value="JSS 2A">JSS 2A</SelectItem>
                          <SelectItem value="JSS 3A">JSS 3A</SelectItem>
                          <SelectItem value="SSS 1A">SSS 1A</SelectItem>
                          <SelectItem value="SSS 2A">SSS 2A</SelectItem>
                          <SelectItem value="SSS 3A">SSS 3A</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                      <Label htmlFor="title">Assessment Title</Label>
                      <Input
                        id="title"
                        value={assessment.title}
                        onChange={(e) => setAssessment({ ...assessment, title: e.target.value })}
                        placeholder="e.g., First Term Mathematics Exam"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Question Editor Card */}
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        Question {currentQuestionIndex + 1}
                        {currentQuestion.status === 'ready' ? (
                          <Badge className="bg-green-100 text-green-700">Ready</Badge>
                        ) : (
                          <Badge variant="secondary">Draft</Badge>
                        )}
                      </CardTitle>
                      <CardDescription>
                        Create and configure your assessment question
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))
                        }
                        disabled={currentQuestionIndex === 0}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentQuestionIndex(
                            Math.min(assessment.questions.length - 1, currentQuestionIndex + 1)
                          )
                        }
                        disabled={currentQuestionIndex === assessment.questions.length - 1}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteQuestion(currentQuestionIndex)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Question Type Selector */}
                  <div className="space-y-2">
                    <Label>Question Type</Label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => updateQuestionType('multiple-choice')}
                        className={`p-4 border-2 rounded-lg transition-all ${currentQuestion.questionType === 'multiple-choice'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                          }`}
                      >
                        <CheckCircle2
                          className={`w-6 h-6 mx-auto mb-2 ${currentQuestion.questionType === 'multiple-choice'
                            ? 'text-blue-600'
                            : 'text-gray-400'
                            }`}
                        />
                        <p className="text-sm font-medium">Multiple Choice</p>
                      </button>
                      <button
                        onClick={() => updateQuestionType('true-false')}
                        className={`p-4 border-2 rounded-lg transition-all ${currentQuestion.questionType === 'true-false'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                          }`}
                      >
                        <CheckCircle
                          className={`w-6 h-6 mx-auto mb-2 ${currentQuestion.questionType === 'true-false'
                            ? 'text-blue-600'
                            : 'text-gray-400'
                            }`}
                        />
                        <p className="text-sm font-medium">True/False</p>
                      </button>
                      <button
                        onClick={() => updateQuestionType('theory')}
                        className={`p-4 border-2 rounded-lg transition-all ${currentQuestion.questionType === 'theory'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                          }`}
                      >
                        <FileQuestion
                          className={`w-6 h-6 mx-auto mb-2 ${currentQuestion.questionType === 'theory'
                            ? 'text-blue-600'
                            : 'text-gray-400'
                            }`}
                        />
                        <p className="text-sm font-medium">Theory</p>
                      </button>
                    </div>
                  </div>

                  {/* Rich Text Editor for Question */}
                  <div className="space-y-2">
                    <Label htmlFor="question-text">Question</Label>
                    <div className="border rounded-lg overflow-hidden">
                      {/* Simple toolbar */}
                      <div className="bg-gray-50 border-b px-3 py-2 flex gap-2">
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <span className="font-bold">B</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <span className="italic">I</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <span className="underline">U</span>
                        </Button>
                        <div className="border-l mx-1" />
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <ImageIcon className="w-4 h-4" />
                        </Button>
                      </div>
                      <Textarea
                        id="question-text"
                        value={currentQuestion.questionText}
                        onChange={(e) => updateQuestionText(e.target.value)}
                        placeholder="Type your question here..."
                        className="min-h-[120px] border-0 resize-none focus-visible:ring-0 rounded-none"
                      />
                    </div>
                  </div>

                  {/* Options Section - Only for MCQ and True/False */}
                  {currentQuestion.questionType !== 'theory' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Answer Options</Label>
                        {currentQuestion.questionType === 'multiple-choice' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={addOption}
                            disabled={currentQuestion.options.length >= 5}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Add Option
                          </Button>
                        )}
                      </div>

                      <RadioGroup value={currentQuestion.correctAnswer.toString()}>
                        {currentQuestion.options.map((option, index) => (
                          <div
                            key={index}
                            className={`flex items-center gap-3 p-3 border-2 rounded-lg ${currentQuestion.correctAnswer === index
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200'
                              }`}
                          >
                            <RadioGroupItem
                              value={index.toString()}
                              onClick={() => setCorrectAnswer(index)}
                              className="flex-shrink-0"
                            />
                            <div className="flex-1 flex items-center gap-2">
                              <span className="font-semibold text-sm w-8">
                                {String.fromCharCode(65 + index)}.
                              </span>
                              <Input
                                value={option}
                                onChange={(e) => updateOption(index, e.target.value)}
                                placeholder={`Option ${String.fromCharCode(65 + index)}`}
                                className="border-0 bg-transparent focus-visible:ring-0 px-0"
                                disabled={currentQuestion.questionType === 'true-false'}
                              />
                            </div>
                            {currentQuestion.questionType === 'multiple-choice' &&
                              currentQuestion.options.length > 2 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeOption(index)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            {currentQuestion.correctAnswer === index && (
                              <Badge className="bg-green-100 text-green-700 flex-shrink-0">
                                Correct Answer
                              </Badge>
                            )}
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  )}

                  {/* Theory Question Info */}
                  {currentQuestion.questionType === 'theory' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-900 mb-1">Theory Question</h4>
                          <p className="text-sm text-blue-700">
                            Students will provide a written answer. This will require manual grading.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Question Marks */}
                  <div className="space-y-2">
                    <Label htmlFor="marks">Marks for this Question</Label>
                    <Input
                      id="marks"
                      type="number"
                      min="1"
                      max="100"
                      value={currentQuestion.marks}
                      onChange={(e) =>
                        updateCurrentQuestion({ marks: parseInt(e.target.value) || 5 })
                      }
                      className="max-w-xs"
                    />
                  </div>

                  {/* Mark as Ready Button */}
                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      onClick={markQuestionReady}
                      className="bg-green-600 hover:bg-green-700"
                      disabled={currentQuestion.status === 'ready'}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {currentQuestion.status === 'ready' ? 'Question Ready' : 'Mark as Ready'}
                    </Button>
                    <Button variant="outline" onClick={() => updateCurrentQuestion({ status: 'draft' })}>
                      Edit Question
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Settings Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Assessment Settings
                  </CardTitle>
                  <CardDescription>Configure time limits and other settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Time Limit */}
                    <div className="space-y-2">
                      <Label htmlFor="time-limit" className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Time Limit (minutes)
                      </Label>
                      <Input
                        id="time-limit"
                        type="number"
                        min="5"
                        max="300"
                        value={assessment.timeLimit}
                        onChange={(e) =>
                          setAssessment({
                            ...assessment,
                            timeLimit: parseInt(e.target.value) || 60,
                          })
                        }
                      />
                    </div>

                    {/* Total Marks */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        Total Marks
                      </Label>
                      <div className="h-10 px-3 border rounded-md bg-gray-50 flex items-center">
                        <span className="font-semibold text-blue-950">{calculateTotalMarks()}</span>
                        <span className="text-sm text-gray-500 ml-1">marks</span>
                      </div>
                    </div>

                    {/* Shuffle Questions */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Shuffle className="w-4 h-4" />
                        Question Order
                      </Label>
                      <div className="flex items-center gap-2 h-10">
                        <Checkbox
                          id="shuffle"
                          checked={assessment.shuffleQuestions}
                          onCheckedChange={(checked) =>
                            setAssessment({ ...assessment, shuffleQuestions: !!checked })
                          }
                        />
                        <Label htmlFor="shuffle" className="cursor-pointer">
                          Shuffle questions
                        </Label>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t">
                    <Button onClick={saveAssessment} variant="outline" className="flex-1">
                      <Save className="w-4 h-4 mr-2" />
                      Save as Draft
                    </Button>
                    <Button onClick={() => setShowPreview(true)} variant="outline" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button onClick={publishAssessment} className="flex-1 bg-blue-600 hover:bg-blue-700">
                      <Send className="w-4 h-4 mr-2" />
                      Submit Assessment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        /* MANAGEMENT HUB VIEW */
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Action Header */}
          <div className="bg-white rounded-lg border p-4 sm:p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-blue-950">Assessment Library</h2>
                <p className="text-sm text-gray-600 mt-1">Manage all your assessments in one place</p>
              </div>
              <Button
                onClick={() => setActiveView('builder')}
                className="bg-blue-600 hover:bg-blue-700 w-full lg:w-auto"
                size="lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create New Assessment
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Search Bar */}
              <div className="relative md:col-span-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search assessments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Subject Filter */}
              <div>
                <Select value={filterSubject} onValueChange={setFilterSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Subjects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="English Language">English Language</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                    <SelectItem value="Biology">Biology</SelectItem>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Further Mathematics">Further Mathematics</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Assessment Type Filter */}
              <div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="mid-term-test">Mid-Term Test</SelectItem>
                    <SelectItem value="termly-exam">Termly Exam</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Status Tabs */}
          <Tabs value={statusTab} onValueChange={(value: any) => setStatusTab(value)}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="drafts" className="flex items-center gap-2">
                <Edit className="w-4 h-4" />
                <span>Drafts</span>
                <Badge variant="secondary" className="ml-1">
                  {assessmentLibrary.filter((a) => a.status === 'draft').length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="scheduled" className="flex items-center gap-2">
                <PlayCircle className="w-4 h-4" />
                <span>Scheduled/Live</span>
                <Badge variant="secondary" className="ml-1">
                  {
                    assessmentLibrary.filter(
                      (a) =>
                        a.status === 'published' &&
                        new Date().getTime() - a.createdAt.getTime() < 30 * 24 * 60 * 60 * 1000
                    ).length
                  }
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="archived" className="flex items-center gap-2">
                <Archive className="w-4 h-4" />
                <span>Past/Archived</span>
                <Badge variant="secondary" className="ml-1">
                  {
                    assessmentLibrary.filter(
                      (a) =>
                        a.status === 'published' &&
                        new Date().getTime() - a.createdAt.getTime() >= 30 * 24 * 60 * 60 * 1000
                    ).length
                  }
                </Badge>
              </TabsTrigger>
            </TabsList>

            {/* Drafts Tab */}
            <TabsContent value="drafts" className="space-y-4">
              {assessmentLibrary
                .filter((a) => {
                  const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    a.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    a.class.toLowerCase().includes(searchQuery.toLowerCase());
                  const matchesSubject = filterSubject === 'all' || a.subject === filterSubject;
                  const matchesType = filterType === 'all' || a.assessmentType === filterType;
                  return a.status === 'draft' && matchesSearch && matchesSubject && matchesType;
                })
                .map((assessment) => (
                  <Card key={assessment.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Icon */}
                        <div className="flex-shrink-0">
                          <div
                            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center ${assessment.assessmentType === 'termly-exam'
                              ? 'bg-amber-100'
                              : 'bg-blue-100'
                              }`}
                          >
                            {assessment.assessmentType === 'termly-exam' ? (
                              <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-amber-600" />
                            ) : (
                              <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
                            )}
                          </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                            <div>
                              <h3 className="font-semibold text-blue-950 text-lg truncate">
                                {assessment.title}
                              </h3>
                              <div className="flex flex-wrap items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {assessment.subject}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {assessment.class}
                                </Badge>
                                <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                                  Draft
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${assessment.deliveryMode === 'cbt'
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'bg-gray-50 text-gray-700'
                                    }`}
                                >
                                  {assessment.deliveryMode === 'cbt' ? 'CBT' : 'Paper'}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-gray-600 mb-4">
                            <div className="flex items-center gap-2">
                              <FileQuestion className="w-4 h-4" />
                              <span>{assessment.questions.length} Questions</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{assessment.timeLimit} mins</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <BarChart3 className="w-4 h-4" />
                              <span>{assessment.totalMarks} marks</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{assessment.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setActiveView('builder')}
                              className="flex-1 sm:flex-none"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setAssessment(assessment);
                                setShowPreview(true);
                              }}
                              className="flex-1 sm:flex-none"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Preview
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

              {assessmentLibrary.filter((a) => a.status === 'draft').length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg border">
                  <Edit className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Draft Assessments</h3>
                  <p className="text-gray-500 mb-4">
                    Create a new assessment to get started
                  </p>
                  <Button onClick={() => setActiveView('builder')} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Assessment
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Scheduled/Live Tab */}
            <TabsContent value="scheduled" className="space-y-4">
              {assessmentLibrary
                .filter((a) => {
                  const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    a.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    a.class.toLowerCase().includes(searchQuery.toLowerCase());
                  const matchesSubject = filterSubject === 'all' || a.subject === filterSubject;
                  const matchesType = filterType === 'all' || a.assessmentType === filterType;
                  const isRecent = new Date().getTime() - a.createdAt.getTime() < 30 * 24 * 60 * 60 * 1000;
                  return a.status === 'published' && isRecent && matchesSearch && matchesSubject && matchesType;
                })
                .map((assessment) => (
                  <Card key={assessment.id} className="hover:shadow-md transition-shadow border-l-4 border-l-green-500">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Icon */}
                        <div className="flex-shrink-0">
                          <div
                            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center ${assessment.assessmentType === 'termly-exam'
                              ? 'bg-amber-100'
                              : 'bg-blue-100'
                              }`}
                          >
                            {assessment.assessmentType === 'termly-exam' ? (
                              <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-amber-600" />
                            ) : (
                              <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
                            )}
                          </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                            <div>
                              <h3 className="font-semibold text-blue-950 text-lg truncate">
                                {assessment.title}
                              </h3>
                              <div className="flex flex-wrap items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {assessment.subject}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {assessment.class}
                                </Badge>
                                <Badge className="bg-green-100 text-green-800 text-xs">
                                  Submitted
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${assessment.deliveryMode === 'cbt'
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'bg-gray-50 text-gray-700'
                                    }`}
                                >
                                  {assessment.deliveryMode === 'cbt' ? 'CBT' : 'Paper'}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-gray-600 mb-4">
                            <div className="flex items-center gap-2">
                              <FileQuestion className="w-4 h-4" />
                              <span>{assessment.questions.length} Questions</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{assessment.timeLimit} mins</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <BarChart3 className="w-4 h-4" />
                              <span>{assessment.totalMarks} marks</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{assessment.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setAssessment(assessment);
                                setShowPreview(true);
                              }}
                              className="flex-1 sm:flex-none"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Preview
                            </Button>
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-none"
                              onClick={() => toast.success('Viewing scores...')}
                            >
                              <BarChart3 className="w-4 h-4 mr-2" />
                              View Scores
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toast.info('Duplicating assessment...')}
                              className="flex-1 sm:flex-none"
                            >
                              <Copy className="w-4 h-4 mr-2" />
                              Duplicate
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

              {assessmentLibrary.filter(
                (a) =>
                  a.status === 'published' &&
                  new Date().getTime() - a.createdAt.getTime() < 30 * 24 * 60 * 60 * 1000
              ).length === 0 && (
                  <div className="text-center py-12 bg-white rounded-lg border">
                    <PlayCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Assessments</h3>
                    <p className="text-gray-500 mb-4">
                      Publish a draft assessment to make it available to students
                    </p>
                  </div>
                )}
            </TabsContent>

            {/* Archived Tab */}
            <TabsContent value="archived" className="space-y-4">
              {assessmentLibrary
                .filter((a) => {
                  const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    a.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    a.class.toLowerCase().includes(searchQuery.toLowerCase());
                  const matchesSubject = filterSubject === 'all' || a.subject === filterSubject;
                  const matchesType = filterType === 'all' || a.assessmentType === filterType;
                  const isArchived = new Date().getTime() - a.createdAt.getTime() >= 30 * 24 * 60 * 60 * 1000;
                  return a.status === 'published' && isArchived && matchesSearch && matchesSubject && matchesType;
                })
                .map((assessment) => (
                  <Card key={assessment.id} className="hover:shadow-md transition-shadow bg-gray-50">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Icon */}
                        <div className="flex-shrink-0">
                          <div
                            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center ${assessment.assessmentType === 'termly-exam'
                              ? 'bg-gray-200'
                              : 'bg-gray-200'
                              }`}
                          >
                            {assessment.assessmentType === 'termly-exam' ? (
                              <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-gray-600" />
                            ) : (
                              <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-gray-600" />
                            )}
                          </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                            <div>
                              <h3 className="font-semibold text-blue-950 text-lg truncate">
                                {assessment.title}
                              </h3>
                              <div className="flex flex-wrap items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {assessment.subject}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {assessment.class}
                                </Badge>
                                <Badge className="bg-gray-200 text-gray-700 text-xs">
                                  Archived
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${assessment.deliveryMode === 'cbt'
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'bg-gray-50 text-gray-700'
                                    }`}
                                >
                                  {assessment.deliveryMode === 'cbt' ? 'CBT' : 'Paper'}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-gray-600 mb-4">
                            <div className="flex items-center gap-2">
                              <FileQuestion className="w-4 h-4" />
                              <span>{assessment.questions.length} Questions</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{assessment.timeLimit} mins</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <BarChart3 className="w-4 h-4" />
                              <span>{assessment.totalMarks} marks</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{assessment.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setAssessment(assessment);
                                setShowPreview(true);
                              }}
                              className="flex-1 sm:flex-none"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Preview
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toast.success('Viewing results...')}
                              className="flex-1 sm:flex-none"
                            >
                              <BarChart3 className="w-4 h-4 mr-2" />
                              View Results
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toast.info('Duplicating assessment...')}
                              className="flex-1 sm:flex-none"
                            >
                              <Copy className="w-4 h-4 mr-2" />
                              Reuse
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

              {assessmentLibrary.filter(
                (a) =>
                  a.status === 'published' &&
                  new Date().getTime() - a.createdAt.getTime() >= 30 * 24 * 60 * 60 * 1000
              ).length === 0 && (
                  <div className="text-center py-12 bg-white rounded-lg border">
                    <Archive className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Archived Assessments</h3>
                    <p className="text-gray-500">
                      Assessments older than 30 days will appear here
                    </p>
                  </div>
                )}
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="!max-w-none !w-[100vw] !h-[100vh] max-h-[100vh] !top-0 !left-0 !translate-x-0 !translate-y-0 overflow-hidden p-0 flex flex-col rounded-none border-0 !m-0">
          <DialogHeader className="px-6 pt-4 pb-3 border-b flex-shrink-0 bg-white">
            <DialogTitle>Assessment Preview</DialogTitle>
            <DialogDescription>
              Preview how the assessment will appear to students
            </DialogDescription>
          </DialogHeader>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50">

            {/* Professional Exam Paper Layout */}
            <div className="bg-white p-8 sm:p-10 lg:p-12 w-full max-w-[1400px] mx-auto shadow-lg my-6">
              {/* School Header - Matching Report Card Style */}
              <div className="border-2 border-blue-950 p-3 sm:p-4 mb-4">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4">
                  {/* School Logo */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex items-center justify-center flex-shrink-0">
                    <img
                      src={schoolLogo}
                      alt="BFOIA Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* School Info */}
                  <div className="flex-1 text-center">
                    <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-950 mb-1">
                      BISHOP FELIX OWOLABI INT'L ACADEMY
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-700 mb-0.5">
                      1, Faithtriumph Drive, Behind Galaxy Hotel, West Bye Pass, Ring Road, Osogbo, Osun State
                    </p>
                    <p className="text-xs sm:text-sm font-semibold text-blue-900">
                      MOTTO ..... learning for an Exceptional Nation
                    </p>
                  </div>
                </div>
              </div>

              {/* Title Section */}
              <div className="border border-gray-400 mb-4">
                <div className="bg-gray-200 p-2 text-center">
                  <h2 className="text-base sm:text-lg font-bold text-blue-950">
                    {assessment.assessmentType === 'mid-term-test'
                      ? 'MID-TERM ASSESSMENT TEST'
                      : assessment.assessmentType === 'termly-exam'
                        ? 'TERMINAL EXAMINATION'
                        : 'CLASS QUIZ'}
                  </h2>
                </div>
              </div>

              {/* Assessment Information - Matching Report Card Table Style */}
              <div className="border border-gray-400 mb-4 overflow-x-auto">
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className="border border-gray-400 p-2 bg-gray-100 font-semibold text-xs sm:text-sm w-1/4">
                        SUBJECT:
                      </td>
                      <td className="border border-gray-400 p-2 text-xs sm:text-sm font-medium text-blue-950">
                        {assessment.subject}
                      </td>
                      <td className="border border-gray-400 p-2 bg-gray-100 font-semibold text-xs sm:text-sm w-1/4">
                        CLASS:
                      </td>
                      <td className="border border-gray-400 p-2 text-xs sm:text-sm font-medium text-blue-950">
                        {assessment.class}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400 p-2 bg-gray-100 font-semibold text-xs sm:text-sm">
                        TIME ALLOWED:
                      </td>
                      <td className="border border-gray-400 p-2 text-xs sm:text-sm font-medium text-blue-950">
                        {assessment.timeLimit} Minutes
                      </td>
                      <td className="border border-gray-400 p-2 bg-gray-100 font-semibold text-xs sm:text-sm">
                        TOTAL MARKS:
                      </td>
                      <td className="border border-gray-400 p-2 text-xs sm:text-sm font-medium text-blue-950">
                        {calculateTotalMarks()} Marks
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400 p-2 bg-gray-100 font-semibold text-xs sm:text-sm">
                        STUDENT NAME:
                      </td>
                      <td className="border border-gray-400 p-2 text-xs sm:text-sm">
                        {assessment.deliveryMode === 'cbt' ? (
                          <span className="font-medium text-blue-950">Ademola Olamide Johnson</span>
                        ) : (
                          <div className="border-b-2 border-dotted border-gray-400 h-5"></div>
                        )}
                      </td>
                      <td className="border border-gray-400 p-2 bg-gray-100 font-semibold text-xs sm:text-sm">
                        ADMISSION NO:
                      </td>
                      <td className="border border-gray-400 p-2 text-xs sm:text-sm">
                        {assessment.deliveryMode === 'cbt' ? (
                          <span className="font-medium text-blue-950">BFOIA/2023/0145</span>
                        ) : (
                          <div className="border-b-2 border-dotted border-gray-400 h-5"></div>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400 p-2 bg-gray-100 font-semibold text-xs sm:text-sm">
                        DATE:
                      </td>
                      <td className="border border-gray-400 p-2 text-xs sm:text-sm">
                        {assessment.deliveryMode === 'cbt' ? (
                          <span className="font-medium text-blue-950">
                            {new Date().toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </span>
                        ) : (
                          <div className="border-b-2 border-dotted border-gray-400 h-5"></div>
                        )}
                      </td>
                      {assessment.deliveryMode === 'paper' && (
                        <>
                          <td className="border border-gray-400 p-2 bg-gray-100 font-semibold text-xs sm:text-sm">
                            SIGNATURE:
                          </td>
                          <td className="border border-gray-400 p-2 text-xs sm:text-sm">
                            <div className="border-b-2 border-dotted border-gray-400 h-5"></div>
                          </td>
                        </>
                      )}
                      {assessment.deliveryMode === 'cbt' && (
                        <td
                          colSpan={2}
                          className="border border-gray-400 p-2 bg-blue-50 text-xs text-center italic text-blue-700"
                        >
                          Computer-Based Test - Auto-filled on Login
                        </td>
                      )}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Instructions Section */}
              <div className="border border-gray-400 mb-4">
                <div className="bg-blue-950 p-2">
                  <h3 className="font-bold text-white text-xs sm:text-sm">INSTRUCTIONS TO CANDIDATES:</h3>
                </div>
                <div className="p-3 border-t border-gray-400">
                  <ol className="list-decimal list-inside space-y-1.5 text-xs sm:text-sm text-gray-800">
                    <li>Answer all questions in the spaces provided on this question paper.</li>
                    <li>Read each question carefully before attempting your answer.</li>
                    <li>For multiple-choice questions, shade or tick the correct option clearly.</li>
                    <li>For theory questions, write your answers clearly and legibly.</li>
                    <li>You have <strong>{assessment.timeLimit} minutes</strong> to complete this assessment.</li>
                    <li>Do not communicate with other candidates during the examination.</li>
                    <li>Electronic devices (phones, calculators, smartwatches) are strictly prohibited unless specified.</li>
                    <li>Show all workings for mathematical calculations where applicable.</li>
                    <li>Any form of examination malpractice will lead to automatic cancellation of results.</li>
                  </ol>
                </div>
              </div>

              {/* Questions Section */}
              <div className="border border-gray-400 mb-4">
                <div className="bg-gray-200 p-2 border-b border-gray-400">
                  <h2 className="text-sm sm:text-base font-bold text-blue-950 text-center">
                    EXAMINATION QUESTIONS
                  </h2>
                </div>

                <div className="p-4 space-y-6">
                  {assessment.questions
                    .filter((q) => q.status === 'ready')
                    .map((question, index) => (
                      <div key={question.id} className="space-y-3">
                        {/* Question Header */}
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-950 text-white flex items-center justify-center font-bold text-sm">
                              {index + 1}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs bg-blue-50">
                                {question.questionType === 'multiple-choice'
                                  ? 'Objective'
                                  : question.questionType === 'true-false'
                                    ? 'True/False'
                                    : 'Theory'}
                              </Badge>
                              <Badge className="bg-amber-600 text-white text-xs">
                                [{question.marks} {question.marks === 1 ? 'mark' : 'marks'}]
                              </Badge>
                            </div>
                            <p className="text-sm sm:text-base text-gray-900 leading-relaxed font-medium">
                              {question.questionText}
                            </p>
                          </div>
                        </div>

                        {/* Options for MCQ and True/False */}
                        {question.questionType !== 'theory' && question.options.length > 0 && (
                          <div className="ml-10 sm:ml-11 space-y-2">
                            {question.options.map((option, optIndex) => (
                              <div
                                key={optIndex}
                                className="flex items-start gap-3 p-2 border border-gray-300 rounded bg-gray-50"
                              >
                                <div className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-blue-950 mt-0.5"></div>
                                <div className="flex-1 text-xs sm:text-sm text-gray-800">
                                  <span className="font-bold mr-2">
                                    {String.fromCharCode(65 + optIndex)}.
                                  </span>
                                  {option}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Answer Space for Theory */}
                        {question.questionType === 'theory' && (
                          <div className="ml-10 sm:ml-11">
                            <div className="border-2 border-gray-400 rounded p-3 bg-blue-50 min-h-[180px]">
                              <p className="text-xs text-gray-600 mb-2 font-semibold">ANSWER:</p>
                              <div className="space-y-4">
                                {[...Array(10)].map((_, i) => (
                                  <div
                                    key={i}
                                    className="border-b border-dotted border-gray-400 h-4"
                                  ></div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Separator between questions */}
                        {index < assessment.questions.filter((q) => q.status === 'ready').length - 1 && (
                          <div className="border-t border-gray-300 pt-2 mt-4"></div>
                        )}
                      </div>
                    ))}

                  {assessment.questions.filter((q) => q.status === 'ready').length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <AlertCircle className="w-12 h-12 mx-auto mb-3 text-amber-500" />
                      <p className="text-sm">No ready questions to preview. Please mark questions as ready first.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Signatures */}
              <div className="border border-gray-400">
                <div className="grid grid-cols-1 sm:grid-cols-2">
                  <div className="border-b sm:border-b-0 sm:border-r border-gray-400 p-3">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Teacher's Name & Signature:</p>
                    <div className="border-b-2 border-dotted border-gray-400 h-8 mt-4"></div>
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Date:</p>
                    <div className="border-b-2 border-dotted border-gray-400 h-8 mt-4"></div>
                  </div>
                </div>
              </div>

              {/* Copyright Footer */}
              <div className="text-center mt-4">
                <p className="text-xs text-gray-500">
                  © {new Date().getFullYear()} Bishop Felix Owolabi International Academy. All Rights Reserved.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="px-6 py-3 border-t flex-shrink-0 bg-white">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Close Preview
            </Button>
            <Button
              onClick={() => {
                window.print();
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Print Assessment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};