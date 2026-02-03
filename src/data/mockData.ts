// Mock data for the School Management System demo

export const mockLessonNotes = [
  {
    id: '1',
    teacherId: '1',
    teacherName: 'Mr. Teacher',
    subject: 'Mathematics',
    class: 'JSS 1A',
    topic: 'Introduction to Algebra',
    content: `LESSON NOTE

Subject: Mathematics
Class: JSS 1A
Topic: Introduction to Algebra
Duration: 40 minutes

OBJECTIVES:
By the end of the lesson, students should be able to:
1. Define algebra and algebraic expressions
2. Identify variables and constants in algebraic expressions
3. Simplify basic algebraic expressions

TEACHING AIDS:
- Whiteboard and markers
- Algebra tiles
- Worksheets

INTRODUCTION (5 minutes):
Review basic arithmetic operations and introduce the concept of using letters to represent unknown numbers.

LESSON DEVELOPMENT (25 minutes):
1. Definition of algebra and algebraic expressions
2. Explanation of variables and constants
3. Examples of simple algebraic expressions
4. Class activities and practice problems

EVALUATION (5 minutes):
Students will solve 5 basic algebraic expression problems.

ASSIGNMENT:
Complete worksheet on algebraic expressions for homework.`,
    status: 'published' as const,
    createdAt: new Date('2025-12-20'),
    updatedAt: new Date('2025-12-21'),
    approvedBy: 'Dr. Principal',
    approvedAt: new Date('2025-12-21'),
  },
];

export const mockStudents = [
  { id: '1', name: 'Adewale Johnson', class: 'JSS 1A', admissionNumber: 'BF/2024/001', email: 'adewale@student.bfoia.edu', phone: '080-1234-5678', parentId: 'p1', feeStatus: 'paid' as const },
  { id: '2', name: 'Chioma Okonkwo', class: 'JSS 1A', admissionNumber: 'BF/2024/002', email: 'chioma@student.bfoia.edu', phone: '080-2345-6789', parentId: 'p2', feeStatus: 'owed' as const, amountOwed: 50000 },
  { id: '3', name: 'Ibrahim Mohammed', class: 'JSS 2A', admissionNumber: 'BF/2023/045', email: 'ibrahim@student.bfoia.edu', phone: '080-3456-7890', parentId: 'p3', feeStatus: 'partial' as const, amountOwed: 25000 },
];

export const mockStaff = [
  { id: '1', name: 'Mr. Mathematics Teacher', email: 'math@bfoia.edu', phone: '080-1111-2222', role: 'teacher' as const, department: 'Mathematics', employeeId: 'EMP001', hireDate: new Date('2020-01-15'), status: 'active' as const },
  { id: '2', name: 'Mrs. English Teacher', email: 'english@bfoia.edu', phone: '080-2222-3333', role: 'teacher' as const, department: 'English', employeeId: 'EMP002', hireDate: new Date('2019-09-01'), status: 'active' as const },
  { id: '3', name: 'Dr. Principal', email: 'principal@bfoia.edu', phone: '080-3333-4444', role: 'principal' as const, department: 'Administration', employeeId: 'EMP000', hireDate: new Date('2018-01-01'), status: 'active' as const },
];

export const mockFinancialRecords = [
  { id: '1', studentId: '1', studentName: 'Adewale Johnson', class: 'JSS 1A', amount: 50000, amountPaid: 50000, balance: 0, status: 'paid' as const, term: '2nd Term', session: '2025/2026', dueDate: new Date('2025-01-15'), lastPaymentDate: new Date('2025-01-10') },
  { id: '2', studentId: '2', studentName: 'Chioma Okonkwo', class: 'JSS 1A', amount: 50000, amountPaid: 0, balance: 50000, status: 'owed' as const, term: '2nd Term', session: '2025/2026', dueDate: new Date('2025-01-15') },
  { id: '3', studentId: '3', studentName: 'Ibrahim Mohammed', class: 'JSS 2A', amount: 50000, amountPaid: 25000, balance: 25000, status: 'partial' as const, term: '2nd Term', session: '2025/2026', dueDate: new Date('2025-01-15'), lastPaymentDate: new Date('2025-01-05') },
];
