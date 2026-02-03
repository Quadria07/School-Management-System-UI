/**
 * Data Flow Service for BFOIA School Management System
 * Ensures all teacher activities populate to Principal and Students correctly
 */

// ============ LOCALSTORAGE KEYS ============
export const STORAGE_KEYS = {
  // Results & Grades
  GRADEBOOK_TERM_RESULTS: 'gradebook_term_results',
  GRADEBOOK_SUBMITTED_CLASSES: 'gradebook_submitted_classes',
  GRADEBOOK_CA_RESULTS: 'gradebook_ca_results',
  APPROVED_RESULTS: 'bfoia_approved_results', // NEW: Principal-approved results for students
  
  // Attendance
  ATTENDANCE_RECORDS: 'bfoia_attendance_records',
  
  // Lesson Notes
  LESSON_NOTES: 'bfoia_lesson_notes',
  LESSON_NOTES_SUBMITTED: 'bfoia_lesson_notes_submitted',
  
  // CBT & Assessments
  CBT_ASSESSMENTS: 'bfoia_cbt_assessments',
  CBT_STUDENT_ATTEMPTS: 'bfoia_cbt_student_attempts',
  
  // Assignments
  ASSIGNMENTS: 'bfoia_assignments',
  ASSIGNMENT_SUBMISSIONS: 'bfoia_assignment_submissions',
  
  // Students
  STUDENTS: 'bfoia_students',
  
  // Staff
  STAFF: 'bfoia_staff',
  
  // Classes
  CLASS_ASSIGNMENTS: 'classAssignments',
} as const;

// ============ INTERFACES ============

export interface AttendanceRecord {
  id: string;
  teacherId: string;
  teacherName: string;
  class: string;
  subject: string;
  date: string;
  students: {
    id: string;
    studentName: string;
    admissionNumber: string;
    status: 'present' | 'absent' | 'late' | 'excused';
  }[];
  timestamp: string;
}

export interface LessonNoteRecord {
  id: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  class: string;
  topic: string;
  content: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'published';
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  term: string;
  week: number;
  // Sharing control
  sharedWithStudents?: boolean; // NEW: Teacher must explicitly share after principal approval
  sharedAt?: string; // When it was shared with students
  // Full lesson note fields
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

export interface CBTAssessment {
  id: string;
  teacherId: string;
  teacherName: string;
  title: string;
  subject: string;
  class: string;
  duration: number; // in minutes
  totalMarks: number;
  passMark: number;
  instructions: string;
  questions: CBTQuestion[];
  status: 'draft' | 'pending' | 'approved' | 'published' | 'archived';
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  submittedForApprovalAt?: string;
  publishedDate?: string;
  dueDate?: string;
  allowedAttempts: number;
  shuffleQuestions: boolean;
  showResultsImmediately: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CBTQuestion {
  id: string;
  questionText: string;
  questionType: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  options?: string[]; // For multiple choice
  correctAnswer: string | string[];
  points: number;
  explanation?: string;
}

export interface CBTAttempt {
  id: string;
  assessmentId: string;
  studentId: string;
  studentName: string;
  class: string;
  answers: Record<string, string>; // questionId -> answer
  score: number;
  totalMarks: number;
  percentage: number;
  startedAt: string;
  submittedAt: string;
  timeSpent: number; // in seconds
}

// ============ LESSON NOTES SERVICE ============

export const saveLessonNote = (note: LessonNoteRecord): void => {
  const notes = getAllLessonNotes();
  const existingIndex = notes.findIndex(n => n.id === note.id);
  
  if (existingIndex >= 0) {
    notes[existingIndex] = { ...note, updatedAt: new Date().toISOString() };
  } else {
    notes.push(note);
  }
  
  localStorage.setItem(STORAGE_KEYS.LESSON_NOTES, JSON.stringify(notes));
};

export const getAllLessonNotes = (): LessonNoteRecord[] => {
  try {
    const notes = localStorage.getItem(STORAGE_KEYS.LESSON_NOTES);
    return notes ? JSON.parse(notes) : [];
  } catch (error) {
    console.error('Error loading lesson notes:', error);
    return [];
  }
};

export const getLessonNotesByTeacher = (teacherId: string): LessonNoteRecord[] => {
  return getAllLessonNotes().filter(note => note.teacherId === teacherId);
};

export const getLessonNotesByClass = (className: string): LessonNoteRecord[] => {
  return getAllLessonNotes().filter(note => note.class === className);
};

export const getLessonNotesByStatus = (status: LessonNoteRecord['status']): LessonNoteRecord[] => {
  return getAllLessonNotes().filter(note => note.status === status);
};

export const submitLessonNoteForApproval = (noteId: string): void => {
  const notes = getAllLessonNotes();
  const noteIndex = notes.findIndex(n => n.id === noteId);
  
  if (noteIndex >= 0) {
    notes[noteIndex].status = 'pending';
    notes[noteIndex].submittedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.LESSON_NOTES, JSON.stringify(notes));
  }
};

export const approveLessonNote = (noteId: string, approverName: string): void => {
  const notes = getAllLessonNotes();
  const noteIndex = notes.findIndex(n => n.id === noteId);
  
  if (noteIndex >= 0) {
    notes[noteIndex].status = 'approved';
    notes[noteIndex].approvedBy = approverName;
    notes[noteIndex].approvedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.LESSON_NOTES, JSON.stringify(notes));
  }
};

