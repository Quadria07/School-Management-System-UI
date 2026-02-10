# BFOIA School Management System - Backend Developer Guide

**Version:** 2.0 (PHP/MySQL Edition)  
**Date:** January 2026  
**Project:** Bishop Felix Owolabi International Academy School Management System

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Database Schema (MySQL)](#database-schema-mysql)
4. [API Architecture & Endpoints](#api-architecture--endpoints)
5. [Implementation Steps](#implementation-steps)
6. [Critical Workflows](#critical-workflows)
7. [Security & Authentication](#security--authentication)
8. [Testing Guide](#testing-guide)

---

## 1. Project Overview

### Current State
- ✅ **Frontend:** 100% complete with React + TypeScript + Tailwind CSS
- ✅ **Mock Data:** Using localStorage for demo purposes
- ⏳ **Backend:** Needs implementation (PHP/MySQL)

### Your Task
Implement a complete backend using:
- **Language:** PHP (7.4 or 8.x)
- **Database:** MySQL / MariaDB
- **API Style:** REST (JSON)
- **Authentication:** JWT (JSON Web Tokens)
- **Hosting:** cPanel (Apache/Nginx)

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
    ↓ HTTPS + JSON
Backend (PHP Scripts on cPanel) 
    ↓ PDO (SQL)
Database (MySQL)
```

### Folder Structure Recommendation
We recommend creating an `api` folder in your `public_html`:

```
public_html/
  ├── index.html (React App)
  ├── assets/ (React Assets)
  └── api/ (Backend API)
      ├── config/
      │   └── database.php
      ├── v1/
      │   ├── auth/
      │   │   ├── login.php
      │   │   └── user.php
      │   ├── students/
      │   │   ├── list.php
      │   │   └── create.php
      │   ├── lesson-notes/
      │   └── ...
      ├── utils/
      │   ├── jwt.php
      │   └── response.php
      └── .htaccess (for routing/cors)
```

---

## 3. Database Schema (MySQL)

**Note:** Use `CHAR(36)` for UUIDs if you want to keep strictly to the frontend's UUID expectations, or `INT AUTO_INCREMENT` if you refactor the frontend types. **We recommend `CHAR(36)` for UUIDs** to match the current mock data format.

### Required Tables (25+ tables)

#### Core Tables

**users/profiles**
```sql
CREATE TABLE profiles (
  id CHAR(36) NOT NULL PRIMARY KEY, -- UUID
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL, -- New field for PHP auth
  full_name VARCHAR(255) NOT NULL,
  role ENUM('student', 'teacher', 'parent', 'principal', 'proprietor', 'hr', 'bursar') NOT NULL,
  phone_number VARCHAR(50),
  avatar_url VARCHAR(255),
  department VARCHAR(100),
  staff_id VARCHAR(50) UNIQUE,
  student_id VARCHAR(50) UNIQUE,
  date_of_birth DATE,
  address TEXT,
  academic_session VARCHAR(20) DEFAULT '2024/2025',
  approval_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  approved_by CHAR(36),
  approved_at DATETIME,
  rejection_reason TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (approved_by) REFERENCES profiles(id)
);
```

**classes**
```sql
CREATE TABLE classes (
  id CHAR(36) NOT NULL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE, -- e.g., "JSS 1A"
  level VARCHAR(50) NOT NULL, -- e.g., "JSS1"
  class_teacher_id CHAR(36),
  capacity INTEGER DEFAULT 40,
  academic_session VARCHAR(20) DEFAULT '2024/2025',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (class_teacher_id) REFERENCES profiles(id)
);
```

**subjects**
```sql
CREATE TABLE subjects (
  id CHAR(36) NOT NULL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20) NOT NULL UNIQUE,
  level VARCHAR(20) NOT NULL, -- "JSS" or "SSS"
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**class_subjects**
```sql
CREATE TABLE class_subjects (
  id CHAR(36) NOT NULL PRIMARY KEY,
  class_id CHAR(36),
  subject_id CHAR(36),
  teacher_id CHAR(36),
  academic_session VARCHAR(20) DEFAULT '2024/2025',
  UNIQUE KEY (class_id, subject_id, academic_session),
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
  FOREIGN KEY (teacher_id) REFERENCES profiles(id)
);
```

**enrollments**
```sql
CREATE TABLE enrollments (
  id CHAR(36) NOT NULL PRIMARY KEY,
  student_id CHAR(36),
  class_id CHAR(36),
  academic_session VARCHAR(20) DEFAULT '2024/2025',
  enrollment_date DATE DEFAULT (CURRENT_DATE),
  status ENUM('active', 'suspended', 'withdrawn', 'graduated') DEFAULT 'active',
  UNIQUE KEY (student_id, academic_session),
  FOREIGN KEY (student_id) REFERENCES profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (class_id) REFERENCES classes(id)
);
```

**lesson_notes** (CRITICAL WORKFLOW)
```sql
CREATE TABLE lesson_notes (
  id CHAR(36) NOT NULL PRIMARY KEY,
  teacher_id CHAR(36),
  subject_id CHAR(36),
  class_id CHAR(36),
  academic_session VARCHAR(20) DEFAULT '2024/2025',
  term ENUM('First Term', 'Second Term', 'Third Term'),
  week INTEGER,
  
  -- Content
  topic VARCHAR(255) NOT NULL,
  sub_topic VARCHAR(255),
  duration VARCHAR(50),
  period VARCHAR(50),
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
  
  -- Approval Workflow
  status ENUM('draft', 'pending', 'approved', 'rejected', 'published') DEFAULT 'draft',
  submitted_at DATETIME,
  approved_by CHAR(36),
  approved_at DATETIME,
  rejection_reason TEXT,
  
  -- Sharing
  shared_with_students BOOLEAN DEFAULT FALSE,
  shared_at DATETIME,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES profiles(id),
  FOREIGN KEY (subject_id) REFERENCES subjects(id),
  FOREIGN KEY (class_id) REFERENCES classes(id),
  FOREIGN KEY (approved_by) REFERENCES profiles(id)
);
```

**cbt_exams** (CRITICAL WORKFLOW)
```sql
CREATE TABLE cbt_exams (
  id CHAR(36) NOT NULL PRIMARY KEY,
  teacher_id CHAR(36),
  class_id CHAR(36),
  subject_id CHAR(36),
  academic_session VARCHAR(20) DEFAULT '2024/2025',
  term VARCHAR(20),
  
  title VARCHAR(255) NOT NULL,
  instructions TEXT,
  duration INTEGER NOT NULL, -- minutes
  total_marks DECIMAL(5, 2) NOT NULL,
  pass_mark DECIMAL(5, 2) NOT NULL,
  allowed_attempts INTEGER DEFAULT 1,
  shuffle_questions BOOLEAN DEFAULT TRUE,
  show_results_immediately BOOLEAN DEFAULT FALSE,
  
  -- Workflow
  status ENUM('draft', 'pending_approval', 'approved', 'published', 'archived') DEFAULT 'draft',
  submitted_for_approval_at DATETIME,
  approved_by CHAR(36),
  approved_at DATETIME,
  rejection_reason TEXT,
  published_at DATETIME,
  
  start_time DATETIME,
  end_time DATETIME,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES profiles(id),
  FOREIGN KEY (class_id) REFERENCES classes(id),
  FOREIGN KEY (subject_id) REFERENCES subjects(id),
  FOREIGN KEY (approved_by) REFERENCES profiles(id)
);
```

**cbt_questions**
```sql
CREATE TABLE cbt_questions (
  id CHAR(36) NOT NULL PRIMARY KEY,
  exam_id CHAR(36),
  question_number INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  question_type VARCHAR(50) DEFAULT 'multiple_choice',
  option_a TEXT,
  option_b TEXT,
  option_c TEXT,
  option_d TEXT,
  correct_answer TEXT NOT NULL,
  points DECIMAL(5, 2) DEFAULT 1,
  explanation TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY (exam_id, question_number),
  FOREIGN KEY (exam_id) REFERENCES cbt_exams(id) ON DELETE CASCADE
);
```

**cbt_attempts**
```sql
CREATE TABLE cbt_attempts (
  id CHAR(36) NOT NULL PRIMARY KEY,
  exam_id CHAR(36),
  student_id CHAR(36),
  attempt_number INTEGER NOT NULL,
  started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  submitted_at DATETIME,
  time_spent INTEGER, -- seconds
  score DECIMAL(5, 2),
  total_marks DECIMAL(5, 2),
  percentage DECIMAL(5, 2),
  passed BOOLEAN,
  status ENUM('in_progress', 'submitted', 'graded') DEFAULT 'in_progress',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY (exam_id, student_id, attempt_number),
  FOREIGN KEY (exam_id) REFERENCES cbt_exams(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES profiles(id) ON DELETE CASCADE
);
```

**cbt_answers**
```sql
CREATE TABLE cbt_answers (
  id CHAR(36) NOT NULL PRIMARY KEY,
  attempt_id CHAR(36),
  question_id CHAR(36),
  selected_answer TEXT,
  is_correct BOOLEAN,
  points_awarded DECIMAL(5, 2) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY (attempt_id, question_id),
  FOREIGN KEY (attempt_id) REFERENCES cbt_attempts(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES cbt_questions(id) ON DELETE CASCADE
);
```

**results** (CRITICAL WORKFLOW)
```sql
CREATE TABLE results (
  id CHAR(36) NOT NULL PRIMARY KEY,
  student_id CHAR(36),
  class_id CHAR(36),
  subject_id CHAR(36),
  academic_session VARCHAR(20) DEFAULT '2024/2025',
  term VARCHAR(20) NOT NULL,
  
  ca_score DECIMAL(5, 2) DEFAULT 0,
  exam_score DECIMAL(5, 2) DEFAULT 0,
  total_score DECIMAL(5, 2) DEFAULT 0,
  grade VARCHAR(5),
  position INTEGER,
  total_students INTEGER,
  
  teacher_id CHAR(36),
  teacher_remarks TEXT,
  
  -- Workflow
  status ENUM('draft', 'submitted', 'approved', 'published') DEFAULT 'draft',
  submitted_at DATETIME,
  approved_by CHAR(36),
  approved_at DATETIME,
  published BOOLEAN DEFAULT FALSE,
  published_at DATETIME,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY (student_id, subject_id, academic_session, term),
  FOREIGN KEY (student_id) REFERENCES profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (class_id) REFERENCES classes(id),
  FOREIGN KEY (subject_id) REFERENCES subjects(id),
  FOREIGN KEY (teacher_id) REFERENCES profiles(id),
  FOREIGN KEY (approved_by) REFERENCES profiles(id)
);
```

**Others**
*(For brevity, assume similar structure for `assignments`, `messages`, `announcements`, `fee_structures`, `student_fees`, `payments`, `leave_requests`, `payroll` - use JSON columns for array fields like `attachment_urls`)*

---

## 4. API Architecture & Endpoints

### Base URL
`https://your-domain.com/api/v1`

### Authentication Header
`Authorization: Bearer <jwt_token>`

### Core Endpoints

#### Authentication
- `POST /auth/login.php` - Body: `{email, password}`. Returns: `{token, user}`
- `GET /auth/me.php` - Returns current user profile based on Token.

#### Lesson Notes
- `GET /lesson-notes/list.php`
- `POST /lesson-notes/create.php`
- `PATCH /lesson-notes/update.php?id=...`
- `PATCH /lesson-notes/submit.php?id=...`
- `PATCH /lesson-notes/approve.php?id=...`
- `PATCH /lesson-notes/reject.php?id=...`
- `PATCH /lesson-notes/share.php?id=...`

#### CBT Exams
- `GET /cbt/exams.php`
- `POST /cbt/create.php`
- `POST /cbt/add-questions.php`
- `POST /cbt/start-attempt.php`
- `POST /cbt/submit-attempt.php` (Auto-grading logic here)

#### Results
- `GET /results/student.php?id=...`
- `POST /results/upload.php`
- `PATCH /results/submit.php`
- `PATCH /results/approve.php`
- `PATCH /results/publish.php`

---

## 5. Implementation Steps

### Step 1: Database Setup
1. Log in to cPanel -> MySQL Databases.
2. Create a new database.
3. Import the SQL Schema from Section 3.
4. Create a database user and assign to database.

### Step 2: PHP Environment
1. Ensure PHP 7.4+ or 8.x is enabled.
2. Enable extensions: `pdo_mysql`, `json`, `mbstring`.

### Step 3: API Boilerplate
1. Create `config/database.php`
```php
<?php
class Database {
    private $host = "localhost";
    private $db_name = "your_db_name";
    private $username = "your_db_user";
    private $password = "your_db_pass";
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }
        return $this->conn;
    }
}
?>
```

### Step 4: Implement Workflows
Follow the logic in Section 6.

---

## 6. Critical Workflows

### Workflow 1: Lesson Note Approval

**Logic:**
1. **Create:** Teacher POSTs to `/create.php`. Status = `draft`.
2. **Submit:** Teacher PATCHes `/submit.php`. Check if owner. Set Status = `pending`.
3. **Approve:** Principal PATCHes `/approve.php`. Check role. Set Status = `approved`.
4. **Share:** Teacher PATCHes `/share.php`. Check if approved. Set `shared_with_students` = `1`.

### Workflow 2: CBT Exam Auto-Grading

**Logic (in `submit-attempt.php`):**
1. Receive list of answers `[{question_id, selected_answer}]`.
2. Fetch correct answers from DB: `SELECT id, correct_answer, points FROM cbt_questions WHERE exam_id = ?`.
3. Loop through answers:
   - If `selected_answer == correct_answer`, add points to score.
   - Insert record into `cbt_answers`.
4. Calculate `percentage = (score / total_marks) * 100`.
5. Update `cbt_attempts` with `score` and `status = 'graded'`.
6. Return result to frontend.

---

## 7. Security & Authentication

### JWT Implementation
Use `firebase/php-jwt` or similar.
- **Login:** Verify password (use `password_verify()`), generate token with user ID and Role.
- **Middleware:** In every protected file:
```php
$headers = getAllHeaders();
$jwt = $headers['Authorization'];
// Decode and verify
// If invalid, return 401
```

### CORS
Enable CORS in your PHP scripts or `.htaccess` to allow requests from the frontend calling from a different domain/port if necessary, or just serve from the same domain.

```php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
```

---

## 8. Testing Guide

1. **Test Auth:** Login as all 7 roles.
2. **Test Flow:** Login as Teacher -> Create Note. Login as Principal -> Approve. Login as Student -> View.
3. **Test CBT:** Create exam, take exam, verify auto-grade score.
