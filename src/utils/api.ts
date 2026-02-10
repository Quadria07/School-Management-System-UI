// API Configuration and Service for BFOIA School Management System
// Connects React frontend to PHP Backend

// ========================================
// CONFIGURATION - UPDATE THIS URL FOR YOUR SERVER
// ========================================
const API_BASE_URL = 'https://portal.bfoiacademy.com/api';

// ========================================
// TOKEN MANAGEMENT
// ========================================
export const TokenService = {
    getToken: (): string | null => {
        return localStorage.getItem('auth_token');
    },

    setToken: (token: string): void => {
        localStorage.setItem('auth_token', token);
    },

    removeToken: (): void => {
        localStorage.removeItem('auth_token');
    },

    getUser: (): any | null => {
        const user = localStorage.getItem('auth_user');
        return user ? JSON.parse(user) : null;
    },

    setUser: (user: any): void => {
        localStorage.setItem('auth_user', JSON.stringify(user));
    },

    removeUser: (): void => {
        localStorage.removeItem('auth_user');
    },

    clear: (): void => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
    }
};

// ========================================
// API REQUEST HELPER
// ========================================
interface ApiResponse<T = any> {
    status: 'success' | 'error';
    message?: string;
    data?: T;
    error?: string;
    token?: string;
    user?: any;
}

async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}/${endpoint}`;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    // Add Authorization header if token exists
    const token = TokenService.getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.message || 'API request failed');
        }

        return data;
    } catch (error: any) {
        console.error(`API Error [${endpoint}]:`, error);
        throw error;
    }
}

// ========================================
// AUTH API
// ========================================
export const AuthAPI = {
    login: async (email: string, password: string) => {
        try {
            const response = await apiRequest<any>('auth/login.php', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });

            // Check for API-level error
            if (response.status === 'error' || response.error) {
                throw new Error(response.error || response.message || 'Invalid email or password');
            }

            if (response.status === 'success' && response.token) {
                TokenService.setToken(response.token);
                TokenService.setUser(response.user);
            }

            return response;
        } catch (error: any) {
            // Re-throw with user-friendly message
            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                throw new Error('Unable to connect to server. Please check your internet connection.');
            }
            throw error;
        }
    },

    logout: () => {
        TokenService.clear();
    },

    getCurrentUser: () => {
        return TokenService.getUser();
    },

    isAuthenticated: () => {
        return !!TokenService.getToken();
    }
};

// ========================================
// STUDENT API
// ========================================
export const StudentAPI = {
    getProfile: async () => {
        return apiRequest('students/profile.php');
    },

    getStats: async () => {
        return apiRequest('students/stats.php');
    },

    getResults: async (term: string = 'First Term', session: string = '2024/2025') => {
        return apiRequest(`results/view.php?term=${encodeURIComponent(term)}&session=${encodeURIComponent(session)}`);
    },

    getFeeBalance: async () => {
        return apiRequest('fees/get_balance.php');
    }
};

// ========================================
// TEACHER API
// ========================================
export const TeacherAPI = {
    getStats: async () => {
        return apiRequest('teachers/stats.php');
    },

    getClasses: async () => {
        return apiRequest('teachers/classes.php');
    },

    // Lesson Notes
    createLessonNote: async (noteData: any) => {
        return apiRequest('lesson-notes/create.php', {
            method: 'POST',
            body: JSON.stringify(noteData),
        });
    },

    getLessonNotes: async () => {
        return apiRequest('lesson-notes/list.php');
    },

    updateLessonNoteStatus: async (id: string, status: string) => {
        return apiRequest('lesson-notes/update_status.php', {
            method: 'POST',
            body: JSON.stringify({ id, status }),
        });
    },

    // Results
    uploadResult: async (resultData: any) => {
        return apiRequest('results/upload.php', {
            method: 'POST',
            body: JSON.stringify(resultData),
        });
    },

    getStudentsByClass: async (className: string) => {
        return apiRequest(`teachers/students.php?class=${encodeURIComponent(className)}`);
    },

    getFullBroadsheet: async (className: string, term: string, session: string) => {
        return apiRequest(`results/broadsheet.php?class=${encodeURIComponent(className)}&term=${encodeURIComponent(term)}&session=${encodeURIComponent(session)}`);
    },

    getAssessments: async () => {
        return apiRequest('assessments/list.php');
    }
};

// ========================================
// PARENT API
// ========================================
export const ParentAPI = {
    getChildren: async () => {
        return apiRequest('parents/children.php');
    },

    getChildResults: async (studentId: string, term: string = 'First Term') => {
        return apiRequest(`results/view.php?student_id=${studentId}&term=${encodeURIComponent(term)}`);
    },

    getChildFeeBalance: async (studentId: string) => {
        return apiRequest(`fees/get_balance.php?student_id=${studentId}`);
    }
};

// ========================================
// SCHOOL/GLOBAL API
// ========================================
export const SchoolAPI = {
    getAcademicSettings: async () => {
        return apiRequest('school/settings.php');
    }
};

// ========================================
// MESSAGING API
// ========================================
export const MessagingAPI = {
    getMessages: async (role: string) => {
        return apiRequest(`messages/list.php?role=${encodeURIComponent(role)}`);
    },

    sendMessage: async (messageData: any) => {
        return apiRequest('messages/send.php', {
            method: 'POST',
            body: JSON.stringify(messageData),
        });
    },

    getAnnouncements: async (role: string) => {
        return apiRequest(`announcements/list.php?role=${encodeURIComponent(role)}`);
    },

    createAnnouncement: async (announcementData: any) => {
        return apiRequest('announcements/create.php', {
            method: 'POST',
            body: JSON.stringify(announcementData),
        });
    }
};

// ========================================
// ADMIN API
// ========================================
export const AdminAPI = {
    getStats: async () => {
        return apiRequest('admin/stats.php');
    },

    getStaffStats: async () => {
        return apiRequest('admin/staff_stats.php');
    },

    getAttendanceStats: async () => {
        return apiRequest('admin/attendance_stats.php');
    },

    getFinancialSummary: async () => {
        return apiRequest('admin/financial_summary.php');
    },

    getPendingLessonNotes: async () => {
        return apiRequest('lesson-notes/list.php?status=pending');
    },

    approveLessonNote: async (id: string) => {
        return apiRequest('lesson-notes/update_status.php', {
            method: 'POST',
            body: JSON.stringify({ id, status: 'approved' }),
        });
    },

    rejectLessonNote: async (id: string) => {
        return apiRequest('lesson-notes/update_status.php', {
            method: 'POST',
            body: JSON.stringify({ id, status: 'rejected' }),
        });
    }
};

// ========================================
// BURSAR API
// ========================================
export const BursarAPI = {
    getFinancialStats: async () => {
        return apiRequest('bursar/stats.php');
    },

    getTransactions: async (limit: number = 10) => {
        return apiRequest(`bursar/transactions.php?limit=${limit}`);
    },

    logPettyCash: async (data: { amount: string; description: string }) => {
        return apiRequest('bursar/log_petty_cash.php', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
};

// ========================================
// EXPORT DEFAULT API OBJECT
// ========================================
const API = {
    Auth: AuthAPI,
    Student: StudentAPI,
    Teacher: TeacherAPI,
    Parent: ParentAPI,
    Admin: AdminAPI,
    Bursar: BursarAPI,
    Token: TokenService,
    // Helper to check if we're connected
    testConnection: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/test_db.php`);
            return response.ok;
        } catch {
            return false;
        }
    }
};

export default API;