export const rejectLessonNote = (noteId: string, reason: string): void => {
  const notes = getAllLessonNotes();
  const noteIndex = notes.findIndex(n => n.id === noteId);
  
  if (noteIndex >= 0) {
    notes[noteIndex].status = 'rejected';
    notes[noteIndex].rejectionReason = reason;
    localStorage.setItem(STORAGE_KEYS.LESSON_NOTES, JSON.stringify(notes));
  }
};

/**
 * Share approved lesson note with students
 * Only teacher can share, and only after principal approval
 */
export const shareNoteWithStudents = (noteId: string): boolean => {
  const notes = getAllLessonNotes();
  const noteIndex = notes.findIndex(n => n.id === noteId);
  
  if (noteIndex >= 0) {
    // Must be approved before sharing
    if (notes[noteIndex].status !== 'approved') {
      console.error('Cannot share lesson note: Not approved by principal');
      return false;
    }
    
    notes[noteIndex].sharedWithStudents = true;
    notes[noteIndex].sharedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.LESSON_NOTES, JSON.stringify(notes));
    return true;
  }
  
  return false;
};

/**
 * Unshare lesson note from students
 */
export const unshareNoteFromStudents = (noteId: string): void => {
  const notes = getAllLessonNotes();
  const noteIndex = notes.findIndex(n => n.id === noteId);
  
  if (noteIndex >= 0) {
    notes[noteIndex].sharedWithStudents = false;
    notes[noteIndex].sharedAt = undefined;
    localStorage.setItem(STORAGE_KEYS.LESSON_NOTES, JSON.stringify(notes));
  }
};

/**
 * Get lesson notes visible to students
 * Must be approved AND shared by teacher
 */
export const getStudentVisibleLessonNotes = (className: string): LessonNoteRecord[] => {
  return getAllLessonNotes().filter(note => 
    note.class === className && 
    note.status === 'approved' && 
    note.sharedWithStudents === true
  );
};

// ============ ATTENDANCE SERVICE ============

export const saveAttendanceRecord = (record: AttendanceRecord): void => {
  const records = getAllAttendanceRecords();
  const existingIndex = records.findIndex(r => r.id === record.id);
  
  if (existingIndex >= 0) {
    records[existingIndex] = record;
  } else {
    records.push(record);
  }
  
  localStorage.setItem(STORAGE_KEYS.ATTENDANCE_RECORDS, JSON.stringify(records));
};

export const getAllAttendanceRecords = (): AttendanceRecord[] => {
  try {
    const records = localStorage.getItem(STORAGE_KEYS.ATTENDANCE_RECORDS);
    return records ? JSON.parse(records) : [];
  } catch (error) {
    console.error('Error loading attendance records:', error);
    return [];
  }
};

export const getAttendanceByClass = (className: string): AttendanceRecord[] => {
  return getAllAttendanceRecords().filter(record => record.class === className);
};

export const getAttendanceByStudent = (studentName: string): AttendanceRecord[] => {
  return getAllAttendanceRecords().filter(record => 
    record.students.some(s => s.studentName === studentName)
  );
};

