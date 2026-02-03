import React, { useState } from 'react';
import {
  ClipboardCheck,
  Upload,
  CheckCircle2,
  Clock,
  FileText,
  MessageSquare,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { toast } from 'sonner';

interface Assignment {
  id: string;
  title: string;
  subject: string;
  teacher: string;
  description: string;
  dueDate: string;
  maxScore: number;
  status: 'new' | 'submitted' | 'graded';
  score?: number;
  feedback?: string;
  submittedDate?: string;
}

export const AssignmentsHub: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'new' | 'submitted' | 'graded'>('new');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [submissionText, setSubmissionText] = useState('');

  const [assignments] = useState<Assignment[]>([
    {
      id: '1',
      title: 'Essay: The Impact of Technology on Education',
      subject: 'English Language',
      teacher: 'Mrs. Okonkwo',
      description:
        'Write a comprehensive essay (500-700 words) discussing how technology has transformed modern education. Include examples and personal observations.',
      dueDate: 'Tomorrow, 5:00 PM',
      maxScore: 20,
      status: 'new',
    },
    {
      id: '2',
      title: 'Chapter 5 Review Questions',
      subject: 'Biology',
      teacher: 'Dr. Ibrahim',
      description: 'Answer all questions from Chapter 5 (Questions 1-15) in your textbook.',
      dueDate: 'Thursday, 3:00 PM',
      maxScore: 15,
      status: 'submitted',
      submittedDate: 'Yesterday, 2:30 PM',
    },
    {
      id: '3',
      title: 'Quadratic Equations Practice Set',
      subject: 'Mathematics',
      teacher: 'Mr. Adeyemi',
      description:
        'Solve all 20 problems on quadratic equations. Show all working clearly.',
      dueDate: 'Dec 20, 2025',
      maxScore: 20,
      status: 'graded',
      score: 18,
      feedback:
        'Excellent work! You demonstrated a strong understanding of the quadratic formula. Minor error in question 15.',
      submittedDate: 'Dec 18, 2025',
    },
    {
      id: '4',
      title: 'Physics Lab Report - Motion and Forces',
      subject: 'Physics',
      teacher: 'Mr. Balogun',
      description:
        'Submit a detailed lab report on the motion and forces experiment conducted last week.',
      dueDate: 'Next Monday',
      maxScore: 25,
      status: 'new',
    },
  ]);

  const filteredAssignments = assignments.filter((a) => a.status === selectedTab);

  const handleSubmit = () => {
    if (!submissionText.trim()) {
      toast.error('Please enter your submission');
      return;
    }
    toast.success('Assignment submitted successfully!');
    setShowSubmitDialog(false);
    setSubmissionText('');
    setSelectedAssignment(null);
  };

  const getStatusBadge = (status: string) => {
    if (status === 'new')
      return (
        <Badge className="bg-blue-600 text-white">
          <Clock className="w-3 h-3 mr-1" />
          New
        </Badge>
      );
    if (status === 'submitted')
      return (
        <Badge className="bg-amber-600 text-white">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Submitted
        </Badge>
      );
    return (
      <Badge className="bg-green-600 text-white">
        <CheckCircle2 className="w-3 h-3 mr-1" />
        Graded
      </Badge>
    );
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl mb-2 text-blue-950">Homework & Assignments</h1>
        <p className="text-sm sm:text-base text-gray-600">
          Manage and submit your assignments
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <Button
          variant="ghost"
          className={`rounded-none ${
            selectedTab === 'new' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
          }`}
          onClick={() => setSelectedTab('new')}
        >
          New ({assignments.filter((a) => a.status === 'new').length})
        </Button>
        <Button
          variant="ghost"
          className={`rounded-none ${
            selectedTab === 'submitted'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600'
          }`}
          onClick={() => setSelectedTab('submitted')}
        >
          Submitted ({assignments.filter((a) => a.status === 'submitted').length})
        </Button>
        <Button
          variant="ghost"
          className={`rounded-none ${
            selectedTab === 'graded'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600'
          }`}
          onClick={() => setSelectedTab('graded')}
        >
          Graded ({assignments.filter((a) => a.status === 'graded').length})
        </Button>
      </div>

      {/* Assignments List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredAssignments.map((assignment) => (
          <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusBadge(assignment.status)}
                    <Badge variant="outline">{assignment.subject}</Badge>
                  </div>
                  <CardTitle className="text-lg">{assignment.title}</CardTitle>
                  <CardDescription>{assignment.teacher}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-700">{assignment.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Due: {assignment.dueDate}
                </span>
                <span className="text-gray-600">Max: {assignment.maxScore} points</span>
              </div>

              {assignment.status === 'graded' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-green-900">Your Score:</span>
                    <span className="text-xl font-bold text-green-700">
                      {assignment.score}/{assignment.maxScore}
                    </span>
                  </div>
                  {assignment.feedback && (
                    <div className="mt-2">
                      <p className="text-xs font-medium text-green-900 mb-1 flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        Teacher's Feedback:
                      </p>
                      <p className="text-xs text-green-800">{assignment.feedback}</p>
                    </div>
                  )}
                </div>
              )}

              {assignment.status === 'submitted' && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-sm text-amber-800">
                    <CheckCircle2 className="w-4 h-4 inline mr-1" />
                    Submitted on {assignment.submittedDate} • Awaiting grading
                  </p>
                </div>
              )}

              {assignment.status === 'new' && (
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    setSelectedAssignment(assignment);
                    setShowSubmitDialog(true);
                  }}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Submit Assignment
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAssignments.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <ClipboardCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No {selectedTab} assignments
            </h3>
            <p className="text-gray-600">
              {selectedTab === 'new' && "You're all caught up! No new assignments at the moment."}
              {selectedTab === 'submitted' && 'You haven\'t submitted any assignments yet.'}
              {selectedTab === 'graded' && 'No graded assignments to display.'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Submit Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedAssignment?.title}</DialogTitle>
            <DialogDescription>
              {selectedAssignment?.subject} • Due: {selectedAssignment?.dueDate}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">{selectedAssignment?.description}</p>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Your Submission:</label>
              <Textarea
                placeholder="Type your answer here or describe what you're uploading..."
                rows={8}
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">Upload supporting files (optional)</p>
              <p className="text-xs text-gray-500">PDF, Images, or Documents</p>
              <Button variant="outline" size="sm" className="mt-2">
                Choose Files
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSubmit}>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Submit Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
