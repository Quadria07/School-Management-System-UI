# BFOIA School Management System - Backend Developer Guide

**Version:** 1.0  
**Date:** January 2026  
**Project:** Bishop Felix Owolabi International Academy School Management System

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Database Schema](#database-schema)
4. [API Endpoints Reference](#api-endpoints-reference)
5. [Implementation Steps](#implementation-steps)
6. [Critical Workflows](#critical-workflows)
7. [Security & Authentication](#security--authentication)
8. [Testing Guide](#testing-guide)

---

## 1. Project Overview

### Current State
- ✅ **Frontend:** 100% complete with React + TypeScript + Tailwind CSS
- ✅ **Mock Data:** Using localStorage for demo purposes
- ⏳ **Backend:** Needs implementation (this is your task)

### Your Task
Implement a complete backend using:
- **Backend Framework:** Supabase Edge Functions (Hono.js)
- **Database:** PostgreSQL (Supabase)
- **Authentication:** Supabase Auth (JWT tokens)
- **Storage:** Supabase Storage (for file uploads)

### User Roles (7 Total)
1. **Student** - View content, take exams, submit assignments
2. **Teacher** - Create lesson notes, CBT exams, grade students
3. **Parent** - Monitor children's progress
4. **Principal** - Approve content, manage academics
5. **Proprietor** - Executive oversight
6. **HR Manager** - Staff management, payroll
7. **Bursar** - Financial management, fees

---

## 2. System Architecture

### Three-Tier Architecture
```
Frontend (React) 
    ↓ HTTPS + JWT
Backend (Supabase Edge Functions) 
    ↓ SQL + RLS
Database (PostgreSQL)
```

### Critical Approval Workflows

**Your backend MUST enforce these approval gates:**

#### Workflow 1: Lesson Notes (Teacher → Principal → Students)
```
1. Teacher creates lesson note → status: 'draft'
2. Teacher submits → status: 'pending'
3. Principal reviews:
   - Approves → status: 'approved'
   - Rejects → status: 'rejected'
4. Teacher shares (only if approved) → status: 'published', shared_with_students: true
5. Students can now view
```

#### Workflow 2: CBT Exams (Teacher → Principal → Students)
```
1. Teacher creates exam + questions → status: 'draft'
2. Teacher submits → status: 'pending_approval'
3. Principal reviews:
   - Approves → status: 'approved'
   - Rejects → status: 'draft' (with rejection_reason)
4. Principal publishes → status: 'published'
5. Students can now take exam
```

#### Workflow 3: Results/Grades (Teacher → Principal → Students)
```
1. Teacher enters results → status: 'draft', published: false
2. Teacher submits → status: 'submitted', published: false
3. Principal approves → status: 'approved', published: false
4. Principal publishes → published: true
5. Students/Parents can now view
```

---

## 3. Database Schema

### Required Tables (25+ tables)

#### Core Tables

**profiles** (User Management)
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'parent', 'principal', 'proprietor', 'hr', 'bursar')),
  phone_number TEXT,
  avatar_url TEXT,
  department TEXT,
  staff_id TEXT UNIQUE,
  student_id TEXT UNIQUE,
  date_of_birth DATE,
  address TEXT,
  academic_session TEXT DEFAULT '2024/2025',
  approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**classes**
```sql
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE, -- e.g., "JSS 1A"
  level TEXT NOT NULL, -- e.g., "JSS1"
  class_teacher_id UUID REFERENCES profiles(id),
  capacity INTEGER DEFAULT 40,
  academic_session TEXT DEFAULT '2024/2025',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**subjects**
```sql
CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  level TEXT NOT NULL, -- "JSS" or "SSS"
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**class_subjects** (Teacher assignments)
```sql
CREATE TABLE class_subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES profiles(id),
  academic_session TEXT DEFAULT '2024/2025',
  UNIQUE(class_id, subject_id, academic_session)
);
```

**enrollments** (Student-class assignment)
```sql
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id),
  academic_session TEXT DEFAULT '2024/2025',
  enrollment_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'withdrawn', 'graduated')),
  UNIQUE(student_id, academic_session)
);
```

**parent_students**
```sql
CREATE TABLE parent_students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  relationship TEXT NOT NULL, -- "Father", "Mother", "Guardian"
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(parent_id, student_id)
);
```

**lesson_notes** (CRITICAL - with approval workflow)
```sql
CREATE TABLE lesson_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id),
  class_id UUID REFERENCES classes(id),
  academic_session TEXT DEFAULT '2024/2025',
  term TEXT CHECK (term IN ('First Term', 'Second Term', 'Third Term')),
  week INTEGER,
  
  -- Content
  topic TEXT NOT NULL,
  sub_topic TEXT,
  duration TEXT,
  period TEXT,
  previous_knowledge TEXT,
  instructional_materials TEXT,
  learning_objectives_cognitive TEXT,
  learning_objectives_affective TEXT,
  learning_objectives_psychomotor TEXT,
  set_induction TEXT,
  presentation TEXT,
  evaluation TEXT,
  summary TEXT,
  assignment TEXT,
  teacher_reflection TEXT,
  hod_remarks TEXT,
  
  -- Approval Workflow (CRITICAL)
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'rejected', 'published')),
  submitted_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  
  -- Sharing Control (CRITICAL - Teacher must explicitly share after approval)
  shared_with_students BOOLEAN DEFAULT FALSE,
  shared_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**cbt_exams** (CRITICAL - with approval workflow)
```sql
CREATE TABLE cbt_exams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id),
  subject_id UUID REFERENCES subjects(id),
  academic_session TEXT DEFAULT '2024/2025',
  term TEXT,
  
  title TEXT NOT NULL,
  instructions TEXT,
  duration INTEGER NOT NULL, -- minutes
  total_marks DECIMAL(5, 2) NOT NULL,
  pass_mark DECIMAL(5, 2) NOT NULL,
  allowed_attempts INTEGER DEFAULT 1,
  shuffle_questions BOOLEAN DEFAULT TRUE,
  show_results_immediately BOOLEAN DEFAULT FALSE,
  
  -- Approval Workflow (CRITICAL)
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'published', 'archived')),
  submitted_for_approval_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**cbt_questions**
```sql
CREATE TABLE cbt_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_id UUID REFERENCES cbt_exams(id) ON DELETE CASCADE,
  question_number INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  question_type TEXT DEFAULT 'multiple_choice',
  option_a TEXT,
  option_b TEXT,
  option_c TEXT,
  option_d TEXT,
  correct_answer TEXT NOT NULL,
  points DECIMAL(5, 2) DEFAULT 1,
  explanation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(exam_id, question_number)
);
```

**cbt_attempts**
```sql
CREATE TABLE cbt_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_id UUID REFERENCES cbt_exams(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  attempt_number INTEGER NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  submitted_at TIMESTAMP WITH TIME ZONE,
  time_spent INTEGER, -- seconds
  score DECIMAL(5, 2),
  total_marks DECIMAL(5, 2),
  percentage DECIMAL(5, 2),
  passed BOOLEAN,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'submitted', 'graded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(exam_id, student_id, attempt_number)
);
```

**cbt_answers**
```sql
CREATE TABLE cbt_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id UUID REFERENCES cbt_attempts(id) ON DELETE CASCADE,
  question_id UUID REFERENCES cbt_questions(id) ON DELETE CASCADE,
  selected_answer TEXT,
  is_correct BOOLEAN,
  points_awarded DECIMAL(5, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(attempt_id, question_id)
);
```

**results** (CRITICAL - with approval workflow)
```sql
CREATE TABLE results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id),
  subject_id UUID REFERENCES subjects(id),
  academic_session TEXT DEFAULT '2024/2025',
  term TEXT NOT NULL,
  
  ca_score DECIMAL(5, 2) DEFAULT 0,
  exam_score DECIMAL(5, 2) DEFAULT 0,
  total_score DECIMAL(5, 2) DEFAULT 0,
  grade TEXT,
  position INTEGER,
  total_students INTEGER,
  
  teacher_id UUID REFERENCES profiles(id),
  teacher_remarks TEXT,
  
  -- Approval Workflow (CRITICAL)
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'published')),
  submitted_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, subject_id, academic_session, term)
);
```

**student_attendance**
```sql
CREATE TABLE student_attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id),
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
  remarks TEXT,
  marked_by UUID REFERENCES profiles(id),
  marked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, date)
);
```

**assignments**
```sql
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id),
  subject_id UUID REFERENCES subjects(id),
  academic_session TEXT DEFAULT '2024/2025',
  term TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  instructions TEXT,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  total_marks DECIMAL(5, 2) DEFAULT 100,
  attachment_urls TEXT[],
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**assignment_submissions**
```sql
CREATE TABLE assignment_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  submission_text TEXT,
  attachment_urls TEXT[],
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'graded', 'late')),
  score DECIMAL(5, 2),
  feedback TEXT,
  graded_by UUID REFERENCES profiles(id),
  graded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(assignment_id, student_id)
);
```

**messages**
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  attachment_urls TEXT[],
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  replied_to UUID REFERENCES messages(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**announcements**
```sql
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  target_role TEXT[], -- e.g., ['student', 'teacher']
  target_classes UUID[],
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  attachment_urls TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**notifications**
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  action_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**fee_structures**
```sql
CREATE TABLE fee_structures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level TEXT NOT NULL,
  academic_session TEXT DEFAULT '2024/2025',
  term TEXT NOT NULL,
  tuition_fee DECIMAL(10, 2) NOT NULL,
  development_levy DECIMAL(10, 2) DEFAULT 0,
  exam_fee DECIMAL(10, 2) DEFAULT 0,
  sports_fee DECIMAL(10, 2) DEFAULT 0,
  library_fee DECIMAL(10, 2) DEFAULT 0,
  ict_fee DECIMAL(10, 2) DEFAULT 0,
  total_fee DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(level, academic_session, term)
);
```