export const getStudentAttendanceRecord = (studentName: string, startDate?: string, endDate?: string): {
  present: number;
  absent: number;
  late: number;
  excused: number;
  total: number;
  percentage: number;
} => {
  let records = getAttendanceByStudent(studentName);
  
  // Filter by date range if provided
  if (startDate) {
    records = records.filter(r => new Date(r.date) >= new Date(startDate));
  }
  if (endDate) {
    records = records.filter(r => new Date(r.date) <= new Date(endDate));
  }
  
  let present = 0, absent = 0, late = 0, excused = 0;
  
  records.forEach(record => {
    const studentRecord = record.students.find(s => s.studentName === studentName);
    if (studentRecord) {
      switch (studentRecord.status) {
        case 'present':
          present++;
          break;
        case 'absent':
          absent++;
          break;
        case 'late':
          late++;
          break;
        case 'excused':
          excused++;
          break;
      }
    }
  });
  
  const total = present + absent + late + excused;
  const percentage = total > 0 ? (present / total) * 100 : 0;
  
  return { present, absent, late, excused, total, percentage };
};

// ============ CBT/ASSESSMENT SERVICE ============

export const saveCBTAssessment = (assessment: CBTAssessment): void => {
  const assessments = getAllCBTAssessments();
  const existingIndex = assessments.findIndex(a => a.id === assessment.id);
  
  if (existingIndex >= 0) {
    assessments[existingIndex] = { ...assessment, updatedAt: new Date().toISOString() };
  } else {
    assessments.push(assessment);
  }
  
  localStorage.setItem(STORAGE_KEYS.CBT_ASSESSMENTS, JSON.stringify(assessments));
};

export const getAllCBTAssessments = (): CBTAssessment[] => {
  try {
    const assessments = localStorage.getItem(STORAGE_KEYS.CBT_ASSESSMENTS);
    return assessments ? JSON.parse(assessments) : [];
  } catch (error) {
    console.error('Error loading CBT assessments:', error);
    return [];
  }
};

export const getPublishedCBTAssessments = (): CBTAssessment[] => {
  return getAllCBTAssessments().filter(a => a.status === 'published');
};

export const getCBTAssessmentsByClass = (className: string): CBTAssessment[] => {
  return getAllCBTAssessments().filter(a => a.class === className);
};

export const getCBTAssessmentsByTeacher = (teacherId: string): CBTAssessment[] => {
  return getAllCBTAssessments().filter(a => a.teacherId === teacherId);
};

export const publishCBTAssessment = (assessmentId: string): void => {
  const assessments = getAllCBTAssessments();
  const index = assessments.findIndex(a => a.id === assessmentId);
  
  if (index >= 0) {
    assessments[index].status = 'published';
    assessments[index].publishedDate = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.CBT_ASSESSMENTS, JSON.stringify(assessments));
  }
};

export const saveCBTAttempt = (attempt: CBTAttempt): void => {
  const attempts = getAllCBTAttempts();
  attempts.push(attempt);
  localStorage.setItem(STORAGE_KEYS.CBT_STUDENT_ATTEMPTS, JSON.stringify(attempts));
};

export const getAllCBTAttempts = (): CBTAttempt[] => {
  try {
    const attempts = localStorage.getItem(STORAGE_KEYS.CBT_STUDENT_ATTEMPTS);
    return attempts ? JSON.parse(attempts) : [];
  } catch (error) {
    console.error('Error loading CBT attempts:', error);
    return [];
  }
};

export const getCBTAttemptsByStudent = (studentId: string): CBTAttempt[] => {
  return getAllCBTAttempts().filter(a => a.studentId === studentId);
};

export const getCBTAttemptsByAssessment = (assessmentId: string): CBTAttempt[] => {
  return getAllCBTAttempts().filter(a => a.assessmentId === assessmentId);
};

export const getStudentAttemptForAssessment = (studentId: string, assessmentId: string): CBTAttempt[] => {
  return getAllCBTAttempts().filter(a => 
    a.studentId === studentId && a.assessmentId === assessmentId
  )
};

// ============ CBT APPROVAL SERVICE (Principal must approve before students see) ============

/**
 * Submit CBT assessment for principal approval
 */
