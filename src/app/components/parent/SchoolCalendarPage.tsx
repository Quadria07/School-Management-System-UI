import React, { useState } from 'react';
import { Calendar } from '../ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useParent } from '../../../contexts/ParentContext';

interface SchoolCalendarProps {
  onNavigate?: (page: string) => void;
}

interface CalendarEvent {
  date: Date;
  title: string;
  type: 'holiday' | 'exam' | 'meeting' | 'event';
  description?: string;
}

export const SchoolCalendarPage: React.FC<SchoolCalendarProps> = ({ onNavigate }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { selectedChild } = useParent();

  // Mock events data
  const events: CalendarEvent[] = [
    {
      date: new Date(2026, 0, 1),
      title: 'New Year Holiday',
      type: 'holiday',
      description: 'School closed for New Year celebrations'
    },
    {
      date: new Date(2026, 0, 5),
      title: 'Resumption Day',
      type: 'event',
      description: 'All students return for 2nd Term'
    },
    {
      date: new Date(2026, 0, 6),
      title: 'Mid-Term Examinations Begin',
      type: 'exam',
      description: 'JSS1 - SSS3 Mid-Term Assessments'
    },
    {
      date: new Date(2026, 0, 10),
      title: 'Mid-Term Examinations End',
      type: 'exam',
      description: 'Conclusion of assessment week'
    },
    {
      date: new Date(2026, 0, 15),
      title: 'PTA General Meeting',
      type: 'meeting',
      description: 'Important meeting for all parents. Time: 10:00 AM'
    },
    {
      date: new Date(2026, 0, 20),
      title: 'Inter-House Sports',
      type: 'event',
      description: 'Annual sports competition at the school field'
    },
    {
      date: new Date(2026, 1, 14),
      title: 'Valentine\'s Day Social',
      type: 'event',
      description: 'Social gathering for students'
    },
    {
      date: new Date(2026, 2, 25),
      title: 'Term Ends',
      type: 'holiday',
      description: 'School closes for end of term break'
    }
  ];

  const getEventsForDate = (day: Date) => {
    return events.filter(e => 
      e.date.getDate() === day.getDate() && 
      e.date.getMonth() === day.getMonth() && 
      e.date.getFullYear() === day.getFullYear()
    );
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'holiday': return 'bg-red-100 text-red-800 border-red-200';
      case 'exam': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'meeting': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'event': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const selectedDateEvents = date ? getEventsForDate(date) : [];
  const upcomingEvents = events.filter(e => e.date >= new Date()).sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => onNavigate && onNavigate('/dashboard')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">School Calendar</h1>
          <p className="text-gray-500">2025/2026 Academic Session</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border-0 w-full"
                classNames={{
                  month: "space-y-4 w-full",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex w-full justify-between",
                  row: "flex w-full mt-2 justify-between",
                  cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 w-full aspect-square",
                  day: "h-full w-full p-0 font-normal aria-selected:opacity-100 flex items-center justify-center hover:bg-gray-100 rounded-md",
                }}
                modifiers={{
                  hasEvent: (date) => getEventsForDate(date).length > 0
                }}
                modifiersStyles={{
                  hasEvent: { fontWeight: 'bold', textDecoration: 'underline', color: '#2563eb' }
                }}
              />
            </CardContent>
          </Card>

          {/* Events for selected date */}
          <Card>
            <CardHeader>
              <CardTitle>
                Events for {date?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDateEvents.length > 0 ? (
                <div className="space-y-4">
                  {selectedDateEvents.map((event, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${getEventTypeColor(event.type)}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">{event.title}</h3>
                          <p className="mt-1">{event.description}</p>
                        </div>
                        <Badge variant="outline" className="bg-white/50">{event.type.toUpperCase()}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No events scheduled for this date.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Next 3 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="flex gap-4 items-start pb-4 border-b last:border-0 last:pb-0">
                    <div className="flex flex-col items-center min-w-[3rem] bg-blue-50 rounded p-2 text-blue-800">
                      <span className="text-xs font-bold uppercase">{event.date.toLocaleDateString('en-US', { month: 'short' })}</span>
                      <span className="text-xl font-bold">{event.date.getDate()}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">{event.title}</h4>
                      <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                      <Badge variant="secondary" className="mt-2 text-xs h-5">
                        {event.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};