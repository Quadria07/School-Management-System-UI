import React from 'react';
import { Download, Users, GraduationCap, Phone, FileText, Plus, Save, Trash2, Calendar, Edit3 } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  gender?: string;
  dateOfBirth?: string;
  parentName?: string;
  parentPhone?: string;
  previousSchool?: string;
  appliedClass: string;
  formStatus: 'paid' | 'pending';
  examStatus: 'completed' | 'scheduled' | 'not-taken';
  examScore?: number;
  examDate?: string;
  interviewStatus?: 'scheduled' | 'pending' | 'completed';
  interviewDate?: string;
  applicationDate: string;
}

interface CBTQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface CBTExam {
  id: string;
  subject: string;
  questionCount: number;
  duration: number;
  questions: CBTQuestion[];
}

// Admit Dialog
interface AdmitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicant: Applicant | null;
  onAdmit: () => void;
}

export const AdmitDialog: React.FC<AdmitDialogProps> = ({ open, onOpenChange, applicant, onAdmit }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Admit Student</DialogTitle>
          <DialogDescription>
            Generate admission letter and assign Student ID
          </DialogDescription>
        </DialogHeader>
        {applicant && (
          <div className="space-y-4 py-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-medium text-blue-950 mb-2">{applicant.name}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Application ID</p>
                  <p className="font-medium">{applicant.id}</p>
                </div>
                <div>
                  <p className="text-gray-500">CBT Score</p>
                  <p className="font-medium">{applicant.examScore}%</p>
                </div>
                <div>
                  <p className="text-gray-500">Applied Class</p>
                  <p className="font-medium">{applicant.appliedClass}</p>
                </div>
                <div>
                  <p className="text-gray-500">Contact</p>
                  <p className="font-medium">{applicant.phone}</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">This action will:</p>
              <ul className="text-sm text-gray-600 space-y-1 ml-4 list-disc">
                <li>Generate a PDF Admission Letter with digital signature</li>
                <li>Assign a unique Student ID</li>
                <li>Send admission letter to parent email: {applicant.email}</li>
                <li>Add student to the school database</li>
              </ul>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={onAdmit}>
            <Download className="w-4 h-4 mr-2" />
            Admit & Generate Letter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Details Dialog
interface DetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicant: Applicant | null;
}

export const DetailsDialog: React.FC<DetailsDialogProps> = ({ open, onOpenChange, applicant }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Applicant Full Details</DialogTitle>
          <DialogDescription>Complete information about the applicant</DialogDescription>
        </DialogHeader>
        {applicant && (
          <div className="space-y-6 py-4">
            <div>
              <h3 className="font-semibold text-blue-950 mb-3 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Full Name</p>
                  <p className="font-medium">{applicant.name}</p>
                </div>
                <div>
                  <p className="text-gray-500">Application ID</p>
                  <p className="font-medium">{applicant.id}</p>
                </div>
                <div>
                  <p className="text-gray-500">Date of Birth</p>
                  <p className="font-medium">{applicant.dateOfBirth || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Gender</p>
                  <p className="font-medium">{applicant.gender || 'N/A'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500">Address</p>
                  <p className="font-medium">{applicant.address || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-blue-950 mb-3 flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Contact Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium">{applicant.email}</p>
                </div>
                <div>
                  <p className="text-gray-500">Phone</p>
                  <p className="font-medium">{applicant.phone}</p>
                </div>
                <div>
                  <p className="text-gray-500">Parent/Guardian Name</p>
                  <p className="font-medium">{applicant.parentName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Parent Phone</p>
                  <p className="font-medium">{applicant.parentPhone || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-blue-950 mb-3 flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Academic Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Applied Class</p>
                  <p className="font-medium">{applicant.appliedClass}</p>
                </div>
                <div>
                  <p className="text-gray-500">Previous School</p>
                  <p className="font-medium">{applicant.previousSchool || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-blue-950 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Application Status
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Application Date</p>
                  <p className="font-medium">{applicant.applicationDate}</p>
                </div>
                <div>
                  <p className="text-gray-500">Form Payment Status</p>
                  <Badge variant={applicant.formStatus === 'paid' ? 'default' : 'secondary'}>
                    {applicant.formStatus === 'paid' ? 'Paid' : 'Pending'}
                  </Badge>
                </div>
                <div>
                  <p className="text-gray-500">Exam Status</p>
                  <p className="font-medium capitalize">{applicant.examStatus}</p>
                </div>
                {applicant.examScore && (
                  <div>
                    <p className="text-gray-500">CBT Score</p>
                    <p className="font-medium">{applicant.examScore}%</p>
                  </div>
                )}
                {applicant.examDate && (
                  <div>
                    <p className="text-gray-500">Exam Date</p>
                    <p className="font-medium">{applicant.examDate}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-500">Interview Status</p>
                  <p className="font-medium capitalize">{applicant.interviewStatus || 'Pending'}</p>
                </div>
                {applicant.interviewDate && (
                  <div>
                    <p className="text-gray-500">Interview Date</p>
                    <p className="font-medium">{applicant.interviewDate}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Create Exam Dialog
interface CreateExamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subject: string;
  duration: string;
  onSubjectChange: (value: string) => void;
  onDurationChange: (value: string) => void;
  onNext: () => void;
}

export const CreateExamDialog: React.FC<CreateExamDialogProps> = ({
  open,
  onOpenChange,
  subject,
  duration,
  onSubjectChange,
  onDurationChange,
  onNext,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New CBT Exam</DialogTitle>
          <DialogDescription>Configure the basic exam settings</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Select value={subject} onValueChange={onSubjectChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="English Language">English Language</SelectItem>
                <SelectItem value="General Paper">General Paper</SelectItem>
                <SelectItem value="Basic Science">Basic Science</SelectItem>
                <SelectItem value="Verbal Reasoning">Verbal Reasoning</SelectItem>
                <SelectItem value="Quantitative Reasoning">Quantitative Reasoning</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => onDurationChange(e.target.value)}
              placeholder="45"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onNext}>Next: Add Questions</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Exam Setup Dialog (Add Questions)
interface ExamSetupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subject: string;
  questions: CBTQuestion[];
  onAddQuestion: () => void;
  onUpdateQuestion: (index: number, field: string, value: any) => void;
  onUpdateOption: (qIndex: number, optIndex: number, value: string) => void;
  onDeleteQuestion: (index: number) => void;
  onSave: () => void;
}

export const ExamSetupDialog: React.FC<ExamSetupDialogProps> = ({
  open,
  onOpenChange,
  subject,
  questions,
  onAddQuestion,
  onUpdateQuestion,
  onUpdateOption,
  onDeleteQuestion,
  onSave,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Exam Questions - {subject}</DialogTitle>
          <DialogDescription>
            Create multiple-choice questions with 4 options each
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {questions.map((question, qIndex) => (
            <div key={question.id} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <Label>Question {qIndex + 1}</Label>
                {questions.length > 1 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDeleteQuestion(qIndex)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <Textarea
                placeholder="Enter question..."
                value={question.question}
                onChange={(e) => onUpdateQuestion(qIndex, 'question', e.target.value)}
                rows={2}
              />
              <div className="space-y-2">
                <Label>Options (select correct answer)</Label>
                {question.options.map((option, optIndex) => (
                  <div key={optIndex} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`correct-${qIndex}`}
                      checked={question.correctAnswer === optIndex}
                      onChange={() => onUpdateQuestion(qIndex, 'correctAnswer', optIndex)}
                      className="w-4 h-4"
                    />
                    <Input
                      placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                      value={option}
                      onChange={(e) => onUpdateOption(qIndex, optIndex, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={onAddQuestion} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Another Question
          </Button>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Exam
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Edit Exam Dialog
interface EditExamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exam: CBTExam | null;
  questions: CBTQuestion[];
  onAddQuestion: () => void;
  onUpdateQuestion: (index: number, field: string, value: any) => void;
  onUpdateOption: (qIndex: number, optIndex: number, value: string) => void;
  onDeleteQuestion: (index: number) => void;
  onUpdate: () => void;
}

export const EditExamDialog: React.FC<EditExamDialogProps> = ({
  open,
  onOpenChange,
  exam,
  questions,
  onAddQuestion,
  onUpdateQuestion,
  onUpdateOption,
  onDeleteQuestion,
  onUpdate,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Exam - {exam?.subject}</DialogTitle>
          <DialogDescription>
            Update questions and answers for this exam
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {questions.map((question, qIndex) => (
            <div key={question.id} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <Label>Question {qIndex + 1}</Label>
                {questions.length > 1 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDeleteQuestion(qIndex)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <Textarea
                placeholder="Enter question..."
                value={question.question}
                onChange={(e) => onUpdateQuestion(qIndex, 'question', e.target.value)}
                rows={2}
              />
              <div className="space-y-2">
                <Label>Options (select correct answer)</Label>
                {question.options.map((option, optIndex) => (
                  <div key={optIndex} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`correct-${qIndex}`}
                      checked={question.correctAnswer === optIndex}
                      onChange={() => onUpdateQuestion(qIndex, 'correctAnswer', optIndex)}
                      className="w-4 h-4"
                    />
                    <Input
                      placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                      value={option}
                      onChange={(e) => onUpdateOption(qIndex, optIndex, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={onAddQuestion} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Another Question
          </Button>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onUpdate}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Schedule Interview Dialog
interface ScheduleInterviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicants: Applicant[];
  selectedApplicant: Applicant | null;
  onApplicantChange: (id: string) => void;
  interviewDate: string;
  interviewTime: string;
  interviewNotes: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onSchedule: () => void;
}

export const ScheduleInterviewDialog: React.FC<ScheduleInterviewDialogProps> = ({
  open,
  onOpenChange,
  applicants,
  selectedApplicant,
  onApplicantChange,
  interviewDate,
  interviewTime,
  interviewNotes,
  onDateChange,
  onTimeChange,
  onNotesChange,
  onSchedule,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Schedule Interview</DialogTitle>
          <DialogDescription>
            Set interview date and time for {selectedApplicant?.name}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="applicant-select">Select Applicant</Label>
            <Select
              value={selectedApplicant?.id || ''}
              onValueChange={onApplicantChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select applicant" />
              </SelectTrigger>
              <SelectContent>
                {applicants
                  .filter(
                    (a) => a.examStatus === 'completed' && a.interviewStatus !== 'completed'
                  )
                  .map((applicant) => (
                    <SelectItem key={applicant.id} value={applicant.id}>
                      {applicant.name} - {applicant.id}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="interview-date">Interview Date</Label>
            <Input
              id="interview-date"
              type="date"
              value={interviewDate}
              onChange={(e) => onDateChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="interview-time">Interview Time</Label>
            <Input
              id="interview-time"
              type="time"
              value={interviewTime}
              onChange={(e) => onTimeChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="interview-notes">Notes (Optional)</Label>
            <Textarea
              id="interview-notes"
              placeholder="Add any special notes or instructions..."
              value={interviewNotes}
              onChange={(e) => onNotesChange(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSchedule}>
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Interview
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};