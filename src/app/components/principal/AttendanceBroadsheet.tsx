import React from 'react';
import schoolLogo from 'figma:asset/05e5dcd127c3f9119091f655ee2db41390342c66.png';
import { Button } from '../ui/button';
import { Download, X, FileDown } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { toast } from 'sonner';

interface AttendanceBroadsheetProps {
  className?: string;
  session?: string;
  term?: string;
  classLevel?: string;
  onClose?: () => void;
}

export const AttendanceBroadsheet: React.FC<AttendanceBroadsheetProps> = ({
  className,
  session = '2024/2025',
  term = 'First Term',
  classLevel = 'JSS 3A',
  onClose
}) => {
  // Generate mock weeks (13 weeks)
  const weeks = Array.from({ length: 13 }, (_, i) => i + 1);
  const days = ['M', 'T', 'W', 'T', 'F'];

  // Mock student data
  const students = [
    { id: '1', name: 'Adebayo Oluwaseun', admissionNo: 'BFO/2023/001' },
    { id: '2', name: 'Chioma Nwosu', admissionNo: 'BFO/2023/002' },
    { id: '3', name: 'Ibrahim Yusuf', admissionNo: 'BFO/2023/003' },
    { id: '4', name: 'Grace Okonkwo', admissionNo: 'BFO/2023/004' },
    { id: '5', name: 'Daniel Akintola', admissionNo: 'BFO/2023/005' },
    { id: '6', name: 'Fatima Abdullahi', admissionNo: 'BFO/2023/006' },
    { id: '7', name: 'Emmanuel Okafor', admissionNo: 'BFO/2023/007' },
    { id: '8', name: 'Blessing Eze', admissionNo: 'BFO/2023/008' },
    { id: '9', name: 'Samuel Ojo', admissionNo: 'BFO/2023/009' },
    { id: '10', name: 'Victoria Mensah', admissionNo: 'BFO/2023/010' },
  ];

  // Helper to generate random attendance for a student
  // In a real app, this would come from the database
  const getStudentAttendance = (studentId: string) => {
    // Deterministic pseudo-random based on ID
    const statuses = ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'A', 'L', 'P']; 
    const attendance: string[] = [];
    let present = 0;
    let absent = 0;
    let late = 0;

    for (let w = 0; w < 13; w++) {
      for (let d = 0; d < 5; d++) {
        const seed = (parseInt(studentId) + w + d) % statuses.length;
        const status = statuses[seed];
        attendance.push(status);
        if (status === 'P') present++;
        else if (status === 'A') absent++;
        else if (status === 'L') late++;
      }
    }
    return { attendance, present, absent, late };
  };

  const totalDays = 13 * 5;

  const handleExport = () => {
    toast.success('Attendance broadsheet exported to Excel successfully');
  };

  return (
    <div className={`bg-white h-full flex flex-col ${className || ''}`}>
      {/* Toolbar */}
      <div className="flex justify-between items-center p-4 border-b bg-gray-50 print:hidden">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Attendance Broadsheet</h2>
          <p className="text-sm text-gray-500">{classLevel} • {term} • {session}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport} className="hidden sm:flex">
            <FileDown className="w-4 h-4 mr-2 text-green-600" />
            Export Excel
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Download className="w-4 h-4 mr-2" />
            Print / PDF
          </Button>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Broadsheet Content */}
      <div className="flex-1 overflow-auto p-8 print:p-0">
        <div className="min-w-fit mx-auto bg-white">
          {/* Header Template (Reused from Report Card style) */}
          <div className="border border-blue-950 p-4 mb-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 flex-shrink-0">
                <img src={schoolLogo} alt="School Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex-1 text-center">
                <h1 className="text-2xl font-bold text-blue-950">BISHOP FELIX OWOLABI INT'L ACADEMY</h1>
                <p className="text-sm text-gray-700">1, Faithtriumph Drive, Behind Galaxy Hotel, West Bye Pass, Ring Road, Osogbo, Osun State</p>
                <p className="text-sm font-bold text-blue-900 mt-1">MOTTO: ..... learning for an Exceptional Nation</p>
                <div className="mt-2 inline-block border-b-2 border-blue-950 pb-1 px-8">
                  <h2 className="text-xl font-bold uppercase">ATTENDANCE REGISTER SHEET</h2>
                </div>
              </div>
              <div className="w-20"></div> {/* Spacer for balance */}
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-4 text-sm border-t border-gray-300 pt-4">
              <div>
                <span className="font-bold">CLASS:</span> {classLevel}
              </div>
              <div className="text-center">
                <span className="font-bold">TERM:</span> {term}
              </div>
              <div className="text-right">
                <span className="font-bold">SESSION:</span> {session}
              </div>
            </div>
          </div>

          {/* Large Table */}
          <div className="border border-gray-800 overflow-x-auto">
            <table className="w-full border-collapse text-[10px]">
              <thead>
                {/* Week Headers */}
                <tr className="bg-gray-100">
                  <th rowSpan={2} className="border border-gray-400 p-2 min-w-[200px] sticky left-0 bg-gray-100 z-10 text-left">STUDENT NAME</th>
                  {weeks.map((week) => (
                    <th key={week} colSpan={5} className="border border-gray-400 p-1 text-center">
                      WK {week}
                    </th>
                  ))}
                  <th colSpan={4} className="border border-gray-400 p-1 text-center bg-blue-50">SUMMARY</th>
                </tr>
                {/* Day Headers */}
                <tr className="bg-gray-50">
                  {weeks.map((week) => (
                    days.map((day, idx) => (
                      <th key={`${week}-${idx}`} className="border border-gray-400 p-0.5 w-6 text-center font-normal">
                        {day}
                      </th>
                    ))
                  ))}
                  <th className="border border-gray-400 p-1 w-10 text-center bg-blue-50" title="Present">P</th>
                  <th className="border border-gray-400 p-1 w-10 text-center bg-blue-50" title="Absent">A</th>
                  <th className="border border-gray-400 p-1 w-10 text-center bg-blue-50" title="Late">L</th>
                  <th className="border border-gray-400 p-1 w-12 text-center bg-blue-50">%</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, idx) => {
                  const { attendance, present, absent, late } = getStudentAttendance(student.id);
                  const percentage = ((present + late) / totalDays * 100).toFixed(1); // Assuming late counts as present for % calculation or partial? Usually Present count / Total. Let's do (P + L) if L counts as present, or just P. Standard is usually P present. Let's stick to P for Present count, but maybe L counts for school open? Let's just use P count for now.
                  
                  // Correction: Late usually implies present but late. So effectively present.
                  // Let's count P and L as present for the average.
                  const effectivePresent = present + late;
                  const finalPercentage = ((effectivePresent / totalDays) * 100).toFixed(1);

                  return (
                    <tr key={student.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border border-gray-400 p-2 font-medium sticky left-0 bg-inherit z-10 border-r-2 border-r-gray-800">
                        <div className="truncate w-full uppercase">{student.name}</div>
                      </td>
                      {attendance.map((status, i) => (
                        <td 
                          key={i} 
                          className={`border border-gray-400 p-0.5 text-center font-medium ${
                            status === 'A' ? 'text-red-600 bg-red-50' : 
                            status === 'L' ? 'text-amber-600 bg-amber-50' : 
                            'text-gray-400'
                          }`}
                        >
                          {status}
                        </td>
                      ))}
                      <td className="border border-gray-400 p-1 text-center font-bold bg-blue-50">{present}</td>
                      <td className="border border-gray-400 p-1 text-center font-bold bg-blue-50 text-red-600">{absent}</td>
                      <td className="border border-gray-400 p-1 text-center font-bold bg-blue-50 text-amber-600">{late}</td>
                      <td className="border border-gray-400 p-1 text-center font-bold bg-blue-100">{finalPercentage}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 text-xs text-gray-500">
            <p>KEY: P = Present, A = Absent, L = Late</p>
            <p>Generated on {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
