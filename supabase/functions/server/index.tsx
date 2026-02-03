import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase client
const getSupabaseClient = (authToken?: string) => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = authToken 
    ? Deno.env.get('SUPABASE_ANON_KEY')! 
    : Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  
  return createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    },
  });
};

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// ============================================
// MIDDLEWARE
// ============================================

// Auth middleware
const requireAuth = async (c: any, next: any) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader) {
    return c.json({ error: 'Unauthorized - No authorization header' }, 401);
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return c.json({ error: 'Unauthorized - Invalid token format' }, 401);
  }

  try {
    const supabase = getSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return c.json({ error: 'Unauthorized - Invalid token' }, 401);
    }

    // Fetch user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    c.set('user', user);
    c.set('profile', profile);
    await next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return c.json({ error: 'Unauthorized - Auth check failed' }, 401);
  }
};

// Role-based access control
const requireRole = (roles: string[]) => {
  return async (c: any, next: any) => {
    const profile = c.get('profile');
    if (!profile || !roles.includes(profile.role)) {
      return c.json({ error: 'Forbidden - Insufficient permissions' }, 403);
    }
    await next();
  };
};

// ============================================
// HEALTH & INFO
// ============================================

app.get("/make-server-3e7af804/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/make-server-3e7af804/info", (c) => {
  return c.json({
    name: "BFOIA School Management System API",
    version: "1.0.0",
    description: "Backend API for Bishop Felix Owolabi International Academy"
  });
});

// ============================================
// AUTHENTICATION
// ============================================

app.post("/make-server-3e7af804/auth/login", async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error);
      return c.json({ error: error.message }, 400);
    }

    // Fetch user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    return c.json({
      user: data.user,
      session: data.session,
      profile: profile,
    });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ error: 'Login failed' }, 500);
  }
});

app.post("/make-server-3e7af804/auth/logout", requireAuth, async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const token = authHeader?.split(' ')[1];
    
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();

    return c.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return c.json({ error: 'Logout failed' }, 500);
  }
});

app.get("/make-server-3e7af804/auth/session", requireAuth, async (c) => {
  const user = c.get('user');
  const profile = c.get('profile');
  return c.json({ user, profile });
});

// ============================================
// PROFILES
// ============================================

app.get("/make-server-3e7af804/profiles/me", requireAuth, async (c) => {
  const profile = c.get('profile');
  return c.json({ profile });
});

app.put("/make-server-3e7af804/profiles/me", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const updates = await c.req.json();

    // Prevent role changes via this endpoint
    delete updates.role;
    delete updates.id;

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;

    return c.json({ profile: data });
  } catch (error) {
    console.error('Profile update error:', error);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});

// ============================================
// STUDENTS
// ============================================

app.get("/make-server-3e7af804/students", requireAuth, requireRole(['teacher', 'principal', 'hr', 'proprietor']), async (c) => {
  try {
    const classId = c.req.query('class_id');
    const academicSession = c.req.query('academic_session') || '2024/2025';

    const supabase = getSupabaseClient();
    let query = supabase
      .from('profiles')
      .select(`
        *,
        enrollments!inner(
          id,
          class_id,
          academic_session,
          status,
          classes(id, name, level)
        )
      `)
      .eq('role', 'student')
      .eq('enrollments.academic_session', academicSession);

    if (classId) {
      query = query.eq('enrollments.class_id', classId);
    }

    const { data, error } = await query;
    if (error) throw error;

    return c.json({ students: data });
  } catch (error) {
    console.error('Fetch students error:', error);
    return c.json({ error: 'Failed to fetch students' }, 500);
  }
});

