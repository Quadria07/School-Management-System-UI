import React, { useState, useMemo } from 'react';
import {
  Award,
  Lock,
  Unlock,
  FileText,
  TrendingUp,
  Plus,
  Download,
  Eye,
  CheckCircle,
  AlertCircle,
  Upload,
  CalendarIcon,
  X,
  Users,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import * as dataFlowService from '@/utils/dataFlowService';
import { Calendar } from '../ui/calendar';
import { format } from 'date-fns';
import { ScrollArea } from '../ui/scroll-area';
import schoolLogo from 'figma:asset/05e5dcd127c3f9119091f655ee2db41390342c66.png';
import { StudentReportCard } from './StudentReportCard';
import { SubjectScores, BroadsheetData } from './types';
import { mergeStudentPhotos } from '@/utils/studentPhotoHelper';

interface ResultSet {
  id: string;
  class: string;
  term: string;
  session: string;
  status: 'draft' | 'locked' | 'approved';
  submittedBy: string;
  submittedDate: string;
  type?: 'CA' | 'Term'; // Added type
}

export const ExaminationManagement: React.FC = () => {
  const [showLockDialog, setShowLockDialog] = useState(false);
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [selectedClass, setSelectedClass] = useState('GRADE 4');
  const [selectedSession, setSelectedSession] = useState('2024/2025');
  const [selectedTerm, setSelectedTerm] = useState('First Term');
  const [principalComment, setPrincipalComment] = useState('');

  // Signature and Date States
  const [teacherSignature, setTeacherSignature] = useState<string | null>(null);
  const [teacherDate, setTeacherDate] = useState<Date | undefined>(undefined);
  const [principalSignature, setPrincipalSignature] = useState<string | null>(null);
  const [principalDate, setPrincipalDate] = useState<Date | undefined>(undefined);
  const [adminSignature, setAdminSignature] = useState<string | null>(null);
  const [currentPrincipalSignature, setCurrentPrincipalSignature] = useState<string | null>(null);
  const [currentPrincipalRemark, setCurrentPrincipalRemark] = useState('A brilliant student with exceptional academic prowess. Well done!');

  // View Results States
  const [showStudentListDialog, setShowStudentListDialog] = useState(false);
  const [selectedResultSet, setSelectedResultSet] = useState<ResultSet | null>(null);
  const [showResultDetailDialog, setShowResultDetailDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<BroadsheetData | null>(null);
  const [resultType, setResultType] = useState<'ca' | 'term' | null>(null);
  const [teacherData, setTeacherData] = useState<any[]>([]);

  // CBT Approval States
  const [pendingCBTs, setPendingCBTs] = useState<dataFlowService.CBTAssessment[]>([]);
  const [selectedCBT, setSelectedCBT] = useState<dataFlowService.CBTAssessment | null>(null);
  const [showCBTRejectDialog, setShowCBTRejectDialog] = useState(false);
  const [cbtRejectionReason, setCbtRejectionReason] = useState('');
  const [showCBTDetailsDialog, setShowCBTDetailsDialog] = useState(false);

  // Load teacher data from localStorage
  React.useEffect(() => {
    const savedData = localStorage.getItem('gradebook_term_results');
    if (savedData) {
      setTeacherData(JSON.parse(savedData));
    }
  }, []);

  const [resultSets, setResultSets] = useState<ResultSet[]>([]);

  // Sync result sets status from localStorage
  React.useEffect(() => {
    const checkSubmissionStatus = () => {
        const savedStatus = localStorage.getItem('gradebook_submitted_classes');
        const statusMap = savedStatus ? JSON.parse(savedStatus) : {};
        
        // Base mock data
        const baseSets: ResultSet[] = [
            { id: 'RS001', class: 'SSS 1', term: 'First Term', session: '2024/2025', status: 'draft', submittedBy: 'Mrs. Sarah Johnson', submittedDate: '2 hours ago', type: 'Term' },
            { id: 'RS002', class: 'JSS 2', term: 'First Term', session: '2024/2025', status: 'locked', submittedBy: 'Mr. David Okafor', submittedDate: '1 day ago', type: 'Term' },
        ];
        
        // Dynamic JSS 3A entries
        const jss3aCA: ResultSet = {
            id: 'RS-JSS3A-CA',
            class: 'JSS 3A',
            term: 'First Term',
            session: '2024/2025',
            status: statusMap['JSS 3A_ca'] ? 'locked' : 'draft',
            submittedBy: 'Mrs. Bello',
            submittedDate: 'Just now',
            type: 'CA'
        };
        
        const jss3aTerm: ResultSet = {
            id: 'RS-JSS3A-TERM',
            class: 'JSS 3A',
            term: 'First Term',
            session: '2024/2025',
            status: statusMap['JSS 3A_term'] ? 'locked' : 'draft',
            submittedBy: 'Mrs. Bello',
            submittedDate: 'Just now',
            type: 'Term'
        };

        setResultSets([...baseSets, jss3aCA, jss3aTerm]);
    };

    checkSubmissionStatus();
    const interval = setInterval(checkSubmissionStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleRejectResults = (resultId: string) => {
    const targetResult = resultSets.find(r => r.id === resultId);
    if (!targetResult) return;

    // Update state
    setResultSets((prev) =>
      prev.map((result) =>
        result.id === resultId ? { ...result, status: 'draft' as const } : result
      )
    );

    // Update localStorage to unlock
    const savedStatus = localStorage.getItem('gradebook_submitted_classes');
    const statusMap = savedStatus ? JSON.parse(savedStatus) : {};
    
    // Construct key
    const keySuffix = targetResult.type === 'CA' ? '_ca' : '_term';
    const key = targetResult.type ? `${targetResult.class}${keySuffix}` : targetResult.class;
    
    statusMap[key] = false;
    localStorage.setItem('gradebook_submitted_classes', JSON.stringify(statusMap));

    toast.success('Results rejected', {
      description: 'The class teacher has been notified and can now edit the results.',
    });
    setShowLockDialog(false);
  };

  // All student data for different classes
  const allBroadsheetData: BroadsheetData[] = [
    // GRADE 4 students
    {
      sn: 1,
      studentName: 'ADEYEMI OLUWASEUN',
      class: 'GRADE 4',
      english: { first: 65.00, second: 23.00, third: 20.00, total: 108.00, average: 72.00, position: 2 },
      mathematics: { first: 65.00, second: 23.00, third: 27.00, total: 115.00, average: 76.33, position: 1 },
      basicScience: { first: 79.00, second: 27.00, third: 20.00, total: 126.00, average: 84.00, position: 1 },
      prevocational: { first: 65.00, second: 11.00, third: 20.00, total: 96.00, average: 64.00, position: 6 },
      nationalValues: { first: 65.00, second: 16.00, third: 20.00, total: 101.00, average: 67.33, position: 3 },
      totalScore: 1315.85,
      overallAverage: 73.37,
      percentAverage: 352,
      overallPosition: 1,
      grade: 'A',
      remarks: 'Excellent Performance'
    },
    {
      sn: 2,
      studentName: 'BAKARE TUNDE',
      class: 'GRADE 4',
      english: { first: 65.00, second: 23.00, third: 12.00, total: 100.00, average: 70.00, position: 3 },
      mathematics: { first: 65.00, second: 23.00, third: 27.00, total: 115.00, average: 76.33, position: 1 },
      basicScience: { first: 65.00, second: 13.00, third: 20.00, total: 98.00, average: 65.33, position: 5 },
      prevocational: { first: 65.00, second: 11.00, third: 20.00, total: 96.00, average: 64.00, position: 6 },
      nationalValues: { first: 72.00, second: 23.00, third: 20.00, total: 115.00, average: 76.67, position: 1 },
      totalScore: 1105.48,
      overallAverage: 73.22,
      percentAverage: 308,
      overallPosition: 2,
      grade: 'A',
      remarks: 'Very Good'
    },
    {
      sn: 3,
      studentName: 'CHIDINMA NWOSU',
      class: 'GRADE 4',
      english: { first: 65.00, second: 23.00, third: 12.00, total: 100.00, average: 70.00, position: 3 },
      mathematics: { first: 65.00, second: 23.00, third: 27.00, total: 115.00, average: 76.33, position: 1 },
      basicScience: { first: 65.00, second: 13.00, third: 20.00, total: 98.00, average: 65.33, position: 5 },
      prevocational: { first: 65.00, second: 11.00, third: 20.00, total: 96.00, average: 64.00, position: 6 },
      nationalValues: { first: 65.00, second: 16.00, third: 20.00, total: 101.00, average: 67.33, position: 3 },
      totalScore: 866.17,
      overallAverage: 45.23,
      percentAverage: 202,
      overallPosition: 3,
      grade: 'C',
      remarks: 'Good'
    },
    {
      sn: 4,
      studentName: 'DAMILOLA OGUNLEYE',
      class: 'GRADE 4',
      english: { first: 64.00, second: 23.00, third: 18.00, total: 105.00, average: 70.00, position: 3 },
      mathematics: { first: 65.00, second: 17.00, third: 27.00, total: 109.00, average: 72.67, position: 2 },
      basicScience: { first: 65.00, second: 27.00, third: 20.00, total: 112.00, average: 74.67, position: 2 },
      prevocational: { first: 65.00, second: 24.00, third: 20.00, total: 109.00, average: 72.67, position: 2 },
      nationalValues: { first: 65.00, second: 26.00, third: 20.00, total: 111.00, average: 74.00, position: 2 },
      totalScore: 1119.56,
      overallAverage: 63.36,
      percentAverage: 297,
      overallPosition: 4,
      grade: 'B',
      remarks: 'Very Good'
    },
    {
      sn: 5,
      studentName: 'EMMANUEL ADEBAYO',
      class: 'GRADE 4',
      english: { first: 65.00, second: 23.00, third: 20.00, total: 108.00, average: 72.00, position: 2 },
      mathematics: { first: 51.00, second: 23.00, third: 27.00, total: 101.00, average: 67.33, position: 3 },
      basicScience: { first: 65.00, second: 13.00, third: 20.00, total: 98.00, average: 65.33, position: 5 },
      prevocational: { first: 65.00, second: 11.00, third: 20.00, total: 96.00, average: 64.00, position: 6 },
      nationalValues: { first: 65.00, second: 16.00, third: 20.00, total: 101.00, average: 67.33, position: 3 },
      totalScore: 1110.56,
      overallAverage: 59.33,
      percentAverage: 296,
      overallPosition: 5,
      grade: 'B',
      remarks: 'Good'
    },
    {
      sn: 6,
      studentName: 'FATIMA MOHAMMED',
      class: 'GRADE 4',
      english: { first: 65.00, second: 23.00, third: 20.00, total: 108.00, average: 72.00, position: 2 },
      mathematics: { first: 51.00, second: 23.00, third: 27.00, total: 101.00, average: 67.33, position: 3 },
      basicScience: { first: 65.00, second: 13.00, third: 20.00, total: 98.00, average: 65.33, position: 5 },
      prevocational: { first: 65.00, second: 24.00, third: 20.00, total: 109.00, average: 72.67, position: 2 },
      nationalValues: { first: 65.00, second: 16.00, third: 20.00, total: 101.00, average: 67.33, position: 3 },
      totalScore: 1407.17,
      overallAverage: 86.30,
      percentAverage: 359,
      overallPosition: 6,
      grade: 'A',
      remarks: 'Excellent'
    },
    {
      sn: 7,
      studentName: 'GRACE OKORO',
      class: 'GRADE 4',
      english: { first: 65.00, second: 23.00, third: 12.00, total: 100.00, average: 70.00, position: 3 },
      mathematics: { first: 51.00, second: 14.00, third: 27.00, total: 92.00, average: 61.33, position: 4 },
      basicScience: { first: 28.00, second: 27.00, third: 20.00, total: 75.00, average: 50.00, position: 7 },
      prevocational: { first: 65.00, second: 11.00, third: 20.00, total: 96.00, average: 64.00, position: 6 },
      nationalValues: { first: 65.00, second: 16.00, third: 20.00, total: 101.00, average: 67.33, position: 3 },
      totalScore: 1419.17,
      overallAverage: 61.67,
      percentAverage: 317,
      overallPosition: 7,
      grade: 'B',
      remarks: 'Good'
    },
    {
      sn: 8,
      studentName: 'IBRAHIM YUSUF',
      class: 'GRADE 4',
      english: { first: 65.00, second: 23.00, third: 12.00, total: 100.00, average: 70.00, position: 3 },
      mathematics: { first: 65.00, second: 23.00, third: 27.00, total: 115.00, average: 76.33, position: 1 },
      basicScience: { first: 28.00, second: 27.00, third: 20.00, total: 75.00, average: 50.00, position: 7 },
      prevocational: { first: 65.00, second: 11.00, third: 20.00, total: 96.00, average: 64.00, position: 6 },
      nationalValues: { first: 51.00, second: 11.00, third: 20.00, total: 82.00, average: 54.67, position: 6 },
      totalScore: 1376.85,
      overallAverage: 56.21,
      percentAverage: 344,
      overallPosition: 8,
      grade: 'B',
      remarks: 'Good'
    },
    {
      sn: 9,
      studentName: 'JOY WILLIAMS',
      class: 'GRADE 4',
      english: { first: 65.00, second: 36.00, third: 12.00, total: 113.00, average: 75.33, position: 1 },
      mathematics: { first: 65.00, second: 23.00, third: 27.00, total: 115.00, average: 76.33, position: 1 },
      basicScience: { first: 28.00, second: 27.00, third: 20.00, total: 75.00, average: 50.00, position: 7 },
      prevocational: { first: 51.00, second: 11.00, third: 20.00, total: 82.00, average: 54.67, position: 6 },
      nationalValues: { first: 51.00, second: 11.00, third: 20.00, total: 82.00, average: 54.67, position: 6 },
      totalScore: 1109.37,
      overallAverage: 58.51,
      percentAverage: 325,
      overallPosition: 9,
      grade: 'B',
      remarks: 'Good'
    },
    // GRADE 5 students
    {
      sn: 1,
      studentName: 'AKINWALE SEGUN',
      class: 'GRADE 5',
      english: { first: 70.00, second: 25.00, third: 22.00, total: 117.00, average: 78.00, position: 1 },
      mathematics: { first: 68.00, second: 24.00, third: 28.00, total: 120.00, average: 80.00, position: 1 },
      basicScience: { first: 75.00, second: 26.00, third: 21.00, total: 122.00, average: 81.33, position: 1 },
      prevocational: { first: 66.00, second: 20.00, third: 22.00, total: 108.00, average: 72.00, position: 2 },
      nationalValues: { first: 70.00, second: 22.00, third: 21.00, total: 113.00, average: 75.33, position: 1 },
      totalScore: 1450.00,
      overallAverage: 77.33,
      percentAverage: 365,
      overallPosition: 1,
      grade: 'A',
      remarks: 'Outstanding Performance'
    },
    {
      sn: 2,
      studentName: 'BLESSING UCHENNA',
      class: 'GRADE 5',
      english: { first: 62.00, second: 22.00, third: 19.00, total: 103.00, average: 68.67, position: 3 },
      mathematics: { first: 64.00, second: 21.00, third: 26.00, total: 111.00, average: 74.00, position: 2 },
      basicScience: { first: 68.00, second: 24.00, third: 20.00, total: 112.00, average: 74.67, position: 2 },
      prevocational: { first: 70.00, second: 23.00, third: 23.00, total: 116.00, average: 77.33, position: 1 },
      nationalValues: { first: 65.00, second: 20.00, third: 20.00, total: 105.00, average: 70.00, position: 2 },
      totalScore: 1320.00,
      overallAverage: 72.93,
      percentAverage: 340,
      overallPosition: 2,
      grade: 'A',
      remarks: 'Excellent Work'
    },
    {
      sn: 3,
      studentName: 'DAVID OLUWATOBI',
      class: 'GRADE 5',
      english: { first: 68.00, second: 24.00, third: 20.00, total: 112.00, average: 74.67, position: 2 },
      mathematics: { first: 60.00, second: 20.00, third: 25.00, total: 105.00, average: 70.00, position: 3 },
      basicScience: { first: 64.00, second: 22.00, third: 19.00, total: 105.00, average: 70.00, position: 3 },
      prevocational: { first: 62.00, second: 18.00, third: 21.00, total: 101.00, average: 67.33, position: 3 },
      nationalValues: { first: 63.00, second: 19.00, third: 19.00, total: 101.00, average: 67.33, position: 3 },
      totalScore: 1180.00,
      overallAverage: 69.87,
      percentAverage: 318,
      overallPosition: 3,
      grade: 'B',
      remarks: 'Very Good'
    },
    {
      sn: 4,
      studentName: 'ESTHER OLUWATOYIN',
      class: 'GRADE 5',
      english: { first: 65.00, second: 21.00, third: 18.00, total: 104.00, average: 69.33, position: 4 },
      mathematics: { first: 62.00, second: 20.00, third: 24.00, total: 106.00, average: 70.67, position: 4 },
      basicScience: { first: 66.00, second: 22.00, third: 19.00, total: 107.00, average: 71.33, position: 4 },
      prevocational: { first: 63.00, second: 19.00, third: 21.00, total: 103.00, average: 68.67, position: 4 },
      nationalValues: { first: 64.00, second: 20.00, third: 19.00, total: 103.00, average: 68.67, position: 4 },
      totalScore: 1210.00,
      overallAverage: 69.73,
      percentAverage: 320,
      overallPosition: 4,
      grade: 'B',
      remarks: 'Good'
    },
    {
      sn: 5,
      studentName: 'FUNMILAYO ADENIKE',
      class: 'GRADE 5',
      english: { first: 60.00, second: 20.00, third: 17.00, total: 97.00, average: 64.67, position: 5 },
      mathematics: { first: 58.00, second: 19.00, third: 23.00, total: 100.00, average: 66.67, position: 5 },
      basicScience: { first: 62.00, second: 21.00, third: 18.00, total: 101.00, average: 67.33, position: 5 },
      prevocational: { first: 60.00, second: 18.00, third: 20.00, total: 98.00, average: 65.33, position: 5 },
      nationalValues: { first: 61.00, second: 19.00, third: 18.00, total: 98.00, average: 65.33, position: 5 },
      totalScore: 1140.00,
      overallAverage: 65.87,
      percentAverage: 295,
      overallPosition: 5,
      grade: 'B',
      remarks: 'Good'
    },
    // JSS 1 students
    {
      sn: 1,
      studentName: 'ADELEKE TAIWO',
      class: 'JSS 1',
      english: { first: 72.00, second: 26.00, third: 23.00, total: 121.00, average: 80.67, position: 1 },
      mathematics: { first: 70.00, second: 25.00, third: 29.00, total: 124.00, average: 82.67, position: 1 },
      basicScience: { first: 74.00, second: 27.00, third: 22.00, total: 123.00, average: 82.00, position: 1 },
      prevocational: { first: 68.00, second: 22.00, third: 23.00, total: 113.00, average: 75.33, position: 1 },
      nationalValues: { first: 71.00, second: 24.00, third: 22.00, total: 117.00, average: 78.00, position: 1 },
      totalScore: 1520.00,
      overallAverage: 79.73,
      percentAverage: 380,
      overallPosition: 1,
      grade: 'A',
      remarks: 'Exceptional Performance'
    },
    {
      sn: 2,
      studentName: 'BLESSING CHIDERA',
      class: 'JSS 1',
      english: { first: 68.00, second: 24.00, third: 21.00, total: 113.00, average: 75.33, position: 2 },
      mathematics: { first: 66.00, second: 23.00, third: 27.00, total: 116.00, average: 77.33, position: 2 },
      basicScience: { first: 70.00, second: 25.00, third: 21.00, total: 116.00, average: 77.33, position: 2 },
      prevocational: { first: 65.00, second: 21.00, third: 22.00, total: 108.00, average: 72.00, position: 2 },
      nationalValues: { first: 68.00, second: 23.00, third: 21.00, total: 112.00, average: 74.67, position: 2 },
      totalScore: 1380.00,
      overallAverage: 75.33,
      percentAverage: 355,
      overallPosition: 2,
      grade: 'A',
      remarks: 'Excellent'
    },
    {
      sn: 3,
      studentName: 'CHARLES NNAMDI',
      class: 'JSS 1',
      english: { first: 64.00, second: 22.00, third: 19.00, total: 105.00, average: 70.00, position: 3 },
      mathematics: { first: 62.00, second: 21.00, third: 26.00, total: 109.00, average: 72.67, position: 3 },
      basicScience: { first: 66.00, second: 23.00, third: 20.00, total: 109.00, average: 72.67, position: 3 },
      prevocational: { first: 63.00, second: 20.00, third: 21.00, total: 104.00, average: 69.33, position: 3 },
      nationalValues: { first: 65.00, second: 22.00, third: 20.00, total: 107.00, average: 71.33, position: 3 },
      totalScore: 1280.00,
      overallAverage: 71.20,
      percentAverage: 330,
      overallPosition: 3,
      grade: 'B',
      remarks: 'Very Good'
    },
    {
      sn: 4,
      studentName: 'DEBORAH FUNMILAYO',
      class: 'JSS 1',
      english: { first: 60.00, second: 20.00, third: 18.00, total: 98.00, average: 65.33, position: 4 },
      mathematics: { first: 58.00, second: 19.00, third: 24.00, total: 101.00, average: 67.33, position: 4 },
      basicScience: { first: 62.00, second: 21.00, third: 19.00, total: 102.00, average: 68.00, position: 4 },
      prevocational: { first: 60.00, second: 19.00, third: 20.00, total: 99.00, average: 66.00, position: 4 },
      nationalValues: { first: 61.00, second: 20.00, third: 19.00, total: 100.00, average: 66.67, position: 4 },
      totalScore: 1180.00,
      overallAverage: 66.67,
      percentAverage: 310,
      overallPosition: 4,
      grade: 'B',
      remarks: 'Good'
    },
    {
      sn: 5,
      studentName: 'EBUKA CHINONSO',
      class: 'JSS 1',
      english: { first: 58.00, second: 19.00, third: 17.00, total: 94.00, average: 62.67, position: 5 },
      mathematics: { first: 56.00, second: 18.00, third: 23.00, total: 97.00, average: 64.67, position: 5 },
      basicScience: { first: 60.00, second: 20.00, third: 18.00, total: 98.00, average: 65.33, position: 5 },
      prevocational: { first: 58.00, second: 18.00, third: 19.00, total: 95.00, average: 63.33, position: 5 },
      nationalValues: { first: 59.00, second: 19.00, third: 18.00, total: 96.00, average: 64.00, position: 5 },
      totalScore: 1120.00,
      overallAverage: 64.00,
      percentAverage: 300,
      overallPosition: 5,
      grade: 'B',
      remarks: 'Good'
    },
    // JSS 2 students
    {
      sn: 1,
      studentName: 'EZEKIEL CHUKWUEMEKA',
      class: 'JSS 2',
      english: { first: 75.00, second: 27.00, third: 24.00, total: 126.00, average: 84.00, position: 1 },
      mathematics: { first: 73.00, second: 26.00, third: 30.00, total: 129.00, average: 86.00, position: 1 },
      basicScience: { first: 76.00, second: 28.00, third: 23.00, total: 127.00, average: 84.67, position: 1 },
      prevocational: { first: 70.00, second: 24.00, third: 24.00, total: 118.00, average: 78.67, position: 1 },
      nationalValues: { first: 74.00, second: 25.00, third: 23.00, total: 122.00, average: 81.33, position: 1 },
      totalScore: 1580.00,
      overallAverage: 82.93,
      percentAverage: 395,
      overallPosition: 1,
      grade: 'A',
      remarks: 'Outstanding Achievement'
    },
    {
      sn: 2,
      studentName: 'FOLAKE ADENIKE',
      class: 'JSS 2',
      english: { first: 70.00, second: 25.00, third: 22.00, total: 117.00, average: 78.00, position: 2 },
      mathematics: { first: 68.00, second: 24.00, third: 28.00, total: 120.00, average: 80.00, position: 2 },
      basicScience: { first: 72.00, second: 26.00, third: 22.00, total: 120.00, average: 80.00, position: 2 },
      prevocational: { first: 67.00, second: 22.00, third: 23.00, total: 112.00, average: 74.67, position: 2 },
      nationalValues: { first: 70.00, second: 24.00, third: 22.00, total: 116.00, average: 77.33, position: 2 },
      totalScore: 1460.00,
      overallAverage: 78.00,
      percentAverage: 370,
      overallPosition: 2,
      grade: 'A',
      remarks: 'Excellent Performance'
    },
    {
      sn: 3,
      studentName: 'GOODNESS OLAMIDE',
      class: 'JSS 2',
      english: { first: 66.00, second: 23.00, third: 20.00, total: 109.00, average: 72.67, position: 3 },
      mathematics: { first: 64.00, second: 22.00, third: 27.00, total: 113.00, average: 75.33, position: 3 },
      basicScience: { first: 68.00, second: 24.00, third: 21.00, total: 113.00, average: 75.33, position: 3 },
      prevocational: { first: 64.00, second: 21.00, third: 22.00, total: 107.00, average: 71.33, position: 3 },
      nationalValues: { first: 66.00, second: 23.00, third: 21.00, total: 110.00, average: 73.33, position: 3 },
      totalScore: 1340.00,
      overallAverage: 73.60,
      percentAverage: 345,
      overallPosition: 3,
      grade: 'B',
      remarks: 'Very Good'
    },
    {
      sn: 4,
      studentName: 'HABIB ABDULLAHI',
      class: 'JSS 2',
      english: { first: 62.00, second: 21.00, third: 19.00, total: 102.00, average: 68.00, position: 4 },
      mathematics: { first: 60.00, second: 20.00, third: 25.00, total: 105.00, average: 70.00, position: 4 },
      basicScience: { first: 64.00, second: 22.00, third: 20.00, total: 106.00, average: 70.67, position: 4 },
      prevocational: { first: 61.00, second: 20.00, third: 21.00, total: 102.00, average: 68.00, position: 4 },
      nationalValues: { first: 63.00, second: 21.00, third: 20.00, total: 104.00, average: 69.33, position: 4 },
      totalScore: 1260.00,
      overallAverage: 69.20,
      percentAverage: 325,
      overallPosition: 4,
      grade: 'B',
      remarks: 'Good'
    },
    // SSS 1 students
    {
      sn: 1,
      studentName: 'ADEBAYO TEMITOPE',
      class: 'SSS 1',
      english: { first: 78.00, second: 28.00, third: 25.00, total: 131.00, average: 87.33, position: 1 },
      mathematics: { first: 76.00, second: 27.00, third: 31.00, total: 134.00, average: 89.33, position: 1 },
      basicScience: { first: 79.00, second: 29.00, third: 24.00, total: 132.00, average: 88.00, position: 1 },
      prevocational: { first: 73.00, second: 25.00, third: 25.00, total: 123.00, average: 82.00, position: 1 },
      nationalValues: { first: 77.00, second: 26.00, third: 24.00, total: 127.00, average: 84.67, position: 1 },
      totalScore: 1650.00,
      overallAverage: 86.27,
      percentAverage: 410,
      overallPosition: 1,
      grade: 'A',
      remarks: 'Exceptional Student'
    },
    {
      sn: 2,
      studentName: 'BUKOLA OLUWAKEMI',
      class: 'SSS 1',
      english: { first: 74.00, second: 26.00, third: 23.00, total: 123.00, average: 82.00, position: 2 },
      mathematics: { first: 72.00, second: 25.00, third: 29.00, total: 126.00, average: 84.00, position: 2 },
      basicScience: { first: 75.00, second: 27.00, third: 23.00, total: 125.00, average: 83.33, position: 2 },
      prevocational: { first: 70.00, second: 24.00, third: 24.00, total: 118.00, average: 78.67, position: 2 },
      nationalValues: { first: 73.00, second: 25.00, third: 23.00, total: 121.00, average: 80.67, position: 2 },
      totalScore: 1540.00,
      overallAverage: 81.73,
      percentAverage: 385,
      overallPosition: 2,
      grade: 'A',
      remarks: 'Excellent Work'
    },
    {
      sn: 3,
      studentName: 'CHINEDU IKECHUKWU',
      class: 'SSS 1',
      english: { first: 70.00, second: 24.00, third: 21.00, total: 115.00, average: 76.67, position: 3 },
      mathematics: { first: 68.00, second: 23.00, third: 28.00, total: 119.00, average: 79.33, position: 3 },
      basicScience: { first: 71.00, second: 25.00, third: 22.00, total: 118.00, average: 78.67, position: 3 },
      prevocational: { first: 67.00, second: 22.00, third: 23.00, total: 112.00, average: 74.67, position: 3 },
      nationalValues: { first: 69.00, second: 24.00, third: 22.00, total: 115.00, average: 76.67, position: 3 },
      totalScore: 1420.00,
      overallAverage: 77.20,
      percentAverage: 360,
      overallPosition: 3,
      grade: 'B',
      remarks: 'Very Good'
    },
    {
      sn: 4,
      studentName: 'DEBORAH OLUWASEYI',
      class: 'SSS 1',
      english: { first: 66.00, second: 22.00, third: 20.00, total: 108.00, average: 72.00, position: 4 },
      mathematics: { first: 64.00, second: 21.00, third: 26.00, total: 111.00, average: 74.00, position: 4 },
      basicScience: { first: 67.00, second: 23.00, third: 21.00, total: 111.00, average: 74.00, position: 4 },
      prevocational: { first: 64.00, second: 21.00, third: 22.00, total: 107.00, average: 71.33, position: 4 },
      nationalValues: { first: 65.00, second: 22.00, third: 21.00, total: 108.00, average: 72.00, position: 4 },
      totalScore: 1320.00,
      overallAverage: 72.67,
      percentAverage: 335,
      overallPosition: 4,
      grade: 'B',
      remarks: 'Good Performance'
    },
    {
      sn: 5,
      studentName: 'EMMANUEL AYOMIDE',
      class: 'SSS 1',
      english: { first: 62.00, second: 20.00, third: 19.00, total: 101.00, average: 67.33, position: 5 },
      mathematics: { first: 60.00, second: 20.00, third: 25.00, total: 105.00, average: 70.00, position: 5 },
      basicScience: { first: 63.00, second: 21.00, third: 20.00, total: 104.00, average: 69.33, position: 5 },
      prevocational: { first: 61.00, second: 20.00, third: 21.00, total: 102.00, average: 68.00, position: 5 },
      nationalValues: { first: 62.00, second: 21.00, third: 20.00, total: 103.00, average: 68.67, position: 5 },
      totalScore: 1230.00,
      overallAverage: 68.67,
      percentAverage: 315,
      overallPosition: 5,
      grade: 'B',
      remarks: 'Good'
    }
  ];

  // Filter students based on selected class
  const broadsheetData = useMemo(() => {
    const filtered = allBroadsheetData
      .filter(student => student.class === selectedClass)
      .map((student, index) => ({ ...student, sn: index + 1 }));
    
    // Merge passport photos from student management
    return mergeStudentPhotos(filtered);
  }, [selectedClass]);

  // Get students for a specific result set
  const getStudentsForResultSet = (resultSet: ResultSet) => {
    const filtered = allBroadsheetData.filter(student => student.class === resultSet.class);
    // Merge passport photos from student management
    return mergeStudentPhotos(filtered);
  };

  // Calculate class averages dynamically based on filtered students
  const classAverages = useMemo(() => {
    if (broadsheetData.length === 0) {
      return {
        english: { first: 0, second: 0, third: 0, total: 0, average: 0 },
        mathematics: { first: 0, second: 0, third: 0, total: 0, average: 0 },
        basicScience: { first: 0, second: 0, third: 0, total: 0, average: 0 },
        prevocational: { first: 0, second: 0, third: 0, total: 0, average: 0 },
        nationalValues: { first: 0, second: 0, third: 0, total: 0, average: 0 }
      };
    }

    const count = broadsheetData.length;
    const subjects = ['english', 'mathematics', 'basicScience', 'prevocational', 'nationalValues'] as const;
    const result: any = {};

    subjects.forEach(subject => {
      const totals = broadsheetData.reduce(
        (acc, student) => ({
          first: acc.first + student[subject].first,
          second: acc.second + student[subject].second,
          third: acc.third + student[subject].third,
          total: acc.total + student[subject].total,
          average: acc.average + student[subject].average,
        }),
        { first: 0, second: 0, third: 0, total: 0, average: 0 }
      );

      result[subject] = {
        first: totals.first / count,
        second: totals.second / count,
        third: totals.third / count,
        total: totals.total / count,
        average: totals.average / count,
      };
    });

    return result;
  }, [broadsheetData]);

  const commentTemplates = [
    'An excellent result. Keep it up!',
    'Good performance. Continue to work hard.',
    'Satisfactory result. More effort is needed.',
    'Fair performance. You can do better with more dedication.',
    'Needs significant improvement. Please see the class teacher.',
  ];

  const handleLockResults = (resultId: string) => {
    // This function seems to be for "Approving" effectively, or manual locking
    setResultSets((prev) =>
      prev.map((result) =>
        result.id === resultId ? { ...result, status: 'locked' as const } : result
      )
    );
    toast.success('Results locked successfully', {
      description: 'Teachers can no longer edit these results.',
    });
    setShowLockDialog(false);
  };

  // Helper to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'locked': return 'bg-blue-100 text-blue-700 border-blue-200'; // Submitted
      default: return 'bg-amber-100 text-amber-700 border-amber-200'; // Draft
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Released';
      case 'locked': return 'Submitted';
      default: return 'Draft';
    }
  };

  const handleApproveResults = (resultId: string) => {
    const targetResult = resultSets.find(r => r.id === resultId);
    if (!targetResult) return;

    // Determine result type from the result object
    const resultType = targetResult.type === 'CA' ? 'ca' : 'term';
    const term = 'First Term'; // Default term, could be made dynamic

    // Approve results in the data flow service
    const success = dataFlowService.approveClassResults(
      targetResult.class,
      term,
      resultType
    );

    if (success) {
      // Update UI state
      setResultSets((prev) =>
        prev.map((result) =>
          result.id === resultId ? { ...result, status: 'approved' as const } : result
        )
      );
      
      toast.success('Results approved and released', {
        description: `${targetResult.class} ${resultType.toUpperCase()} results are now visible to students and parents.`,
      });

      console.log(`✅ Approved ${targetResult.class} - ${term} - ${resultType}`);
    } else {
      toast.error('Failed to approve results', {
        description: 'Please ensure results have been submitted by the teacher.',
      });
    }
  };

  // Handle signature upload
  const handleSignatureUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'teacher' | 'principal' | 'admin'
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size should be less than 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (type === 'teacher') {
          setTeacherSignature(result);
          toast.success('Teacher signature uploaded successfully');
        } else if (type === 'principal') {
          setPrincipalSignature(result);
          toast.success('Principal signature uploaded successfully');
        } else if (type === 'admin') {
          setAdminSignature(result);
          toast.success('Admin signature uploaded successfully');
          console.log('Admin signature set to state:', result.substring(0, 50));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove signature
  const removeSignature = (type: 'teacher' | 'principal' | 'admin') => {
    if (type === 'teacher') {
      setTeacherSignature(null);
      toast.success('Teacher signature removed');
    } else if (type === 'principal') {
      setPrincipalSignature(null);
      toast.success('Principal signature removed');
    } else if (type === 'admin') {
      setAdminSignature(null);
      toast.success('Admin signature removed');
    }
  };

  // Handle viewing results
  const handleViewResults = (resultSet: ResultSet) => {
    setSelectedResultSet(resultSet);
    setShowStudentListDialog(true);
  };

  const handleViewStudentResult = (student: BroadsheetData, type: 'ca' | 'term') => {
    setSelectedStudent(student);
    setResultType(type);
    setShowResultDetailDialog(true);
  };

  // CBT Approval Functions
  React.useEffect(() => {
    // Load pending CBT assessments
    const pending = dataFlowService.getPendingCBTAssessments();
    setPendingCBTs(pending);
  }, []);

  const handleApproveCBT = (cbtId: string) => {
    const success = dataFlowService.approveCBTAssessment(cbtId, 'Principal');
    if (success) {
      toast.success('CBT Assessment approved successfully');
      // Refresh pending list
      setPendingCBTs(dataFlowService.getPendingCBTAssessments());
    } else {
      toast.error('Failed to approve CBT assessment');
    }
  };

  const handleRejectCBT = () => {
    if (!selectedCBT || !cbtRejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    
    const success = dataFlowService.rejectCBTAssessment(selectedCBT.id, cbtRejectionReason);
    if (success) {
      toast.success('CBT Assessment rejected');
      setPendingCBTs(dataFlowService.getPendingCBTAssessments());
      setShowCBTRejectDialog(false);
      setSelectedCBT(null);
      setCbtRejectionReason('');
    } else {
      toast.error('Failed to reject CBT assessment');
    }
  };

  const handleViewCBTDetails = (cbt: dataFlowService.CBTAssessment) => {
    setSelectedCBT(cbt);
    setShowCBTDetailsDialog(true);
  };

  // Handle PDF Download for both Term and CA results
  const handleDownloadPDF = () => {
    const contentId = resultType === 'ca' ? 'ca-report-card-content' : 'report-card-content';
    const printContent = document.getElementById(contentId);
    if (!printContent) return;

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Write the content to the new window
    printWindow.document.write(`
      <html>
        <head>
          <title>Student Report Card - ${selectedStudent?.studentName}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: Arial, sans-serif;
              padding: 0;
              margin: 0;
              background: white;
            }
            
            /* Print styles to fit everything on one page */
            @media print {
              @page {
                size: A4;
                margin: 8mm;
              }
              
              body {
                padding: 0;
                margin: 0;
              }
              
              /* Scale down to fit on one page */
              .p-8 {
                padding: 6px !important;
              }
              
              .p-4 {
                padding: 6px !important;
              }
              
              .p-2 {
                padding: 3px !important;
              }
              
              .p-1\.5 {
                padding: 2px !important;
              }
              
              .mb-4 {
                margin-bottom: 6px !important;
              }
              
              .mb-2 {
                margin-bottom: 3px !important;
              }
              
              .mb-1 {
                margin-bottom: 2px !important;
              }
              
              .gap-4 {
                gap: 6px !important;
              }
              
              .text-2xl {
                font-size: 1.1rem !important;
                line-height: 1.4rem !important;
              }
              
              .text-xl {
                font-size: 1rem !important;
                line-height: 1.3rem !important;
              }
              
              .text-lg {
                font-size: 0.9rem !important;
                line-height: 1.2rem !important;
              }
              
              .text-sm {
                font-size: 0.7rem !important;
                line-height: 1rem !important;
              }
              
              .text-xs {
                font-size: 0.65rem !important;
                line-height: 0.85rem !important;
              }
              
              table td, table th {
                padding: 2px 3px !important;
                font-size: 0.65rem !important;
              }
              
              .h-24 {
                height: 4.5rem !important;
              }
              
              .h-28 {
                height: 5rem !important;
              }
              
              .w-24 {
                width: 4.5rem !important;
              }
              
              /* Reduce signature images by 60% */
              .h-10 img {
                height: 0.9rem !important;
                max-width: 60px !important;
              }
            }
            
            @media screen {
              body {
                padding: 10px;
              }
            }
            
            /* Border styles */
            .border-2 {
              border: 2px solid #172554;
            }
            
            .border {
              border: 1px solid #9ca3af;
            }
            
            .border-b {
              border-bottom: 1px solid #9ca3af;
            }
            
            .border-l {
              border-left: 1px solid #9ca3af;
            }
            
            .border-r {
              border-right: 1px solid #9ca3af;
            }
            
            .border-gray-200 {
              border-color: #e5e7eb;
            }
            
            .border-gray-400 {
              border-color: #9ca3af;
            }
            
            .border-blue-950 {
              border-color: #172554;
            }
            
            /* Background colors */
            .bg-white {
              background-color: white;
            }
            
            .bg-gray-50 {
              background-color: #f9fafb;
            }
            
            .bg-gray-100 {
              background-color: #f3f4f6;
            }
            
            .bg-gray-200 {
              background-color: #e5e7eb;
            }
            
            .bg-yellow-50 {
              background-color: #fefce8;
            }
            
            /* Text colors */
            .text-blue-950 {
              color: #172554;
            }
            
            .text-blue-900 {
              color: #1e3a8a;
            }
            
            .text-blue-600 {
              color: #2563eb;
            }
            
            .text-purple-600 {
              color: #9333ea;
            }
            
            .text-gray-400 {
              color: #9ca3af;
            }
            
            .text-gray-600 {
              color: #4b5563;
            }
            
            .text-gray-700 {
              color: #374151;
            }
            
            /* Typography */
            .text-2xl {
              font-size: 1.5rem;
              line-height: 2rem;
            }
            
            .text-xl {
              font-size: 1.25rem;
              line-height: 1.75rem;
            }
            
            .text-lg {
              font-size: 1.125rem;
              line-height: 1.75rem;
            }
            
            .text-sm {
              font-size: 0.875rem;
              line-height: 1.25rem;
            }
            
            .text-xs {
              font-size: 0.75rem;
              line-height: 1rem;
            }
            
            .font-bold {
              font-weight: 700;
            }
            
            .font-semibold {
              font-weight: 600;
            }
            
            .italic {
              font-style: italic;
            }
            
            .text-center {
              text-align: center;
            }
            
            .text-left {
              text-align: left;
            }
            
            .text-justify {
              text-align: justify;
            }
            
            /* Spacing */
            .p-8 {
              padding: 2rem;
            }
            
            .p-4 {
              padding: 1rem;
            }
            
            .p-3 {
              padding: 0.75rem;
            }
            
            .p-2 {
              padding: 0.5rem;
            }
            
            .p-1\.5 {
              padding: 0.375rem;
            }
            
            .p-1 {
              padding: 0.25rem;
            }
            
            .pb-1 {
              padding-bottom: 0.25rem;
            }
            
            .pb-0\.5 {
              padding-bottom: 0.125rem;
            }
            
            .mb-4 {
              margin-bottom: 1rem;
            }
            
            .mb-2 {
              margin-bottom: 0.5rem;
            }
            
            .mb-1 {
              margin-bottom: 0.25rem;
            }
            
            .mb-0\.5 {
              margin-bottom: 0.125rem;
            }
            
            /* Flexbox */
            .flex {
              display: flex;
            }
            
            .items-start {
              align-items: flex-start;
            }
            
            .items-center {
              align-items: center;
            }
            
            .items-end {
              align-items: flex-end;
            }
            
            .justify-center {
              justify-content: center;
            }
            
            .justify-between {
              justify-content: space-between;
            }
            
            .flex-1 {
              flex: 1 1 0%;
            }
            
            .flex-shrink-0 {
              flex-shrink: 0;
            }
            
            .gap-4 {
              gap: 1rem;
            }
            
            .gap-3 {
              gap: 0.75rem;
            }
            
            .gap-2 {
              gap: 0.5rem;
            }
            
            .gap-x-3 {
              column-gap: 0.75rem;
            }
            
            .gap-y-1 {
              row-gap: 0.25rem;
            }
            
            .space-y-1 > * + * {
              margin-top: 0.25rem;
            }
            
            .space-y-3 > * + * {
              margin-top: 0.75rem;
            }
            
            /* Grid */
            .grid {
              display: grid;
            }
            
            .grid-cols-2 {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
            
            .grid-cols-3 {
              grid-template-columns: repeat(3, minmax(0, 1fr));
            }
            
            .grid-cols-4 {
              grid-template-columns: repeat(4, minmax(0, 1fr));
            }
            
            .grid-cols-12 {
              grid-template-columns: repeat(12, minmax(0, 1fr));
            }
            
            .col-span-2 {
              grid-column: span 2 / span 2;
            }
            
            .col-span-10 {
              grid-column: span 10 / span 10;
            }
            
            .divide-x > * + * {
              border-left: 1px solid #9ca3af;
            }
            
            .divide-gray-400 > * + * {
              border-color: #9ca3af;
            }
            
            /* Table styles */
            table {
              border-collapse: collapse;
              width: 100%;
              page-break-inside: avoid;
            }
            
            table td, table th {
              border: 1px solid #9ca3af;
              padding: 0.25rem 0.375rem;
            }
            
            thead tr {
              background-color: #e5e7eb;
            }
            
            /* Sizing */
            .w-full {
              width: 100%;
            }
            
            .w-24 {
              width: 6rem;
            }
            
            .w-28 {
              width: 7rem;
            }
            
            .w-20 {
              width: 5rem;
            }
            
            .w-16 {
              width: 4rem;
            }
            
            .h-24 {
              height: 6rem;
            }
            
            .h-28 {
              height: 7rem;
            }
            
            .h-10 {
              height: 2.5rem;
            }
            
            .max-w-full {
              max-width: 100%;
            }
            
            /* Image sizing */
            img {
              max-width: 100%;
              height: auto;
              object-fit: contain;
            }
            
            .object-contain {
              object-fit: contain;
            }
            
            /* Overflow */
            .overflow-x-auto {
              overflow-x: auto;
            }
            
            /* Whitespace */
            .whitespace-nowrap {
              white-space: nowrap;
            }
            
            /* Prevent page breaks */
            .border-2, .border, table {
              page-break-inside: avoid;
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    
    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    };
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl mb-2 text-blue-950">Examination & Result Management</h1>
          <p className="text-gray-600">Manage examinations, results, and report cards</p>
        </div>

      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Results Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-3xl text-blue-950">
                {resultSets.filter((r) => r.status === 'draft').length}
              </p>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Results Locked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-3xl text-blue-950">
                {resultSets.filter((r) => r.status === 'locked').length}
              </p>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Lock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Results Approved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-3xl text-blue-950">
                {resultSets.filter((r) => r.status === 'approved').length}
              </p>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Class Average
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-3xl text-blue-950">
                {broadsheetData.length > 0
                  ? (broadsheetData.reduce((acc, s) => acc + s.overallAverage, 0) / broadsheetData.length).toFixed(1)
                  : '0.0'}%
              </p>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="broadsheet" className="space-y-6">
        <TabsList>
          <TabsTrigger value="broadsheet">Broadsheet View</TabsTrigger>
          <TabsTrigger value="approval">Result Approval</TabsTrigger>
          <TabsTrigger value="comments">Principal's Comments</TabsTrigger>
          <TabsTrigger value="cbt-approval">CBT Approval</TabsTrigger>
          <TabsTrigger value="questions">Question Review</TabsTrigger>
        </TabsList>

        <TabsContent value="broadsheet" className="space-y-4">
          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">Auto-Generated Broadsheet</h3>
                <p className="text-sm text-blue-700 mt-1">
                  This broadsheet is automatically populated with student term total scores per subject. 
                  Data is collected immediately when student term results are locked by the principal in the Result Approval section.
                </p>
              </div>
            </div>
          </div>

          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {/* Broadsheet Header */}
              <div className="bg-white p-6 border-b">
                {/* Logo and School Name - Logo Above */}
                <div className="flex flex-col items-center gap-3 mb-4">
                  <img src={schoolLogo} alt="School Logo" className="w-20 h-20 object-contain" />
                  <div className="text-center">
                    <h2 className="font-bold text-blue-950 text-lg">BISHOP FELIX OWOLABI INT'L ACADEMY</h2>
                    <p className="text-sm mt-1">1, Faithtriumph Drive, Behind Galaxy Hotel, West Bye Pass, Ring Road, Osogbo, Osun State</p>
                    <p className="text-sm italic mt-1">MOTTO: .... refined learning for exceptional minds</p>
                  </div>
                </div>
                
                {/* Selection Controls */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">SESSION:</span>
                    <Select value={selectedSession} onValueChange={setSelectedSession}>
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2023/2024">2023/2024</SelectItem>
                        <SelectItem value="2024/2025">2024/2025</SelectItem>
                        <SelectItem value="2025/2026">2025/2026</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">TERM:</span>
                    <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="First Term">First Term</SelectItem>
                        <SelectItem value="Second Term">Second Term</SelectItem>
                        <SelectItem value="Third Term">Third Term</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">CLASS:</span>
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GRADE 4">GRADE 4</SelectItem>
                        <SelectItem value="GRADE 5">GRADE 5</SelectItem>
                        <SelectItem value="JSS 1">JSS 1</SelectItem>
                        <SelectItem value="JSS 2">JSS 2</SelectItem>
                        <SelectItem value="SSS 1">SSS 1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <h3 className="text-center font-bold text-lg mt-4 text-red-700">BROAD SHEET</h3>
              </div>

              {/* Main Broadsheet Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-[10px] border-collapse">
                  <thead>
                    {/* Subject Headers */}
                    <tr className="bg-gray-100">
                      <th rowSpan={2} className="border border-gray-400 p-2 text-center" style={{minWidth: '30px'}}>S/N</th>
                      <th rowSpan={2} className="border border-gray-400 p-2 text-left" style={{minWidth: '150px'}}>STUDENT'S NAME</th>
                      <th colSpan={6} className="border border-gray-400 p-1 text-center bg-gray-200">ENGLISH</th>
                      <th colSpan={6} className="border border-gray-400 p-1 text-center bg-blue-900 text-white">MATHEMATICS</th>
                      <th colSpan={6} className="border border-gray-400 p-1 text-center bg-red-700 text-white">BASIC SCIENCE & TECHNOLOGY</th>
                      <th colSpan={6} className="border border-gray-400 p-1 text-center bg-gray-600 text-white">PRE-VOCATIONAL STUDIES</th>
                      <th colSpan={6} className="border border-gray-400 p-1 text-center bg-blue-950 text-white">NATIONAL VALUES</th>
                    </tr>
                    {/* Sub-columns */}
                    <tr className="bg-gray-50">
                      <th className="border border-gray-400 p-1 text-center" style={{minWidth: '35px'}}>1ST</th>
                      <th className="border border-gray-400 p-1 text-center" style={{minWidth: '35px'}}>2ND</th>
                      <th className="border border-gray-400 p-1 text-center" style={{minWidth: '35px'}}>3RD</th>
                      <th className="border border-gray-400 p-1 text-center" style={{minWidth: '45px'}}>TOTAL</th>
                      <th className="border border-gray-400 p-1 text-center" style={{minWidth: '55px'}}>AVERAGE</th>
                      <th className="border border-gray-400 p-1 text-center" style={{minWidth: '45px'}}>POSITION</th>
                      
                      <th className="border border-gray-400 p-1 text-center" style={{minWidth: '35px'}}>1ST</th>
                      <th className="border border-gray-400 p-1 text-center" style={{minWidth: '35px'}}>2ND</th>
                      <th className="border border-gray-400 p-1 text-center" style={{minWidth: '35px'}}>3RD</th>
                      <th className="border border-gray-400 p-1 text-center" style={{minWidth: '45px'}}>TOTAL</th>
                      <th className="border border-gray-400 p-1 text-center" style={{minWidth: '55px'}}>AVERAGE</th>
                      <th className="border border-gray-400 p-1 text-center" style={{minWidth: '45px'}}>POSITION</th>
                      
                      <th className="border border-gray-400 p-1 text-center" style={{minWidth: '35px'}}>1ST</th>
                      <th className="border border-gray-400 p-1 text-center" style={{minWidth: '35px'}}>2ND</th>
                      <th className="border border-gray-400 p-1 text-center" style={{minWidth: '35px'}}>3RD</th>
                      <th className="border border-gray-400 p-1 text-center" style={{minWidth: '45px'}}>TOTAL</th>
                      <th className="border border-gray-400 p-1 text-center" style={{minWidth: '55px'}}>AVERAGE</th>
                      <th className="border border-gray-400 p-1 text-center" style={{minWidth: '45px'}}>POSITION</th>
                      
                      <th className="border border-gray-400 p-1 text-center" style={{minWidth: '35px'}}>1ST</th>
                      <th className="border border-gray-400 p-1 text-center" style={{minWidth: '35px'}}>2ND</th>
                      <th className="border border-gray-400 p-1 text-center" style={{minWidth: '35px'}}>3RD</th>
                      <th className="border border-gray-400 p-1 text-center" style={{minWidth: '45px'}}>TOTAL</th>
                      <th className="border border-gray-400 p-1 text-center" style={{minWidth: '55px'}}>AVERAGE</th>
                      <th className="border border-gray-400 p-1 text-center" style={{minWidth: '45px'}}>POSITION</th>
                      
                      <th className="border border-gray-400 p-1 text-center" style={{minWidth: '35px'}}>1ST</th>
                      <th className="border border-gray-400 p-1 text-center" style={{minWidth: '35px'}}>2ND</th>
                      <th className="border border-gray-400 p-1 text-center" style={{minWidth: '35px'}}>3RD</th>
                      <th className="border border-gray-400 p-1 text-center" style={{minWidth: '45px'}}>TOTAL</th>
                      <th className="border border-gray-400 p-1 text-center" style={{minWidth: '55px'}}>AVERAGE</th>
                      <th className="border border-gray-400 p-1 text-center" style={{minWidth: '45px'}}>POSITION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Student Rows */}
                    {broadsheetData.length > 0 ? (
                      broadsheetData.map((student) => (
                        <tr key={student.sn} className="hover:bg-gray-50">
                          <td className="border border-gray-300 p-1 text-center">{student.sn}</td>
                          <td className="border border-gray-300 p-1 font-medium">{student.studentName}</td>
                          
                          {/* English */}
                          <td className="border border-gray-300 p-1 text-center">{student.english.first.toFixed(2)}</td>
                          <td className="border border-gray-300 p-1 text-center">{student.english.second.toFixed(2)}</td>
                          <td className="border border-gray-300 p-1 text-center">{student.english.third.toFixed(2)}</td>
                          <td className="border border-gray-300 p-1 text-center">{student.english.total.toFixed(2)}</td>
                          <td className="border border-gray-300 p-1 text-center">{student.english.average > 0 ? student.english.average.toFixed(2) : '-'}</td>
                          <td className="border border-gray-300 p-1 text-center bg-red-100 font-medium">{student.english.position > 0 ? `${student.english.position}${['ST', 'ND', 'RD'][student.english.position - 1] || 'TH'}` : '-'}</td>
                          
                          {/* Mathematics */}
                          <td className="border border-gray-300 p-1 text-center">{student.mathematics.first.toFixed(2)}</td>
                          <td className="border border-gray-300 p-1 text-center">{student.mathematics.second.toFixed(2)}</td>
                          <td className="border border-gray-300 p-1 text-center">{student.mathematics.third.toFixed(2)}</td>
                          <td className="border border-gray-300 p-1 text-center">{student.mathematics.total.toFixed(2)}</td>
                          <td className="border border-gray-300 p-1 text-center">{student.mathematics.average.toFixed(2)}</td>
                          <td className="border border-gray-300 p-1 text-center bg-blue-100 font-medium">{`${student.mathematics.position}${['ST', 'ND', 'RD'][student.mathematics.position - 1] || 'TH'}`}</td>
                          
                          {/* Basic Science */}
                          <td className="border border-gray-300 p-1 text-center">{student.basicScience.first.toFixed(2)}</td>
                          <td className="border border-gray-300 p-1 text-center">{student.basicScience.second.toFixed(2)}</td>
                          <td className="border border-gray-300 p-1 text-center">{student.basicScience.third.toFixed(2)}</td>
                          <td className="border border-gray-300 p-1 text-center">{student.basicScience.total.toFixed(2)}</td>
                          <td className="border border-gray-300 p-1 text-center">{student.basicScience.average.toFixed(2)}</td>
                          <td className="border border-gray-300 p-1 text-center bg-red-100 font-medium">{`${student.basicScience.position}${['ST', 'ND', 'RD'][student.basicScience.position - 1] || 'TH'}`}</td>
                          
                          {/* Pre-vocational */}
                          <td className="border border-gray-300 p-1 text-center">{student.prevocational.first.toFixed(2)}</td>
                          <td className="border border-gray-300 p-1 text-center">{student.prevocational.second.toFixed(2)}</td>
                          <td className="border border-gray-300 p-1 text-center">{student.prevocational.third.toFixed(2)}</td>
                          <td className="border border-gray-300 p-1 text-center">{student.prevocational.total.toFixed(2)}</td>
                          <td className="border border-gray-300 p-1 text-center">{student.prevocational.average.toFixed(2)}</td>
                          <td className="border border-gray-300 p-1 text-center bg-gray-200 font-medium">{`${student.prevocational.position}${['ST', 'ND', 'RD'][student.prevocational.position - 1] || 'TH'}`}</td>
                          
                          {/* National Values */}
                          <td className="border border-gray-300 p-1 text-center">{student.nationalValues.first.toFixed(2)}</td>
                          <td className="border border-gray-300 p-1 text-center">{student.nationalValues.second.toFixed(2)}</td>
                          <td className="border border-gray-300 p-1 text-center">{student.nationalValues.third.toFixed(2)}</td>
                          <td className="border border-gray-300 p-1 text-center">{student.nationalValues.total.toFixed(2)}</td>
                          <td className="border border-gray-300 p-1 text-center">{student.nationalValues.average.toFixed(2)}</td>
                          <td className="border border-gray-300 p-1 text-center bg-blue-100 font-medium">{`${student.nationalValues.position}${['ST', 'ND', 'RD'][student.nationalValues.position - 1] || 'TH'}`}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={32} className="border border-gray-300 p-4 text-center text-gray-500">
                          No students found for the selected class
                        </td>
                      </tr>
                    )}
                    
                    {/* Class Average Row */}
                    {broadsheetData.length > 0 && (
                      <tr className="bg-blue-50 font-medium">
                        <td colSpan={2} className="border border-gray-400 p-2 text-center">CLASS AVERAGE:</td>
                        <td className="border border-gray-400 p-1 text-center">{classAverages.english.first.toFixed(2)}</td>
                        <td className="border border-gray-400 p-1 text-center">{classAverages.english.second.toFixed(2)}</td>
                        <td className="border border-gray-400 p-1 text-center">{classAverages.english.third.toFixed(2)}</td>
                        <td className="border border-gray-400 p-1 text-center">{classAverages.english.total.toFixed(2)}</td>
                        <td className="border border-gray-400 p-1 text-center bg-blue-200">{classAverages.english.average.toFixed(2)}</td>
                        <td className="border border-gray-400 p-1 text-center"></td>
                        
                        <td className="border border-gray-400 p-1 text-center">{classAverages.mathematics.first.toFixed(2)}</td>
                        <td className="border border-gray-400 p-1 text-center">{classAverages.mathematics.second.toFixed(2)}</td>
                        <td className="border border-gray-400 p-1 text-center">{classAverages.mathematics.third.toFixed(2)}</td>
                        <td className="border border-gray-400 p-1 text-center">{classAverages.mathematics.total.toFixed(2)}</td>
                        <td className="border border-gray-400 p-1 text-center bg-blue-200">{classAverages.mathematics.average.toFixed(2)}</td>
                        <td className="border border-gray-400 p-1 text-center"></td>
                        
                        <td className="border border-gray-400 p-1 text-center">{classAverages.basicScience.first.toFixed(2)}</td>
                        <td className="border border-gray-400 p-1 text-center">{classAverages.basicScience.second.toFixed(2)}</td>
                        <td className="border border-gray-400 p-1 text-center">{classAverages.basicScience.third.toFixed(2)}</td>
                        <td className="border border-gray-400 p-1 text-center">{classAverages.basicScience.total.toFixed(2)}</td>
                        <td className="border border-gray-400 p-1 text-center bg-blue-200">{classAverages.basicScience.average.toFixed(2)}</td>
                        <td className="border border-gray-400 p-1 text-center"></td>
                        
                        <td className="border border-gray-400 p-1 text-center">{classAverages.prevocational.first.toFixed(2)}</td>
                        <td className="border border-gray-400 p-1 text-center">{classAverages.prevocational.second.toFixed(2)}</td>
                        <td className="border border-gray-400 p-1 text-center">{classAverages.prevocational.third.toFixed(2)}</td>
                        <td className="border border-gray-400 p-1 text-center">{classAverages.prevocational.total.toFixed(2)}</td>
                        <td className="border border-gray-400 p-1 text-center bg-blue-200">{classAverages.prevocational.average.toFixed(2)}</td>
                        <td className="border border-gray-400 p-1 text-center"></td>
                        
                        <td className="border border-gray-400 p-1 text-center">{classAverages.nationalValues.first.toFixed(2)}</td>
                        <td className="border border-gray-400 p-1 text-center">{classAverages.nationalValues.second.toFixed(2)}</td>
                        <td className="border border-gray-400 p-1 text-center">{classAverages.nationalValues.third.toFixed(2)}</td>
                        <td className="border border-gray-400 p-1 text-center">{classAverages.nationalValues.total.toFixed(2)}</td>
                        <td className="border border-gray-400 p-1 text-center bg-blue-200">{classAverages.nationalValues.average.toFixed(2)}</td>
                        <td className="border border-gray-400 p-1 text-center"></td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Summary Section */}
              {broadsheetData.length > 0 && (
                <div className="p-6 bg-white">
                  <h4 className="font-semibold text-sm mb-3">Summary & Performance Metrics</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-400 p-2 text-left" style={{minWidth: '150px'}}>STUDENT'S NAME</th>
                          <th className="border border-gray-400 p-2 text-center">TOTAL</th>
                          <th className="border border-gray-400 p-2 text-center">OVERALL AVERAGE</th>
                          <th className="border border-gray-400 p-2 text-center">% AVERAGE</th>
                          <th className="border border-gray-400 p-2 text-center">OVERALL POSITION</th>
                          <th className="border border-gray-400 p-2 text-center">GRADE</th>
                          <th className="border border-gray-400 p-2 text-left" style={{minWidth: '200px'}}>REMARKS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {broadsheetData.map((student) => (
                          <tr key={`summary-${student.sn}`} className="hover:bg-gray-50">
                            <td className="border border-gray-300 p-2 font-medium">{student.studentName}</td>
                            <td className="border border-gray-300 p-2 text-center">{student.totalScore.toFixed(2)}</td>
                            <td className="border border-gray-300 p-2 text-center">{student.overallAverage.toFixed(2)}</td>
                            <td className="border border-gray-300 p-2 text-center bg-blue-100">{student.percentAverage}</td>
                            <td className="border border-gray-300 p-2 text-center bg-blue-900 text-white font-bold">{student.overallPosition}{['ST', 'ND', 'RD'][student.overallPosition - 1] || 'TH'}</td>
                            <td className="border border-gray-300 p-2 text-center font-bold">{student.grade}</td>
                            <td className="border border-gray-300 p-2">{student.remarks}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Signature Section */}
                  <div className="mt-8 space-y-6">
                    <h4 className="font-semibold text-sm mb-4">Signatures & Dates</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Class Teacher Signature */}
                      <div className="space-y-3 border border-gray-200 p-4 rounded-lg">
                        <label className="text-sm font-medium">CLASS TEACHER</label>
                        
                        <div className="space-y-2">
                          <label className="text-xs text-gray-600">Upload Signature:</label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleSignatureUpload(e, 'teacher')}
                              className="text-xs"
                            />
                            {teacherSignature && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeSignature('teacher')}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                          {teacherSignature && (
                            <div className="mt-2 p-2 border rounded bg-gray-50">
                              <img
                                src={teacherSignature}
                                alt="Teacher Signature"
                                className="h-12 object-contain"
                              />
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs text-gray-600">Select Date:</label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left text-xs h-9"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {teacherDate ? format(teacherDate, 'PPP') : 'Pick a date'}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={teacherDate}
                                onSelect={setTeacherDate}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        {(teacherSignature || teacherDate) && (
                          <div className="pt-3 border-t">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-600">Preview:</span>
                              {teacherSignature && <span className="text-green-600">✓ Signature uploaded</span>}
                            </div>
                            {teacherDate && (
                              <p className="text-xs text-gray-600 mt-1">
                                Date: {format(teacherDate, 'PPP')}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Admin Signature */}
                      <div className="space-y-3 border border-gray-200 p-4 rounded-lg">
                        <label className="text-sm font-medium">ADMIN</label>
                        
                        <div className="space-y-2">
                          <label className="text-xs text-gray-600">Upload Signature:</label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleSignatureUpload(e, 'admin')}
                              className="text-xs"
                            />
                            {adminSignature && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeSignature('admin')}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                          {adminSignature && (
                            <div className="mt-2 p-2 border rounded bg-gray-50">
                              <img
                                src={adminSignature}
                                alt="Admin Signature"
                                className="h-12 object-contain"
                              />
                            </div>
                          )}
                        </div>

                        {adminSignature && (
                          <div className="pt-3 border-t">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-600">Preview:</span>
                              {adminSignature && <span className="text-green-600">✓ Signature uploaded</span>}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Principal Signature */}
                      <div className="space-y-3 border border-gray-200 p-4 rounded-lg">
                        <label className="text-sm font-medium">PRINCIPAL</label>
                        
                        <div className="space-y-2">
                          <label className="text-xs text-gray-600">Upload Signature:</label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleSignatureUpload(e, 'principal')}
                              className="text-xs"
                            />
                            {principalSignature && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeSignature('principal')}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                          {principalSignature && (
                            <div className="mt-2 p-2 border rounded bg-gray-50">
                              <img
                                src={principalSignature}
                                alt="Principal Signature"
                                className="h-12 object-contain"
                              />
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs text-gray-600">Select Date:</label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left text-xs h-9"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {principalDate ? format(principalDate, 'PPP') : 'Pick a date'}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={principalDate}
                                onSelect={setPrincipalDate}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        {(principalSignature || principalDate) && (
                          <div className="pt-3 border-t">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-600">Preview:</span>
                              {principalSignature && <span className="text-green-600">✓ Signature uploaded</span>}
                            </div>
                            {principalDate && (
                              <p className="text-xs text-gray-600 mt-1">
                                Date: {format(principalDate, 'PPP')}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Export Button */}
                  <div className="mt-6 flex justify-end gap-3">
                    <Button variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      Print Preview
                    </Button>
                    <Button>
                      <Download className="w-4 h-4 mr-2" />
                      Export to PDF
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approval" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Result Approval Pipeline</CardTitle>
              <CardDescription>
                Lock and approve results before releasing to students and parents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {resultSets.map((result) => (
                  <div key={result.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant={
                              result.status === 'draft'
                                ? 'default'
                                : result.status === 'locked'
                                ? 'secondary'
                                : 'outline'
                            }
                          >
                            {result.status}
                          </Badge>
                          <span className="text-xs text-gray-500">{result.submittedDate}</span>
                        </div>
                        <h3 className="font-medium text-blue-950">
                          {result.class} - {result.term} {result.type ? `(${result.type})` : ''}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Session: {result.session} • Submitted by: {result.submittedBy}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4 flex-wrap">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewResults(result)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        {result.status === 'draft' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleLockResults(result.id)}
                            >
                              <Lock className="w-4 h-4 mr-2" />
                              Lock Results
                            </Button>
                          </>
                        )}
                        {result.status === 'locked' && (
                          <>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => handleRejectResults(result.id)}
                            >
                              <X className="w-4 h-4 mr-2" />
                              Reject (Unlock)
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={() => handleApproveResults(result.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve & Release
                            </Button>
                          </>
                        )}
                        {result.status === 'approved' && (
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Download Report Cards
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Principal's Comment Automation</CardTitle>
              <CardDescription>
                Add comments to student report cards based on performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-3">Quick Comment Templates</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {commentTemplates.map((template, index) => (
                      <div
                        key={index}
                        className="p-3 bg-gray-50 border rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => setPrincipalComment(template)}
                      >
                        <p className="text-sm">{template}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Custom Comment</label>
                  <Textarea
                    value={principalComment}
                    onChange={(e) => setPrincipalComment(e.target.value)}
                    placeholder="Type a custom comment..."
                    rows={3}
                    className="resize-none"
                  />
                </div>

                <Button onClick={() => setShowCommentDialog(true)}>
                  <FileText className="w-4 h-4 mr-2" />
                  Apply to Report Cards
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cbt-approval" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>CBT Assessment Approval</CardTitle>
              <CardDescription>
                Review and approve CBT assessments submitted by teachers before they are published to students
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingCBTs.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending CBT Assessments</h3>
                  <p className="text-gray-600">All CBT assessments have been reviewed</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingCBTs.map((cbt) => (
                    <div key={cbt.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-blue-950">{cbt.title}</h4>
                            <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                              Pending Approval
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Subject:</span> {cbt.subject}
                            </div>
                            <div>
                              <span className="font-medium">Class:</span> {cbt.class}
                            </div>
                            <div>
                              <span className="font-medium">Duration:</span> {cbt.duration} mins
                            </div>
                            <div>
                              <span className="font-medium">Questions:</span> {cbt.questions.length}
                            </div>
                            <div className="col-span-2">
                              <span className="font-medium">Teacher:</span> {cbt.teacherName}
                            </div>
                            <div className="col-span-2">
                              <span className="font-medium">Submitted:</span>{' '}
                              {cbt.submittedForApprovalAt
                                ? new Date(cbt.submittedForApprovalAt).toLocaleString()
                                : 'N/A'}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewCBTDetails(cbt)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApproveCBT(cbt.id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-200 text-red-700 hover:bg-red-50"
                            onClick={() => {
                              setSelectedCBT(cbt);
                              setShowCBTRejectDialog(true);
                            }}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="space-y-4">
           <Card>
             <CardHeader>
               <CardTitle>Exam & CA Question Review</CardTitle>
               <CardDescription>Review and approve questions submitted by teachers</CardDescription>
             </CardHeader>
             <CardContent>
               <div className="flex gap-4 mb-4">
                 <Select defaultValue="JSS 1">
                   <SelectTrigger className="w-[180px]">
                     <SelectValue placeholder="Select Class" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="JSS 1">JSS 1</SelectItem>
                     <SelectItem value="JSS 2">JSS 2</SelectItem>
                     <SelectItem value="SSS 1">SSS 1</SelectItem>
                   </SelectContent>
                 </Select>
                 <Select defaultValue="Mathematics">
                   <SelectTrigger className="w-[180px]">
                     <SelectValue placeholder="Select Subject" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="Mathematics">Mathematics</SelectItem>
                     <SelectItem value="English">English</SelectItem>
                     <SelectItem value="Basic Science">Basic Science</SelectItem>
                   </SelectContent>
                 </Select>
               </div>

               <div className="border rounded-md">
                 <table className="w-full text-sm">
                   <thead className="bg-gray-50 border-b">
                     <tr>
                       <th className="p-3 text-left font-medium">Question</th>
                       <th className="p-3 text-center font-medium">Type</th>
                       <th className="p-3 text-center font-medium">Options</th>
                       <th className="p-3 text-center font-medium">Correct Ans</th>
                       <th className="p-3 text-center font-medium">Status</th>
                       <th className="p-3 text-right font-medium">Action</th>
                     </tr>
                   </thead>
                   <tbody>
                     <tr className="border-b">
                       <td className="p-3">What is the square root of 144?</td>
                       <td className="p-3 text-center">MCQ</td>
                       <td className="p-3 text-center">4</td>
                       <td className="p-3 text-center font-bold text-green-600">C</td>
                       <td className="p-3 text-center"><Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Approved</Badge></td>
                       <td className="p-3 text-right">
                         <Button variant="ghost" size="sm">Edit</Button>
                       </td>
                     </tr>
                     <tr className="border-b">
                       <td className="p-3">Solve for x: 2x + 5 = 15</td>
                       <td className="p-3 text-center">MCQ</td>
                       <td className="p-3 text-center">4</td>
                       <td className="p-3 text-center font-bold text-green-600">A</td>
                       <td className="p-3 text-center"><Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">Pending</Badge></td>
                       <td className="p-3 text-right">
                         <div className="flex justify-end gap-2">
                           <Button variant="outline" size="sm" className="h-7 text-xs border-green-200 text-green-700 hover:bg-green-50">Approve</Button>
                           <Button variant="outline" size="sm" className="h-7 text-xs border-red-200 text-red-700 hover:bg-red-50">Reject</Button>
                         </div>
                       </td>
                     </tr>
                     <tr>
                       <td className="p-3">Define 'Photosynthesis'.</td>
                       <td className="p-3 text-center">Theory</td>
                       <td className="p-3 text-center">-</td>
                       <td className="p-3 text-center">-</td>
                       <td className="p-3 text-center"><Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">Pending</Badge></td>
                       <td className="p-3 text-right">
                         <div className="flex justify-end gap-2">
                           <Button variant="outline" size="sm" className="h-7 text-xs border-green-200 text-green-700 hover:bg-green-50">Approve</Button>
                           <Button variant="outline" size="sm" className="h-7 text-xs border-red-200 text-red-700 hover:bg-red-50">Reject</Button>
                         </div>
                       </td>
                     </tr>
                   </tbody>
                 </table>
               </div>
             </CardContent>
           </Card>
        </TabsContent>
      </Tabs>

      {/* Student List Dialog */}
      <Dialog open={showStudentListDialog} onOpenChange={setShowStudentListDialog}>
        <DialogContent className="w-[95vw] max-w-5xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Class Results - {selectedResultSet?.class}</DialogTitle>
            <DialogDescription>
              {selectedResultSet?.term} • {selectedResultSet?.session}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-2">
              {selectedResultSet && getStudentsForResultSet(selectedResultSet).map((student, index) => (
                <div
                  key={index}
                  className="p-3 sm:p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex-1 w-full sm:w-auto">
                      <h4 className="font-medium text-blue-950 text-sm sm:text-base">{student.studentName}</h4>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1 text-xs sm:text-sm text-gray-600">
                        <span>Position: {student.overallPosition}{['ST', 'ND', 'RD'][student.overallPosition - 1] || 'TH'}</span>
                        <span>Average: {student.overallAverage.toFixed(2)}%</span>
                        <span className="font-semibold">Grade: {student.grade}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewStudentResult(student, 'ca')}
                        className="flex-1 sm:flex-none text-xs sm:text-sm"
                      >
                        CA Results
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleViewStudentResult(student, 'term')}
                        className="flex-1 sm:flex-none text-xs sm:text-sm"
                      >
                        Term Results
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowStudentListDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Result Detail Dialog */}
      <Dialog open={showResultDetailDialog} onOpenChange={setShowResultDetailDialog}>
        <DialogContent className="!max-w-[1400px] max-h-[95vh] p-0 w-[95vw]">
          <DialogHeader className="px-3 sm:px-4 lg:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b bg-white sticky top-0 z-10">
            <DialogTitle className="text-base sm:text-lg lg:text-xl">
              {resultType === 'term' ? 'Student Terminal Report' : 'Continuous Assessment Results'} - {selectedStudent?.studentName}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              {selectedResultSet?.class} • {selectedResultSet?.term} • {selectedResultSet?.session}
            </DialogDescription>
          </DialogHeader>
          <div 
            className="h-[calc(95vh-180px)] overflow-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100" 
            id="report-card-content"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
              {selectedStudent && resultType === 'term' && selectedResultSet ? (
                /* Full Report Card Template */
                <StudentReportCard
                student={selectedStudent}
                term={selectedResultSet.term}
                session={selectedResultSet.session}
                class={selectedResultSet.class}
                schoolLogo={schoolLogo}
                adminSignature={adminSignature}
                principalSignature={currentPrincipalSignature}
                principalRemark={currentPrincipalRemark}
                onPrincipalRemarkChange={setCurrentPrincipalRemark}
                onPrincipalSignatureUpload={(sig) => {
                  setCurrentPrincipalSignature(sig);
                  toast.success('Principal signature uploaded successfully');
                }}
                onRemovePrincipalSignature={() => {
                  setCurrentPrincipalSignature(null);
                  toast.success('Principal signature removed');
                }}
                onAdminSignatureUpload={(sig) => {
                  setAdminSignature(sig);
                  toast.success('Admin signature uploaded successfully');
                }}
                onRemoveAdminSignature={() => {
                  setAdminSignature(null);
                  toast.success('Admin signature removed');
                }}
                userRole="Principal"
                subjects={teacherData.find((s: any) => s.studentName === selectedStudent.studentName)?.subjects?.map((s: any) => ({
                  subject: s.subject,
                  periodicTest: s.periodicTest,
                  midTermTest: s.midTermTest,
                  qp: s.qp,
                  cp: s.cp,
                  caTotal: (s.periodicTest || 0) + (s.midTermTest || 0) + (s.qp || 0) + (s.cp || 0),
                  percentScore: (((s.periodicTest || 0) + (s.midTermTest || 0) + (s.qp || 0) + (s.cp || 0)) / 30 * 100).toFixed(1),
                  grade: s.grade,
                  remark: s.grade === 'A' ? 'EXCELLENT' : s.grade === 'B' ? 'VERY GOOD' : 'GOOD',
                  ca: (s.periodicTest || 0) + (s.midTermTest || 0) + (s.qp || 0) + (s.cp || 0),
                  exam: s.exam,
                  total: s.total,
                  average: s.total,
                  rank: '-',
                }))}
                />
              ) : selectedStudent && resultType === 'ca' ? (
                /* CA Results View - Full Report Card */
                <div id="ca-report-card-content">
                  <StudentReportCard
                  student={selectedStudent}
                  term={selectedTerm}
                  session={selectedSession}
                  class={selectedStudent.class}
                  schoolLogo={schoolLogo}
                  adminSignature={adminSignature}
                  principalSignature={currentPrincipalSignature}
                  principalRemark={currentPrincipalRemark}
                  onPrincipalRemarkChange={setCurrentPrincipalRemark}
                  onPrincipalSignatureUpload={(signature) => {
                    setCurrentPrincipalSignature(signature);
                    toast.success('Executive Director signature uploaded');
                  }}
                  onRemovePrincipalSignature={() => {
                    setCurrentPrincipalSignature(null);
                    toast.success('Executive Director signature removed');
                  }}
                  onAdminSignatureUpload={(signature) => {
                    console.log('Admin signature uploaded:', signature);
                    setAdminSignature(signature);
                    toast.success('Admin signature uploaded');
                  }}
                  onRemoveAdminSignature={() => {
                    setAdminSignature(null);
                    toast.success('Admin signature removed');
                  }}
                    resultType="ca"
                    userRole="Principal"
                    subjects={teacherData.find((s: any) => s.studentName === selectedStudent.studentName)?.subjects?.map((s: any) => ({
                      subject: s.subject,
                      periodicTest: s.periodicTest,
                      midTermTest: s.midTermTest,
                      qp: s.qp,
                      cp: s.cp,
                      caTotal: (s.periodicTest || 0) + (s.midTermTest || 0) + (s.qp || 0) + (s.cp || 0),
                      percentScore: (((s.periodicTest || 0) + (s.midTermTest || 0) + (s.qp || 0) + (s.cp || 0)) / 30 * 100).toFixed(1),
                      grade: s.grade,
                      remark: s.grade === 'A' ? 'EXCELLENT' : s.grade === 'B' ? 'VERY GOOD' : 'GOOD',
                    }))}
                  />
                </div>
              ) : null}
          </div>
          <DialogFooter className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-t bg-gray-50">
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center w-full gap-3 sm:gap-0">
              <div>
                {resultType === 'term' && selectedResultSet && selectedResultSet.status === 'draft' && (
                  <Button
                    variant="default"
                    className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto text-xs sm:text-sm"
                    onClick={() => {
                      if (selectedResultSet) {
                        handleLockResults(selectedResultSet.id);
                        setShowResultDetailDialog(false);
                        toast.success('Result locked successfully');
                      }
                    }}
                  >
                    <Lock className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    Lock Result
                  </Button>
                )}
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  onClick={() => setShowResultDetailDialog(false)}
                  className="flex-1 sm:flex-none text-xs sm:text-sm"
                >
                  Close
                </Button>
                <Button 
                  onClick={handleDownloadPDF}
                  className="flex-1 sm:flex-none text-xs sm:text-sm"
                >
                  <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lock Dialog */}
      <Dialog open={showLockDialog} onOpenChange={setShowLockDialog}>
        <DialogContent className="w-[95vw] sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Lock Results</DialogTitle>
            <DialogDescription>
              This will prevent teachers from making further edits to these results.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              Once locked, you can review and approve the results for release to students and
              parents.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLockDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleLockResults('RS001')}>
              <Lock className="w-4 h-4 mr-2" />
              Lock Results
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Comment Dialog */}
      <Dialog open={showCommentDialog} onOpenChange={setShowCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply Comment to Report Cards</DialogTitle>
            <DialogDescription>
              This comment will be added to the selected students' report cards.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-3 bg-gray-50 border rounded-lg">
              <p className="text-sm">{principalComment || 'No comment entered'}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCommentDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast.success('Comments applied successfully');
                setShowCommentDialog(false);
              }}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Apply Comments
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CBT Rejection Dialog */}
      <Dialog open={showCBTRejectDialog} onOpenChange={setShowCBTRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject CBT Assessment</DialogTitle>
            <DialogDescription>
              Provide feedback for the teacher on why this assessment is being rejected
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <p className="text-sm font-medium mb-2">Assessment: {selectedCBT?.title}</p>
              <p className="text-sm text-gray-600">Teacher: {selectedCBT?.teacherName}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Rejection Reason *</label>
              <Textarea
                value={cbtRejectionReason}
                onChange={(e) => setCbtRejectionReason(e.target.value)}
                placeholder="Explain why this assessment needs revision (e.g., questions unclear, incorrect answers, formatting issues, etc.)"
                rows={4}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCBTRejectDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRejectCBT} className="bg-red-600 hover:bg-red-700">
              Reject Assessment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CBT Details Dialog */}
      <Dialog open={showCBTDetailsDialog} onOpenChange={setShowCBTDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{selectedCBT?.title}</DialogTitle>
            <DialogDescription>
              Review all questions and settings before approving
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-1 pr-4">
            {selectedCBT && (
              <div className="space-y-6">
                {/* Assessment Info */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Subject</p>
                    <p className="font-medium">{selectedCBT.subject}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Class</p>
                    <p className="font-medium">{selectedCBT.class}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-medium">{selectedCBT.duration} minutes</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Marks</p>
                    <p className="font-medium">{selectedCBT.totalMarks}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pass Mark</p>
                    <p className="font-medium">{selectedCBT.passMark}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Questions</p>
                    <p className="font-medium">{selectedCBT.questions.length}</p>
                  </div>
                </div>

                {/* Instructions */}
                <div>
                  <h4 className="font-semibold mb-2">Instructions</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                    {selectedCBT.instructions}
                  </p>
                </div>

                {/* Questions */}
                <div>
                  <h4 className="font-semibold mb-3">Questions ({selectedCBT.questions.length})</h4>
                  <div className="space-y-4">
                    {selectedCBT.questions.map((question, index) => (
                      <div key={question.id} className="border rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <span className="font-semibold text-blue-950">{index + 1}.</span>
                          <div className="flex-1">
                            <p className="font-medium mb-2">{question.questionText}</p>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">{question.questionType}</Badge>
                              <Badge>{question.points} {question.points === 1 ? 'point' : 'points'}</Badge>
                            </div>
                            {question.options && question.options.length > 0 && (
                              <div className="space-y-1 mt-3">
                                {question.options.map((option, optIndex) => (
                                  <div
                                    key={optIndex}
                                    className={`p-2 rounded text-sm ${
                                      String.fromCharCode(97 + optIndex) === question.correctAnswer ||
                                      optIndex === Number(question.correctAnswer)
                                        ? 'bg-green-50 border border-green-200 font-medium text-green-900'
                                        : 'bg-gray-50'
                                    }`}
                                  >
                                    <span className="font-medium mr-2">
                                      {String.fromCharCode(65 + optIndex)}.
                                    </span>
                                    {option}
                                    {(String.fromCharCode(97 + optIndex) === question.correctAnswer ||
                                      optIndex === Number(question.correctAnswer)) && (
                                      <span className="ml-2 text-green-600">(Correct Answer)</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                            {question.explanation && (
                              <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                                <p className="font-medium text-blue-900">Explanation:</p>
                                <p className="text-blue-800">{question.explanation}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowCBTDetailsDialog(false)}>
              Close
            </Button>
            <Button
              variant="outline"
              className="border-red-200 text-red-700 hover:bg-red-50"
              onClick={() => {
                setShowCBTDetailsDialog(false);
                setShowCBTRejectDialog(true);
              }}
            >
              Reject
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                if (selectedCBT) {
                  handleApproveCBT(selectedCBT.id);
                  setShowCBTDetailsDialog(false);
                }
              }}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
