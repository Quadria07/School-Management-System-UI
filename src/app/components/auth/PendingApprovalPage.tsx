import React from 'react';
import { Button } from '../ui/button';
import { Clock, Mail, CheckCircle, LogOut } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { Logo } from '../shared/Logo';

interface PendingApprovalPageProps {
  userName: string;
  userEmail: string;
  userRole: string;
  onLogout: () => void;
}

export function PendingApprovalPage({ userName, userEmail, userRole, onLogout }: PendingApprovalPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003366] via-[#004080] to-[#002244] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo size="lg" variant="white" />
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          {/* Status Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center">
                <Clock className="w-10 h-10 text-amber-600" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">!</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">
            Account Under Review
          </h2>
          
          <p className="text-center text-gray-600 mb-8 text-lg">
            Thank you for registering with BFOIA!
          </p>

          {/* Info Alert */}
          <Alert className="mb-8 border-blue-200 bg-blue-50">
            <AlertDescription className="text-blue-900">
              <div className="space-y-3">
                <p className="font-semibold">Your account is currently being reviewed by our administrators.</p>
                <p>
                  Once your account has been verified and approved, you will gain full access to the BFOIA School Management System.
                </p>
              </div>
            </AlertDescription>
          </Alert>

          {/* User Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Registration Details</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#003366] rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium text-gray-900">{userName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#003366] rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="font-medium text-gray-900">{userEmail}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#003366] rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="font-medium text-gray-900 capitalize">{userRole}</p>
                </div>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              What happens next?
            </h3>
            <div className="space-y-3 ml-7">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2"></div>
                <p className="text-gray-700">
                  Our administrators will review your registration details
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2"></div>
                <p className="text-gray-700">
                  You will receive an email notification once your account is approved
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2"></div>
                <p className="text-gray-700">
                  After approval, you can log in and access your personalized dashboard
                </p>
              </div>
            </div>
          </div>

          {/* Expected Timeline */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-900 mb-1">Expected Timeline</h4>
                <p className="text-sm text-amber-800">
                  Account reviews are typically completed within <strong>24-48 hours</strong> during business days.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div className="text-center mb-6">
            <p className="text-gray-600 mb-3">
              Questions or concerns about your registration?
            </p>
            <Button
              variant="outline"
              className="border-[#003366] text-[#003366] hover:bg-[#003366] hover:text-white"
            >
              <Mail className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
          </div>

          {/* Logout Button */}
          <div className="border-t pt-6">
            <Button
              onClick={onLogout}
              variant="ghost"
              className="w-full text-gray-600 hover:text-gray-900"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-blue-200">
          © 2026 Bishop Felix Owolabi International Academy. All rights reserved.
        </p>
      </div>
    </div>
  );
}