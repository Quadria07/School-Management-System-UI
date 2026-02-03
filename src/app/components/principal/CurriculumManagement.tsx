import React, { useState } from 'react';
import {
  BookCheck,
  CheckCircle,
  XCircle,
  MessageSquare,
  Search,
  Filter,
  BookOpen,
  Library,
  Upload,
  Eye,
  Clock,
  X as CloseIcon,
  FileText,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { toast } from 'sonner';
import { Progress } from '../ui/progress';
import { ScrollArea } from '../ui/scroll-area';
import { Label } from '../ui/label';

interface LessonNote {
  id: string;
  teacher: string;
  subject: string;
  class: string;
  topic: string;
  week: number;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'shared';
  rejectionComment?: string;
  // Full lesson note data
  term?: string;
  period?: string;
  duration?: string;
  subTopic?: string;
  previousKnowledge?: string;
  instructionalMaterials?: string;
  learningObjectivesCognitive?: string;
  learningObjectivesAffective?: string;
  learningObjectivesPsychomotor?: string;
  setInduction?: string;
  presentation?: string;
  evaluation?: string;
  summary?: string;
  assignment?: string;
  teacherReflection?: string;
  hodRemarks?: string;
}

interface SyllabusItem {
  subject: string;
  class: string;
  totalTopics: number;
  completedTopics: number;
  teacher: string;
}

export const CurriculumManagement: React.FC = () => {
  const [selectedNote, setSelectedNote] = useState<LessonNote | null>(null);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [rejectionComment, setRejectionComment] = useState('');

  const [lessonNotes, setLessonNotes] = useState<LessonNote[]>([
    {
      id: 'LN001',
      teacher: 'Mrs. Sarah Johnson',
      subject: 'Mathematics',
      class: 'JSS 2A',
      topic: 'Algebraic Expressions',
      week: 5,
      submittedDate: '2 hours ago',
      status: 'pending',
      term: 'First Term',
      period: '1st Period',
      duration: '40 minutes',
      subTopic: 'Simplification of Algebraic Expressions',
      previousKnowledge: 'Students have basic knowledge of arithmetic operations and can identify variables and constants.',
      instructionalMaterials: '- Mathematics textbook\n- Whiteboard and markers\n- Chart showing algebraic terms\n- Worksheet for practice\n- Calculator',
      learningObjectivesCognitive: 'By the end of the lesson, students should be able to:\n1. Define algebraic expressions and identify terms\n2. Simplify basic algebraic expressions using addition and subtraction\n3. Apply the rules of collecting like terms',
      learningObjectivesAffective: 'Students will develop:\n1. Appreciation for the importance of algebra in mathematics\n2. Confidence in working with algebraic expressions\n3. Cooperative attitude during group activities',
      learningObjectivesPsychomotor: 'Students will be able to:\n1. Accurately write and organize algebraic expressions\n2. Use mathematical symbols correctly\n3. Demonstrate proper use of calculator for checking answers',
      setInduction: 'Start the lesson by asking students: "If you have x apples and I give you 3 more apples, how many apples do you have now?"\n\nWrite x + 3 on the board and explain that this is an algebraic expression.\n\nConnect to their previous knowledge by reviewing arithmetic operations and introducing how letters can represent unknown values.',
      presentation: 'Step 1: Definition and Introduction (8 minutes)\nTeacher\'s Activity:\n- Define algebraic expression as a mathematical phrase containing numbers, variables, and operation symbols\n- Write examples on the board: 3x + 2, 5y - 7, 2a + 3b\n- Explain key terms: variable, constant, coefficient, like terms\n\nStudents\' Activity:\n- Listen attentively and take notes\n- Ask clarifying questions\n- Copy examples into their notebooks\n\nStep 2: Identifying Like Terms (7 minutes)\nTeacher\'s Activity:\n- Explain that like terms have the same variables raised to the same power\n- Give examples: 3x and 5x are like terms, but 3x and 3y are not\n- Demonstrate identifying like terms in expressions\n\nStudents\' Activity:\n- Participate in identifying like terms\n- Practice with examples from the board\n\nStep 3: Simplification Process (10 minutes)\nTeacher\'s Activity:\n- Demonstrate step-by-step simplification\n- Example 1: 3x + 5x = 8x\n- Example 2: 7y + 3 - 2y + 5 = 5y + 8\n- Show common mistakes to avoid\n\nStudents\' Activity:\n- Follow along with teacher\'s demonstration\n- Attempt practice problems in pairs\n- Share solutions with the class\n\nStep 4: Guided Practice (5 minutes)\nTeacher\'s Activity:\n- Provide worksheet with 5 problems\n- Move around the class to assist struggling students\n- Select volunteers to solve problems on the board\n\nStudents\' Activity:\n- Work individually on practice problems\n- Compare answers with classmates\n- Volunteer to demonstrate solutions',
      evaluation: 'Assessment Questions:\n\n1. What is an algebraic expression? Give two examples.\n\n2. Identify the like terms in: 5x + 3y - 2x + 7y\n\n3. Simplify the following:\n   a) 6a + 3a\n   b) 8x - 3x + 2\n   c) 4y + 7 - 2y + 3\n\n4. True or False: 3x and 3y are like terms? Explain your answer.\n\n5. Create your own algebraic expression with at least 4 terms and simplify it.',
      summary: 'Key Takeaways:\n1. An algebraic expression contains variables, constants, and operations\n2. Like terms have the same variable(s) raised to the same power\n3. To simplify, combine only like terms by adding or subtracting their coefficients\n4. The variable part remains unchanged when combining like terms\n\nReview the main examples from the lesson and emphasize the importance of identifying like terms before simplifying.',
      assignment: 'CLASSWORK:\n1. Simplify: 9x + 4x - 2x\n2. Simplify: 7y + 3 - 4y + 8\n3. Identify and combine like terms: 5a + 3b - 2a + 7b\n\nHOMEWORK:\n1. Simplify the following expressions:\n   a) 12x + 5x - 3x\n   b) 8y - 3y + 4\n   c) 6a + 2b - 3a + 5b - 1\n   d) 10m + 7 - 6m + 3\n\n2. Create 3 algebraic expressions of your own and simplify them.\n\n3. Read pages 45-48 in your textbook on "Simplifying Algebraic Expressions"\n\nDUE: Next class',
      teacherReflection: '',
      hodRemarks: '',
    },
    {
      id: 'LN002',
      teacher: 'Mr. David Okafor',
      subject: 'English Language',
      class: 'SSS 1B',
      topic: 'Parts of Speech',
      week: 5,
      submittedDate: '4 hours ago',
      status: 'pending',
      term: 'First Term',
      period: '2nd Period',
      duration: '40 minutes',
      subTopic: 'Nouns and Pronouns',
      previousKnowledge: 'Students can identify words in a sentence and understand basic sentence structure.',
      instructionalMaterials: '- English textbook\n- Flash cards with different words\n- Chart showing parts of speech\n- Whiteboard and markers\n- Handouts with practice exercises',
      learningObjectivesCognitive: 'By the end of the lesson, students should be able to:\n1. Define nouns and pronouns\n2. Identify different types of nouns (common, proper, collective, abstract)\n3. Distinguish between nouns and pronouns in sentences\n4. Use pronouns correctly to replace nouns',
      learningObjectivesAffective: 'Students will:\n1. Appreciate the importance of proper grammar in communication\n2. Show enthusiasm in participating in class activities\n3. Develop confidence in using correct grammar',
      learningObjectivesPsychomotor: 'Students will:\n1. Write sentences using different types of nouns\n2. Correctly replace nouns with appropriate pronouns\n3. Create flashcards for different parts of speech',
      setInduction: 'Begin by writing sentences on the board:\n"John loves soccer. John plays soccer every day. John is very good at soccer."\n\nAsk students: "Do you notice anything repetitive about these sentences? How can we make them sound better?"\n\nDiscuss how we can replace "John" with "He" to avoid repetition, introducing the concept of pronouns.',
      presentation: 'Step 1: Introduction to Nouns (10 minutes)\nTeacher\'s Activity:\n- Define noun as a naming word (person, place, thing, or idea)\n- Explain types of nouns with examples:\n  * Common nouns: boy, city, book\n  * Proper nouns: John, Lagos, Bible\n  * Collective nouns: team, family, flock\n  * Abstract nouns: love, happiness, freedom\n- Write examples on the board\n\nStudents\' Activity:\n- Listen and take notes\n- Provide additional examples\n- Identify nouns in sample sentences\n\nStep 2: Introduction to Pronouns (8 minutes)\nTeacher\'s Activity:\n- Define pronoun as a word that replaces a noun\n- Explain types: personal (I, you, he, she), possessive (mine, yours), demonstrative (this, that)\n- Show how pronouns prevent repetition\n\nStudents\' Activity:\n- Listen attentively\n- Identify pronouns in sentences\n- Practice replacing nouns with pronouns\n\nStep 3: Differentiation (7 minutes)\nTeacher\'s Activity:\n- Explain key differences between nouns and pronouns\n- Provide mixed sentences for identification\n- Demonstrate correct pronoun usage\n\nStudents\' Activity:\n- Work in pairs to identify nouns and pronouns\n- Share findings with the class\n\nStep 4: Application (10 minutes)\nTeacher\'s Activity:\n- Distribute handouts with exercises\n- Monitor student progress\n- Provide individual assistance\n\nStudents\' Activity:\n- Complete exercises independently\n- Compare answers with partners\n- Volunteer to share answers',
      evaluation: '1. Define: (a) Noun (b) Pronoun\n\n2. Identify the nouns in these sentences and state their types:\n   a) Lagos is a beautiful city.\n   b) The team won the championship.\n   c) Love is a powerful emotion.\n\n3. Replace the underlined nouns with appropriate pronouns:\n   a) Mary went to the market. Mary bought vegetables.\n   b) The book is interesting. The book is on the table.\n\n4. Write 3 sentences using different types of nouns.\n\n5. Give 5 examples of pronouns and use each in a sentence.',
      summary: 'Main Points:\n1. Nouns are naming words for persons, places, things, or ideas\n2. There are four main types of nouns: common, proper, collective, and abstract\n3. Pronouns replace nouns to avoid repetition\n4. Using pronouns makes our writing and speech more fluent and less repetitive\n\nRemember: Proper nouns always start with capital letters!',
      assignment: 'CLASSWORK:\n1. List 5 examples each of:\n   - Common nouns\n   - Proper nouns\n   - Collective nouns\n\n2. Rewrite this paragraph using pronouns where appropriate:\n   "Sarah loves reading. Sarah goes to the library every week. Sarah\'s favorite books are mystery novels."\n\nHOMEWORK:\n1. Write 10 sentences, each containing at least one noun and one pronoun. Underline the nouns once and the pronouns twice.\n\n2. Create a short story (8-10 sentences) using all four types of nouns. Identify and label each type.\n\n3. Find 5 sentences from your favorite book and identify all the nouns and pronouns in them.\n\nDUE: Next class',
      teacherReflection: '',
      hodRemarks: '',
    },
    {
      id: 'LN003',
      teacher: 'Dr. Amaka Peters',
      subject: 'Biology',
      class: 'JSS 3A',
      topic: 'Cell Structure',
      week: 4,
      submittedDate: '1 day ago',
      status: 'approved',
    },
    {
      id: 'LN004',
      teacher: 'Mr. John Adebayo',
      subject: 'Physics',
      class: 'SSS 2A',
      topic: 'Newton\'s Laws of Motion',
      week: 5,
      submittedDate: '1 day ago',
      status: 'rejected',
      rejectionComment: 'Please add more practical examples and diagrams.',
    },
  ]);

  const [syllabusProgress] = useState<SyllabusItem[]>([
    {
      subject: 'Mathematics',
      class: 'JSS 2',
      totalTopics: 40,
      completedTopics: 32,
      teacher: 'Mrs. Sarah Johnson',
    },
    {
      subject: 'English Language',
      class: 'SSS 1',
      totalTopics: 35,
      completedTopics: 28,
      teacher: 'Mr. David Okafor',
    },
    {
      subject: 'Biology',
      class: 'JSS 3',
      totalTopics: 30,
      completedTopics: 25,
      teacher: 'Dr. Amaka Peters',
    },
    {
      subject: 'Physics',
      class: 'SSS 2',
      totalTopics: 38,
      completedTopics: 20,
      teacher: 'Mr. John Adebayo',
    },
    {
      subject: 'Chemistry',
      class: 'SSS 3',
      totalTopics: 42,
      completedTopics: 38,
      teacher: 'Dr. Amaka Peters',
    },
  ]);

  const pendingCount = lessonNotes.filter((n) => n.status === 'pending').length;
  const approvedCount = lessonNotes.filter((n) => n.status === 'approved').length;
  const rejectedCount = lessonNotes.filter((n) => n.status === 'rejected').length;

  const handleApprove = () => {
    if (!selectedNote) return;

    setLessonNotes((prev) =>
      prev.map((note) => (note.id === selectedNote.id ? { ...note, status: 'approved' as const } : note))
    );
    toast.success('Lesson note approved successfully', {
      description: 'The teacher has been notified. You can now share this with students.',
    });
    setShowReviewDialog(false);
    setSelectedNote(null);
  };

  const handleReject = () => {
    if (!selectedNote) return;

    if (!rejectionComment.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    setLessonNotes((prev) =>
      prev.map((note) =>
        note.id === selectedNote.id
          ? { ...note, status: 'rejected' as const, rejectionComment }
          : note
      )
    );
    toast.error('Lesson note rejected', {
      description: 'The teacher will be notified with your feedback.',
    });
    setShowReviewDialog(false);
    setSelectedNote(null);
    setRejectionComment('');
  };

  const handleCancel = () => {
    setShowReviewDialog(false);
    setSelectedNote(null);
    setRejectionComment('');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2 text-blue-950">Curriculum & Lesson Note Management</h1>
        <p className="text-gray-600">Review lesson notes and track curriculum coverage</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-3xl text-blue-950">{pendingCount}</p>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-3xl text-blue-950">{approvedCount}</p>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-3xl text-blue-950">{rejectedCount}</p>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="review" className="space-y-6">
        <TabsList>
          <TabsTrigger value="review">Lesson Note Review</TabsTrigger>
          <TabsTrigger value="syllabus">Syllabus Tracker</TabsTrigger>
        </TabsList>

        <TabsContent value="review" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lesson Note Review Queue</CardTitle>
              <CardDescription>
                Review and approve lesson notes submitted by teachers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lessonNotes.map((note) => (
                  <div
                    key={note.id}
                    className={`p-4 border rounded-lg ${
                      note.status === 'pending'
                        ? 'border-amber-200 bg-amber-50'
                        : note.status === 'approved'
                        ? 'border-green-200 bg-green-50'
                        : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant={
                              note.status === 'pending'
                                ? 'default'
                                : note.status === 'approved'
                                ? 'secondary'
                                : 'destructive'
                            }
                          >
                            {note.status}
                          </Badge>
                          <span className="text-xs text-gray-500">{note.submittedDate}</span>
                        </div>
                        <h3 className="font-medium text-blue-950 mb-1">{note.topic}</h3>
                        <p className="text-sm text-gray-600">
                          {note.subject} • {note.class} • Week {note.week}
                        </p>
                        <p className="text-sm text-gray-600">Teacher: {note.teacher}</p>
                        {note.rejectionComment && (
                          <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded text-sm">
                            <p className="font-medium text-red-900">Rejection Reason:</p>
                            <p className="text-red-700">{note.rejectionComment}</p>
                          </div>
                        )}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedNote(note);
                          setShowReviewDialog(true);
                        }}
                        variant={note.status === 'pending' ? 'default' : 'outline'}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        {note.status === 'pending' ? 'Review' : 'View'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="syllabus" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Syllabus Coverage Tracker</CardTitle>
              <CardDescription>
                Monitor curriculum progress across all classes and subjects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {syllabusProgress.map((item, index) => {
                  const progress = (item.completedTopics / item.totalTopics) * 100;
                  return (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-medium text-blue-950">
                            {item.subject} - {item.class}
                          </h3>
                          <p className="text-sm text-gray-600">Teacher: {item.teacher}</p>
                        </div>
                        <Badge
                          variant={
                            progress >= 80
                              ? 'secondary'
                              : progress >= 50
                              ? 'default'
                              : 'destructive'
                          }
                        >
                          {Math.round(progress)}% Complete
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {item.completedTopics} of {item.totalTopics} topics covered
                          </span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Lesson Note Review Dialog - Full Template View */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="w-[95vw] max-w-5xl max-h-[90vh] p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Lesson Note Review
                </DialogTitle>
                <DialogDescription>
                  Nigerian Ministry of Education Approved Template
                </DialogDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="h-8 w-8 p-0"
              >
                <CloseIcon className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>

          {selectedNote && (
            <>
              {/* Scrollable Content */}
              <ScrollArea className="flex-1 px-6 py-4" style={{ maxHeight: 'calc(90vh - 180px)' }}>
                <div className="space-y-6 pr-4">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={selectedNote.status === 'approved' ? 'secondary' : 'default'}
                      className={
                        selectedNote.status === 'approved'
                          ? 'bg-green-500'
                          : selectedNote.status === 'pending'
                          ? 'bg-amber-500'
                          : 'bg-red-500'
                      }
                    >
                      {selectedNote.status === 'approved'
                        ? 'Approved'
                        : selectedNote.status === 'pending'
                        ? 'Pending Approval'
                        : 'Rejected'}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      Submitted: {selectedNote.submittedDate}
                    </span>
                  </div>

                  {/* Section 1: Basic Information */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-blue-950 border-b pb-2">
                      1. BASIC INFORMATION
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                      <div>
                        <Label className="text-gray-600">Subject</Label>
                        <p className="font-medium">{selectedNote.subject}</p>
                      </div>
                      <div>
                        <Label className="text-gray-600">Class</Label>
                        <p className="font-medium">{selectedNote.class}</p>
                      </div>
                      <div>
                        <Label className="text-gray-600">Term</Label>
                        <p className="font-medium">{selectedNote.term || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-gray-600">Week</Label>
                        <p className="font-medium">Week {selectedNote.week}</p>
                      </div>
                      <div>
                        <Label className="text-gray-600">Period</Label>
                        <p className="font-medium">{selectedNote.period || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-gray-600">Duration</Label>
                        <p className="font-medium">{selectedNote.duration || 'N/A'}</p>
                      </div>
                      <div className="col-span-2">
                        <Label className="text-gray-600">Teacher</Label>
                        <p className="font-medium">{selectedNote.teacher}</p>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Topic Information */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-blue-950 border-b pb-2">
                      2. TOPIC INFORMATION
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-gray-600">Main Topic</Label>
                        <p className="mt-1 font-medium text-blue-950">{selectedNote.topic}</p>
                      </div>
                      {selectedNote.subTopic && (
                        <div>
                          <Label className="text-gray-600">Sub-Topic</Label>
                          <p className="mt-1">{selectedNote.subTopic}</p>
                        </div>
                      )}
                      {selectedNote.previousKnowledge && (
                        <div>
                          <Label className="text-gray-600">Previous Knowledge</Label>
                          <p className="mt-1 whitespace-pre-line">{selectedNote.previousKnowledge}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section 3: Learning Objectives */}
                  {(selectedNote.learningObjectivesCognitive ||
                    selectedNote.learningObjectivesAffective ||
                    selectedNote.learningObjectivesPsychomotor) && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-blue-950 border-b pb-2">
                        3. LEARNING OBJECTIVES
                      </h3>
                      <div className="space-y-3">
                        {selectedNote.learningObjectivesCognitive && (
                          <div className="bg-blue-50 p-3 rounded">
                            <Label className="text-blue-900 font-medium">
                              Cognitive Domain (Knowledge & Understanding)
                            </Label>
                            <p className="mt-1 whitespace-pre-line text-sm">
                              {selectedNote.learningObjectivesCognitive}
                            </p>
                          </div>
                        )}
                        {selectedNote.learningObjectivesAffective && (
                          <div className="bg-purple-50 p-3 rounded">
                            <Label className="text-purple-900 font-medium">
                              Affective Domain (Attitudes & Values)
                            </Label>
                            <p className="mt-1 whitespace-pre-line text-sm">
                              {selectedNote.learningObjectivesAffective}
                            </p>
                          </div>
                        )}
                        {selectedNote.learningObjectivesPsychomotor && (
                          <div className="bg-green-50 p-3 rounded">
                            <Label className="text-green-900 font-medium">
                              Psychomotor Domain (Skills)
                            </Label>
                            <p className="mt-1 whitespace-pre-line text-sm">
                              {selectedNote.learningObjectivesPsychomotor}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Section 4: Instructional Materials */}
                  {selectedNote.instructionalMaterials && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-blue-950 border-b pb-2">
                        4. INSTRUCTIONAL MATERIALS/RESOURCES
                      </h3>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="whitespace-pre-line">{selectedNote.instructionalMaterials}</p>
                      </div>
                    </div>
                  )}

                  {/* Section 5: Lesson Development */}
                  {(selectedNote.setInduction ||
                    selectedNote.presentation ||
                    selectedNote.evaluation ||
                    selectedNote.summary) && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-blue-950 border-b pb-2">
                        5. LESSON DEVELOPMENT
                      </h3>
                      <div className="space-y-4">
                        {selectedNote.setInduction && (
                          <div>
                            <Label className="text-gray-700 font-medium">
                              A. Set Induction/Introduction
                            </Label>
                            <div className="mt-1 bg-amber-50 p-3 rounded border border-amber-200">
                              <p className="whitespace-pre-line text-sm">{selectedNote.setInduction}</p>
                            </div>
                          </div>
                        )}
                        {selectedNote.presentation && (
                          <div>
                            <Label className="text-gray-700 font-medium">
                              B. Lesson Content
                            </Label>
                            <div className="mt-1 bg-blue-50 p-3 rounded border border-blue-200">
                              <p className="whitespace-pre-line text-sm">{selectedNote.presentation}</p>
                            </div>
                          </div>
                        )}
                        {selectedNote.evaluation && (
                          <div>
                            <Label className="text-gray-700 font-medium">
                              C. Evaluation/Assessment
                            </Label>
                            <div className="mt-1 bg-purple-50 p-3 rounded border border-purple-200">
                              <p className="whitespace-pre-line text-sm">{selectedNote.evaluation}</p>
                            </div>
                          </div>
                        )}
                        {selectedNote.summary && (
                          <div>
                            <Label className="text-gray-700 font-medium">
                              D. Summary/Conclusion
                            </Label>
                            <div className="mt-1 bg-green-50 p-3 rounded border border-green-200">
                              <p className="whitespace-pre-line text-sm">{selectedNote.summary}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Section 6: Assignment */}
                  {selectedNote.assignment && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-blue-950 border-b pb-2">
                        6. ASSIGNMENT/HOME WORK
                      </h3>
                      <div className="bg-orange-50 p-3 rounded border border-orange-200">
                        <p className="whitespace-pre-line">{selectedNote.assignment}</p>
                      </div>
                    </div>
                  )}

                  {/* Section 7: Teacher's Reflection */}
                  {selectedNote.teacherReflection && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-blue-950 border-b pb-2">
                        7. TEACHER'S REFLECTION
                      </h3>
                      <div className="bg-indigo-50 p-3 rounded border border-indigo-200">
                        <p className="whitespace-pre-line">{selectedNote.teacherReflection}</p>
                      </div>
                    </div>
                  )}

                  {/* Rejection Comment Input (for pending items) */}
                  {selectedNote.status === 'pending' && (
                    <div className="space-y-3 border-t pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="rejectionComment" className="text-gray-700 font-medium">
                          Rejection Comment (Optional - only if rejecting)
                        </Label>
                        <Textarea
                          id="rejectionComment"
                          value={rejectionComment}
                          onChange={(e) => setRejectionComment(e.target.value)}
                          placeholder="Provide detailed feedback for the teacher if rejecting this lesson note..."
                          rows={4}
                          className="resize-none"
                        />
                        <p className="text-xs text-gray-500">
                          This comment will be sent to the teacher if you reject the lesson note
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Previous Rejection Comment (if rejected) */}
                  {selectedNote.status === 'rejected' && selectedNote.rejectionComment && (
                    <div className="space-y-3 border-t pt-4">
                      <div className="bg-red-50 p-4 rounded border border-red-200">
                        <Label className="text-red-900 font-medium">Rejection Reason:</Label>
                        <p className="mt-2 text-red-700">{selectedNote.rejectionComment}</p>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Action Buttons - Fixed at Bottom */}
              <div className="px-6 py-4 border-t bg-gray-50">
                <div className="flex items-center justify-end gap-3">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  {selectedNote.status === 'pending' && (
                    <>
                      <Button variant="destructive" onClick={handleReject}>
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                      <Button onClick={handleApprove}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};