export const submitCBTForApproval = (assessmentId: string): boolean => {
  const assessments = getAllCBTAssessments();
  const index = assessments.findIndex(a => a.id === assessmentId);
  
  if (index >= 0) {
    assessments[index].status = 'pending';
    assessments[index].approvalStatus = 'pending';
    assessments[index].submittedForApprovalAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.CBT_ASSESSMENTS, JSON.stringify(assessments));
    return true;
  }
  return false;
};

/**
 * Approve CBT assessment (called by Principal)
 */
export const approveCBTAssessment = (assessmentId: string, approverName: string): boolean => {
  const assessments = getAllCBTAssessments();
  const index = assessments.findIndex(a => a.id === assessmentId);
  
  if (index >= 0) {
    assessments[index].status = 'approved';
    assessments[index].approvalStatus = 'approved';
    assessments[index].approvedBy = approverName;
    assessments[index].approvedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.CBT_ASSESSMENTS, JSON.stringify(assessments));
    console.log(`✅ Approved CBT assessment: ${assessments[index].title}`);
    return true;
  }
  return false;
};

/**
 * Reject CBT assessment
 */
export const rejectCBTAssessment = (assessmentId: string, reason: string): boolean => {
  const assessments = getAllCBTAssessments();
  const index = assessments.findIndex(a => a.id === assessmentId);
  
  if (index >= 0) {
    assessments[index].status = 'draft';
    assessments[index].approvalStatus = 'rejected';
    assessments[index].rejectionReason = reason;
    localStorage.setItem(STORAGE_KEYS.CBT_ASSESSMENTS, JSON.stringify(assessments));
    console.log(`❌ Rejected CBT assessment: ${assessments[index].title}`);
    return true;
  }
  return false;
};

/**
 * Publish approved CBT to students
 * Can only publish if principal has approved
 */
export const publishApprovedCBT = (assessmentId: string): boolean => {
  const assessments = getAllCBTAssessments();
  const index = assessments.findIndex(a => a.id === assessmentId);
  
  if (index >= 0) {
    // Must be approved before publishing
    if (assessments[index].approvalStatus !== 'approved') {
      console.error('Cannot publish CBT: Not approved by principal');
      return false;
    }
    
    assessments[index].status = 'published';
    assessments[index].publishedDate = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.CBT_ASSESSMENTS, JSON.stringify(assessments));
    console.log(`📢 Published CBT assessment: ${assessments[index].title}`);
    return true;
  }
  return false;
};

/**
 * Get CBT assessments pending principal approval
 */
export const getPendingCBTAssessments = (): CBTAssessment[] => {
  return getAllCBTAssessments().filter(a => a.status === 'pending' && a.approvalStatus === 'pending');
};

/**
 * Get approved and published CBT assessments (visible to students)
 */
export const getStudentVisibleCBTAssessments = (className?: string): CBTAssessment[] => {
  const assessments = getAllCBTAssessments().filter(a => 
    a.status === 'published' && a.approvalStatus === 'approved'
  );
  
  if (className) {
    return assessments.filter(a => a.class === className);
  }
  
  return assessments;
};

// ============ RESULTS APPROVAL SERVICE ============

/**
 * Get all approved results (available to students)
 */
export const getApprovedResults = (): any[] => {
  try {
    const approved = localStorage.getItem(STORAGE_KEYS.APPROVED_RESULTS);
    return approved ? JSON.parse(approved) : [];
  } catch (error) {
    console.error('Error loading approved results:', error);
    return [];
  }
};

/**
 * Approve results for a class (called by Principal)
 * Moves results from pending to approved storage
 */