app.get("/make-server-3e7af804/students/:id", requireAuth, async (c) => {
  try {
    const studentId = c.req.param('id');
    const profile = c.get('profile');

    // Check permissions
    if (profile.role === 'student' && profile.id !== studentId) {
      return c.json({ error: 'Forbidden' }, 403);
    }

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        enrollments(
          id,
          class_id,
          academic_session,
          status,
          classes(id, name, level, class_teacher_id)
        )
      `)
      .eq('id', studentId)
      .eq('role', 'student')
      .single();

    if (error) throw error;

    return c.json({ student: data });
  } catch (error) {
    console.error('Fetch student error:', error);
    return c.json({ error: 'Failed to fetch student' }, 500);
  }
});

// ============================================
// PARENT-STUDENT RELATIONSHIPS
// ============================================

app.get("/make-server-3e7af804/parents/:parentId/children", requireAuth, async (c) => {
  try {
    const parentId = c.req.param('parentId');
    const profile = c.get('profile');

    // Check permissions
    if (profile.role === 'parent' && profile.id !== parentId) {
      return c.json({ error: 'Forbidden' }, 403);
    }

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('parent_students')
      .select(`
        *,
        student:profiles!parent_students_student_id_fkey(
          *,
          enrollments(
            id,
            class_id,
            academic_session,
            status,
            classes(id, name, level)
          )
        )
      `)
      .eq('parent_id', parentId);

    if (error) throw error;

    return c.json({ children: data });
  } catch (error) {
    console.error('Fetch children error:', error);
    return c.json({ error: 'Failed to fetch children' }, 500);
  }
});

// ============================================
// FEES & PAYMENTS
// ============================================

app.get("/make-server-3e7af804/fees/student/:studentId", requireAuth, async (c) => {
  try {
    const studentId = c.req.param('studentId');
    const academicSession = c.req.query('academic_session') || '2024/2025';
    const profile = c.get('profile');

    // Check permissions
    if (profile.role === 'student' && profile.id !== studentId) {
      return c.json({ error: 'Forbidden' }, 403);
    }

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('student_fees')
      .select(`
        *,
        fee_structures(*)
      `)
      .eq('student_id', studentId)
      .eq('academic_session', academicSession)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return c.json({ fees: data });
  } catch (error) {
    console.error('Fetch fees error:', error);
    return c.json({ error: 'Failed to fetch fees' }, 500);
  }
});

app.get("/make-server-3e7af804/payments/student/:studentId", requireAuth, async (c) => {
  try {
    const studentId = c.req.param('studentId');
    const profile = c.get('profile');

    // Check permissions
    if (profile.role === 'student' && profile.id !== studentId) {
      return c.json({ error: 'Forbidden' }, 403);
    }

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        student_fees(
          *,
          fee_structures(*)
        )
      `)
      .eq('student_id', studentId)
      .order('payment_date', { ascending: false });

    if (error) throw error;

    return c.json({ payments: data });
  } catch (error) {
    console.error('Fetch payments error:', error);
    return c.json({ error: 'Failed to fetch payments' }, 500);
  }
});

app.post("/make-server-3e7af804/payments", requireAuth, requireRole(['bursar', 'proprietor']), async (c) => {
  try {
    const payment = await c.req.json();
    const profile = c.get('profile');

    const supabase = getSupabaseClient();
    
    // Create payment
    const { data: newPayment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        ...payment,
        verified_by: profile.id,
        verification_status: 'verified',
        verification_date: new Date().toISOString(),
      })
      .select()
      .single();

    if (paymentError) throw paymentError;

    // Update student fee balance
    const { data: studentFee } = await supabase
      .from('student_fees')
      .select('amount_paid, balance, total_amount')
      .eq('id', payment.student_fee_id)
      .single();

    if (studentFee) {
      const newAmountPaid = Number(studentFee.amount_paid) + Number(payment.amount);
      const newBalance = Number(studentFee.total_amount) - newAmountPaid;
      const paymentStatus = newBalance <= 0 ? 'paid' : newBalance < studentFee.total_amount ? 'partial' : 'pending';

      await supabase
        .from('student_fees')
        .update({
          amount_paid: newAmountPaid,
          balance: newBalance,
          payment_status: paymentStatus,
        })
        .eq('id', payment.student_fee_id);
    }

    return c.json({ payment: newPayment }, 201);
  } catch (error) {
    console.error('Create payment error:', error);
    return c.json({ error: 'Failed to create payment' }, 500);
  }
});

app.patch("/make-server-3e7af804/payments/:id/verify", requireAuth, requireRole(['bursar', 'proprietor']), async (c) => {
  try {
    const paymentId = c.req.param('id');
    const { status } = await c.req.json();
    const profile = c.get('profile');

    if (!['verified', 'rejected'].includes(status)) {
      return c.json({ error: 'Invalid status' }, 400);
    }

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('payments')
      .update({
        verification_status: status,
        verified_by: profile.id,
        verification_date: new Date().toISOString(),
      })
      .eq('id', paymentId)
      .select()
      .single();

    if (error) throw error;

    return c.json({ payment: data });
  } catch (error) {
    console.error('Verify payment error:', error);
    return c.json({ error: 'Failed to verify payment' }, 500);
  }
});

// ============================================
// ATTENDANCE
// ============================================

