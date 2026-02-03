import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Clock, UserCheck, UserX, Mail, Phone, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types';

export const PendingApprovals = () => {
  const { pendingUsers, approveUser, rejectUser, user: currentUser } = useAuth();
  const [approvingUser, setApprovingUser] = useState<User | null>(null);
  const [rejectingUser, setRejectingUser] = useState<User | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Only show to Principal and Proprietor
  if (currentUser?.role !== 'principal' && currentUser?.role !== 'proprietor') {
    return null;
  }

  const handleApprove = () => {
    if (approvingUser) {
      approveUser(approvingUser.id);
      setApprovingUser(null);
    }
  };

  const handleReject = () => {
    if (rejectingUser && rejectionReason.trim()) {
      rejectUser(rejectingUser.id, rejectionReason);
      setRejectingUser(null);
      setRejectionReason('');
    }
  };

  const pendingStudents = pendingUsers.filter(u => u.role === 'student');
  const pendingStaff = pendingUsers.filter(u => ['teacher', 'hr', 'bursar', 'principal', 'proprietor'].includes(u.role));
  const pendingParents = pendingUsers.filter(u => u.role === 'parent');

  const totalPending = pendingUsers.length;

  if (totalPending === 0) {
    return (
      <Alert className="border-blue-200 bg-blue-50">
        <CheckCircle2 className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          No pending approvals at this time. All user registrations are up to date.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Alert */}
      <Alert className="border-amber-200 bg-amber-50">
        <Clock className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <strong>{totalPending}</strong> user{totalPending !== 1 ? 's' : ''} pending approval
          {pendingStudents.length > 0 && ` (${pendingStudents.length} student${pendingStudents.length !== 1 ? 's' : ''})`}
          {pendingStaff.length > 0 && ` (${pendingStaff.length} staff member${pendingStaff.length !== 1 ? 's' : ''})`}
          {pendingParents.length > 0 && ` (${pendingParents.length} parent${pendingParents.length !== 1 ? 's' : ''})`}
        </AlertDescription>
      </Alert>

      {/* Pending Students */}
      {pendingStudents.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200">
              {pendingStudents.length}
            </Badge>
            Pending Student Approvals
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {pendingStudents.map(student => (
              <Card key={student.id} className="border-amber-200">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-lg">
                      {student.name.charAt(0)}
                    </div>
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                      <Clock className="w-3 h-3 mr-1" />
                      Pending
                    </Badge>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{student.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">{student.email}</p>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    {student.class && (
                      <div className="flex justify-between">
                        <span>Class:</span>
                        <span className="font-medium">{student.class}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Role:</span>
                      <span className="font-medium capitalize">{student.role}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white" 
                      size="sm"
                      onClick={() => setApprovingUser(student)}
                    >
                      <UserCheck className="mr-1 h-4 w-4" />
                      Approve
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex-1 border-red-300 text-red-600 hover:bg-red-50" 
                      size="sm"
                      onClick={() => setRejectingUser(student)}
                    >
                      <UserX className="mr-1 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Pending Staff */}
      {pendingStaff.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200">
              {pendingStaff.length}
            </Badge>
            Pending Staff Approvals
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {pendingStaff.map(staff => (
              <Card key={staff.id} className="border-amber-200">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-lg">
                      {staff.name.charAt(0)}
                    </div>
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                      <Clock className="w-3 h-3 mr-1" />
                      Pending
                    </Badge>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{staff.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">{staff.email}</p>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex justify-between">
                      <span>Role:</span>
                      <span className="font-medium capitalize">{staff.role}</span>
                    </div>
                    {staff.department && (
                      <div className="flex justify-between">
                        <span>Department:</span>
                        <span className="font-medium">{staff.department}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white" 
                      size="sm"
                      onClick={() => setApprovingUser(staff)}
                    >
                      <UserCheck className="mr-1 h-4 w-4" />
                      Approve
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex-1 border-red-300 text-red-600 hover:bg-red-50" 
                      size="sm"
                      onClick={() => setRejectingUser(staff)}
                    >
                      <UserX className="mr-1 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Pending Parents */}
      {pendingParents.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200">
              {pendingParents.length}
            </Badge>
            Pending Parent Approvals
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {pendingParents.map(parent => (
              <Card key={parent.id} className="border-amber-200">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-lg">
                      {parent.name.charAt(0)}
                    </div>
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                      <Clock className="w-3 h-3 mr-1" />
                      Pending
                    </Badge>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{parent.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">{parent.email}</p>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex justify-between">
                      <span>Role:</span>
                      <span className="font-medium capitalize">{parent.role}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white" 
                      size="sm"
                      onClick={() => setApprovingUser(parent)}
                    >
                      <UserCheck className="mr-1 h-4 w-4" />
                      Approve
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex-1 border-red-300 text-red-600 hover:bg-red-50" 
                      size="sm"
                      onClick={() => setRejectingUser(parent)}
                    >
                      <UserX className="mr-1 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Approval Confirmation Dialog */}
      <Dialog open={!!approvingUser} onOpenChange={(open) => !open && setApprovingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Approve User Account
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this user's account? They will gain immediate access to the system.
            </DialogDescription>
          </DialogHeader>
          
          {approvingUser && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div>
                <span className="text-sm text-gray-500">Name:</span>
                <p className="font-medium">{approvingUser.name}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Email:</span>
                <p className="font-medium">{approvingUser.email}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Role:</span>
                <p className="font-medium capitalize">{approvingUser.role}</p>
              </div>
              {approvingUser.department && (
                <div>
                  <span className="text-sm text-gray-500">Department:</span>
                  <p className="font-medium">{approvingUser.department}</p>
                </div>
              )}
              {approvingUser.class && (
                <div>
                  <span className="text-sm text-gray-500">Class:</span>
                  <p className="font-medium">{approvingUser.class}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setApprovingUser(null)}>
              Cancel
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={handleApprove}
            >
              <UserCheck className="mr-2 h-4 w-4" />
              Approve Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={!!rejectingUser} onOpenChange={(open) => {
        if (!open) {
          setRejectingUser(null);
          setRejectionReason('');
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              Reject User Account
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this user's account. They will be notified of the rejection.
            </DialogDescription>
          </DialogHeader>
          
          {rejectingUser && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div>
                  <span className="text-sm text-gray-500">Name:</span>
                  <p className="font-medium">{rejectingUser.name}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Email:</span>
                  <p className="font-medium">{rejectingUser.email}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rejection-reason">Reason for Rejection *</Label>
                <Textarea
                  id="rejection-reason"
                  placeholder="Please explain why this account is being rejected..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setRejectingUser(null);
              setRejectionReason('');
            }}>
              Cancel
            </Button>
            <Button 
              className="bg-red-600 hover:bg-red-700"
              onClick={handleReject}
              disabled={!rejectionReason.trim()}
            >
              <UserX className="mr-2 h-4 w-4" />
              Reject Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
