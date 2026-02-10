import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { AuthAPI, TokenService } from '../utils/api';

// Authentication Context for BFOIA School Management System
// Version: 3.0 - Connected to Real Backend API

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

// Helper to convert backend user to frontend User type
const mapBackendUser = (backendUser: any): User => {
  return {
    id: backendUser.id,
    name: backendUser.full_name,
    email: backendUser.email || '',
    role: backendUser.role as UserRole,
    department: backendUser.department,
    class: backendUser.class_name,
    academicSession: backendUser.academic_session || '2024/2025',
    avatar: backendUser.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${backendUser.full_name}`,
    studentId: backendUser.student_id,
    staffId: backendUser.staff_id,
  };
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);

  // Check for existing session on app load
  useEffect(() => {
    const savedUser = TokenService.getUser();
    const token = TokenService.getToken();

    if (savedUser && token) {
      setUser(mapBackendUser(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Don't set global loading here - LoginPage handles its own loading state
    try {
      const response = await AuthAPI.login(email, password);

      if (response.status === 'success' && response.user) {
        const mappedUser = mapBackendUser(response.user);
        setUser(mappedUser);
        console.log('Login successful:', mappedUser);
      } else {
        throw new Error(response.error || response.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw error; // Re-throw so LoginPage can display it
    }
  };

  const signup = async (userData: SignupData) => {
    setLoading(true);
    try {
      // TODO: Connect to signup API when available
      // For now, simulate signup
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('New user signup:', userData);

      // Create a pending user
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: userData.fullName,
        email: userData.email,
        role: userData.role,
        department: userData.department,
        class: userData.class,
        academicSession: '2024/2025',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.fullName}`,
        approvalStatus: 'pending',
      };

      setPendingUsers(prev => [...prev, newUser]);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    // TODO: Connect to password reset API
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Password reset requested for:', email);
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
      return updatedUsers.filter(u => u.approvalStatus === 'pending');
    });
  };

  const logout = () => {
    AuthAPI.logout();
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
