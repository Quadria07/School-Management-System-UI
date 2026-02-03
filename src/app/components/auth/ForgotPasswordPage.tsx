import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { CircleAlert, CheckCircle2, ArrowLeft, Mail } from 'lucide-react';
import { Logo } from '../shared/Logo';

interface ForgotPasswordPageProps {
  onBackToLogin: () => void;
  onResetPassword: (email: string) => Promise<void>;
}

export function ForgotPasswordPage({ onBackToLogin, onResetPassword }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      await onResetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
              Forgot Your<br />
              Password?
            </h2>
            <p className="text-xl text-blue-200">
              No worries, we'll help you reset it
            </p>
          </div>

          {/* Information */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#FFD700] rounded-full mt-2"></div>
              <div>
                <h3 className="font-semibold mb-1">Quick & Easy</h3>
                <p className="text-sm text-blue-200">Enter your email and we'll send you reset instructions</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#FFD700] rounded-full mt-2"></div>
              <div>
                <h3 className="font-semibold mb-1">Secure Process</h3>
                <p className="text-sm text-blue-200">Your account security is our top priority</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#FFD700] rounded-full mt-2"></div>
              <div>
                <h3 className="font-semibold mb-1">24/7 Support</h3>
                <p className="text-sm text-blue-200">Contact support if you need additional help</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Reset Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <div className="w-16 h-16 bg-[#FFD700] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <GraduationCap className="w-10 h-10 text-[#003366]" />
            </div>
            <h1 className="text-2xl font-bold text-[#003366]">BFOIA Portal</h1>
            <p className="text-sm text-gray-600">Bishop Felix Owolabi International Academy</p>
          </div>

          {/* Reset Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            {/* Back to Login Button */}
            <button
              onClick={onBackToLogin}
              className="flex items-center gap-2 text-sm text-[#003366] hover:text-[#004080] mb-6 font-medium"
              disabled={loading || success}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </button>

            {!success ? (
              <>
                <div className="mb-6 text-center">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-[#003366]" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h2>
                  <p className="text-gray-600">
                    Enter your email address and we'll send you instructions to reset your password
                  </p>
                </div>

                {/* Error Alert */}
                {error && (
                  <Alert className="mb-6 border-red-200 bg-red-50">
                    <CircleAlert className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Reset Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@bfoia.edu.ng"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-11"
                      disabled={loading}
                      autoFocus
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full h-11 bg-[#003366] hover:bg-[#004080] text-white"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </div>
                    ) : (
                      'Send Reset Instructions'
                    )}
                  </Button>
                </form>
              </>
            ) : (
              <>
                {/* Success State */}
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
                  <p className="text-gray-600 mb-6">
                    We've sent password reset instructions to <strong>{email}</strong>
                  </p>
                  
                  <Alert className="mb-6 border-blue-200 bg-blue-50 text-left">
                    <AlertDescription className="text-blue-800 text-sm">
                      <strong>Didn't receive the email?</strong>
                      <ul className="mt-2 space-y-1 ml-4 list-disc">
                        <li>Check your spam or junk folder</li>
                        <li>Make sure you entered the correct email</li>
                        <li>Wait a few minutes for the email to arrive</li>
                      </ul>
                    </AlertDescription>
                  </Alert>

                  <Button
                    onClick={onBackToLogin}
                    className="w-full h-11 bg-[#003366] hover:bg-[#004080] text-white"
                  >
                    Return to Login
                  </Button>
                </div>
              </>
            )}

            {/* Additional Help */}
            {!success && (
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Need help?{' '}
                  <button
                    type="button"
                    className="text-[#003366] hover:text-[#004080] font-medium"
                    disabled={loading}
                  >
                    Contact Support
                  </button>
                </p>
              </div>
            )}
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