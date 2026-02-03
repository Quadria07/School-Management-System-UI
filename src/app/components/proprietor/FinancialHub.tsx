import React, { useState } from 'react';
import { PageHeader } from './PageHeader';
import { StatCard } from './StatCard';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Download,
  Filter,
  Search,
  AlertCircle
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

// Mock data
const revenueBreakdown = [
  { category: 'School Fees', amount: 3200000, percentage: 71 },
  { category: 'Uniforms', amount: 450000, percentage: 10 },
  { category: 'Books', amount: 520000, percentage: 12 },
  { category: 'Bus Services', amount: 330000, percentage: 7 },
];

const expenseBreakdown = [
  { category: 'Salaries', amount: 1800000, percentage: 50 },
  { category: 'Utilities', amount: 450000, percentage: 12.5 },
  { category: 'Maintenance', amount: 360000, percentage: 10 },
  { category: 'Supplies', amount: 540000, percentage: 15 },
  { category: 'Fuel', amount: 270000, percentage: 7.5 },
  { category: 'Others', amount: 180000, percentage: 5 },
];

const profitLossData = [
  { month: 'Jan', income: 750000, expense: 620000, profit: 130000 },
  { month: 'Feb', income: 780000, expense: 640000, profit: 140000 },
  { month: 'Mar', income: 820000, expense: 680000, profit: 140000 },
  { month: 'Apr', income: 760000, expense: 590000, profit: 170000 },
  { month: 'May', income: 800000, expense: 620000, profit: 180000 },
  { month: 'Jun', income: 850000, expense: 650000, profit: 200000 },
];

const defaultersList = [
  { id: 'STD001', name: 'Adeyemi Tunde', class: 'JSS 2A', amountOwed: 85000, status: 'Critical' },
  { id: 'STD045', name: 'Okafor Chioma', class: 'SS 1B', amountOwed: 120000, status: 'Critical' },
  { id: 'STD089', name: 'Ibrahim Rasheed', class: 'JSS 3C', amountOwed: 45000, status: 'Moderate' },
  { id: 'STD102', name: 'Oluwaseun Grace', class: 'SS 2A', amountOwed: 95000, status: 'Critical' },
  { id: 'STD134', name: 'Bello Ahmed', class: 'JSS 1B', amountOwed: 32000, status: 'Low' },
  { id: 'STD156', name: 'Nkechi Okonkwo', class: 'SS 3A', amountOwed: 150000, status: 'Critical' },
];

export const FinancialHub: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('current-term');

  const filteredDefaulters = defaultersList.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalIncome = profitLossData.reduce((sum, item) => sum + item.income, 0);
  const totalExpense = profitLossData.reduce((sum, item) => sum + item.expense, 0);
  const netProfit = totalIncome - totalExpense;

  return (
    <div className="p-8">
      <PageHeader
        title="Financial Intelligence Hub"
        description="Complete financial oversight and profitability analysis"
        icon={DollarSign}
        action={
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        }
      />

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value="₦4.5M"
          change="+12.5% from last term"
          changeType="positive"
          icon={TrendingUp}
          iconBgColor="bg-green-500"
          iconColor="text-white"
        />
        <StatCard
          title="Total Expenses"
          value="₦3.6M"
          change="+8.2% from last term"
          changeType="negative"
          icon={TrendingDown}
          iconBgColor="bg-red-500"
          iconColor="text-white"
        />
        <StatCard
          title="Net Profit"
          value="₦960K"
          change="21.3% profit margin"
          changeType="positive"
          icon={DollarSign}
          iconBgColor="bg-blue-500"
          iconColor="text-white"
        />
        <StatCard
          title="Outstanding Debt"
          value="₦527K"
          change="12 students owing"
          changeType="negative"
          icon={AlertCircle}
          iconBgColor="bg-amber-500"
          iconColor="text-blue-950"
        />
      </div>

      {/* Revenue Breakdown */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="text-lg mb-4">Revenue Sources Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueBreakdown} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="category" width={100} />
                <Tooltip formatter={(value) => `₦${(Number(value) / 1000).toFixed(0)}K`} />
                <Bar dataKey="amount" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {revenueBreakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{item.category}</p>
                  <p className="text-sm text-gray-600">₦{(item.amount / 1000).toFixed(0)}K</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-green-600">{item.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Expense Tracker */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="text-lg mb-4">Expense Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {expenseBreakdown.map((item, index) => (
            <div key={index} className="text-center p-4 bg-red-50 rounded-lg border border-red-100">
              <p className="text-sm text-gray-600 mb-1">{item.category}</p>
              <p className="text-lg mb-1">₦{(item.amount / 1000).toFixed(0)}K</p>
              <p className="text-xs text-red-600">{item.percentage}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* Profit & Loss Statement */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg">Profit & Loss Statement (Last 6 Months)</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedPeriod('current-term')}
              className={`px-4 py-2 rounded-lg text-sm ${
                selectedPeriod === 'current-term'
                  ? 'bg-blue-950 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Current Term
            </button>
            <button
              onClick={() => setSelectedPeriod('annual')}
              className={`px-4 py-2 rounded-lg text-sm ${
                selectedPeriod === 'annual'
                  ? 'bg-blue-950 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Annual
            </button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={profitLossData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `₦${(Number(value) / 1000).toFixed(0)}K`} />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} name="Income" />
            <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} name="Expense" />
            <Line type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={2} name="Profit" />
          </LineChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Total Income</p>
            <p className="text-2xl text-green-600">₦{(totalIncome / 1000).toFixed(0)}K</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Total Expense</p>
            <p className="text-2xl text-red-600">₦{(totalExpense / 1000).toFixed(0)}K</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Net Profit</p>
            <p className="text-2xl text-blue-600">₦{(netProfit / 1000).toFixed(0)}K</p>
          </div>
        </div>
      </div>

      {/* Fee Default List */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg">Fee Defaulters List</h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search student..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export List
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-sm">Student ID</th>
                <th className="text-left px-4 py-3 text-sm">Name</th>
                <th className="text-left px-4 py-3 text-sm">Class</th>
                <th className="text-left px-4 py-3 text-sm">Amount Owed</th>
                <th className="text-left px-4 py-3 text-sm">Status</th>
                <th className="text-left px-4 py-3 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredDefaulters.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{student.id}</td>
                  <td className="px-4 py-3 text-sm font-medium">{student.name}</td>
                  <td className="px-4 py-3 text-sm">{student.class}</td>
                  <td className="px-4 py-3 text-sm">₦{student.amountOwed.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        student.status === 'Critical'
                          ? 'bg-red-100 text-red-700'
                          : student.status === 'Moderate'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="sm">
                      Send Reminder
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