**student_fees**
```sql
CREATE TABLE student_fees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  fee_structure_id UUID REFERENCES fee_structures(id),
  academic_session TEXT DEFAULT '2024/2025',
  term TEXT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  amount_paid DECIMAL(10, 2) DEFAULT 0,
  balance DECIMAL(10, 2) NOT NULL,
  discount_percentage DECIMAL(5, 2) DEFAULT 0,
  discount_reason TEXT,
  due_date DATE,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid', 'overdue')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, academic_session, term)
);
```

**payments**
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_fee_id UUID REFERENCES student_fees(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'bank_transfer', 'online', 'pos', 'cheque')),
  payment_reference TEXT UNIQUE,
  payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_by UUID REFERENCES profiles(id),
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verification_date TIMESTAMP WITH TIME ZONE,
  receipt_number TEXT UNIQUE,
  receipt_url TEXT,
  bank_name TEXT,
  transaction_id TEXT,
  payer_name TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**leave_requests**
```sql
CREATE TABLE leave_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  leave_type TEXT NOT NULL CHECK (leave_type IN ('annual', 'sick', 'maternity', 'paternity', 'casual', 'unpaid')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_days INTEGER NOT NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  review_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**payroll**
```sql
CREATE TABLE payroll (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  month TEXT NOT NULL,
  year INTEGER NOT NULL,
  basic_salary DECIMAL(10, 2) NOT NULL,
  allowances DECIMAL(10, 2) DEFAULT 0,
  deductions DECIMAL(10, 2) DEFAULT 0,
  net_salary DECIMAL(10, 2) NOT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'paid')),
  payment_date DATE,
  payment_reference TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(staff_id, month, year)
);
```

---

## 4. API Endpoints Reference

### Base URL
```
https://{projectId}.supabase.co/functions/v1/make-server-3e7af804
```

### Authentication Header
```
Authorization: Bearer {access_token}
```

### Critical Endpoints Summary

#### Authentication (3 endpoints)
- `POST /auth/login` - Login with email/password
- `POST /auth/logout` - Logout current user
- `GET /auth/session` - Get current session

#### Lesson Notes (8 endpoints - CRITICAL WORKFLOW)
- `GET /lesson-notes` - List lesson notes (role-filtered)
- `GET /lesson-notes/:id` - Get single lesson note
- `POST /lesson-notes` - Create lesson note (Teacher)
- `PUT /lesson-notes/:id` - Update lesson note (Teacher)
- `PATCH /lesson-notes/:id/submit` - Submit for approval (Teacher)
- `PATCH /lesson-notes/:id/approve` - Approve (Principal)
- `PATCH /lesson-notes/:id/reject` - Reject (Principal)
- `PATCH /lesson-notes/:id/share` - Share with students (Teacher, only if approved)

#### CBT Exams (12 endpoints - CRITICAL WORKFLOW)
- `GET /cbt-exams` - List exams (role-filtered)
- `GET /cbt-exams/:id` - Get single exam
- `POST /cbt-exams` - Create exam (Teacher)
- `POST /cbt-exams/:examId/questions` - Add questions (Teacher)
- `GET /cbt-exams/:examId/questions` - Get questions
- `PATCH /cbt-exams/:id/submit` - Submit for approval (Teacher)
- `PATCH /cbt-exams/:id/approve` - Approve (Principal)
- `PATCH /cbt-exams/:id/reject` - Reject (Principal)
- `PATCH /cbt-exams/:id/publish` - Publish to students (Principal)
- `POST /cbt-exams/:examId/start` - Start exam attempt (Student)
- `POST /cbt-attempts/:attemptId/answers` - Save answer (Student)
- `POST /cbt-attempts/:attemptId/submit` - Submit exam (Student) - AUTO-GRADES

#### Results (6 endpoints - CRITICAL WORKFLOW)
- `GET /results/student/:studentId` - Get student results
- `GET /results/class/:classId` - Get class results (Teacher/Principal)
- `POST /results` - Create/update results (Teacher)
- `PATCH /results/class/:classId/submit` - Submit for approval (Teacher)
- `PATCH /results/class/:classId/approve` - Approve (Principal)
- `PATCH /results/class/:classId/publish` - Publish to students/parents (Principal)

#### Students (4 endpoints)
- `GET /students` - List students (filtered by role)
- `GET /students/:id` - Get single student
- `POST /students` - Create student (Principal/HR)
- `PUT /students/:id` - Update student (Principal/HR)

#### Attendance (5 endpoints)
- `GET /attendance/student/:id` - Get student attendance
- `GET /attendance/class/:classId` - Get class attendance for date
- `POST /attendance/student` - Mark attendance (Teacher/Principal)
- `GET /attendance/staff/:id` - Get staff attendance
- `POST /attendance/staff` - Mark staff attendance (HR)

#### Assignments (5 endpoints)
- `GET /assignments/class/:classId` - List assignments
- `POST /assignments` - Create assignment (Teacher)
- `GET /assignments/:id/submissions` - Get submissions (Teacher)
- `POST /assignments/:id/submit` - Submit assignment (Student)
- `PATCH /assignments/:id/submissions/:subId/grade` - Grade submission (Teacher)

#### Communication (7 endpoints)
- `GET /messages` - Get messages (inbox/sent)
- `POST /messages` - Send message
- `PATCH /messages/:id/read` - Mark as read
- `GET /announcements` - Get announcements
- `POST /announcements` - Create announcement
- `GET /notifications` - Get notifications
- `PATCH /notifications/:id/read` - Mark notification as read

#### Financial (6 endpoints)
- `GET /fees/student/:id` - Get student fees
- `GET /payments/student/:id` - Get payments
- `POST /payments` - Record payment (Bursar)
- `PATCH /payments/:id/verify` - Verify payment (Bursar)
- `GET /fee-structures` - Get fee structures
- `POST /fee-structures` - Create fee structure (Bursar)

#### HR (4 endpoints)
- `GET /leave-requests` - Get leave requests
- `POST /leave-requests` - Create leave request
- `PATCH /leave-requests/:id/review` - Approve/reject leave (HR/Principal)
- `GET /payroll` - Get payroll records
- `POST /payroll` - Process payroll (HR/Bursar)

**Total: 80+ endpoints**

---

## 5. Implementation Steps

### Step 1: Setup Supabase Project (30 minutes)
1. Create Supabase project at https://supabase.com
2. Note credentials:
   - SUPABASE_URL
   - SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY

### Step 2: Create Database Schema (1 hour)
1. Create all 25+ tables in order (use SQL editor)
2. Enable Row Level Security (RLS) on all tables
3. Create RLS policies for each table
4. Create seed data (classes, subjects, fee structures)

### Step 3: Implement Edge Functions (6-8 hours)
1. Setup Hono.js server
2. Implement authentication middleware
3. Implement role-based authorization middleware
4. Create routes for all endpoints (80+)
5. Implement the 3 critical approval workflows

### Step 4: Configure Storage (30 minutes)
1. Create 3 storage buckets:
   - `student-photos` (5MB max, images only)
   - `assignments` (10MB max, docs/images)
   - `documents` (20MB max, docs/images)
2. Setup RLS policies for storage

### Step 5: Testing (2-3 hours)
1. Test authentication flow
2. Test all 7 user roles
3. Test approval workflows
4. Test file uploads
5. Test auto-grading system

### Step 6: Deploy (30 minutes)
1. Deploy Edge Functions
2. Update frontend environment variables
3. Monitor logs

**Total Time: 12-15 hours**

---

## 6. Critical Workflows

### Workflow 1: Lesson Note Approval

**Backend Logic:**
```typescript
// 1. Teacher creates (POST /lesson-notes)
{
  teacher_id: currentUser.id,
  status: 'draft',
  shared_with_students: false
}

