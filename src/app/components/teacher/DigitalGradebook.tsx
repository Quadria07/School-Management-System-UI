import React, { useState } from 'react';
import {
  Save,
  Download,
  Upload,
  Search,
  Filter,
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  BarChart3,
  MessageSquare,
  Eye,
  Lock,
  Pencil
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';
import { StudentReportCard } from '../principal/StudentReportCard';
import schoolLogo from 'figma:asset/05e5dcd127c3f9119091f655ee2db41390342c66.png';
import { getStudentPhoto } from '@/utils/studentPhotoHelper';

interface SubjectScore {
  subject: string;
  periodicTest: number | null;
  midTermTest: number | null;
  qp: number | null;
  cp: number | null;
  exam: number | null;
  total: number;
  grade: string;
}

interface StudentCAResult {
  id: string;
  studentName: string;
  admissionNumber: string;
  periodicTest: number | null;
  midTermTest: number | null;
  qp: number | null;
  cp: number | null;
  total: number;
  percentage: number;
  grade: string;
  position: number;
  remark?: string;
}

interface StudentTermResult {
  id: string;
  studentName: string;
  admissionNumber: string;
  subjects: SubjectScore[];
  totalScore: number;
  average: number;
  grade: string;
  position: number;
  remark: string;
}

interface StudentBroadsheet {
  id: string;
  studentName: string;
  admissionNumber: string;
  subjects: SubjectScore[];
  totalScore: number;
  average: number;
  overallGrade: string;
  position: number;
  remarks: string;
}

// Grading scale (configurable by Proprietor)
const GRADING_SCALE = [
  { min: 90, max: 100, grade: 'A', remark: 'Excellent' },
  { min: 80, max: 89, grade: 'A-', remark: 'Very Good' },
  { min: 70, max: 79, grade: 'B', remark: 'Good' },
  { min: 60, max: 69, grade: 'C', remark: 'Fair' },
  { min: 50, max: 59, grade: 'D', remark: 'Pass' },
  { min: 0, max: 49, grade: 'F', remark: 'Fail' },
];

// Helper components to avoid React.Fragment issues
const TermHeaderCells: React.FC = () => (
  <>
    <th className="text-center p-2 text-xs border-l">PT (10)</th>
    <th className="text-center p-2 text-xs">MT (10)</th>
    <th className="text-center p-2 text-xs">Q&P (5)</th>
    <th className="text-center p-2 text-xs">C/P (5)</th>
    <th className="text-center p-2 text-xs">Exam (70)</th>
    <th className="text-center p-2 text-xs">Tot</th>
  </>
);

const BroadsheetHeaderCells: React.FC = () => (
  <>
    <th className="text-center p-2 text-xs border-l">PT</th>
    <th className="text-center p-2 text-xs">MT</th>
    <th className="text-center p-2 text-xs">Q&P</th>
    <th className="text-center p-2 text-xs">C/P</th>
    <th className="text-center p-2 text-xs">Exam</th>
    <th className="text-center p-2 text-xs">Tot</th>
    <th className="text-center p-2 text-xs">Grd</th>
  </>
);

interface TermScoreCellsProps {
  subject: SubjectScore;
  studentId: string;
  subIdx: number;
  handleScoreChange: (studentId: string, subIdx: number, field: string, value: string) => void;
  caDisabled?: boolean;
  examDisabled?: boolean;
}

const TermScoreCells: React.FC<TermScoreCellsProps> = ({ subject, studentId, subIdx, handleScoreChange, caDisabled, examDisabled }) => (
  <>
    <td className="p-1 border-l">
      <Input
        type="number"
        min="0"
        max="10"
        value={subject.periodicTest ?? ''}
        onChange={(e) => handleScoreChange(studentId, subIdx, 'periodicTest', e.target.value)}
        className="w-10 text-center h-8 text-xs p-1"
        disabled={caDisabled}
      />
    </td>
    <td className="p-1">
      <Input
        type="number"
        min="0"
        max="10"
        value={subject.midTermTest ?? ''}
        onChange={(e) => handleScoreChange(studentId, subIdx, 'midTermTest', e.target.value)}
        className="w-10 text-center h-8 text-xs p-1"
        disabled={caDisabled}
      />
    </td>
    <td className="p-1">
      <Input
        type="number"
        min="0"
        max="5"
        value={subject.qp ?? ''}
        onChange={(e) => handleScoreChange(studentId, subIdx, 'qp', e.target.value)}
        className="w-10 text-center h-8 text-xs p-1"
        disabled={caDisabled}
      />
    </td>
    <td className="p-1">
      <Input
        type="number"
        min="0"
        max="5"
        value={subject.cp ?? ''}
        onChange={(e) => handleScoreChange(studentId, subIdx, 'cp', e.target.value)}
        className="w-10 text-center h-8 text-xs p-1"
        disabled={caDisabled}
      />
    </td>
    <td className="p-1">
      <Input
        type="number"
        min="0"
        max="70"
        value={subject.exam ?? ''}
        onChange={(e) => handleScoreChange(studentId, subIdx, 'exam', e.target.value)}
        className="w-12 text-center h-8 text-xs p-1"
        disabled={examDisabled}
      />
    </td>
    <td className="p-2 text-center font-medium">
      {subject.total}
    </td>
  </>
);

interface BroadsheetScoreCellsProps {
  subject: SubjectScore;
  studentId: string;
  subIdx: number;
  handleScoreChange: (studentId: string, subIdx: number, field: string, value: string) => void;
  caDisabled?: boolean;
  examDisabled?: boolean;
}

const BroadsheetScoreCells: React.FC<BroadsheetScoreCellsProps> = ({ subject, studentId, subIdx, handleScoreChange, caDisabled, examDisabled }) => (
  <>
    <td className="p-1 border-l">
      <Input
        type="number"
        min="0"
        max="10"
        value={subject.periodicTest ?? ''}
        onChange={(e) => handleScoreChange(studentId, subIdx, 'periodicTest', e.target.value)}
        className="w-10 text-center h-8 text-xs p-1"
        disabled={caDisabled}
      />
    </td>
    <td className="p-1">
      <Input
        type="number"
        min="0"
        max="10"
        value={subject.midTermTest ?? ''}
        onChange={(e) => handleScoreChange(studentId, subIdx, 'midTermTest', e.target.value)}
        className="w-10 text-center h-8 text-xs p-1"
        disabled={caDisabled}
      />
    </td>
    <td className="p-1">
      <Input
        type="number"
        min="0"
        max="5"
        value={subject.qp ?? ''}
        onChange={(e) => handleScoreChange(studentId, subIdx, 'qp', e.target.value)}
        className="w-10 text-center h-8 text-xs p-1"
        disabled={caDisabled}
      />
    </td>
    <td className="p-1">
      <Input
        type="number"
        min="0"
        max="5"
        value={subject.cp ?? ''}
        onChange={(e) => handleScoreChange(studentId, subIdx, 'cp', e.target.value)}
        className="w-10 text-center h-8 text-xs p-1"
        disabled={caDisabled}
      />
    </td>
    <td className="p-1">
      <Input
        type="number"
        min="0"
        max="70"
        value={subject.exam ?? ''}
        onChange={(e) => handleScoreChange(studentId, subIdx, 'exam', e.target.value)}
        className="w-12 text-center h-8 text-xs p-1"
        disabled={examDisabled}
      />
    </td>
    <td className="p-2 text-center font-medium">
      {subject.total}
    </td>
    <td className="p-2 text-center">
      <Badge variant="outline" className="text-xs px-1">
        {subject.grade}
      </Badge>
    </td>
  </>
);

export const DigitalGradebook: React.FC = () => {
  const [activeTab, setActiveTab] = useState('ca-results');
  const [selectedClass, setSelectedClass] = useState('JSS 3A');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [selectedTerm, setSelectedTerm] = useState('First Term');
  const [selectedSession, setSelectedSession] = useState('2024/2025');
  const [searchQuery, setSearchQuery] = useState('');
  const [showRemarkDialog, setShowRemarkDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [tempRemark, setTempRemark] = useState('');
  const [showReportCardDialog, setShowReportCardDialog] = useState(false);
  const [reportCardData, setReportCardData] = useState<any>(null);
  // Track submission status per class
  const [submittedClasses, setSubmittedClasses] = useState<Record<string, boolean>>({});
  const [resultType, setResultType] = useState<'ca' | 'term'>('term');
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);

  // Load data from localStorage on mount and poll for status changes
  React.useEffect(() => {
    const loadData = () => {
      const savedTermResults = localStorage.getItem('gradebook_term_results');
      const savedStatus = localStorage.getItem('gradebook_submitted_classes');
      
      if (savedTermResults) {
        // We only load results on initial mount to avoid overwriting ongoing edits
      }
      if (savedStatus) {
        setSubmittedClasses(JSON.parse(savedStatus));
      }
    };

    // Initial load
    const savedTermResults = localStorage.getItem('gradebook_term_results');
    if (savedTermResults) {
        // Migration of old data structure would happen here if needed, but for now we reset or assume compatible
        // Since we changed interface, we might need to be careful. 
        // For this task, we will reset to new mock data structure if the data is incompatible or just let the new state take over.
        // setTermResults(JSON.parse(savedTermResults)); 
    }
    loadData();

    // Poll for submission status changes
    const interval = setInterval(() => {
        const savedStatus = localStorage.getItem('gradebook_submitted_classes');
        if (savedStatus) {
            setSubmittedClasses(JSON.parse(savedStatus));
        }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Check if current class is submitted (granular locks)
  const isCALocked = submittedClasses[`${selectedClass}_ca`] === true;
  const isTermLocked = submittedClasses[`${selectedClass}_term`] === true;
  // Legacy lock check for backward compatibility
  const isLegacyLocked = submittedClasses[selectedClass] === true;
  const isLockedGlobal = isLegacyLocked; 

  // Save data to localStorage whenever it changes (auto-save or manual save)
  const saveToStorage = (results: StudentTermResult[], status: Record<string, boolean>) => {
    // Read latest data from storage to avoid overwriting other subjects/changes
    const currentStorage = localStorage.getItem('gradebook_term_results');
    let mergedResults = results;

    if (currentStorage) {
      // Logic simplified for this update: we will just overwrite for now to ensure new structure persists
    }

    localStorage.setItem('gradebook_term_results', JSON.stringify(mergedResults));
    localStorage.setItem('gradebook_submitted_classes', JSON.stringify(status));
    
    // Update local state to reflect the merge (optional, but good for consistency)
    setTermResults(mergedResults);
  };

  const [caResults, setCAResults] = useState<StudentCAResult[]>([
    {
      id: '1',
      studentName: 'Adebayo Oluwaseun',
      admissionNumber: 'BFO/2023/001',
      periodicTest: 9,
      midTermTest: 9,
      qp: 4,
      cp: 5,
      total: 27,
      percentage: 90,
      grade: 'A',
      position: 1,
      remark: 'Excellent work'
    },
    {
      id: '2',
      studentName: 'Chioma Nwosu',
      admissionNumber: 'BFO/2023/002',
      periodicTest: 8,
      midTermTest: 8,
      qp: 4,
      cp: 4,
      total: 24,
      percentage: 80,
      grade: 'A-',
      position: 2,
    },
    {
      id: '3',
      studentName: 'Ibrahim Yusuf',
      admissionNumber: 'BFO/2023/003',
      periodicTest: 7,
      midTermTest: 8,
      qp: 3,
      cp: 4,
      total: 22,
      percentage: 73.3,
      grade: 'B',
      position: 3,
    },
    {
      id: '4',
      studentName: 'Grace Okonkwo',
      admissionNumber: 'BFO/2023/004',
      periodicTest: 6,
      midTermTest: 7,
      qp: 3,
      cp: 3,
      total: 19,
      percentage: 63.3,
      grade: 'C',
      position: 4,
    },
    {
      id: '5',
      studentName: 'Daniel Akintola',
      admissionNumber: 'BFO/2023/005',
      periodicTest: 5,
      midTermTest: 6,
      qp: 2,
      cp: 3,
      total: 16,
      percentage: 53.3,
      grade: 'D',
      position: 5,
    },
  ]);

  // Term Results State
  const [termResults, setTermResults] = useState<StudentTermResult[]>([
    {
      id: '1',
      studentName: 'Adebayo Oluwaseun',
      admissionNumber: 'BFO/2023/001',
      subjects: [
        { subject: 'Mathematics', periodicTest: 9, midTermTest: 9, qp: 5, cp: 5, exam: 60, total: 88, grade: 'A-' },
        { subject: 'English', periodicTest: 8, midTermTest: 8, qp: 4, cp: 5, exam: 58, total: 83, grade: 'A-' },
        { subject: 'Physics', periodicTest: 9, midTermTest: 9, qp: 5, cp: 5, exam: 62, total: 90, grade: 'A' },
        { subject: 'Chemistry', periodicTest: 8, midTermTest: 9, qp: 4, cp: 4, exam: 60, total: 85, grade: 'A-' },
        { subject: 'Biology', periodicTest: 9, midTermTest: 8, qp: 5, cp: 4, exam: 59, total: 85, grade: 'A-' },
      ],
      totalScore: 431,
      average: 86.2,
      grade: 'A-',
      position: 1,
      remark: 'Excellent all-round performance',
    },
    {
      id: '2',
      studentName: 'Chioma Nwosu',
      admissionNumber: 'BFO/2023/002',
      subjects: [
        { subject: 'Mathematics', periodicTest: 8, midTermTest: 8, qp: 4, cp: 4, exam: 55, total: 79, grade: 'B' },
        { subject: 'English', periodicTest: 9, midTermTest: 8, qp: 5, cp: 4, exam: 56, total: 82, grade: 'A-' },
        { subject: 'Physics', periodicTest: 7, midTermTest: 8, qp: 4, cp: 3, exam: 54, total: 76, grade: 'B' },
        { subject: 'Chemistry', periodicTest: 8, midTermTest: 7, qp: 4, cp: 4, exam: 55, total: 78, grade: 'B' },
        { subject: 'Biology', periodicTest: 8, midTermTest: 8, qp: 4, cp: 4, exam: 56, total: 80, grade: 'A-' },
      ],
      totalScore: 395,
      average: 79,
      grade: 'B',
      position: 2,
      remark: 'Consistent performance across all subjects',
    },
  ]);

  // Broadsheet State
  const [broadsheet, setBroadsheet] = useState<StudentBroadsheet[]>([
    {
      id: '1',
      studentName: 'Adebayo Oluwaseun',
      admissionNumber: 'BFO/2023/001',
      subjects: [
        { subject: 'Mathematics', periodicTest: 9, midTermTest: 9, qp: 5, cp: 5, exam: 60, total: 88, grade: 'A-' },
        { subject: 'English', periodicTest: 8, midTermTest: 8, qp: 4, cp: 5, exam: 58, total: 83, grade: 'A-' },
        { subject: 'Physics', periodicTest: 9, midTermTest: 9, qp: 5, cp: 5, exam: 62, total: 90, grade: 'A' },
        { subject: 'Chemistry', periodicTest: 8, midTermTest: 9, qp: 4, cp: 4, exam: 60, total: 85, grade: 'A-' },
        { subject: 'Biology', periodicTest: 9, midTermTest: 8, qp: 5, cp: 4, exam: 59, total: 85, grade: 'A-' },
        { subject: 'Economics', periodicTest: 8, midTermTest: 9, qp: 5, cp: 4, exam: 61, total: 87, grade: 'A-' },
        { subject: 'Geography', periodicTest: 9, midTermTest: 8, qp: 4, cp: 5, exam: 60, total: 86, grade: 'A-' },
      ],
      totalScore: 604,
      average: 86.28,
      overallGrade: 'A-',
      position: 1,
      remarks: 'Excellent performance. A brilliant student with strong work ethic.',
    },
    {
      id: '2',
      studentName: 'Chioma Nwosu',
      admissionNumber: 'BFO/2023/002',
      subjects: [
        { subject: 'Mathematics', periodicTest: 8, midTermTest: 8, qp: 4, cp: 4, exam: 55, total: 79, grade: 'B' },
        { subject: 'English', periodicTest: 9, midTermTest: 8, qp: 5, cp: 4, exam: 56, total: 82, grade: 'A-' },
        { subject: 'Physics', periodicTest: 7, midTermTest: 8, qp: 4, cp: 3, exam: 54, total: 76, grade: 'B' },
        { subject: 'Chemistry', periodicTest: 8, midTermTest: 7, qp: 4, cp: 4, exam: 55, total: 78, grade: 'B' },
        { subject: 'Biology', periodicTest: 8, midTermTest: 8, qp: 4, cp: 4, exam: 56, total: 80, grade: 'A-' },
        { subject: 'Economics', periodicTest: 7, midTermTest: 8, qp: 4, cp: 4, exam: 57, total: 80, grade: 'A-' },
        { subject: 'Geography', periodicTest: 8, midTermTest: 7, qp: 4, cp: 3, exam: 55, total: 77, grade: 'B' },
      ],
      totalScore: 552,
      average: 78.85,
      overallGrade: 'B',
      position: 2,
      remarks: 'Consistent and hardworking. Keep up the good work.',
    },
  ]);

  // Auto-calculate total and grade for CA Results
  const calculateCATotal = (student: StudentCAResult) => {
    const periodicTest = student.periodicTest || 0;
    const midTermTest = student.midTermTest || 0;
    const qp = student.qp || 0;
    const cp = student.cp || 0;
    return periodicTest + midTermTest + qp + cp;
  };

  const calculateCAPercentage = (total: number) => {
    return (total / 30) * 100;
  };

  // Auto-calculate total and grade for Term/Broadsheet
  const calculateTotal = (student: SubjectScore) => {
    const periodicTest = student.periodicTest || 0;
    const midTermTest = student.midTermTest || 0;
    const qp = student.qp || 0;
    const cp = student.cp || 0;
    const exam = student.exam || 0;
    return periodicTest + midTermTest + qp + cp + exam;
  };

  const getGrade = (percentage: number): string => {
    const gradeInfo = GRADING_SCALE.find(
      (scale) => percentage >= scale.min && percentage <= scale.max
    );
    return gradeInfo ? gradeInfo.grade : 'F';
  };

  const getGradeRemark = (percentage: number): string => {
    const gradeInfo = GRADING_SCALE.find(
      (scale) => percentage >= scale.min && percentage <= scale.max
    );
    return gradeInfo ? gradeInfo.remark : 'Fail';
  };

  const getOrdinalSuffix = (i: number) => {
    const j = i % 10,
      k = i % 100;
    if (j === 1 && k !== 11) {
      return 'st';
    }
    if (j === 2 && k !== 12) {
      return 'nd';
    }
    if (j === 3 && k !== 13) {
      return 'rd';
    }
    return 'th';
  };

  // CA Results Handlers
  const handleCAScoreChange = (
    studentId: string,
    field: 'periodicTest' | 'midTermTest' | 'qp' | 'cp',
    value: string
  ) => {
    const numValue = value === '' ? null : parseInt(value);

    setCAResults((prev) => {
      const updated = prev.map((student) => {
        if (student.id === studentId) {
          const updatedStudent = { ...student, [field]: numValue };
          updatedStudent.total = calculateCATotal(updatedStudent);
          updatedStudent.percentage = calculateCAPercentage(updatedStudent.total);
          updatedStudent.grade = getGrade(updatedStudent.percentage);
          return updatedStudent;
        }
        return student;
      });

      // Recalculate positions based on total (highest first)
      const sorted = [...updated].sort((a, b) => b.total - a.total);
      return updated.map(student => ({
        ...student,
        position: sorted.findIndex(s => s.id === student.id) + 1
      }));
    });
  };

  // Term Results Handlers
  const handleTermScoreChange = (
    studentId: string,
    subjectIndex: number,
    field: 'periodicTest' | 'midTermTest' | 'qp' | 'cp' | 'exam',
    value: string
  ) => {
    const numValue = value === '' ? null : parseInt(value);

    setTermResults((prev) =>
      prev.map((student) => {
        if (student.id === studentId) {
          const updatedSubjects = [...student.subjects];
          updatedSubjects[subjectIndex] = {
            ...updatedSubjects[subjectIndex],
            [field]: numValue,
          };
          updatedSubjects[subjectIndex].total = calculateTotal(
            updatedSubjects[subjectIndex]
          );
          updatedSubjects[subjectIndex].grade = getGrade(
            updatedSubjects[subjectIndex].total
          );

          const totalScore = updatedSubjects.reduce(
            (sum, subject) => sum + subject.total,
            0
          );
          const average = totalScore / updatedSubjects.length;

          return {
            ...student,
            subjects: updatedSubjects,
            totalScore,
            average,
            grade: getGrade(average),
          };
        }
        return student;
      })
    );
  };

  // Broadsheet Handlers
  const handleBroadsheetScoreChange = (
    studentId: string,
    subjectIndex: number,
    field: 'periodicTest' | 'midTermTest' | 'qp' | 'cp' | 'exam',
    value: string
  ) => {
    const numValue = value === '' ? null : parseInt(value);

    setBroadsheet((prev) =>
      prev.map((student) => {
        if (student.id === studentId) {
          const updatedSubjects = [...student.subjects];
          updatedSubjects[subjectIndex] = {
            ...updatedSubjects[subjectIndex],
            [field]: numValue,
          };
          updatedSubjects[subjectIndex].total = calculateTotal(
            updatedSubjects[subjectIndex]
          );
          updatedSubjects[subjectIndex].grade = getGrade(
            updatedSubjects[subjectIndex].total
          );

          const totalScore = updatedSubjects.reduce(
            (sum, subject) => sum + subject.total,
            0
          );
          const average = totalScore / updatedSubjects.length;

          return {
            ...student,
            subjects: updatedSubjects,
            totalScore,
            average,
            overallGrade: getGrade(average),
          };
        }
        return student;
      })
    );
  };

  // Remark Handlers
  const handleAddRemark = (student: any, tabType: string) => {
    setSelectedStudent({ ...student, tabType });
    setTempRemark(student.remark || student.remarks || '');
    setShowRemarkDialog(true);
  };

  const handleSaveRemark = () => {
    if (!selectedStudent) return;

    const { tabType } = selectedStudent;

    if (tabType === 'ca') {
      setCAResults((prev) =>
        prev.map((student) =>
          student.id === selectedStudent.id
            ? { ...student, remark: tempRemark }
            : student
        )
      );
    } else if (tabType === 'term') {
      setTermResults((prev) =>
        prev.map((student) =>
          student.id === selectedStudent.id
            ? { ...student, remark: tempRemark }
            : student
        )
      );
    } else if (tabType === 'broadsheet') {
      setBroadsheet((prev) =>
        prev.map((student) =>
          student.id === selectedStudent.id
            ? { ...student, remarks: tempRemark }
            : student
        )
      );
    }

    toast.success('Remark saved successfully');
    setShowRemarkDialog(false);
  };

  const handleSaveGrades = () => {
    saveToStorage(termResults, submittedClasses);
    toast.success('Grades saved successfully');
  };

  const handleSubmitToAdmin = () => {
    const newSubmittedClasses = { ...submittedClasses, [selectedClass]: true };
    setSubmittedClasses(newSubmittedClasses);
    saveToStorage(termResults, newSubmittedClasses);
    toast.success(`Results for ${selectedClass} submitted to Administrator for approval`);
  };

  const handleExportToExcel = () => {
    toast.success('Results exported to Excel');
  };

  const handleViewReportCard = (studentId: string, type: 'ca' | 'term') => {
    let studentData;
    let subjects = [];

    // Comprehensive list of mock subjects
    const mockSubjects = [
      { subject: 'MATHEMATICS', periodicTest: 9, midTermTest: 9, qp: 4, cp: 5, exam: 55, total: 82, grade: 'A-', remark: 'VERY GOOD' },
      { subject: 'ENGLISH LANGUAGE', periodicTest: 8, midTermTest: 8, qp: 4, cp: 5, exam: 48, total: 73, grade: 'B', remark: 'GOOD' },
      { subject: 'BASIC SCIENCE', periodicTest: 8, midTermTest: 8, qp: 3, cp: 4, exam: 49, total: 72, grade: 'B', remark: 'GOOD' },
      // Add more mock subjects as needed
    ];

    if (type === 'term') {
      studentData = termResults.find(s => s.id === studentId);
      if (studentData) {
        // Create base subjects from mock data, excluding the current subject if it exists
        subjects = mockSubjects.filter(s => s.subject !== selectedSubject.toUpperCase()).map(s => ({
          ...s,
          average: 70 + Math.floor(Math.random() * 10),
          rank: `${Math.floor(Math.random() * 10) + 1}th`
        }));

        // Find the current graded subject
        const currentSubject = studentData.subjects.find(s => s.subject === selectedSubject);
        
        // Add current subject to the list
        if (currentSubject) {
          subjects.unshift({
            subject: currentSubject.subject.toUpperCase(),
            periodicTest: currentSubject.periodicTest,
            midTermTest: currentSubject.midTermTest,
            qp: currentSubject.qp,
            cp: currentSubject.cp,
            exam: currentSubject.exam,
            total: currentSubject.total,
            grade: currentSubject.grade,
            average: 72.5, // Consistent with table class average
            rank: `${studentData.position}${getOrdinalSuffix(studentData.position)}`, // Consistent with student position
            remark: getGradeRemark(currentSubject.total)
          });
        }
      }
    } else {
      studentData = caResults.find(s => s.id === studentId);
      if (studentData) {
        // Create base subjects from mock data for CA view
        subjects = mockSubjects.filter(s => s.subject !== selectedSubject.toUpperCase()).map(s => ({
          subject: s.subject,
          periodicTest: s.periodicTest,
          midTermTest: s.midTermTest,
          qp: s.qp,
          cp: s.cp,
          caTotal: (s.periodicTest || 0) + (s.midTermTest || 0) + (s.qp || 0) + (s.cp || 0),
          percentScore: (((s.periodicTest || 0) + (s.midTermTest || 0) + (s.qp || 0) + (s.cp || 0)) / 30) * 100,
          grade: getGrade((((s.periodicTest || 0) + (s.midTermTest || 0) + (s.qp || 0) + (s.cp || 0)) / 30) * 100),
          remark: s.remark
        }));

        // Add current subject
        subjects.unshift({
          subject: selectedSubject.toUpperCase(),
          periodicTest: studentData.periodicTest,
          midTermTest: studentData.midTermTest,
          qp: studentData.qp,
          cp: studentData.cp,
          caTotal: studentData.total,
          percentScore: studentData.percentage,
          grade: studentData.grade,
          remark: getGradeRemark(studentData.percentage)
        });
      }
    }

    if (studentData) {
        setReportCardData({
            ...studentData,
            passportPhoto: getStudentPhoto(studentData.studentName),
            overallPosition: studentData.position,
            overallGrade: (studentData as any).grade || (studentData as any).overallGrade,
            remarks: (studentData as any).remark || (studentData as any).remarks,
            attendance: '65/65',
            gender: 'Male',
            dob: '2012-05-15',
        });
        setResultType(type);
        setReportCardData((prev: any) => ({
            ...prev, 
            mappedSubjects: subjects,
            highlightedSubject: selectedSubject 
        }));
        setShowReportCardDialog(true);
    }
  };


  // Filter students
  const filteredCAResults = caResults.filter(
    (student) =>
      student.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTermResults = termResults.filter(
    (student) =>
      student.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBroadsheet = broadsheet.filter(
    (student) =>
      student.studentName.toLowerCase().includes(searchQuery.toLowerCase()) 
  );

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-950 mb-2">Digital Gradebook</h1>
          <p className="text-gray-600">Manage student assessments, compute results, and generate broadsheets.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" onClick={handleExportToExcel}>
            <Download className="w-4 h-4 mr-2" />
            Export to Excel
          </Button>
           {activeTab !== 'broadsheet' && (
             <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveGrades}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
             </Button>
           )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-end">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                <div className="space-y-2">
                   <label className="text-xs font-medium text-gray-500">Class</label>
                   <Select value={selectedClass} onValueChange={setSelectedClass}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                         <SelectItem value="JSS 3A">JSS 3A</SelectItem>
                         <SelectItem value="JSS 3B">JSS 3B</SelectItem>
                         <SelectItem value="SSS 1A">SSS 1A</SelectItem>
                      </SelectContent>
                   </Select>
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-medium text-gray-500">Subject</label>
                   <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                         <SelectItem value="Mathematics">Mathematics</SelectItem>
                         <SelectItem value="English">English</SelectItem>
                         <SelectItem value="Physics">Physics</SelectItem>
                      </SelectContent>
                   </Select>
                </div>
                 <div className="space-y-2">
                   <label className="text-xs font-medium text-gray-500">Term</label>
                   <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                         <SelectItem value="First Term">First Term</SelectItem>
                         <SelectItem value="Second Term">Second Term</SelectItem>
                         <SelectItem value="Third Term">Third Term</SelectItem>
                      </SelectContent>
                   </Select>
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-medium text-gray-500">Session</label>
                   <Select value={selectedSession} onValueChange={setSelectedSession}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                         <SelectItem value="2024/2025">2024/2025</SelectItem>
                      </SelectContent>
                   </Select>
                </div>
             </div>
          </div>
        </CardHeader>
        <CardContent>
           <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                 <TabsTrigger value="ca-results">CA Results</TabsTrigger>
                 <TabsTrigger value="term-results">Term Results</TabsTrigger>
                 <TabsTrigger value="broadsheet">Broadsheet</TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2 mb-4">
                 <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input 
                      placeholder="Search student..." 
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                 </div>
                 {/* Lock Status Indicators */}
                 {activeTab === 'ca-results' && (
                    isCALocked ? (
                        <Badge variant="secondary" className="bg-red-100 text-red-700 flex items-center gap-1">
                            <Lock className="w-3 h-3" /> CA Locked
                        </Badge>
                    ) : (
                        <Badge variant="secondary" className="bg-green-100 text-green-700 flex items-center gap-1">
                            <Pencil className="w-3 h-3" /> CA Editable
                        </Badge>
                    )
                 )}
                 {activeTab === 'term-results' && (
                    isTermLocked ? (
                        <Badge variant="secondary" className="bg-red-100 text-red-700 flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Term Locked
                        </Badge>
                    ) : (
                        <Badge variant="secondary" className="bg-green-100 text-green-700 flex items-center gap-1">
                            <Pencil className="w-3 h-3" /> Term Editable
                        </Badge>
                    )
                 )}
              </div>

              {/* CA Results Tab */}
              <TabsContent value="ca-results">
                 <div className="border rounded-md overflow-x-auto">
                    <table className="w-full text-sm">
                       <thead className="bg-gray-50 border-b">
                          <tr>
                             <th className="text-left p-3 font-medium">S/N</th>
                             <th className="text-left p-3 font-medium">Student Name</th>
                             <th className="text-center p-3 font-medium">PT (10)</th>
                             <th className="text-center p-3 font-medium">MT (10)</th>
                             <th className="text-center p-3 font-medium">Q&P (5)</th>
                             <th className="text-center p-3 font-medium">C/P (5)</th>
                             <th className="text-center p-3 font-medium">Total (30)</th>
                             <th className="text-center p-3 font-medium">% Score</th>
                             <th className="text-center p-3 font-medium">Grade</th>
                             <th className="text-center p-3 font-medium">Position</th>
                             <th className="text-center p-3 font-medium">Actions</th>
                          </tr>
                       </thead>
                       <tbody>
                          {filteredCAResults.map((student, index) => (
                             <tr key={student.id} className="border-b last:border-0 hover:bg-gray-50">
                                <td className="p-3">{index + 1}</td>
                                <td className="p-3 font-medium">
                                   <div>{student.studentName}</div>
                                   <div className="text-xs text-gray-500">{student.admissionNumber}</div>
                                </td>
                                <td className="p-1 text-center">
                                   <Input 
                                      type="number" min="0" max="10"
                                      value={student.periodicTest ?? ''}
                                      onChange={(e) => handleCAScoreChange(student.id, 'periodicTest', e.target.value)}
                                      className="w-16 h-8 text-center mx-auto"
                                      disabled={isCALocked}
                                   />
                                </td>
                                <td className="p-1 text-center">
                                   <Input 
                                      type="number" min="0" max="10"
                                      value={student.midTermTest ?? ''}
                                      onChange={(e) => handleCAScoreChange(student.id, 'midTermTest', e.target.value)}
                                      className="w-16 h-8 text-center mx-auto"
                                      disabled={isCALocked}
                                   />
                                </td>
                                <td className="p-1 text-center">
                                   <Input 
                                      type="number" min="0" max="5"
                                      value={student.qp ?? ''}
                                      onChange={(e) => handleCAScoreChange(student.id, 'qp', e.target.value)}
                                      className="w-16 h-8 text-center mx-auto"
                                      disabled={isCALocked}
                                   />
                                </td>
                                <td className="p-1 text-center">
                                   <Input 
                                      type="number" min="0" max="5"
                                      value={student.cp ?? ''}
                                      onChange={(e) => handleCAScoreChange(student.id, 'cp', e.target.value)}
                                      className="w-16 h-8 text-center mx-auto"
                                      disabled={isCALocked}
                                   />
                                </td>
                                <td className="p-3 text-center font-bold text-blue-600">{student.total}</td>
                                <td className="p-3 text-center text-xs text-gray-500">{student.percentage.toFixed(1)}%</td>
                                <td className="p-3 text-center">
                                   <Badge variant={student.grade === 'F' ? 'destructive' : 'outline'}>{student.grade}</Badge>
                                </td>
                                <td className="p-3 text-center">{student.position}{getOrdinalSuffix(student.position)}</td>
                                <td className="p-3 text-center">
                                   <div className="flex justify-center gap-2">
                                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500" onClick={() => handleAddRemark(student, 'ca')}>
                                         <MessageSquare className="w-4 h-4" />
                                      </Button>
                                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600" onClick={() => handleViewReportCard(student.id, 'ca')}>
                                         <Eye className="w-4 h-4" />
                                      </Button>
                                   </div>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
                 <div className="mt-4 flex justify-end">
                    <Button 
                        onClick={handleSubmitToAdmin} 
                        className="bg-green-600 hover:bg-green-700"
                        disabled={isCALocked}
                    >
                       <CheckCircle2 className="w-4 h-4 mr-2" />
                       {isCALocked ? 'CA Submitted' : 'Submit CA Results'}
                    </Button>
                 </div>
              </TabsContent>

              {/* Term Results Tab */}
              <TabsContent value="term-results">
                 <div className="border rounded-md overflow-x-auto">
                    <table className="w-full text-sm">
                       <thead className="bg-gray-50 border-b">
                          <tr>
                             <th className="text-left p-3 font-medium w-12">S/N</th>
                             <th className="text-left p-3 font-medium min-w-[200px]">Student Name</th>
                             {/* Only showing for selected Subject */}
                             <TermHeaderCells />
                             <th className="text-center p-3 font-medium">Avg</th>
                             <th className="text-center p-3 font-medium">Grd</th>
                             <th className="text-center p-3 font-medium">Actions</th>
                          </tr>
                       </thead>
                       <tbody>
                          {filteredTermResults.map((student, index) => {
                             const subject = student.subjects.find(s => s.subject === selectedSubject) || {
                                subject: selectedSubject, periodicTest: null, midTermTest: null, qp: null, cp: null, exam: null, total: 0, grade: '-'
                             };
                             const subIdx = student.subjects.findIndex(s => s.subject === selectedSubject);
                             
                             return (
                                <tr key={student.id} className="border-b last:border-0 hover:bg-gray-50">
                                   <td className="p-3 text-xs">{index + 1}</td>
                                   <td className="p-3 font-medium">
                                      <div className="text-sm">{student.studentName}</div>
                                      <div className="text-xs text-gray-500">{student.admissionNumber}</div>
                                   </td>
                                   <TermScoreCells 
                                      subject={subject} 
                                      studentId={student.id} 
                                      subIdx={subIdx !== -1 ? subIdx : 0} 
                                      handleScoreChange={handleTermScoreChange}
                                      caDisabled={isCALocked} // Should CA be editable in Term view? Usually locked if CA submitted
                                      examDisabled={isTermLocked}
                                   />
                                   <td className="p-3 text-center text-xs">{student.average.toFixed(1)}</td>
                                   <td className="p-3 text-center">
                                      <Badge variant={student.grade === 'F' ? 'destructive' : 'outline'} className="text-xs px-1">{student.grade}</Badge>
                                   </td>
                                   <td className="p-3 text-center">
                                      <div className="flex justify-center gap-2">
                                         <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500" onClick={() => handleAddRemark(student, 'term')}>
                                            <MessageSquare className="w-4 h-4" />
                                         </Button>
                                         <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600" onClick={() => handleViewReportCard(student.id, 'term')}>
                                            <Eye className="w-4 h-4" />
                                         </Button>
                                      </div>
                                   </td>
                                </tr>
                             );
                          })}
                       </tbody>
                    </table>
                 </div>
                 <div className="mt-4 flex justify-end">
                    <Button 
                        onClick={handleSubmitToAdmin} 
                        className="bg-green-600 hover:bg-green-700"
                        disabled={isTermLocked}
                    >
                       <CheckCircle2 className="w-4 h-4 mr-2" />
                       {isTermLocked ? 'Term Submitted' : 'Submit Term Results'}
                    </Button>
                 </div>
              </TabsContent>

              {/* Broadsheet Tab */}
              <TabsContent value="broadsheet">
                 <div className="border rounded-md overflow-x-auto">
                    <table className="w-full text-sm">
                       <thead className="bg-gray-50 border-b">
                          <tr>
                             <th className="text-left p-3 font-medium min-w-[200px] sticky left-0 bg-gray-50 z-10">Student</th>
                             {/* For Broadsheet, showing specific subject columns or summary? Usually all subjects. 
                                 For simplicity in this component, we only show selected subject details + overall summary
                             */}
                             <th className="text-center p-2 text-xs border-l font-bold text-blue-800" colSpan={7}>{selectedSubject}</th>
                             <th className="text-center p-3 font-medium border-l">Total Score</th>
                             <th className="text-center p-3 font-medium">Average</th>
                             <th className="text-center p-3 font-medium">Pos</th>
                             <th className="text-center p-3 font-medium">Actions</th>
                          </tr>
                          <tr className="bg-gray-100 border-b">
                             <th className="sticky left-0 bg-gray-100 z-10"></th>
                             <BroadsheetHeaderCells />
                             <th colSpan={4}></th>
                          </tr>
                       </thead>
                       <tbody>
                          {filteredBroadsheet.map((student) => {
                             const subject = student.subjects.find(s => s.subject === selectedSubject) || {
                                subject: selectedSubject, periodicTest: null, midTermTest: null, qp: null, cp: null, exam: null, total: 0, grade: '-'
                             };
                             // Finding index in the mock broadsheet data
                             const subIdx = student.subjects.findIndex(s => s.subject === selectedSubject);

                             return (
                                <tr key={student.id} className="border-b last:border-0 hover:bg-gray-50">
                                   <td className="p-3 font-medium sticky left-0 bg-white z-10 border-r shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                      <div className="text-sm">{student.studentName}</div>
                                      <div className="text-xs text-gray-500">{student.admissionNumber}</div>
                                   </td>
                                   <BroadsheetScoreCells 
                                      subject={subject} 
                                      studentId={student.id} 
                                      subIdx={subIdx} 
                                      handleScoreChange={handleBroadsheetScoreChange}
                                      caDisabled={true} // Broadsheet usually read-only or final adjustments
                                      examDisabled={true}
                                   />
                                   <td className="p-3 text-center border-l font-bold">{student.totalScore}</td>
                                   <td className="p-3 text-center">{student.average.toFixed(2)}</td>
                                   <td className="p-3 text-center">{student.position}</td>
                                   <td className="p-3 text-center">
                                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500" onClick={() => handleAddRemark(student, 'broadsheet')}>
                                         <MessageSquare className="w-4 h-4" />
                                      </Button>
                                   </td>
                                </tr>
                             );
                          })}
                       </tbody>
                    </table>
                 </div>
              </TabsContent>
           </Tabs>
        </CardContent>
      </Card>

      {/* Remark Dialog */}
      <Dialog open={showRemarkDialog} onOpenChange={setShowRemarkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add/Edit Remark</DialogTitle>
            <DialogDescription>
              {selectedStudent?.studentName} - {selectedSubject}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
             <Textarea 
               value={tempRemark} 
               onChange={(e) => setTempRemark(e.target.value)}
               placeholder="Enter remark here..."
               className="min-h-[100px]"
             />
          </div>
          <DialogFooter>
             <Button variant="outline" onClick={() => setShowRemarkDialog(false)}>Cancel</Button>
             <Button onClick={handleSaveRemark}>Save Remark</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Report Card Dialog */}
      <Dialog open={showReportCardDialog} onOpenChange={setShowReportCardDialog}>
        <DialogContent className="max-w-[1000px] w-[95vw] h-[90vh] overflow-y-auto">
           <DialogHeader>
             <DialogTitle>Student Report Card</DialogTitle>
             <DialogDescription>
               Preview of the student's academic performance.
             </DialogDescription>
           </DialogHeader>
           {reportCardData && (
              <StudentReportCard
                student={reportCardData}
                term={selectedTerm}
                session={selectedSession}
                class={selectedClass}
                schoolLogo={schoolLogo}
                adminSignature={null}
                principalSignature={null}
                principalRemark="Excellent performance."
                onPrincipalRemarkChange={() => {}}
                onPrincipalSignatureUpload={() => {}}
                onRemovePrincipalSignature={() => {}}
                onAdminSignatureUpload={() => {}}
                onRemoveAdminSignature={() => {}}
                resultType={resultType}
                userRole="Teacher"
                subjects={reportCardData.mappedSubjects}
                highlightedSubject={reportCardData.highlightedSubject}
              />
           )}
        </DialogContent>
      </Dialog>
    </div>
  );
};