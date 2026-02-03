import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Search, Briefcase, Calendar, Star, AlertCircle, CheckCircle, Mail, Phone, Filter } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { PendingApprovals } from './PendingApprovals';

// Mock Data
const STAFF_DATA = [
  { 
    id: 'sf-1', 
    name: 'Mr. John Doe', 
    role: 'Teacher', 
    subjects: ['Mathematics', 'Further Maths'], 
    classManaged: 'JSS1 A', 
    joinedDate: '2019-05-12', 
    email: 'john.doe@bfoia.edu.ng',
    phone: '08012345678',
    performance: { rating: 4.8, acknowledgements: 5, queries: 0 }
  },
  { 
    id: 'sf-2', 
    name: 'Mrs. Jane Smith', 
    role: 'Teacher', 
    subjects: ['English Language'], 
    classManaged: 'JSS2 B', 
    joinedDate: '2020-01-10', 
    email: 'jane.smith@bfoia.edu.ng',
    phone: '08087654321',
    performance: { rating: 4.5, acknowledgements: 3, queries: 1 }
  },
  { 
    id: 'sf-3', 
    name: 'Mr. Michael Brown', 
    role: 'Vice Principal', 
    subjects: ['Physics'], 
    classManaged: 'N/A', 
    joinedDate: '2015-09-01', 
    email: 'michael.brown@bfoia.edu.ng',
    phone: '08123456789',
    performance: { rating: 4.9, acknowledgements: 12, queries: 0 }
  },
  { 
    id: 'sf-4', 
    name: 'Ms. Emily Davis', 
    role: 'Teacher', 
    subjects: ['Biology', 'Basic Science'], 
    classManaged: 'SSS1 Science', 
    joinedDate: '2022-03-15', 
    email: 'emily.davis@bfoia.edu.ng',
    phone: '09012345678',
    performance: { rating: 3.8, acknowledgements: 1, queries: 2 }
  },
];

export const StaffDatabase = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const { pendingUsers, user: currentUser } = useAuth();

  const filteredStaff = STAFF_DATA.filter(staff => 
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.subjects.some(sub => sub.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const showApprovals = currentUser?.role === 'principal' || currentUser?.role === 'proprietor';
  const pendingCount = pendingUsers.filter(u => ['teacher', 'hr', 'bursar', 'principal', 'proprietor'].includes(u.role)).length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Briefcase className="h-8 w-8 text-[#003366]" />
            Staff Database
          </h1>
          <p className="text-gray-500">Manage staff records and view performance history</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input 
            placeholder="Search staff, role, or subject..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="staff" className="w-full">
        <TabsList>
          <TabsTrigger value="staff">
            All Staff
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

        {/* Staff Tab */}
        <TabsContent value="staff" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Subjects Taught</TableHead>
                    <TableHead>Class Managed</TableHead>
                    <TableHead>Joined Date</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff.map((staff) => (
                    <TableRow key={staff.id} className="cursor-pointer hover:bg-gray-50" onClick={() => setSelectedStaff(staff)}>
                      <TableCell>
                        <div className="font-medium text-gray-900">{staff.name}</div>
                        <div className="text-xs text-gray-500">{staff.email}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{staff.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {staff.subjects.map(sub => (
                            <span key={sub} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                              {sub}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{staff.classManaged}</TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="mr-2 h-3 w-3" />
                          {staff.joinedDate}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center text-amber-500">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="ml-1 text-sm font-medium text-gray-700">{staff.performance.rating}</span>
                          </div>
                          {staff.performance.queries > 0 && (
                            <Badge variant="destructive" className="text-[10px] h-5">
                              {staff.performance.queries} Query
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStaff(staff);
                        }}>
                          View Profile
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredStaff.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        No staff members found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Approvals Tab */}
        {showApprovals && (
          <TabsContent value="approvals" className="mt-4">
            <PendingApprovals />
          </TabsContent>
        )}
      </Tabs>

      {/* Staff Profile Dialog */}
      <Dialog open={!!selectedStaff} onOpenChange={(open) => !open && setSelectedStaff(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="h-10 w-10 rounded-full bg-[#003366] text-white flex items-center justify-center text-lg font-bold">
                {selectedStaff?.name.charAt(0)}
              </div>
              <div>
                {selectedStaff?.name}
                <div className="text-sm font-normal text-gray-500">{selectedStaff?.role}</div>
              </div>
            </DialogTitle>
            <DialogDescription className="sr-only">
              Detailed profile for {selectedStaff?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 border-b pb-2">Contact Information</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{selectedStaff?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{selectedStaff?.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>Joined: {selectedStaff?.joinedDate}</span>
                </div>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 border-b pb-2">Performance Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                  <div className="text-green-700 text-sm font-medium mb-1 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> Acknowledgements
                  </div>
                  <div className="text-2xl font-bold text-green-800">{selectedStaff?.performance.acknowledgements}</div>
                </div>
                <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                  <div className="text-red-700 text-sm font-medium mb-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> Queries
                  </div>
                  <div className="text-2xl font-bold text-red-800">{selectedStaff?.performance.queries}</div>
                </div>
              </div>
            </div>

            {/* Teaching Responsibilities */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="font-semibold text-gray-900 border-b pb-2">Responsibilities</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Subjects</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedStaff?.subjects.map((sub: string) => (
                      <Badge key={sub} variant="secondary">{sub}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Class Managed</label>
                  <div className="mt-1 font-medium">{selectedStaff?.classManaged}</div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
             <Button onClick={() => setSelectedStaff(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};