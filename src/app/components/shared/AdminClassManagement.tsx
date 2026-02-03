import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import { Save, User, Users, GraduationCap, Search, Trash2, Plus, X } from 'lucide-react';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';

// Mock Data for Teachers
const TEACHERS = [
  { id: 'teach-1', name: 'Mr. Teacher' },
  { id: 't2', name: 'Mrs. Jane Smith' },
  { id: 't3', name: 'Mr. Robert Johnson' },
  { id: 't4', name: 'Ms. Emily Davis' },
  { id: 't5', name: 'Mr. Michael Wilson' },
  { id: 't6', name: 'Mrs. Sarah Brown' },
  { id: 't7', name: 'Mr. David Miller' },
  { id: 't8', name: 'Ms. Jennifer Taylor' },
  { id: 't9', name: 'Mr. James Anderson' },
  { id: 't10', name: 'Mrs. Lisa Thomas' },
];

const INITIAL_CLASSES = [
  'JSS1 A', 'JSS1 B', 'JSS1 C',
  'JSS2 A', 'JSS2 B', 'JSS2 C',
  'JSS3 A', 'JSS3 B', 'JSS3 C',
  'SSS1 A', 'SSS1 B', 'SSS1 C',
  'SSS2 A', 'SSS2 B', 'SSS2 C',
  'SSS3 A', 'SSS3 B', 'SSS3 C',
];

interface ClassAssignment {
  classTeacherId: string;
  assistantTeacherId: string;
}

export const AdminClassManagement = () => {
  const [classes, setClasses] = useState<string[]>(INITIAL_CLASSES);
  const [assignments, setAssignments] = useState<Record<string, ClassAssignment>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassArm, setNewClassArm] = useState('');

  useEffect(() => {
    const savedAssignments = localStorage.getItem('classAssignments');
    if (savedAssignments) {
      setAssignments(JSON.parse(savedAssignments));
    }
    
    const savedClasses = localStorage.getItem('schoolClasses');
    if (savedClasses) {
      setClasses(JSON.parse(savedClasses));
    }
  }, []);

  const handleAssign = (className: string, type: 'classTeacherId' | 'assistantTeacherId', teacherId: string) => {
    setAssignments(prev => ({
      ...prev,
      [className]: {
        ...prev[className],
        [type]: teacherId
      }
    }));
    setHasUnsavedChanges(true);
  };

  const saveAssignments = () => {
    localStorage.setItem('classAssignments', JSON.stringify(assignments));
    setHasUnsavedChanges(false);
    toast.success('Class assignments saved successfully', {
      description: 'Teachers will now see their assigned classes in their dashboard.',
    });
  };

  const handleAddClass = () => {
    if (!newClassName || !newClassArm) {
      toast.error("Please provide both class name and arm");
      return;
    }
    
    const fullClassName = `${newClassName} ${newClassArm}`.toUpperCase();
    
    if (classes.includes(fullClassName)) {
      toast.error("Class already exists");
      return;
    }
    
    const updatedClasses = [...classes, fullClassName];
    setClasses(updatedClasses);
    localStorage.setItem('schoolClasses', JSON.stringify(updatedClasses));
    
    setNewClassName('');
    setNewClassArm('');
    setIsAddClassOpen(false);
    toast.success(`Class ${fullClassName} added successfully`);
  };

  const handleDeleteClass = (className: string) => {
    if (confirm(`Are you sure you want to delete ${className}? This action cannot be undone.`)) {
      const updatedClasses = classes.filter(c => c !== className);
      setClasses(updatedClasses);
      localStorage.setItem('schoolClasses', JSON.stringify(updatedClasses));
      
      // Clean up assignments
      const newAssignments = { ...assignments };
      delete newAssignments[className];
      setAssignments(newAssignments);
      localStorage.setItem('classAssignments', JSON.stringify(newAssignments));
      
      toast.success(`Class ${className} deleted successfully`);
    }
  };

  const getTeacherName = (id: string) => {
    return TEACHERS.find(t => t.id === id)?.name || 'Select Teacher';
  };

  const filteredClasses = classes.filter(cls => 
    cls.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-[#003366]" />
            Class Management
          </h1>
          <p className="text-gray-500">Manage classes and assign teachers</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64 w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input 
              placeholder="Search classes..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Dialog open={isAddClassOpen} onOpenChange={setIsAddClassOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Class
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Class</DialogTitle>
                <DialogDescription>
                  Create a new class and arm (e.g., JSS1 A).
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Class Level</Label>
                  <Select onValueChange={setNewClassName} value={newClassName}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="JSS1">JSS1</SelectItem>
                      <SelectItem value="JSS2">JSS2</SelectItem>
                      <SelectItem value="JSS3">JSS3</SelectItem>
                      <SelectItem value="SSS1">SSS1</SelectItem>
                      <SelectItem value="SSS2">SSS2</SelectItem>
                      <SelectItem value="SSS3">SSS3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Arm</Label>
                  <Input 
                    placeholder="e.g. A, B, C, Gold, Silver" 
                    value={newClassArm}
                    onChange={(e) => setNewClassArm(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddClassOpen(false)}>Cancel</Button>
                <Button onClick={handleAddClass} className="bg-[#003366]">Create Class</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button 
            onClick={saveAssignments} 
            disabled={!hasUnsavedChanges}
            className={`${hasUnsavedChanges ? 'bg-[#003366] hover:bg-[#002244]' : ''}`}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((className) => (
          <Card key={className} className="border-t-4 border-t-[#003366] shadow-sm hover:shadow-md transition-shadow relative group">
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-2 right-2 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleDeleteClass(className)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold text-gray-800">{className}</CardTitle>
              <CardDescription>Manage class leadership</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User className="h-4 w-4 text-[#003366]" />
                  Class Teacher
                </label>
                <Select 
                  value={assignments[className]?.classTeacherId || ''} 
                  onValueChange={(val) => handleAssign(className, 'classTeacherId', val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Class Teacher">
                      {assignments[className]?.classTeacherId ? getTeacherName(assignments[className].classTeacherId) : "Select Class Teacher"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {TEACHERS.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#003366]" />
                  Assistant Class Teacher
                </label>
                <Select 
                  value={assignments[className]?.assistantTeacherId || ''} 
                  onValueChange={(val) => handleAssign(className, 'assistantTeacherId', val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Assistant">
                      {assignments[className]?.assistantTeacherId ? getTeacherName(assignments[className].assistantTeacherId) : "Select Assistant"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {TEACHERS.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredClasses.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500">No classes found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
};
