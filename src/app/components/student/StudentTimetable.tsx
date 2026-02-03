import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Download,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface TimetableEntry {
  day: string;
  time: string;
  subject: string;
  teacher: string;
  room: string;
  class: string;
}

interface StudentTimetableProps {
  onNavigate?: (page: string) => void;
}

export const StudentTimetable: React.FC<StudentTimetableProps> = ({ onNavigate }) => {
  const studentClass = 'JSS 3A';
  const [timetableData, setTimetableData] = useState<TimetableEntry[]>([]);
  const [timeSlots, setTimeSlots] = useState<{ label: string; id: string }[]>([
    { label: '8:00 - 8:45 AM', id: '1' },
    { label: '8:45 - 9:30 AM', id: '2' },
    { label: '9:30 - 10:15 AM', id: '3' },
    { label: '10:15 - 11:00 AM', id: '4' },
    { label: '11:00 - 11:45 AM', id: '5' },
    { label: '11:45 - 12:30 PM', id: '6' },
    { label: '12:30 - 1:15 PM', id: '7' },
  ]);
  const [isPublished, setIsPublished] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Load timetable from localStorage (published by Principal)
  useEffect(() => {
    // Load timetable data
    const savedTimetable = localStorage.getItem('timetable_data');
    const savedStatuses = localStorage.getItem('timetable_statuses');
    
    if (savedTimetable && savedStatuses) {
      try {
        const allTimetables = JSON.parse(savedTimetable);
        const statuses = JSON.parse(savedStatuses);
        
        // Find status for this class
        const classStatus = statuses.find((s: any) => s.class === studentClass);
        
        if (classStatus && classStatus.status === 'published') {
          // Load published timetable for this class
          const classTimetable = allTimetables.filter(
            (entry: TimetableEntry) => entry.class === studentClass
          );
          
          if (classTimetable.length > 0) {
            setTimetableData(classTimetable);
            setIsPublished(true);
            setLastUpdated(classStatus.publishedAt || classStatus.lastSaved);
          }
        }
      } catch (error) {
        console.error('Error loading timetable:', error);
      }
    }
    
    // Load custom time slots if available
    const savedTimeSlots = localStorage.getItem('timetable_time_slots');
    if (savedTimeSlots) {
      try {
        const parsedSlots = JSON.parse(savedTimeSlots);
        if (parsedSlots.length > 0) {
          setTimeSlots(parsedSlots.map((slot: string, index: number) => ({
            label: slot,
            id: String(index + 1),
          })));
        }
      } catch (error) {
        console.error('Error loading time slots:', error);
      }
    }
  }, [studentClass]);

  const handleNavigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const getEntry = (day: string, time: string) => {
    return timetableData.find(
      (entry) => entry.day === day && entry.time === time && entry.class === studentClass
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleNavigate('/dashboard')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl text-blue-950">My Timetable</h1>
            <p className="text-sm sm:text-base text-gray-600">
              Class: {studentClass} • First Term 2025/2026
            </p>
            {lastUpdated && (
              <p className="text-xs text-gray-500 mt-1">
                Last updated: {new Date(lastUpdated).toLocaleString()}
              </p>
            )}
          </div>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
      </div>

      {/* No timetable published alert */}
      {!isPublished && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Timetable Available</AlertTitle>
          <AlertDescription>
            Your class timetable has not been published yet. Please check back later or contact your class teacher.
          </AlertDescription>
        </Alert>
      )}

      {/* Timetable Card */}
      {isPublished && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Weekly Schedule
            </CardTitle>
            <CardDescription>Your class timetable for the week</CardDescription>
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
      )}

      {/* Legend */}
      {isPublished && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-50 border border-blue-200"></div>
                <span className="text-sm">Today's Classes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-amber-50 border border-amber-200"></div>
                <span className="text-sm">Break Time</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-white border border-gray-200"></div>
                <span className="text-sm">Regular Classes</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