app.get("/make-server-3e7af804/attendance/student/:studentId", requireAuth, async (c) => {
  try {
    const studentId = c.req.param('studentId');
    const startDate = c.req.query('start_date');
    const endDate = c.req.query('end_date');
    const profile = c.get('profile');

    // Check permissions
    if (profile.role === 'student' && profile.id !== studentId) {
      return c.json({ error: 'Forbidden' }, 403);
    }

    const supabase = getSupabaseClient();
    let query = supabase
      .from('student_attendance')
      .select('*')
      .eq('student_id', studentId);

    if (startDate) query = query.gte('date', startDate);
    if (endDate) query = query.lte('date', endDate);

    const { data, error } = await query.order('date', { ascending: false });
    if (error) throw error;

    return c.json({ attendance: data });
  } catch (error) {
    console.error('Fetch attendance error:', error);
    return c.json({ error: 'Failed to fetch attendance' }, 500);
  }
});

app.post("/make-server-3e7af804/attendance/student", requireAuth, requireRole(['teacher', 'principal']), async (c) => {
  try {
    const attendanceRecords = await c.req.json();
    const profile = c.get('profile');

    const supabase = getSupabaseClient();
    
    // Add marked_by to each record
    const records = Array.isArray(attendanceRecords) ? attendanceRecords : [attendanceRecords];
    const recordsWithMarker = records.map(record => ({
      ...record,
      marked_by: profile.id,
    }));

    const { data, error } = await supabase
      .from('student_attendance')
      .upsert(recordsWithMarker, { onConflict: 'student_id,date' })
      .select();

    if (error) throw error;

    return c.json({ attendance: data }, 201);
  } catch (error) {
    console.error('Mark attendance error:', error);
    return c.json({ error: 'Failed to mark attendance' }, 500);
  }
});

app.get("/make-server-3e7af804/attendance/class/:classId", requireAuth, requireRole(['teacher', 'principal']), async (c) => {
  try {
    const classId = c.req.param('classId');
    const date = c.req.query('date') || new Date().toISOString().split('T')[0];

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('student_attendance')
      .select(`
        *,
        student:profiles!student_attendance_student_id_fkey(id, full_name, student_id)
      `)
      .eq('class_id', classId)
      .eq('date', date);

    if (error) throw error;

    return c.json({ attendance: data });
  } catch (error) {
    console.error('Fetch class attendance error:', error);
    return c.json({ error: 'Failed to fetch class attendance' }, 500);
  }
});

// ============================================
// RESULTS & ASSESSMENTS
// ============================================

