import React, { useState } from 'react';
import {
  UserPlus,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Input } from '../ui/input';
import { useParent } from '../../../contexts/ParentContext';
import { toast } from 'sonner';

interface AdmissionStatus {
  candidateName: string;
  examDate: string;
  status: 'pending' | 'completed' | 'admitted';
  score?: number;
}

export const AdmissionEnrollment: React.FC = () => {
  const parentContext = useParent();
  const selectedChild = parentContext?.selectedChild;
  const [newChildName, setNewChildName] = useState('');

  const [pendingAdmissions] = useState<AdmissionStatus[]>([
    {
      candidateName: 'Kehinde Adebayo',
      examDate: 'Jan 10, 2026',
      status: 'pending',
    },
  ]);

  const handleStartEnrollment = () => {
    if (!newChildName.trim()) {
      toast.error('Please enter the child\'s name');
      return;
    }
    toast.success('Enrollment form started! Redirecting...');
    setNewChildName('');
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl mb-2 text-blue-950">Admission & Enrollment</h1>
        <p className="text-sm sm:text-base text-gray-600">
          Enroll new siblings or check entrance exam status
        </p>
      </div>

      {/* New Sibling Enrollment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Enroll a New Sibling
          </CardTitle>
          <CardDescription>
            Pre-fill family details for faster enrollment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-blue-200 bg-blue-50">
            <AlertDescription className="text-blue-800">
              <strong>Save Time:</strong> Your family contact details (address, phone, email) will be
              automatically pre-filled. You only need to enter the new child's personal information.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-2 block">Child's Full Name:</label>
              <Input
                placeholder="e.g., Kehinde Adebayo"
                value={newChildName}
                onChange={(e) => setNewChildName(e.target.value)}
              />
            </div>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={handleStartEnrollment}
            >
              <FileText className="w-4 h-4 mr-2" />
              Start Enrollment Form
            </Button>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold mb-2 text-sm">Pre-filled Information:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-600">Parent Name:</p>
                <p className="font-medium">Mr. & Mrs. Adebayo</p>
              </div>
              <div>
                <p className="text-gray-600">Phone:</p>
                <p className="font-medium">+234 803 123 4567</p>
              </div>
              <div>
                <p className="text-gray-600">Email:</p>
                <p className="font-medium">adebayo@email.com</p>
              </div>
              <div>
                <p className="text-gray-600">Address:</p>
                <p className="font-medium">Lagos, Nigeria</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Entrance Exam Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            Entrance Exam Status
          </CardTitle>
          <CardDescription>Monitor CBT entrance exam results for prospective children</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingAdmissions.length > 0 ? (
            <div className="space-y-3">
              {pendingAdmissions.map((admission, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg border border-gray-200 bg-white"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{admission.candidateName}</h4>
                      <p className="text-sm text-gray-600 mb-2">Exam Date: {admission.examDate}</p>
                      {admission.status === 'pending' && (
                        <Badge className="bg-amber-600 text-white">
                          <Clock className="w-3 h-3 mr-1" />
                          Exam Scheduled
                        </Badge>
                      )}
                      {admission.status === 'completed' && (
                        <Badge className="bg-blue-600 text-white">
                          Results Pending
                        </Badge>
                      )}
                      {admission.status === 'admitted' && (
                        <Badge className="bg-green-600 text-white">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Admitted - Score: {admission.score}%
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-600">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No pending entrance exams</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Info */}
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardHeader>
          <CardTitle className="text-purple-950">Admission Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-purple-900 space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Birth certificate or age declaration</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Previous school report card (if transferring)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>2 passport photographs</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Completion of CBT entrance examination (for JSS1 and above)</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};