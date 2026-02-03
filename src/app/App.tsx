import React, { useState } from 'react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { MainLayout } from './components/layout/MainLayout';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage, SignupFormData } from './components/auth/SignupPage';
import { ForgotPasswordPage } from './components/auth/ForgotPasswordPage';
import { PendingApprovalPage } from './components/auth/PendingApprovalPage';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { ClassroomOverview } from './components/teacher/ClassroomOverview';
import { ClassManagement } from './components/teacher/ClassManagement';
import { DigitalGradebook } from './components/teacher/DigitalGradebook';
import { CBTAssessmentBuilder } from './components/teacher/CBTAssessmentBuilder';
import { CommunicationHub as TeacherCommunicationHub } from './components/teacher/CommunicationHub';
import { DailyBriefing } from './components/teacher/DailyBriefing';
import { StudentDashboard } from './components/student/StudentDashboard';
import { StudentCommandCenter } from './components/student/StudentCommandCenter';
import { LearningHub } from './components/student/LearningHub';
import { CBTExamHall } from './components/student/CBTExamHall';
import { ResultsPortal } from './components/student/ResultsPortal';
import { AssignmentsHub } from './components/student/AssignmentsHub';
import { FinancialOverview } from './components/student/FinancialOverview';
import { AttendanceConduct } from './components/student/AttendanceConduct';
import { DefaultDashboard } from './components/dashboards/DefaultDashboard';
import { FamilyHub } from './components/parent/FamilyHub';
import { AcademicMonitor } from './components/parent/AcademicMonitor';
import { FeeManagement } from './components/parent/FeeManagement';
import { AttendanceTracking } from './components/parent/AttendanceTracking';
import { LearningOversight } from './components/parent/LearningOversight';
import { ParentCommunication } from './components/parent/ParentCommunication';
import { AdmissionEnrollment } from './components/parent/AdmissionEnrollment';
import { AssessmentResultCenter } from './components/parent/AssessmentResultCenter';
import { ExecutiveSummary } from './components/proprietor/ExecutiveSummary';
import { FinancialHub } from './components/proprietor/FinancialHub';
import { HROversight } from './components/proprietor/HROversight';
import { HRCommandCenter } from './components/hr/HRCommandCenter';
import { StaffDirectory } from './components/hr/StaffDirectory';
import { AttendanceTracking as HRAttendanceTracking } from './components/hr/AttendanceTracking';
import { LeaveManagement } from './components/hr/LeaveManagement';
import { Recruitment } from './components/hr/Recruitment';
import { PerformanceManagement } from './components/hr/PerformanceManagement';
import { PayrollConfiguration } from './components/hr/PayrollConfiguration';
import { StudentTimetable } from './components/student/StudentTimetable';
import { AssignmentSubmission } from './components/student/AssignmentSubmission';
import { AcademicAnalytics } from './components/proprietor/AcademicAnalytics';
import { AdministrativeControls } from './components/proprietor/AdministrativeControls';
import { CommunicationCenter } from './components/proprietor/CommunicationCenter';
import { AuditTrail } from './components/proprietor/AuditTrail';
import { AccountSettings } from './components/proprietor/AccountSettings';
import { AcademicCommandCenter } from './components/principal/AcademicCommandCenter';
import { AdmissionCBTPortal } from './components/principal/AdmissionCBTPortal';
import { CurriculumManagement } from './components/principal/CurriculumManagement';
import { ExaminationManagement } from './components/principal/ExaminationManagement';
import { AttendanceDiscipline } from './components/principal/AttendanceDiscipline';
import { TimetableResources } from './components/principal/TimetableResources';
import { CommunicationHub } from './components/principal/CommunicationHub';
import { PrincipalSystemControl } from './components/principal/PrincipalSystemControl';
import { StudentManagement } from './components/principal/StudentManagement';
import { BursarDashboard } from './components/dashboards/BursarDashboard';
import { Toaster } from './components/ui/sonner';
import { ParentProvider } from '../contexts/ParentContext';
import { ProfileSettings } from './components/shared/ProfileSettings';
import { AdminClassManagement } from './components/shared/AdminClassManagement';
import { SubjectManagement } from './components/shared/SubjectManagement';
import { StudentsDatabase } from './components/shared/StudentsDatabase';
import { StaffDatabase } from './components/shared/StaffDatabase';
import { TransportManifesto } from './components/shared/TransportManifesto';
import { SchoolCalendarPage } from './components/parent/SchoolCalendarPage';
import { ParentActivitiesPage } from './components/parent/ParentActivitiesPage';
import { ParentChildSelector } from './components/parent/ParentChildSelector';
import { UnifiedCommunicationHub } from './components/shared/UnifiedCommunicationHub';
// import { OnboardingTour } from './components/common/OnboardingTour'; // Temporarily disabled