// 2. Teacher submits (PATCH /lesson-notes/:id/submit)
- Check: teacher owns note
- Check: status is 'draft' or 'rejected'
- Update: status = 'pending', submitted_at = now
- Action: Notify principal

// 3. Principal approves (PATCH /lesson-notes/:id/approve)
- Check: user is principal
- Check: status is 'pending'
- Update: status = 'approved', approved_by = principal.id, approved_at = now
- Action: Notify teacher

// 4. Teacher shares (PATCH /lesson-notes/:id/share)
- Check: teacher owns note
- Check: status is 'approved'
- Update: status = 'published', shared_with_students = true, shared_at = now
- Action: Students can now see it

// 5. Students view (GET /lesson-notes?class_id=xxx)
- Filter: status = 'published' AND shared_with_students = true AND class_id matches student's class
```

### Workflow 2: CBT Exam with Auto-Grading

**Backend Logic:**
```typescript
// 1. Create exam + questions
POST /cbt-exams { title, duration, ... } → examId
POST /cbt-exams/:examId/questions { questions: [...] }

// 2. Submit for approval
PATCH /cbt-exams/:examId/submit
- Update: status = 'pending_approval'

// 3. Principal approves & publishes
PATCH /cbt-exams/:examId/approve → status = 'approved'
PATCH /cbt-exams/:examId/publish → status = 'published'