export const approveClassResults = (className: string, term: string, resultType: 'ca' | 'term'): boolean => {
  try {
    // Get all results from gradebook
    const allResults = localStorage.getItem(STORAGE_KEYS.GRADEBOOK_TERM_RESULTS);
    if (!allResults) return false;
    
    const gradebookResults = JSON.parse(allResults);
    
    // Filter results for this class and term
    const classResults = gradebookResults.filter((r: any) => 
      r.class === className && 
      (r.term === term || !r.term) && // Some results might not have term field
      (r.type === resultType || !r.type) // Some results might not have type field
    );
    
    if (classResults.length === 0) {
      console.warn(`No results found for ${className} - ${term} - ${resultType}`);
      return false;
    }
    
    // Get existing approved results
    const approvedResults = getApprovedResults();
    
    // Add approval metadata
    const resultsToApprove = classResults.map((result: any) => ({
      ...result,
      approvalStatus: 'approved',
      approvedBy: 'Principal',
      approvedAt: new Date().toISOString(),
      resultType: resultType,
      term: term,
      approvalId: `${className}-${term}-${resultType}-${Date.now()}`,
    }));
    
    // Remove any existing approvals for this class/term/type
    const filteredApproved = approvedResults.filter((r: any) => 
      !(r.class === className && r.term === term && r.resultType === resultType)
    );
    
    // Add new approvals
    const updatedApproved = [...filteredApproved, ...resultsToApprove];
    
    // Save to approved results storage
    localStorage.setItem(STORAGE_KEYS.APPROVED_RESULTS, JSON.stringify(updatedApproved));
    
    console.log(`✅ Approved ${classResults.length} results for ${className} - ${term} - ${resultType}`);
    return true;
  } catch (error) {
    console.error('Error approving results:', error);
    return false;
  }
};

/**
 * Reject/unapprove results for a class
 */
export const unapproveClassResults = (className: string, term: string, resultType: 'ca' | 'term'): boolean => {
  try {
    const approvedResults = getApprovedResults();
    
    // Remove approvals for this class/term/type
    const filteredApproved = approvedResults.filter((r: any) => 
      !(r.class === className && r.term === term && r.resultType === resultType)
    );
    
    localStorage.setItem(STORAGE_KEYS.APPROVED_RESULTS, JSON.stringify(filteredApproved));
    
    console.log(`❌ Unapproved results for ${className} - ${term} - ${resultType}`);
    return true;
  } catch (error) {
    console.error('Error unapproving results:', error);
    return false;
  }
};

/**
 * Get approved results for a specific student
 * This is what students see on their portal
 */
export const getApprovedResultsForStudent = (studentName: string, className: string): any[] => {
  const approvedResults = getApprovedResults();
  
  return approvedResults.filter((result: any) => 
    result.studentName === studentName && result.class === className
  );
};

/**
 * Check if results are approved for a class
 */
export const areResultsApproved = (className: string, term: string, resultType: 'ca' | 'term'): boolean => {
  const approvedResults = getApprovedResults();
  
  return approvedResults.some((r: any) => 
    r.class === className && r.term === term && r.resultType === resultType
  );
};

// ============ DATA SYNC VERIFICATION ============

/**
 * Verify data flow from Teacher -> Principal
 */
export const verifyTeacherToPrincipalDataFlow = () => {
  const results = {
    results: localStorage.getItem(STORAGE_KEYS.GRADEBOOK_TERM_RESULTS) !== null,
    attendance: localStorage.getItem(STORAGE_KEYS.ATTENDANCE_RECORDS) !== null,
    lessonNotes: localStorage.getItem(STORAGE_KEYS.LESSON_NOTES) !== null,
    assessments: localStorage.getItem(STORAGE_KEYS.CBT_ASSESSMENTS) !== null,
  };
  
  console.log('Teacher → Principal Data Flow Check:', results);
  return results;
};

/**
 * Verify data flow from Teacher -> Student
 */
export const verifyTeacherToStudentDataFlow = () => {
  const results = {
    results: localStorage.getItem(STORAGE_KEYS.GRADEBOOK_TERM_RESULTS) !== null,
    attendance: localStorage.getItem(STORAGE_KEYS.ATTENDANCE_RECORDS) !== null,
    assessments: localStorage.getItem(STORAGE_KEYS.CBT_ASSESSMENTS) !== null,
  };
  
  console.log('Teacher → Student Data Flow Check:', results);
  return results;
};

/**
 * Initialize sample data for all services
 */
export const initializeSampleData = () => {
  // Only initialize if data doesn't exist
  if (!localStorage.getItem(STORAGE_KEYS.LESSON_NOTES)) {
    localStorage.setItem(STORAGE_KEYS.LESSON_NOTES, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.ATTENDANCE_RECORDS)) {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE_RECORDS, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.CBT_ASSESSMENTS)) {
    localStorage.setItem(STORAGE_KEYS.CBT_ASSESSMENTS, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.CBT_STUDENT_ATTEMPTS)) {
    localStorage.setItem(STORAGE_KEYS.CBT_STUDENT_ATTEMPTS, JSON.stringify([]));
  }
};