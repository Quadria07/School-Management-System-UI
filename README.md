# BFOIA School Management System

**Bishop Felix Owolabi International Academy**  
**Frontend-Only Version with Mock Data**

---

## 🎯 Project Overview

A comprehensive school management system built with **React**, **TypeScript**, and **Tailwind CSS**. The frontend is 100% complete and production-ready, currently using **localStorage** for mock data demonstration.

### ✅ Current Status
- **Frontend:** ✅ 100% Complete
- **Backend:** ⏳ Awaiting Implementation (See: BACKEND_DEVELOPER_GUIDE.md)
- **Mode:** Demo/Development (localStorage-based)

---

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

---

## 👥 User Roles (7 Total)

The system supports 7 distinct user roles with role-specific dashboards and features:

1. **Student** - View lessons, take CBT exams, submit assignments, view results
2. **Teacher** - Create lesson notes, CBT exams, grade students, manage classes
3. **Parent** - Monitor children's progress, view results, attendance, fees
4. **Principal** - Approve content, manage academics, oversee operations
5. **Proprietor** - Executive dashboard, analytics, system oversight
6. **HR Manager** - Staff management, payroll, leave requests
7. **Bursar** - Financial management, fee collection, payment verification

### Role Switcher
Use the **role selector in the navbar** to switch between roles instantly without authentication.

---

## 🎨 Key Features

### ✅ Implemented Features

#### Academic Management
- ✅ **Lesson Notes System** (Teacher → Principal → Students approval workflow)
- ✅ **CBT Examination System** (Create, approve, auto-grade)
- ✅ **Results/Grades Management** (Entry, approval, publication workflow)
- ✅ **Assignment Submission** (Create, submit, grade)
- ✅ **Attendance Tracking** (Student & Staff)
- ✅ **Class & Subject Management**

#### Communication
- ✅ **Unified Communication Hub** (Messages, announcements, notifications)
- ✅ **Parent-Teacher Communication**
- ✅ **System-wide Announcements**
- ✅ **Real-time Notifications**

#### Financial
- ✅ **Fee Management** (Configuration, tracking, payment)
- ✅ **Payment Verification** (Bursar workflows)
- ✅ **Student Ledger**
- ✅ **Financial Reports**

#### HR Management
- ✅ **Staff Directory**
- ✅ **Payroll Configuration**
- ✅ **Leave Management**
- ✅ **Performance Tracking**

#### Student Features
- ✅ **Passport Photo Upload** (5MB max, image validation)
- ✅ **Student Dashboard** (Academic overview)
- ✅ **CBT Exam Hall** (Take exams with auto-grading)
- ✅ **Results Portal** (View published results)

### 🔐 Critical Approval Workflows

All implemented with strict approval gates:

#### 1. Lesson Notes Workflow
```
Teacher Creates → Teacher Submits → Principal Approves → Teacher Shares → Students View
```

#### 2. CBT Exam Workflow
```
Teacher Creates → Teacher Submits → Principal Approves → Principal Publishes → Students Take Exam
```

#### 3. Results Workflow
```
Teacher Enters → Teacher Submits → Principal Approves → Principal Publishes → Students/Parents View
```

---

## 📁 Project Structure

```
/
├── README.md                           # 🎯 START HERE - Project overview
├── BACKEND_DEVELOPER_GUIDE.md          # 🎯 Backend implementation guide
├── ATTRIBUTIONS.md                     # System file (ignore)
├── package.json
├── vite.config.ts
├── postcss.config.mjs
│
├── src/                                # ✅ Complete frontend application
│   ├── app/App.tsx
│   ├── app/components/                 # 110+ React components
│   ├── contexts/                       # Auth & Parent contexts
│   ├── data/mockData.ts               # Mock data examples
│   ├── types/index.ts                 # TypeScript types
│   ├── utils/                         # Helper utilities
│   └── styles/                        # CSS & Tailwind
│
├── guidelines/                         # System guidelines (ignore)
```

**Note for Backend Developer:** You will create your own fresh PHP/MySQL backend following the BACKEND_DEVELOPER_GUIDE.md.

---

## 🔑 Mock Authentication

The system currently uses a **mock authentication system** with predefined users:

