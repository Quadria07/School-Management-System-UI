import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Edit,
  Trash2,
  Download,
  Grid3x3,
  Save,
  X,
  Send,
  FileText,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { toast } from 'sonner';
import { Label } from '../ui/label';

interface TimetableEntry {
  day: string;
  time: string;
  subject: string;
  teacher: string;
  class: string;
}

interface TimeSlot {
  id: string;
  label: string;
}

interface TimetableStatus {
  class: string;
  status: 'draft' | 'published';
  lastSaved: string;
  lastPublished?: string;
}

export const TimetableResources: React.FC = () => {
  const [showTimetableDialog, setShowTimetableDialog] = useState(false);
  const [showTimeSlotDialog, setShowTimeSlotDialog] = useState(false);
  const [selectedClass, setSelectedClass] = useState('SSS 1A');
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [newTimeSlot, setNewTimeSlot] = useState('');

  // Timetable status tracking
  const [timetableStatuses, setTimetableStatuses] = useState<TimetableStatus[]>([]);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { id: '1', label: '8:00 - 9:00 AM' },
    { id: '2', label: '9:00 - 10:00 AM' },
    { id: '3', label: '10:00 - 11:00 AM' },
    { id: '4', label: '11:00 - 12:00 PM' },
    { id: '5', label: '12:00 - 1:00 PM' },
    { id: '6', label: '2:00 - 3:00 PM' },
  ]);

  const [timetableData, setTimetableData] = useState<TimetableEntry[]>([
    {
      day: 'Monday',
      time: '8:00 - 9:00 AM',
      subject: 'Mathematics',
      teacher: 'Mrs. Sarah Johnson',
      class: 'SSS 1A',
    },
    {
      day: 'Monday',
      time: '9:00 - 10:00 AM',
      subject: 'English Language',
      teacher: 'Mr. David Okafor',
      class: 'SSS 1A',
    },
    {
      day: 'Monday',
      time: '10:00 - 11:00 AM',
      subject: 'Physics',
      teacher: 'Mr. John Adebayo',
      class: 'SSS 1A',
    },
    {
      day: 'Tuesday',
      time: '8:00 - 9:00 AM',
      subject: 'Chemistry',
      teacher: 'Dr. Amaka Peters',
      class: 'SSS 1A',
    },
    {
      day: 'Tuesday',
      time: '9:00 - 10:00 AM',
      subject: 'Biology',
      teacher: 'Mrs. Blessing Eze',
      class: 'SSS 1A',
    },
    {
      day: 'Wednesday',
      time: '8:00 - 9:00 AM',
      subject: 'English Language',
      teacher: 'Mr. David Okafor',
      class: 'SSS 1A',
    },
    {
      day: 'Thursday',
      time: '8:00 - 9:00 AM',
      subject: 'Mathematics',
      teacher: 'Mrs. Sarah Johnson',
      class: 'SSS 1A',
    },
    {
      day: 'Friday',
      time: '8:00 - 9:00 AM',
      subject: 'Computer Science',
      teacher: 'Mr. Emmanuel Adeleke',
      class: 'SSS 1A',
    },
  ]);

  // Available subjects and teachers
  const subjects = [
    'Mathematics',
    'English Language',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'Economics',
    'Government',
    'Literature',
    'Agricultural Science',
    'Further Mathematics',
    'Technical Drawing',
  ];

  const teachers = [
    'Mrs. Sarah Johnson',
    'Mr. David Okafor',
    'Mr. John Adebayo',
    'Dr. Amaka Peters',
    'Mrs. Blessing Eze',
    'Mr. Emmanuel Adeleke',
    'Mrs. Chioma Nwankwo',
    'Mr. Tunde Bakare',
    'Mrs. Funmilayo Adeyemi',
  ];

  const classes = ['SSS 1A', 'SSS 1B', 'SSS 2A', 'SSS 2B', 'JSS 1', 'JSS 2', 'JSS 3'];

  // Load timetable data from localStorage on mount
  useEffect(() => {
    const savedTimetable = localStorage.getItem('timetable_data');
    const savedTimeSlots = localStorage.getItem('timetable_time_slots');
    const savedStatuses = localStorage.getItem('timetable_statuses');

    if (savedTimetable) {
      try {
        setTimetableData(JSON.parse(savedTimetable));
      } catch (error) {
        console.error('Error loading timetable data:', error);
      }
    }

    if (savedTimeSlots) {
      try {
        setTimeSlots(JSON.parse(savedTimeSlots));
      } catch (error) {
        console.error('Error loading time slots:', error);
      }
    }

    if (savedStatuses) {
      try {
        setTimetableStatuses(JSON.parse(savedStatuses));
      } catch (error) {
        console.error('Error loading timetable statuses:', error);
      }
    }
  }, []);

  // Get current class status
  const getCurrentClassStatus = () => {
    return timetableStatuses.find((status) => status.class === selectedClass);
  };

  // Save Draft
  const handleSaveDraft = () => {
    // Save timetable data to localStorage
    localStorage.setItem('timetable_data', JSON.stringify(timetableData));
    localStorage.setItem('timetable_time_slots', JSON.stringify(timeSlots));

    // Update status
    const updatedStatuses = [...timetableStatuses];
    const statusIndex = updatedStatuses.findIndex((s) => s.class === selectedClass);
    const now = new Date().toISOString();

    if (statusIndex >= 0) {
      updatedStatuses[statusIndex] = {
        ...updatedStatuses[statusIndex],
        lastSaved: now,
      };
    } else {
      updatedStatuses.push({
        class: selectedClass,
        status: 'draft',
        lastSaved: now,
      });
    }

    setTimetableStatuses(updatedStatuses);
    localStorage.setItem('timetable_statuses', JSON.stringify(updatedStatuses));

    toast.success(`Timetable for ${selectedClass} saved as draft`);
  };

  // Publish Timetable
  const handlePublishTimetable = () => {
    // Check if there are entries for the selected class
    const classEntries = timetableData.filter((entry) => entry.class === selectedClass);

    if (classEntries.length === 0) {
      toast.error('Cannot publish an empty timetable. Please add some entries first.');
      return;
    }

    // Save to localStorage
    localStorage.setItem('timetable_data', JSON.stringify(timetableData));
    localStorage.setItem('timetable_time_slots', JSON.stringify(timeSlots));

    // Update status
    const updatedStatuses = [...timetableStatuses];
    const statusIndex = updatedStatuses.findIndex((s) => s.class === selectedClass);
    const now = new Date().toISOString();

    if (statusIndex >= 0) {
      updatedStatuses[statusIndex] = {
        class: selectedClass,
        status: 'published',
        lastSaved: now,
        lastPublished: now,
      };
    } else {
      updatedStatuses.push({
        class: selectedClass,
        status: 'published',
        lastSaved: now,
        lastPublished: now,
      });
    }

    setTimetableStatuses(updatedStatuses);
    localStorage.setItem('timetable_statuses', JSON.stringify(updatedStatuses));

    toast.success(`Timetable for ${selectedClass} published successfully! Students and teachers can now view it.`);
  };

  // Get entry for specific day and time
  const getEntry = (day: string, time: string) => {
    return timetableData.find(
      (entry) => entry.day === day && entry.time === time && entry.class === selectedClass
    );
  };

  // Handle adding/editing entry
  const handleOpenDialog = (day: string, time: string, entry?: TimetableEntry) => {
    setSelectedDay(day);
    setSelectedTime(time);
    
    if (entry) {
      // Edit mode
      setEditingEntry(entry);
      setSelectedSubject(entry.subject);
      setSelectedTeacher(entry.teacher);
    } else {
      // Add mode
      setEditingEntry(null);
      setSelectedSubject('');
      setSelectedTeacher('');
    }
    
    setShowTimetableDialog(true);
  };

  // Save timetable entry
  const handleSaveEntry = () => {
    if (!selectedSubject || !selectedTeacher) {
      toast.error('Please select both subject and teacher');
      return;
    }

    const newEntry: TimetableEntry = {
      day: selectedDay,
      time: selectedTime,
      subject: selectedSubject,
      teacher: selectedTeacher,
      class: selectedClass,
    };

    if (editingEntry) {
      // Update existing entry
      setTimetableData((prev) =>
        prev.map((entry) =>
          entry.day === editingEntry.day &&
          entry.time === editingEntry.time &&
          entry.class === editingEntry.class
            ? newEntry
            : entry
        )
      );
      toast.success('Timetable entry updated successfully');
    } else {
      // Add new entry
      setTimetableData((prev) => [...prev, newEntry]);
      toast.success('Timetable entry added successfully');
    }

    setShowTimetableDialog(false);
    resetDialog();
  };

  // Delete entry
  const handleDeleteEntry = (entry: TimetableEntry) => {
    setTimetableData((prev) =>
      prev.filter(
        (e) =>
          !(e.day === entry.day && e.time === entry.time && e.class === entry.class)
      )
    );
    toast.success('Timetable entry deleted');
  };

  // Add new time slot
  const handleAddTimeSlot = () => {
    if (!newTimeSlot.trim()) {
      toast.error('Please enter a time slot');
      return;
    }

    const newSlot: TimeSlot = {
      id: String(timeSlots.length + 1),
      label: newTimeSlot.trim(),
    };

    setTimeSlots((prev) => [...prev, newSlot]);
    toast.success('Time slot added successfully');
    setShowTimeSlotDialog(false);
    setNewTimeSlot('');
  };

  // Remove time slot
  const handleRemoveTimeSlot = (slotId: string) => {
    // Check if any entries use this time slot
    const hasEntries = timetableData.some((entry) => {
      const slot = timeSlots.find((s) => s.id === slotId);
      return slot && entry.time === slot.label;
    });

    if (hasEntries) {
      toast.error('Cannot remove time slot - it has scheduled classes');
      return;
    }

    setTimeSlots((prev) => prev.filter((slot) => slot.id !== slotId));
    toast.success('Time slot removed');
  };

  // Reset dialog
  const resetDialog = () => {
    setSelectedDay('');
    setSelectedTime('');
    setSelectedSubject('');
    setSelectedTeacher('');
    setEditingEntry(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl mb-2 text-blue-950">Master Timetable</h1>
          <p className="text-gray-600">Manage class schedules and time slots</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowTimeSlotDialog(true)}>
            <Clock className="w-4 h-4 mr-2" />
            Manage Time Slots
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Timetable
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-3xl text-blue-950">{classes.length}</p>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Grid3x3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Time Slots
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-3xl text-blue-950">{timeSlots.length}</p>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Scheduled Periods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-3xl text-blue-950">
                {timetableData.filter((e) => e.class === selectedClass).length}
              </p>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CalendarIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2">For {selectedClass}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Available Slots
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-3xl text-blue-950">
                {daysOfWeek.length * timeSlots.length -
                  timetableData.filter((e) => e.class === selectedClass).length}
              </p>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Plus className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2">Empty periods</p>
          </CardContent>
        </Card>
      </div>

      {/* Class Selector */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Weekly Timetable</CardTitle>
              <CardDescription>Click + to add or edit icon to modify entries</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="classSelect">Select Class:</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger id="classSelect" className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls} value={cls}>
                      {cls}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Timetable Status & Actions */}
          <div className="mt-4 pt-4 border-t">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Status Info */}
              <div className="flex items-center gap-3">
                {getCurrentClassStatus()?.status === 'published' ? (
                  <>
                    <Badge className="bg-green-500">
                      <Send className="w-3 h-3 mr-1" />
                      Published
                    </Badge>
                    <div className="text-xs text-gray-600">
                      Last published: {new Date(getCurrentClassStatus()!.lastPublished!).toLocaleString()}
                    </div>
                  </>
                ) : getCurrentClassStatus()?.status === 'draft' ? (
                  <>
                    <Badge className="bg-amber-500">
                      <FileText className="w-3 h-3 mr-1" />
                      Draft
                    </Badge>
                    <div className="text-xs text-gray-600">
                      Last saved: {new Date(getCurrentClassStatus()!.lastSaved).toLocaleString()}
                    </div>
                  </>
                ) : (
                  <Badge variant="outline" className="text-gray-500">
                    Not yet saved
                  </Badge>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleSaveDraft}
                  className="bg-white hover:bg-gray-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </Button>
                <Button
                  onClick={handlePublishTimetable}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Publish Timetable
                </Button>
              </div>
            </div>

            {/* Helper Text */}
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-900">
                <strong>💡 Tip:</strong> Save your work as a draft while editing. When ready, click "Publish Timetable" to make it visible to teachers and students.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Timetable Grid */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border border-gray-300 bg-blue-50 p-3 text-left font-semibold min-w-[120px]">
                    Time / Day
                  </th>
                  {daysOfWeek.map((day) => (
                    <th
                      key={day}
                      className="border border-gray-300 bg-blue-50 p-3 text-center font-semibold min-w-[180px]"
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((slot) => (
                  <tr key={slot.id}>
                    <td className="border border-gray-300 bg-gray-50 p-3 font-medium">
                      {slot.label}
                    </td>
                    {daysOfWeek.map((day) => {
                      const entry = getEntry(day, slot.label);
                      return (
                        <td
                          key={`${day}-${slot.label}`}
                          className="border border-gray-300 p-2 hover:bg-gray-50 transition-colors"
                        >
                          {entry ? (
                            <div className="space-y-2">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-blue-950 truncate">
                                    {entry.subject}
                                  </p>
                                  <p className="text-xs text-gray-600 truncate">
                                    {entry.teacher}
                                  </p>
                                </div>
                                <div className="flex gap-1 flex-shrink-0">
                                  <button
                                    onClick={() => handleOpenDialog(day, slot.label, entry)}
                                    className="p-1 hover:bg-blue-100 rounded transition-colors"
                                    title="Edit"
                                  >
                                    <Edit className="w-3.5 h-3.5 text-blue-600" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteEntry(entry)}
                                    className="p-1 hover:bg-red-100 rounded transition-colors"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 text-red-600" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleOpenDialog(day, slot.label)}
                              className="w-full h-full min-h-[60px] flex items-center justify-center hover:bg-blue-50 transition-colors rounded group"
                              title="Add entry"
                            >
                              <Plus className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Timetable Entry Dialog */}
      <Dialog open={showTimetableDialog} onOpenChange={setShowTimetableDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingEntry ? 'Edit Timetable Entry' : 'Add Timetable Entry'}
            </DialogTitle>
            <DialogDescription>
              Select subject and teacher for {selectedDay} at {selectedTime}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Class (Read-only) */}
            <div className="space-y-2">
              <Label>Class</Label>
              <Input value={selectedClass} readOnly className="bg-gray-50" />
            </div>

            {/* Day (Read-only) */}
            <div className="space-y-2">
              <Label>Day</Label>
              <Input value={selectedDay} readOnly className="bg-gray-50" />
            </div>

            {/* Time (Read-only) */}
            <div className="space-y-2">
              <Label>Time</Label>
              <Input value={selectedTime} readOnly className="bg-gray-50" />
            </div>

            {/* Subject Selection */}
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Teacher Selection */}
            <div className="space-y-2">
              <Label htmlFor="teacher">Teacher *</Label>
              <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                <SelectTrigger id="teacher">
                  <SelectValue placeholder="Select a teacher" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher} value={teacher}>
                      {teacher}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowTimetableDialog(false);
                resetDialog();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveEntry}>
              <Save className="w-4 h-4 mr-2" />
              Save Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Time Slots Dialog */}
      <Dialog open={showTimeSlotDialog} onOpenChange={setShowTimeSlotDialog}>
        <DialogContent className="w-[95vw] max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage Time Slots</DialogTitle>
            <DialogDescription>
              Add or remove time periods for the timetable
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Current Time Slots */}
            <div className="space-y-2">
              <Label>Current Time Slots</Label>
              <div className="border rounded-lg divide-y max-h-[300px] overflow-y-auto">
                {timeSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{slot.label}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveTimeSlot(slot.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Add New Time Slot */}
            <div className="space-y-2">
              <Label htmlFor="newTimeSlot">Add New Time Slot</Label>
              <div className="flex gap-2">
                <Input
                  id="newTimeSlot"
                  value={newTimeSlot}
                  onChange={(e) => setNewTimeSlot(e.target.value)}
                  placeholder="e.g., 3:00 - 4:00 PM"
                />
                <Button onClick={handleAddTimeSlot}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Format: HH:MM - HH:MM AM/PM (e.g., 3:00 - 4:00 PM)
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTimeSlotDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};