// 4. Student starts exam
POST /cbt-exams/:examId/start
- Create attempt record
- Return questions (WITHOUT correct answers)
- Start timer

// 5. Student saves answers
POST /cbt-attempts/:attemptId/answers
- Upsert answer (allow changing answers)

// 6. Student submits (AUTO-GRADING)
POST /cbt-attempts/:attemptId/submit
- Get all answers for this attempt
- Join with questions to get correct answers
- Calculate score:
  for each answer:
    if answer.selected_answer === question.correct_answer:
      score += question.points
- Calculate percentage = (score / total_marks) * 100
- Determine pass/fail = score >= pass_mark
- Update attempt: status = 'graded', score, percentage, passed
- Return results (if show_results_immediately = true)
```

### Workflow 3: Results Publication

**Backend Logic:**
```typescript
// 1. Teacher enters results
POST /results
{
  results: [
    { student_id, ca_score, exam_score, total_score, grade, teacher_remarks }
  ],
  status: 'draft',
  published: false
}

// 2. Teacher submits
PATCH /results/class/:classId/submit
- Update all results: status = 'submitted'
- Calculate positions (rank by total_score)

// 3. Principal approves
PATCH /results/class/:classId/approve
- Update: status = 'approved', approved_by, approved_at
- Still published = false (not visible yet)

