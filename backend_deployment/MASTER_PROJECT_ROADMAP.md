# 🗺️ Master Project Roadmap: School Management System

This document outlines every single phase required to take this project from "Template" to "Production Ready".

---

## ✅ Phase 1: Foundation (COMPLETED)
**Goal:** Establish secure connection and authentication.
- [x] **Database:** MySQL Schema created and imported.
- [x] **Configuration:** `config.php` secured outside public root.
- [x] **Connection:** `db_connect.php` successfully connecting.
- [x] **Authentication:** JWT Login system working & tested.

---

## 🚧 Phase 2: User Dashboards (Read-Only Data)
**Goal:** Ensure users see their specific data upon logging in.
*Estimated Time: 2-3 Hours*

### 2.1 Student Dashboard API
- [ ] `GET /api/students/profile.php` - Get personal info & photo.
- [ ] `GET /api/students/stats.php` - Get attendance %, current term fee status.
- [ ] `GET /api/students/timetable.php` - Get class schedule.

### 2.2 Teacher Dashboard API
- [ ] `GET /api/teachers/stats.php` - Count of students, classes, pending notes.
- [ ] `GET /api/teachers/classes.php` - List of assigned classes.
- [ ] `GET /api/teachers/schedule.php` - Teching timetable.

### 2.3 Principal/Admin Dashboard API
- [ ] `GET /api/admin/stats.php` - Total fees collected, population stats.
- [ ] `GET /api/admin/approvals.php` - Pending items needing attention.

---

## Phase 3: Academic Management (The "Teacher" Engine)
**Goal:** Allow teachers to perform their daily duties.
*Estimated Time: 4-5 Hours*

### 3.1 Class Management
- [ ] `GET /api/classes/students.php` - List students in a specific class.
- [ ] `POST /api/attendance/mark.php` - Take daily attendance.

### 3.2 Lesson Notes (Workflow 1)
- [ ] `POST /api/lesson-notes/create.php` - Create new note (Draft).
- [ ] `PATCH /api/lesson-notes/submit.php` - Submit for approval.
- [ ] `GET /api/lesson-notes/list.php` - View notes history.

### 3.3 Assignments
- [ ] `POST /api/assignments/create.php` - Upload assignment.
- [ ] `GET /api/assignments/submissions.php` - View student work.

---

## Phase 4: Critical Approval Workflows
**Goal:** Implement the security gates (Teacher -> Principal).
*Estimated Time: 3 Hours*

### 4.1 Principal Actions
- [ ] `GET /api/approvals/pending.php` - Unified list of all pending items.
- [ ] `PATCH /api/approvals/action.php` - Approve or Reject (Lesson Notes, Results, Exams).
- [ ] **Logic:** Implement notifications when items are rejected.

---

## Phase 5: Examination System (CBT - The Core Feature)
**Goal:** Functional exam creation, taking, and auto-grading.
*Estimated Time: 6-8 Hours*

### 5.1 Exam Creation
- [ ] `POST /api/cbt/create_exam.php` - Basic exam details.
- [ ] `POST /api/cbt/add_questions.php` - Support for bulk question upload.

### 5.2 Exam Taking (Student Side)
- [ ] `GET /api/cbt/get_exam.php` - Fetch questions (Hidden answers).
- [ ] `POST /api/cbt/submit.php` - **(CRITICAL)** The Auto-grader logic.
    - *Compare answers -> Calculate Score -> Update DB -> Return Result.*

---

## Phase 6: Results & Grading
**Goal:** Grade entry and Report Cards.
*Estimated Time: 4 Hours*

- [ ] `POST /api/results/upload.php` - Teacher uploads scores.
- [ ] `GET /api/results/broadsheet.php` - Admin view of all scores.
- [ ] `GET /api/results/student_report.php` - Generate termly report card.
- [ ] `GET /api/results/check.php` - Parent/Student view (locked if fees not paid).

---

## Phase 7: Financial & HR (Admin Features)
**Goal:** Money management and staff control.
*Estimated Time: 3 Hours*

- [ ] `POST /api/fees/record_payment.php` - Bursar records payment.
- [ ] `GET /api/fees/history.php` - Student payment history.
- [ ] `GET /api/payroll/list.php` - Staff salary status.

---

## Phase 8: Frontend Integration (The Bridge)
**Goal:** Connect the React Frontend to these new PHP APIs.
*Estimated Time: 5-6 Hours*

1.  **Service Layer:** Create `src/services/api.ts` to handle all Axios/Fetch calls.
2.  **Auth Replacement:** Update `AuthContext.tsx` to use the real Login API.
3.  **Data Replacement:** Go through every page (Dashboard, Classes, Exams) and swap `mockData` for `api.get(...)`.
4.  **Testing:** Manual walkthrough of every user story.

---

## 🏁 Phase 9: Final Deployment
**Goal:** Go live.
- [ ] Update frontend `.env` with production API URL.
- [ ] Run `npm run build`.
- [ ] Upload `dist` folder to cPanel `public_html`.
