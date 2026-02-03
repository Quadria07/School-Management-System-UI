import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Download,
  Eye,
  CreditCard,
  FileText,
  Phone,
  Mail,
  MapPin,
  ArrowLeft,
  Camera,
  Save,
  PenTool,
} from 'lucide-react';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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

import { StaffIDCard } from './StaffIDCard';

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  type: 'Academic' | 'Non-Academic';
  employeeId: string;
  phone: string;
  email: string;
  dateJoined: string;
  qualifications: string;
  status: 'Active' | 'On Leave' | 'Suspended';
  photo: string;
  signature: string;
  address: string;
  nextOfKin: string;
  nextOfKinPhone: string;
}

export const StaffDirectory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterDept, setFilterDept] = useState('all');
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showIDDialog, setShowIDDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [viewingDocument, setViewingDocument] = useState<string | null>(null);

  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
    {
      id: '1',
      name: 'Mr. Adeyemi Tunde',
      role: 'Mathematics Teacher',
      department: 'Mathematics',
      type: 'Academic',
      employeeId: 'BFOIA/TCH/001',
      phone: '+234 803 123 4567',
      email: 'adeyemi@bfoia.edu.ng',
      dateJoined: 'Sep 2020',
      qualifications: 'B.Sc Mathematics, M.Ed',
      status: 'Active',
      photo: '👨‍🏫',
      signature: '',
      address: '15 Lagos Street, Ikeja, Lagos',
      nextOfKin: 'Mrs. Adeyemi Folake',
      nextOfKinPhone: '+234 803 987 6543',
    },
    {
      id: '2',
      name: 'Mrs. Okonkwo Mary',
      role: 'English Teacher',
      department: 'Languages',
      type: 'Academic',
      employeeId: 'BFOIA/TCH/002',
      phone: '+234 805 234 5678',
      email: 'okonkwo@bfoia.edu.ng',
      dateJoined: 'Jan 2019',
      qualifications: 'B.A English, PGDE',
      status: 'Active',
      photo: '👩‍🏫',
      signature: '',
      address: '22 Abuja Road, Yaba, Lagos',
      nextOfKin: 'Mr. Okonkwo Chidi',
      nextOfKinPhone: '+234 806 111 2233',
    },
    {
      id: '3',
      name: 'Dr. Ibrahim Yusuf',
      role: 'Biology Teacher',
      department: 'Sciences',
      type: 'Academic',
      employeeId: 'BFOIA/TCH/003',
      phone: '+234 807 345 6789',
      email: 'ibrahim@bfoia.edu.ng',
      dateJoined: 'Apr 2018',
      qualifications: 'B.Sc Biology, M.Sc, Ph.D',
      status: 'Active',
      photo: '👨‍🔬',
      signature: '',
      address: '8 Kano Close, Surulere, Lagos',
      nextOfKin: 'Mrs. Ibrahim Aisha',
      nextOfKinPhone: '+234 808 222 3344',
    },
    {
      id: '4',
      name: 'Mr. Johnson Peter',
      role: 'Security Officer',
      department: 'Security',
      type: 'Non-Academic',
      employeeId: 'BFOIA/SEC/001',
      phone: '+234 809 456 7890',
      email: 'johnson@bfoia.edu.ng',
      dateJoined: 'Mar 2022',
      qualifications: 'SSCE, Security Training Certificate',
      status: 'Active',
      photo: '👮',
      signature: '',
      address: '45 Victoria Island, Lagos',
      nextOfKin: 'Mrs. Johnson Grace',
      nextOfKinPhone: '+234 809 333 4455',
    },
    {
      id: '5',
      name: 'Mrs. Eze Chioma',
      role: 'Chemistry Teacher',
      department: 'Sciences',
      type: 'Academic',
      employeeId: 'BFOIA/TCH/004',
      phone: '+234 810 567 8901',
      email: 'eze@bfoia.edu.ng',
      dateJoined: 'Aug 2021',
      qualifications: 'B.Sc Chemistry, M.Sc',
      status: 'On Leave',
      photo: '👩‍🔬',
      signature: '',
      address: '12 Enugu Street, Ikeja, Lagos',
      nextOfKin: 'Mr. Eze Emeka',
      nextOfKinPhone: '+234 810 444 5566',
    },
  ]);

  const filteredStaff = staffMembers.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || staff.type === filterType;
    const matchesDept = filterDept === 'all' || staff.department === filterDept;
    return matchesSearch && matchesType && matchesDept;
  });

  const handleViewProfile = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setShowProfileDialog(true);
  };

  const handleEditProfile = () => {
    if (selectedStaff) {
      setIsEditing(true);
      setShowProfileDialog(false);
    }
  };

  const handleSaveProfile = () => {
    if (selectedStaff) {
      setStaffMembers((prev) =>
        prev.map((s) => (s.id === selectedStaff.id ? selectedStaff : s))
      );
      setIsEditing(false);
      setSelectedStaff(null);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setIsAdding(false);
    setSelectedStaff(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedStaff) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedStaff({ ...selectedStaff, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedStaff) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedStaff({ ...selectedStaff, signature: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddNewStaff = () => {
    const newStaff: StaffMember = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      role: '',
      department: 'Mathematics',
      type: 'Academic',
      employeeId: `BFOIA/TCH/${Math.floor(100 + Math.random() * 900)}`,
      phone: '',
      email: '',
      dateJoined: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      qualifications: '',
      status: 'Active',
      photo: '👤', // Default placeholder
      signature: '',
      address: '',
      nextOfKin: '',
      nextOfKinPhone: '',
    };
    setSelectedStaff(newStaff);
    setIsAdding(true);
  };

  const handleSaveNewStaff = () => {
    if (selectedStaff) {
      setStaffMembers([selectedStaff, ...staffMembers]);
      setIsAdding(false);
      setSelectedStaff(null);
    }
  };

  const handleGenerateID = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setShowIDDialog(true);
  };

  if ((isEditing || isAdding) && selectedStaff) {
    return (
      <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={handleCancelEdit}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-blue-950">
            {isAdding ? 'Add New Staff Member' : 'Edit Staff Profile'}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Photo & Basic Info */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6 flex flex-col items-center">
                <div className="relative w-40 h-40 mb-4 group">
                  <div className="w-full h-full rounded-full overflow-hidden border-4 border-gray-100 flex items-center justify-center bg-gray-50 text-6xl">
                    {selectedStaff.photo.startsWith('http') || selectedStaff.photo.startsWith('data:') ? (
                       <img src={selectedStaff.photo} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                       selectedStaff.photo
                    )}
                  </div>
                  <label htmlFor="photo-upload" className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="w-8 h-8 text-white" />
                  </label>
                  <input 
                    id="photo-upload" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageUpload}
                  />
                  {/* Fallback Input for Photo URL if user prefers */}
                   {!selectedStaff.photo.startsWith('data:') && (
                      <Input 
                        className="mt-2 text-xs" 
                        placeholder="Or paste Image URL..." 
                        value={selectedStaff.photo.length > 50 ? '' : selectedStaff.photo} 
                        onChange={(e) => setSelectedStaff({...selectedStaff, photo: e.target.value})}
                      />
                   )}
                </div>
                
                <div className="text-center w-full space-y-3">
                   <div className="space-y-1">
                      <Label>Staff Status</Label>
                      <Select 
                        value={selectedStaff.status} 
                        onValueChange={(val: any) => setSelectedStaff({...selectedStaff, status: val})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="On Leave">On Leave</SelectItem>
                          <SelectItem value="Suspended">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                   </div>
                    <div className="space-y-1">
                      <Label>Staff Type</Label>
                      <Select 
                        value={selectedStaff.type} 
                        onValueChange={(val: any) => setSelectedStaff({...selectedStaff, type: val})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Academic">Academic</SelectItem>
                          <SelectItem value="Non-Academic">Non-Academic</SelectItem>
                        </SelectContent>
                      </Select>
                   </div>
                   
                   {/* Signature Upload Section */}
                   <div className="space-y-2 pt-2 border-t mt-2">
                      <Label className="flex items-center gap-2 justify-center">
                        <PenTool className="w-3 h-3" />
                        Signature
                      </Label>
                      <div className="border border-dashed border-gray-300 rounded-md p-2 flex flex-col items-center justify-center bg-gray-50 min-h-[60px]">
                        {selectedStaff.signature ? (
                           <div className="relative group w-full h-12">
                              <img src={selectedStaff.signature} alt="Signature" className="h-full w-full object-contain" />
                              <button 
                                onClick={() => setSelectedStaff({...selectedStaff, signature: ''})}
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                X
                              </button>
                           </div>
                        ) : (
                          <div className="text-xs text-gray-400">No signature uploaded</div>
                        )}
                        <div className="mt-2 w-full">
                           <label htmlFor="signature-upload" className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-7 px-3 py-1 w-full">
                              Upload Signature
                           </label>
                           <input 
                              id="signature-upload" 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={handleSignatureUpload}
                            />
                        </div>
                      </div>
                   </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Detailed Form */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input 
                      value={selectedStaff.name} 
                      onChange={(e) => setSelectedStaff({...selectedStaff, name: e.target.value})}
                      placeholder="e.g. Mr. John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input 
                      value={selectedStaff.email} 
                      onChange={(e) => setSelectedStaff({...selectedStaff, email: e.target.value})}
                      placeholder="john@bfoia.edu.ng"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input 
                      value={selectedStaff.phone} 
                      onChange={(e) => setSelectedStaff({...selectedStaff, phone: e.target.value})}
                      placeholder="+234..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Input 
                      value={selectedStaff.address} 
                      onChange={(e) => setSelectedStaff({...selectedStaff, address: e.target.value})}
                      placeholder="Residential Address"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Professional Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Select 
                        value={selectedStaff.department} 
                        onValueChange={(val) => setSelectedStaff({...selectedStaff, department: val})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mathematics">Mathematics</SelectItem>
                          <SelectItem value="Sciences">Sciences</SelectItem>
                          <SelectItem value="Languages">Languages</SelectItem>
                          <SelectItem value="Security">Security</SelectItem>
                          <SelectItem value="Admin">Administration</SelectItem>
                        </SelectContent>
                      </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Job Role</Label>
                    <Input 
                      value={selectedStaff.role} 
                      onChange={(e) => setSelectedStaff({...selectedStaff, role: e.target.value})}
                      placeholder="e.g. Mathematics Teacher"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Employee ID</Label>
                    <Input value={selectedStaff.employeeId} disabled className="bg-gray-50" />
                  </div>
                   <div className="space-y-2">
                    <Label>Date Joined</Label>
                    <Input 
                      value={selectedStaff.dateJoined} 
                      onChange={(e) => setSelectedStaff({...selectedStaff, dateJoined: e.target.value})}
                    />
                  </div>
                   <div className="col-span-2 space-y-2">
                    <Label>Qualifications</Label>
                    <Input 
                      value={selectedStaff.qualifications} 
                      onChange={(e) => setSelectedStaff({...selectedStaff, qualifications: e.target.value})}
                      placeholder="e.g. B.Sc, M.Ed, PGDE"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
             <Card>
              <CardHeader>
                <CardTitle>Next of Kin Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                    <Label>Next of Kin Name</Label>
                    <Input 
                      value={selectedStaff.nextOfKin} 
                      onChange={(e) => setSelectedStaff({...selectedStaff, nextOfKin: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Next of Kin Phone</Label>
                    <Input 
                      value={selectedStaff.nextOfKinPhone} 
                      onChange={(e) => setSelectedStaff({...selectedStaff, nextOfKinPhone: e.target.value})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={handleCancelEdit}>Cancel</Button>
              <Button onClick={isAdding ? handleSaveNewStaff : handleSaveProfile} className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                {isAdding ? 'Create Staff Profile' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl mb-2 text-blue-950">Staff Directory</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Comprehensive database of all employees
          </p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={handleAddNewStaff}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add New Staff
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name or employee ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Staff Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Academic">Academic Staff</SelectItem>
                <SelectItem value="Non-Academic">Non-Academic Staff</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterDept} onValueChange={setFilterDept}>
              <SelectTrigger>
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="Sciences">Sciences</SelectItem>
                <SelectItem value="Languages">Languages</SelectItem>
                <SelectItem value="Security">Security</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Staff Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map((staff) => (
          <Card key={staff.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="text-4xl">{staff.photo}</div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg mb-1 truncate">{staff.name}</CardTitle>
                  <CardDescription className="truncate">{staff.role}</CardDescription>
                  <div className="flex gap-2 mt-2">
                    <Badge
                      className={
                        staff.type === 'Academic'
                          ? 'bg-blue-600 text-white'
                          : 'bg-purple-600 text-white'
                      }
                    >
                      {staff.type}
                    </Badge>
                    <Badge
                      className={
                        staff.status === 'Active'
                          ? 'bg-green-600 text-white'
                          : staff.status === 'On Leave'
                          ? 'bg-amber-600 text-white'
                          : 'bg-red-600 text-white'
                      }
                    >
                      {staff.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">{staff.employeeId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">{staff.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600 truncate">{staff.email}</span>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleViewProfile(staff)}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleGenerateID(staff)}
                >
                  <CreditCard className="w-3 h-3 mr-1" />
                  ID Card
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Profile Dialog */}
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Staff Profile</DialogTitle>
            <DialogDescription>{selectedStaff?.employeeId}</DialogDescription>
          </DialogHeader>
          {selectedStaff && (
            <div className="space-y-4">
              {/* Personal Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="text-5xl">{selectedStaff.photo}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{selectedStaff.name}</h3>
                      <p className="text-sm text-gray-600">{selectedStaff.role}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge className="bg-blue-600 text-white">{selectedStaff.type}</Badge>
                        <Badge className="bg-green-600 text-white">{selectedStaff.status}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Phone:</p>
                      <p className="font-medium">{selectedStaff.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Email:</p>
                      <p className="font-medium">{selectedStaff.email}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-600">Address:</p>
                      <p className="font-medium">{selectedStaff.address}</p>
                    </div>
                    {/* Display Signature if available */}
                    {selectedStaff.signature && (
                       <div className="col-span-2 border-t pt-2 mt-1">
                         <p className="text-gray-600 mb-1">Signature:</p>
                         <img src={selectedStaff.signature} alt="Staff Signature" className="h-8 object-contain border border-dashed p-1 bg-gray-50" />
                       </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Professional Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Professional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Department:</p>
                      <p className="font-medium">{selectedStaff.department}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Date Joined:</p>
                      <p className="font-medium">{selectedStaff.dateJoined}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-600">Qualifications:</p>
                      <p className="font-medium">{selectedStaff.qualifications}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Next of Kin */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Next of Kin</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Name:</p>
                      <p className="font-medium">{selectedStaff.nextOfKin}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Phone:</p>
                      <p className="font-medium">{selectedStaff.nextOfKinPhone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Digital File Cabinet */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Digital File Cabinet</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {['CV/Resume', 'NYSC Certificate', 'Appointment Letter', 'Teaching License'].map(
                      (doc, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-600" />
                            <span className="text-sm">{doc}</span>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setViewingDocument(doc)}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
              
               {/* Actions */}
              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleGenerateID(selectedStaff)}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Generate ID Card
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleEditProfile}
                >
                  Edit Profile
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* ID Card Dialog */}
      <Dialog open={showIDDialog} onOpenChange={setShowIDDialog}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-transparent border-none shadow-none">
          <DialogHeader className="sr-only">
             <DialogTitle>Staff ID Card</DialogTitle>
             <DialogDescription>Generated ID Card Preview</DialogDescription>
          </DialogHeader>
          
          <div className="bg-white rounded-lg p-1 overflow-hidden">
             {selectedStaff && <StaffIDCard staff={selectedStaff} />}
             
             <div className="p-4 flex justify-center gap-4 bg-gray-50 border-t">
                <Button onClick={() => window.print()} className="bg-blue-600 hover:bg-blue-700">
                  <Download className="w-4 h-4 mr-2" />
                  Download / Print
                </Button>
                <Button variant="outline" onClick={() => setShowIDDialog(false)}>
                  Close
                </Button>
             </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hidden Print Container - Renders outside the Dialog for clean printing */}
      <div id="print-container" className="hidden fixed inset-0 z-[99999] bg-white items-start justify-center p-8">
          {selectedStaff && showIDDialog && (
             <StaffIDCard staff={selectedStaff} />
          )}
      </div>

      <style>{`
        @media print {
          /* Hide everything by default */
          body * {
            visibility: hidden;
          }
          
          /* Show only the print container and its children */
          #print-container, #print-container * {
            visibility: visible;
          }
          
          #print-container {
            display: flex !important;
            position: fixed;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            background: white !important;
            z-index: 99999;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            padding: 20px;
          }
          
          /* Ensure background colors and images are printed */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
};