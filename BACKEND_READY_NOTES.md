# BFOIA School Management System - Backend Integration Ready

**Date:** January 26, 2026  
**Status:** ✅ Demo Features Removed - Ready for Backend Integration

---

## Changes Made to Remove Demo Functionality

### 1. **Removed Role Switching Demo Feature**

#### Files Modified:

**A. `/src/contexts/AuthContext.tsx`**
- Removed `switchRole` method from `AuthContextType` interface
- Removed `switchRole` function from AuthProvider
- Removed `switchRole` from context provider value

**B. `/src/app/components/layout/Navbar.tsx`**
- Removed `switchRole` from `useAuth()` destructuring
- Removed `handleRoleSwitch` function
- Removed entire "Demo Role Switcher" dropdown menu from navbar UI
- Cleaned up imports (removed unused `switchRole`)

---

## What's Still Mock (To Be Replaced with Real Backend)

### 1. **Authentication System**
**Location:** `/src/contexts/AuthContext.tsx`

**Current Mock Behavior:**
- Login accepts any email with role keywords (e.g., "teacher@bfoia.edu.ng" → Teacher role)
- Uses `MOCK_USERS` object for demo user data
- No actual password verification
- No real JWT tokens or session management

**Backend Integration Needed:**
```typescript
// Current mock login - REPLACE THIS
const login = async (email: string, password: string) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock role detection from email
  let matchedRole: UserRole | undefined;
  if (email.includes('proprietor')) matchedRole = 'proprietor';
  // ... etc
  
  setUser(MOCK_USERS[matchedRole]);
};

// Replace with real backend call:
const login = async (email: string, password: string) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  setUser(data.user);
  localStorage.setItem('token', data.token);
};
```

### 2. **Signup & User Approval**
**Location:** `/src/contexts/AuthContext.tsx`

**Current Mock Behavior:**
- Stores pending users in component state only
- No database persistence
- Approval/rejection doesn't actually create or delete users

**Backend Integration Needed:**
- POST `/api/auth/signup` - Create user in database with `status: 'pending'`
- GET `/api/users/pending` - Fetch pending users for HR/Admin
- PATCH `/api/users/:id/approve` - Approve user
- PATCH `/api/users/:id/reject` - Reject user

### 3. **Data Persistence (localStorage)**
**Locations:** Multiple components and `/src/utils/dataFlowService.ts`

**Current Storage Keys:**
- `lesson_notes` - Lesson notes data
- `gradebook_term_results` - Student term results
- `gradebook_submitted_classes` - Result submission tracking
- `timetable_data` - Timetable entries
- `timetable_statuses` - Timetable publish/draft status
- `timetable_time_slots` - Custom time slots
- `cbt_assessments` - CBT assessments and approval status
- `cbt_attempts` - Student CBT attempts
- `student_passport_photos` - Student photos
- `communication_messages` - Messages data
- `attendance_records` - Attendance data

**Backend Integration Needed:**
All localStorage calls should be replaced with API calls:
```typescript
// Example: Replace localStorage lesson notes
// BEFORE (localStorage):
const notes = JSON.parse(localStorage.getItem('lesson_notes') || '[]');

// AFTER (API):
const response = await fetch('/api/lesson-notes', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const notes = await response.json();
```

---

## How to Test Current System (Without Role Switcher)

### Login Credentials for Testing Each Role:

| Role | Email | Any Password |
|------|-------|--------------|
| Proprietor | proprietor@bfoia.edu.ng | any |
| Principal | principal@bfoia.edu.ng | any |
| HR Manager | hr@bfoia.edu.ng | any |
| Bursar | bursar@bfoia.edu.ng | any |
| Teacher | teacher@bfoia.edu.ng | any |
| Student | student@bfoia.edu.ng | any |
| Parent | parent@bfoia.edu.ng | any |

**Note:** The system detects role from email pattern. Password is not validated in mock mode.

---

## Backend API Endpoints Needed

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh-token` - Refresh JWT
- `POST /api/auth/forgot-password` - Send reset email
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/me` - Get current user

