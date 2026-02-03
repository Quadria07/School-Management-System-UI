import React, { useState } from 'react';
import { PageHeader } from './PageHeader';
import { 
  Activity, 
  Filter,
  Download,
  Search,
  Clock,
  User,
  FileEdit,
  DollarSign,
  UserPlus,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

// Mock audit log data
const auditLogs = [
  {
    id: 1,
    timestamp: '2024-12-28 14:35:22',
    user: 'Bursar (Mrs. Adenike)',
    action: 'Updated Fee Status',
    target: 'Student ID #102 (Adeyemi Tunde)',
    description: 'Changed fee payment status from "Pending" to "Partial Payment (₦50,000)"',
    category: 'Financial',
    severity: 'Normal',
    ipAddress: '192.168.1.45',
  },
  {
    id: 2,
    timestamp: '2024-12-28 13:20:15',
    user: 'Principal (Mr. Ogunleye)',
    action: 'Modified Student Grade',
    target: 'Student ID #405 (Blessing Okafor) - Mathematics',
    description: 'Changed grade from 68 to 72 after rechecking exam scripts',
    category: 'Academic',
    severity: 'High',
    ipAddress: '192.168.1.22',
  },
  {
    id: 3,
    timestamp: '2024-12-28 11:45:08',
    user: 'HR Manager (Mrs. Ibrahim)',
    action: 'Created New Staff Account',
    target: 'Teacher - Dr. Olumide Ajayi (Chemistry)',
    description: 'New teaching staff account created with role: Teacher',
    category: 'HR',
    severity: 'High',
    ipAddress: '192.168.1.33',
  },
  {
    id: 4,
    timestamp: '2024-12-28 10:15:42',
    user: 'Principal (Mr. Ogunleye)',
    action: 'Approved Lesson Note',
    target: 'Lesson Note #LN-2024-156 (Physics - SS2)',
    description: 'Approved lesson note submitted by Mr. Bello',
    category: 'Academic',
    severity: 'Normal',
    ipAddress: '192.168.1.22',
  },
  {
    id: 5,
    timestamp: '2024-12-28 09:30:18',
    user: 'Bursar (Mrs. Adenike)',
    action: 'Processed Expense Payment',
    target: 'Expense Claim #EXP-2024-089',
    description: 'Approved and processed payment of ₦45,000 for school maintenance',
    category: 'Financial',
    severity: 'High',
    ipAddress: '192.168.1.45',
  },
  {
    id: 6,
    timestamp: '2024-12-27 16:45:30',
    user: 'HR Manager (Mrs. Ibrahim)',
    action: 'Modified Payroll',
    target: 'Teacher - Mr. Chukwu Emmanuel',
    description: 'Added performance bonus of ₦25,000 to monthly salary',
    category: 'HR',
    severity: 'High',
    ipAddress: '192.168.1.33',
  },
  {
    id: 7,
    timestamp: '2024-12-27 15:20:55',
    user: 'Principal (Mr. Ogunleye)',
    action: 'Suspended Student',
    target: 'Student ID #234 (Ibrahim Mohammed - JSS 3B)',
    description: 'Temporary suspension for 3 days due to disciplinary issues',
    category: 'Disciplinary',
    severity: 'Critical',
    ipAddress: '192.168.1.22',
  },
  {
    id: 8,
    timestamp: '2024-12-27 14:10:22',
    user: 'Bursar (Mrs. Adenike)',
    action: 'Generated Invoice',
    target: 'Invoice #INV-2025-001 (Second Term Fees)',
    description: 'Generated second term fee invoices for all students',
    category: 'Financial',
    severity: 'Normal',
    ipAddress: '192.168.1.45',
  },
  {
    id: 9,
    timestamp: '2024-12-27 11:30:40',
    user: 'Proprietor (Bishop Felix Owolabi)',
    action: 'Modified Grading Policy',
    target: 'Institutional Grading Scale',
    description: 'Updated Grade A minimum score from 75 to 70',
    category: 'Settings',
    severity: 'Critical',
    ipAddress: '192.168.1.10',
  },
  {
    id: 10,
    timestamp: '2024-12-27 10:05:15',
    user: 'HR Manager (Mrs. Ibrahim)',
    action: 'Approved Leave Request',
    target: 'Staff - Mrs. Okonkwo (Mathematics Teacher)',
    description: 'Approved 5-day leave request from Dec 30 to Jan 3',
    category: 'HR',
    severity: 'Normal',
    ipAddress: '192.168.1.33',
  },
  {
    id: 11,
    timestamp: '2024-12-26 16:25:33',
    user: 'Principal (Mr. Ogunleye)',
    action: 'Published Exam Results',
    target: 'First Term Examination Results - All Classes',
    description: 'Published first term examination results for parent viewing',
    category: 'Academic',
    severity: 'High',
    ipAddress: '192.168.1.22',
  },
  {
    id: 12,
    timestamp: '2024-12-26 13:40:18',
    user: 'Bursar (Mrs. Adenike)',
    action: 'Deleted Payment Record',
    target: 'Payment ID #PAY-2024-456 (Duplicate Entry)',
    description: 'Removed duplicate payment record after verification',
    category: 'Financial',
    severity: 'Critical',
    ipAddress: '192.168.1.45',
  },
];

const categories = ['All', 'Financial', 'Academic', 'HR', 'Disciplinary', 'Settings'];
const severityLevels = ['All', 'Normal', 'High', 'Critical'];

export const AuditTrail: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [dateRange, setDateRange] = useState('all-time');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      searchTerm === '' ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || log.category === selectedCategory;
    const matchesSeverity = selectedSeverity === 'All' || log.severity === selectedSeverity;

    return matchesSearch && matchesCategory && matchesSeverity;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Financial':
        return <DollarSign className="w-4 h-4" />;
      case 'Academic':
        return <FileEdit className="w-4 h-4" />;
      case 'HR':
        return <UserPlus className="w-4 h-4" />;
      case 'Settings':
        return <Settings className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">
            <AlertTriangle className="w-3 h-3" />
            Critical
          </span>
        );
      case 'High':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-amber-100 text-amber-700 rounded-full">
            <AlertTriangle className="w-3 h-3" />
            High
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
            <CheckCircle className="w-3 h-3" />
            Normal
          </span>
        );
    }
  };

  const criticalCount = auditLogs.filter((log) => log.severity === 'Critical').length;
  const highCount = auditLogs.filter((log) => log.severity === 'High').length;
  const todayCount = auditLogs.filter((log) => log.timestamp.startsWith('2024-12-28')).length;

  return (
    <div className="p-8">
      <PageHeader
        title="System Audit Trail"
        description="Security and anti-fraud monitoring with detailed activity logs"
        icon={Activity}
        action={
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export Audit Log
          </Button>
        }
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Activities (Today)</p>
          <p className="text-3xl">{todayCount}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Critical Actions</p>
          <p className="text-3xl">{criticalCount}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-8 h-8 text-amber-500" />
          </div>
          <p className="text-sm text-gray-600 mb-1">High Priority</p>
          <p className="text-3xl">{highCount}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <User className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Active Users Today</p>
          <p className="text-3xl">4</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by user, action, or target..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Severity Filter */}
          <div>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              {severityLevels.map((level) => (
                <option key={level} value={level}>
                  {level === 'All' ? 'All Severity' : level}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Range */}
        <div className="mt-4 flex gap-2">
          {['today', 'week', 'month', 'all-time'].map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                dateRange === range
                  ? 'bg-blue-950 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range === 'today' && 'Today'}
              {range === 'week' && 'This Week'}
              {range === 'month' && 'This Month'}
              {range === 'all-time' && 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg">Activity Log ({filteredLogs.length} entries)</h3>
          <p className="text-sm text-gray-600">All times are in West Africa Time (WAT)</p>
        </div>

        <div className="space-y-3">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                log.severity === 'Critical' ? 'border-red-200 bg-red-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      log.category === 'Financial'
                        ? 'bg-green-100 text-green-600'
                        : log.category === 'Academic'
                        ? 'bg-blue-100 text-blue-600'
                        : log.category === 'HR'
                        ? 'bg-purple-100 text-purple-600'
                        : log.category === 'Settings'
                        ? 'bg-gray-100 text-gray-600'
                        : 'bg-amber-100 text-amber-600'
                    }`}
                  >
                    {getCategoryIcon(log.category)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{log.action}</h4>
                      <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded">
                        {log.category}
                      </span>
                      {getSeverityBadge(log.severity)}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      <User className="w-3 h-3 inline mr-1" />
                      {log.user}
                    </p>
                    <p className="text-sm mb-2">
                      <strong>Target:</strong> {log.target}
                    </p>
                    <p className="text-sm text-gray-700">{log.description}</p>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-600 flex-shrink-0 ml-4">
                  <div className="flex items-center gap-1 mb-1">
                    <Clock className="w-4 h-4" />
                    <span>{log.timestamp}</span>
                  </div>
                  <p className="text-xs text-gray-500">IP: {log.ipAddress}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No activities found matching your filters</p>
          </div>
        )}
      </div>

      {/* Security Notice */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-blue-600 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Audit Trail Security</h4>
            <p className="text-sm text-blue-800 mb-3">
              All critical actions are permanently logged and cannot be modified or deleted. This ensures complete transparency and accountability across the system.
            </p>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Financial transactions are logged with timestamps and user details</li>
              <li>• Grade modifications require Principal authorization and are fully traceable</li>
              <li>• User account changes are monitored for security purposes</li>
              <li>• System settings modifications are flagged as critical actions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
