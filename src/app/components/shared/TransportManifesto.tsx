import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import { Bus, Plus, Search, Trash2, Edit2, MapPin, Phone } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

// Mock Data
const INITIAL_TRANSPORT_LIST = [
  { id: 'tm-1', studentName: 'ADEYEMI, John', class: 'JSS1 A', parentContact: '08012345678', address: '123 Lagos Road, Ikorodu', plateNumber: 'LAG-123-XY' },
  { id: 'tm-2', studentName: 'OKONKWO, Chioma', class: 'JSS1 A', parentContact: '08087654321', address: '45 Mainland Way, Ikeja', plateNumber: 'LAG-456-AB' },
  { id: 'tm-3', studentName: 'MUSA, Ibrahim', class: 'JSS1 B', parentContact: '08123456789', address: '78 Island Street, Lekki', plateNumber: 'LAG-789-CD' },
];

export const TransportManifesto = () => {
  const [transportList, setTransportList] = useState(INITIAL_TRANSPORT_LIST);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);

  // Form State
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [parentContact, setParentContact] = useState('');
  const [address, setAddress] = useState('');
  const [plateNumber, setPlateNumber] = useState('');

  useEffect(() => {
    const savedList = localStorage.getItem('transportManifesto');
    if (savedList) {
      setTransportList(JSON.parse(savedList));
    }
  }, []);

  const handleSave = () => {
    if (!studentName || !studentClass || !parentContact || !address || !plateNumber) {
      toast.error("Please fill in all fields");
      return;
    }

    let updatedList;
    if (editingStudent) {
      updatedList = transportList.map(item => 
        item.id === editingStudent.id 
          ? { ...item, studentName, class: studentClass, parentContact, address, plateNumber } 
          : item
      );
      toast.success("Transport record updated successfully");
    } else {
      const newItem = {
        id: Math.random().toString(36).substr(2, 9),
        studentName,
        class: studentClass,
        parentContact,
        address,
        plateNumber
      };
      updatedList = [...transportList, newItem];
      toast.success("Student added to transport list", {
        description: "Transport fee has been automatically added to the student's term tuition."
      });
    }

    setTransportList(updatedList);
    localStorage.setItem('transportManifesto', JSON.stringify(updatedList));
    resetForm();
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this student from the transport list?")) {
      const updatedList = transportList.filter(item => item.id !== id);
      setTransportList(updatedList);
      localStorage.setItem('transportManifesto', JSON.stringify(updatedList));
      toast.success("Student removed from transport list");
    }
  };

  const handleEdit = (item: any) => {
    setEditingStudent(item);
    setStudentName(item.studentName);
    setStudentClass(item.class);
    setParentContact(item.parentContact);
    setAddress(item.address);
    setPlateNumber(item.plateNumber);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingStudent(null);
    setStudentName('');
    setStudentClass('');
    setParentContact('');
    setAddress('');
    setPlateNumber('');
  };

  const filteredList = transportList.filter(item => 
    item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.plateNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bus className="h-8 w-8 text-[#003366]" />
            Transport Manifesto
          </h1>
          <p className="text-gray-500">Manage school bus subscriptions and routes</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64 w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input 
              placeholder="Search student, class, or bus..." 
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
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingStudent ? 'Edit Transport Record' : 'Add Student to Transport'}</DialogTitle>
                <DialogDescription>
                  Enter details to register student for school bus service.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Student Name</Label>
                  <Input value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="Full Name" />
                </div>
                <div className="space-y-2">
                  <Label>Class</Label>
                  <Input value={studentClass} onChange={(e) => setStudentClass(e.target.value)} placeholder="e.g. JSS1 A" />
                </div>
                <div className="space-y-2">
                  <Label>Parent Contact</Label>
                  <Input value={parentContact} onChange={(e) => setParentContact(e.target.value)} placeholder="Phone Number" />
                </div>
                <div className="space-y-2">
                  <Label>Pickup Address</Label>
                  <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Full Address" />
                </div>
                <div className="space-y-2">
                  <Label>Bus Plate Number</Label>
                  <Input value={plateNumber} onChange={(e) => setPlateNumber(e.target.value)} placeholder="e.g. LAG-123-XY" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSave} className="bg-[#003366]">Save Record</Button>
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
                <TableHead>Student Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Pickup Address</TableHead>
                <TableHead>Parent Contact</TableHead>
                <TableHead>Bus Plate No.</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredList.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.studentName}</TableCell>
                  <TableCell><Badge variant="outline">{item.class}</Badge></TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-gray-600 max-w-[200px] truncate" title={item.address}>
                      <MapPin className="mr-1 h-3 w-3 flex-shrink-0" />
                      {item.address}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Phone className="mr-1 h-3 w-3 text-gray-400" />
                      {item.parentContact}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-mono">{item.plateNumber}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                        <Edit2 className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No transport records found.
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
