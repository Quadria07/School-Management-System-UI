// Type definitions for BFOIA School Management System

export type UserRole = 
  | 'proprietor'
  | 'principal'
  | 'hr'
  | 'bursar'
  | 'teacher'
  | 'student'
  | 'parent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  class?: string;
  academicSession: string;
  studentId?: string;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: Date;
  rejectedReason?: string;
}

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  badge?: number;
}

export interface LessonNote {
  id: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  class: string;
  topic: string;
  content: string;
  status: 'draft' | 'pending' | 'published';
  createdAt: Date;
  updatedAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
  sharedWithStudents?: boolean;
  sharedAt?: Date;
  // Nigerian Ministry of Education Template Fields
  term?: string;
  week?: number;
  period?: string;
  duration?: string;
  subTopic?: string;
  previousKnowledge?: string;
  instructionalMaterials?: string;
  learningObjectivesCognitive?: string;
  learningObjectivesAffective?: string;
  learningObjectivesPsychomotor?: string;
  setInduction?: string;
  presentation?: string;
  evaluation?: string;
  summary?: string;
  assignment?: string;
  teacherReflection?: string;
  hodRemarks?: string;
}

export interface CBTQuestion {
  id: string;
  questionNumber: number;
  question: string;
  options: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  correctAnswer: 'a' | 'b' | 'c' | 'd';
  subject: string;
}

export interface CBTExam {
  id: string;
  title: string;
  subject: string;
  duration: number; // in minutes
  totalQuestions: number;
  cutoffMark: number;
  questions: CBTQuestion[];
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
}

export interface CBTAnswer {
  questionId: string;
  selectedAnswer: 'a' | 'b' | 'c' | 'd' | null;
}

export interface CBTResult {
  examId: string;
  studentId: string;
  studentName: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  completedAt: Date;
  timeTaken: number; // in seconds
}

export interface Student {
  id: string;
  name: string;
  class: string;
  admissionNumber: string;
  email: string;
  phone: string;
  parentId: string;
  feeStatus: 'paid' | 'owed' | 'partial';
  amountOwed?: number;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  department: string;
  employeeId: string;
  hireDate: Date;
  status: 'active' | 'inactive';
}

export interface FinancialRecord {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  amount: number;
  amountPaid: number;
  balance: number;
  status: 'paid' | 'owed' | 'partial';
  term: string;
  session: string;
  dueDate: Date;
  lastPaymentDate?: Date;
}