app.get("/make-server-3e7af804/results/student/:studentId", requireAuth, async (c) => {
  try {
    const studentId = c.req.param('studentId');
    const academicSession = c.req.query('academic_session') || '2024/2025';
    const term = c.req.query('term');
    const profile = c.get('profile');

    // Check permissions
    if (profile.role === 'student' && profile.id !== studentId) {
      return c.json({ error: 'Forbidden' }, 403);
    }

    const supabase = getSupabaseClient();
    let query = supabase
      .from('results')
      .select(`
        *,
        subject:subjects(id, name, code)
      `)
      .eq('student_id', studentId)
      .eq('academic_session', academicSession)
      .eq('published', true);

    if (term) {
      query = query.eq('term', term);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;

    return c.json({ results: data });
  } catch (error) {
    console.error('Fetch results error:', error);
    return c.json({ error: 'Failed to fetch results' }, 500);
  }
});

app.get("/make-server-3e7af804/assessments/class/:classId", requireAuth, requireRole(['teacher', 'principal']), async (c) => {
  try {
    const classId = c.req.param('classId');
    const academicSession = c.req.query('academic_session') || '2024/2025';
    const term = c.req.query('term');

    const supabase = getSupabaseClient();
    let query = supabase
      .from('assessments')
      .select(`
        *,
        subject:subjects(id, name, code),
        teacher:profiles!assessments_teacher_id_fkey(id, full_name)
      `)
      .eq('class_id', classId)
      .eq('academic_session', academicSession);

    if (term) {
      query = query.eq('term', term);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;

    return c.json({ assessments: data });
  } catch (error) {
    console.error('Fetch assessments error:', error);
    return c.json({ error: 'Failed to fetch assessments' }, 500);
  }
});

app.post("/make-server-3e7af804/assessments", requireAuth, requireRole(['teacher', 'principal']), async (c) => {
  try {
    const assessment = await c.req.json();
    const profile = c.get('profile');

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('assessments')
      .insert({
        ...assessment,
        teacher_id: profile.id,
      })
      .select()
      .single();

    if (error) throw error;

    return c.json({ assessment: data }, 201);
  } catch (error) {
    console.error('Create assessment error:', error);
    return c.json({ error: 'Failed to create assessment' }, 500);
  }
});

app.get("/make-server-3e7af804/scores/assessment/:assessmentId", requireAuth, requireRole(['teacher', 'principal']), async (c) => {
  try {
    const assessmentId = c.req.param('assessmentId');

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('student_scores')
      .select(`
        *,
        student:profiles!student_scores_student_id_fkey(id, full_name, student_id)
      `)
      .eq('assessment_id', assessmentId)
      .order('score', { ascending: false });

    if (error) throw error;

    return c.json({ scores: data });
  } catch (error) {
    console.error('Fetch scores error:', error);
    return c.json({ error: 'Failed to fetch scores' }, 500);
  }
});

app.post("/make-server-3e7af804/scores", requireAuth, requireRole(['teacher', 'principal']), async (c) => {
  try {
    const scores = await c.req.json();

    const supabase = getSupabaseClient();
    const scoreRecords = Array.isArray(scores) ? scores : [scores];
    
    const { data, error } = await supabase
      .from('student_scores')
      .upsert(scoreRecords, { onConflict: 'assessment_id,student_id' })
      .select();

    if (error) throw error;

    return c.json({ scores: data }, 201);
  } catch (error) {
    console.error('Save scores error:', error);
    return c.json({ error: 'Failed to save scores' }, 500);
  }
});

// ============================================
// ASSIGNMENTS
// ============================================

app.get("/make-server-3e7af804/assignments/class/:classId", requireAuth, async (c) => {
  try {
    const classId = c.req.param('classId');
    const academicSession = c.req.query('academic_session') || '2024/2025';

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('assignments')
      .select(`
        *,
        subject:subjects(id, name, code),
        teacher:profiles!assignments_teacher_id_fkey(id, full_name)
      `)
      .eq('class_id', classId)
      .eq('academic_session', academicSession)
      .order('due_date', { ascending: false });

    if (error) throw error;

    return c.json({ assignments: data });
  } catch (error) {
    console.error('Fetch assignments error:', error);
    return c.json({ error: 'Failed to fetch assignments' }, 500);
  }
});

app.post("/make-server-3e7af804/assignments", requireAuth, requireRole(['teacher', 'principal']), async (c) => {
  try {
    const assignment = await c.req.json();
    const profile = c.get('profile');

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('assignments')
      .insert({
        ...assignment,
        teacher_id: profile.id,
      })
      .select()
      .single();

    if (error) throw error;

    return c.json({ assignment: data }, 201);
  } catch (error) {
    console.error('Create assignment error:', error);
    return c.json({ error: 'Failed to create assignment' }, 500);
  }
});

app.get("/make-server-3e7af804/assignments/:assignmentId/submissions", requireAuth, requireRole(['teacher', 'principal']), async (c) => {
  try {
    const assignmentId = c.req.param('assignmentId');

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('assignment_submissions')
      .select(`
        *,
        student:profiles!assignment_submissions_student_id_fkey(id, full_name, student_id)
      `)
      .eq('assignment_id', assignmentId)
      .order('submitted_at', { ascending: false });

    if (error) throw error;

    return c.json({ submissions: data });
  } catch (error) {
    console.error('Fetch submissions error:', error);
    return c.json({ error: 'Failed to fetch submissions' }, 500);
  }
});

app.post("/make-server-3e7af804/assignments/:assignmentId/submit", requireAuth, requireRole(['student']), async (c) => {
  try {
    const assignmentId = c.req.param('assignmentId');
    const submission = await c.req.json();
    const profile = c.get('profile');

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('assignment_submissions')
      .upsert({
        assignment_id: assignmentId,
        student_id: profile.id,
        ...submission,
        status: 'submitted',
      }, { onConflict: 'assignment_id,student_id' })
      .select()
      .single();

    if (error) throw error;

    return c.json({ submission: data }, 201);
  } catch (error) {
    console.error('Submit assignment error:', error);
    return c.json({ error: 'Failed to submit assignment' }, 500);
  }
});

// ============================================
// ANNOUNCEMENTS
// ============================================

app.get("/make-server-3e7af804/announcements", requireAuth, async (c) => {
  try {
    const profile = c.get('profile');
    const limit = parseInt(c.req.query('limit') || '20');

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('announcements')
      .select(`
        *,
        creator:profiles!announcements_created_by_fkey(id, full_name, role)
      `)
      .eq('published', true)
      .or(`target_role.cs.{${profile.role}},target_role.is.null`)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return c.json({ announcements: data });
  } catch (error) {
    console.error('Fetch announcements error:', error);
    return c.json({ error: 'Failed to fetch announcements' }, 500);
  }
});

app.post("/make-server-3e7af804/announcements", requireAuth, requireRole(['teacher', 'principal', 'proprietor', 'bursar', 'hr']), async (c) => {
  try {
    const announcement = await c.req.json();
    const profile = c.get('profile');

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('announcements')
      .insert({
        ...announcement,
        created_by: profile.id,
        published_at: announcement.published ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (error) throw error;

    return c.json({ announcement: data }, 201);
  } catch (error) {
    console.error('Create announcement error:', error);
    return c.json({ error: 'Failed to create announcement' }, 500);
  }
});

// ============================================
// MESSAGES
// ============================================

app.get("/make-server-3e7af804/messages", requireAuth, async (c) => {
  try {
    const profile = c.get('profile');
    const type = c.req.query('type') || 'inbox'; // inbox or sent

    const field = type === 'inbox' ? 'recipient_id' : 'sender_id';
    
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(id, full_name, role),
        recipient:profiles!messages_recipient_id_fkey(id, full_name, role)
      `)
      .eq(field, profile.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return c.json({ messages: data });
  } catch (error) {
    console.error('Fetch messages error:', error);
    return c.json({ error: 'Failed to fetch messages' }, 500);
  }
});

app.post("/make-server-3e7af804/messages", requireAuth, async (c) => {
  try {
    const message = await c.req.json();
    const profile = c.get('profile');

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('messages')
      .insert({
        ...message,
        sender_id: profile.id,
      })
      .select()
      .single();

    if (error) throw error;

    return c.json({ message: data }, 201);
  } catch (error) {
    console.error('Send message error:', error);
    return c.json({ error: 'Failed to send message' }, 500);
  }
});

app.patch("/make-server-3e7af804/messages/:id/read", requireAuth, async (c) => {
  try {
    const messageId = c.req.param('id');
    const profile = c.get('profile');

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('messages')
      .update({
        read: true,
        read_at: new Date().toISOString(),
      })
      .eq('id', messageId)
      .eq('recipient_id', profile.id)
      .select()
      .single();

    if (error) throw error;

    return c.json({ message: data });
  } catch (error) {
    console.error('Mark message as read error:', error);
    return c.json({ error: 'Failed to mark message as read' }, 500);
  }
});

// ============================================
// CLASSES & SUBJECTS
// ============================================

app.get("/make-server-3e7af804/classes", requireAuth, async (c) => {
  try {
    const academicSession = c.req.query('academic_session') || '2024/2025';

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('classes')
      .select(`
        *,
        class_teacher:profiles(id, full_name)
      `)
      .eq('academic_session', academicSession)
      .order('name');

    if (error) throw error;

    return c.json({ classes: data });
  } catch (error) {
    console.error('Fetch classes error:', error);
    return c.json({ error: 'Failed to fetch classes' }, 500);
  }
});

app.get("/make-server-3e7af804/subjects", requireAuth, async (c) => {
  try {
    const level = c.req.query('level');

    const supabase = getSupabaseClient();
    let query = supabase
      .from('subjects')
      .select('*')
      .order('name');

    if (level) {
      query = query.eq('level', level);
    }

    const { data, error } = await query;
    if (error) throw error;

    return c.json({ subjects: data });
  } catch (error) {
    console.error('Fetch subjects error:', error);
    return c.json({ error: 'Failed to fetch subjects' }, 500);
  }
});

// ============================================
// STAFF & HR
// ============================================

app.get("/make-server-3e7af804/staff", requireAuth, requireRole(['hr', 'principal', 'proprietor']), async (c) => {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('staff')
      .select(`
        *,
        profile:profiles(*)
      `)
      .order('profile(full_name)');

    if (error) throw error;

    return c.json({ staff: data });
  } catch (error) {
    console.error('Fetch staff error:', error);
    return c.json({ error: 'Failed to fetch staff' }, 500);
  }
});

app.get("/make-server-3e7af804/staff/:id", requireAuth, requireRole(['hr', 'principal', 'proprietor']), async (c) => {
  try {
    const staffId = c.req.param('id');

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('staff')
      .select(`
        *,
        profile:profiles(*)
      `)
      .eq('id', staffId)
      .single();

    if (error) throw error;

    return c.json({ staff: data });
  } catch (error) {
    console.error('Fetch staff member error:', error);
    return c.json({ error: 'Failed to fetch staff member' }, 500);
  }
});

app.get("/make-server-3e7af804/leave-requests", requireAuth, async (c) => {
  try {
    const profile = c.get('profile');
    const status = c.req.query('status');

    const supabase = getSupabaseClient();
    let query = supabase
      .from('leave_requests')
      .select(`
        *,
        staff:staff!leave_requests_staff_id_fkey(
          id,
          profile:profiles(id, full_name)
        ),
        reviewer:profiles!leave_requests_reviewed_by_fkey(id, full_name)
      `);

    // Filter based on role
    if (profile.role !== 'hr' && profile.role !== 'principal' && profile.role !== 'proprietor') {
      query = query.eq('staff_id', profile.id);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;

    return c.json({ leaveRequests: data });
  } catch (error) {
    console.error('Fetch leave requests error:', error);
    return c.json({ error: 'Failed to fetch leave requests' }, 500);
  }
});

app.post("/make-server-3e7af804/leave-requests", requireAuth, requireRole(['teacher', 'hr', 'bursar', 'principal']), async (c) => {
  try {
    const leaveRequest = await c.req.json();
    const profile = c.get('profile');

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('leave_requests')
      .insert({
        ...leaveRequest,
        staff_id: profile.id,
      })
      .select()
      .single();

    if (error) throw error;

    return c.json({ leaveRequest: data }, 201);
  } catch (error) {
    console.error('Create leave request error:', error);
    return c.json({ error: 'Failed to create leave request' }, 500);
  }
});

app.patch("/make-server-3e7af804/leave-requests/:id", requireAuth, requireRole(['hr', 'principal', 'proprietor']), async (c) => {
  try {
    const requestId = c.req.param('id');
    const { status } = await c.req.json();
    const profile = c.get('profile');

    if (!['approved', 'rejected'].includes(status)) {
      return c.json({ error: 'Invalid status' }, 400);
    }

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('leave_requests')
      .update({
        status,
        reviewed_by: profile.id,
        reviewed_date: new Date().toISOString(),
      })
      .eq('id', requestId)
      .select()
      .single();

    if (error) throw error;

    return c.json({ leaveRequest: data });
  } catch (error) {
    console.error('Update leave request error:', error);
    return c.json({ error: 'Failed to update leave request' }, 500);
  }
});

// ============================================
// PAYROLL
// ============================================

app.get("/make-server-3e7af804/payroll", requireAuth, requireRole(['hr', 'bursar', 'proprietor']), async (c) => {
  try {
    const month = c.req.query('month');
    const year = c.req.query('year');

    const supabase = getSupabaseClient();
    let query = supabase
      .from('payroll')
      .select(`
        *,
        staff:staff!payroll_staff_id_fkey(
          id,
          profile:profiles(id, full_name, staff_id)
        ),
        approver:profiles!payroll_approved_by_fkey(id, full_name)
      `);

    if (month) query = query.eq('month', month);
    if (year) query = query.eq('year', parseInt(year));

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;

    return c.json({ payroll: data });
  } catch (error) {
    console.error('Fetch payroll error:', error);
    return c.json({ error: 'Failed to fetch payroll' }, 500);
  }
});

app.post("/make-server-3e7af804/payroll", requireAuth, requireRole(['hr', 'bursar']), async (c) => {
  try {
    const payrollRecords = await c.req.json();

    const supabase = getSupabaseClient();
    const records = Array.isArray(payrollRecords) ? payrollRecords : [payrollRecords];
    
    const { data, error } = await supabase
      .from('payroll')
      .upsert(records, { onConflict: 'staff_id,month,year' })
      .select();

    if (error) throw error;

    return c.json({ payroll: data }, 201);
  } catch (error) {
    console.error('Create payroll error:', error);
    return c.json({ error: 'Failed to create payroll' }, 500);
  }
});

app.patch("/make-server-3e7af804/payroll/:id/approve", requireAuth, requireRole(['bursar', 'proprietor']), async (c) => {
  try {
    const payrollId = c.req.param('id');
    const profile = c.get('profile');

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('payroll')
      .update({
        payment_status: 'approved',
        approved_by: profile.id,
        approved_date: new Date().toISOString(),
      })
      .eq('id', payrollId)
      .select()
      .single();

    if (error) throw error;

    return c.json({ payroll: data });
  } catch (error) {
    console.error('Approve payroll error:', error);
    return c.json({ error: 'Failed to approve payroll' }, 500);
  }
});

// ============================================
// EXPENDITURE & VOUCHERS
// ============================================

app.get("/make-server-3e7af804/payment-vouchers", requireAuth, requireRole(['bursar', 'proprietor']), async (c) => {
  try {
    const status = c.req.query('status');

    const supabase = getSupabaseClient();
    let query = supabase
      .from('payment_vouchers')
      .select(`
        *,
        category:expenditure_categories(id, name),
        creator:profiles!payment_vouchers_created_by_fkey(id, full_name),
        approver:profiles!payment_vouchers_approved_by_fkey(id, full_name)
      `);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query.order('date_created', { ascending: false });
    if (error) throw error;

    return c.json({ vouchers: data });
  } catch (error) {
    console.error('Fetch vouchers error:', error);
    return c.json({ error: 'Failed to fetch vouchers' }, 500);
  }
});

app.post("/make-server-3e7af804/payment-vouchers", requireAuth, requireRole(['bursar', 'proprietor']), async (c) => {
  try {
    const voucher = await c.req.json();
    const profile = c.get('profile');

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('payment_vouchers')
      .insert({
        ...voucher,
        created_by: profile.id,
      })
      .select()
      .single();

    if (error) throw error;

    return c.json({ voucher: data }, 201);
  } catch (error) {
    console.error('Create voucher error:', error);
    return c.json({ error: 'Failed to create voucher' }, 500);
  }
});

app.patch("/make-server-3e7af804/payment-vouchers/:id", requireAuth, requireRole(['bursar', 'proprietor']), async (c) => {
  try {
    const voucherId = c.req.param('id');
    const updates = await c.req.json();
    const profile = c.get('profile');

    if (updates.status === 'approved') {
      updates.approved_by = profile.id;
    }

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('payment_vouchers')
      .update(updates)
      .eq('id', voucherId)
      .select()
      .single();

    if (error) throw error;

    return c.json({ voucher: data });
  } catch (error) {
    console.error('Update voucher error:', error);
    return c.json({ error: 'Failed to update voucher' }, 500);
  }
});

app.get("/make-server-3e7af804/expenditure-categories", requireAuth, requireRole(['bursar', 'proprietor']), async (c) => {
  try {
    const academicSession = c.req.query('academic_session') || '2024/2025';

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('expenditure_categories')
      .select('*')
      .eq('academic_session', academicSession)
      .order('name');

    if (error) throw error;

    return c.json({ categories: data });
  } catch (error) {
    console.error('Fetch categories error:', error);
    return c.json({ error: 'Failed to fetch categories' }, 500);
  }
});

// ============================================
// AUDIT LOGS
// ============================================

app.get("/make-server-3e7af804/audit-logs", requireAuth, requireRole(['proprietor', 'principal']), async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '100');
    const entityType = c.req.query('entity_type');

    const supabase = getSupabaseClient();
    let query = supabase
      .from('audit_logs')
      .select(`
        *,
        user:profiles(id, full_name, role)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (entityType) {
      query = query.eq('entity_type', entityType);
    }

    const { data, error } = await query;
    if (error) throw error;

    return c.json({ logs: data });
  } catch (error) {
    console.error('Fetch audit logs error:', error);
    return c.json({ error: 'Failed to fetch audit logs' }, 500);
  }
});

// ============================================
// ANALYTICS & REPORTS
// ============================================

app.get("/make-server-3e7af804/analytics/financial", requireAuth, requireRole(['bursar', 'proprietor']), async (c) => {
  try {
    const academicSession = c.req.query('academic_session') || '2024/2025';
    const term = c.req.query('term');

    const supabase = getSupabaseClient();

    // Get total fees expected
    let feesQuery = supabase
      .from('student_fees')
      .select('total_amount, amount_paid, balance, payment_status')
      .eq('academic_session', academicSession);

    if (term) feesQuery = feesQuery.eq('term', term);

    const { data: fees } = await feesQuery;

    // Get total payments
    const { data: payments } = await supabase
      .from('payments')
      .select('amount, payment_date, verification_status')
      .gte('payment_date', `${academicSession.split('/')[0]}-01-01`);

    // Get total expenditure
    const { data: vouchers } = await supabase
      .from('payment_vouchers')
      .select('amount, status, date_created')
      .gte('date_created', `${academicSession.split('/')[0]}-01-01`);

    const analytics = {
      totalFeesExpected: fees?.reduce((sum, f) => sum + Number(f.total_amount), 0) || 0,
      totalFeesPaid: fees?.reduce((sum, f) => sum + Number(f.amount_paid), 0) || 0,
      totalBalance: fees?.reduce((sum, f) => sum + Number(f.balance), 0) || 0,
      totalPayments: payments?.filter(p => p.verification_status === 'verified').reduce((sum, p) => sum + Number(p.amount), 0) || 0,
      totalExpenditure: vouchers?.filter(v => v.status === 'paid').reduce((sum, v) => sum + Number(v.amount), 0) || 0,
      paymentStatusBreakdown: {
        pending: fees?.filter(f => f.payment_status === 'pending').length || 0,
        partial: fees?.filter(f => f.payment_status === 'partial').length || 0,
        paid: fees?.filter(f => f.payment_status === 'paid').length || 0,
        overdue: fees?.filter(f => f.payment_status === 'overdue').length || 0,
      },
    };

    return c.json({ analytics });
  } catch (error) {
    console.error('Fetch financial analytics error:', error);
    return c.json({ error: 'Failed to fetch financial analytics' }, 500);
  }
});

app.get("/make-server-3e7af804/analytics/academic", requireAuth, requireRole(['principal', 'proprietor']), async (c) => {
  try {
    const academicSession = c.req.query('academic_session') || '2024/2025';
    const term = c.req.query('term');

    const supabase = getSupabaseClient();

    // Get enrollment stats
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('status')
      .eq('academic_session', academicSession);

    // Get attendance stats
    const { data: attendance } = await supabase
      .from('student_attendance')
      .select('status')
      .gte('date', `${academicSession.split('/')[0]}-09-01`);

    // Get results stats
    let resultsQuery = supabase
      .from('results')
      .select('total_score, grade')
      .eq('academic_session', academicSession)
      .eq('published', true);

    if (term) resultsQuery = resultsQuery.eq('term', term);

    const { data: results } = await resultsQuery;

    const analytics = {
      totalEnrollments: enrollments?.length || 0,
      activeStudents: enrollments?.filter(e => e.status === 'active').length || 0,
      attendanceRate: attendance?.length ? 
        (attendance.filter(a => a.status === 'present').length / attendance.length * 100).toFixed(2) : 0,
      averageScore: results?.length ?
        (results.reduce((sum, r) => sum + Number(r.total_score), 0) / results.length).toFixed(2) : 0,
      gradeDistribution: {
        A: results?.filter(r => r.grade === 'A').length || 0,
        B: results?.filter(r => r.grade === 'B').length || 0,
        C: results?.filter(r => r.grade === 'C').length || 0,
        D: results?.filter(r => r.grade === 'D').length || 0,
        F: results?.filter(r => r.grade === 'F').length || 0,
      },
    };

    return c.json({ analytics });
  } catch (error) {
    console.error('Fetch academic analytics error:', error);
    return c.json({ error: 'Failed to fetch academic analytics' }, 500);
  }
});

// ============================================
// FILE UPLOAD (Signed URLs)
// ============================================

app.post("/make-server-3e7af804/upload/sign", requireAuth, async (c) => {
  try {
    const { fileName, fileType, bucket = 'make-3e7af804-uploads' } = await c.req.json();

    if (!fileName || !fileType) {
      return c.json({ error: 'fileName and fileType are required' }, 400);
    }

    const supabase = getSupabaseClient();
    
    // Ensure bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(b => b.name === bucket);
    
    if (!bucketExists) {
      await supabase.storage.createBucket(bucket, { public: false });
    }

    // Generate unique file name
    const profile = c.get('profile');
    const timestamp = Date.now();
    const uniqueFileName = `${profile.id}/${timestamp}-${fileName}`;

    // Create signed upload URL
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from(bucket)
      .createSignedUploadUrl(uniqueFileName);

    if (uploadError) throw uploadError;

    return c.json({
      uploadUrl: uploadData.signedUrl,
      fileName: uniqueFileName,
      bucket,
    });
  } catch (error) {
    console.error('Generate signed URL error:', error);
    return c.json({ error: 'Failed to generate signed URL' }, 500);
  }
});

app.post("/make-server-3e7af804/upload/url", requireAuth, async (c) => {
  try {
    const { fileName, bucket = 'make-3e7af804-uploads' } = await c.req.json();

    if (!fileName) {
      return c.json({ error: 'fileName is required' }, 400);
    }

    const supabase = getSupabaseClient();
    
    // Create signed download URL (valid for 1 hour)
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .createSignedUrl(fileName, 3600);

    if (error) throw error;

    return c.json({ url: data.signedUrl });
  } catch (error) {
    console.error('Get file URL error:', error);
    return c.json({ error: 'Failed to get file URL' }, 500);
  }
});

// ============================================
// START SERVER
// ============================================

console.log('🚀 BFOIA School Management System API Server Starting...');
Deno.serve(app.fetch);
