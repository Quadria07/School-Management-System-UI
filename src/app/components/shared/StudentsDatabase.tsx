import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Users, Search, GraduationCap, Eye, FileText, ChevronRight, UserCheck, UserX, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Textarea } from '../ui/textarea';
import { Alert, AlertDescription } from '../ui/alert';
import { PendingApprovals } from './PendingApprovals';

// Mock Data
const CLASSES = [
  'JSS1 A', 'JSS1 B', 'JSS2 A', 'JSS2 B', 'JSS3 A', 'SSS1 A', 'SSS1 Science', 'SSS1 Art'
];

const STUDENTS = [
  { id: 'std-1', name: 'ADEYEMI, John Oluwaseun', admissionNo: 'BFOIA/2023/001', class: 'JSS1 A', joinedDate: '2023-09-10', gender: 'Male', dob: '2012-05-15', guardian: 'Mr. Adeyemi' },
  { id: 'std-2', name: 'OKONKWO, Chioma Grace', admissionNo: 'BFOIA/2023/002', class: 'JSS1 A', joinedDate: '2023-09-10', gender: 'Female', dob: '2012-08-22', guardian: 'Mrs. Okonkwo' },
  { id: 'std-3', name: 'MUSA, Ibrahim', admissionNo: 'BFOIA/2023/003', class: 'JSS1 B', joinedDate: '2023-09-12', gender: 'Male', dob: '2011-12-05', guardian: 'Alhaji Musa' },
  { id: 'std-4', name: 'WILLIAMS, Sarah', admissionNo: 'BFOIA/2023/004', class: 'SSS1 Science', joinedDate: '2020-09-05', gender: 'Female', dob: '2009-03-10', guardian: 'Dr. Williams' },
];

const ACADEMIC_RECORDS = [
  { term: '1st Term 2023/2024', average: 78.5, position: '5th', remark: 'Excellent performance' },
  { term: '2nd Term 2023/2024', average: 81.2, position: '3rd', remark: 'Outstanding improvement' },
  { term: '3rd Term 2023/2024', average: 80.0, position: '4th', remark: 'Consistent result' },
];

export const StudentsDatabase = () => {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingStudent, setViewingStudent] = useState<any>(null);
  const { pendingUsers, user: currentUser } = useAuth();

  const filteredStudents = STUDENTS.filter(student => {
    const matchesClass = selectedClass ? student.class === selectedClass : true;
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.admissionNo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesClass && matchesSearch;
  });

  const showApprovals = currentUser?.role === 'principal' || currentUser?.role === 'proprietor';
  const pendingCount = pendingUsers.filter(u => u.role === 'student' || u.role === 'parent').length;

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Sidebar - Class List */}
      <div className="w-64 bg-white border-r flex flex-col hidden md:flex">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-gray-700 flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Classes
          </h2>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            <Button
              variant={selectedClass === null ? "secondary" : "ghost"}
              className="w-full justify-start font-normal"
              onClick={() => setSelectedClass(null)}
            >
              All Students
            </Button>
            {CLASSES.map(cls => (
              <Button
                key={cls}
                variant={selectedClass === cls ? "secondary" : "ghost"}
                className="w-full justify-start font-normal"
                onClick={() => setSelectedClass(cls)}
              >
                {cls}
                <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
        <div className="p-6 pb-0">
          <Tabs defaultValue="students" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="students">
                All Students
              </TabsTrigger>
              {showApprovals && (
                <TabsTrigger value="approvals" className="relative">
                  Pending Approvals
                  {pendingCount > 0 && (
                    <Badge className="ml-2 bg-amber-500 hover:bg-amber-600 text-white">
                      {pendingCount}
                    </Badge>
                  )}
                </TabsTrigger>
              )}
            </TabsList>

            {/* Students Tab */}
            <TabsContent value="students" className="mt-0 space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {selectedClass || 'All Students'}
                  </h1>
                  <p className="text-gray-500">
                    {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''} found
                  </p>
                </div>
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input 
                    placeholder="Search name or admission no..." 
                    className="pl-9 bg-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <ScrollArea className="h-[calc(100vh-240px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredStudents.map(student => (
                    <Card key={student.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start mb-4">
                          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
                            {student.name.charAt(0)}
                          </div>
                          <Badge variant="outline" className="bg-gray-50">
                            {student.class}
                          </Badge>
                        </div>
                        <h3 className="font-bold text-gray-900 truncate" title={student.name}>{student.name}</h3>
                        <p className="text-sm text-gray-500 mb-4">{student.admissionNo}</p>
                        
                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                          <div className="flex justify-between">
                            <span>Joined:</span>
                            <span className="font-medium">{student.joinedDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Guardian:</span>
                            <span className="font-medium">{student.guardian}</span>
                          </div>
                        </div>

                        <Button 
                          className="w-full bg-[#003366] hover:bg-[#002244]" 
                          onClick={() => setViewingStudent(student)}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          View Academic Record
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {filteredStudents.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    No students found matching your criteria.
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            {/* Approvals Tab */}
            {showApprovals && (
              <TabsContent value="approvals" className="mt-0">
                <ScrollArea className="h-[calc(100vh-240px)]">
                  <PendingApprovals />
                </ScrollArea>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>

      {/* Academic Record Modal */}
      <Dialog open={!!viewingStudent} onOpenChange={(open) => !open && setViewingStudent(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-[#003366]" />
              Academic Record
            </DialogTitle>
            <DialogDescription>
              Performance history for <span className="font-semibold text-gray-900">{viewingStudent?.name}</span> ({viewingStudent?.admissionNo})
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-sm text-gray-500">Current Class</p>
                <p className="font-medium">{viewingStudent?.class}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date Joined</p>
                <p className="font-medium">{viewingStudent?.joinedDate}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Term History</h3>
              <div className="space-y-3">
                {ACADEMIC_RECORDS.map((record, idx) => (
                  <div key={idx} className="border rounded-lg p-3 flex justify-between items-center hover:bg-gray-50">
                    <div>
                      <p className="font-medium text-blue-900">{record.term}</p>
                      <p className="text-sm text-gray-500">{record.remark}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{record.average}%</div>
                      <Badge variant="secondary">{record.position}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};