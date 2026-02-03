import React, { useState } from 'react';
import { PageHeader } from './PageHeader';
import { 
  Settings, 
  Calendar,
  Users,
  Shield,
  Award,
  Save,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  CalendarDays
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

// Mock data
const academicSessions = [
  { id: 1, name: '2024/2025', startDate: '2024-09-15', endDate: '2025-07-15', status: 'Active' },
  { id: 2, name: '2023/2024', startDate: '2023-09-15', endDate: '2024-07-15', status: 'Completed' },
];

const terms = [
  { id: 1, name: 'First Term', startDate: '2024-09-15', endDate: '2024-12-20', status: 'Active' },
  { id: 2, name: 'Second Term', startDate: '2025-01-10', endDate: '2025-04-05', status: 'Upcoming' },
  { id: 3, name: 'Third Term', startDate: '2025-04-25', endDate: '2025-07-15', status: 'Upcoming' },
];

const userRoles = [
  { id: 1, name: 'Principal', email: 'principal@bfoia.edu.ng', status: 'Active', lastLogin: '2024-12-28' },
  { id: 2, name: 'Bursar', email: 'bursar@bfoia.edu.ng', status: 'Active', lastLogin: '2024-12-28' },
  { id: 3, name: 'HR Manager', email: 'hr@bfoia.edu.ng', status: 'Active', lastLogin: '2024-12-27' },
];

const gradingScale = [
  { grade: 'A', minScore: 70, maxScore: 100, remark: 'Excellent' },
  { grade: 'B', minScore: 60, maxScore: 69, remark: 'Very Good' },
  { grade: 'C', minScore: 50, maxScore: 59, remark: 'Good' },
  { grade: 'D', minScore: 40, maxScore: 49, remark: 'Pass' },
  { grade: 'F', minScore: 0, maxScore: 39, remark: 'Fail' },
];

interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  time: string;
}