// 4. Principal publishes
PATCH /results/class/:classId/publish
- Update: published = true, published_at = now
- Notify students and parents

// 5. Students/Parents view
GET /results/student/:studentId?published=true
- Filter: published = true only
```

---

## 7. Security & Authentication

### Row Level Security (RLS) Policies

**CRITICAL: Enable RLS on ALL tables**

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_notes ENABLE ROW LEVEL SECURITY;
-- ... enable for all tables
```

**Example RLS Policies:**

```sql
-- Lesson Notes: Students see only published notes for their class
CREATE POLICY "Students view published lesson notes"
ON lesson_notes FOR SELECT
USING (
  shared_with_students = true AND
  status = 'published' AND
  class_id IN (
    SELECT class_id FROM enrollments
    WHERE student_id = auth.uid() AND status = 'active'
  )
);

-- CBT Exams: Students see only published exams for their class
CREATE POLICY "Students view published exams"
ON cbt_exams FOR SELECT
USING (
  status = 'published' AND
  class_id IN (
    SELECT class_id FROM enrollments
    WHERE student_id = auth.uid() AND status = 'active'
  )
);

-- Results: Students see only their own published results
CREATE POLICY "Students view own published results"
ON results FOR SELECT
USING (
  auth.uid() = student_id AND
  published = true
);

-- Parents: View children's published results
CREATE POLICY "Parents view children results"
ON results FOR SELECT
USING (
  published = true AND
  student_id IN (
    SELECT student_id FROM parent_students
    WHERE parent_id = auth.uid()
  )
);
```