### Demo Login Credentials
```
Student:     student@test.com     / password123
Teacher:     teacher@test.com     / password123
Parent:      parent@test.com      / password123
Principal:   principal@test.com   / password123
Proprietor:  proprietor@test.com  / password123
HR Manager:  hr@test.com          / password123
Bursar:      bursar@test.com      / password123
```

**Or** use the **Role Switcher** in the navbar to switch instantly without login.

---

## 📊 Data Storage (Current)

All data is currently stored in **localStorage**:

| Key | Description |
|-----|-------------|
| `currentUser` | Current logged-in user |
| `students` | All students data |
| `teachers` | All teachers data |
| `classes` | Classes and subjects |
| `lessonNotes` | Lesson notes with approval status |
| `cbtExams` | CBT exams and questions |
| `results` | Student results/grades |
| `attendance` | Attendance records |
| `messages` | Communication messages |
| `announcements` | System announcements |
| `fees` | Fee structures and payments |

**⚠️ Note:** Your backend developer will replace all localStorage calls with real API calls to Supabase.

---

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - UI component library
- **Lucide React** - Icons
- **Recharts** - Charts and graphs
- **date-fns** - Date utilities

### Backend (To Be Implemented)
- **PHP** - Server-side scripting (Vanilla or Framework)
- **MySQL/MariaDB** - Database
- **REST API** - JSON-based API endpoints
- **JWT** - JSON Web Token authentication
- **cPanel** - Deployment environment

---

## 📖 For Backend Developers

### 🎯 Start Here: `/BACKEND_DEVELOPER_GUIDE.md`

This comprehensive guide contains:
- ✅ Complete database schema (25+ tables)
- ✅ All 80+ API endpoints with specifications
- ✅ Critical approval workflow logic
- ✅ Auto-grading algorithm for CBT exams
- ✅ Database security best practices
- ✅ Authentication & authorization middleware
- ✅ Test scenarios and credentials
- ✅ Frontend integration instructions

**Estimated Implementation Time:** 12-15 hours

### Key Files to Reference
- `/src/types/index.ts` - All TypeScript types
- `/src/utils/dataFlowService.ts` - Current data flow logic (localStorage-based)
- `/src/data/mockData.ts` - Sample data structures
- `/src/contexts/AuthContext.tsx` - Current auth implementation

### Critical Requirements
1. Maintain all 7 user roles
2. Enforce approval workflows (Teacher → Principal → Students)
3. Implement auto-grading for CBT exams
4. Secure API with JWT
5. File upload for student photos (5MB max)

---

## 🎨 Design System

### Colors
The system uses a cohesive color palette defined in `/src/styles/theme.css`:
- Primary: Blue tones
- Secondary: Purple tones
- Success: Green
- Warning: Yellow
- Error: Red
- Neutral: Grays

### Typography
Custom fonts are imported in `/src/styles/fonts.css`

### Components
All UI components follow **shadcn/ui** patterns and are located in `/src/app/components/ui/`

---

## 📝 Key Implementation Notes

### Approval Gates
The system has **strict approval gates** implemented in `/src/utils/dataFlowService.ts`:
- Lesson notes must be approved before students can view
- CBT exams must be approved AND published before students can take them
- Results must be approved AND published before students/parents can view

### Auto-Grading
CBT exams are auto-graded upon submission:
1. Student submits exam
2. System compares answers with correct answers
3. Calculates score, percentage, and pass/fail status
4. Stores results immediately

### File Validation
Student passport photos are validated:
- Maximum size: 5MB
- Allowed formats: JPEG, PNG, WebP
- Automatic preview generation

---

## 🚀 Deployment

### Frontend Deployment
```bash
npm run build
# Deploy the /dist folder to public_html in cPanel
```

### Backend Deployment
See `/BACKEND_DEVELOPER_GUIDE.md` for PHP/MySQL deployment instructions.

---

## 📄 License

© 2026 Bishop Felix Owolabi International Academy. All rights reserved.

---

## 🤝 Contributing

This is a proprietary school management system. Contact the development team for contribution guidelines.

---

## 📞 Support

For technical support or questions about backend implementation, refer to:
- `/BACKEND_DEVELOPER_GUIDE.md` - Complete implementation guide
- TypeScript types in `/src/types/index.ts`
- Mock data examples in `/src/data/mockData.ts`

---

**Status:** ✅ Frontend Complete | ⏳ Backend Pending Implementation

**Last Updated:** January 2026