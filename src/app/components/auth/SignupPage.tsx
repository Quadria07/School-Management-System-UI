import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Checkbox } from '../ui/checkbox';
import { GraduationCap, CircleAlert, CheckCircle2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { UserRole } from '@/types';
import { Logo } from '../shared/Logo';

interface SignupPageProps {
  onSignup: (userData: SignupFormData) => Promise<void>;
  onBackToLogin: () => void;
}

export interface SignupFormData {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  department?: string;
  admissionNumber?: string;
  class?: string;
}

export function SignupPage({ onSignup, onBackToLogin }: SignupPageProps) {
  const [formData, setFormData] = useState<SignupFormData>({
    fullName: '',
    email: '',
    password: '',
    role: 'student',
    phone: '',
    department: '',
    admissionNumber: '',
    class: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field: keyof SignupFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): string | null => {
    if (!formData.fullName.trim()) {
      return 'Please enter your full name';
    }
    if (!formData.email.trim()) {
      return 'Please enter your email address';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return 'Please enter a valid email address';
    }
    if (!formData.password) {
      return 'Please enter a password';
    }
    if (formData.password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (formData.password !== confirmPassword) {
      return 'Passwords do not match';
    }
    if (!agreeToTerms) {
      return 'Please agree to the Terms and Conditions';
    }

    // Role-specific validation
    if (formData.role === 'student' && !formData.class) {
      return 'Please select your class';
    }
    if ((formData.role === 'teacher' || formData.role === 'hr' || 
         formData.role === 'bursar') && !formData.department) {
      return 'Please enter your department';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      await onSignup(formData);
      setSuccess(true);
      // Auto-redirect to login after 2 seconds
      setTimeout(() => {
        onBackToLogin();
      }, 2000);
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'An error occurred during signup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions: { value: UserRole; label: string }[] = [
    { value: 'student', label: 'Student' },
    { value: 'parent', label: 'Parent' },
    { value: 'teacher', label: 'Teacher' },
    { value: 'hr', label: 'HR Manager' },
    { value: 'bursar', label: 'Bursar' },
    { value: 'principal', label: 'Principal' },
    { value: 'proprietor', label: 'Proprietor' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#003366] via-[#004080] to-[#002244] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-[#FFD700] rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          {/* Logo */}
          <div className="mb-12">
            <Logo size="lg" variant="white" />
            <h2 className="text-4xl font-bold mb-4 mt-6">
              Join Our<br />
              Academic Community
            </h2>
            <p className="text-xl text-blue-200">
              Create your account to get started
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#FFD700] rounded-full mt-2"></div>
              <div>
                <h3 className="font-semibold mb-1">Quick Registration</h3>
                <p className="text-sm text-blue-200">Simple and secure signup process</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#FFD700] rounded-full mt-2"></div>
              <div>
                <h3 className="font-semibold mb-1">Instant Access</h3>
                <p className="text-sm text-blue-200">Get immediate access to your personalized dashboard</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#FFD700] rounded-full mt-2"></div>
              <div>
                <h3 className="font-semibold mb-1">Secure Platform</h3>
                <p className="text-sm text-blue-200">Your data is protected with enterprise-grade security</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <Logo size="md" className="justify-center" />
          </div>

          {/* Signup Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            {/* Back to Login Button */}
            <button
              onClick={onBackToLogin}
              className="flex items-center gap-2 text-sm text-[#003366] hover:text-[#004080] mb-6 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
              <p className="text-gray-600">Fill in your details to get started</p>
            </div>

            {/* Success Alert */}
            {success && (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Account created successfully! Redirecting to login...
                </AlertDescription>
              </Alert>
            )}

            {/* Error Alert */}
            {error && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <CircleAlert className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-gray-700">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  required
                  className="h-11"
                  disabled={loading || success}
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@bfoia.edu.ng"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  className="h-11"
                  disabled={loading || success}
                />
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <Label htmlFor="role" className="text-gray-700">
                  I am a <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleInputChange('role', value as UserRole)}
                  disabled={loading || success}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Conditional Fields Based on Role */}
              {formData.role === 'student' && (
                <div className="space-y-2">
                  <Label htmlFor="class" className="text-gray-700">
                    Class <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.class || ''}
                    onValueChange={(value) => handleInputChange('class', value)}
                    disabled={loading || success}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select your class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="JSS 1A">JSS 1A</SelectItem>
                      <SelectItem value="JSS 1B">JSS 1B</SelectItem>
                      <SelectItem value="JSS 2A">JSS 2A</SelectItem>
                      <SelectItem value="JSS 2B">JSS 2B</SelectItem>
                      <SelectItem value="JSS 3A">JSS 3A</SelectItem>
                      <SelectItem value="JSS 3B">JSS 3B</SelectItem>
                      <SelectItem value="SSS 1A">SSS 1A</SelectItem>
                      <SelectItem value="SSS 1B">SSS 1B</SelectItem>
                      <SelectItem value="SSS 2A">SSS 2A</SelectItem>
                      <SelectItem value="SSS 2B">SSS 2B</SelectItem>
                      <SelectItem value="SSS 3A">SSS 3A</SelectItem>
                      <SelectItem value="SSS 3B">SSS 3B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {(formData.role === 'teacher' || formData.role === 'hr' || formData.role === 'bursar') && (
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-gray-700">
                    Department <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="department"
                    type="text"
                    placeholder="e.g., Mathematics, Science, HR"
                    value={formData.department || ''}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="h-11"
                    disabled={loading || success}
                  />
                </div>
              )}

              {/* Phone Number (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700">
                  Phone Number <span className="text-gray-400">(Optional)</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+234 800 000 0000"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="h-11"
                  disabled={loading || success}
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">
                  Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password (min. 8 characters)"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                    className="h-11 pr-10"
                    disabled={loading || success}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    disabled={loading || success}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700">
                  Confirm Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="h-11 pr-10"
                    disabled={loading || success}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    disabled={loading || success}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-2 pt-2">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                  disabled={loading || success}
                  className="mt-1"
                />
                <Label
                  htmlFor="terms"
                  className="text-sm font-normal text-gray-600 cursor-pointer leading-relaxed"
                >
                  I agree to the{' '}
                  <button type="button" className="text-[#003366] hover:text-[#004080] font-medium">
                    Terms and Conditions
                  </button>{' '}
                  and{' '}
                  <button type="button" className="text-[#003366] hover:text-[#004080] font-medium">
                    Privacy Policy
                  </button>
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-11 bg-[#003366] hover:bg-[#004080] text-white mt-6"
                disabled={loading || success}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Account...
                  </div>
                ) : success ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Account Created!
                  </div>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={onBackToLogin}
                  className="text-[#003366] hover:text-[#004080] font-medium"
                  disabled={loading}
                >
                  Sign in here
                </button>
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-gray-600">
            © 2026 Bishop Felix Owolabi International Academy.<br />
            All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}