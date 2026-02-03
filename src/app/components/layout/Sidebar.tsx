import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { getNavigationForRole } from '../../../utils/navigation';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Activity, 
  Users, 
  DollarSign, 
  FileText, 
  Settings,
  GraduationCap,
  BookCheck,
  UserCheck,
  BookOpen,
  UserPlus,
  Calendar,
  CalendarClock,
  Wallet,
  Award,
  Receipt,
  CreditCard,
  BarChart,
  TrendingDown,
  School,
  Upload,
  CheckSquare,
  ClipboardList,
  FileQuestion,
  CheckCircle,
  Library,
  MessageSquare,
  Home
} from 'lucide-react';
import { cn } from '../ui/utils';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  LayoutDashboard,
  TrendingUp,
  Activity,
  Users,
  DollarSign,
  FileText,
  Settings,
  GraduationCap,
  BookCheck,
  UserCheck,
  BookOpen,
  UserPlus,
  Calendar,
  CalendarClock,
  Wallet,
  Award,
  Receipt,
  CreditCard,
  BarChart,
  TrendingDown,
  School,
  Upload,
  CheckSquare,
  ClipboardList,
  FileQuestion,
  CheckCircle,
  Library,
  MessageSquare,
};

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  collapsed?: boolean;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentPage, 
  onNavigate, 
  collapsed = false,
  mobileOpen = false,
  onMobileClose
}) => {
  const { user } = useAuth();

  if (!user) return null;

  const navigation = getNavigationForRole(user.role);

  const handleNavigate = (page: string) => {
    onNavigate(page);
    if (onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "h-screen bg-blue-950 text-white transition-all duration-300 flex flex-col",
        "fixed lg:sticky top-0 z-50",
        collapsed ? "w-20" : "w-64",
        // Mobile responsive
        "lg:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo Section */}
        <div className="p-4 sm:p-6 border-b border-blue-900">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-blue-950 text-xs sm:text-sm font-bold">BF</span>
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <h1 className="text-xs sm:text-sm truncate">Bishop Felix Owolabi</h1>
                <p className="text-[10px] sm:text-xs text-blue-300 truncate">International Academy</p>
              </div>
            )}
          </div>
        </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 sm:p-4 overflow-y-auto">
        <ul className="space-y-1 sm:space-y-2">
          {navigation.map((item) => {
            const Icon = iconMap[item.icon];
            const isActive = currentPage === item.href;

            return (
              <li key={item.href}>
                <button
                  onClick={() => handleNavigate(item.href)}
                  className={cn(
                    "w-full flex items-center justify-start text-left gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base",
                    isActive 
                      ? "bg-amber-500 text-blue-950" 
                      : "text-blue-100 hover:bg-blue-900"
                  )}
                >
                  {Icon && <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />}
                  {!collapsed && (
                    <span className="flex-1 text-left truncate">{item.title}</span>
                  )}
                  {!collapsed && item.badge && (
                    <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs bg-red-500 text-white rounded-full flex-shrink-0">
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Role Badge */}
      {!collapsed && (
        <div className="p-3 sm:p-4 border-t border-blue-900">
          <div className="px-3 sm:px-4 py-2 bg-blue-900 rounded-lg">
            <p className="text-[10px] sm:text-xs text-blue-300">Current Role</p>
            <p className="capitalize text-sm sm:text-base">{user.role}</p>
          </div>
        </div>
      )}
    </aside>
    </>
  );
};