### User Management
- `GET /api/users` - List users (with role filter)
- `GET /api/users/:id` - Get user details
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/pending` - Get pending approvals
- `PATCH /api/users/:id/approve` - Approve user
- `PATCH /api/users/:id/reject` - Reject user with reason

### Lesson Notes
- `GET /api/lesson-notes` - Get lesson notes (with filters)
- `POST /api/lesson-notes` - Create lesson note
- `PATCH /api/lesson-notes/:id` - Update lesson note
- `PATCH /api/lesson-notes/:id/submit` - Submit for approval
- `PATCH /api/lesson-notes/:id/approve` - Approve (Principal)
- `PATCH /api/lesson-notes/:id/reject` - Reject with feedback

### Results/Grades
- `GET /api/results` - Get results (with class/term filters)
- `POST /api/results` - Create/update results
- `PATCH /api/results/:classId/lock` - Lock results (Teacher)
- `PATCH /api/results/:classId/approve` - Approve results (Principal)
- `GET /api/results/:studentId/report-card` - Generate report card

### Timetable
- `GET /api/timetables` - Get timetables (with class filter)
- `POST /api/timetables` - Create/update timetable
- `PATCH /api/timetables/:classId/publish` - Publish timetable
- `PATCH /api/timetables/:classId/draft` - Save as draft

### CBT System
- `GET /api/cbt/assessments` - Get CBT assessments
- `POST /api/cbt/assessments` - Create CBT assessment
- `PATCH /api/cbt/assessments/:id` - Update CBT
- `PATCH /api/cbt/assessments/:id/submit-for-approval` - Submit to Principal
- `PATCH /api/cbt/assessments/:id/approve` - Approve (Principal)
- `PATCH /api/cbt/assessments/:id/reject` - Reject with feedback
- `PATCH /api/cbt/assessments/:id/publish` - Publish to students
- `POST /api/cbt/attempts` - Submit student attempt
- `GET /api/cbt/attempts/:studentId` - Get student attempts

### Communication
- `GET /api/messages` - Get messages
- `POST /api/messages` - Send message
- `PATCH /api/messages/:id/read` - Mark as read
- `GET /api/announcements` - Get announcements
- `POST /api/announcements` - Create announcement

### Attendance
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance` - Mark attendance
- `PATCH /api/attendance/:id` - Update attendance

### Finance (Bursar)
- `GET /api/finance/fees` - Get fee records
- `POST /api/finance/fees` - Record fee payment
- `GET /api/finance/reports` - Financial reports
- `GET /api/finance/outstanding` - Outstanding balances

### Students
- `GET /api/students` - List students
- `GET /api/students/:id` - Get student details
- `POST /api/students` - Add student
- `PATCH /api/students/:id` - Update student
- `POST /api/students/:id/photo` - Upload passport photo

### Staff (HR)
- `GET /api/staff` - List staff
- `GET /api/staff/:id` - Get staff details
- `POST /api/staff` - Add staff
- `PATCH /api/staff/:id` - Update staff
- `GET /api/payroll` - Get payroll data
- `POST /api/payroll` - Process payroll

---

## Important Notes for Backend Developer

### 1. **Approval Workflows are Critical**
The system has strict approval gates:
- **Lesson Notes:** Teacher → Principal
- **Results:** Teacher locks → Principal approves → Students see
- **CBT:** Teacher creates → Submits for approval → Principal approves → Teacher publishes → Students see
- **Timetable:** Principal saves draft → Principal publishes → Students see

**Backend MUST enforce these gates**, not just the frontend.

### 2. **Role-Based Access Control (RBAC)**
Every API endpoint must verify:
- User is authenticated (valid JWT)
- User has permission for the action (role check)
- User can only access their own data (ownership check)

Example:
```typescript
// Teacher can only see their own lesson notes
GET /api/lesson-notes → Filter by teacher_id from JWT

// Principal can see all lesson notes
GET /api/lesson-notes → No teacher_id filter

// Students can only see approved results
GET /api/results → Filter by approved = true
```

### 3. **localStorage Keys to Database Tables**

| localStorage Key | Suggested Database Table |
|-----------------|-------------------------|
| `lesson_notes` | `lesson_notes` |
| `gradebook_term_results` | `results` or `grades` |
| `timetable_data` | `timetable_entries` |
| `timetable_statuses` | `timetable_metadata` |
| `cbt_assessments` | `cbt_assessments` |
| `cbt_attempts` | `cbt_attempts` |
| `student_passport_photos` | `students` (column: photo_url) |
| `communication_messages` | `messages` |
| `attendance_records` | `attendance` |

### 4. **File Uploads**
The following features need file/image upload support:
- Student passport photos
- Lesson note attachments (optional)
- Assignment submissions (if implemented)

Use cloud storage (AWS S3, Cloudinary, etc.) and store URLs in database.

### 5. **Real-time Features (Optional Enhancement)**
Consider WebSockets or Server-Sent Events for:
- New message notifications
- Attendance alerts
- Grade release notifications

---

## Testing the System

### Option 1: Test with Mock Backend
You can test the frontend by:
1. Login with any role using email pattern (e.g., `teacher@bfoia.edu.ng`)
2. Explore all features - they work with localStorage
3. Data persists across sessions until localStorage is cleared

### Option 2: Connect to Real Backend
When backend is ready:
1. Replace AuthContext login/signup with API calls
2. Replace dataFlowService localStorage calls with API calls
3. Add JWT token to all API requests
4. Add error handling for network failures
5. Add loading states during API calls

---

## Ready for Backend Integration ✅

The frontend is now clean and ready for backend integration:
- ✅ No role switching demo
- ✅ Proper login flow in place
- ✅ All features functional with localStorage
- ✅ Clear separation of concerns
- ✅ Approval workflows implemented
- ✅ Role-based UI components ready

**Next Step:** Backend developer can start implementing the API endpoints listed above!

---

**Prepared by:** AI Assistant  
**Date:** January 26, 2026  
**Status:** Ready for Production Backend Integration
