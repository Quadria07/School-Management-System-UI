import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { CheckCircle2, XCircle, Clock, MapPin, Calendar, BookOpen, Bell, User } from 'lucide-react';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { useParent } from '../../../contexts/ParentContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface AttendanceDay {
  date: string;
  status: 'present' | 'absent' | 'late';
  clockIn?: string;
  clockOut?: string;
  remarks?: string;
}

interface TimetableEntry {
  day: string;
  time: string;
  subject: string;
  teacher: string;
  room: string;
  class: string;
}

export const AttendanceTracking: React.FC = () => {
  const parentContext = useParent();
  const selectedChild = parentContext?.selectedChild;

  const [attendanceData] = useState<AttendanceDay[]>([
    { date: 'Dec 31', status: 'present', clockIn: '7:45 AM', clockOut: '2:30 PM' },
    { date: 'Dec 30', status: 'present', clockIn: '7:50 AM', clockOut: '2:35 PM' },
    { date: 'Dec 27', status: 'late', clockIn: '8:15 AM', clockOut: '2:30 PM', remarks: 'Traffic delay' },
    { date: 'Dec 26', status: 'present', clockIn: '7:40 AM', clockOut: '2:28 PM' },
    { date: 'Dec 24', status: 'present', clockIn: '7:42 AM', clockOut: '2:31 PM' },
    { date: 'Dec 23', status: 'present', clockIn: '7:48 AM', clockOut: '2:33 PM' },
    { date: 'Dec 20', status: 'present', clockIn: '7:52 AM', clockOut: '2:35 PM' },
    { date: 'Dec 19', status: 'absent', remarks: 'Medical appointment (excused)' },
    { date: 'Dec 18', status: 'present', clockIn: '7:47 AM', clockOut: '2:30 PM' },
    { date: 'Dec 17', status: 'present', clockIn: '7:43 AM', clockOut: '2:29 PM' },
  ]);

  const totalDays = attendanceData.length;
  const presentDays = attendanceData.filter((d) => d.status === 'present').length;
  const lateDays = attendanceData.filter((d) => d.status === 'late').length;
  const absentDays = attendanceData.filter((d) => d.status === 'absent').length;
  const attendanceRate = ((presentDays + lateDays) / totalDays) * 100;

  // Timetable Data
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  const timeSlots = [
    { label: '8:00 - 8:45 AM', id: '1' },
    { label: '8:45 - 9:30 AM', id: '2' },
    { label: '9:30 - 10:15 AM', id: '3' },
    { label: '10:15 - 11:00 AM', id: '4' },
    { label: '11:00 - 11:45 AM', id: '5' },
    { label: '11:45 - 12:30 PM', id: '6' },
    { label: '12:30 - 1:15 PM', id: '7' },
  ];

  const studentClass = selectedChild?.class || 'JSS 3A';

  const [timetableData] = useState<TimetableEntry[]>([
    // Monday
    { day: 'Monday', time: '8:00 - 8:45 AM', subject: 'Mathematics', teacher: 'Mr. Adeyemi', room: '', class: studentClass },
    { day: 'Monday', time: '8:45 - 9:30 AM', subject: 'English Language', teacher: 'Mrs. Okonkwo', room: '', class: studentClass },
    { day: 'Monday', time: '9:30 - 10:15 AM', subject: 'Biology', teacher: 'Dr. Ibrahim', room: '', class: studentClass },
    { day: 'Monday', time: '10:15 - 11:00 AM', subject: 'Break', teacher: '-', room: '', class: studentClass },
    { day: 'Monday', time: '11:00 - 11:45 AM', subject: 'Chemistry', teacher: 'Mrs. Eze', room: '', class: studentClass },
    { day: 'Monday', time: '11:45 - 12:30 PM', subject: 'Physics', teacher: 'Mr. Balogun', room: '', class: studentClass },
    { day: 'Monday', time: '12:30 - 1:15 PM', subject: 'Civic Education', teacher: 'Mr. Okafor', room: '', class: studentClass },
    
    // Tuesday
    { day: 'Tuesday', time: '8:00 - 8:45 AM', subject: 'English Language', teacher: 'Mrs. Okonkwo', room: '', class: studentClass },
    { day: 'Tuesday', time: '8:45 - 9:30 AM', subject: 'Mathematics', teacher: 'Mr. Adeyemi', room: '', class: studentClass },
    { day: 'Tuesday', time: '9:30 - 10:15 AM', subject: 'Computer Science', teacher: 'Mr. Williams', room: '', class: studentClass },
    { day: 'Tuesday', time: '10:15 - 11:00 AM', subject: 'Break', teacher: '-', room: '', class: studentClass },
    { day: 'Tuesday', time: '11:00 - 11:45 AM', subject: 'Physics', teacher: 'Mr. Balogun', room: '', class: studentClass },
    { day: 'Tuesday', time: '11:45 - 12:30 PM', subject: 'Economics', teacher: 'Mrs. Adeleke', room: '', class: studentClass },
    { day: 'Tuesday', time: '12:30 - 1:15 PM', subject: 'French', teacher: 'Mme. Dubois', room: '', class: studentClass },
    
    // Wednesday
    { day: 'Wednesday', time: '8:00 - 8:45 AM', subject: 'Mathematics', teacher: 'Mr. Adeyemi', room: '', class: studentClass },
    { day: 'Wednesday', time: '8:45 - 9:30 AM', subject: 'English Language', teacher: 'Mrs. Okonkwo', room: '', class: studentClass },
    { day: 'Wednesday', time: '9:30 - 10:15 AM', subject: 'Biology', teacher: 'Dr. Ibrahim', room: '', class: studentClass },
    { day: 'Wednesday', time: '10:15 - 11:00 AM', subject: 'Break', teacher: '-', room: '', class: studentClass },
    { day: 'Wednesday', time: '11:00 - 11:45 AM', subject: 'Chemistry', teacher: 'Mrs. Eze', room: '', class: studentClass },
    { day: 'Wednesday', time: '11:45 - 12:30 PM', subject: 'Geography', teacher: 'Mr. Nwankwo', room: '', class: studentClass },
    { day: 'Wednesday', time: '12:30 - 1:15 PM', subject: 'Physical Education', teacher: 'Coach John', room: '', class: studentClass },
    
    // Thursday
    { day: 'Thursday', time: '8:00 - 8:45 AM', subject: 'Chemistry', teacher: 'Mrs. Eze', room: '', class: studentClass },
    { day: 'Thursday', time: '8:45 - 9:30 AM', subject: 'Mathematics', teacher: 'Mr. Adeyemi', room: '', class: studentClass },
    { day: 'Thursday', time: '9:30 - 10:15 AM', subject: 'English Language', teacher: 'Mrs. Okonkwo', room: '', class: studentClass },
    { day: 'Thursday', time: '10:15 - 11:00 AM', subject: 'Break', teacher: '-', room: '', class: studentClass },
    { day: 'Thursday', time: '11:00 - 11:45 AM', subject: 'Literature', teacher: 'Mrs. Okonkwo', room: '', class: studentClass },
    { day: 'Thursday', time: '11:45 - 12:30 PM', subject: 'Further Mathematics', teacher: 'Mr. Adeyemi', room: '', class: studentClass },
    { day: 'Thursday', time: '12:30 - 1:15 PM', subject: 'Fine Arts', teacher: 'Mrs. Johnson', room: '', class: studentClass },
    
    // Friday
    { day: 'Friday', time: '8:00 - 8:45 AM', subject: 'Biology', teacher: 'Dr. Ibrahim', room: '', class: studentClass },
    { day: 'Friday', time: '8:45 - 9:30 AM', subject: 'Physics', teacher: 'Mr. Balogun', room: '', class: studentClass },
    { day: 'Friday', time: '9:30 - 10:15 AM', subject: 'Mathematics', teacher: 'Mr. Adeyemi', room: '', class: studentClass },
    { day: 'Friday', time: '10:15 - 11:00 AM', subject: 'Break', teacher: '-', room: '', class: studentClass },
    { day: 'Friday', time: '11:00 - 11:45 AM', subject: 'English Language', teacher: 'Mrs. Okonkwo', room: '', class: studentClass },
    { day: 'Friday', time: '11:45 - 12:30 PM', subject: 'Music', teacher: 'Mr. David', room: '', class: studentClass },
    { day: 'Friday', time: '12:30 - 1:15 PM', subject: 'Assembly/Clubs', teacher: 'Various', room: '', class: studentClass },
  ]);

  const getEntry = (day: string, time: string) => {
    // In a real app we'd filter by class, but for now we just show the mock data
    // modifying the filter to just match day/time since the mock data is hardcoded for 'JSS 3A'
    return timetableData.find(
      (entry) => entry.day === day && entry.time === time
    );
  };

  const getCurrentDay = () => {
    const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    if (today === 0 || today === 6) return null; // Weekend
    return daysOfWeek[today - 1];
  };

  const currentDay = getCurrentDay();

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl mb-2 text-blue-950">Attendance & Security Tracking</h1>
        <p className="text-sm sm:text-base text-gray-600">
          Viewing attendance for <strong>{selectedChild?.name}</strong> ({selectedChild?.class})
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-3">
            <CardDescription className="text-green-700">Attendance Rate</CardDescription>
            <CardTitle className="text-3xl text-green-950">{attendanceRate.toFixed(0)}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={attendanceRate} className="h-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-3">
            <CardDescription className="text-blue-700">Days Present</CardDescription>
            <CardTitle className="text-3xl text-blue-950 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6" />
              {presentDays}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-700">Out of {totalDays} days</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardHeader className="pb-3">
            <CardDescription className="text-amber-700">Late Arrivals</CardDescription>
            <CardTitle className="text-3xl text-amber-950 flex items-center gap-2">
              <Clock className="w-6 h-6" />
              {lateDays}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-amber-700">Punctuality matters</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="pb-3">
            <CardDescription className="text-red-700">Absences</CardDescription>
            <CardTitle className="text-3xl text-red-950 flex items-center gap-2">
              <XCircle className="w-6 h-6" />
              {absentDays}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-700">Keep low</p>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Notification */}
      <Alert className="border-green-200 bg-green-50">
        <Bell className="h-5 w-5 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>Today's Update:</strong> {selectedChild?.name} clocked in at 7:45 AM and clocked out at 2:30 PM.
        </AlertDescription>
      </Alert>

      {/* Tabs: Attendance Calendar & Timetable */}
      <Tabs defaultValue="attendance" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="attendance">
            <Calendar className="w-4 h-4 mr-2" />
            Attendance Calendar
          </TabsTrigger>
          <TabsTrigger value="timetable">
            <BookOpen className="w-4 h-4 mr-2" />
            Weekly Timetable
          </TabsTrigger>
        </TabsList>

        <TabsContent value="attendance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Attendance Calendar - December 2025</CardTitle>
              <CardDescription>Color-coded attendance record with clock-in/out times</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {attendanceData.map((day, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border-2 ${
                      day.status === 'present'
                        ? 'bg-green-50 border-green-300'
                        : day.status === 'late'
                        ? 'bg-amber-50 border-amber-300'
                        : 'bg-red-50 border-red-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-600">{day.date}</span>
                      {day.status === 'present' && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                      {day.status === 'late' && <Clock className="w-4 h-4 text-amber-600" />}
                      {day.status === 'absent' && <XCircle className="w-4 h-4 text-red-600" />}
                    </div>
                    <p className="text-xs font-semibold capitalize mb-2">{day.status}</p>
                    {day.clockIn && (
                      <div className="text-xs space-y-1">
                        <p className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          In: {day.clockIn}
                        </p>
                        {day.clockOut && (
                          <p className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            Out: {day.clockOut}
                          </p>
                        )}
                      </div>
                    )}
                    {day.remarks && <p className="text-xs text-gray-600 mt-1">{day.remarks}</p>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timetable" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Weekly Schedule
              </CardTitle>
              <CardDescription>Class timetable for {selectedChild?.class}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr>
                      <th className="border-2 border-gray-300 bg-blue-950 text-white p-3 text-left min-w-[120px]">
                        Time
                      </th>
                      {daysOfWeek.map((day) => (
                        <th
                          key={day}
                          className={`border-2 border-gray-300 p-3 text-center min-w-[160px] ${
                            day === currentDay
                              ? 'bg-blue-600 text-white'
                              : 'bg-blue-100 text-blue-950'
                          }`}
                        >
                          {day}
                          {day === currentDay && (
                            <Badge className="ml-2 bg-white text-blue-600">Today</Badge>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlots.map((slot) => (
                      <tr key={slot.id}>
                        <td className="border-2 border-gray-300 bg-gray-50 p-3 font-medium text-gray-700">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            {slot.label}
                          </div>
                        </td>
                        {daysOfWeek.map((day) => {
                          const entry = getEntry(day, slot.label);
                          const isBreak = entry?.subject === 'Break';
                          const isCurrentCell = day === currentDay;

                          return (
                            <td
                              key={day}
                              className={`border-2 border-gray-300 p-3 ${
                                isCurrentCell ? 'bg-blue-50' : 'bg-white'
                              }`}
                            >
                              {entry ? (
                                <div
                                  className={`p-3 rounded-lg ${
                                    isBreak
                                      ? 'bg-amber-50 border border-amber-200'
                                      : 'bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow'
                                  }`}
                                >
                                  <h4
                                    className={`font-semibold mb-2 ${
                                      isBreak ? 'text-amber-900' : 'text-blue-950'
                                    }`}
                                  >
                                    {entry.subject}
                                  </h4>
                                  {!isBreak && (
                                    <>
                                      <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                                        <User className="w-3 h-3" />
                                        {entry.teacher}
                                      </div>
                                    </>
                                  )}
                                </div>
                              ) : (
                                <div className="p-3 text-center text-gray-400 text-xs">Free Period</div>
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
        </TabsContent>
      </Tabs>
    </div>
  );
};