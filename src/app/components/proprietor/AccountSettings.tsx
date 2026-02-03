import React, { useState, useRef } from 'react';
import { PageHeader } from './PageHeader';
import { User, Camera, Mail, Phone, MapPin, Building, Save, X } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  address: string;
  city: string;
  state: string;
  country: string;
  profileImage: string;
}

export const AccountSettings: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: 'Bishop Felix Owolabi',
    email: 'proprietor@bfoia.edu.ng',
    phone: '+234 803 123 4567',
    role: 'Proprietor',
    address: '123 Education Avenue',
    city: 'Lagos',
    state: 'Lagos State',
    country: 'Nigeria',
    profileImage: '', // Will store base64 or URL
  });

  const [tempProfileData, setTempProfileData] = useState<ProfileData>(profileData);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setTempProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setTempProfileData(prev => ({
          ...prev,
          profileImage: base64String
        }));
        toast.success('School logo uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setTempProfileData(prev => ({
      ...prev,
      profileImage: ''
    }));
    toast.success('School logo removed');
  };

  const handleEdit = () => {
    setIsEditing(true);
    setTempProfileData(profileData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempProfileData(profileData);
  };

  const handleSave = () => {
    // Validate required fields
    if (!tempProfileData.fullName.trim()) {
      toast.error('Full name is required');
      return;
    }
    if (!tempProfileData.email.trim()) {
      toast.error('Email is required');
      return;
    }
    if (!tempProfileData.phone.trim()) {
      toast.error('Phone number is required');
      return;
    }

    setProfileData(tempProfileData);
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-8">
      <PageHeader
        title="Account Settings"
        description="Manage your profile and school information"
        icon={User}
        action={
          !isEditing ? (
            <Button onClick={handleEdit}>
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Image Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg mb-4">School Logo</h3>
            
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                {tempProfileData.profileImage ? (
                  <img
                    src={tempProfileData.profileImage}
                    alt="School Logo"
                    className="w-40 h-40 rounded-lg object-cover border-4 border-blue-950"
                  />
                ) : (
                  <div className="w-40 h-40 rounded-lg bg-gradient-to-br from-blue-950 to-blue-800 flex items-center justify-center border-4 border-blue-950">
                    <span className="text-6xl text-amber-500">BF</span>
                  </div>
                )}
                
                {isEditing && (
                  <button
                    onClick={triggerFileInput}
                    className="absolute bottom-0 right-0 w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-blue-950 hover:bg-amber-600 transition-colors shadow-lg"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {isEditing && (
                <div className="w-full space-y-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={triggerFileInput}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Upload School Logo
                  </Button>
                  {tempProfileData.profileImage && (
                    <Button
                      variant="outline"
                      className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={handleRemoveImage}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Remove Logo
                    </Button>
                  )}
                </div>
              )}

              {!isEditing && (
                <div className="text-center mt-4">
                  <p className="text-sm text-gray-600">
                    {tempProfileData.profileImage ? 'Custom Logo' : 'Default Logo'}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs text-gray-600 mb-2">Image Guidelines:</p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Recommended: 500x500px</li>
                <li>• Maximum size: 5MB</li>
                <li>• Format: JPG, PNG, or SVG</li>
                <li>• Square or circular logos work best</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Profile Information Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg mb-6">Personal Information</h3>

            <div className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={tempProfileData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Enter full name"
                  />
                ) : (
                  <p className="px-4 py-2 bg-gray-50 rounded-lg">{profileData.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  {isEditing ? (
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={tempProfileData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="Enter email address"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center px-4 py-2 bg-gray-50 rounded-lg">
                      <Mail className="w-5 h-5 text-gray-400 mr-3" />
                      <p>{profileData.email}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  {isEditing ? (
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={tempProfileData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="Enter phone number"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center px-4 py-2 bg-gray-50 rounded-lg">
                      <Phone className="w-5 h-5 text-gray-400 mr-3" />
                      <p>{profileData.phone}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Role (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <div className="flex items-center px-4 py-2 bg-gray-100 rounded-lg">
                  <Building className="w-5 h-5 text-gray-400 mr-3" />
                  <p className="text-gray-600">{profileData.role}</p>
                  <span className="ml-auto px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                    System Role
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 my-6"></div>

              <h4 className="font-medium mb-4">School Address</h4>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address
                </label>
                <div className="relative">
                  {isEditing ? (
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={tempProfileData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="Enter street address"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center px-4 py-2 bg-gray-50 rounded-lg">
                      <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                      <p>{profileData.address}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* City, State, Country */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempProfileData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Enter city"
                    />
                  ) : (
                    <p className="px-4 py-2 bg-gray-50 rounded-lg">{profileData.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempProfileData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Enter state"
                    />
                  ) : (
                    <p className="px-4 py-2 bg-gray-50 rounded-lg">{profileData.state}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempProfileData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Enter country"
                    />
                  ) : (
                    <p className="px-4 py-2 bg-gray-50 rounded-lg">{profileData.country}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
            <h3 className="text-lg mb-4">Security Settings</h3>
            <div className="space-y-4">
              <Button variant="outline" className="w-full md:w-auto">
                Change Password
              </Button>
              <p className="text-sm text-gray-600">
                Last password change: December 1, 2024
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
