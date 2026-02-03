import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Download,
  Calendar as CalendarIcon,
  Plus,
  Search
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
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
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';

interface AttendanceRecord {
  staffName: string;
  employeeId: string;
  clockIn: string;
  clockOut?: string;
  status: 'On Time' | 'Late' | 'Absent';
  date: string;
}

export const AttendanceTracking: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showClockDialog, setShowClockDialog] = useState(false);
  const [showQueryDialog, setShowQueryDialog] = useState(false);
  const [selectedStaffForQuery, setSelectedStaffForQuery] = useState<string>('');
  
  // Mock Staff List
  const [allStaff] = useState([
     { id: 'BFOIA/TCH/001', name: 'Dr. Johnson Okafor' },
     { id: 'BFOIA/TCH/002', name: 'Mrs. Sarah Adeleke' },
     { id: 'BFOIA/TCH/003', name: 'Mr. Emmanuel Okon' },
     { id: 'BFOIA/TCH/004', name: 'Ms. Grace Effiong' },
     { id: 'BFOIA/TCH/005', name: 'Mr. David Yusuf' },
     { id: 'BFOIA/SEC/001', name: 'Mr. Musa Ibrahim' },
     { id: 'BFOIA/SUP/001', name: 'Mrs. Chioma Obi' },
  ]);
  
  // Form State for Clock In
  const [newClockIn, setNewClockIn] = useState({
    staffName: '',
    employeeId: '',
    time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    type: 'in' // 'in' or 'out'
  });

  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord[]>([
    { staffName: 'Mr. Adeyemi Tunde', employeeId: 'BFOIA/TCH/001', clockIn: '7:30 AM', clockOut: '3:45 PM', status: 'On Time', date: 'Today' },
    { staffName: 'Mrs. Okonkwo Mary', employeeId: 'BFOIA/TCH/002', clockIn: '7:45 AM', clockOut: '3:50 PM', status: 'On Time', date: 'Today' },
    { staffName: 'Dr. Ibrahim Yusuf', employeeId: 'BFOIA/TCH/003', clockIn: '8:20 AM', clockOut: '4:00 PM', status: 'Late', date: 'Today' },
    { staffName: 'Mr. Johnson Peter', employeeId: 'BFOIA/SEC/001', clockIn: '7:25 AM', status: 'On Time', date: 'Today' },
    { staffName: 'Mrs. Eze Chioma', employeeId: 'BFOIA/TCH/004', clockIn: '-', status: 'Absent', date: 'Today' },
  ]);

  const [lateComers] = useState([
    { name: 'Dr. Ibrahim Yusuf', times: 5, lastIncident: 'Today' },
    { name: 'Mr. Balogun Peter', times: 3, lastIncident: 'Yesterday' },
  ]);

  const filteredRecords = todayAttendance.filter((record) =>
    record.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClockSubmit = () => {
    if (!newClockIn.staffName || !newClockIn.employeeId) {
      toast.error('Please fill in all details');
      return;
    }

    const timeParts = newClockIn.time.split(':');
    const hour = parseInt(timeParts[0]);
    const isLate = hour >= 8 && newClockIn.time.includes('AM'); // Simple logic: Late if after 8 AM

    if (newClockIn.type === 'in') {
      const newRecord: AttendanceRecord = {
        staffName: newClockIn.staffName,
        employeeId: newClockIn.employeeId,
        clockIn: newClockIn.time,
        status: isLate ? 'Late' : 'On Time',
        date: 'Today'
      };
      setTodayAttendance([newRecord, ...todayAttendance]);
      toast.success(`Clock-in recorded for ${newClockIn.staffName}`);
    } else {
      // Find and update for clock out logic would go here
      // For this mock, we'll just show success
      toast.success(`Clock-out recorded for ${newClockIn.staffName}`);
    }
    
    setShowClockDialog(false);
    setNewClockIn({
      staffName: '',
      employeeId: '',
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      type: 'in'
    });
  };

  const handleSendQuery = () => {
    toast.success(`Query sent to ${selectedStaffForQuery}`);
    setShowQueryDialog(false);
    setSelectedStaffForQuery('');
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl mb-2 text-blue-950">Attendance & Time Tracking</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Monitor staff punctuality and daily attendance logs.
          </p>
        </div>
        <div className="flex gap-2">
           <Button onClick={() => setShowClockDialog(true)} className="bg-green-600 hover:bg-green-700">
             <Plus className="w-4 h-4 mr-2" />
             Log Attendance
           </Button>
           <Button variant="outline">
             <Download className="w-4 h-4 mr-2" />
             Export Report
           </Button>
        </div>
      </div>

      {/* Today's Attendance */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Today's Attendance
              </CardTitle>
              <CardDescription>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search staff..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-100 bg-gray-50/50">
                  <th className="text-left p-3 font-semibold text-gray-700">Staff Name</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Employee ID</th>
                  <th className="text-center p-3 font-semibold text-gray-700">Clock In</th>
                  <th className="text-center p-3 font-semibold text-gray-700">Clock Out</th>
                  <th className="text-center p-3 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record, idx) => (
                    <tr key={idx} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors">
                      <td className="p-3 font-medium">{record.staffName}</td>
                      <td className="p-3 text-gray-600">{record.employeeId}</td>
                      <td className="text-center p-3 font-mono">{record.clockIn}</td>
                      <td className="text-center p-3 font-mono">{record.clockOut || '-'}</td>
                      <td className="text-center p-3">
                        <Badge
                          className={
                            record.status === 'On Time'
                              ? 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200'
                              : record.status === 'Late'
                              ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200'
                              : 'bg-red-100 text-red-700 hover:bg-red-200 border-red-200'
                          }
                        >
                          {record.status === 'On Time' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {record.status === 'Late' && <AlertTriangle className="w-3 h-3 mr-1" />}
                          {record.status === 'Absent' && <XCircle className="w-3 h-3 mr-1" />}
                          {record.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                   <tr>
                     <td colSpan={5} className="p-8 text-center text-gray-500">
                        No records found matching "{searchTerm}"
                     </td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Late Coming Report */}
      <Card className="border-amber-200 bg-amber-50/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            Late Coming Watchlist
          </CardTitle>
          <CardDescription>Staff with frequent punctuality issues this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {lateComers.map((staff, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border border-amber-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
              >
                <div>
                  <h4 className="font-semibold text-gray-900">{staff.name}</h4>
                  <p className="text-sm text-gray-600">Has been late <span className="font-bold text-amber-600">{staff.times} times</span> this month</p>
                  <p className="text-xs text-gray-500 mt-1">Last incident: {staff.lastIncident}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-amber-300 text-amber-800 hover:bg-amber-50"
                  onClick={() => {
                    setSelectedStaffForQuery(staff.name);
                    setShowQueryDialog(true);
                  }}
                >
                  Issue Query
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Clock In Dialog */}
      <Dialog open={showClockDialog} onOpenChange={setShowClockDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manual Attendance Log</DialogTitle>
            <DialogDescription>Manually record staff attendance entry.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
             <div className="space-y-2">
                <Label>Entry Type</Label>
                <Select 
                  value={newClockIn.type} 
                  onValueChange={(val) => setNewClockIn({...newClockIn, type: val})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in">Clock In</SelectItem>
                    <SelectItem value="out">Clock Out</SelectItem>
                  </SelectContent>
                </Select>
             </div>
             <div className="space-y-2">
                <Label>Staff Name</Label>
                <Select 
                  value={newClockIn.staffName} 
                  onValueChange={(val) => {
                    const staff = allStaff.find(s => s.name === val);
                    setNewClockIn({
                      ...newClockIn, 
                      staffName: val,
                      employeeId: staff ? staff.id : ''
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    {allStaff.map((staff) => (
                      <SelectItem key={staff.id} value={staff.name}>
                        {staff.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
             </div>
             <div className="space-y-2">
                <Label>Employee ID</Label>
                <Input 
                   placeholder="e.g. BFOIA/TCH/001" 
                   value={newClockIn.employeeId}
                   onChange={(e) => setNewClockIn({...newClockIn, employeeId: e.target.value})}
                />
             </div>
             <div className="space-y-2">
                <Label>Time</Label>
                <Input 
                   type="time" 
                   defaultValue="07:30"
                   onChange={(e) => {
                      // Convert 24h to 12h format for display consistency
                      const [hours, minutes] = e.target.value.split(':');
                      const h = parseInt(hours);
                      const ampm = h >= 12 ? 'PM' : 'AM';
                      const h12 = h % 12 || 12;
                      setNewClockIn({...newClockIn, time: `${h12}:${minutes} ${ampm}`});
                   }}
                />
             </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClockDialog(false)}>Cancel</Button>
            <Button onClick={handleClockSubmit} className="bg-blue-600 hover:bg-blue-700">Save Record</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Query Dialog */}
      <Dialog open={showQueryDialog} onOpenChange={setShowQueryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Issue Official Query</DialogTitle>
            <DialogDescription>Send a formal query regarding lateness to {selectedStaffForQuery}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
             <div className="space-y-2">
                <Label>Subject</Label>
                <Input defaultValue="Query regarding habitual lateness" />
             </div>
             <div className="space-y-2">
                <Label>Message</Label>
                <Textarea 
                  className="min-h-[120px]" 
                  defaultValue={`Dear ${selectedStaffForQuery},\n\nIt has come to our attention that you have been late multiple times this month. Please explain the reasons for this persistent lateness within 24 hours.`}
                />
             </div>
          </div>
          <DialogFooter>
             <Button variant="outline" onClick={() => setShowQueryDialog(false)}>Cancel</Button>
             <Button onClick={handleSendQuery} className="bg-red-600 hover:bg-red-700 text-white">Send Query</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};