### Authentication Middleware

```typescript
const requireAuth = async (c: any, next: any) => {
  const authHeader = c.req.header('Authorization');
  const token = authHeader?.split(' ')[1];
  
  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  const supabase = createClient(...);
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return c.json({ error: 'Invalid token' }, 401);
  }
  
  // Get profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  
  // Check approval status
  if (profile.approval_status !== 'approved') {
    return c.json({ error: 'Account pending approval' }, 403);
  }
  
  c.set('user', user);
  c.set('profile', profile);
  await next();
};

const requireRole = (roles: string[]) => {
  return async (c: any, next: any) => {
    const profile = c.get('profile');
    if (!roles.includes(profile.role)) {
      return c.json({ error: 'Forbidden' }, 403);
    }
    await next();
  };
};
```

---

## 8. Testing Guide

### Test Accounts to Create

```sql
-- Create test users for all 7 roles
-- Use Supabase Auth Admin API to create with known passwords
-- All passwords: password123

Proprietor: proprietor@bfoia.edu
Principal: principal@bfoia.edu
HR Manager: hr@bfoia.edu
Bursar: bursar@bfoia.edu
Teacher: teacher@bfoia.edu
Student: student@bfoia.edu
Parent: parent@bfoia.edu
```

### Test Scenarios

#### Test 1: Login Flow
```bash
# Test login
curl -X POST {BASE_URL}/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teacher@bfoia.edu","password":"password123"}'

# Expected: 200 with access_token and profile
```

#### Test 2: Lesson Note Approval Workflow
```bash
# 1. Teacher creates lesson note
POST /lesson-notes (with teacher token)
→ status should be 'draft'

# 2. Teacher submits
PATCH /lesson-notes/:id/submit (with teacher token)
→ status should be 'pending'

# 3. Principal approves
PATCH /lesson-notes/:id/approve (with principal token)
→ status should be 'approved'

# 4. Teacher shares
PATCH /lesson-notes/:id/share (with teacher token)
→ status should be 'published', shared_with_students should be true

# 5. Student views
GET /lesson-notes (with student token)
→ Should include the published note
```

