import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Plus,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { toast } from 'sonner';

interface LeaveRequest {
  id: string;
  staffName: string;
  employeeId: string;
  leaveType: 'Annual' | 'Sick' | 'Maternity' | 'Emergency';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedDate: string;
}

export const LeaveManagement: React.FC = () => {
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  
  // New Application State
  const [newApplication, setNewApplication] = useState({
    staffName: '',
    employeeId: '',
    leaveType: 'Annual',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: '1',
      staffName: 'Mr. Balogun Peter',
      employeeId: 'BFOIA/TCH/005',
      leaveType: 'Sick',
      startDate: '2026-01-02',
      endDate: '2026-01-04',
      days: 3,
      reason: 'Medical treatment for malaria',
      status: 'Pending',
      appliedDate: '2025-12-30',
    },
    {
      id: '2',
      staffName: 'Mrs. Adeleke Joy',
      employeeId: 'BFOIA/TCH/006',
      leaveType: 'Maternity',
      startDate: '2026-02-01',
      endDate: '2026-04-30',
      days: 90,
      reason: 'Maternity leave',
      status: 'Pending',
      appliedDate: '2025-12-28',
    },
    {
      id: '3',
      staffName: 'Mr. Johnson Peter',
      employeeId: 'BFOIA/SEC/001',
      leaveType: 'Annual',
      startDate: '2025-12-20',
      endDate: '2025-12-27',
      days: 7,
      reason: 'Annual vacation',
      status: 'Approved',
      appliedDate: '2025-12-10',
    },
  ]);

  const handleApprove = () => {
    if (selectedRequest) {
      setLeaveRequests(prev => prev.map(req => 
        req.id === selectedRequest.id ? { ...req, status: 'Approved' } : req
      ));
      toast.success(`Leave request approved for ${selectedRequest.staffName}`);
      setShowApprovalDialog(false);
    }
  };

  const handleReject = () => {
    if (selectedRequest) {
      setLeaveRequests(prev => prev.map(req => 
        req.id === selectedRequest.id ? { ...req, status: 'Rejected' } : req
      ));
      toast.error(`Leave request rejected for ${selectedRequest.staffName}`);
      setShowApprovalDialog(false);
    }
  };

  const handleSubmitApplication = () => {
    if (!newApplication.staffName || !newApplication.startDate || !newApplication.endDate) {
       toast.error("Please fill in all required fields");
       return;
    }

    // Calculate days diff (rough estimate)
    const start = new Date(newApplication.startDate);
    const end = new Date(newApplication.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 

    const newRequest: LeaveRequest = {
       id: Math.random().toString(36).substr(2, 9),
       staffName: newApplication.staffName,
       employeeId: newApplication.employeeId || 'BFOIA/UNK/000',
       leaveType: newApplication.leaveType as any,
       startDate: newApplication.startDate,
       endDate: newApplication.endDate,
       days: diffDays,
       reason: newApplication.reason,
       status: 'Pending',
       appliedDate: new Date().toISOString().split('T')[0]
    };

    setLeaveRequests([newRequest, ...leaveRequests]);
    toast.success("Leave application submitted successfully");
    setShowApplyDialog(false);
    setNewApplication({
      staffName: '',
      employeeId: '',
      leaveType: 'Annual',
      startDate: '',
      endDate: '',
      reason: ''
    });
  };

  const pendingCount = leaveRequests.filter((r) => r.status === 'Pending').length;
  const approvedCount = leaveRequests.filter((r) => r.status === 'Approved').length;

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl mb-2 text-blue-950">Leave & Absence Management</h1>
          <p className="text-sm sm:text-base text-gray-600">Track, approve, and manage staff time-off requests.</p>
        </div>
        <Button onClick={() => setShowApplyDialog(true)} className="bg-blue-600 hover:bg-blue-700">
           <Plus className="w-4 h-4 mr-2" />
           New Leave Request
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardDescription className="text-amber-700 font-medium">Pending Requests</CardDescription>
            <CardTitle className="text-3xl text-amber-950">{pendingCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-amber-700 font-medium">Requires attention</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardDescription className="text-green-700 font-medium">Approved Requests</CardDescription>
            <CardTitle className="text-3xl text-green-950">{approvedCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-green-700 font-medium">Total approved</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardDescription className="text-blue-700 font-medium">On Leave Today</CardDescription>
            <CardTitle className="text-3xl text-blue-950">2</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-blue-700 font-medium">Currently away</p>
          </CardContent>
        </Card>
      </div>

      {/* Leave Requests Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
             <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Leave Requests
                </CardTitle>
                <CardDescription>Recent applications from staff</CardDescription>
             </div>
             <Button variant="outline" size="sm" className="hidden sm:flex">
                <Filter className="w-4 h-4 mr-2" />
                Filter
             </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaveRequests.map((request) => (
              <div
                key={request.id}
                className={`p-4 rounded-lg border transition-all ${
                  request.status === 'Pending'
                    ? 'bg-white border-amber-200 hover:shadow-md'
                    : request.status === 'Approved'
                    ? 'bg-gray-50/50 border-gray-200 opacity-90'
                    : 'bg-gray-50/50 border-gray-200 opacity-75'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900">{request.staffName}</h4>
                      <Badge
                        className={
                          request.leaveType === 'Sick'
                            ? 'bg-red-100 text-red-700 hover:bg-red-200 border-red-200'
                            : request.leaveType === 'Maternity'
                            ? 'bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200'
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200'
                        }
                      >
                        {request.leaveType}
                      </Badge>
                      <Badge
                        className={
                          request.status === 'Pending'
                            ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200'
                            : request.status === 'Approved'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200'
                        }
                      >
                        {request.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 font-mono mb-2">{request.employeeId}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                      <div className="flex gap-2">
                        <span className="text-gray-500 w-16">Duration:</span>
                        <span className="font-medium">
                          {request.startDate} — {request.endDate} <span className="text-gray-400">({request.days} days)</span>
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-gray-500 w-16">Reason:</span>
                        <span className="font-medium text-gray-700">{request.reason}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2">Applied on: {request.appliedDate}</p>
                  </div>
                  
                  {request.status === 'Pending' && (
                    <div className="flex sm:flex-col gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowApprovalDialog(true);
                        }}
                      >
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Review
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Review Leave Request</DialogTitle>
            <DialogDescription>Action required for {selectedRequest?.staffName}</DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4 py-2">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 space-y-3 text-sm">
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Type</p>
                        <p className="font-semibold text-blue-900">{selectedRequest.leaveType}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Days Requested</p>
                        <p className="font-semibold text-blue-900">{selectedRequest.days} Days</p>
                    </div>
                 </div>
                 <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Date Range</p>
                    <p className="font-medium text-gray-900">{selectedRequest.startDate} to {selectedRequest.endDate}</p>
                 </div>
                 <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Reason</p>
                    <p className="text-gray-800 italic">"{selectedRequest.reason}"</p>
                 </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200" onClick={handleReject}>
              <XCircle className="w-4 h-4 mr-2" />
              Reject Request
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleApprove}>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Approve Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* New Application Dialog */}
      <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
         <DialogContent className="sm:max-w-lg">
            <DialogHeader>
               <DialogTitle>New Leave Application</DialogTitle>
               <DialogDescription>Submit a new leave request on behalf of staff</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <Label>Staff Name</Label>
                     <Input 
                        placeholder="Staff Name" 
                        value={newApplication.staffName}
                        onChange={(e) => setNewApplication({...newApplication, staffName: e.target.value})}
                     />
                  </div>
                  <div className="space-y-2">
                     <Label>Employee ID</Label>
                     <Input 
                        placeholder="ID Number" 
                        value={newApplication.employeeId}
                        onChange={(e) => setNewApplication({...newApplication, employeeId: e.target.value})}
                     />
                  </div>
               </div>
               
               <div className="space-y-2">
                  <Label>Leave Type</Label>
                  <Select 
                     value={newApplication.leaveType}
                     onValueChange={(val) => setNewApplication({...newApplication, leaveType: val})}
                  >
                     <SelectTrigger>
                        <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="Annual">Annual Leave</SelectItem>
                        <SelectItem value="Sick">Sick Leave</SelectItem>
                        <SelectItem value="Maternity">Maternity Leave</SelectItem>
                        <SelectItem value="Emergency">Casual/Emergency</SelectItem>
                     </SelectContent>
                  </Select>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <Label>Start Date</Label>
                     <Input 
                        type="date" 
                        value={newApplication.startDate}
                        onChange={(e) => setNewApplication({...newApplication, startDate: e.target.value})}
                     />
                  </div>
                  <div className="space-y-2">
                     <Label>End Date</Label>
                     <Input 
                        type="date" 
                        value={newApplication.endDate}
                        onChange={(e) => setNewApplication({...newApplication, endDate: e.target.value})}
                     />
                  </div>
               </div>
               
               <div className="space-y-2">
                  <Label>Reason for Leave</Label>
                  <Textarea 
                     placeholder="Please provide details..." 
                     value={newApplication.reason}
                     onChange={(e) => setNewApplication({...newApplication, reason: e.target.value})}
                  />
               </div>
            </div>
            <DialogFooter>
               <Button variant="outline" onClick={() => setShowApplyDialog(false)}>Cancel</Button>
               <Button onClick={handleSubmitApplication} className="bg-blue-600 hover:bg-blue-700">Submit Request</Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
    </div>
  );
};