function AppContent() {
  const { user, login, signup, resetPassword, logout, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('/dashboard');
  const [authPage, setAuthPage] = useState<'login' | 'signup' | 'forgot-password'>('login');

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#003366] via-[#004080] to-[#002244]">
        <div className="text-center text-white">
          <div className="w-20 h-20 bg-[#FFD700] rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
            <span className="text-4xl text-[#003366]">BF</span>
          </div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login, signup, or forgot password page if no user is authenticated
  if (!user) {
    if (authPage === 'signup') {
      return (
        <SignupPage
          onSignup={async (userData: SignupFormData) => {
            await signup(userData);
          }}
          onBackToLogin={() => setAuthPage('login')}
        />
      );
    }
    
    if (authPage === 'forgot-password') {
      return (
        <ForgotPasswordPage
          onBackToLogin={() => setAuthPage('login')}
          onResetPassword={resetPassword}
        />
      );
    }
    
    return (
      <LoginPage
        onLogin={login}
        onNavigateToSignup={() => setAuthPage('signup')}
        onNavigateToForgotPassword={() => setAuthPage('forgot-password')}
      />
    );
  }

  // Check if user account is pending approval
  if (user.approvalStatus === 'pending') {
    return (
      <PendingApprovalPage
        userName={user.name}
        userEmail={user.email}
        userRole={user.role}
        onLogout={logout}
      />
    );
  }

  const renderPage = () => {
    // Shared routes (accessible to all roles)
    if (currentPage === '/account-settings') {
      return <ProfileSettings onNavigate={setCurrentPage} />;
    }

    // Route to role-specific dashboards
    if (currentPage === '/dashboard') {
      switch (user.role) {
        case 'teacher':
          return <ClassroomOverview onNavigate={setCurrentPage} />;
        case 'student':
          return <StudentCommandCenter onNavigate={setCurrentPage} />;
        case 'parent':
          return <FamilyHub onNavigate={setCurrentPage} />;
        case 'hr':
          return <HRCommandCenter onNavigate={setCurrentPage} />;
        case 'proprietor':
          return <ExecutiveSummary />;
        case 'principal':
          return <AcademicCommandCenter />;
        case 'bursar':
          return <BursarDashboard />;
        default:
          return <DefaultDashboard />;
      }
    }

    // Proprietor routes
    if (user.role === 'proprietor') {
      switch (currentPage) {
        case '/financial-hub':
          return <FinancialHub />;
        case '/hr-oversight':
          return <HROversight />;
        case '/staff-directory':
          return <StaffDirectory />;
        case '/attendance-tracking':
          return <HRAttendanceTracking />;
        case '/leave-management':
          return <LeaveManagement />;
        case '/recruitment':
          return <Recruitment />;
        case '/performance-management':
          return <PerformanceManagement />;
        case '/payroll-configuration':
          return <PayrollConfiguration />;
        case '/academic-analytics':
          return <AcademicAnalytics />;
        case '/class-management':
          return <AdminClassManagement />;
        case '/subject-management':
          return <SubjectManagement />;
        case '/students-database':
          return <StudentsDatabase />;
        case '/staff-database':
          return <StaffDatabase />;
        case '/transport-manifesto':
          return <TransportManifesto />;
        case '/system-controls':
          return <AdministrativeControls />;
        case '/communication':
          return <CommunicationCenter />;
        case '/audit-trail':
          return <AuditTrail />;
        case '/account-settings':
          return <AccountSettings />;
      }
    }

    // Principal routes
    if (user.role === 'principal') {
      switch (currentPage) {
        case '/admission-portal':
          return <AdmissionCBTPortal />;
        case '/curriculum-management':
          return <CurriculumManagement />;
        case '/examination-management':
          return <ExaminationManagement />;
        case '/attendance-discipline':
          return <AttendanceDiscipline />;
        case '/timetable-resources':
          return <TimetableResources />;
        case '/class-management':
          return <AdminClassManagement />;
        case '/subject-management':
          return <SubjectManagement />;
        case '/students-database':
          return <StudentsDatabase />;
        case '/staff-database':
          return <StaffDatabase />;
        case '/transport-manifesto':
          return <TransportManifesto />;
        case '/communication-hub':
          return <UnifiedCommunicationHub userRole="principal" />;
        case '/system-controls':
          return <PrincipalSystemControl />;
        case '/student-management':
          return <StudentManagement />;
      }
    }

    // Teacher routes
    if (user.role === 'teacher') {
      switch (currentPage) {
        case '/classroom-overview':
          return <ClassroomOverview onNavigate={setCurrentPage} />;
        case '/lesson-notes':
          return <TeacherDashboard />;
        case '/class-management':
          return <ClassManagement />;
        case '/gradebook':
          return <DigitalGradebook />;
        case '/assessments':
          return <CBTAssessmentBuilder />;
        case '/communication':
          return <UnifiedCommunicationHub userRole="teacher" />;
        case '/daily-briefing':
          return <DailyBriefing onNavigate={setCurrentPage} />;
        default:
          return <ClassroomOverview onNavigate={setCurrentPage} />;
      }
    }

    // Student routes
    if (user.role === 'student') {
      switch (currentPage) {
        case '/learning-hub':
          return <LearningHub />;
        case '/exams':
          return <CBTExamHall />;
        case '/results':
          return <ResultsPortal />;
        case '/assignments':
          return <AssignmentsHub />;
        case '/assignment-submit':
          return <AssignmentSubmission onNavigate={setCurrentPage} />;
        case '/timetable':
          return <StudentTimetable onNavigate={setCurrentPage} />;
        case '/fees':
          return <FinancialOverview />;
        case '/attendance':
          return <AttendanceConduct />;
        default:
          return <StudentCommandCenter onNavigate={setCurrentPage} />;
      }
    }

    // Parent routes
    if (user.role === 'parent') {
      switch (currentPage) {
        case '/family-hub':
          return <FamilyHub onNavigate={setCurrentPage} />;
        case '/school-calendar':
          return <SchoolCalendarPage onNavigate={setCurrentPage} />;
        case '/activities':
          return <ParentActivitiesPage onNavigate={setCurrentPage} />;
        case '/academic-monitor':
          return <AcademicMonitor />;
        case '/fee-management':
          return <FeeManagement />;
        case '/attendance-tracking':
          return <AttendanceTracking />;
        case '/learning-oversight':
          return <LearningOversight />;
        case '/parent-communication':
          return <ParentCommunication />;
        case '/admission-enrollment':
          return <AdmissionEnrollment />;
        case '/assessment-results':
          return <AssessmentResultCenter />;
        default:
          return <FamilyHub onNavigate={setCurrentPage} />;
      }
    }

    // HR routes
    if (user.role === 'hr') {
      switch (currentPage) {
        case '/staff-directory':
          return <StaffDirectory />;
        case '/class-management':
          return <AdminClassManagement />;
        case '/attendance-tracking':
          return <HRAttendanceTracking />;
        case '/leave-management':
          return <LeaveManagement />;
        case '/recruitment':
          return <Recruitment />;
        case '/performance':
          return <PerformanceManagement />;
        case '/payroll-config':
          return <PayrollConfiguration />;
        default:
          return <HRCommandCenter onNavigate={setCurrentPage} />;
      }
    }

    // Bursar routes - BursarDashboard has its own internal navigation
    if (user.role === 'bursar') {
      return <BursarDashboard />;
    }

    // Default fallback for other pages
    return <DefaultDashboard />;
  };

  // Bursar role uses its own layout system
  if (user.role === 'bursar') {
    return <BursarDashboard />;
  }

  return (
    <MainLayout currentPage={currentPage} onNavigate={setCurrentPage}>
      {user.role === 'parent' ? (
        <ParentProvider>
          <div className="flex flex-col h-full">
            <ParentChildSelector />
            <div className="flex-1">
              {renderPage()}
            </div>
          </div>
        </ParentProvider>
      ) : (
        renderPage()
      )}
    </MainLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster position="top-right" />
    </AuthProvider>
  );
}