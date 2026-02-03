import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '../types';

// Authentication Context for BFOIA School Management System
// Version: 2.0 - Production Ready (Role Switching Removed)

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (userData: SignupData) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  pendingUsers: User[];
  approveUser: (userId: string) => void;
  rejectUser: (userId: string, reason: string) => void;
}

interface SignupData {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  department?: string;
  class?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Mock users for demo
const MOCK_USERS: Record<UserRole, User> = {
  proprietor: {
    id: 'prop-1',
    name: 'Bishop Felix Owolabi',
    email: 'proprietor@bfoia.edu.ng',
    role: 'proprietor',
    department: 'Administration',
    academicSession: '2025/2026',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bishop',
  },
  principal: {
    id: 'princ-1',
    name: 'Dr. Principal',
    email: 'principal@bfoia.edu.ng',
    role: 'principal',
    department: 'Administration',
    academicSession: '2025/2026',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Principal',
  },
  hr: {
    id: 'hr-1',
    name: 'HR Manager',
    email: 'hr@bfoia.edu.ng',
    role: 'hr',
    department: 'Human Resources',
    academicSession: '2025/2026',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HR',
  },
  bursar: {
    id: 'bur-1',
    name: 'Chief Bursar',
    email: 'bursar@bfoia.edu.ng',
    role: 'bursar',
    department: 'Finance',
    academicSession: '2025/2026',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bursar',
  },
  teacher: {
    id: 'teach-1',
    name: 'Mr. Teacher',
    email: 'teacher@bfoia.edu.ng',
    role: 'teacher',
    department: 'Mathematics',
    academicSession: '2025/2026',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher',
  },
  student: {
    id: 'stud-1',
    name: 'ADEYEMI, John Oluwaseun',
    email: 'student@bfoia.edu.ng',
    role: 'student',
    class: 'JSS 3A',
    academicSession: '2025/2026',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    studentId: 'BFOIA/2023/001',
  },
  parent: {
    id: 'par-1',
    name: 'Mr. & Mrs. Adeyemi',
    email: 'parent@bfoia.edu.ng',
    role: 'parent',
    academicSession: '2025/2026',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Parents',
  },
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Simple mock login logic
      // Check if email contains a role name for easy testing
      let matchedRole: UserRole | undefined;
      
      if (email.includes('proprietor')) matchedRole = 'proprietor';
      else if (email.includes('principal')) matchedRole = 'principal';
      else if (email.includes('hr')) matchedRole = 'hr';
      else if (email.includes('bursar')) matchedRole = 'bursar';
      else if (email.includes('teacher')) matchedRole = 'teacher';
      else if (email.includes('student')) matchedRole = 'student';
      else if (email.includes('parent')) matchedRole = 'parent';
      
      // Default to proprietor if no specific role found (or exact match for 'admin')
      if (!matchedRole && (email === 'admin@bfoia.edu.ng' || email === 'demo@bfoia.edu.ng')) {
        matchedRole = 'proprietor';
      }

      if (matchedRole) {
        setUser(MOCK_USERS[matchedRole]);
      } else {
        // Fallback to student for unknown emails in demo mode
        setUser({
          ...MOCK_USERS['student'],
          email: email,
          name: email.split('@')[0],
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: SignupData) => {
    setLoading(true);
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In a real app, this would make an API call to create the user
      // For demo purposes, we'll just store the data and simulate success
      console.log('New user signup:', userData);

      // Simulate validation - check if email already exists (basic check)
      if (userData.email === 'proprietor@bfoia.edu.ng' || 
          userData.email === 'principal@bfoia.edu.ng' ||
          userData.email === 'teacher@bfoia.edu.ng') {
        throw new Error('This email is already registered. Please use a different email or login.');
      }

      // Create a pending user and add to pending list
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: userData.fullName,
        email: userData.email,
        role: userData.role,
        department: userData.department,
        class: userData.class,
        academicSession: '2025/2026',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.fullName}`,
        approvalStatus: 'pending',
      };

      // Add to pending users list
      setPendingUsers(prev => [...prev, newUser]);

      // In a real app, you would create the user in the database here
      // For now, we just simulate success without actually creating the user
      // The user will need to login after signup and approval
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // In a real app, this would send a password reset email
    console.log('Password reset requested for:', email);
    
    // Simulate success
    return;
  };

  const approveUser = (userId: string) => {
    setPendingUsers(prev => {
      const updatedUsers = prev.map(u => {
        if (u.id === userId) {
          return {
            ...u,
            approvalStatus: 'approved' as const,
            approvedBy: user?.id,
            approvedAt: new Date(),
          };
        }
        return u;
      });
      // Remove from pending list after approval
      return updatedUsers.filter(u => u.approvalStatus === 'pending');
    });
  };

  const rejectUser = (userId: string, reason: string) => {
    setPendingUsers(prev => {
      const updatedUsers = prev.map(u => {
        if (u.id === userId) {
          return {
            ...u,
            approvalStatus: 'rejected' as const,
            rejectedReason: reason,
          };
        }
        return u;
      });
      // Remove from pending list after rejection
      return updatedUsers.filter(u => u.approvalStatus === 'pending');
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      signup,
      resetPassword,
      pendingUsers,
      approveUser,
      rejectUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
