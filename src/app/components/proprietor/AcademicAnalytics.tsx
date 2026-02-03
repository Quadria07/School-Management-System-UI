import React, { useState } from 'react';
import { PageHeader } from './PageHeader';
import { StatCard } from './StatCard';
import { 
  Award, 
  TrendingUp, 
  TrendingDown,
  Download,
  Filter,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '../ui/button';

// Mock data
const classPerformanceData = [
  { class: 'JSS 1A', average: 72, passRate: 85, students: 35 },
  { class: 'JSS 1B', average: 68, passRate: 80, students: 34 },
  { class: 'JSS 2A', average: 75, passRate: 88, students: 33 },
  { class: 'JSS 2B', average: 70, passRate: 82, students: 32 },
  { class: 'JSS 3A', average: 78, passRate: 90, students: 31 },
  { class: 'JSS 3B', average: 73, passRate: 85, students: 30 },
  { class: 'SS 1A', average: 69, passRate: 78, students: 28 },
  { class: 'SS 1B', average: 66, passRate: 75, students: 27 },
  { class: 'SS 2A', average: 74, passRate: 86, students: 26 },
  { class: 'SS 2B', average: 71, passRate: 83, students: 25 },
  { class: 'SS 3A', average: 80, passRate: 92, students: 24 },
  { class: 'SS 3B', average: 76, passRate: 88, students: 23 },
];

const subjectMasteryData = [
  { subject: 'English', passRate: 88, average: 74, A: 45, B: 32, C: 11, D: 8, F: 4 },
  { subject: 'Mathematics', passRate: 82, average: 70, A: 38, B: 35, C: 15, D: 8, F: 4 },
  { subject: 'Physics', passRate: 79, average: 68, A: 32, B: 38, C: 18, D: 9, F: 3 },
  { subject: 'Chemistry', passRate: 85, average: 72, A: 40, B: 35, C: 13, D: 9, F: 3 },
  { subject: 'Biology', passRate: 90, average: 76, A: 48, B: 30, C: 12, D: 7, F: 3 },
  { subject: 'Economics', passRate: 86, average: 73, A: 42, B: 33, C: 14, D: 8, F: 3 },
  { subject: 'Government', passRate: 84, average: 71, A: 39, B: 34, C: 16, D: 8, F: 3 },
  { subject: 'Literature', passRate: 81, average: 69, A: 35, B: 36, C: 17, D: 9, F: 3 },
];

const entranceExamData = [
  { month: 'Jan', applicants: 45, passed: 32, passRate: 71 },
  { month: 'Feb', applicants: 52, passed: 38, passRate: 73 },
  { month: 'Mar', applicants: 48, passed: 35, passRate: 73 },
  { month: 'Apr', applicants: 60, passed: 45, passRate: 75 },
  { month: 'May', applicants: 55, passed: 42, passRate: 76 },
  { month: 'Jun', applicants: 58, passed: 44, passRate: 76 },
];

const subjectComparisonData = [
  { subject: 'English', thisYear: 88, lastYear: 85 },
  { subject: 'Mathematics', thisYear: 82, lastYear: 80 },
  { subject: 'Sciences', thisYear: 85, lastYear: 82 },
  { subject: 'Humanities', thisYear: 83, lastYear: 81 },
  { subject: 'Languages', thisYear: 81, lastYear: 79 },
];

export const AcademicAnalytics: React.FC = () => {
  const [selectedView, setSelectedView] = useState<'class' | 'subject'>('class');

  const topPerforming = classPerformanceData.sort((a, b) => b.average - a.average).slice(0, 3);
  const needsImprovement = classPerformanceData.sort((a, b) => a.average - b.average).slice(0, 3);

  const totalApplicants = entranceExamData.reduce((sum, item) => sum + item.applicants, 0);
  const totalPassed = entranceExamData.reduce((sum, item) => sum + item.passed, 0);
  const overallPassRate = ((totalPassed / totalApplicants) * 100).toFixed(1);

  return (
    <div className="p-8">
      <PageHeader
        title="Academic Standards & Analytics"
        description="Monitor academic performance and maintain educational excellence"
        icon={Award}
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

      {/* Academic Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Overall Pass Rate"
          value="85.2%"
          change="+3.5% from last session"
          changeType="positive"
          icon={TrendingUp}
          iconBgColor="bg-green-500"
          iconColor="text-white"
        />
        <StatCard
          title="Average Score"
          value="72.8%"
          change="+2.1% improvement"
          changeType="positive"
          icon={Award}
          iconBgColor="bg-blue-500"
          iconColor="text-white"
        />
        <StatCard
          title="Top Performing Class"
          value="SS 3A"
          change="80% average score"
          changeType="positive"
          icon={GraduationCap}
          iconBgColor="bg-amber-500"
          iconColor="text-blue-950"
        />
        <StatCard
          title="Entrance Exam Rate"
          value={`${overallPassRate}%`}
          change={`${totalPassed}/${totalApplicants} passed`}
          changeType="positive"
          icon={BookOpen}
          iconBgColor="bg-purple-500"
          iconColor="text-white"
        />
      </div>

      {/* View Toggle */}
      <div className="mb-6">
        <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-white">
          <button
            onClick={() => setSelectedView('class')}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              selectedView === 'class'
                ? 'bg-blue-950 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Class Performance
          </button>
          <button
            onClick={() => setSelectedView('subject')}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              selectedView === 'subject'
                ? 'bg-blue-950 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Subject Mastery
          </button>
        </div>
      </div>

      {/* Class-by-Class Performance */}
      {selectedView === 'class' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-lg mb-4">Class-by-Class Performance Comparison</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={classPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="class" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="average" fill="#3b82f6" name="Average Score %" />
              <Bar dataKey="passRate" fill="#10b981" name="Pass Rate %" />
            </BarChart>
          </ResponsiveContainer>
          
          {/* Performance Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t">
            <div>
              <h4 className="text-sm font-medium text-green-700 mb-3">Top Performing Classes</h4>
              <div className="space-y-2">
                {topPerforming.map((cls, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">{cls.class}</span>
                    <span className="text-green-600">{cls.average}% avg</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-amber-700 mb-3">Needs Improvement</h4>
              <div className="space-y-2">
                {needsImprovement.map((cls, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                    <span className="font-medium">{cls.class}</span>
                    <span className="text-amber-600">{cls.average}% avg</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subject Mastery Report */}
      {selectedView === 'subject' && (
        <div className="space-y-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg mb-4">Subject Pass Rates</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={subjectMasteryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis type="category" dataKey="subject" width={100} />
                <Tooltip />
                <Legend />
                <Bar dataKey="passRate" fill="#10b981" name="Pass Rate %" />
                <Bar dataKey="average" fill="#3b82f6" name="Average Score %" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Grade Distribution */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg mb-4">Grade Distribution by Subject</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm">Subject</th>
                    <th className="text-center px-4 py-3 text-sm">A (70-100)</th>
                    <th className="text-center px-4 py-3 text-sm">B (60-69)</th>
                    <th className="text-center px-4 py-3 text-sm">C (50-59)</th>
                    <th className="text-center px-4 py-3 text-sm">D (40-49)</th>
                    <th className="text-center px-4 py-3 text-sm">F (0-39)</th>
                    <th className="text-center px-4 py-3 text-sm">Pass Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {subjectMasteryData.map((subject, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{subject.subject}</td>
                      <td className="px-4 py-3 text-center text-green-600">{subject.A}%</td>
                      <td className="px-4 py-3 text-center text-blue-600">{subject.B}%</td>
                      <td className="px-4 py-3 text-center text-yellow-600">{subject.C}%</td>
                      <td className="px-4 py-3 text-center text-orange-600">{subject.D}%</td>
                      <td className="px-4 py-3 text-center text-red-600">{subject.F}%</td>
                      <td className="px-4 py-3 text-center font-semibold">{subject.passRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Year-over-Year Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg mb-4">Year-over-Year Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subjectComparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="lastYear" fill="#94a3b8" name="Last Year" />
              <Bar dataKey="thisYear" fill="#3b82f6" name="This Year" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* CBT Entrance Analytics */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg mb-4">CBT Entrance Exam Analytics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={entranceExamData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="applicants" stroke="#8b5cf6" strokeWidth={2} name="Applicants" />
              <Line yAxisId="left" type="monotone" dataKey="passed" stroke="#10b981" strokeWidth={2} name="Passed" />
              <Line yAxisId="right" type="monotone" dataKey="passRate" stroke="#f59e0b" strokeWidth={2} name="Pass Rate %" />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Applicants</p>
              <p className="text-2xl text-purple-600">{totalApplicants}</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Passed</p>
              <p className="text-2xl text-green-600">{totalPassed}</p>
            </div>
            <div className="text-center p-3 bg-amber-50 rounded-lg">
              <p className="text-sm text-gray-600">Pass Rate</p>
              <p className="text-2xl text-amber-600">{overallPassRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Insights */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
        <h3 className="text-lg mb-4">Key Insights & Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-green-900 mb-1">Strong Performance</p>
                <p className="text-sm text-gray-600">Biology and English show consistent excellence with 90% and 88% pass rates respectively.</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="flex items-start gap-3">
              <TrendingDown className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-amber-900 mb-1">Attention Needed</p>
                <p className="text-sm text-gray-600">SS 1A and SS 1B require additional support to improve from 69% and 66% average scores.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