export const AdministrativeControls: React.FC = () => {
  const [editingGrading, setEditingGrading] = useState(false);
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [showNewSectionDialog, setShowNewSectionDialog] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const [newSectionClass, setNewSectionClass] = useState('');
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([
    { id: 1, title: 'End of Term Examination', date: '2024-12-10', time: '08:00' },
    { id: 2, title: 'Mid-Term Break', date: '2024-12-21', time: '12:00' },
  ]);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventTime, setNewEventTime] = useState('');

  const handleSaveSession = () => {
    toast.success('Session settings saved successfully!');
  };

  const handleSaveGrading = () => {
    setEditingGrading(false);
    toast.success('Grading scale updated successfully!');
  };

  const handleCreateUser = () => {
    setShowNewUserForm(false);
    toast.success('New user account created successfully!');
  };

  const handleSuspendUser = (userId: number) => {
    toast.warning('User account suspended');
  };

  const handleDeleteUser = (userId: number) => {
    toast.error('User account deleted');
  };

  const handleCreateSection = () => {
    if (!newSectionName.trim() || !newSectionClass.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    toast.success(`Section ${newSectionName} created and published to all roles!`);
    setShowNewSectionDialog(false);
    setNewSectionName('');
    setNewSectionClass('');
  };

  const handleAddEvent = () => {
    if (!newEventTitle.trim() || !newEventDate || !newEventTime) {
      toast.error('Please fill in all event details');
      return;
    }
    const newEvent: CalendarEvent = {
      id: calendarEvents.length + 1,
      title: newEventTitle,
      date: newEventDate,
      time: newEventTime,
    };
    setCalendarEvents([...calendarEvents, newEvent]);
    setNewEventTitle('');
    setNewEventDate('');
    setNewEventTime('');
    toast.success('Event added successfully!');
  };

  const handlePublishCalendar = () => {
    toast.success('Academy calendar published to Principal and HR!');
  };

  const handleDeleteEvent = (eventId: number) => {
    setCalendarEvents(calendarEvents.filter(event => event.id !== eventId));
    toast.success('Event deleted');
  };

  return (
    <div className="p-8">
      <PageHeader
        title="Administrative Controls & Settings"
        description="Define the school's operational parameters and institutional policies"
        icon={Settings}
      />

      {/* Session & Term Setup */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg">Session & Term Setup</h3>
              <p className="text-sm text-gray-600">Define academic calendar and term dates</p>
            </div>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Session
          </Button>
        </div>

        {/* Current Session */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Current Academic Session</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="sessionName">Session Name</Label>
              <Input id="sessionName" defaultValue="2024/2025" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="sessionStart">Start Date</Label>
              <Input id="sessionStart" type="date" defaultValue="2024-09-15" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="sessionEnd">End Date</Label>
              <Input id="sessionEnd" type="date" defaultValue="2025-07-15" className="mt-1" />
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Term Configuration</h4>
          <div className="space-y-3">
            {terms.map((term) => (
              <div key={term.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Term</p>
                    <p className="font-medium">{term.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Start Date</p>
                    <p className="font-medium">{new Date(term.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">End Date</p>
                    <p className="font-medium">{new Date(term.endDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                        term.status === 'Active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {term.status}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSaveSession}>
            <Save className="w-4 h-4 mr-2" />
            Save Session Settings
          </Button>
        </div>
      </div>

      {/* User Role Management */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg">User Role Management</h3>
              <p className="text-sm text-gray-600">Create, suspend, or delete administrative accounts</p>
            </div>
          </div>
          <Button onClick={() => setShowNewUserForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create New User
          </Button>
        </div>

        {/* New User Form */}
        {showNewUserForm && (
          <div className="mb-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium mb-4">Create New Administrative User</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="newUserRole">Role</Label>
                <select id="newUserRole" className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md">
                  <option>Select Role</option>
                  <option>Principal</option>
                  <option>Bursar</option>
                  <option>HR Manager</option>
                  <option>Teacher</option>
                </select>
              </div>
              <div>
                <Label htmlFor="newUserEmail">Email Address</Label>
                <Input id="newUserEmail" type="email" placeholder="user@bfoia.edu.ng" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="newUserFirstName">First Name</Label>
                <Input id="newUserFirstName" placeholder="First Name" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="newUserLastName">Last Name</Label>
                <Input id="newUserLastName" placeholder="Last Name" className="mt-1" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateUser}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Create User
              </Button>
              <Button variant="outline" onClick={() => setShowNewUserForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Existing Users */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-sm">Role</th>
                <th className="text-left px-4 py-3 text-sm">Email</th>
                <th className="text-left px-4 py-3 text-sm">Status</th>
                <th className="text-left px-4 py-3 text-sm">Last Login</th>
                <th className="text-left px-4 py-3 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {userRoles.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{user.name}</td>
                  <td className="px-4 py-3 text-sm">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{new Date(user.lastLogin).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleSuspendUser(user.id)}>
                        Suspend
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grading Scale */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg">Institutional Grading Policy</h3>
              <p className="text-sm text-gray-600">Set school-wide grading scale and assessment criteria</p>
            </div>
          </div>
          {!editingGrading && (
            <Button onClick={() => setEditingGrading(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Grading Scale
            </Button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-sm">Grade</th>
                <th className="text-left px-4 py-3 text-sm">Score Range</th>
                <th className="text-left px-4 py-3 text-sm">Remark</th>
                {editingGrading && <th className="text-left px-4 py-3 text-sm">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y">
              {gradingScale.map((grade, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className={`inline-block px-3 py-1 rounded-md font-semibold ${
                      grade.grade === 'A' ? 'bg-green-100 text-green-700' :
                      grade.grade === 'B' ? 'bg-blue-100 text-blue-700' :
                      grade.grade === 'C' ? 'bg-yellow-100 text-yellow-700' :
                      grade.grade === 'D' ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {grade.grade}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {editingGrading ? (
                      <div className="flex items-center gap-2">
                        <Input type="number" defaultValue={grade.minScore} className="w-20" />
                        <span>-</span>
                        <Input type="number" defaultValue={grade.maxScore} className="w-20" />
                      </div>
                    ) : (
                      <span className="font-medium">{grade.minScore} - {grade.maxScore}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingGrading ? (
                      <Input defaultValue={grade.remark} className="max-w-xs" />
                    ) : (
                      <span>{grade.remark}</span>
                    )}
                  </td>
                  {editingGrading && (
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {editingGrading && (
          <div className="flex justify-end gap-2 mt-6 pt-6 border-t">
            <Button variant="outline" onClick={() => setEditingGrading(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveGrading}>
              <Save className="w-4 h-4 mr-2" />
              Save Grading Scale
            </Button>
          </div>
        )}

        {/* Additional Settings */}
        <div className="mt-6 pt-6 border-t">
          <h4 className="text-sm font-medium mb-4">Additional Policies</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Promotion Criteria</p>
                <p className="text-sm text-gray-600">Minimum pass mark for promotion</p>
              </div>
              <Input type="number" defaultValue="40" className="w-24" />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Maximum Class Size</p>
                <p className="text-sm text-gray-600">Students per class limit</p>
              </div>
              <Input type="number" defaultValue="35" className="w-24" />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Academic Excellence Score</p>
                <p className="text-sm text-gray-600">Minimum score for honors/awards</p>
              </div>
              <Input type="number" defaultValue="75" className="w-24" />
            </div>
          </div>
        </div>
      </div>

      {/* Section Management */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg">System Controls - Section Management</h3>
              <p className="text-sm text-gray-600">Create and manage class sections</p>
            </div>
          </div>
          <Button onClick={() => setShowNewSectionDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Section
          </Button>
        </div>

        {/* New Section Dialog */}
        <Dialog open={showNewSectionDialog} onOpenChange={setShowNewSectionDialog}>
          <DialogContent className="w-[95vw] sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Section</DialogTitle>
              <DialogDescription>
                Create a new section and publish to all role accounts.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="sectionClass">Class</Label>
                <select
                  id="sectionClass"
                  value={newSectionClass}
                  onChange={(e) => setNewSectionClass(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Class</option>
                  <option value="JSS 1">JSS 1</option>
                  <option value="JSS 2">JSS 2</option>
                  <option value="JSS 3">JSS 3</option>
                  <option value="SS 1">SS 1</option>
                  <option value="SS 2">SS 2</option>
                  <option value="SS 3">SS 3</option>
                </select>
              </div>
              <div>
                <Label htmlFor="sectionName">Section Name</Label>
                <Input
                  id="sectionName"
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  placeholder="e.g., A, B, C"
                  className="mt-1"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNewSectionDialog(false)}
              >
                Cancel
              </Button>
              <Button type="button" onClick={handleCreateSection}>
                Create & Publish
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">JSS 1</p>
            <p className="text-2xl mt-1">4 sections</p>
            <p className="text-xs text-gray-500 mt-1">A, B, C, D</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">JSS 2</p>
            <p className="text-2xl mt-1">4 sections</p>
            <p className="text-xs text-gray-500 mt-1">A, B, C, D</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">SS 1</p>
            <p className="text-2xl mt-1">3 sections</p>
            <p className="text-xs text-gray-500 mt-1">A, B, C</p>
          </div>
        </div>
      </div>

      {/* Academy Calendar */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg">Academy Calendar</h3>
              <p className="text-sm text-gray-600">Manage academic events and holidays</p>
            </div>
          </div>
        </div>

        {/* Add Event Form */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium mb-4">Add New Event</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="eventTitle">Event Title</Label>
              <Input
                id="eventTitle"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                placeholder="e.g., Graduation Ceremony"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="eventDate">Date</Label>
              <Input
                id="eventDate"
                type="date"
                value={newEventDate}
                onChange={(e) => setNewEventDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="eventTime">Time</Label>
              <Input
                id="eventTime"
                type="time"
                value={newEventTime}
                onChange={(e) => setNewEventTime(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <Button onClick={handleAddEvent}>
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>

        {/* Events List */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-sm">Event Title</th>
                <th className="text-left px-4 py-3 text-sm">Date</th>
                <th className="text-left px-4 py-3 text-sm">Time</th>
                <th className="text-left px-4 py-3 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {calendarEvents.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{event.title}</td>
                  <td className="px-4 py-3 text-sm">{new Date(event.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm">{event.time}</td>
                  <td className="px-4 py-3">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <Button onClick={handlePublishCalendar}>
            <Save className="w-4 h-4 mr-2" />
            Publish Calendar to Principal & HR
          </Button>
        </div>
      </div>
    </div>
  );
};