#### Test 3: CBT Auto-Grading
```bash
# 1. Teacher creates exam with questions
POST /cbt-exams → examId
POST /cbt-exams/:examId/questions

# 2. Principal approves and publishes
PATCH /cbt-exams/:examId/approve
PATCH /cbt-exams/:examId/publish

# 3. Student starts exam
POST /cbt-exams/:examId/start → attemptId

# 4. Student answers questions
POST /cbt-attempts/:attemptId/answers (multiple times)

# 5. Student submits
POST /cbt-attempts/:attemptId/submit
→ Should return score, percentage, passed status (auto-calculated)
```

#### Test 4: Results Publication
```bash
# 1. Teacher enters results
POST /results

# 2. Teacher submits
PATCH /results/class/:classId/submit

# 3. Principal approves
PATCH /results/class/:classId/approve

# 4. Principal publishes
PATCH /results/class/:classId/publish

# 5. Student views
GET /results/student/:studentId?published=true
→ Should show results
```

#### Test 5: File Upload
```bash
# 1. Get upload URL
POST /storage/upload-url
{
  "bucket": "student-photos",
  "fileName": "photo.jpg",
  "fileType": "image/jpeg"
}
→ Returns signed upload URL

# 2. Upload file directly to storage
PUT {signedUrl} (with file blob)

# 3. Update profile
PATCH /profiles/me
{
  "avatar_url": "students/123/photo.jpg"
}

# 4. Get signed URL for viewing
GET /storage/signed-url?path=students/123/photo.jpg
→ Returns signed view URL
```

---

## 🎯 Frontend Integration Notes

The frontend currently uses `localStorage` for all data. You need to replace these with API calls:

### Key Files to Update:
- `/src/contexts/AuthContext.tsx` - Replace mock auth with real API
- `/src/utils/dataFlowService.ts` - Replace localStorage with API calls
- `/src/app/components/teacher/LessonNoteEditor.tsx` - Use lesson note API
- `/src/app/components/teacher/CBTAssessmentBuilder.tsx` - Use CBT API
- `/src/app/components/teacher/DigitalGradebook.tsx` - Use results API
- `/src/app/components/student/CBTExamInterface.tsx` - Use CBT attempt API
- `/src/app/components/student/ResultsPortal.tsx` - Use results API

### API Client Pattern:
```typescript
import { projectId, publicAnonKey } from '@/utils/supabase/info';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-3e7af804`;

export const apiClient = {
  async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : `Bearer ${publicAnonKey}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  },

  get(endpoint: string) {
    return this.request(endpoint, { method: 'GET' });
  },

  post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  patch(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};
```

---

## ✅ Final Checklist

Before handoff to frontend:

### Database
- [ ] All 25+ tables created
- [ ] RLS enabled on all tables
- [ ] RLS policies created for all tables
- [ ] Seed data added (classes, subjects, fees)
- [ ] Test users created for all 7 roles

### Backend API
- [ ] All 80+ endpoints implemented
- [ ] Authentication middleware working
- [ ] Authorization middleware working
- [ ] Approval workflows enforced
- [ ] Auto-grading working for CBT
- [ ] Notifications created for all workflows

### Storage
- [ ] 3 buckets created
- [ ] RLS policies for storage
- [ ] Upload/download working

### Testing
- [ ] Login tested for all 7 roles
- [ ] Lesson note workflow tested end-to-end
- [ ] CBT workflow tested with auto-grading
- [ ] Results workflow tested end-to-end
- [ ] File upload/download tested
- [ ] All approval gates working

### Documentation
- [ ] API endpoint documentation provided
- [ ] Test credentials documented
- [ ] Frontend integration guide provided

---

## 📞 Questions?

Refer to these source files in the project:
- `/src/types/index.ts` - TypeScript type definitions
- `/src/utils/dataFlowService.ts` - Current data flow logic (using localStorage)
- `/src/data/mockData.ts` - Sample data structures

**Good luck with the implementation!** 🚀
