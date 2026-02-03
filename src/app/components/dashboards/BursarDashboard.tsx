import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import {
  Home,
  DollarSign,
  CreditCard,
  Users,
  FileText,
  Briefcase,
  BarChart3,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { FinancialCommandCenter } from '../bursar/FinancialCommandCenter';
import { FeeConfiguration } from '../bursar/FeeConfiguration';
import { PaymentVerification } from '../bursar/PaymentVerification';
import { StudentLedgerManagement } from '../bursar/StudentLedger';
import { ExpenditureVoucher } from '../bursar/ExpenditureVoucher';
import { PayrollFulfillment } from '../bursar/PayrollFulfillment';
import { AuditReporting } from '../bursar/AuditReporting';
import { BankReconciliation } from '../bursar/BankReconciliation';
import { TaxCompliance } from '../bursar/TaxCompliance';
import { DailyCashBook } from '../bursar/DailyCashBook';

type BursarPage =
  | 'dashboard'
  | 'fee-config'
  | 'payments'
  | 'ledger'
  | 'expenditure'
  | 'payroll'
  | 'cashbook'
  | 'reconciliation'
  | 'compliance'
  | 'reports';

interface NavItem {
  id: BursarPage;
  icon: React.ReactNode;
  label: string;
}

export const BursarDashboard: React.FC = () => {
  const { logout } = useAuth();
  const [activePage, setActivePage] = useState<BursarPage>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems: NavItem[] = [
    { id: 'dashboard', icon: <Home className="w-5 h-5" />, label: 'Command Center' },
    { id: 'fee-config', icon: <DollarSign className="w-5 h-5" />, label: 'Fee Configuration' },
    { id: 'payments', icon: <CreditCard className="w-5 h-5" />, label: 'Payment Verification' },
    { id: 'ledger', icon: <Users className="w-5 h-5" />, label: 'Student Ledger' },
    { id: 'expenditure', icon: <FileText className="w-5 h-5" />, label: 'Expenditure' },
    { id: 'payroll', icon: <Briefcase className="w-5 h-5" />, label: 'Payroll' },
    { id: 'cashbook', icon: <FileText className="w-5 h-5" />, label: 'Daily Cash Book' },
    { id: 'reconciliation', icon: <BarChart3 className="w-5 h-5" />, label: 'Bank Reconciliation' },
    { id: 'compliance', icon: <FileText className="w-5 h-5" />, label: 'Tax & Compliance' },
    { id: 'reports', icon: <BarChart3 className="w-5 h-5" />, label: 'Audit Reporting' },
  ];

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <FinancialCommandCenter />;
      case 'fee-config':
        return <FeeConfiguration />;
      case 'payments':
        return <PaymentVerification />;
      case 'ledger':
        return <StudentLedgerManagement />;
      case 'expenditure':
        return <ExpenditureVoucher />;
      case 'payroll':
        return <PayrollFulfillment />;
      case 'cashbook':
        return <DailyCashBook />;
      case 'reconciliation':
        return <BankReconciliation />;
      case 'compliance':
        return <TaxCompliance />;
      case 'reports':
        return <AuditReporting />;
      default:
        return <FinancialCommandCenter />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-blue-950 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-blue-900">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-white">BFOIA Bursar</h1>
                <p className="text-xs text-blue-300">Financial Management</p>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-white hover:text-blue-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-blue-900">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">BA</span>
              </div>
              <div>
                <p className="text-white font-medium text-sm">Mrs. Biodun Ajayi</p>
                <p className="text-blue-300 text-xs">School Bursar</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActivePage(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activePage === item.id
                      ? 'bg-amber-500 text-white'
                      : 'text-blue-100 hover:bg-blue-900'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-blue-900">
            <button 
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-900 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex-1 lg:ml-0 ml-4">
              <h2 className="text-lg font-semibold text-blue-950">
                Bishop Felix Owolabi International Academy
              </h2>
              <p className="text-sm text-gray-600">Bursar Financial Portal</p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">{renderPage()}</main>
      </div>
    </div>
  );
};