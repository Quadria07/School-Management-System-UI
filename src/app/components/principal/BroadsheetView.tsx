import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { X, Calendar as CalendarIcon, FileText } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import schoolLogo from 'figma:asset/05e5dcd127c3f9119091f655ee2db41390342c66.png';
import { BroadsheetData } from './ExaminationManagement';

interface BroadsheetViewProps {
  broadsheetData: BroadsheetData[];
  selectedSession: string;
  selectedClass: string;
  onSessionChange: (value: string) => void;
  onClassChange: (value: string) => void;
  showInfoBanner?: boolean;
  showSignatures?: boolean;
}

export const BroadsheetView: React.FC<BroadsheetViewProps> = ({
  broadsheetData,
  selectedSession,
  selectedClass,
  onSessionChange,
  onClassChange,
  showInfoBanner = true,
  showSignatures = true,
}) => {
  const [teacherSignature, setTeacherSignature] = useState<string | null>(null);
  const [adminSignature, setAdminSignature] = useState<string | null>(null);
  const [principalSignature, setPrincipalSignature] = useState<string | null>(null);
  const [teacherDate, setTeacherDate] = useState<Date>();
  const [adminDate, setAdminDate] = useState<Date>();
  const [principalDate, setPrincipalDate] = useState<Date>();

  // Calculate class averages dynamically based on filtered students
  const classAverages = useMemo(() => {
    if (broadsheetData.length === 0) {
      return {
        english: { first: 0, second: 0, third: 0, total: 0, average: 0 },
        mathematics: { first: 0, second: 0, third: 0, total: 0, average: 0 },
        basicScience: { first: 0, second: 0, third: 0, total: 0, average: 0 },
        prevocational: { first: 0, second: 0, third: 0, total: 0, average: 0 },
        nationalValues: { first: 0, second: 0, third: 0, total: 0, average: 0 }
      };
    }

    const count = broadsheetData.length;
    const subjects = ['english', 'mathematics', 'basicScience', 'prevocational', 'nationalValues'] as const;
    const result: any = {};

    subjects.forEach(subject => {
      const totals = broadsheetData.reduce(
        (acc, student) => ({
          first: acc.first + student[subject].first,
          second: acc.second + student[subject].second,
          third: acc.third + student[subject].third,
          total: acc.total + student[subject].total,
          average: acc.average + student[subject].average,
        }),
        { first: 0, second: 0, third: 0, total: 0, average: 0 }
      );

      result[subject] = {
        first: totals.first / count,
        second: totals.second / count,
        third: totals.third / count,
        total: totals.total / count,
        average: totals.average / count,
      };
    });

    return result;
  }, [broadsheetData]);

  const handleSignatureUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'teacher' | 'admin' | 'principal'
  ) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const signature = reader.result as string;
        if (type === 'teacher') setTeacherSignature(signature);
        else if (type === 'admin') setAdminSignature(signature);
        else setPrincipalSignature(signature);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSignature = (type: 'teacher' | 'admin' | 'principal') => {
    if (type === 'teacher') setTeacherSignature(null);
    else if (type === 'admin') setAdminSignature(null);
    else setPrincipalSignature(null);
  };

  return (
    <div className="space-y-4">
      {/* Info Banner */}
      {showInfoBanner && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900">Auto-Generated Broadsheet</h3>
              <p className="text-sm text-blue-700 mt-1">
                This broadsheet is automatically populated with student term total scores per subject. 
                Data is collected immediately when student term results are locked by the principal in the Result Approval section.
              </p>
            </div>
          </div>
        </div>
      )}

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {/* Broadsheet Header */}
          <div className="bg-white p-6 border-b">
            {/* Logo and School Name - Logo Above */}
            <div className="flex flex-col items-center gap-3 mb-4">
              <img src={schoolLogo} alt="School Logo" className="w-20 h-20 object-contain" />
              <div className="text-center">
                <h2 className="font-bold text-blue-950 text-lg">BISHOP FELIX OWOLABI INT'L ACADEMY</h2>
                <p className="text-sm mt-1">1, Faithtriumph Drive, Behind Galaxy Hotel, West Bye Pass, Ring Road, Osogbo, Osun State</p>
                <p className="text-sm italic mt-1">MOTTO: .... refined learning for exceptional minds</p>
              </div>
            </div>
            
            {/* Selection Controls */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex flex-col gap-1">
                <span className="font-medium">SESSION:</span>
                <Select value={selectedSession} onValueChange={onSessionChange}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2023/2024">2023/2024</SelectItem>
                    <SelectItem value="2024/2025">2024/2025</SelectItem>
                    <SelectItem value="2025/2026">2025/2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-medium">CLASS:</span>
                <Select value={selectedClass} onValueChange={onClassChange}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GRADE 4">GRADE 4</SelectItem>
                    <SelectItem value="GRADE 5">GRADE 5</SelectItem>
                    <SelectItem value="JSS 1">JSS 1</SelectItem>
                    <SelectItem value="JSS 2">JSS 2</SelectItem>
                    <SelectItem value="JSS 3A">JSS 3A</SelectItem>
                    <SelectItem value="SSS 1">SSS 1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <h3 className="text-center font-bold text-lg mt-4 text-red-700">BROAD SHEET</h3>
          </div>

          {/* Main Broadsheet Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-[10px] border-collapse">
              <thead>
                {/* Subject Headers */}
                <tr className="bg-gray-100">
                  <th rowSpan={2} className="border border-gray-400 p-2 text-center" style={{minWidth: '30px'}}>S/N</th>
                  <th rowSpan={2} className="border border-gray-400 p-2 text-left" style={{minWidth: '150px'}}>STUDENT'S NAME</th>
                  <th colSpan={6} className="border border-gray-400 p-1 text-center bg-gray-200">ENGLISH</th>
                  <th colSpan={6} className="border border-gray-400 p-1 text-center bg-blue-900 text-white">MATHEMATICS</th>
                  <th colSpan={6} className="border border-gray-400 p-1 text-center bg-red-700 text-white">BASIC SCIENCE & TECHNOLOGY</th>
                  <th colSpan={6} className="border border-gray-400 p-1 text-center bg-gray-600 text-white">PRE-VOCATIONAL STUDIES</th>
                  <th colSpan={6} className="border border-gray-400 p-1 text-center bg-blue-950 text-white">NATIONAL VALUES</th>
                </tr>
                {/* Sub-columns */}
                <tr className="bg-gray-50">
                  <th className="border border-gray-400 p-1 text-center" style={{minWidth: '35px'}}>1ST</th>
                  <th className="border border-gray-400 p-1 text-center" style={{minWidth: '35px'}}>2ND</th>
                  <th className="border border-gray-400 p-1 text-center" style={{minWidth: '35px'}}>3RD</th>
                  <th className="border border-gray-400 p-1 text-center" style={{minWidth: '45px'}}>TOTAL</th>
                  <th className="border border-gray-400 p-1 text-center" style={{minWidth: '55px'}}>AVERAGE</th>
                  <th className="border border-gray-400 p-1 text-center" style={{minWidth: '45px'}}>POSITION</th>
                  
                  <th className="border border-gray-400 p-1 text-center" style={{minWidth: '35px'}}>1ST</th>
                  <th className="border border-gray-400 p-1 text-center" style={{minWidth: '35px'}}>2ND</th>
                  <th className="border border-gray-400 p-1 text-center" style={{minWidth: '35px'}}>3RD</th>
                  <th className="border border-gray-400 p-1 text-center" style={{minWidth: '45px'}}>TOTAL</th>
                  <th className="border border-gray-400 p-1 text-center" style={{minWidth: '55px'}}>AVERAGE</th>
                  <th className="border border-gray-400 p-1 text-center" style={{minWidth: '45px'}}>POSITION</th>
                  
                  <th className="border border-gray-400 p-1 text-center" style={{minWidth: '35px'}}>1ST</th>
                  <th className="border border-gray-400 p-1 text-center" style={{minWidth: '35px'}}>2ND</th>
                  <th className="border border-gray-400 p-1 text-center" style={{minWidth: '35px'}}>3RD</th>
                  <th className="border border-gray-400 p-1 text-center" style={{minWidth: '45px'}}>TOTAL</th>
                  <th className="border border-gray-400 p-1 text-center" style={{minWidth: '55px'}}>AVERAGE</th>
                  <th className="border border-gray-400 p-1 text-center" style={{minWidth: '45px'}}>POSITION</th>
                  
                  <th className="border border-gray-400 p-1 text-center" style={{minWidth: '35px'}}>1ST</th>
                  <th className="border border-gray-400 p-1 text-center" style={{minWidth: '35px'}}>2ND</th>
                  <th className="border border-gray-400 p-1 text-center" style={{minWidth: '35px'}}>3RD</th>
                  <th className="border border-gray-400 p-1 text-center" style={{minWidth: '45px'}}>TOTAL</th>
                  <th className="border border-gray-400 p-1 text-center" style={{minWidth: '55px'}}>AVERAGE</th>
                  <th className="border border-gray-400 p-1 text-center" style={{minWidth: '45px'}}>POSITION</th>
                  
                  <th className="border border-gray-400 p-1 text-center" style={{minWidth: '35px'}}>1ST</th>
                  <th className="border border-gray-400 p-1 text-center" style={{minWidth: '35px'}}>2ND</th>
                  <th className="border border-gray-400 p-1 text-center" style={{minWidth: '35px'}}>3RD</th>
                  <th className="border border-gray-400 p-1 text-center" style={{minWidth: '45px'}}>TOTAL</th>
                  <th className="border border-gray-400 p-1 text-center" style={{minWidth: '55px'}}>AVERAGE</th>
                  <th className="border border-gray-400 p-1 text-center" style={{minWidth: '45px'}}>POSITION</th>
                </tr>
              </thead>
              <tbody>
                {/* Student Rows */}
                {broadsheetData.length > 0 ? (
                  broadsheetData.map((student) => (
                    <tr key={student.sn} className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-1 text-center">{student.sn}</td>
                      <td className="border border-gray-300 p-1 font-medium">{student.studentName}</td>
                      
                      {/* English */}
                      <td className="border border-gray-300 p-1 text-center">{student.english.first.toFixed(2)}</td>
                      <td className="border border-gray-300 p-1 text-center">{student.english.second.toFixed(2)}</td>
                      <td className="border border-gray-300 p-1 text-center">{student.english.third.toFixed(2)}</td>
                      <td className="border border-gray-300 p-1 text-center">{student.english.total.toFixed(2)}</td>
                      <td className="border border-gray-300 p-1 text-center">{student.english.average > 0 ? student.english.average.toFixed(2) : '-'}</td>
                      <td className="border border-gray-300 p-1 text-center bg-red-100 font-medium">{student.english.position > 0 ? `${student.english.position}${['ST', 'ND', 'RD'][student.english.position - 1] || 'TH'}` : '-'}</td>
                      
                      {/* Mathematics */}
                      <td className="border border-gray-300 p-1 text-center">{student.mathematics.first.toFixed(2)}</td>
                      <td className="border border-gray-300 p-1 text-center">{student.mathematics.second.toFixed(2)}</td>
                      <td className="border border-gray-300 p-1 text-center">{student.mathematics.third.toFixed(2)}</td>
                      <td className="border border-gray-300 p-1 text-center">{student.mathematics.total.toFixed(2)}</td>
                      <td className="border border-gray-300 p-1 text-center">{student.mathematics.average.toFixed(2)}</td>
                      <td className="border border-gray-300 p-1 text-center bg-blue-100 font-medium">{`${student.mathematics.position}${['ST', 'ND', 'RD'][student.mathematics.position - 1] || 'TH'}`}</td>
                      
                      {/* Basic Science */}
                      <td className="border border-gray-300 p-1 text-center">{student.basicScience.first.toFixed(2)}</td>
                      <td className="border border-gray-300 p-1 text-center">{student.basicScience.second.toFixed(2)}</td>
                      <td className="border border-gray-300 p-1 text-center">{student.basicScience.third.toFixed(2)}</td>
                      <td className="border border-gray-300 p-1 text-center">{student.basicScience.total.toFixed(2)}</td>
                      <td className="border border-gray-300 p-1 text-center">{student.basicScience.average.toFixed(2)}</td>
                      <td className="border border-gray-300 p-1 text-center bg-red-100 font-medium">{`${student.basicScience.position}${['ST', 'ND', 'RD'][student.basicScience.position - 1] || 'TH'}`}</td>
                      
                      {/* Pre-vocational */}
                      <td className="border border-gray-300 p-1 text-center">{student.prevocational.first.toFixed(2)}</td>
                      <td className="border border-gray-300 p-1 text-center">{student.prevocational.second.toFixed(2)}</td>
                      <td className="border border-gray-300 p-1 text-center">{student.prevocational.third.toFixed(2)}</td>
                      <td className="border border-gray-300 p-1 text-center">{student.prevocational.total.toFixed(2)}</td>
                      <td className="border border-gray-300 p-1 text-center">{student.prevocational.average.toFixed(2)}</td>
                      <td className="border border-gray-300 p-1 text-center bg-gray-200 font-medium">{`${student.prevocational.position}${['ST', 'ND', 'RD'][student.prevocational.position - 1] || 'TH'}`}</td>
                      
                      {/* National Values */}
                      <td className="border border-gray-300 p-1 text-center">{student.nationalValues.first.toFixed(2)}</td>
                      <td className="border border-gray-300 p-1 text-center">{student.nationalValues.second.toFixed(2)}</td>
                      <td className="border border-gray-300 p-1 text-center">{student.nationalValues.third.toFixed(2)}</td>
                      <td className="border border-gray-300 p-1 text-center">{student.nationalValues.total.toFixed(2)}</td>
                      <td className="border border-gray-300 p-1 text-center">{student.nationalValues.average.toFixed(2)}</td>
                      <td className="border border-gray-300 p-1 text-center bg-blue-100 font-medium">{`${student.nationalValues.position}${['ST', 'ND', 'RD'][student.nationalValues.position - 1] || 'TH'}`}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={32} className="border border-gray-300 p-4 text-center text-gray-500">
                      No students found for the selected class
                    </td>
                  </tr>
                )}
                
                {/* Class Average Row */}
                {broadsheetData.length > 0 && (
                  <tr className="bg-blue-50 font-medium">
                    <td colSpan={2} className="border border-gray-400 p-2 text-center">CLASS AVERAGE:</td>
                    <td className="border border-gray-400 p-1 text-center">{classAverages.english.first.toFixed(2)}</td>
                    <td className="border border-gray-400 p-1 text-center">{classAverages.english.second.toFixed(2)}</td>
                    <td className="border border-gray-400 p-1 text-center">{classAverages.english.third.toFixed(2)}</td>
                    <td className="border border-gray-400 p-1 text-center">{classAverages.english.total.toFixed(2)}</td>
                    <td className="border border-gray-400 p-1 text-center bg-blue-200">{classAverages.english.average.toFixed(2)}</td>
                    <td className="border border-gray-400 p-1 text-center"></td>
                    
                    <td className="border border-gray-400 p-1 text-center">{classAverages.mathematics.first.toFixed(2)}</td>
                    <td className="border border-gray-400 p-1 text-center">{classAverages.mathematics.second.toFixed(2)}</td>
                    <td className="border border-gray-400 p-1 text-center">{classAverages.mathematics.third.toFixed(2)}</td>
                    <td className="border border-gray-400 p-1 text-center">{classAverages.mathematics.total.toFixed(2)}</td>
                    <td className="border border-gray-400 p-1 text-center bg-blue-200">{classAverages.mathematics.average.toFixed(2)}</td>
                    <td className="border border-gray-400 p-1 text-center"></td>
                    
                    <td className="border border-gray-400 p-1 text-center">{classAverages.basicScience.first.toFixed(2)}</td>
                    <td className="border border-gray-400 p-1 text-center">{classAverages.basicScience.second.toFixed(2)}</td>
                    <td className="border border-gray-400 p-1 text-center">{classAverages.basicScience.third.toFixed(2)}</td>
                    <td className="border border-gray-400 p-1 text-center">{classAverages.basicScience.total.toFixed(2)}</td>
                    <td className="border border-gray-400 p-1 text-center bg-blue-200">{classAverages.basicScience.average.toFixed(2)}</td>
                    <td className="border border-gray-400 p-1 text-center"></td>
                    
                    <td className="border border-gray-400 p-1 text-center">{classAverages.prevocational.first.toFixed(2)}</td>
                    <td className="border border-gray-400 p-1 text-center">{classAverages.prevocational.second.toFixed(2)}</td>
                    <td className="border border-gray-400 p-1 text-center">{classAverages.prevocational.third.toFixed(2)}</td>
                    <td className="border border-gray-400 p-1 text-center">{classAverages.prevocational.total.toFixed(2)}</td>
                    <td className="border border-gray-400 p-1 text-center bg-blue-200">{classAverages.prevocational.average.toFixed(2)}</td>
                    <td className="border border-gray-400 p-1 text-center"></td>
                    
                    <td className="border border-gray-400 p-1 text-center">{classAverages.nationalValues.first.toFixed(2)}</td>
                    <td className="border border-gray-400 p-1 text-center">{classAverages.nationalValues.second.toFixed(2)}</td>
                    <td className="border border-gray-400 p-1 text-center">{classAverages.nationalValues.third.toFixed(2)}</td>
                    <td className="border border-gray-400 p-1 text-center">{classAverages.nationalValues.total.toFixed(2)}</td>
                    <td className="border border-gray-400 p-1 text-center bg-blue-200">{classAverages.nationalValues.average.toFixed(2)}</td>
                    <td className="border border-gray-400 p-1 text-center"></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Summary Section */}
          {broadsheetData.length > 0 && (
            <div className="p-6 bg-white">
              <h4 className="font-semibold text-sm mb-3">Summary & Performance Metrics</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-400 p-2 text-left" style={{minWidth: '150px'}}>STUDENT'S NAME</th>
                      <th className="border border-gray-400 p-2 text-center">TOTAL</th>
                      <th className="border border-gray-400 p-2 text-center">OVERALL AVERAGE</th>
                      <th className="border border-gray-400 p-2 text-center">% AVERAGE</th>
                      <th className="border border-gray-400 p-2 text-center">OVERALL POSITION</th>
                      <th className="border border-gray-400 p-2 text-center">GRADE</th>
                      <th className="border border-gray-400 p-2 text-left" style={{minWidth: '200px'}}>REMARKS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {broadsheetData.map((student) => (
                      <tr key={`summary-${student.sn}`} className="hover:bg-gray-50">
                        <td className="border border-gray-300 p-2 font-medium">{student.studentName}</td>
                        <td className="border border-gray-300 p-2 text-center">{student.totalScore.toFixed(2)}</td>
                        <td className="border border-gray-300 p-2 text-center">{student.overallAverage.toFixed(2)}</td>
                        <td className="border border-gray-300 p-2 text-center bg-blue-100">{student.percentAverage}</td>
                        <td className="border border-gray-300 p-2 text-center bg-blue-900 text-white font-bold">{student.overallPosition}{['ST', 'ND', 'RD'][student.overallPosition - 1] || 'TH'}</td>
                        <td className="border border-gray-300 p-2 text-center font-bold">{student.grade}</td>
                        <td className="border border-gray-300 p-2">{student.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Signature Section */}
              {showSignatures && (
                <div className="mt-8 space-y-6">
                  <h4 className="font-semibold text-sm mb-4">Signatures & Dates</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Class Teacher Signature */}
                    <div className="space-y-3 border border-gray-200 p-4 rounded-lg">
                      <label className="text-sm font-medium">CLASS TEACHER</label>
                      
                      <div className="space-y-2">
                        <label className="text-xs text-gray-600">Upload Signature:</label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleSignatureUpload(e, 'teacher')}
                            className="text-xs"
                          />
                          {teacherSignature && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSignature('teacher')}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        {teacherSignature && (
                          <div className="mt-2 p-2 border rounded bg-gray-50">
                            <img
                              src={teacherSignature}
                              alt="Teacher Signature"
                              className="h-12 object-contain"
                            />
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs text-gray-600">Select Date:</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left text-xs h-9"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {teacherDate ? format(teacherDate, 'PPP') : 'Pick a date'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={teacherDate}
                              onSelect={setTeacherDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      {(teacherSignature || teacherDate) && (
                        <div className="pt-3 border-t">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">Preview:</span>
                            {teacherSignature && <span className="text-green-600">✓ Signature uploaded</span>}
                          </div>
                          {teacherDate && (
                            <p className="text-xs text-gray-600 mt-1">
                              Date: {format(teacherDate, 'PPP')}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Admin Signature */}
                    <div className="space-y-3 border border-gray-200 p-4 rounded-lg">
                      <label className="text-sm font-medium">ADMIN</label>
                      
                      <div className="space-y-2">
                        <label className="text-xs text-gray-600">Upload Signature:</label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleSignatureUpload(e, 'admin')}
                            className="text-xs"
                          />
                          {adminSignature && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSignature('admin')}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        {adminSignature && (
                          <div className="mt-2 p-2 border rounded bg-gray-50">
                            <img
                              src={adminSignature}
                              alt="Admin Signature"
                              className="h-12 object-contain"
                            />
                          </div>
                        )}
                      </div>

                      {adminSignature && (
                        <div className="pt-3 border-t">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">Preview:</span>
                            {adminSignature && <span className="text-green-600">✓ Signature uploaded</span>}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Principal Signature */}
                    <div className="space-y-3 border border-gray-200 p-4 rounded-lg">
                      <label className="text-sm font-medium">PRINCIPAL</label>
                      
                      <div className="space-y-2">
                        <label className="text-xs text-gray-600">Upload Signature:</label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleSignatureUpload(e, 'principal')}
                            className="text-xs"
                          />
                          {principalSignature && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSignature('principal')}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        {principalSignature && (
                          <div className="mt-2 p-2 border rounded bg-gray-50">
                            <img
                              src={principalSignature}
                              alt="Principal Signature"
                              className="h-12 object-contain"
                            />
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs text-gray-600">Select Date:</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left text-xs h-9"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {principalDate ? format(principalDate, 'PPP') : 'Pick a date'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={principalDate}
                              onSelect={setPrincipalDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      {(principalSignature || principalDate) && (
                        <div className="pt-3 border-t">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">Preview:</span>
                            {principalSignature && <span className="text-green-600">✓ Signature uploaded</span>}
                          </div>
                          {principalDate && (
                            <p className="text-xs text-gray-600 mt-1">
                              Date: {format(principalDate, 'PPP')}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};