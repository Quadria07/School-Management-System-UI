import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2, Search, BookOpen, GraduationCap } from 'lucide-react';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';

// Mock Data
const TEACHERS = [
  { id: 'teach-1', name: 'Mr. Teacher' },
  { id: 't2', name: 'Mrs. Jane Smith' },
  { id: 't3', name: 'Mr. Robert Johnson' },
  { id: 't4', name: 'Ms. Emily Davis' },
  { id: 't5', name: 'Mr. Michael Wilson' },
];

const INITIAL_SUBJECTS = [
  { id: 's1', name: 'Mathematics', code: 'MTH101', class: 'JSS1', teacherId: 'teach-1' },
  { id: 's2', name: 'English Language', code: 'ENG101', class: 'JSS1', teacherId: 't2' },
  { id: 's3', name: 'Basic Science', code: 'BSC101', class: 'JSS1', teacherId: 't3' },
  { id: 's4', name: 'Mathematics', code: 'MTH201', class: 'JSS2', teacherId: 'teach-1' },
  { id: 's5', name: 'English Language', code: 'ENG201', class: 'JSS2', teacherId: 't2' },
];

export const SubjectManagement = () => {
  const [subjects, setSubjects] = useState(INITIAL_SUBJECTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<any>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [className, setClassName] = useState('');
  const [teacherId, setTeacherId] = useState('');

  // Classes for dropdown
  const [availableClasses, setAvailableClasses] = useState<string[]>([]);

  useEffect(() => {
    // Load subjects from storage if available
    const savedSubjects = localStorage.getItem('schoolSubjects');
    if (savedSubjects) {
      setSubjects(JSON.parse(savedSubjects));
    }

    // Load classes from storage to populate dropdown
    const savedClasses = localStorage.getItem('schoolClasses');
    if (savedClasses) {
      // Extract just the levels (JSS1, JSS2) from full class names (JSS1 A) to simplify
      // Or just use the full list. Let's use specific levels for subjects usually.
      // But user asked to assign to "class". Let's assume general levels or specific arms?
      // "Assign it to class" -> Usually subjects are per level (JSS1 Math) but can be per arm.
      // Let's stick to the levels logic for simplicity or extract unique prefixes.
      const classes = JSON.parse(savedClasses);
      const levels = Array.from(new Set(classes.map((c: string) => c.split(' ')[0])));
      setAvailableClasses(levels as string[]);
    } else {
      setAvailableClasses(['JSS1', 'JSS2', 'JSS3', 'SSS1', 'SSS2', 'SSS3']);
    }
  }, []);

  const handleSave = () => {
    if (!name || !code || !className || !teacherId) {
      toast.error("Please fill in all fields");
      return;
    }

    let updatedSubjects;
    if (editingSubject) {
      updatedSubjects = subjects.map(s => 
        s.id === editingSubject.id 
          ? { ...s, name, code, class: className, teacherId } 
          : s
      );
      toast.success("Subject updated successfully");
    } else {
      const newSubject = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        code,
        class: className,
        teacherId
      };
      updatedSubjects = [...subjects, newSubject];
      toast.success("Subject created successfully");
    }

    setSubjects(updatedSubjects);
    localStorage.setItem('schoolSubjects', JSON.stringify(updatedSubjects));
    resetForm();
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this subject?")) {
      const updated = subjects.filter(s => s.id !== id);
      setSubjects(updated);
      localStorage.setItem('schoolSubjects', JSON.stringify(updated));
      toast.success("Subject deleted successfully");
    }
  };

  const handleEdit = (subject: any) => {
    setEditingSubject(subject);
    setName(subject.name);
    setCode(subject.code);
    setClassName(subject.class);
    setTeacherId(subject.teacherId);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingSubject(null);
    setName('');
    setCode('');
    setClassName('');
    setTeacherId('');
  };

  const getTeacherName = (id: string) => {
    return TEACHERS.find(t => t.id === id)?.name || 'Unknown';
  };

  const filteredSubjects = subjects.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-[#003366]" />
            Subject Management
          </h1>
          <p className="text-gray-500">Manage subjects, codes, and teacher assignments</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64 w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input 
              placeholder="Search subjects..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-[#003366]">
                <Plus className="mr-2 h-4 w-4" />
                Add Subject
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingSubject ? 'Edit Subject' : 'Add New Subject'}</DialogTitle>
                <DialogDescription>
                  Enter subject details and assign a teacher.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Subject Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Mathematics" />
                </div>
                <div className="space-y-2">
                  <Label>Subject Code</Label>
                  <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. MTH101" />
                </div>
                <div className="space-y-2">
                  <Label>Class Level</Label>
                  <Select onValueChange={setClassName} value={className}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableClasses.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Assigned Teacher</Label>
                  <Select onValueChange={setTeacherId} value={teacherId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Teacher" />
                    </SelectTrigger>
                    <SelectContent>
                      {TEACHERS.map(t => (
                        <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSave} className="bg-[#003366]">Save Subject</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Subject Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Assigned Teacher</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubjects.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell className="font-medium">{subject.code}</TableCell>
                  <TableCell>{subject.name}</TableCell>
                  <TableCell><Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{subject.class}</Badge></TableCell>
                  <TableCell>{getTeacherName(subject.teacherId)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(subject)}>
                        <Edit2 className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(subject.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredSubjects.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No subjects found. Add a new subject to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
