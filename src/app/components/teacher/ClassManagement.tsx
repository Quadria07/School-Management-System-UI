import React, { useState } from 'react';
import {
  Users,
  FileText,
  BarChart3,
  TrendingUp,
  Save,
  Download,
  Search,
  Filter,
  AlertCircle,
  Eye,
  Send,
  X,
  Calendar,
  Check,
  Clock,
  TrendingDown,
  AlertTriangle,
  CheckSquare,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { useAuth } from '../../../contexts/AuthContext';
import { toast } from 'sonner';
import { StudentReportCard } from '../principal/StudentReportCard';
import { BroadsheetData } from '../principal/ExaminationManagement';
import { BroadsheetView } from '../principal/BroadsheetView';
import { AttendanceBroadsheet } from '../principal/AttendanceBroadsheet';
import schoolLogo from 'figma:asset/05e5dcd127c3f9119091f655ee2db41390342c66.png';
import { format } from 'date-fns';
import { getStudentPhoto } from '@/utils/studentPhotoHelper';

interface SubjectScore {
  subject: string;
  teacher: string;
  periodicTest: number | null;
  midTermTest: number | null;
  total: number;
  percentage: number;
  grade: string;
}

interface StudentCAResult {
  id: string;
  studentName: string;
  admissionNumber: string;
  subjects: SubjectScore[];
  totalScore: number;
  average: number;
  overallGrade: string;
  position: number;
}

interface TermSubjectScore {
  subject: string;
  teacher: string;
  ca1: number | null;
  ca2: number | null;
  exam: number | null;
  total: number;
  grade: string;
}

interface StudentTermResult {
  id: string;
  studentName: string;
  admissionNumber: string;
  subjects: TermSubjectScore[];
  totalScore: number;
  average: number;
  grade: string;
  position: number;
}

interface StudentBroadsheet {
  id: string;
  studentName: string;
  admissionNumber: string;
  subjects: TermSubjectScore[];
  totalScore: number;
  average: number;
  overallGrade: string;
  position: number;
}

interface AttendanceStudent {
  id: string;
  name: string;
  admissionNumber: string;
  status: 'present' | 'absent' | 'late' | null;
  attendanceRate: number;
  totalAbsences: number;
}

interface CumulativeSubjectResult {
  id: string;
  studentName: string;
  admissionNumber: string;
  firstTerm: number;
  secondTerm: number;
  thirdTerm: number;
  total: number;
  grade: string;
}

// Grading scale
const GRADING_SCALE = [
  { min: 90, max: 100, grade: 'A', remark: 'Excellent' },
  { min: 80, max: 89, grade: 'A-', remark: 'Very Good' },
  { min: 70, max: 79, grade: 'B', remark: 'Good' },
  { min: 60, max: 69, grade: 'C', remark: 'Fair' },
  { min: 50, max: 59, grade: 'D', remark: 'Pass' },
  { min: 0, max: 49, grade: 'F', remark: 'Fail' },
];

export const ClassManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('attendance');
  const [selectedTerm, setSelectedTerm] = useState('First Term');
  const [selectedSession, setSelectedSession] = useState('2024/2025');
  const [selectedStudent, setSelectedStudent] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics'); // Added subject state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Report Cards Submission Dialog States
  const [showReportCardsDialog, setShowReportCardsDialog] = useState(false);
  const [showAttendanceBroadsheet, setShowAttendanceBroadsheet] = useState(false);
  const [viewingStudentId, setViewingStudentId] = useState<string | null>(null);

  const { user } = useAuth();
  const [assignedClass, setAssignedClass] = useState<string>('JSS 3A');

  // Load assigned class
  React.useEffect(() => {
    const loadAssignedClass = () => {
      const savedAssignments = localStorage.getItem('classAssignments');
      if (savedAssignments && user?.id) {
        const assignments = JSON.parse(savedAssignments);
        const foundClass = Object.keys(assignments).find(key => 
          assignments[key].classTeacherId === user.id || 
          assignments[key].assistantTeacherId === user.id
        );
        if (foundClass) {
          setAssignedClass(foundClass);
        }
      }
    };
    
    loadAssignedClass();
    
    // Listen for storage changes to update in real-time if changed in another tab
    window.addEventListener('storage', loadAssignedClass);
    return () => window.removeEventListener('storage', loadAssignedClass);
  }, [user]);
  
  // Mock Submission State for JSS 3A
  const [submissionStatus, setSubmissionStatus] = useState({ ca: false, term: false });

  // State for synced data
  const [syncedTermResults, setSyncedTermResults] = useState<StudentTermResult[]>([]);
  const [syncedBroadsheetData, setSyncedBroadsheetData] = useState<BroadsheetData[]>([]);

  // Load data from localStorage and sync (with polling)
  React.useEffect(() => {
    const syncData = () => {
        const savedResults = localStorage.getItem('gradebook_term_results');
        const savedStatus = localStorage.getItem('gradebook_submitted_classes');
        
        if (savedStatus) {
            const statusMap = JSON.parse(savedStatus);
            setSubmissionStatus({
                ca: statusMap[`${assignedClass}_ca`] === true,
                term: statusMap[`${assignedClass}_term`] === true
            });
        } else {
            setSubmissionStatus({ ca: false, term: false });
        }

        if (savedResults) {
            const parsedResults: StudentTermResult[] = JSON.parse(savedResults);
            
            // Only update if data has changed to avoid unnecessary re-renders (simple check)
            // For mock, we'll just update.
            setSyncedTermResults(parsedResults);

            // Transform to BroadsheetData format (Re-using the logic)
            const transformedData: BroadsheetData[] = parsedResults.map((student, index) => {
                // Helper to extract subject data safely
                const getSubjectData = (subjectName: string) => {
                const subject = student.subjects.find(s => 
                    s.subject.toLowerCase() === subjectName.toLowerCase() || 
                    s.subject.toLowerCase().includes(subjectName.toLowerCase())
                );
                
                if (!subject) return { first: 0, second: 0, third: 0, total: 0, average: 0, position: 0 };

                return {
                    first: subject.total, 
                    second: 0, 
                    third: 0,  
                    total: subject.total,
                    average: subject.total, 
                    position: 0 
                };
                };

                return {
                sn: index + 1,
                studentName: student.studentName.toUpperCase(),
                class: assignedClass,
                passportPhoto: getStudentPhoto(student.studentName),
                english: getSubjectData('English'),
                mathematics: getSubjectData('Mathematics'),
                basicScience: getSubjectData('Basic Science') || getSubjectData('Physics'), 
                prevocational: getSubjectData('Pre-vocational') || getSubjectData('Biology'), 
                nationalValues: getSubjectData('National Values') || getSubjectData('Civic'), 
                totalScore: student.totalScore,
                overallAverage: student.average,
                percentAverage: Math.round(student.average),
                overallPosition: student.position,
                grade: student.grade,
                remarks: student.remark || 'Good performance',
                };
            });

            setSyncedBroadsheetData(transformedData);
        }
    };

    syncData();
    const interval = setInterval(syncData, 2000); // Poll every 2 seconds
    return () => clearInterval(interval);
  }, []);

  // Attendance State
  const [attendanceStudents, setAttendanceStudents] = useState<AttendanceStudent[]>([
    {
      id: '1',
      name: 'Adebayo Oluwaseun',
      admissionNumber: 'BFO/2023/001',
      status: 'present',
      attendanceRate: 98,
      totalAbsences: 1,
    },
    {
      id: '2',
      name: 'Chioma Nwosu',
      admissionNumber: 'BFO/2023/002',
      status: 'present',
      attendanceRate: 100,
      totalAbsences: 0,
    },
    {
      id: '3',
      name: 'Ibrahim Yusuf',
      admissionNumber: 'BFO/2023/003',
      status: null,
      attendanceRate: 95,
      totalAbsences: 2,
    },
    {
      id: '4',
      name: 'Grace Okonkwo',
      admissionNumber: 'BFO/2023/004',
      status: null,
      attendanceRate: 97,
      totalAbsences: 1,
    },
    {
      id: '5',
      name: 'Daniel Akintola',
      admissionNumber: 'BFO/2023/005',
      status: null,
      attendanceRate: 85,
      totalAbsences: 6,
    },
  ]);

  // Mock data - CA Results (aggregated from all subject teachers)
  const [caResults] = useState<StudentCAResult[]>([
    {
      id: '1',
      studentName: 'Adebayo Oluwaseun',
      admissionNumber: 'BFO/2023/001',
      subjects: [
        { subject: 'Mathematics', teacher: 'Mr. Adeyemi', periodicTest: 20, midTermTest: 20, total: 40, percentage: 100, grade: 'A' },
        { subject: 'English', teacher: 'Mrs. Okafor', periodicTest: 18, midTermTest: 19, total: 37, percentage: 92.5, grade: 'A' },
        { subject: 'Physics', teacher: 'Mr. Ibrahim', periodicTest: 19, midTermTest: 20, total: 39, percentage: 97.5, grade: 'A' },
        { subject: 'Chemistry', teacher: 'Dr. Balogun', periodicTest: 18, midTermTest: 18, total: 36, percentage: 90, grade: 'A' },
        { subject: 'Biology', teacher: 'Mrs. Adenike', periodicTest: 19, midTermTest: 19, total: 38, percentage: 95, grade: 'A' },
      ],
      totalScore: 190,
      average: 95,
      overallGrade: 'A',
      position: 1,
    },
    {
      id: '2',
      studentName: 'Chioma Nwosu',
      admissionNumber: 'BFO/2023/002',
      subjects: [
        { subject: 'Mathematics', teacher: 'Mr. Adeyemi', periodicTest: 18, midTermTest: 18, total: 36, percentage: 90, grade: 'A' },
        { subject: 'English', teacher: 'Mrs. Okafor', periodicTest: 17, midTermTest: 17, total: 34, percentage: 85, grade: 'A-' },
        { subject: 'Physics', teacher: 'Mr. Ibrahim', periodicTest: 17, midTermTest: 18, total: 35, percentage: 87.5, grade: 'A-' },
        { subject: 'Chemistry', teacher: 'Dr. Balogun', periodicTest: 16, midTermTest: 17, total: 33, percentage: 82.5, grade: 'A-' },
        { subject: 'Biology', teacher: 'Mrs. Adenike', periodicTest: 17, midTermTest: 17, total: 34, percentage: 85, grade: 'A-' },
      ],
      totalScore: 172,
      average: 86,
      overallGrade: 'A-',
      position: 2,
    },
    {
      id: '3',
      studentName: 'Ibrahim Yusuf',
      admissionNumber: 'BFO/2023/003',
      subjects: [
        { subject: 'Mathematics', teacher: 'Mr. Adeyemi', periodicTest: 16, midTermTest: 16, total: 32, percentage: 80, grade: 'A-' },
        { subject: 'English', teacher: 'Mrs. Okafor', periodicTest: 15, midTermTest: 15, total: 30, percentage: 75, grade: 'B' },
        { subject: 'Physics', teacher: 'Mr. Ibrahim', periodicTest: 16, midTermTest: 15, total: 31, percentage: 77.5, grade: 'B' },
        { subject: 'Chemistry', teacher: 'Dr. Balogun', periodicTest: 15, midTermTest: 16, total: 31, percentage: 77.5, grade: 'B' },
        { subject: 'Biology', teacher: 'Mrs. Adenike', periodicTest: 15, midTermTest: 15, total: 30, percentage: 75, grade: 'B' },
      ],
      totalScore: 154,
      average: 77,
      overallGrade: 'B',
      position: 3,
    },
    {
      id: '4',
      studentName: 'Grace Okonkwo',
      admissionNumber: 'BFO/2023/004',
      subjects: [
        { subject: 'Mathematics', teacher: 'Mr. Adeyemi', periodicTest: 14, midTermTest: 14, total: 28, percentage: 70, grade: 'B' },
        { subject: 'English', teacher: 'Mrs. Okafor', periodicTest: 13, midTermTest: 14, total: 27, percentage: 67.5, grade: 'C' },
        { subject: 'Physics', teacher: 'Mr. Ibrahim', periodicTest: 14, midTermTest: 13, total: 27, percentage: 67.5, grade: 'C' },
        { subject: 'Chemistry', teacher: 'Dr. Balogun', periodicTest: 13, midTermTest: 13, total: 26, percentage: 65, grade: 'C' },
        { subject: 'Biology', teacher: 'Mrs. Adenike', periodicTest: 14, midTermTest: 14, total: 28, percentage: 70, grade: 'B' },
      ],
      totalScore: 136,
      average: 68,
      overallGrade: 'C',
      position: 4,
    },
    {
      id: '5',
      studentName: 'Daniel Akintola',
      admissionNumber: 'BFO/2023/005',
      subjects: [
        { subject: 'Mathematics', teacher: 'Mr. Adeyemi', periodicTest: 12, midTermTest: 12, total: 24, percentage: 60, grade: 'C' },
        { subject: 'English', teacher: 'Mrs. Okafor', periodicTest: 11, midTermTest: 12, total: 23, percentage: 57.5, grade: 'D' },
        { subject: 'Physics', teacher: 'Mr. Ibrahim', periodicTest: 12, midTermTest: 11, total: 23, percentage: 57.5, grade: 'D' },
        { subject: 'Chemistry', teacher: 'Dr. Balogun', periodicTest: 11, midTermTest: 11, total: 22, percentage: 55, grade: 'D' },
        { subject: 'Biology', teacher: 'Mrs. Adenike', periodicTest: 12, midTermTest: 12, total: 24, percentage: 60, grade: 'C' },
      ],
      totalScore: 116,
      average: 58,
      overallGrade: 'D',
      position: 5,
    },
  ]);

  // Mock data - Term Results (aggregated from all subject teachers)
  const [termResults] = useState<StudentTermResult[]>([
    {
      id: '1',
      studentName: 'Adebayo Oluwaseun',
      admissionNumber: 'BFO/2023/001',
      subjects: [
        { subject: 'Mathematics', teacher: 'Mr. Adeyemi', ca1: 10, ca2: 10, exam: 60, total: 80, grade: 'A-' },
        { subject: 'English', teacher: 'Mrs. Okafor', ca1: 9, ca2: 9, exam: 58, total: 76, grade: 'B' },
        { subject: 'Physics', teacher: 'Mr. Ibrahim', ca1: 10, ca2: 10, exam: 62, total: 82, grade: 'A-' },
        { subject: 'Chemistry', teacher: 'Dr. Balogun', ca1: 9, ca2: 10, exam: 60, total: 79, grade: 'B' },
        { subject: 'Biology', teacher: 'Mrs. Adenike', ca1: 10, ca2: 9, exam: 59, total: 78, grade: 'B' },
      ],
      totalScore: 395,
      average: 79,
      grade: 'B',
      position: 1,
    },
    {
      id: '2',
      studentName: 'Chioma Nwosu',
      admissionNumber: 'BFO/2023/002',
      subjects: [
        { subject: 'Mathematics', teacher: 'Mr. Adeyemi', ca1: 9, ca2: 9, exam: 55, total: 73, grade: 'B' },
        { subject: 'English', teacher: 'Mrs. Okafor', ca1: 10, ca2: 9, exam: 56, total: 75, grade: 'B' },
        { subject: 'Physics', teacher: 'Mr. Ibrahim', ca1: 8, ca2: 9, exam: 54, total: 71, grade: 'B' },
        { subject: 'Chemistry', teacher: 'Dr. Balogun', ca1: 9, ca2: 8, exam: 55, total: 72, grade: 'B' },
        { subject: 'Biology', teacher: 'Mrs. Adenike', ca1: 9, ca2: 9, exam: 56, total: 74, grade: 'B' },
      ],
      totalScore: 365,
      average: 73,
      grade: 'B',
      position: 2,
    },
    {
      id: '3',
      studentName: 'Ibrahim Yusuf',
      admissionNumber: 'BFO/2023/003',
      subjects: [
        { subject: 'Mathematics', teacher: 'Mr. Adeyemi', ca1: 8, ca2: 8, exam: 50, total: 66, grade: 'C' },
        { subject: 'English', teacher: 'Mrs. Okafor', ca1: 7, ca2: 8, exam: 48, total: 63, grade: 'C' },
        { subject: 'Physics', teacher: 'Mr. Ibrahim', ca1: 8, ca2: 7, exam: 49, total: 64, grade: 'C' },
        { subject: 'Chemistry', teacher: 'Dr. Balogun', ca1: 7, ca2: 8, exam: 50, total: 65, grade: 'C' },
        { subject: 'Biology', teacher: 'Mrs. Adenike', ca1: 8, ca2: 8, exam: 51, total: 67, grade: 'C' },
      ],
      totalScore: 325,
      average: 65,
      grade: 'C',
      position: 3,
    },
  ]);

  // Mock data - Broadsheet (aggregated from all subject teachers)
  const [broadsheet] = useState<StudentBroadsheet[]>([
    {
      id: '1',
      studentName: 'Adebayo Oluwaseun',
      admissionNumber: 'BFO/2023/001',
      subjects: [
        { subject: 'Mathematics', teacher: 'Mr. Adeyemi', ca1: 10, ca2: 10, exam: 60, total: 80, grade: 'A-' },
        { subject: 'English', teacher: 'Mrs. Okafor', ca1: 9, ca2: 9, exam: 58, total: 76, grade: 'B' },
        { subject: 'Physics', teacher: 'Mr. Ibrahim', ca1: 10, ca2: 10, exam: 62, total: 82, grade: 'A-' },
        { subject: 'Chemistry', teacher: 'Dr. Balogun', ca1: 9, ca2: 10, exam: 60, total: 79, grade: 'B' },
        { subject: 'Biology', teacher: 'Mrs. Adenike', ca1: 10, ca2: 9, exam: 59, total: 78, grade: 'B' },
        { subject: 'Economics', teacher: 'Mr. Ojo', ca1: 9, ca2: 10, exam: 61, total: 80, grade: 'A-' },
        { subject: 'Geography', teacher: 'Mrs. Bello', ca1: 10, ca2: 9, exam: 60, total: 79, grade: 'B' },
      ],
      totalScore: 554,
      average: 79.14,
      overallGrade: 'B',
      position: 1,
    },
    {
      id: '2',
      studentName: 'Chioma Nwosu',
      admissionNumber: 'BFO/2023/002',
      subjects: [
        { subject: 'Mathematics', teacher: 'Mr. Adeyemi', ca1: 9, ca2: 9, exam: 55, total: 73, grade: 'B' },
        { subject: 'English', teacher: 'Mrs. Okafor', ca1: 10, ca2: 9, exam: 56, total: 75, grade: 'B' },
        { subject: 'Physics', teacher: 'Mr. Ibrahim', ca1: 8, ca2: 9, exam: 54, total: 71, grade: 'B' },
        { subject: 'Chemistry', teacher: 'Dr. Balogun', ca1: 9, ca2: 8, exam: 55, total: 72, grade: 'B' },
        { subject: 'Biology', teacher: 'Mrs. Adenike', ca1: 9, ca2: 9, exam: 56, total: 74, grade: 'B' },
        { subject: 'Economics', teacher: 'Mr. Ojo', ca1: 8, ca2: 9, exam: 57, total: 74, grade: 'B' },
        { subject: 'Geography', teacher: 'Mrs. Bello', ca1: 9, ca2: 8, exam: 55, total: 72, grade: 'B' },
      ],
      totalScore: 511,
      average: 73,
      overallGrade: 'B',
      position: 2,
    },
  ]);

  // Mock broadsheet data in BroadsheetData format for principal's broadsheet view
  const broadsheetDataForPrincipalView: BroadsheetData[] = [
    {
      sn: 1,
      studentName: 'ADEBAYO OLUWASEUN',
      class: assignedClass,
      passportPhoto: getStudentPhoto('ADEBAYO OLUWASEUN'),
      english: { first: 25.5, second: 24.0, third: 26.5, total: 76.0, average: 25.33, position: 1 },
      mathematics: { first: 28.0, second: 26.5, third: 25.5, total: 80.0, average: 26.67, position: 1 },
      basicScience: { first: 27.0, second: 27.5, third: 27.5, total: 82.0, average: 27.33, position: 1 },
      prevocational: { first: 26.5, second: 26.0, third: 26.5, total: 79.0, average: 26.33, position: 2 },
      nationalValues: { first: 25.5, second: 26.0, third: 26.5, total: 78.0, average: 26.00, position: 2 },
      totalScore: 395.0,
      overallAverage: 79.0,
      percentAverage: 79,
      overallPosition: 1,
      grade: 'B',
      remarks: 'Excellent performance',
    },
    {
      sn: 2,
      studentName: 'CHIOMA NWOSU',
      class: assignedClass,
      passportPhoto: getStudentPhoto('CHIOMA NWOSU'),
      english: { first: 25.0, second: 25.0, third: 25.0, total: 75.0, average: 25.00, position: 2 },
      mathematics: { first: 24.0, second: 24.5, third: 24.5, total: 73.0, average: 24.33, position: 2 },
      basicScience: { first: 23.5, second: 24.0, third: 23.5, total: 71.0, average: 23.67, position: 3 },
      prevocational: { first: 24.0, second: 24.0, third: 24.0, total: 72.0, average: 24.00, position: 3 },
      nationalValues: { first: 24.5, second: 24.5, third: 25.0, total: 74.0, average: 24.67, position: 3 },
      totalScore: 365.0,
      overallAverage: 73.0,
      percentAverage: 73,
      overallPosition: 2,
      grade: 'B',
      remarks: 'Very good effort',
    },
    {
      sn: 3,
      studentName: 'IBRAHIM YUSUF',
      class: assignedClass,
      passportPhoto: getStudentPhoto('IBRAHIM YUSUF'),
      english: { first: 21.0, second: 21.0, third: 21.0, total: 63.0, average: 21.00, position: 3 },
      mathematics: { first: 22.0, second: 22.0, third: 22.0, total: 66.0, average: 22.00, position: 3 },
      basicScience: { first: 21.5, second: 21.0, third: 21.5, total: 64.0, average: 21.33, position: 4 },
      prevocational: { first: 21.5, second: 22.0, third: 21.5, total: 65.0, average: 21.67, position: 4 },
      nationalValues: { first: 22.0, second: 22.5, third: 22.5, total: 67.0, average: 22.33, position: 4 },
      totalScore: 325.0,
      overallAverage: 65.0,
      percentAverage: 65,
      overallPosition: 3,
      grade: 'C',
      remarks: 'Good performance',
    },
  ];

  const getGrade = (percentage: number): string => {
    const gradeInfo = GRADING_SCALE.find(
      (scale) => percentage >= scale.min && percentage <= scale.max
    );
    return gradeInfo ? gradeInfo.grade : 'F';
  };

  const subjects = [
    'Mathematics',
    'English Language',
    'Basic Science',
    'Civic Education',
    'Computer Studies',
    'Agricultural Science',
    'Business Studies',
    'Home Economics',
    'French',
    'Yoruba'
  ];

  // Mock Cumulative Data
  const [cumulativeResults] = useState<CumulativeSubjectResult[]>([
    {
      id: '1',
      studentName: 'Adebayo Oluwaseun',
      admissionNumber: 'BFO/2023/001',
      firstTerm: 80,
      secondTerm: 82,
      thirdTerm: 85,
      total: 247,
      grade: 'A'
    },
    {
      id: '2',
      studentName: 'Chioma Nwosu',
      admissionNumber: 'BFO/2023/002',
      firstTerm: 73,
      secondTerm: 75,
      thirdTerm: 78,
      total: 226,
      grade: 'A-'
    },
    {
      id: '3',
      studentName: 'Ibrahim Yusuf',
      admissionNumber: 'BFO/2023/003',
      firstTerm: 66,
      secondTerm: 68,
      thirdTerm: 70,
      total: 204,
      grade: 'B'
    },
    {
      id: '4',
      studentName: 'Grace Okonkwo',
      admissionNumber: 'BFO/2023/004',
      firstTerm: 58,
      secondTerm: 60,
      thirdTerm: 62,
      total: 180,
      grade: 'C'
    },
    {
      id: '5',
      studentName: 'Daniel Akintola',
      admissionNumber: 'BFO/2023/005',
      firstTerm: 45,
      secondTerm: 48,
      thirdTerm: 50,
      total: 143,
      grade: 'D'
    },
  ]);

  const filteredCumulativeResults = cumulativeResults.filter((student) => {
    const matchesSearch =
      student.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Attendance Handlers
  const handleStatusChange = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendanceStudents((prev) =>
      prev.map((student) =>
        student.id === studentId ? { ...student, status } : student
      )
    );
  };

  const handleMarkAll = (status: 'present' | 'absent') => {
    setAttendanceStudents((prev) =>
      prev.map((student) => ({ ...student, status }))
    );
    toast.success(`All students marked as ${status}`);
  };

  const handleSaveAttendance = () => {
    const unmarked = attendanceStudents.filter((s) => s.status === null);
    if (unmarked.length > 0) {
      toast.error(`Please mark attendance for ${unmarked.length} student(s)`);
      return;
    }
    toast.success('Attendance saved successfully');
  };

  const handleSubmitAttendance = () => {
    const unmarked = attendanceStudents.filter((s) => s.status === null);
    if (unmarked.length > 0) {
      toast.error(`Please mark attendance for ${unmarked.length} student(s)`);
      return;
    }
    toast.success('Attendance submitted to Administration');
  };

  const presentCount = attendanceStudents.filter((s) => s.status === 'present').length;
  const absentCount = attendanceStudents.filter((s) => s.status === 'absent').length;
  const lateCount = attendanceStudents.filter((s) => s.status === 'late').length;
  const unmarkedCount = attendanceStudents.filter((s) => s.status === null).length;

  const frequentAbsentees = attendanceStudents
    .filter((s) => s.attendanceRate < 90)
    .sort((a, b) => a.attendanceRate - b.attendanceRate);

  const handleExportToExcel = () => {
    toast.success('Class results exported to Excel');
  };

  const handleGenerateReportCards = () => {
    setShowReportCardsDialog(true);
  };
  
  const handleSubmitForApproval = () => {
    // Determine what we are submitting based on active tab
    const isTermSubmission = activeTab === 'term-results' || activeTab === 'broadsheet';
    const keySuffix = isTermSubmission ? '_term' : '_ca';
    
    // Save submission status
    const savedStatus = localStorage.getItem('gradebook_submitted_classes');
    const statusMap = savedStatus ? JSON.parse(savedStatus) : {};
    
    statusMap[`${assignedClass}${keySuffix}`] = true;
    
    localStorage.setItem('gradebook_submitted_classes', JSON.stringify(statusMap));
    
    // Update local state
    setSubmissionStatus(prev => ({
        ...prev,
        [isTermSubmission ? 'term' : 'ca']: true
    }));

    setShowReportCardsDialog(false);
    toast.success(`${isTermSubmission ? 'Term' : 'CA'} Results submitted to Principal for approval`);
  };
  
  // Get student for viewing in dialog based on active tab
  const getStudentForDialog = (studentId: string): BroadsheetData | null => {
    // Priority: Use synced data if available
    if (syncedBroadsheetData.length > 0) {
      const syncedStudent = syncedBroadsheetData.find(s => 
        s.studentName.toLowerCase() === caResults.find(c => c.id === studentId)?.studentName.toLowerCase() ||
        s.studentName.toLowerCase() === termResults.find(t => t.id === studentId)?.studentName.toLowerCase()
      );
      if (syncedStudent) {
        // Add passport photo to synced data
        return {
          ...syncedStudent,
          passportPhoto: getStudentPhoto(syncedStudent.studentName) || syncedStudent.passportPhoto
        };
      }
    }

    if (activeTab === 'ca-results') {
      const student = caResults.find((s) => s.id === studentId);
      if (!student) return null;
      
      return {
        sn: student.position,
        studentName: student.studentName,
        class: assignedClass,
        passportPhoto: getStudentPhoto(student.studentName),
        english: { first: 0, second: 0, third: 0, total: 0, average: 0, position: 0 },
        mathematics: { first: 0, second: 0, third: 0, total: 0, average: 0, position: 0 },
        basicScience: { first: 0, second: 0, third: 0, total: 0, average: 0, position: 0 },
        prevocational: { first: 0, second: 0, third: 0, total: 0, average: 0, position: 0 },
        nationalValues: { first: 0, second: 0, third: 0, total: 0, average: 0, position: 0 },
        totalScore: student.totalScore,
        overallAverage: student.average,
        percentAverage: student.average,
        overallPosition: student.position,
        grade: student.overallGrade,
        remarks: 'Good performance',
      };
    } else {
      const student = termResults.find((s) => s.id === studentId);
      if (!student) return null;
      
      return {
        sn: student.position,
        studentName: student.studentName,
        class: assignedClass,
        passportPhoto: getStudentPhoto(student.studentName),
        english: { first: 0, second: 0, third: 0, total: 0, average: 0, position: 0 },
        mathematics: { first: 0, second: 0, third: 0, total: 0, average: 0, position: 0 },
        basicScience: { first: 0, second: 0, third: 0, total: 0, average: 0, position: 0 },
        prevocational: { first: 0, second: 0, third: 0, total: 0, average: 0, position: 0 },
        nationalValues: { first: 0, second: 0, third: 0, total: 0, average: 0, position: 0 },
        totalScore: student.totalScore,
        overallAverage: student.average,
        percentAverage: student.average,
        overallPosition: student.position,
        grade: student.grade,
        remarks: 'Good performance',
      };
    }
  };
  
  // Get the list of students based on current active tab
  const getStudentsList = () => {
    return activeTab === 'ca-results' ? caResults : termResults;
  };

  // Filter students
  const filteredCAResults = caResults.filter((student) => {
    const matchesSearch =
      student.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStudent = selectedStudent === 'all' || student.id === selectedStudent;
    return matchesSearch && matchesStudent;
  });

  const filteredTermResults = termResults.filter((student) => {
    const matchesSearch =
      student.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStudent = selectedStudent === 'all' || student.id === selectedStudent;
    return matchesSearch && matchesStudent;
  });

  const filteredBroadsheet = broadsheet.filter((student) => {
    const matchesSearch =
      student.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStudent = selectedStudent === 'all' || student.id === selectedStudent;
    return matchesSearch && matchesStudent;
  });

  // Statistics
  const classAverage =
    caResults.reduce((sum, student) => sum + student.average, 0) / caResults.length;

  // Get selected student data for individual report card
  const selectedStudentData = caResults.find((student) => student.id === selectedStudent);
  const selectedTermStudentData = termResults.find((student) => student.id === selectedStudent);

  // Convert student data to BroadsheetData format for the report card
  const getStudentForReportCard = (): BroadsheetData | null => {
    if (!selectedStudentData) return null;

    return {
      sn: selectedStudentData.position,
      studentName: selectedStudentData.studentName,
      class: assignedClass,
      passportPhoto: getStudentPhoto(selectedStudentData.studentName),
      english: {
        first: 0,
        second: 0,
        third: 0,
        total: 0,
        average: 0,
        position: 0,
      },
      mathematics: {
        first: 0,
        second: 0,
        third: 0,
        total: 0,
        average: 0,
        position: 0,
      },
      basicScience: {
        first: 0,
        second: 0,
        third: 0,
        total: 0,
        average: 0,
        position: 0,
      },
      prevocational: {
        first: 0,
        second: 0,
        third: 0,
        total: 0,
        average: 0,
        position: 0,
      },
      nationalValues: {
        first: 0,
        second: 0,
        third: 0,
        total: 0,
        average: 0,
        position: 0,
      },
      totalScore: selectedStudentData.totalScore,
      overallAverage: selectedStudentData.average,
      percentAverage: selectedStudentData.average,
      overallPosition: selectedStudentData.position,
      grade: selectedStudentData.overallGrade,
      remarks: 'Good performance',
    };
  };

  // Convert term results student data to BroadsheetData format
  const getTermStudentForReportCard = (): BroadsheetData | null => {
    if (!selectedTermStudentData) return null;

    return {
      sn: selectedTermStudentData.position,
      studentName: selectedTermStudentData.studentName,
      class: assignedClass,
      passportPhoto: getStudentPhoto(selectedTermStudentData.studentName),
      english: {
        first: 0,
        second: 0,
        third: 0,
        total: 0,
        average: 0,
        position: 0,
      },
      mathematics: {
        first: 0,
        second: 0,
        third: 0,
        total: 0,
        average: 0,
        position: 0,
      },
      basicScience: {
        first: 0,
        second: 0,
        third: 0,
        total: 0,
        average: 0,
        position: 0,
      },
      prevocational: {
        first: 0,
        second: 0,
        third: 0,
        total: 0,
        average: 0,
        position: 0,
      },
      nationalValues: {
        first: 0,
        second: 0,
        third: 0,
        total: 0,
        average: 0,
        position: 0,
      },
      totalScore: selectedTermStudentData.totalScore,
      overallAverage: selectedTermStudentData.average,
      percentAverage: selectedTermStudentData.average,
      overallPosition: selectedTermStudentData.position,
      grade: selectedTermStudentData.grade,
      remarks: 'Good performance',
    };
  };

  // Helper to get subjects for report card from synced data
  const getReportCardSubjects = (studentId: string | null) => {
    if (!studentId) return undefined;
    
    // Try to find in synced results first
    if (syncedTermResults.length > 0) {
      const student = syncedTermResults.find(s => s.id === studentId);
      if (student) {
        return student.subjects.map(sub => ({
          subject: sub.subject.toUpperCase(),
          ca: (sub.ca1 || 0) + (sub.ca2 || 0),
          ca1: sub.ca1,
          ca2: sub.ca2,
          caTotal: (sub.ca1 || 0) + (sub.ca2 || 0),
          exam: sub.exam,
          total: sub.total,
          grade: sub.grade,
          percentScore: sub.total, // Assuming total is out of 100
          average: sub.total, // Placeholder
          rank: "-", // Rank not calculated per subject in this simple sync
          remark: GRADING_SCALE.find(s => sub.total >= s.min && sub.total <= s.max)?.remark || "Good"
        }));
      }
    }

    // Fallback to default mock data logic if not synced
    const student = termResults.find(s => s.id === studentId);
    if (student) {
       return student.subjects.map(sub => ({
         subject: sub.subject.toUpperCase(),
         ca: (sub.ca1 || 0) + (sub.ca2 || 0),
         exam: sub.exam,
         total: sub.total,
         grade: sub.grade,
         average: 70, // Mock
         rank: "1st", // Mock
         remark: "Good"
       }));
    }
    return undefined;
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl mb-2 text-blue-950">
            Class Management
          </h1>
          <div className="flex flex-col gap-1">
            <p className="text-sm sm:text-base text-gray-600">
                Comprehensive Results Management for {assignedClass}
            </p>
            <div className="flex gap-2 mt-1">
                {submissionStatus.ca ? (
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200 text-xs">
                        <Check className="w-3 h-3 mr-1" />
                        CA: Submitted
                    </Badge>
                ) : (
                    <Badge variant="outline" className="text-gray-500 border-gray-300 text-xs">
                        CA: Draft
                    </Badge>
                )}
                {submissionStatus.term ? (
                    <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-purple-200 text-xs">
                        <Check className="w-3 h-3 mr-1" />
                        Term: Submitted
                    </Badge>
                ) : (
                    <Badge variant="outline" className="text-gray-500 border-gray-300 text-xs">
                        Term: Draft
                    </Badge>
                )}
            </div>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto flex-wrap">
          <Button
            variant="outline"
            onClick={handleExportToExcel}
            className="flex-1 sm:flex-none text-xs sm:text-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={handleGenerateReportCards}
            className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm"
          >
            <FileText className="w-4 h-4 mr-2" />
            Generate Report Cards
          </Button>
        </div>
      </div>

      {/* Assigned Class Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-950">
            <Users className="w-5 h-5" />
            Assigned Class: {assignedClass}
          </CardTitle>
          <CardDescription className="text-blue-800">
            You are the Form Teacher/Class Manager for this class
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-blue-600 mb-1">Total Students</p>
              <p className="text-2xl font-bold text-blue-950">{caResults.length}</p>
            </div>
            <div>
              <p className="text-xs text-blue-600 mb-1">Class Average</p>
              <p className="text-2xl font-bold text-blue-950">{classAverage.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-xs text-blue-600 mb-1">Overall Grade</p>
              <p className="text-2xl font-bold text-blue-950">{getGrade(classAverage)}</p>
            </div>
            <div>
              <p className="text-xs text-blue-600 mb-1">Subjects</p>
              <p className="text-2xl font-bold text-blue-950">
                {caResults[0]?.subjects.length || 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Session</label>
              <Select value={selectedSession} disabled>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024/2025">2024/2025 (Ongoing)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {activeTab !== 'broadsheet' && (
              <div>
                <label className="text-sm font-medium mb-2 block">Term</label>
                <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="First Term">First Term</SelectItem>
                    <SelectItem value="Second Term">Second Term</SelectItem>
                    <SelectItem value="Third Term">Third Term</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <label className="text-sm font-medium mb-2 block">Student Name</label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="All Students" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students</SelectItem>
                  {caResults.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.studentName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search student..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="attendance">
            <CheckSquare className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Attendance</span>
            <span className="sm:hidden">Attend</span>
          </TabsTrigger>
          <TabsTrigger value="ca-results">
            <FileText className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">CA Results</span>
            <span className="sm:hidden">CA</span>
          </TabsTrigger>
          <TabsTrigger value="term-results">
            <BarChart3 className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Term Results</span>
            <span className="sm:hidden">Term</span>
          </TabsTrigger>
          <TabsTrigger value="broadsheet">
            <TrendingUp className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Broadsheet</span>
            <span className="sm:hidden">Sheet</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 0: Attendance */}
        <TabsContent value="attendance" className="mt-4 sm:mt-6">
          <div className="space-y-4 sm:space-y-6">
            {/* Attendance Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Present</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl sm:text-3xl text-blue-950">{presentCount}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {((presentCount / attendanceStudents.length) * 100).toFixed(0)}%
                      </p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Check className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Absent</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl sm:text-3xl text-blue-950">{absentCount}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {((absentCount / attendanceStudents.length) * 100).toFixed(0)}%
                      </p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <X className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Late</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl sm:text-3xl text-blue-950">{lateCount}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {((lateCount / attendanceStudents.length) * 100).toFixed(0)}%
                      </p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Unmarked</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl sm:text-3xl text-blue-950">{unmarkedCount}</p>
                      <p className="text-xs text-gray-500 mt-1">Pending</p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Attendance Roll Call */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle>Daily Roll Call - {assignedClass}</CardTitle>
                      <CardDescription>
                        {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowAttendanceBroadsheet(true)}
                        className="text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View Broadsheet
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkAll('present')}
                        className="text-xs"
                      >
                        <Check className="w-3 h-3 mr-1" />
                        All Present
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkAll('absent')}
                        className="text-xs"
                      >
                        <X className="w-3 h-3 mr-1" />
                        All Absent
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSaveAttendance}
                        className="text-xs bg-blue-600 hover:bg-blue-700"
                      >
                        <Save className="w-3 h-3 mr-1" />
                        Save
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSubmitAttendance}
                        className="text-xs bg-green-600 hover:bg-green-700"
                      >
                        Submit
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Student List */}
                  <div className="space-y-2">
                    {attendanceStudents.map((student, index) => (
                      <div
                        key={student.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-gray-50 gap-3"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-gray-500 font-medium w-6">{index + 1}</span>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{student.name}</h4>
                            <p className="text-xs text-gray-500">
                              {student.admissionNumber} • {student.attendanceRate}% attendance
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={student.status === 'present' ? 'default' : 'outline'}
                            onClick={() => handleStatusChange(student.id, 'present')}
                            className={`flex-1 sm:flex-none ${
                              student.status === 'present'
                                ? 'bg-green-600 hover:bg-green-700'
                                : ''
                            }`}
                          >
                            <Check className="w-3 h-3 sm:mr-1" />
                            <span className="hidden sm:inline">Present</span>
                          </Button>
                          <Button
                            size="sm"
                            variant={student.status === 'late' ? 'default' : 'outline'}
                            onClick={() => handleStatusChange(student.id, 'late')}
                            className={`flex-1 sm:flex-none ${
                              student.status === 'late'
                                ? 'bg-amber-600 hover:bg-amber-700'
                                : ''
                            }`}
                          >
                            <Clock className="w-3 h-3 sm:mr-1" />
                            <span className="hidden sm:inline">Late</span>
                          </Button>
                          <Button
                            size="sm"
                            variant={student.status === 'absent' ? 'default' : 'outline'}
                            onClick={() => handleStatusChange(student.id, 'absent')}
                            className={`flex-1 sm:flex-none ${
                              student.status === 'absent' ? 'bg-red-600 hover:bg-red-700' : ''
                            }`}
                          >
                            <X className="w-3 h-3 sm:mr-1" />
                            <span className="hidden sm:inline">Absent</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Attendance Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="w-5 h-5" />
                    Frequent Absentees
                  </CardTitle>
                  <CardDescription>Students requiring attention</CardDescription>
                </CardHeader>
                <CardContent>
                  {frequentAbsentees.length > 0 ? (
                    <div className="space-y-3">
                      {frequentAbsentees.map((student) => (
                        <div
                          key={student.id}
                          className="p-3 bg-red-50 border border-red-200 rounded-lg"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{student.name}</h4>
                              <p className="text-xs text-gray-600">
                                {student.admissionNumber}
                              </p>
                            </div>
                            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">Attendance Rate:</span>
                            <Badge className="bg-red-100 text-red-700">
                              {student.attendanceRate}%
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-xs mt-1">
                            <span className="text-gray-600">Total Absences:</span>
                            <span className="font-medium">{student.totalAbsences} days</span>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full mt-3 text-xs"
                            onClick={() =>
                              toast.success(`Report sent to Principal and Parent`)
                            }
                          >
                            Report to Principal/Parent
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Check className="w-12 h-12 text-green-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        All students have good attendance!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tab 1: CA Results */}
        <TabsContent value="ca-results" className="mt-4 sm:mt-6">
          {selectedStudent === 'all' ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16">
                <AlertCircle className="w-16 h-16 text-amber-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Select a Student to View CA Result
                </h3>
                <p className="text-gray-600 text-center max-w-md">
                  Please select a student from the "Student Name" filter above to view their individual CA result template.
                </p>
              </CardContent>
            </Card>
          ) : selectedStudentData && getStudentForReportCard() ? (
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Individual CA Result - {selectedStudentData.studentName}</CardTitle>
                  <CardDescription>
                    {assignedClass} • {selectedTerm} • {selectedSession}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <StudentReportCard
                  student={getStudentForReportCard()!}
                  term={selectedTerm}
                  session={selectedSession}
                  class={assignedClass}
                  schoolLogo={schoolLogo}
                  adminSignature={null}
                  principalSignature={null}
                  principalRemark=""
                  onPrincipalRemarkChange={() => {}}
                  onPrincipalSignatureUpload={() => {}}
                  onRemovePrincipalSignature={() => {}}
                  onAdminSignatureUpload={() => {}}
                  onRemoveAdminSignature={() => {}}
                  resultType="ca"
                  userRole="Teacher"
                  subjects={getReportCardSubjects(selectedStudent)}
                />
              </CardContent>
            </Card>
          ) : null}
        </TabsContent>

        {/* Tab 2: Term Results */}
        <TabsContent value="term-results" className="mt-4 sm:mt-6">
          {selectedStudent === 'all' ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16">
                <AlertCircle className="w-16 h-16 text-amber-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Select a Student to View Term Result
                </h3>
                <p className="text-gray-600 text-center max-w-md">
                  Please select a student from the "Student Name" filter above to view their individual term result template.
                </p>
              </CardContent>
            </Card>
          ) : selectedTermStudentData && getTermStudentForReportCard() ? (
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Individual Term Result - {selectedTermStudentData.studentName}</CardTitle>
                  <CardDescription>
                    {assignedClass} • {selectedTerm} • {selectedSession}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <StudentReportCard
                  student={getTermStudentForReportCard()!}
                  term={selectedTerm}
                  session={selectedSession}
                  class={assignedClass}
                  schoolLogo={schoolLogo}
                  adminSignature={null}
                  principalSignature={null}
                  principalRemark=""
                  onPrincipalRemarkChange={() => {}}
                  onPrincipalSignatureUpload={() => {}}
                  onRemovePrincipalSignature={() => {}}
                  onAdminSignatureUpload={() => {}}
                  onRemoveAdminSignature={() => {}}
                  resultType="term"
                  userRole="Teacher"
                  subjects={getReportCardSubjects(selectedStudent)}
                />
              </CardContent>
            </Card>
          ) : null}
        </TabsContent>

        {/* Tab 3: Broadsheet */}
        <TabsContent value="broadsheet" className="mt-4 sm:mt-6">
          <BroadsheetView
            broadsheetData={syncedBroadsheetData.length > 0 ? syncedBroadsheetData : broadsheetDataForPrincipalView}
            selectedSession={selectedSession}
            selectedClass={assignedClass}
            onSessionChange={() => {}}
            onClassChange={() => {}}
            showInfoBanner={true}
            showSignatures={true}
          />
        </TabsContent>
      </Tabs>

      {/* Report Cards Submission Dialog */}
      <Dialog open={showReportCardsDialog} onOpenChange={setShowReportCardsDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {activeTab === 'ca-results' ? 'CA Results' : 'Term Results'} - Submit for Approval
            </DialogTitle>
            <DialogDescription>
              Review all student report cards before submitting to the Principal for approval. Click "View" to preview each student's result.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Student Preview or List */}
            {viewingStudentId ? (
              <div className="space-y-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewingStudentId(null)}
                  className="mb-4"
                >
                  <X className="w-4 h-4 mr-2" />
                  Back to List
                </Button>
                
                <StudentReportCard
                  student={getStudentForDialog(viewingStudentId)!}
                  term={selectedTerm}
                  session={selectedSession}
                  class={assignedClass}
                  schoolLogo={schoolLogo}
                  adminSignature={null}
                  principalSignature={null}
                  principalRemark=""
                  onPrincipalRemarkChange={() => {}}
                  onPrincipalSignatureUpload={() => {}}
                  onRemovePrincipalSignature={() => {}}
                  onAdminSignatureUpload={() => {}}
                  onRemoveAdminSignature={() => {}}
                  resultType={activeTab === 'ca-results' ? 'ca' : 'term'}
                  userRole="Teacher"
                  subjects={getReportCardSubjects(viewingStudentId)}
                />
              </div>
            ) : (
              <>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-950 mb-1">
                        Ready to Submit
                      </h4>
                      <p className="text-sm text-blue-800">
                        You have {getStudentsList().length} student{getStudentsList().length !== 1 ? 's' : ''} in {assignedClass} for {selectedTerm}, {selectedSession}. Review all results before submitting for Principal's approval.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left p-3 text-sm font-semibold text-gray-900">S/N</th>
                        <th className="text-left p-3 text-sm font-semibold text-gray-900">Student Name</th>
                        <th className="text-left p-3 text-sm font-semibold text-gray-900">Admission No.</th>
                        <th className="text-center p-3 text-sm font-semibold text-gray-900">Total</th>
                        <th className="text-center p-3 text-sm font-semibold text-gray-900">Average</th>
                        <th className="text-center p-3 text-sm font-semibold text-gray-900">Grade</th>
                        <th className="text-center p-3 text-sm font-semibold text-gray-900">Position</th>
                        <th className="text-center p-3 text-sm font-semibold text-gray-900">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getStudentsList().map((student, index) => (
                        <tr key={student.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 text-sm">{index + 1}</td>
                          <td className="p-3 text-sm font-medium">{student.studentName}</td>
                          <td className="p-3 text-sm text-gray-600">{student.admissionNumber}</td>
                          <td className="p-3 text-sm text-center">{student.totalScore}</td>
                          <td className="p-3 text-sm text-center">{student.average.toFixed(1)}%</td>
                          <td className="p-3 text-center">
                            <Badge
                              className={
                                ('grade' in student ? student.grade : student.overallGrade) === 'A' || ('grade' in student ? student.grade : student.overallGrade) === 'A-'
                                  ? 'bg-green-100 text-green-800'
                                  : ('grade' in student ? student.grade : student.overallGrade) === 'B'
                                  ? 'bg-blue-100 text-blue-800'
                                  : ('grade' in student ? student.grade : student.overallGrade) === 'C'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }
                            >
                              {'grade' in student ? student.grade : student.overallGrade}
                            </Badge>
                          </td>
                          <td className="p-3 text-sm text-center font-semibold">{student.position}</td>
                          <td className="p-3 text-center">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setViewingStudentId(student.id)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            {!viewingStudentId && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setShowReportCardsDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitForApproval}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit for Approval
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Attendance Broadsheet Dialog */}
      <Dialog open={showAttendanceBroadsheet} onOpenChange={setShowAttendanceBroadsheet}>
        <DialogContent className="max-w-[100vw] w-screen h-screen max-h-screen p-0 border-none rounded-none overflow-hidden flex flex-col">
          <DialogHeader className="sr-only">
            <DialogTitle>Attendance Broadsheet</DialogTitle>
            <DialogDescription>Full screen attendance broadsheet view</DialogDescription>
          </DialogHeader>
          <AttendanceBroadsheet 
            onClose={() => setShowAttendanceBroadsheet(false)} 
            classLevel={assignedClass}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};