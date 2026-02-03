import React, { useState } from 'react';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowLeft,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { toast } from 'sonner';

interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  instructions: string;
  maxScore: number;
  attachments?: string[];
}

interface AssignmentSubmissionProps {
  onNavigate?: (page: string) => void;
}

export const AssignmentSubmission: React.FC<AssignmentSubmissionProps> = ({ onNavigate }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNavigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  // Mock assignment data (would come from props or route params in real app)
  const assignment: Assignment = {
    id: '1',
    title: 'Essay: "The Impact of Technology on Education"',
    subject: 'English Language',
    dueDate: 'Tomorrow, 5:00 PM',
    instructions: 'Write a comprehensive essay discussing how technology has transformed modern education. Your essay should be 500-700 words and include examples from your own learning experience. Address both positive impacts and potential challenges.',
    maxScore: 100,
    attachments: ['Essay Guidelines.pdf', 'Grading Rubric.pdf'],
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
      toast.success('File attached successfully');
    }
  };

  const handleSubmit = () => {
    if (!submissionText && !selectedFile) {
      toast.error('Please provide a submission text or attach a file');
      return;
    }

    setIsSubmitting(true);

    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Assignment submitted successfully!');
      // Navigate back to assignments page
      setTimeout(() => {
        handleNavigate('/assignments');
      }, 1500);
    }, 2000);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleNavigate('/assignments')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl text-blue-950">Submit Assignment</h1>
          <p className="text-sm sm:text-base text-gray-600">{assignment.subject}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column - Assignment Details */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assignment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-600">Title</Label>
                <p className="font-medium mt-1">{assignment.title}</p>
              </div>

              <div>
                <Label className="text-gray-600">Subject</Label>
                <p className="font-medium mt-1">{assignment.subject}</p>
              </div>

              <div>
                <Label className="text-gray-600">Due Date</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <p className="font-medium text-amber-700">{assignment.dueDate}</p>
                </div>
              </div>

              <div>
                <Label className="text-gray-600">Maximum Score</Label>
                <p className="font-medium mt-1">{assignment.maxScore} points</p>
              </div>

              {assignment.attachments && assignment.attachments.length > 0 && (
                <div>
                  <Label className="text-gray-600 mb-2 block">Teacher's Attachments</Label>
                  <div className="space-y-2">
                    {assignment.attachments.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2 rounded border border-gray-200 bg-gray-50"
                      >
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="text-sm flex-1">{file}</span>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-sm">Submission Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-blue-900 space-y-2">
                <li>• Submit before the due date</li>
                <li>• Maximum file size: 10MB</li>
                <li>• Accepted formats: PDF, DOC, DOCX, TXT</li>
                <li>• You can resubmit before the deadline</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Submission Form */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-line">{assignment.instructions}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Submission</CardTitle>
              <CardDescription>Type your answer or upload a file</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Text Submission */}
              <div>
                <Label htmlFor="submission-text">Written Answer (Optional)</Label>
                <Textarea
                  id="submission-text"
                  placeholder="Type your answer here..."
                  rows={10}
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {submissionText.split(/\s+/).filter(Boolean).length} words
                </p>
              </div>

              {/* File Upload */}
              <div>
                <Label htmlFor="file-upload">Upload File (Optional)</Label>
                <div className="mt-2">
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex items-center justify-center gap-2 p-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <Upload className="w-6 h-6 text-gray-400" />
                    <div className="text-center">
                      <p className="font-medium text-gray-700">Click to upload file</p>
                      <p className="text-xs text-gray-500">PDF, DOC, DOCX, TXT (Max 10MB)</p>
                    </div>
                  </label>

                  {selectedFile && (
                    <div className="mt-3 flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-900">{selectedFile.name}</p>
                        <p className="text-xs text-green-700">
                          {(selectedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedFile(null)}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={handleSubmit}
                  disabled={isSubmitting || (!submissionText && !selectedFile)}
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Submit Assignment
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleNavigate('/assignments')}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>

              {!submissionText && !selectedFile && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <p className="text-sm text-amber-800">
                    Please provide either a written answer or upload a file to submit.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};