import React, { useState, useEffect } from 'react';
import { TeacherAPI, SchoolAPI } from '../../../utils/api';
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
// @ts-ignore
import schoolLogo from 'figma:asset/05e5dcd127c3f9119091f655ee2db41390342c66.png';
import { getStudentPhoto } from '../../../utils/studentPhotoHelper';

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
  handleScoreChange: (studentId: string, subIdx: number, field: 'periodicTest' | 'midTermTest' | 'qp' | 'cp' | 'exam', value: string) => void;
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
  handleScoreChange: (studentId: string, subIdx: number, field: 'periodicTest' | 'midTermTest' | 'qp' | 'cp' | 'exam', value: string) => void;
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
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  const [availableTerms, setAvailableTerms] = useState<string[]>([]);
  const [availableSessions, setAvailableSessions] = useState<string[]>([]);
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
  const [teacherClasses, setTeacherClasses] = useState<any[]>([]);
  const [teacherSubjects, setTeacherSubjects] = useState<string[]>([]);

  // Load academic settings and submission status
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [settingsRes, classesRes] = await Promise.all([
          SchoolAPI.getAcademicSettings(),
          TeacherAPI.getClasses()
        ]);

        if (settingsRes.status === 'success' && settingsRes.data) {
          const data = settingsRes.data as any;
          if (data.currentTerm) setSelectedTerm(data.currentTerm);
          if (data.currentSession) setSelectedSession(data.currentSession);
          if (data.terms) setAvailableTerms(data.terms);
          if (data.sessions) setAvailableSessions(data.sessions);
        }

        if (classesRes.status === 'success' && classesRes.data) {
          setTeacherClasses(classesRes.data as any[]);
          // Extract unique subjects from classes if available
          const subjects = new Set<string>();
          (classesRes.data as any[]).forEach(c => {
            if (c.subjects) c.subjects.forEach((s: string) => subjects.add(s));
            else if (c.subject) subjects.add(c.subject);
          });
          setTeacherSubjects(Array.from(subjects));
        }
      } catch (error) {
        console.error('Error fetching settings and classes:', error);
      }
    };
    loadSettings();

    const loadData = () => {
      const savedStatus = localStorage.getItem('gradebook_submitted_classes');
      if (savedStatus) {
        setSubmittedClasses(JSON.parse(savedStatus));
      }
    };

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
    localStorage.setItem('gradebook_term_results', JSON.stringify(results));
    localStorage.setItem('gradebook_submitted_classes', JSON.stringify(status));
    setTermResults(results);
  };

  const [loading, setLoading] = useState(false);
  const [caResults, setCAResults] = useState<StudentCAResult[]>([]);
  const [termResults, setTermResults] = useState<StudentTermResult[]>([]);
  const [broadsheet, setBroadsheet] = useState<StudentBroadsheet[]>([]);

  // Fetch results based on selection
  useEffect(() => {
    const fetchResults = async () => {
      if (!selectedClass) return;

      setLoading(true);
      try {
        const [studentsRes, broadsheetRes] = await Promise.all([
          TeacherAPI.getStudentsByClass(selectedClass),
          TeacherAPI.getFullBroadsheet(selectedClass, selectedTerm, selectedSession)
        ]);
        if (studentsRes.status === 'success' && studentsRes.data) {
          const studentList = studentsRes.data as any[];
          // Initialize results with student names if they are empty
          // Actually, the API might return current scores too
        }

        if (broadsheetRes.status === 'success' && broadsheetRes.data) {
          const rawData = broadsheetRes.data as any[];

          // Map to Broadsheet tab
          setBroadsheet(rawData as StudentBroadsheet[]);

          // Map to Term Results tab (all subjects for students)
          setTermResults(rawData as StudentTermResult[]);

          // Map to CA Results tab (filter by selectedSubject if available)
          if (selectedSubject) {
            const caRes: StudentCAResult[] = rawData.map(student => {
              const subjScore = student.subjects.find((s: any) => s.subject === selectedSubject);
              return {
                id: student.id,
                studentName: student.studentName,
                admissionNumber: student.admissionNumber,
                periodicTest: subjScore?.periodicTest || null,
                midTermTest: subjScore?.midTermTest || null,
                qp: subjScore?.qp || null,
                cp: subjScore?.cp || null,
                total: subjScore?.total || 0,
                percentage: ((subjScore?.total || 0) / 30) * 100,
                grade: subjScore?.grade || 'F',
                position: student.position,
                remark: student.remark
              };
            });
            setCAResults(caRes);
          } else {
            // If no subject selected, just show student list with empty scores
            const emptyCARes: StudentCAResult[] = (studentsRes.data as any[]).map(s => ({
              id: s.id,
              studentName: s.name || s.studentName,
              admissionNumber: s.admissionNumber,
              periodicTest: null,
              midTermTest: null,
              qp: null,
              cp: null,
              total: 0,
              percentage: 0,
              grade: 'F',
              position: 0
            }));
            setCAResults(emptyCARes);
          }
        }

      } catch (error) {
        console.error('Error fetching gradebook data:', error);
        toast.error('Failed to load gradebook data');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [selectedClass, selectedTerm, selectedSession, activeTab]);

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
    let subjects: any[] = [];

    const mockSubjects: any[] = [];

    if (type === 'term') {
      studentData = termResults.find(s => s.id === studentId);
      if (studentData) {
        subjects = studentData.subjects.map(s => ({
          ...s,
          subject: s.subject.toUpperCase(),
          average: 0,
          rank: '-'
        }));
      }
    } else {
      studentData = caResults.find(s => s.id === studentId);
      if (studentData) {
        subjects = [{
          subject: selectedSubject.toUpperCase(),
          periodicTest: studentData.periodicTest,
          midTermTest: studentData.midTermTest,
          qp: studentData.qp,
          cp: studentData.cp,
          caTotal: studentData.total,
          percentScore: studentData.percentage,
          grade: studentData.grade,
          remark: GRADING_SCALE.find(s => studentData.percentage >= s.min && studentData.percentage <= s.max)?.remark || "Good"
        }];
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
                    <SelectItem value="">Select Class</SelectItem>
                    {teacherClasses.map(c => (
                      <SelectItem key={c.id || c.name} value={c.name}>{c.name}</SelectItem>
                    ))}
                    {teacherClasses.length === 0 && (
                      <>
                        <SelectItem value="JSS 3A">JSS 3A</SelectItem>
                        <SelectItem value="JSS 3B">JSS 3B</SelectItem>
                        <SelectItem value="SSS 1A">SSS 1A</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500">Subject</label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Select Subject</SelectItem>
                    {teacherSubjects.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                    {teacherSubjects.length === 0 && (
                      <>
                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Physics">Physics</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500">Term</label>
                <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {availableTerms.length > 0 ? (
                      availableTerms.map(t => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))
                    ) : (
                      <>
                        <SelectItem value="First Term">First Term</SelectItem>
                        <SelectItem value="Second Term">Second Term</SelectItem>
                        <SelectItem value="Third Term">Third Term</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500">Session</label>
                <Select value={selectedSession} onValueChange={setSelectedSession}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {availableSessions.length > 0 ? (
                      availableSessions.map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))
                    ) : (
                      <SelectItem value={selectedSession}>{selectedSession || 'Loading...'}</SelectItem>
                    )}
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
              onPrincipalRemarkChange={() => { }}
              onPrincipalSignatureUpload={() => { }}
              onRemovePrincipalSignature={() => { }}
              onAdminSignatureUpload={() => { }}
              onRemoveAdminSignature={() => { }}
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