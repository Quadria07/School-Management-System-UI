import React from 'react';
import { ExecutiveSummary } from './ExecutiveSummary';
import { FinancialHub } from './FinancialHub';
import { HROversight } from './HROversight';
import { AcademicAnalytics } from './AcademicAnalytics';
import { AdministrativeControls } from './AdministrativeControls';
import { CommunicationCenter } from './CommunicationCenter';
import { AuditTrail } from './AuditTrail';
import { AccountSettings } from './AccountSettings';

interface ProprietorDashboardProps {
  page?: string;
}

export const ProprietorDashboard: React.FC<ProprietorDashboardProps> = ({ page = 'dashboard' }) => {
  switch (page) {
    case 'financial-hub':
      return <FinancialHub />;
    case 'hr-oversight':
      return <HROversight />;
    case 'academic-analytics':
      return <AcademicAnalytics />;
    case 'system-controls':
      return <AdministrativeControls />;
    case 'communication':
      return <CommunicationCenter />;
    case 'audit-trail':
      return <AuditTrail />;
    case 'account-settings':
      return <AccountSettings />;
    default:
      return <ExecutiveSummary />;
  }
};