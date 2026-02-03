import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Search,
  Edit,
  Eye,
  Upload,
  X,
  Save,
  Trash2,
  Camera,
  FileText,
  Download,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { ScrollArea } from '../ui/scroll-area';
import { toast } from 'sonner';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

interface Student {
  id: string;
  studentName: string;
  admissionNumber: string;
  class: string;
  gender: 'Male' | 'Female';
  dateOfBirth: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  address: string;
  passportPhoto?: string; // Base64 encoded image
  enrollmentDate: string;
  status: 'active' | 'inactive';
}

const CLASSES = [
  'PRE-NURSERY', 'NURSERY 1', 'NURSERY 2',
  'PRIMARY 1', 'PRIMARY 2', 'PRIMARY 3', 'PRIMARY 4', 'PRIMARY 5', 'PRIMARY 6',
  'JSS 1', 'JSS 2', 'JSS 3',
  'SSS 1', 'SSS 2', 'SSS 3'
];

export const StudentManagement: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState<Partial<Student>>({
    studentName: '',
    admissionNumber: '',
    class: '',
    gender: 'Male',
    dateOfBirth: '',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    address: '',
    enrollmentDate: new Date().toISOString().split('T')[0],
    status: 'active',
  });

  // Load students from localStorage
  useEffect(() => {
    const savedStudents = localStorage.getItem('bfoia_students');
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    } else {
      // Initialize with mock data matching students in results
      const mockStudents: Student[] = [
        {
          id: '1',
          studentName: 'EMMANUEL ADEBAYO',
          admissionNumber: 'BFOIA/2023/001',
          class: 'GRADE 4',
          gender: 'Male',
          dateOfBirth: '2010-05-15',
          parentName: 'Mrs. Adebayo',
          parentEmail: 'adebayo.parent@bfoia.edu.ng',
          parentPhone: '+234 803 456 7890',
          address: '12 Lagos Street, Osogbo',
          enrollmentDate: '2023-09-01',
          status: 'active',
        },
        {
          id: '2',
          studentName: 'ADEYEMI OLUWASEUN',
          admissionNumber: 'BFOIA/2023/002',
          class: 'GRADE 4',
          gender: 'Male',
          dateOfBirth: '2010-03-20',
          parentName: 'Mr. Adeyemi',
          parentEmail: 'adeyemi.parent@bfoia.edu.ng',
          parentPhone: '+234 805 123 4567',
          address: '25 Ibadan Road, Osogbo',
          enrollmentDate: '2023-09-01',
          status: 'active',
        },
        {
          id: '3',
          studentName: 'FATIMA MOHAMMED',
          admissionNumber: 'BFOIA/2023/003',
          class: 'GRADE 4',
          gender: 'Female',
          dateOfBirth: '2010-08-10',
          parentName: 'Alhaji Mohammed',
          parentEmail: 'mohammed.parent@bfoia.edu.ng',
          parentPhone: '+234 806 789 0123',
          address: '8 Station Road, Osogbo',
          enrollmentDate: '2023-09-01',
          status: 'active',
        },
        {
          id: '4',
          studentName: 'CHIDINMA NWOSU',
          admissionNumber: 'BFOIA/2023/004',
          class: 'GRADE 4',
          gender: 'Female',
          dateOfBirth: '2010-11-28',
          parentName: 'Mrs. Nwosu',
          parentEmail: 'nwosu.parent@bfoia.edu.ng',
          parentPhone: '+234 807 456 1234',
          address: '14 Market Street, Osogbo',
          enrollmentDate: '2023-09-01',
          status: 'active',
        },
        {
          id: '5',
          studentName: 'JOY WILLIAMS',
          admissionNumber: 'BFOIA/2023/005',
          class: 'GRADE 4',
          gender: 'Female',
          dateOfBirth: '2010-06-15',
          parentName: 'Pastor Williams',
          parentEmail: 'williams.parent@bfoia.edu.ng',
          parentPhone: '+234 808 234 5678',
          address: '30 Church Road, Osogbo',
          enrollmentDate: '2023-09-01',
          status: 'active',
        },
        // JSS 3A Students (for teacher's class)
        {
          id: '6',
          studentName: 'ADEBAYO OLUWASEUN',
          admissionNumber: 'BFOIA/2023/006',
          class: 'JSS 3A',
          gender: 'Male',
          dateOfBirth: '2009-04-12',
          parentName: 'Mr. Adebayo',
          parentEmail: 'adebayo2.parent@bfoia.edu.ng',
          parentPhone: '+234 809 876 5432',
          address: '18 School Road, Osogbo',
          enrollmentDate: '2021-09-01',
          status: 'active',
        },
        {
          id: '7',
          studentName: 'CHIOMA NWOSU',
          admissionNumber: 'BFOIA/2023/007',
          class: 'JSS 3A',
          gender: 'Female',
          dateOfBirth: '2009-07-23',
          parentName: 'Mrs. Nwosu',
          parentEmail: 'nwosu2.parent@bfoia.edu.ng',
          parentPhone: '+234 810 234 5678',
          address: '22 Main Road, Osogbo',
          enrollmentDate: '2021-09-01',
          status: 'active',
        },
        {
          id: '8',
          studentName: 'IBRAHIM YUSUF',
          admissionNumber: 'BFOIA/2023/008',
          class: 'JSS 3A',
          gender: 'Male',
          dateOfBirth: '2009-09-30',
          parentName: 'Mallam Yusuf',
          parentEmail: 'yusuf.parent@bfoia.edu.ng',
          parentPhone: '+234 811 345 6789',
          address: '5 Central Avenue, Osogbo',
          enrollmentDate: '2021-09-01',
          status: 'active',
        },
      ];
      setStudents(mockStudents);
      localStorage.setItem('bfoia_students', JSON.stringify(mockStudents));
    }
  }, []);

  // Save students to localStorage whenever they change
  const saveStudents = (updatedStudents: Student[]) => {
    setStudents(updatedStudents);
    localStorage.setItem('bfoia_students', JSON.stringify(updatedStudents));
  };

  // Handle photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be less than 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPhotoPreview(base64String);
        setFormData({ ...formData, passportPhoto: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      studentName: '',
      admissionNumber: '',
      class: '',
      gender: 'Male',
      dateOfBirth: '',
      parentName: '',
      parentEmail: '',
      parentPhone: '',
      address: '',
      enrollmentDate: new Date().toISOString().split('T')[0],
      status: 'active',
    });
    setPhotoPreview(null);
    setIsEditing(false);
    setSelectedStudent(null);
  };

  // Handle add/update student
  const handleSaveStudent = () => {
    // Validation
    if (!formData.studentName || !formData.admissionNumber || !formData.class) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (isEditing && selectedStudent) {
      // Update existing student
      const updatedStudents = students.map(s =>
        s.id === selectedStudent.id ? { ...selectedStudent, ...formData } as Student : s
      );
      saveStudents(updatedStudents);
      toast.success('Student updated successfully');
    } else {
      // Add new student
      const newStudent: Student = {
        id: Date.now().toString(),
        ...formData as Student,
      };
      saveStudents([...students, newStudent]);
      toast.success('Student added successfully');
    }

    setShowAddDialog(false);
    resetForm();
  };

  // Handle edit
  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setFormData(student);
    setPhotoPreview(student.passportPhoto || null);
    setIsEditing(true);
    setShowAddDialog(true);
  };

  // Handle view
  const handleView = (student: Student) => {
    setSelectedStudent(student);
    setShowViewDialog(true);
  };

  // Handle delete
  const handleDelete = (studentId: string) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      const updatedStudents = students.filter(s => s.id !== studentId);
      saveStudents(updatedStudents);
      toast.success('Student deleted successfully');
    }
  };

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClass === 'all' || student.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-950">Student Management</h1>
          <p className="text-gray-600 mt-1">Manage student records and passport photos</p>
        </div>
        <Button onClick={() => { resetForm(); setShowAddDialog(true); }} className="bg-[#003366]">
          <Plus className="w-4 h-4 mr-2" />
          Add Student
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-blue-950">{students.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Students</p>
                <p className="text-2xl font-bold text-green-600">
                  {students.filter(s => s.status === 'active').length}
                </p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">With Photos</p>
                <p className="text-2xl font-bold text-purple-600">
                  {students.filter(s => s.passportPhoto).length}
                </p>
              </div>
              <Camera className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Classes</p>
                <p className="text-2xl font-bold text-amber-600">
                  {new Set(students.map(s => s.class)).size}
                </p>
              </div>
              <FileText className="w-8 h-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by name or admission number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {CLASSES.map(cls => (
                  <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Student List */}
      <Card>
        <CardHeader>
          <CardTitle>Student Records</CardTitle>
          <CardDescription>
            {filteredStudents.length} {filteredStudents.length === 1 ? 'student' : 'students'} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-3 text-left font-medium">Photo</th>
                  <th className="p-3 text-left font-medium">Admission No.</th>
                  <th className="p-3 text-left font-medium">Name</th>
                  <th className="p-3 text-left font-medium">Class</th>
                  <th className="p-3 text-left font-medium">Gender</th>
                  <th className="p-3 text-left font-medium">Parent Contact</th>
                  <th className="p-3 text-center font-medium">Status</th>
                  <th className="p-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-500">
                      No students found
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map(student => (
                    <tr key={student.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                          {student.passportPhoto ? (
                            <img
                              src={student.passportPhoto}
                              alt={student.studentName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Camera className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                      </td>
                      <td className="p-3 font-medium">{student.admissionNumber}</td>
                      <td className="p-3">{student.studentName}</td>
                      <td className="p-3">{student.class}</td>
                      <td className="p-3">{student.gender}</td>
                      <td className="p-3">
                        <div className="text-xs">
                          <p>{student.parentName}</p>
                          <p className="text-gray-500">{student.parentPhone}</p>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <Badge variant={student.status === 'active' ? 'outline' : 'secondary'}>
                          {student.status}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleView(student)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEdit(student)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(student.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog} onOpenChange={(open) => {
        setShowAddDialog(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Student' : 'Add New Student'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Update student information' : 'Enter student details to add to the system'}
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-6 py-4">
              {/* Passport Photo Upload */}
              <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed rounded-lg">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <div className="text-center">
                  <Label htmlFor="photo-upload" className="cursor-pointer">
                    <div className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                      <Upload className="w-4 h-4" />
                      <span>Upload Passport Photo</span>
                    </div>
                  </Label>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                  <p className="text-xs text-gray-500 mt-2">Max size: 2MB • JPG, PNG</p>
                </div>
              </div>

              {/* Student Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="studentName">Full Name *</Label>
                  <Input
                    id="studentName"
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admissionNumber">Admission Number *</Label>
                  <Input
                    id="admissionNumber"
                    value={formData.admissionNumber}
                    onChange={(e) => setFormData({ ...formData, admissionNumber: e.target.value })}
                    placeholder="BFOIA/2024/XXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="class">Class *</Label>
                  <Select value={formData.class} onValueChange={(value) => setFormData({ ...formData, class: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {CLASSES.map(cls => (
                        <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select value={formData.gender} onValueChange={(value: 'Male' | 'Female') => setFormData({ ...formData, gender: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="enrollmentDate">Enrollment Date</Label>
                  <Input
                    id="enrollmentDate"
                    type="date"
                    value={formData.enrollmentDate}
                    onChange={(e) => setFormData({ ...formData, enrollmentDate: e.target.value })}
                  />
                </div>
              </div>

              {/* Parent/Guardian Information */}
              <div className="pt-4 border-t">
                <h3 className="text-sm font-semibold mb-4">Parent/Guardian Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="parentName">Parent Name</Label>
                    <Input
                      id="parentName"
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      placeholder="Enter parent name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parentPhone">Phone Number</Label>
                    <Input
                      id="parentPhone"
                      value={formData.parentPhone}
                      onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                      placeholder="+234 XXX XXX XXXX"
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="parentEmail">Email Address</Label>
                    <Input
                      id="parentEmail"
                      type="email"
                      value={formData.parentEmail}
                      onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                      placeholder="parent@email.com"
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Home address"
                    />
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: 'active' | 'inactive') => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowAddDialog(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleSaveStudent} className="bg-[#003366]">
              <Save className="w-4 h-4 mr-2" />
              {isEditing ? 'Update Student' : 'Add Student'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-6 py-4">
              {/* Photo and Basic Info */}
              <div className="flex items-start gap-6">
                <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                  {selectedStudent.passportPhoto ? (
                    <img
                      src={selectedStudent.passportPhoto}
                      alt={selectedStudent.studentName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-xl font-bold text-blue-950">{selectedStudent.studentName}</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Admission No:</span>
                      <p className="font-medium">{selectedStudent.admissionNumber}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Class:</span>
                      <p className="font-medium">{selectedStudent.class}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Gender:</span>
                      <p className="font-medium">{selectedStudent.gender}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <Badge variant={selectedStudent.status === 'active' ? 'outline' : 'secondary'}>
                        {selectedStudent.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <span className="text-sm text-gray-600">Date of Birth</span>
                  <p className="font-medium">{selectedStudent.dateOfBirth || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Enrollment Date</span>
                  <p className="font-medium">{selectedStudent.enrollmentDate}</p>
                </div>
              </div>

              {/* Parent Info */}
              <div className="pt-4 border-t">
                <h4 className="text-sm font-semibold mb-3">Parent/Guardian Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Name</span>
                    <p className="font-medium">{selectedStudent.parentName || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Phone</span>
                    <p className="font-medium">{selectedStudent.parentPhone || 'N/A'}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-sm text-gray-600">Email</span>
                    <p className="font-medium">{selectedStudent.parentEmail || 'N/A'}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-sm text-gray-600">Address</span>
                    <p className="font-medium">{selectedStudent.address || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>
              Close
            </Button>
            {selectedStudent && (
              <Button onClick={() => {
                setShowViewDialog(false);
                handleEdit(selectedStudent);
              }} className="bg-[#003366]">
                <Edit className="w-4 h-4 mr-2" />
                Edit Student
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
