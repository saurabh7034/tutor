/* ==========================================
   TuitionVault — Interactive Logic Engine
   ========================================== */

const USE_SUPABASE = true;

// 1. Mock Supabase PostgreSQL Database State
const DB = {
  profiles: [
    { id: 't1', full_name: 'Amit Sharma', role: 'teacher', phone: '+91 98765 43210', avatar_url: '', created_at: '2026-01-10T08:00:00Z' },
    { id: 't2', full_name: 'Neha Verma', role: 'teacher', phone: '+91 99887 76655', avatar_url: '', created_at: '2026-02-15T09:30:00Z' },
    { id: 's1', full_name: 'Rahul Singh', role: 'student', phone: '+91 91112 22333', avatar_url: '', created_at: '2026-03-01T10:00:00Z' },
    { id: 's2', full_name: 'Sneha Gupta', role: 'student', phone: '+91 92223 33444', avatar_url: '', created_at: '2026-03-05T11:00:00Z' },
    { id: 's3', full_name: 'Aman Kumar', role: 'student', phone: '+91 93334 44555', avatar_url: '', created_at: '2026-03-10T12:00:00Z' },
    { id: 's4', full_name: 'Riya Sharma', role: 'student', phone: '+91 94445 55666', avatar_url: '', created_at: '2026-03-12T13:00:00Z' },
    { id: 'a1', full_name: 'Rajesh super', role: 'super_admin', phone: '+91 95556 66777', avatar_url: '', created_at: '2026-01-01T00:00:00Z' }
  ],
  students: [
    { id: 'st1', user_id: 's1', teacher_id: 't1', fee_structure_id: 'fs1', batch_name: 'Class 10 - Maths', enrollment_date: '2026-03-01', status: 'active' },
    { id: 'st2', user_id: 's2', teacher_id: 't1', fee_structure_id: 'fs1', batch_name: 'Class 10 - Maths', enrollment_date: '2026-03-05', status: 'active' },
    { id: 'st3', user_id: 's3', teacher_id: 't1', fee_structure_id: 'fs2', batch_name: 'Class 12 - Physics', enrollment_date: '2026-03-10', status: 'active' },
    { id: 'st4', user_id: 's4', teacher_id: 't2', fee_structure_id: 'fs3', batch_name: 'IIT JEE Prep', enrollment_date: '2026-03-12', status: 'active' }
  ],
  fee_structures: [
    { id: 'fs1', teacher_id: 't1', name: 'Monthly Tuition (Class 10)', amount: 1500.00, frequency: 'monthly', due_day: 10 },
    { id: 'fs2', teacher_id: 't1', name: 'Monthly Physics (Class 12)', amount: 2000.00, frequency: 'monthly', due_day: 15 },
    { id: 'fs3', teacher_id: 't2', name: 'IIT JEE Maths Premium', amount: 5000.00, frequency: 'monthly', due_day: 5 }
  ],
  payments: [
    { id: 'p1', student_id: 'st1', fee_structure_id: 'fs1', amount_paid: 1500.00, payment_date: '2026-05-08T10:00:00Z', method: 'upi', status: 'paid', receipt_url: 'receipt_p1.pdf', notes: 'Paid via GPay' },
    { id: 'p2', student_id: 'st2', fee_structure_id: 'fs1', amount_paid: 1500.00, payment_date: '2026-05-12T14:30:00Z', method: 'cash', status: 'paid', receipt_url: 'receipt_p2.pdf', notes: '' },
    { id: 'p3', student_id: 'st3', fee_structure_id: 'fs2', amount_paid: 1200.00, payment_date: '2026-05-16T18:00:00Z', method: 'bank_transfer', status: 'partial', receipt_url: 'receipt_p3.pdf', notes: 'Partial fees paid' }
  ],
  reminders: [
    { id: 'r1', student_id: 'st3', message: 'Dear Aman Kumar, your fee for Class 12 - Physics is pending.', channel: 'whatsapp', sent_at: '2026-05-15T09:00:00Z', status: 'sent' }
  ]
};

// SVG Icon set helper
const Icons = {
  home: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  users: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  card: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>`,
  chart: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>`,
  settings: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  bell: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`,
  plus: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>`,
  back: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" x2="5" y1="12" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`,
  download: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>`,
  chevronRight: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`,
  userPlus: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="16" x2="22" y1="11" y2="11"/></svg>`,
  eye: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
  eyeOff: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>`,
  pencil: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`,
  search: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg>`,
  mail: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`
};

// 2. Application Engine Global State
const state = {
  currentRoute: '/splash',
  currentUser: null,       // Authenticated profile object (amit_sharma initially or none)
  onboardingSlide: 0,
  
  // Navigation contextual variables
  selectedStudentId: null,
  selectedReceiptId: null,
  
  // List queries
  studentSearch: '',
  studentFilter: 'all',    // all, active, inactive
  studentSort: 'name',     // name, due_date, enrollment
  
  // Custom temporary forms states
  showPassword: false,
  notificationLogs: [
    { channel: 'sms', to: 'Aman Kumar', msg: 'Dear Aman Kumar, your fee for Class 12 is pending.', sentAt: 'Just now' }
  ],
  
  // Super Admin view filters
  adminTeachersFilter: 'all',
  
  // Explorer Active Tab
  activeExplorerTab: 'profiles'
};

// Router navigation manager
const router = {
  navigate(route) {
    state.currentRoute = route;
    console.log(`[Router] Navigating to: ${route}`);
    renderScreen();
  }
};

// 3. Row Level Security Helper Filters
// Filters mock table data according to active user session & PostgreSQL policies
const RLS = {
  profiles() {
    const user = state.currentUser;
    if (!user) return [];
    if (user.role === 'super_admin') return DB.profiles;
    // RLS: Sirf apna profile dekh sakta hai. Teachers cannot see other teachers' full profiles.
    if (user.role === 'teacher') {
      // In this system teachers can read profiles of students that belong to them
      const myStudentsUserIds = DB.students
        .filter(s => s.teacher_id === user.id)
        .map(s => s.user_id);
      return DB.profiles.filter(p => p.id === user.id || myStudentsUserIds.includes(p.id) || p.role === 'teacher');
    }
    // Students can read their own profile, and their teacher's basic profile
    if (user.role === 'student') {
      const myStudentRecord = DB.students.find(s => s.user_id === user.id);
      const teacherProfileId = myStudentRecord ? myStudentRecord.teacher_id : null;
      return DB.profiles.filter(p => p.id === user.id || p.id === teacherProfileId);
    }
    return [];
  },
  
  students() {
    const user = state.currentUser;
    if (!user) return [];
    if (user.role === 'super_admin') return DB.students;
    // Teacher: Sirf apne students dekh sakta hai
    if (user.role === 'teacher') {
      return DB.students.filter(s => s.teacher_id === user.id);
    }
    // Student: Sirf apna record dekh sakta hai
    if (user.role === 'student') {
      return DB.students.filter(s => s.user_id === user.id);
    }
    return [];
  },

  fee_structures() {
    const user = state.currentUser;
    if (!user) return [];
    if (user.role === 'super_admin') return DB.fee_structures;
    // Teacher: insert/update/delete/select own fees
    if (user.role === 'teacher') {
      return DB.fee_structures.filter(f => f.teacher_id === user.id);
    }
    // Student: read fee structure of their teacher
    if (user.role === 'student') {
      const myStudentRecord = DB.students.find(s => s.user_id === user.id);
      if (!myStudentRecord) return [];
      return DB.fee_structures.filter(f => f.teacher_id === myStudentRecord.teacher_id);
    }
    return [];
  },

  payments() {
    const user = state.currentUser;
    if (!user) return [];
    if (user.role === 'super_admin') return DB.payments;
    // Teacher: select and record payments of their students
    if (user.role === 'teacher') {
      const myStudentIds = DB.students.filter(s => s.teacher_id === user.id).map(s => s.id);
      return DB.payments.filter(p => myStudentIds.includes(p.student_id));
    }
    // Student: select their own payments
    if (user.role === 'student') {
      const myStudentRecord = DB.students.find(s => s.user_id === user.id);
      if (!myStudentRecord) return [];
      return DB.payments.filter(p => p.student_id === myStudentRecord.id);
    }
    return [];
  },

  reminders() {
    const user = state.currentUser;
    if (!user) return [];
    if (user.role === 'super_admin') return DB.reminders;
    // Teacher: View logs of reminders sent to their students
    if (user.role === 'teacher') {
      const myStudentIds = DB.students.filter(s => s.teacher_id === user.id).map(s => s.id);
      return DB.reminders.filter(r => myStudentIds.includes(r.student_id));
    }
    // Student: View reminders sent to them
    if (user.role === 'student') {
      const myStudentRecord = DB.students.find(s => s.user_id === user.id);
      if (!myStudentRecord) return [];
      return DB.reminders.filter(r => r.student_id === myStudentRecord.id);
    }
    return [];
  }
};

// Helper: Get student payment status for current month (May 2026)
function getStudentFeeStatus(studentId) {
  const student = DB.students.find(s => s.id === studentId);
  if (!student) return { status: 'pending', paid: 0, due: 0, text: 'No structure' };
  
  const fee = DB.fee_structures.find(f => f.id === student.fee_structure_id);
  if (!fee) return { status: 'pending', paid: 0, due: 0, text: 'No structure' };

  // Sum payments in May 2026
  const studentPayments = DB.payments.filter(p => p.student_id === studentId && p.payment_date.startsWith('2026-05'));
  const totalPaid = studentPayments.reduce((sum, p) => sum + p.amount_paid, 0);

  if (totalPaid >= fee.amount) {
    return { status: 'paid', paid: totalPaid, due: fee.amount, text: 'Paid' };
  } else if (totalPaid > 0) {
    return { status: 'partial', paid: totalPaid, due: fee.amount, text: 'Partial' };
  } else {
    // Check if due_day is passed (mock current date May 27th)
    if (fee.due_day < 27) {
      return { status: 'overdue', paid: 0, due: fee.amount, text: 'Overdue' };
    }
    return { status: 'pending', paid: 0, due: fee.amount, text: 'Pending' };
  }
}

// 4. UI Rendering Engine - Screen Selector
function renderScreen() {
  const container = document.getElementById('phone-screen-content');
  if (!container) return;

  // Render correct screen based on routing state
  const route = state.currentRoute;
  
  // Render clean layout inside emulator
  if (route === '/splash') {
    container.innerHTML = renderSplashScreen();
    // Simulate Splash Timer auto redirect
    setTimeout(() => {
      if (state.currentUser) {
        if (state.currentUser.role === 'teacher') router.navigate('/teacher/dashboard');
        else if (state.currentUser.role === 'student') router.navigate('/student/dashboard');
        else if (state.currentUser.role === 'super_admin') router.navigate('/admin');
      } else {
        router.navigate('/onboarding');
      }
    }, 2000);
  } 
  else if (route === '/onboarding') {
    container.innerHTML = renderOnboardingScreen();
  } 
  else if (route === '/login') {
    container.innerHTML = renderLoginScreen();
  } 
  else if (route === '/register') {
    container.innerHTML = renderRegisterScreen();
  } 
  else if (route === '/forgot-password') {
    container.innerHTML = renderForgotPasswordScreen();
  }
  
  // Teacher Console
  else if (route === '/teacher/dashboard') {
    container.innerHTML = renderTeacherDashboard();
  }
  else if (route === '/teacher/students') {
    container.innerHTML = renderStudentListScreen();
  }
  else if (route === '/teacher/students/add') {
    container.innerHTML = renderAddStudentScreen();
  }
  else if (route === '/teacher/students/profile') {
    container.innerHTML = renderStudentProfileScreen();
  }
  else if (route === '/teacher/payments/add') {
    container.innerHTML = renderRecordPaymentScreen();
  }
  else if (route === '/teacher/reminders/send') {
    container.innerHTML = renderSendReminderScreen();
  }
  else if (route === '/teacher/reports') {
    container.innerHTML = renderReportsScreen();
  }

  // Student Console
  else if (route === '/student/dashboard') {
    container.innerHTML = renderStudentDashboard();
  }
  else if (route === '/student/payments') {
    container.innerHTML = renderStudentPaymentsHistory();
  }
  
  // Common screens
  else if (route === '/settings') {
    container.innerHTML = renderSettingsScreen();
  }
  else if (route === '/receipt') {
    container.innerHTML = renderReceiptScreen();
  }
  
  // Super Admin Screen
  else if (route === '/admin') {
    container.innerHTML = renderSuperAdminScreen();
  }

  // Sync state badge in header
  updateHeaderStateBadge();
  
  // Sync the explorer table values
  syncExplorer();
}

// Update the active state indicator
function updateHeaderStateBadge() {
  const badge = document.getElementById('session-indicator');
  if (!badge) return;

  if (!state.currentUser) {
    badge.className = 'badge badge-role-student';
    badge.textContent = 'Session: Logged Out';
  } else {
    const role = state.currentUser.role;
    if (role === 'teacher') {
      badge.className = 'badge badge-role-teacher';
      badge.textContent = `Session: ${state.currentUser.full_name} (Teacher)`;
    } else if (role === 'student') {
      badge.className = 'badge badge-role-student';
      badge.textContent = `Session: ${state.currentUser.full_name} (Student)`;
    } else if (role === 'super_admin') {
      badge.className = 'badge badge-role-super';
      badge.textContent = `Session: ${state.currentUser.full_name} (Super Admin)`;
    }
  }
}

// 5. Database live tables synchronizer
function syncExplorer() {
  const tabContent = document.getElementById('db-explorer-rows');
  if (!tabContent) return;

  const currentTab = state.activeExplorerTab;
  const data = DB[currentTab] || [];
  
  // Render specific tables HTML
  let html = '';
  
  if (currentTab === 'profiles') {
    html = `
      <div class="rls-warning-card">
        <span class="rls-badge">RLS Policy Active</span>
        <span><b>profiles:</b> Users can only view/edit their own profile records. Teachers cannot view other teachers.</span>
      </div>
      <div class="db-table-wrapper">
        <table class="db-table">
          <thead>
            <tr>
              <th>ID (PK)</th>
              <th>Full Name</th>
              <th>Role</th>
              <th>Phone</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(p => `
              <tr id="db-profiles-${p.id}">
                <td><code>${p.id}</code></td>
                <td><b>${p.full_name}</b></td>
                <td><span class="badge ${p.role === 'teacher' ? 'badge-role-teacher' : (p.role === 'student' ? 'badge-role-student' : 'badge-role-super')}">${p.role}</span></td>
                <td>${p.phone}</td>
                <td><code>${p.created_at.split('T')[0]}</code></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
  else if (currentTab === 'students') {
    html = `
      <div class="rls-warning-card">
        <span class="rls-badge">RLS Policy Active</span>
        <span><b>students:</b> Teachers only see their assigned students. Students see only their own row.</span>
      </div>
      <div class="db-table-wrapper">
        <table class="db-table">
          <thead>
            <tr>
              <th>ID (PK)</th>
              <th>User ID (FK)</th>
              <th>Teacher ID (FK)</th>
              <th>Batch Name</th>
              <th>Enrollment</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(s => `
              <tr id="db-students-${s.id}">
                <td><code>${s.id}</code></td>
                <td><code>${s.user_id}</code></td>
                <td><code>${s.teacher_id}</code></td>
                <td>${s.batch_name}</td>
                <td><code>${s.enrollment_date}</code></td>
                <td><span class="badge ${s.status === 'active' ? 'badge-paid' : 'badge-cancelled'}">${s.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
  else if (currentTab === 'fee_structures') {
    html = `
      <div class="rls-warning-card">
        <span class="rls-badge">RLS Policy Active</span>
        <span><b>fee_structures:</b> Teachers can INSERT/EDIT. Students have READ-ONLY access to assigned structures.</span>
      </div>
      <div class="db-table-wrapper">
        <table class="db-table">
          <thead>
            <tr>
              <th>ID (PK)</th>
              <th>Teacher ID (FK)</th>
              <th>Name</th>
              <th>Amount (INR)</th>
              <th>Frequency</th>
              <th>Due Day</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(f => `
              <tr id="db-fee_structures-${f.id}">
                <td><code>${f.id}</code></td>
                <td><code>${f.teacher_id}</code></td>
                <td><b>${f.name}</b></td>
                <td>₹${f.amount.toFixed(2)}</td>
                <td><code style="text-transform:uppercase;">${f.frequency}</code></td>
                <td>Day ${f.due_day}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
  else if (currentTab === 'payments') {
    html = `
      <div class="rls-warning-card">
        <span class="rls-badge">RLS Policy Active</span>
        <span><b>payments:</b> Teachers manage payments for their students. Students can only select own transaction logs.</span>
      </div>
      <div class="db-table-wrapper">
        <table class="db-table">
          <thead>
            <tr>
              <th>ID (PK)</th>
              <th>Student ID (FK)</th>
              <th>Fee ID (FK)</th>
              <th>Paid Amount</th>
              <th>Payment Date</th>
              <th>Method</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(p => `
              <tr id="db-payments-${p.id}">
                <td><code>${p.id}</code></td>
                <td><code>${p.student_id}</code></td>
                <td><code>${p.fee_structure_id}</code></td>
                <td><b>₹${p.amount_paid.toFixed(2)}</b></td>
                <td><code>${p.payment_date.split('T')[0]}</code></td>
                <td><code style="text-transform:uppercase;">${p.method}</code></td>
                <td><span class="badge ${p.status === 'paid' ? 'badge-paid' : (p.status === 'partial' ? 'badge-partial' : 'badge-pending')}">${p.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
  else if (currentTab === 'reminders') {
    html = `
      <div class="rls-warning-card">
        <span class="rls-badge">RLS Policy Active</span>
        <span><b>reminders:</b> INSERT trigger allowed for teachers. Edge function dispatches SMS/WhatsApp notifications.</span>
      </div>
      <div class="db-table-wrapper">
        <table class="db-table">
          <thead>
            <tr>
              <th>ID (PK)</th>
              <th>Student ID (FK)</th>
              <th>Message Sent</th>
              <th>Channel</th>
              <th>Sent At</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(r => `
              <tr id="db-reminders-${r.id}">
                <td><code>${r.id}</code></td>
                <td><code>${r.student_id}</code></td>
                <td style="max-width:200px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${r.message}">${r.message}</td>
                <td><span class="badge" style="background-color:#EBF1FD; color:#1849A9;">${r.channel}</span></td>
                <td><code>${r.sent_at.split('T')[1].substring(0,5)}</code></td>
                <td><span class="badge ${r.status === 'sent' ? 'badge-paid' : 'badge-pending'}">${r.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  tabContent.innerHTML = html;
}

// Helper function to animate inserted DB rows
function flashDbRow(tableName, rowId) {
  // Wait brief moment for DOM to catch up
  setTimeout(() => {
    const row = document.getElementById(`db-${tableName}-${rowId}`);
    if (row) {
      row.classList.add('row-highlight');
      // Scroll to row
      row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, 100);
}

// 6. Screens HTML rendering helpers

// SCREEN 1: SPLASH SCREEN
function renderSplashScreen() {
  return `
    <div class="splash-screen">
      <div class="splash-logo-container">
        <div class="splash-logo">TV</div>
        <div class="splash-title">TuitionVault</div>
        <div class="splash-tagline">Fee management, simplified</div>
      </div>
      <div class="splash-loader">
        <div class="spinner"></div>
      </div>
    </div>
  `;
}

// SCREEN 2: ONBOARDING SCREEN
function renderOnboardingScreen() {
  const slides = [
    {
      icon: '💵',
      title: 'Collect fees without stress',
      subtitle: 'Track every payment in one place. No more maintaining manual Excel sheets or diaries.'
    },
    {
      icon: '🔔',
      title: 'Auto reminders bhejo',
      subtitle: 'SMS, email aur WhatsApp se students ko remind karo instantly with customized invoice templates.'
    },
    {
      icon: '📈',
      title: 'Reports ek click mein',
      subtitle: 'Monthly aur yearly reports instantly download karo, and analyze collection statistics.'
    }
  ];

  const currentSlide = slides[state.onboardingSlide];
  
  return `
    <div class="onboarding-screen">
      <div class="onboarding-header">
        ${state.onboardingSlide < 2 ? `<button class="btn-skip" onclick="router.navigate('/login')">Skip</button>` : ''}
      </div>
      <div class="onboarding-carousel">
        <div class="onboarding-illustration">${currentSlide.icon}</div>
        <div class="onboarding-title">${currentSlide.title}</div>
        <div class="onboarding-subtitle">${currentSlide.subtitle}</div>
      </div>
      <div class="onboarding-bottom">
        <div class="onboarding-dots">
          <div class="dot ${state.onboardingSlide === 0 ? 'active' : ''}"></div>
          <div class="dot ${state.onboardingSlide === 1 ? 'active' : ''}"></div>
          <div class="dot ${state.onboardingSlide === 2 ? 'active' : ''}"></div>
        </div>
        
        ${state.onboardingSlide < 2 ? `
          <button class="btn-full btn-primary" onclick="state.onboardingSlide++; renderScreen();">
            Next
          </button>
        ` : `
          <button class="btn-full btn-primary" onclick="router.navigate('/login')">
            Get Started
          </button>
        `}
      </div>
    </div>
  `;
}

// SCREEN 3: LOGIN SCREEN
function renderLoginScreen() {
  return `
    <div class="auth-screen">
      <div class="auth-header">
        <div class="logo-icon" style="width: 52px; height: 52px; border-radius: 12px; font-size: 26px; margin: 0 auto;">TV</div>
        <h2 class="auth-title">Welcome back</h2>
        <p class="auth-subtitle">Apna account mein login karo</p>
      </div>

      <div id="login-error" style="color: #E03E3E; font-size: 12px; margin-bottom: 12px; text-align: center; display: none;"></div>

      <div class="form-group">
        <label class="form-label">Email Address</label>
        <input type="email" id="login-email" class="form-input" placeholder="e.g. teacher@vault.com" value="teacher@vault.com">
      </div>

      <div class="form-group">
        <label class="form-label">Password</label>
        <div class="input-wrapper">
          <input type="${state.showPassword ? 'text' : 'password'}" id="login-password" class="form-input" placeholder="••••••••" value="password123">
          <button class="form-input-icon-right" onclick="state.showPassword = !state.showPassword; renderScreen();">
            ${state.showPassword ? Icons.eyeOff : Icons.eye}
          </button>
        </div>
      </div>

      <div class="form-link-row">
        <a href="#" class="form-link" onclick="router.navigate('/forgot-password')">Forgot password?</a>
      </div>

      <button class="btn-full btn-primary" id="btn-login-submit" onclick="handleLogin()">
        Login
      </button>

      <div class="divider">ya</div>

      <button class="btn-outline" onclick="handleGoogleLogin()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/></svg>
        Sign in with Google
      </button>

      <div class="auth-footer">
        Account nahi hai? <a href="#" class="form-link" onclick="router.navigate('/register')">Register karo</a>
      </div>
    </div>
  `;
}

// SCREEN 4: REGISTER SCREEN
function renderRegisterScreen() {
  return `
    <div class="auth-screen">
      <div class="screen-header" style="padding: 0; border: none; background: none; margin-bottom: 12px;">
        <button class="btn-back" onclick="router.navigate('/login')">${Icons.back}</button>
      </div>
      
      <div class="auth-header" style="margin-top: 0;">
        <h2 class="auth-title">Account banao</h2>
        <p class="auth-subtitle">Welcome to TuitionVault</p>
      </div>

      <div id="register-error" style="color: #E03E3E; font-size: 12px; margin-bottom: 12px; text-align: center; display: none;"></div>

      <div class="role-selector-group">
        <button class="role-toggle-btn active" id="btn-role-student" onclick="setRegisterRole('student')">Student</button>
        <button class="role-toggle-btn" id="btn-role-teacher" onclick="setRegisterRole('teacher')">Teacher</button>
      </div>

      <div class="form-group">
        <label class="form-label">Full Name</label>
        <input type="text" id="reg-name" class="form-input" placeholder="e.g. Raj Malhotra">
      </div>

      <div class="form-group">
        <label class="form-label">Email Address</label>
        <input type="email" id="reg-email" class="form-input" placeholder="e.g. raj@gmail.com">
      </div>

      <div class="form-group">
        <label class="form-label">Phone Number</label>
        <input type="text" id="reg-phone" class="form-input" placeholder="e.g. +91 99999 88888">
      </div>

      <div class="form-group">
        <label class="form-label">Password</label>
        <input type="password" id="reg-password" class="form-input" placeholder="Min. 6 characters">
      </div>

      <button class="btn-full btn-primary" id="btn-register-submit" onclick="handleRegister()" style="margin-top: 10px;">
        Register Now
      </button>

      <div class="auth-footer" style="margin-top: 24px;">
        Already account hai? <a href="#" class="form-link" onclick="router.navigate('/login')">Login karo</a>
      </div>
    </div>
  `;
}

// SCREEN 5: FORGOT PASSWORD SCREEN
function renderForgotPasswordScreen() {
  return `
    <div class="auth-screen">
      <div class="screen-header" style="padding: 0; border: none; background: none; margin-bottom: 24px;">
        <button class="btn-back" onclick="router.navigate('/login')">${Icons.back}</button>
      </div>

      <div class="auth-header">
        <h2 class="auth-title" style="margin-top:0;">Reset Password</h2>
        <p class="auth-subtitle">Enter your registered email address to receive a recovery link.</p>
      </div>

      <div id="forgot-success" style="display:none; background-color: #E1F8F1; border: 1px solid #9FE5CB; padding: 12px; border-radius: 8px; font-size: 12px; color: #054D35; margin-bottom: 20px; text-align: center;">
        Success: Reset link has been sent! Check your inbox.
      </div>

      <div class="form-group" id="forgot-input-group">
        <label class="form-label">Email Address</label>
        <input type="email" id="forgot-email" class="form-input" placeholder="e.g. you@example.com">
      </div>

      <button class="btn-full btn-primary" id="btn-forgot-submit" onclick="handleForgotPassword()">
        Send Reset Link
      </button>
    </div>
  `;
}

// SCREEN 6: TEACHER DASHBOARD (HOME)
function renderTeacherDashboard() {
  const teacher = state.currentUser;
  
  // Calculate aggregate dashboard statistics
  const myStudents = DB.students.filter(s => s.teacher_id === teacher.id);
  const totalCount = myStudents.length;

  let paidCount = 0;
  let partialCount = 0;
  let overdueCount = 0;
  let pendingCount = 0;

  myStudents.forEach(st => {
    const statusObj = getStudentFeeStatus(st.id);
    if (statusObj.status === 'paid') paidCount++;
    else if (statusObj.status === 'partial') partialCount++;
    else if (statusObj.status === 'overdue') overdueCount++;
    else if (statusObj.status === 'pending') pendingCount++;
  });

  // Recent payments
  const myStudentIds = myStudents.map(s => s.id);
  const recentPayments = DB.payments
    .filter(p => myStudentIds.includes(p.student_id))
    .sort((a, b) => new Date(b.payment_date) - new Date(a.payment_date))
    .slice(0, 4);

  return `
    <div class="shell-container">
      <div class="shell-topbar">
        <div class="shell-logo">
          <span class="logo-icon" style="width:24px; height:24px; font-size:12px; border-radius:5px;">TV</span>
          TuitionVault
        </div>
        <div class="shell-topbar-actions">
          <button class="topbar-btn" onclick="showToast('No new notifications', 'warning')">
            ${Icons.bell}
            <span class="red-dot"></span>
          </button>
          <div class="avatar-circle" onclick="router.navigate('/settings')">
            ${getInitials(teacher.full_name)}
          </div>
        </div>
      </div>

      <div class="shell-content">
        <!-- Horizontal stats carousel -->
        <div class="scroll-x-container">
          <div class="summary-card card-total" onclick="state.studentFilter = 'all'; router.navigate('/teacher/students');">
            <span class="summary-card-title">Total Students</span>
            <span class="summary-card-value">${totalCount}</span>
          </div>
          <div class="summary-card card-paid" onclick="state.studentFilter = 'active'; router.navigate('/teacher/students');">
            <span class="summary-card-title">Paid This Month</span>
            <span class="summary-card-value">${paidCount}</span>
          </div>
          <div class="summary-card card-pending" onclick="router.navigate('/teacher/reports');">
            <span class="summary-card-title">Pending / Part</span>
            <span class="summary-card-value">${pendingCount + partialCount}</span>
          </div>
          <div class="summary-card card-overdue" onclick="router.navigate('/teacher/reports');">
            <span class="summary-card-title">Overdue Alerts</span>
            <span class="summary-card-value">${overdueCount}</span>
          </div>
        </div>

        <!-- Quick Actions Grid -->
        <div class="section-container">
          <h3 class="section-title">Quick Actions</h3>
          <div class="quick-actions-grid">
            <button class="btn-quick-action qa-add-student" onclick="router.navigate('/teacher/students/add')">
              ${Icons.userPlus}
              Add Student
            </button>
            <button class="btn-quick-action qa-record-payment" onclick="router.navigate('/teacher/payments/add')">
              ${Icons.card}
              Record Payment
            </button>
            <button class="btn-quick-action qa-send-reminder" onclick="router.navigate('/teacher/reminders/send')">
              ${Icons.bell}
              Send Reminder
            </button>
            <button class="btn-quick-action qa-reports" onclick="router.navigate('/teacher/reports')">
              ${Icons.chart}
              View Reports
            </button>
          </div>
        </div>

        <!-- Recent Payments List -->
        <div class="section-container">
          <div class="section-header-row">
            <h3 class="section-title">Recent Payments</h3>
            <span class="section-link" onclick="router.navigate('/teacher/reports')">View All</span>
          </div>
          <div class="recent-payments-list">
            ${recentPayments.length === 0 ? `
              <div class="empty-state" style="padding: 20px;">
                <p class="empty-state-title" style="font-size:12px;">No payment records found</p>
              </div>
            ` : recentPayments.map(p => {
              const student = DB.students.find(s => s.id === p.student_id);
              const pUser = DB.profiles.find(u => u.id === student.user_id);
              return `
                <div class="payment-list-row" onclick="viewReceipt('${p.id}')">
                  <div class="payment-row-left">
                    <div class="avatar-small">${getInitials(pUser.full_name)}</div>
                    <div class="payment-row-info">
                      <span class="payment-row-name">${pUser.full_name}</span>
                      <span class="payment-row-date">${new Date(p.payment_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div class="payment-row-right">
                    <span class="payment-row-amount">₹${p.amount_paid}</span>
                    <span class="badge ${p.status === 'paid' ? 'badge-paid' : 'badge-partial'}">${p.status}</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- Bottom Nav -->
      ${renderTeacherBottomNav('home')}
    </div>
  `;
}

// SCREEN 7: STUDENT LIST SCREEN
function renderStudentListScreen() {
  const teacher = state.currentUser;
  
  // RLS filtered list of students
  let filtered = DB.students.filter(s => s.teacher_id === teacher.id);

  // Apply Active/Inactive chip filter
  if (state.studentFilter === 'active') {
    filtered = filtered.filter(s => s.status === 'active');
  } else if (state.studentFilter === 'inactive') {
    filtered = filtered.filter(s => s.status === 'inactive');
  }

  // Apply Search
  if (state.studentSearch) {
    const q = state.studentSearch.toLowerCase();
    filtered = filtered.filter(s => {
      const u = DB.profiles.find(user => user.id === s.user_id);
      return u && u.full_name.toLowerCase().includes(q);
    });
  }

  // Apply Sort
  if (state.studentSort === 'name') {
    filtered.sort((a, b) => {
      const uA = DB.profiles.find(user => user.id === a.user_id);
      const uB = DB.profiles.find(user => user.id === b.user_id);
      return uA.full_name.localeCompare(uB.full_name);
    });
  } else if (state.studentSort === 'enrollment') {
    filtered.sort((a, b) => new Date(b.enrollment_date) - new Date(a.enrollment_date));
  }

  return `
    <div class="shell-container">
      <div class="screen-header">
        <button class="btn-back" onclick="router.navigate('/teacher/dashboard')">${Icons.back}</button>
        <span class="screen-header-title">Mere Students</span>
        <button class="btn-back" onclick="router.navigate('/teacher/students/add')" style="color: #1849A9;">${Icons.plus}</button>
      </div>

      <div class="search-filter-box">
        <div class="search-bar-wrapper">
          <span class="search-icon-left">${Icons.search}</span>
          <input type="text" class="search-bar-input" placeholder="Student naam se dhundho..." value="${state.studentSearch}" oninput="state.studentSearch = this.value; debounceRenderStudents();">
        </div>
        <div class="filter-chips-row">
          <span class="filter-chip ${state.studentFilter === 'all' ? 'active' : ''}" onclick="state.studentFilter = 'all'; renderScreen();">All</span>
          <span class="filter-chip ${state.studentFilter === 'active' ? 'active' : ''}" onclick="state.studentFilter = 'active'; renderScreen();">Active</span>
          <span class="filter-chip ${state.studentFilter === 'inactive' ? 'active' : ''}" onclick="state.studentFilter = 'inactive'; renderScreen();">Inactive</span>
          
          <select style="border: 1px solid var(--border-default); background: var(--bg-primary); border-radius: 999px; padding: 4px 10px; font-size:11px; color: var(--text-secondary);" onchange="state.studentSort = this.value; renderScreen();">
            <option value="name" ${state.studentSort === 'name' ? 'selected' : ''}>Sort: Name</option>
            <option value="enrollment" ${state.studentSort === 'enrollment' ? 'selected' : ''}>Sort: Date</option>
          </select>
        </div>
      </div>

      <div class="screen-container" style="flex:1;">
        <div class="student-list">
          ${filtered.length === 0 ? `
            <div class="empty-state">
              <div class="empty-state-icon">👥</div>
              <h4 class="empty-state-title">Abhi koi student nahi hai</h4>
              <p style="font-size:12px; max-width:200px;">Naye students add karne ke liye niche click karein.</p>
              <button class="btn-full btn-primary" onclick="router.navigate('/teacher/students/add')" style="max-width:180px; height:44px; margin-top:8px;">
                Add Student
              </button>
            </div>
          ` : filtered.map(s => {
            const user = DB.profiles.find(u => u.id === s.user_id);
            const statusObj = getStudentFeeStatus(s.id);
            const badgeClass = statusObj.status === 'paid' ? 'badge-paid' : 
                               (statusObj.status === 'partial' ? 'badge-partial' : 
                               (statusObj.status === 'overdue' ? 'badge-overdue' : 'badge-pending'));
            
            return `
              <div class="student-card" onclick="viewStudentProfile('${s.id}')">
                <div class="student-card-left">
                  <div class="student-card-avatar ${s.status === 'active' ? 'avatar-status-active' : 'avatar-status-inactive'}">
                    ${getInitials(user.full_name)}
                  </div>
                  <div class="student-card-info">
                    <span class="student-card-name">${user.full_name}</span>
                    <span class="student-card-batch">${s.batch_name}</span>
                  </div>
                </div>
                <div class="student-card-right">
                  <span class="badge ${badgeClass}">${statusObj.text}</span>
                  ${statusObj.status !== 'paid' ? `<span class="student-card-pending">₹${statusObj.due - statusObj.paid} pending</span>` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      ${renderTeacherBottomNav('students')}
    </div>
  `;
}

// SCREEN 8: ADD STUDENT SCREEN
function renderAddStudentScreen() {
  const teacher = state.currentUser;
  const structures = DB.fee_structures.filter(f => f.teacher_id === teacher.id);
  
  return `
    <div class="shell-container">
      <div class="screen-header">
        <button class="btn-back" onclick="router.navigate('/teacher/students')">${Icons.back}</button>
        <span class="screen-header-title">Naya Student Add Karo</span>
      </div>

      <div class="form-screen-body">
        <div id="add-student-error" style="color: #E03E3E; font-size:12px; display:none; text-align:center;"></div>
        
        <div class="form-group">
          <label class="form-label">Full Name *</label>
          <input type="text" id="add-stud-name" class="form-input" placeholder="e.g. Rahul Sen">
        </div>

        <div class="form-group">
          <label class="form-label">Email Address *</label>
          <input type="email" id="add-stud-email" class="form-input" placeholder="e.g. rahul@example.com">
        </div>

        <div class="form-group">
          <label class="form-label">Phone Number *</label>
          <input type="text" id="add-stud-phone" class="form-input" placeholder="e.g. +91 99887 76655">
        </div>

        <div class="form-group">
          <label class="form-label">Batch / Class Name *</label>
          <input type="text" id="add-stud-batch" class="form-input" placeholder="e.g. Class 10 - Maths">
        </div>

        <div class="form-group">
          <label class="form-label">Assigned Fee Structure *</label>
          <select id="add-stud-fee" class="form-input" style="height:48px;">
            <option value="">Select Fee Structure</option>
            ${structures.map(f => `
              <option value="${f.id}">${f.name} (₹${f.amount}/month)</option>
            `).join('')}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Enrollment Date</label>
          <input type="date" id="add-stud-enroll" class="form-input" value="2026-05-27">
        </div>

        <div class="toggle-switch-wrapper">
          <span class="toggle-switch-label">Status: Active</span>
          <label class="switch">
            <input type="checkbox" id="add-stud-status" checked>
            <span class="slider"></span>
          </label>
        </div>

        <div class="form-button-row">
          <button class="btn-half btn-outline" style="height:48px;" onclick="router.navigate('/teacher/students')">Cancel</button>
          <button class="btn-half btn-primary" style="height:48px;" onclick="handleAddStudent()">Save Student</button>
        </div>
      </div>
    </div>
  `;
}

// SCREEN 9: STUDENT PROFILE SCREEN
function renderStudentProfileScreen() {
  const student = DB.students.find(s => s.id === state.selectedStudentId);
  if (!student) return `<div>Student not found</div>`;

  const user = DB.profiles.find(u => u.id === student.user_id);
  const fee = DB.fee_structures.find(f => f.id === student.fee_structure_id);
  
  // Calculate due/paid status
  const statusObj = getStudentFeeStatus(student.id);

  // Get student transaction history
  const history = DB.payments
    .filter(p => p.student_id === student.id)
    .sort((a, b) => new Date(b.payment_date) - new Date(a.payment_date));

  const totalPaidSum = history.reduce((sum, p) => sum + p.amount_paid, 0);

  return `
    <div class="shell-container">
      <div class="screen-header">
        <button class="btn-back" onclick="router.navigate('/teacher/students')">${Icons.back}</button>
        <span class="screen-header-title">Student Profile</span>
        <button class="btn-icon-action" style="color: #1849A9;" onclick="showToast('Edit profile loaded', 'success')">${Icons.pencil}</button>
      </div>

      <div class="screen-container" style="flex:1;">
        <div class="profile-hero">
          <div class="profile-avatar-large">${getInitials(user.full_name)}</div>
          <div class="profile-name">${user.full_name}</div>
          <div class="profile-batch-row">
            <span class="badge ${student.status === 'active' ? 'badge-paid' : 'badge-cancelled'}">${student.status}</span>
            <span style="font-size: 13px; color: var(--text-secondary);">${student.batch_name}</span>
          </div>
        </div>

        <div style="padding: 16px; display: flex; flex-direction: column; gap:16px;">
          <!-- Info Section -->
          <div class="profile-info-grid">
            <div class="profile-info-row">
              <span class="profile-info-icon">📧</span>
              <span class="profile-info-text">${user.email || 'student@vault.com'}</span>
            </div>
            <div class="profile-info-row">
              <span class="profile-info-icon">📞</span>
              <span class="profile-info-text">${user.phone}</span>
            </div>
            <div class="profile-info-row">
              <span class="profile-info-icon">🗓️</span>
              <span class="profile-info-text">Enrolled: ${new Date(student.enrollment_date).toLocaleDateString()}</span>
            </div>
            <div class="profile-info-row" style="border-top:1px solid var(--border-default); padding-top:12px; margin-top:4px;">
              <span class="profile-info-icon">💰</span>
              <span class="profile-info-text">
                <b>${fee ? fee.name : 'No Fee Assigned'}</b><br>
                <span style="font-size:11px; color:var(--text-secondary);">Amount: ₹${fee ? fee.amount : 0} / month (Due day: ${fee ? fee.due_day : 0})</span>
              </span>
            </div>
          </div>

          <!-- Month-wise payment status card -->
          <div class="section-container">
            <h3 class="section-title">Fee Summary (May 2026)</h3>
            <div class="payment-list-row" style="cursor:default;">
              <div class="payment-row-left">
                <div class="payment-row-info">
                  <span class="payment-row-name">Current Period Status</span>
                  <span class="payment-row-date">Expected Amount: ₹${fee ? fee.amount : 0}</span>
                </div>
              </div>
              <div class="payment-row-right">
                <span class="badge ${statusObj.status === 'paid' ? 'badge-paid' : (statusObj.status === 'partial' ? 'badge-partial' : 'badge-overdue')}">${statusObj.text}</span>
                <span class="payment-row-amount">Paid: ₹${statusObj.paid}</span>
              </div>
            </div>
          </div>

          <!-- Payment History list -->
          <div class="section-container">
            <h3 class="section-title">Payment History</h3>
            <div class="recent-payments-list">
              ${history.length === 0 ? `
                <div class="empty-state" style="padding: 20px; border:1px dashed var(--border-default); border-radius:8px;">
                  <p class="empty-state-title" style="font-size:12px;">No payments recorded yet.</p>
                </div>
              ` : history.map(p => `
                <div class="history-card-row">
                  <div class="history-row-left">
                    <span class="history-row-month">${new Date(p.payment_date).toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                    <span class="history-row-amount">Method: <code style="text-transform:uppercase;">${p.method}</code></span>
                  </div>
                  <div class="history-row-right">
                    <span class="badge ${p.status === 'paid' ? 'badge-paid' : 'badge-partial'}">₹${p.amount_paid}</span>
                    <button class="btn-icon-action" onclick="viewReceipt('${p.id}')">${Icons.download}</button>
                  </div>
                </div>
              `).join('')}
            </div>
            
            <div style="display:flex; justify-content:space-between; font-size:12px; margin-top:8px; font-weight:600; padding: 0 4px;">
              <span>Total Paid: ₹${totalPaidSum}</span>
              <span style="color:#E03E3E;">Outstanding: ₹${statusObj.due - statusObj.paid}</span>
            </div>
          </div>

          <!-- Bottom Console buttons -->
          <div class="profile-action-buttons">
            <button class="btn-full btn-primary" style="background-color: #0F9E6E;" onclick="router.navigate('/teacher/payments/add');">
              ${Icons.card}
              Record Payment
            </button>
            <button class="btn-full btn-outline" style="border-color:#F59E0B; color:#B45309;" onclick="router.navigate('/teacher/reminders/send');">
              ${Icons.bell}
              Send Pending Reminder
            </button>
            <button class="btn-full btn-outline" style="border-color:#E03E3E; color:#E03E3E; margin-top:20px; height:48px;" onclick="triggerDeactivateModal('${student.id}')">
              Deactivate Student
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// SCREEN 10: RECORD PAYMENT SCREEN
function renderRecordPaymentScreen() {
  const teacher = state.currentUser;
  const myStudents = DB.students.filter(s => s.teacher_id === teacher.id);
  
  // If preselected, find profile
  let selectedStudent = null;
  if (state.selectedStudentId) {
    selectedStudent = DB.students.find(s => s.id === state.selectedStudentId);
  }

  // Pre-filled amount and structure details
  let assignedFeeAmount = '';
  let feeStructureName = 'No structure assigned';
  let feeStructureId = '';

  if (selectedStudent) {
    const fee = DB.fee_structures.find(f => f.id === selectedStudent.fee_structure_id);
    if (fee) {
      const statusObj = getStudentFeeStatus(selectedStudent.id);
      assignedFeeAmount = (fee.amount - statusObj.paid).toFixed(2);
      feeStructureName = `${fee.name} (₹${fee.amount})`;
      feeStructureId = fee.id;
    }
  }

  return `
    <div class="shell-container">
      <div class="screen-header">
        <button class="btn-back" onclick="handleRecordPaymentBack()">${Icons.back}</button>
        <span class="screen-header-title">Record Payment</span>
      </div>

      <div class="form-screen-body">
        <div id="payment-error" style="color: #E03E3E; font-size:12px; display:none; text-align:center;"></div>

        <div class="form-group">
          <label class="form-label">Student Selector *</label>
          <select id="pay-student-select" class="form-input" style="height:48px;" onchange="handleRecordPaymentStudentChange(this.value)">
            <option value="">Choose student</option>
            ${myStudents.map(s => {
              const u = DB.profiles.find(user => user.id === s.user_id);
              return `<option value="${s.id}" ${selectedStudent && selectedStudent.id === s.id ? 'selected' : ''}>${u.full_name} (${s.batch_name})</option>`;
            }).join('')}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Assigned Fee Structure</label>
          <input type="text" class="form-input" style="background:#EBF1FD; border-color:#C3D4F9; font-weight:600; color:#0C3880;" id="pay-fee-display" value="${feeStructureName}" disabled>
          <input type="hidden" id="pay-fee-id" value="${feeStructureId}">
        </div>

        <div class="form-group">
          <label class="form-label">Amount Paid (INR) *</label>
          <input type="number" id="pay-amount" class="form-input" placeholder="Enter amount" value="${assignedFeeAmount}">
        </div>

        <div class="form-group">
          <label class="form-label">Payment Date</label>
          <input type="date" id="pay-date" class="form-input" value="2026-05-27">
        </div>

        <div class="form-group">
          <label class="form-label">Payment Method *</label>
          <div class="radio-chips-group" id="pay-method-group">
            <span class="radio-chip active" onclick="setPaymentMethod('cash', this)">Cash</span>
            <span class="radio-chip" onclick="setPaymentMethod('upi', this)">UPI</span>
            <span class="radio-chip" onclick="setPaymentMethod('card', this)">Card</span>
            <span class="radio-chip" onclick="setPaymentMethod('bank_transfer', this)">Bank Transfer</span>
          </div>
          <input type="hidden" id="pay-method" value="cash">
        </div>

        <div class="form-group">
          <label class="form-label">Notes (Optional)</label>
          <textarea id="pay-notes" class="form-input" style="height:80px; padding:10px; resize:none;" placeholder="Remarks, e.g. receipt sent"></textarea>
        </div>

        ${selectedStudent ? `
          <div class="summary-details-card">
            <div class="summary-details-row">
              <span class="summary-details-label">Student:</span>
              <span class="summary-details-val">${DB.profiles.find(u => u.id === selectedStudent.user_id).full_name}</span>
            </div>
            <div class="summary-details-row">
              <span class="summary-details-label">Period:</span>
              <span class="summary-details-val">May 2026</span>
            </div>
          </div>
        ` : ''}

        <div class="form-button-row" style="margin-top:16px;">
          <button class="btn-half btn-outline" style="height:48px;" onclick="handleRecordPaymentBack()">Cancel</button>
          <button class="btn-half btn-primary" style="background-color:#0F9E6E; height:48px;" onclick="handleRecordPaymentSubmit()">Record & Receipt</button>
        </div>
      </div>
    </div>
  `;
}

// SCREEN 11: STUDENT DASHBOARD (HOME)
function renderStudentDashboard() {
  const studentUser = state.currentUser;
  
  // Find student record
  const student = DB.students.find(s => s.user_id === studentUser.id);
  if (!student) return `<div style="padding:20px;">Student record not found in system databases.</div>`;

  const teacher = DB.profiles.find(t => t.id === student.teacher_id);
  const fee = DB.fee_structures.find(f => f.id === student.fee_structure_id);
  
  // Fee summary
  const statusObj = getStudentFeeStatus(student.id);

  // History list
  const history = DB.payments.filter(p => p.student_id === student.id);

  return `
    <div class="shell-container">
      <div class="shell-topbar">
        <div class="shell-logo">
          <span class="logo-icon" style="width:24px; height:24px; font-size:12px; border-radius:5px; background:linear-gradient(135deg, #7C3AED, #1849A9);">TV</span>
          TuitionVault
        </div>
        <div class="shell-topbar-actions">
          <button class="topbar-btn" onclick="showToast('Settings opened', 'success')">
            ${Icons.bell}
          </button>
          <div class="avatar-circle" style="background-color: #7C3AED;" onclick="router.navigate('/settings')">
            ${getInitials(studentUser.full_name)}
          </div>
        </div>
      </div>

      <div class="shell-content">
        <!-- Large visual fee status card -->
        <div class="summary-details-card" style="background: linear-gradient(135deg, #7C3AED, #1849A9); border:none; color:white; padding:20px; border-radius:16px; box-shadow:var(--shadow-md);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <span style="font-size:11px; text-transform:uppercase; font-weight:600; opacity:0.85; letter-spacing:0.05em;">Current Fee Period (May 2026)</span>
            <span class="badge" style="background-color:rgba(255,255,255,0.2); color:white;">${statusObj.text}</span>
          </div>
          <span style="font-size:12px; opacity:0.8;">Outstanding Amount Due</span>
          <h2 style="font-family:var(--font-title); font-size:32px; font-weight:700; margin: 4px 0 16px;">
            ₹${statusObj.due - statusObj.paid}
          </h2>
          <div style="display:flex; justify-content:space-between; align-items:flex-end; font-size:12px; opacity:0.9;">
            <span>Due Date: Day ${fee ? fee.due_day : 10}</span>
            ${statusObj.status !== 'paid' ? `
              <button class="btn-full" style="width:auto; height:36px; padding:0 16px; font-size:12px; background-color:white; color:#1849A9; border-radius:8px;" onclick="triggerSimulatedPaymentGateway('${student.id}', '${statusObj.due - statusObj.paid}')">
                Pay Now
              </button>
            ` : '<span style="font-weight:600; color:#3DCEA0;">✓ Fully Paid</span>'}
          </div>
        </div>

        <!-- Teacher Info Card -->
        <div class="section-container">
          <h3 class="section-title">My Tutor</h3>
          <div class="payment-list-row" style="cursor:default;">
            <div class="payment-row-left">
              <div class="avatar-small" style="background-color:#E1F8F1; color:#0F9E6E;">${getInitials(teacher.full_name)}</div>
              <div class="payment-row-info">
                <span class="payment-row-name">${teacher.full_name}</span>
                <span class="payment-row-date">Batch: ${student.batch_name}</span>
              </div>
            </div>
            <div class="payment-row-right" style="justify-content:center;">
              <span style="font-size:11px; color:var(--text-secondary);">${teacher.phone}</span>
            </div>
          </div>
        </div>

        <!-- Payment History list -->
        <div class="section-container">
          <div class="section-header-row">
            <h3 class="section-title">Recent Transactions</h3>
            <span class="section-link" onclick="router.navigate('/student/payments')">View All</span>
          </div>
          <div class="recent-payments-list">
            ${history.length === 0 ? `
              <div class="empty-state" style="padding: 20px;">
                <p class="empty-state-title" style="font-size:12px;">No payment receipts generated.</p>
              </div>
            ` : history.slice(0, 3).map(p => `
              <div class="payment-list-row" onclick="viewReceipt('${p.id}')">
                <div class="payment-row-left">
                  <div class="avatar-small" style="background:#DDD6FE; color:#5B21B6;">📄</div>
                  <div class="payment-row-info">
                    <span class="payment-row-name">Fee Receipt #${p.id}</span>
                    <span class="payment-row-date">${new Date(p.payment_date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div class="payment-row-right">
                  <span class="payment-row-amount">₹${p.amount_paid}</span>
                  <span class="badge badge-paid">PAID</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Bottom Nav -->
      ${renderStudentBottomNav('home')}
    </div>
  `;
}

// SCREEN 12: PAYMENT HISTORY SCREEN (STUDENT)
function renderStudentPaymentsHistory() {
  const studentUser = state.currentUser;
  const student = DB.students.find(s => s.user_id === studentUser.id);
  
  if (!student) return `<div>Student record not found</div>`;

  const payments = DB.payments.filter(p => p.student_id === student.id);
  const statusObj = getStudentFeeStatus(student.id);

  const totalPaidSum = payments.reduce((sum, p) => sum + p.amount_paid, 0);

  return `
    <div class="shell-container">
      <div class="screen-header">
        <button class="btn-back" onclick="router.navigate('/student/dashboard')">${Icons.back}</button>
        <span class="screen-header-title">My Payments</span>
      </div>

      <div class="search-filter-box">
        <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:600;">
          <span>Total Paid (2026): ₹${totalPaidSum}</span>
          <span style="color:#E03E3E;">Outstanding: ₹${statusObj.due - statusObj.paid}</span>
        </div>
      </div>

      <div class="screen-container" style="flex:1;">
        <div class="student-list" style="padding:16px;">
          ${payments.length === 0 ? `
            <div class="empty-state">
              <div class="empty-state-icon">💳</div>
              <h4 class="empty-state-title">Abhi koi payment record nahi hai</h4>
            </div>
          ` : payments.map(p => `
            <div class="payment-list-row" onclick="viewReceipt('${p.id}')">
              <div class="payment-row-left">
                <div class="avatar-small">📄</div>
                <div class="payment-row-info">
                  <span class="payment-row-name">Month: ${new Date(p.payment_date).toLocaleString('default', { month: 'long' })}</span>
                  <span class="payment-row-date">${new Date(p.payment_date).toLocaleDateString()} via <code style="text-transform:uppercase;">${p.method}</code></span>
                </div>
              </div>
              <div class="payment-row-right">
                <span class="payment-row-amount">₹${p.amount_paid}</span>
                <span class="badge badge-paid">PAID</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      ${renderStudentBottomNav('payments')}
    </div>
  `;
}

// SCREEN 13: RECEIPT SCREEN
function renderReceiptScreen() {
  const p = DB.payments.find(pm => pm.id === state.selectedReceiptId);
  if (!p) return `<div style="padding:20px;">Receipt not found</div>`;

  const student = DB.students.find(s => s.id === p.student_id);
  const studentUser = DB.profiles.find(u => u.id === student.user_id);
  const teacher = DB.profiles.find(t => t.id === student.teacher_id);
  const fee = DB.fee_structures.find(f => f.id === p.fee_structure_id);

  return `
    <div class="shell-container">
      <div class="screen-header">
        <button class="btn-back" onclick="handleReceiptBack()">${Icons.back}</button>
        <span class="screen-header-title">Payment Receipt</span>
      </div>

      <div class="screen-container" style="flex:1; background-color: var(--bg-tertiary);">
        <div class="receipt-wrapper">
          <div class="receipt-box">
            <div class="receipt-logo-header">
              <span style="font-family:var(--font-title); font-size:16px; font-weight:600; color:#1849A9; display:flex; align-items:center; gap:6px;">
                <span class="logo-icon" style="width:20px; height:20px; font-size:10px; border-radius:4px;">TV</span>
                TuitionVault
              </span>
              <span style="font-size:10px; color:var(--text-muted);">Receipt No: <b>${p.id.toUpperCase()}</b></span>
            </div>

            <div class="receipt-stamp">PAID</div>

            <div class="receipt-amount-large">
              ₹${p.amount_paid.toFixed(2)}
            </div>

            <div class="receipt-details-list">
              <div class="receipt-details-item">
                <span class="receipt-details-label">Student Name:</span>
                <span class="receipt-details-value"><b>${studentUser.full_name}</b></span>
              </div>
              <div class="receipt-details-item">
                <span class="receipt-details-label">Batch:</span>
                <span class="receipt-details-value">${student.batch_name}</span>
              </div>
              <div class="receipt-details-item">
                <span class="receipt-details-label">Tutor / Academy:</span>
                <span class="receipt-details-value">${teacher.full_name}</span>
              </div>
              <div class="receipt-details-item">
                <span class="receipt-details-label">Fee Period:</span>
                <span class="receipt-details-value">${new Date(p.payment_date).toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
              </div>
              <div class="receipt-details-item">
                <span class="receipt-details-label">Fee Structure:</span>
                <span class="receipt-details-value">${fee ? fee.name : 'Custom Structure'}</span>
              </div>
              <div class="receipt-details-item">
                <span class="receipt-details-label">Payment Date:</span>
                <span class="receipt-details-value">${new Date(p.payment_date).toLocaleString()}</span>
              </div>
              <div class="receipt-details-item" style="border-top:1px solid var(--border-default); padding-top:8px; margin-top:4px;">
                <span class="receipt-details-label">Payment Method:</span>
                <span class="receipt-details-value" style="text-transform:uppercase;"><b>${p.method}</b></span>
              </div>
            </div>

            ${p.notes ? `
              <div style="font-size:11px; background-color:var(--bg-secondary); border-radius:6px; padding:8px; color:var(--text-secondary);">
                <b>Remarks:</b> ${p.notes}
              </div>
            ` : ''}
          </div>

          <button class="btn-full btn-primary" onclick="showToast('Receipt PDF downloaded successfully!', 'success')">
            ${Icons.download}
            Download PDF Receipt
          </button>
          
          <button class="btn-outline btn-full" style="background:var(--bg-primary);" onclick="showToast('Sharing receipt via WhatsApp...', 'success')">
            Share on WhatsApp
          </button>
        </div>
      </div>
    </div>
  `;
}

// SCREEN 14: SEND REMINDER SCREEN
function renderSendReminderScreen() {
  const teacher = state.currentUser;
  
  // Find students with pending/partial fees
  const pendingStudents = DB.students
    .filter(s => s.teacher_id === teacher.id)
    .filter(s => {
      const statusObj = getStudentFeeStatus(s.id);
      return statusObj.status !== 'paid';
    });

  return `
    <div class="shell-container">
      <div class="screen-header">
        <button class="btn-back" onclick="router.navigate('/teacher/dashboard')">${Icons.back}</button>
        <span class="screen-header-title">Send Reminders</span>
      </div>

      <div class="form-screen-body">
        <div id="reminder-error" style="color: #E03E3E; font-size:12px; display:none; text-align:center;"></div>

        <div class="form-group">
          <label class="form-label">Select Students *</label>
          <div class="multi-select-box" id="reminder-students-box">
            ${pendingStudents.length === 0 ? `
              <div style="padding:16px; text-align:center; font-size:12px; color:var(--text-secondary);">
                All students have paid their fees! No reminders pending.
              </div>
            ` : `
              <div class="multi-select-row" style="background-color:var(--bg-secondary); font-weight:600;">
                <input type="checkbox" id="reminder-select-all" checked onchange="toggleSelectAllReminders(this.checked)">
                <label for="reminder-select-all">Select All Students</label>
              </div>
              ${pendingStudents.map(s => {
                const u = DB.profiles.find(user => user.id === s.user_id);
                const statusObj = getStudentFeeStatus(s.id);
                return `
                  <div class="multi-select-row">
                    <input type="checkbox" name="reminder-student-checkbox" value="${s.id}" id="rem-check-${s.id}" checked>
                    <label for="rem-check-${s.id}" style="display:flex; justify-content:space-between; flex:1;">
                      <span><b>${u.full_name}</b> (${s.batch_name})</span>
                      <span style="color:#E03E3E; font-weight:600;">₹${statusObj.due - statusObj.paid} due</span>
                    </label>
                  </div>
                `;
              }).join('')}
            `}
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Channels *</label>
          <div style="display:flex; gap:16px;">
            <label class="checkbox-item">
              <input type="checkbox" id="rem-channel-wa" checked>
              WhatsApp
            </label>
            <label class="checkbox-item">
              <input type="checkbox" id="rem-channel-sms">
              SMS
            </label>
            <label class="checkbox-item">
              <input type="checkbox" id="rem-channel-email">
              Email
            </label>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Message Template</label>
          <textarea id="reminder-template" class="form-input" style="height:70px; padding:10px; resize:none;" oninput="updateReminderPreview(this.value)">Dear [Student Name], aapki May ki fee ₹[Amount] abhi bhi pending hai. Kripya jaldi payment karein.</textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Schedule Option</label>
          <select id="reminder-schedule" class="form-input" style="height:48px;" onchange="handleScheduleToggle(this.value)">
            <option value="now">Send Now</option>
            <option value="schedule">Schedule for later</option>
          </select>
        </div>

        <div class="form-group" id="reminder-datepicker-group" style="display:none;">
          <label class="form-label">Choose Date & Time</label>
          <input type="datetime-local" id="reminder-schedule-date" class="form-input" value="2026-05-28T09:00">
        </div>

        <div class="form-group">
          <label class="form-label">Message Preview (Student perspective)</label>
          <div class="message-preview-box" id="reminder-preview-div">
            Dear Rahul Singh, aapki May ki fee ₹1500 abhi bhi pending hai. Kripya jaldi payment karein.
          </div>
        </div>

        <div class="form-button-row">
          <button class="btn-half btn-outline" style="height:48px;" onclick="router.navigate('/teacher/dashboard')">Cancel</button>
          <button class="btn-half btn-primary" id="btn-reminder-submit" style="background-color:#F59E0B; color:#4A2D04; height:48px;" onclick="handleSendRemindersSubmit()">Send Reminder</button>
        </div>
      </div>
    </div>
  `;
}

// SCREEN 15: REPORTS SCREEN
function renderReportsScreen() {
  const teacher = state.currentUser;
  const myStudents = DB.students.filter(s => s.teacher_id === teacher.id);
  
  // Calculate collection rate metrics
  let totalExpected = 0;
  let totalCollected = 0;
  let totalPendingOutstanding = 0;
  
  myStudents.forEach(st => {
    const feeStatusObj = getStudentFeeStatus(st.id);
    totalExpected += feeStatusObj.due;
    totalCollected += feeStatusObj.paid;
    totalPendingOutstanding += (feeStatusObj.due - feeStatusObj.paid);
  });

  const collectionRate = totalExpected > 0 ? ((totalCollected / totalExpected) * 100).toFixed(0) : 0;

  return `
    <div class="shell-container">
      <div class="screen-header">
        <button class="btn-back" onclick="router.navigate('/teacher/dashboard')">${Icons.back}</button>
        <span class="screen-header-title">Analytics Reports</span>
      </div>

      <div class="screen-container" style="flex:1;">
        <div style="padding:16px; display:flex; flex-direction:column; gap:16px;">
          <!-- Dropdown Filter row -->
          <div style="display:flex; gap:10px;">
            <select style="flex:1; border: 1px solid var(--border-default); background: var(--bg-primary); border-radius: 8px; height:40px; padding:0 8px; font-size:12px; color:var(--text-primary);">
              <option>May 2026 (Current)</option>
              <option>April 2026</option>
            </select>
            <select style="flex:1; border: 1px solid var(--border-default); background: var(--bg-primary); border-radius: 8px; height:40px; padding:0 8px; font-size:12px; color:var(--text-primary);">
              <option>All Batches</option>
              <option>Class 10 - Maths</option>
            </select>
          </div>

          <!-- Summary Metric grids -->
          <div class="quick-actions-grid" style="grid-template-columns: 1fr 1fr; gap:10px;">
            <div class="summary-card card-paid" style="height:auto; min-width:auto; cursor:default;">
              <span class="summary-card-title" style="color:#054D35;">Total Collected</span>
              <span class="summary-card-value" style="font-size:18px;">₹${totalCollected.toFixed(2)}</span>
            </div>
            <div class="summary-card card-overdue" style="height:auto; min-width:auto; cursor:default;">
              <span class="summary-card-title" style="color:#7F1D1D;">Total Pending</span>
              <span class="summary-card-value" style="font-size:18px;">₹${totalPendingOutstanding.toFixed(2)}</span>
            </div>
            <div class="summary-card card-total" style="height:auto; min-width:auto; cursor:default;">
              <span class="summary-card-title" style="color:#0C3880;">Students Count</span>
              <span class="summary-card-value" style="font-size:18px;">${myStudents.length}</span>
            </div>
            <div class="summary-card card-pending" style="background:#DDD6FE; border-color:#DDD6FE; color:#5B21B6; height:auto; min-width:auto; cursor:default;">
              <span class="summary-card-title" style="color:#5B21B6;">Collection Rate</span>
              <span class="summary-card-value" style="font-size:18px;">${collectionRate}%</span>
            </div>
          </div>

          <!-- Simulated dynamic HTML bar charts -->
          <div class="chart-sim">
            <span class="section-title" style="font-size:12px;">Monthly Collections (Last 6 Months)</span>
            <div class="bar-chart-container">
              <div class="bar-chart-column">
                <div class="bar-chart-bar" style="height:30px;"></div>
                <span class="bar-chart-label">Dec</span>
              </div>
              <div class="bar-chart-column">
                <div class="bar-chart-bar" style="height:45px;"></div>
                <span class="bar-chart-label">Jan</span>
              </div>
              <div class="bar-chart-column">
                <div class="bar-chart-bar" style="height:60px;"></div>
                <span class="bar-chart-label">Feb</span>
              </div>
              <div class="bar-chart-column">
                <div class="bar-chart-bar" style="height:55px;"></div>
                <span class="bar-chart-label">Mar</span>
              </div>
              <div class="bar-chart-column">
                <div class="bar-chart-bar" style="height:70px;"></div>
                <span class="bar-chart-label">Apr</span>
              </div>
              <div class="bar-chart-column">
                <!-- Current Month collected visual ratio -->
                <div class="bar-chart-bar" style="height:${Math.max(20, Math.min(100, Math.round(totalCollected / 100)))}px; background-color:#0F9E6E;"></div>
                <span class="bar-chart-label" style="font-weight:600; color:#0F9E6E;">May</span>
              </div>
            </div>
          </div>

          <!-- Simulated pie chart state -->
          <div class="chart-sim">
            <span class="section-title" style="font-size:12px;">Collection Ratios</span>
            <div class="pie-chart-sim">
              <div class="pie-circle"></div>
              <div class="pie-legend">
                <div class="legend-item">
                  <div class="legend-dot" style="background-color:#0F9E6E;"></div>
                  <span>Paid (${collectionRate}%)</span>
                </div>
                <div class="legend-item">
                  <div class="legend-dot" style="background-color:#F59E0B;"></div>
                  <span>Partial</span>
                </div>
                <div class="legend-item">
                  <div class="legend-dot" style="background-color:#E03E3E;"></div>
                  <span>Overdue / Pend</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Export Option buttons -->
          <div class="section-container" style="margin-top:8px;">
            <h4 class="section-title" style="font-size:12px;">Export Document Options</h4>
            <div style="display:flex; flex-direction:column; gap:8px;">
              <button class="btn-outline btn-full" style="height:44px; border-color:#0F9E6E; color:#0F9E6E;" onclick="showToast('Excel report generated: TuitionVault_May2026.xlsx', 'success')">
                Download Excel Report (.xlsx)
              </button>
              <button class="btn-outline btn-full" style="height:44px; border-color:#E03E3E; color:#E03E3E;" onclick="showToast('PDF compilation compiled successfully!', 'success')">
                Download PDF Ledger Book (.pdf)
              </button>
            </div>
          </div>
        </div>
      </div>

      ${renderTeacherBottomNav('reports')}
    </div>
  `;
}

// SCREEN 16: SETTINGS SCREEN
function renderSettingsScreen() {
  const user = state.currentUser;
  
  return `
    <div class="shell-container">
      <div class="screen-header">
        <button class="btn-back" onclick="handleSettingsBack()">${Icons.back}</button>
        <span class="screen-header-title">Settings</span>
      </div>

      <div class="screen-container" style="flex:1;">
        <div style="padding:16px; display:flex; flex-direction:column; gap:18px;">
          <!-- Profile Quick Details card -->
          <div class="payment-list-row" style="cursor:default; border-radius:12px;">
            <div class="payment-row-left">
              <div class="avatar-circle" style="width:48px; height:48px; font-size:16px;">
                ${getInitials(user.full_name)}
              </div>
              <div class="payment-row-info">
                <span class="payment-row-name" style="font-size:15px;">${user.full_name}</span>
                <span class="badge ${user.role === 'teacher' ? 'badge-role-teacher' : (user.role === 'student' ? 'badge-role-student' : 'badge-role-super')}">${user.role.toUpperCase()}</span>
              </div>
            </div>
          </div>

          <!-- Section 1: Account Settings -->
          <div class="settings-list">
            <span class="settings-section-title">Account preferences</span>
            
            <div class="settings-row" onclick="showToast('Edit profile form loaded', 'success')">
              <span>Edit Profile (Name, Phone, Avatar)</span>
              <span>${Icons.chevronRight}</span>
            </div>

            ${user.role === 'teacher' ? `
              <div class="settings-row" onclick="showToast('Manage Fee structures panel loaded', 'success')">
                <span>Manage Fee Structures</span>
                <span>${Icons.chevronRight}</span>
              </div>
            ` : ''}

            <div class="settings-row" onclick="showToast('Change credentials sheet loaded', 'success')">
              <span>Change Password</span>
              <span>${Icons.chevronRight}</span>
            </div>
          </div>

          <!-- Section 2: Notifications preferences -->
          <div class="settings-list">
            <span class="settings-section-title">Notification Channels</span>
            
            <div class="toggle-switch-wrapper">
              <span>WhatsApp Alerts</span>
              <label class="switch">
                <input type="checkbox" checked>
                <span class="slider"></span>
              </label>
            </div>

            <div class="toggle-switch-wrapper">
              <span>SMS Direct Broadcasts</span>
              <label class="switch">
                <input type="checkbox" checked>
                <span class="slider"></span>
              </label>
            </div>

            <div class="toggle-switch-wrapper">
              <span>Email Receivables</span>
              <label class="switch">
                <input type="checkbox">
                <span class="slider"></span>
              </label>
            </div>
          </div>

          <!-- Support & version info -->
          <div class="settings-list" style="margin-top:12px;">
            <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--text-muted); padding:0 4px;">
              <span>TuitionVault Version v1.0 (Stable)</span>
              <a href="#" class="form-link" style="font-size:11px;" onclick="showToast('Support ticket drawer initialized', 'success')">Contact Support</a>
            </div>
          </div>

          <!-- Destructive Logout Button -->
          <button class="btn-outline btn-full" style="border-color:#E03E3E; color:#E03E3E; margin-top:20px; height:52px;" onclick="triggerLogoutModal()">
            Log Out Account
          </button>
        </div>
      </div>
    </div>
  `;
}

// SCREEN 17: ADMIN PANEL (SUPER ADMIN)
function renderSuperAdminScreen() {
  const teachers = DB.profiles.filter(p => p.role === 'teacher');
  const allStudents = DB.students;
  const payments = DB.payments;

  // Aggregate stats
  const totalTutors = teachers.length;
  const totalSt = allStudents.length;
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount_paid, 0);

  return `
    <div class="shell-container">
      <div class="shell-topbar">
        <div class="shell-logo">
          <span class="logo-icon" style="width:24px; height:24px; font-size:12px; border-radius:5px; background:linear-gradient(135deg, #1849A9, #E03E3E);">TV</span>
          SuperAdmin Panel
        </div>
        <div class="shell-topbar-actions">
          <div class="avatar-circle" style="background-color: #1849A9;" onclick="router.navigate('/settings')">
            SA
          </div>
        </div>
      </div>

      <div class="shell-content">
        <div class="rls-warning-card" style="margin-bottom:0; background-color:#EBF1FD; border-color:#C3D4F9; color:#0C3880;">
          <span class="rls-badge">ADMIN CONTROL</span>
          <span>Institution-level administrative overview panel. Bypass all standard RLS restrictions.</span>
        </div>

        <!-- Global statistics widgets -->
        <div class="quick-actions-grid" style="grid-template-columns: 1fr 1fr 1fr; gap:8px;">
          <div class="summary-card card-total" style="min-width:auto; padding:10px; cursor:default;">
            <span class="summary-card-title" style="font-size:9px;">Total Teachers</span>
            <span class="summary-card-value" style="font-size:16px;">${totalTutors}</span>
          </div>
          <div class="summary-card card-paid" style="min-width:auto; padding:10px; cursor:default;">
            <span class="summary-card-title" style="font-size:9px;">All Students</span>
            <span class="summary-card-value" style="font-size:16px;">${totalSt}</span>
          </div>
          <div class="summary-card card-pending" style="min-width:auto; padding:10px; cursor:default;">
            <span class="summary-card-title" style="font-size:9px;">Revenue</span>
            <span class="summary-card-value" style="font-size:16px;">₹${totalRevenue}</span>
          </div>
        </div>

        <!-- Section: Broadcaster -->
        <div class="admin-card">
          <span class="section-title" style="font-size:13px;">Broadcast Announcement</span>
          <div class="form-group" style="margin-bottom:0;">
            <textarea id="broadcast-msg" class="form-input" style="height:60px; padding:10px; resize:none;" placeholder="Enter notification message to all teachers & parents..."></textarea>
            <button class="btn-full btn-primary" style="height:36px; font-size:12px; margin-top:8px;" onclick="handleBroadcastAnnounce()">
              Broadcast Now
            </button>
          </div>
        </div>

        <!-- Section: All Teachers list -->
        <div class="section-container">
          <h3 class="section-title">Registered Tutors List</h3>
          <div class="recent-payments-list">
            ${teachers.map(t => {
              const studentsCount = DB.students.filter(s => s.teacher_id === t.id).length;
              return `
                <div class="payment-list-row" style="cursor:default;">
                  <div class="payment-row-left">
                    <div class="avatar-small" style="background:#E1F8F1; color:#0F9E6E;">${getInitials(t.full_name)}</div>
                    <div class="payment-row-info">
                      <span class="payment-row-name">${t.full_name}</span>
                      <span class="payment-row-date">Phone: ${t.phone}</span>
                    </div>
                  </div>
                  <div class="payment-row-right">
                    <span class="badge badge-paid" style="font-size:9px;">${studentsCount} active students</span>
                    <button class="btn-icon-action" style="color:#E03E3E; width:28px; height:28px; font-size:12px;" onclick="showToast('${t.full_name} de-activation sheet opened', 'error')">✕</button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Section: Subscription Packages overview -->
        <div class="admin-card">
          <span class="section-title" style="font-size:13px;">Enterprise Billing Plans</span>
          <div class="payment-list-row" style="cursor:default; background-color:var(--bg-secondary);">
            <div class="payment-row-left">
              <span style="font-size:20px;">🛡️</span>
              <div class="payment-row-info">
                <span class="payment-row-name">Institution Standard Plan</span>
                <span class="payment-row-date">2 Teachers licensed • v1.0</span>
              </div>
            </div>
            <div class="payment-row-right">
              <span class="badge" style="background:#DDD6FE; color:#5B21B6;">ACTIVE PRO</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Super Admin bottom bar simulation -->
      <div class="shell-bottom-nav">
        <button class="nav-tab active">
          <span class="nav-tab-icon">🛡️</span>
          <span class="nav-tab-label">Admin Console</span>
        </button>
        <button class="nav-tab" onclick="router.navigate('/settings')">
          <span class="nav-tab-icon">${Icons.settings}</span>
          <span class="nav-tab-label">Settings</span>
        </button>
      </div>
    </div>
  `;
}

// Sub-components: Navigation items rendering
function renderTeacherBottomNav(activeTab) {
  return `
    <div class="shell-bottom-nav">
      <button class="nav-tab ${activeTab === 'home' ? 'active' : ''}" onclick="router.navigate('/teacher/dashboard')">
        <span class="nav-tab-icon">${Icons.home}</span>
        <span class="nav-tab-label">Home</span>
      </button>
      <button class="nav-tab ${activeTab === 'students' ? 'active' : ''}" onclick="state.studentFilter='all'; state.studentSearch=''; router.navigate('/teacher/students')">
        <span class="nav-tab-icon">${Icons.users}</span>
        <span class="nav-tab-label">Students</span>
      </button>
      <button class="nav-tab ${activeTab === 'payments' ? 'active' : ''}" onclick="router.navigate('/teacher/payments/add')">
        <span class="nav-tab-icon">${Icons.card}</span>
        <span class="nav-tab-label">Payments</span>
      </button>
      <button class="nav-tab ${activeTab === 'reports' ? 'active' : ''}" onclick="router.navigate('/teacher/reports')">
        <span class="nav-tab-icon">${Icons.chart}</span>
        <span class="nav-tab-label">Reports</span>
      </button>
      <button class="nav-tab ${activeTab === 'settings' ? 'active' : ''}" onclick="router.navigate('/settings')">
        <span class="nav-tab-icon">${Icons.settings}</span>
        <span class="nav-tab-label">Settings</span>
      </button>
    </div>
  `;
}

function renderStudentBottomNav(activeTab) {
  return `
    <div class="shell-bottom-nav">
      <button class="nav-tab ${activeTab === 'home' ? 'active' : ''}" onclick="router.navigate('/student/dashboard')">
        <span class="nav-tab-icon">${Icons.home}</span>
        <span class="nav-tab-label">Home</span>
      </button>
      <button class="nav-tab ${activeTab === 'payments' ? 'active' : ''}" onclick="router.navigate('/student/payments')">
        <span class="nav-tab-icon">${Icons.card}</span>
        <span class="nav-tab-label">Payments</span>
      </button>
      <button class="nav-tab" onclick="state.selectedReceiptId = DB.payments.filter(p => p.student_id === DB.students.find(st => st.user_id === state.currentUser.id).id)[0]?.id; if(state.selectedReceiptId) router.navigate('/receipt'); else showToast('No receipts generated yet', 'warning')">
        <span class="nav-tab-icon">📄</span>
        <span class="nav-tab-label">Receipts</span>
      </button>
      <button class="nav-tab ${activeTab === 'settings' ? 'active' : ''}" onclick="router.navigate('/settings')">
        <span class="nav-tab-icon">${Icons.settings}</span>
        <span class="nav-tab-label">Profile</span>
      </button>
    </div>
  `;
}

// 7. Actions & Auth flow handlers

// Login submit
// Login submit
async function handleLogin() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const errorBox = document.getElementById('login-error');

  if (!email || !password) {
    errorBox.textContent = "Email and password are required!";
    errorBox.style.display = 'block';
    return;
  }

  // Show login spinner
  const submitBtn = document.getElementById('btn-login-submit');
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<span class="spinner" style="width:16px; height:16px; border-width:2px; display:inline-block; margin-right:6px;"></span> Logging in...`;

  if (USE_SUPABASE) {
    try {
      const data = await dbLogin(email, password);
      // Synchronize database tables
      await syncFromSupabase();
      
      const foundProfile = DB.profiles.find(p => p.id === data.user.id);
      if (!foundProfile) {
        throw new Error("No database profile associated with this account. Contact your administrator.");
      }

      state.currentUser = foundProfile;
      showToast(`Welcome back, ${foundProfile.full_name}!`, 'success');
      
      if (foundProfile.role === 'teacher') router.navigate('/teacher/dashboard');
      else if (foundProfile.role === 'student') router.navigate('/student/dashboard');
      else if (foundProfile.role === 'super_admin') router.navigate('/admin');
    } catch (err) {
      errorBox.textContent = err.message || "Invalid credentials.";
      errorBox.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = "Login";
    }
  } else {
    // Pre-configured logins mapping
    let foundProfile = null;
    if (email === 'teacher@vault.com') {
      foundProfile = DB.profiles.find(p => p.id === 't1');
    } else if (email === 'student@vault.com') {
      foundProfile = DB.profiles.find(p => p.id === 's1');
    } else if (email === 'admin@vault.com') {
      foundProfile = DB.profiles.find(p => p.id === 'a1');
    } else {
      // General lookup
      foundProfile = DB.profiles.find(p => p.email === email || p.phone === email);
    }

    if (!foundProfile) {
      errorBox.textContent = "Invalid credentials. Test using: teacher@vault.com, student@vault.com, or admin@vault.com";
      errorBox.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = "Login";
      return;
    }

    setTimeout(() => {
      state.currentUser = foundProfile;
      showToast(`Welcome back, ${foundProfile.full_name}!`, 'success');
      
      if (foundProfile.role === 'teacher') router.navigate('/teacher/dashboard');
      else if (foundProfile.role === 'student') router.navigate('/student/dashboard');
      else if (foundProfile.role === 'super_admin') router.navigate('/admin');
    }, 1000);
  }
}

// Google OAuth Login
async function handleGoogleLogin() {
  if (USE_SUPABASE) {
    showToast("Connecting to Google OAuth...", "success");
    try {
      const { error } = await sb.auth.signInWithOAuth({ provider: 'google' });
      if (error) throw error;
    } catch (err) {
      if (err.message && (err.message.includes("provider is not enabled") || err.message.includes("validation_failed"))) {
        showToast("Google login is not enabled in your Supabase Auth settings. Please register/login with email & password!", "warning");
      } else {
        showToast(err.message, "error");
      }
    }
  } else {
    showToast("Connecting to Google OAuth...", "success");
    setTimeout(() => {
      state.currentUser = DB.profiles.find(p => p.id === 't1');
      showToast("Google Authentication successful!", "success");
      router.navigate('/teacher/dashboard');
    }, 1200);
  }
}

// Set register role
let selectedRegisterRole = 'student';
function setRegisterRole(role) {
  selectedRegisterRole = role;
  const sBtn = document.getElementById('btn-role-student');
  const tBtn = document.getElementById('btn-role-teacher');
  
  if (role === 'student') {
    sBtn.className = 'role-toggle-btn active';
    tBtn.className = 'role-toggle-btn';
  } else {
    sBtn.className = 'role-toggle-btn';
    tBtn.className = 'role-toggle-btn active';
  }
}

// Register submit
async function handleRegister() {
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const phone = document.getElementById('reg-phone').value.trim();
  const password = document.getElementById('reg-password').value;
  const errorBox = document.getElementById('register-error');

  if (!name || !email || !phone || !password) {
    errorBox.textContent = "All fields are required!";
    errorBox.style.display = 'block';
    return;
  }
  if (password.length < 6) {
    errorBox.textContent = "Password must be at least 6 characters!";
    errorBox.style.display = 'block';
    return;
  }

  const registerSubmit = document.getElementById('btn-register-submit');
  registerSubmit.disabled = true;
  registerSubmit.innerHTML = `<span class="spinner" style="width:16px; height:16px; border-width:2px; display:inline-block; margin-right:6px;"></span> Creating Account...`;

  if (USE_SUPABASE) {
    try {
      const data = await dbRegister(email, password, name, selectedRegisterRole, phone);
      showToast("Registration successful! Check verification email.", "success");
      router.navigate('/login');
    } catch (err) {
      errorBox.textContent = err.message || "Registration failed.";
      errorBox.style.display = 'block';
      registerSubmit.disabled = false;
      registerSubmit.innerHTML = "Register Now";
    }
  } else {
    setTimeout(() => {
      // 1. Create Supabase Auth profiles row
      const newUserId = 'u' + (DB.profiles.length + 1);
      const newProfile = {
        id: newUserId,
        full_name: name,
        email: email,
        role: selectedRegisterRole,
        phone: phone,
        avatar_url: '',
        created_at: new Date().toISOString()
      };
      DB.profiles.push(newProfile);

      // 2. If student, link student row (default to Amit Sharma as tutor)
      let newStudentId = '';
      if (selectedRegisterRole === 'student') {
        newStudentId = 'st' + (DB.students.length + 1);
        DB.students.push({
          id: newStudentId,
          user_id: newUserId,
          teacher_id: 't1', // default teacher
          fee_structure_id: 'fs1', // default fee monthly class 10
          batch_name: 'Class 10 - Maths',
          enrollment_date: new Date().toISOString().split('T')[0],
          status: 'active'
        });
      }

      // Flash tables explorer
      flashDbRow('profiles', newUserId);
      if (newStudentId) {
        flashDbRow('students', newStudentId);
      }

      showToast("Registration successful! Check verification email.", "success");
      router.navigate('/login');
    }, 1000);
  }
}

// Reset Password
function handleForgotPassword() {
  const email = document.getElementById('forgot-email').value.trim();
  if (!email) {
    showToast("Please enter email address!", "error");
    return;
  }

  const submitBtn = document.getElementById('btn-forgot-submit');
  submitBtn.disabled = true;
  submitBtn.textContent = "Sending reset link...";

  setTimeout(() => {
    document.getElementById('forgot-success').style.display = 'block';
    document.getElementById('forgot-input-group').style.display = 'none';
    submitBtn.style.display = 'none';
    showToast("Recovery link dispatched successfully!", "success");
  }, 1200);
}

// Add Student submit
async function handleAddStudent() {
  const name = document.getElementById('add-stud-name').value.trim();
  const email = document.getElementById('add-stud-email').value.trim();
  const phone = document.getElementById('add-stud-phone').value.trim();
  const batch = document.getElementById('add-stud-batch').value.trim();
  const feeId = document.getElementById('add-stud-fee').value;
  const enroll = document.getElementById('add-stud-enroll').value;
  const status = document.getElementById('add-stud-status').checked ? 'active' : 'inactive';
  const errBox = document.getElementById('add-student-error');

  if (!name || !email || !phone || !batch || !feeId) {
    errBox.textContent = "All starred (*) fields are required!";
    errBox.style.display = 'block';
    return;
  }

  if (USE_SUPABASE) {
    try {
      const { profile, student } = await dbAddStudent(name, email, phone, batch, feeId, enroll, status);
      await syncFromSupabase();
      
      flashDbRow('profiles', profile.id);
      flashDbRow('students', student.id);

      showToast(`${name} added successfully!`, "success");
      addSimulatedNotification('email', name, `Hi ${name}, welcome to TuitionVault! Your tutor has invited you.`);
      router.navigate('/teacher/students');
    } catch (err) {
      errBox.textContent = err.message || "Failed to add student.";
      errBox.style.display = 'block';
    }
  } else {
    // Create student flow
    // 1. Create a profile row for student
    const newUserId = 'u' + (DB.profiles.length + 1);
    const newProfile = {
      id: newUserId,
      full_name: name,
      email: email,
      role: 'student',
      phone: phone,
      avatar_url: '',
      created_at: new Date().toISOString()
    };
    DB.profiles.push(newProfile);

    // 2. Create student row linked to this profile
    const newStudentId = 'st' + (DB.students.length + 1);
    DB.students.push({
      id: newStudentId,
      user_id: newUserId,
      teacher_id: state.currentUser.id,
      fee_structure_id: feeId,
      batch_name: batch,
      enrollment_date: enroll,
      status: status
    });

    // Sync tabular databases explorer with highlighting
    flashDbRow('profiles', newUserId);
    flashDbRow('students', newStudentId);

    // Success notifications
    showToast(`${name} added. Welcome email invitation dispatched!`, "success");
    
    // Log message notifications in live panel
    addSimulatedNotification('email', name, `Hi ${name}, welcome to TuitionVault! Your tutor has invited you. Create your account.`);

    router.navigate('/teacher/students');
  }
}

// Record Payment submit
async function handleRecordPaymentSubmit() {
  const studId = document.getElementById('pay-student-select').value;
  const feeId = document.getElementById('pay-fee-id').value;
  const amount = parseFloat(document.getElementById('pay-amount').value);
  const date = document.getElementById('pay-date').value;
  const method = document.getElementById('pay-method').value;
  const notes = document.getElementById('pay-notes').value.trim();
  const errBox = document.getElementById('payment-error');

  if (!studId || !amount || isNaN(amount)) {
    errBox.textContent = "All starred (*) fields are required!";
    errBox.style.display = 'block';
    return;
  }

  // Calculate transaction status
  const fee = DB.fee_structures.find(f => f.id === feeId);
  const currentPaid = getStudentFeeStatus(studId).paid;
  const totalAmountDue = fee ? fee.amount : amount;
  const newTotalPaid = currentPaid + amount;

  let finalStatus = 'paid';
  if (newTotalPaid < totalAmountDue) {
    finalStatus = 'partial';
  }

  if (USE_SUPABASE) {
    try {
      const paymentDateISO = new Date(date).toISOString();
      const data = await dbRecordPayment(studId, feeId, amount, paymentDateISO, method, finalStatus, notes);
      await syncFromSupabase();
      
      flashDbRow('payments', data.id);
      showRecordPaymentSuccessSheet(data.id, studId, amount);
    } catch (err) {
      errBox.textContent = err.message || "Failed to record payment.";
      errBox.style.display = 'block';
    }
  } else {
    // Save payment
    const newPaymentId = 'p' + (DB.payments.length + 1);
    const newPayment = {
      id: newPaymentId,
      student_id: studId,
      fee_structure_id: feeId,
      amount_paid: amount,
      payment_date: new Date(date).toISOString(),
      method: method,
      status: finalStatus,
      receipt_url: `receipt_${newPaymentId}.pdf`,
      notes: notes
    };

    DB.payments.push(newPayment);

    // Highlight tabular databases
    flashDbRow('payments', newPaymentId);

    // Setup bottom sheet overlay success modal
    showRecordPaymentSuccessSheet(newPaymentId, studId, amount);
  }
}

// Handle Record Payment student select change
function handleRecordPaymentStudentChange(studId) {
  state.selectedStudentId = studId;
  renderScreen();
}

function setPaymentMethod(method, elem) {
  // Update input
  document.getElementById('pay-method').value = method;
  
  // Update class active status
  const siblings = elem.parentNode.children;
  for (let sib of siblings) {
    sib.className = 'radio-chip';
  }
  elem.className = 'radio-chip active';
}

// Show standard toast alert
function showToast(msg, type = 'success') {
  const container = document.getElementById('phone-toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✓' : (type === 'error' ? '✕' : '⚠')}</span>
    <span>${msg}</span>
  `;
  container.appendChild(toast);

  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.style.animation = 'slideInDown 0.3s ease-out reverse forwards';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 2500);
}

// Context view helpers
function viewStudentProfile(id) {
  state.selectedStudentId = id;
  router.navigate('/teacher/students/profile');
}

function viewReceipt(receiptId) {
  state.selectedReceiptId = receiptId;
  router.navigate('/receipt');
}

function handleReceiptBack() {
  const role = state.currentUser.role;
  if (role === 'teacher') {
    router.navigate('/teacher/dashboard');
  } else {
    router.navigate('/student/dashboard');
  }
}

function handleSettingsBack() {
  const role = state.currentUser.role;
  if (role === 'teacher') {
    router.navigate('/teacher/dashboard');
  } else if (role === 'student') {
    router.navigate('/student/dashboard');
  } else {
    router.navigate('/admin');
  }
}

function handleRecordPaymentBack() {
  const origin = state.selectedStudentId;
  if (origin) {
    router.navigate('/teacher/students/profile');
  } else {
    router.navigate('/teacher/dashboard');
  }
}

// Reminder screens: Select All
function toggleSelectAllReminders(isChecked) {
  const checkboxes = document.getElementsByName('reminder-student-checkbox');
  for (let box of checkboxes) {
    box.checked = isChecked;
  }
}

// Toggle datepicker schedule visibility
function handleScheduleToggle(val) {
  const group = document.getElementById('reminder-datepicker-group');
  if (val === 'schedule') {
    group.style.display = 'block';
  } else {
    group.style.display = 'none';
  }
}

// Send reminders submit
async function handleSendRemindersSubmit() {
  const checkedBoxes = document.querySelectorAll('input[name="reminder-student-checkbox"]:checked');
  const msgTemplate = document.getElementById('reminder-template').value.trim();
  const scheduleOpt = document.getElementById('reminder-schedule').value;
  const scheduleTime = document.getElementById('reminder-schedule-date').value;
  
  // Channels checked
  const channels = [];
  if (document.getElementById('rem-channel-wa').checked) channels.push('whatsapp');
  if (document.getElementById('rem-channel-sms').checked) channels.push('sms');
  if (document.getElementById('rem-channel-email').checked) channels.push('email');

  if (checkedBoxes.length === 0) {
    showToast("Kripya kam se kam ek student select karein!", "error");
    return;
  }
  if (channels.length === 0) {
    showToast("Kripya notification channel select karein!", "error");
    return;
  }

  const submitBtn = document.getElementById('btn-reminder-submit');
  submitBtn.disabled = true;
  submitBtn.textContent = "Processing reminders...";

  if (USE_SUPABASE) {
    try {
      for (let box of checkedBoxes) {
        const studId = box.value;
        const student = DB.students.find(s => s.id === studId);
        const user = DB.profiles.find(u => u.id === student.user_id);
        const statusObj = getStudentFeeStatus(studId);

        // Customize message template text
        let customizedMsg = msgTemplate
          .replace('[Student Name]', user.full_name)
          .replace('[Amount]', statusObj.due - statusObj.paid);

        const sentAt = scheduleOpt === 'now' ? new Date().toISOString() : new Date(scheduleTime).toISOString();
        const status = scheduleOpt === 'now' ? 'sent' : 'pending';

        const data = await dbSendReminder(studId, customizedMsg, channels[0], sentAt, status);
        
        // Trigger simulated incoming alerts in drawer
        channels.forEach(ch => {
          addSimulatedNotification(ch, user.full_name, customizedMsg);
        });
      }

      await syncFromSupabase();
      showToast(`Reminder sent successfully to ${checkedBoxes.length} students!`, "success");
      router.navigate('/teacher/dashboard');
    } catch (err) {
      showToast(err.message || "Failed to process reminders.", "error");
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Reminder";
    }
  } else {
    setTimeout(() => {
      // Send reminder row insertion loop
      checkedBoxes.forEach((box, index) => {
        const studId = box.value;
        const student = DB.students.find(s => s.id === studId);
        const user = DB.profiles.find(u => u.id === student.user_id);
        const statusObj = getStudentFeeStatus(studId);

        // Customize message template text
        let customizedMsg = msgTemplate
          .replace('[Student Name]', user.full_name)
          .replace('[Amount]', statusObj.due - statusObj.paid);

        const reminderId = 'r' + (DB.reminders.length + 1);
        
        const newReminderRecord = {
          id: reminderId,
          student_id: studId,
          message: customizedMsg,
          channel: channels[0], // primary
          sent_at: scheduleOpt === 'now' ? new Date().toISOString() : new Date(scheduleTime).toISOString(),
          status: scheduleOpt === 'now' ? 'sent' : 'pending'
        };

        DB.reminders.push(newReminderRecord);

        // Flash in table view
        flashDbRow('reminders', reminderId);

        // Trigger simulated incoming alerts in drawer
        channels.forEach(ch => {
          addSimulatedNotification(ch, user.full_name, customizedMsg);
        });
      });

      showToast(`Reminder sent successfully to ${checkedBoxes.length} students!`, "success");
      router.navigate('/teacher/dashboard');
    }, 1000);
  }
}

// Dynamically preview reminder template text
function updateReminderPreview(templateVal) {
  const previewDiv = document.getElementById('reminder-preview-div');
  if (!previewDiv) return;

  // Render first pending student as preview
  const teacher = state.currentUser;
  const pending = DB.students.find(s => s.teacher_id === teacher.id && getStudentFeeStatus(s.id).status !== 'paid');
  
  if (pending) {
    const userObj = DB.profiles.find(u => u.id === pending.user_id);
    const statusObj = getStudentFeeStatus(pending.id);
    
    let text = templateVal
      .replace('[Student Name]', userObj.full_name)
      .replace('[Amount]', statusObj.due - statusObj.paid);
      
    previewDiv.textContent = text;
  }
}

// Simulated payments gateway trigger (UPI Modal)
function triggerSimulatedPaymentGateway(studentId, amount) {
  const student = DB.students.find(s => s.id === studentId);
  const user = DB.profiles.find(u => u.id === student.user_id);
  const fee = DB.fee_structures.find(f => f.id === student.fee_structure_id);

  const container = document.getElementById('phone-screen-content');
  
  const paymentOverlay = document.createElement('div');
  paymentOverlay.className = 'modal-overlay';
  paymentOverlay.id = 'sim-payment-gateway-overlay';
  paymentOverlay.innerHTML = `
    <div class="modal-box" style="max-width:340px; border-top: 6px solid #1849A9;">
      <h3 class="modal-title" style="display:flex; align-items:center; gap:8px; justify-content:center; color:#1849A9;">
        🛡️ TuitionVault Secure UPI
      </h3>
      <div class="modal-body" style="font-size:12px; text-align:left; background:var(--bg-secondary); border-radius:8px; padding:12px;">
        <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
          <span>Merchant Name:</span>
          <b>${DB.profiles.find(p => p.id === student.teacher_id).full_name}</b>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
          <span>Student User:</span>
          <b>${user.full_name}</b>
        </div>
        <div style="display:flex; justify-content:space-between; border-top:1px dashed var(--border-default); padding-top:6px; margin-top:6px; font-weight:600;">
          <span>Total Amount Payable:</span>
          <span style="color:#1849A9;">₹${amount}</span>
        </div>
      </div>

      <div class="form-group" style="text-align:left; margin-bottom:0;">
        <label class="form-label">Select Simulated Bank Method</label>
        <select class="form-input" id="sim-gateway-method" style="height:40px; font-size:12px;">
          <option value="upi">GPay / PhonePe UPI</option>
          <option value="card">Credit Card Gateway</option>
          <option value="bank_transfer">Net Banking</option>
        </select>
      </div>

      <div class="modal-actions">
        <button class="btn-modal-cancel" onclick="document.getElementById('sim-payment-gateway-overlay').remove()">Cancel</button>
        <button class="btn-modal-confirm" style="background-color:#0F9E6E; color:white;" onclick="processSimulatedPayment('${studentId}', '${fee.id}', ${amount})">Confirm Pay</button>
      </div>
    </div>
  `;

  container.appendChild(paymentOverlay);
}

// Process Simulated Student checkout
function processSimulatedPayment(studId, feeId, amount) {
  const method = document.getElementById('sim-gateway-method').value;
  
  // Remove modal
  document.getElementById('sim-payment-gateway-overlay').remove();

  // Create payment record
  const newPaymentId = 'p' + (DB.payments.length + 1);
  const newPaymentRecord = {
    id: newPaymentId,
    student_id: studId,
    fee_structure_id: feeId,
    amount_paid: amount,
    payment_date: new Date().toISOString(),
    method: method,
    status: 'paid',
    receipt_url: `receipt_${newPaymentId}.pdf`,
    notes: 'Paid via simulated secure student gateway'
  };

  DB.payments.push(newPaymentRecord);

  // Sync explorer
  flashDbRow('payments', newPaymentId);

  showToast("Payment captured successfully!", "success");
  
  // Show Receipt Screen
  state.selectedReceiptId = newPaymentId;
  router.navigate('/receipt');
}

// Add logs inside Live Explorer log drawer
function addSimulatedNotification(channel, studentName, message) {
  const container = document.getElementById('notification-logs-drawer');
  if (!container) return;

  const item = {
    channel: channel,
    to: studentName,
    msg: message,
    sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  };

  state.notificationLogs.unshift(item);

  const notifHTML = `
    <div class="notification-item">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span class="notif-channel-badge notif-${channel}">${channel}</span>
        <span style="font-size:9px; color:var(--text-muted);">${item.sentAt}</span>
      </div>
      <div style="font-weight:600; color:var(--text-primary);">To: ${studentName}</div>
      <div style="color:var(--text-secondary); white-space: normal; word-break: break-all;">"${message}"</div>
    </div>
  `;

  container.insertAdjacentHTML('afterbegin', notifHTML);
}

// Record Payment Bottom Sheet Overlay
function showRecordPaymentSuccessSheet(paymentId, studId, amount) {
  const container = document.getElementById('phone-screen-content');
  
  const bottomSheetOverlay = document.createElement('div');
  bottomSheetOverlay.className = 'bottom-sheet-overlay';
  bottomSheetOverlay.id = 'payment-success-sheet-overlay';
  bottomSheetOverlay.style.display = 'flex';
  
  bottomSheetOverlay.innerHTML = `
    <div class="bottom-sheet show" style="transform:translateY(0);">
      <div class="bottom-sheet-header">
        <span class="bottom-sheet-title" style="color:#0F9E6E; font-weight:700; display:flex; align-items:center; gap:6px;">
          ✓ Payment Captured Successfully!
        </span>
        <button class="btn-sheet-close" onclick="closePaymentSuccessSheet('${paymentId}')">✕</button>
      </div>

      <div style="font-size:12px; line-height:1.4; color:var(--text-secondary);">
        Payment reference <b>${paymentId.toUpperCase()}</b> for amount <b>₹${amount}</b> has been written to the ledger. PDF Receipt generated.
      </div>

      <div style="display:flex; flex-direction:column; gap:8px;">
        <button class="btn-full btn-primary" style="background-color:#0F9E6E;" onclick="showToast('Receipt shared via WhatsApp!', 'success')">
          Share Receipt via WhatsApp
        </button>
        <button class="btn-outline btn-full" style="height:44px;" onclick="showToast('Receipt PDF downloaded to device!', 'success')">
          Download PDF Receipt
        </button>
        <button class="btn-outline btn-full" style="height:44px;" onclick="showToast('Receipt link sent via email!', 'success')">
          Email Receipt Link
        </button>
      </div>

      <button class="btn-full btn-primary" onclick="closePaymentSuccessSheet('${paymentId}')" style="margin-top:8px; height:48px;">
        Done
      </button>
    </div>
  `;

  container.appendChild(bottomSheetOverlay);
}

function closePaymentSuccessSheet(paymentId) {
  document.getElementById('payment-success-sheet-overlay').remove();
  // Redirect to receipts view or dashboard
  state.selectedReceiptId = paymentId;
  router.navigate('/receipt');
}

// Deactivate Student dialog trigger
function triggerDeactivateModal(studentId) {
  const container = document.getElementById('phone-screen-content');
  
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';
  modalOverlay.id = 'deactivate-student-modal';
  
  modalOverlay.innerHTML = `
    <div class="modal-box">
      <h3 class="modal-title" style="color:#E03E3E;">Deactivate Student?</h3>
      <p class="modal-body">
        Kya aap sure hain? Active status inactive ho jayega, and they will be filtered from active rosters.
      </p>
      <div class="modal-actions">
        <button class="btn-modal-cancel" onclick="document.getElementById('deactivate-student-modal').remove()">No, Cancel</button>
        <button class="btn-modal-confirm" onclick="confirmDeactivateStudent('${studentId}')">Yes, Deactivate</button>
      </div>
    </div>
  `;

  container.appendChild(modalOverlay);
}

async function confirmDeactivateStudent(studentId) {
  document.getElementById('deactivate-student-modal').remove();
  
  if (USE_SUPABASE) {
    try {
      await dbDeactivateStudent(studentId);
      await syncFromSupabase();
      
      flashDbRow('students', studentId);
      showToast("Student status changed to inactive", "warning");
      router.navigate('/teacher/students');
    } catch (err) {
      showToast(err.message || "Failed to deactivate student.", "error");
    }
  } else {
    const student = DB.students.find(s => s.id === studentId);
    if (student) {
      student.status = 'inactive';
      flashDbRow('students', studentId);
      showToast("Student status changed to inactive", "warning");
      router.navigate('/teacher/students');
    }
  }
}

// Broadcast announcement from super admin
function handleBroadcastAnnounce() {
  const text = document.getElementById('broadcast-msg').value.trim();
  if (!text) {
    showToast("Kripya message enter karein!", "error");
    return;
  }

  showToast("Broadcasting institution alert...", "success");
  setTimeout(() => {
    // Simulated delivery to active students
    DB.students.forEach(st => {
      const user = DB.profiles.find(u => u.id === st.user_id);
      addSimulatedNotification('sms', user.full_name, `[BROADCAST] ${text}`);
    });
    
    document.getElementById('broadcast-msg').value = '';
    showToast("Broadcast processed to all contacts!", "success");
  }, 1000);
}

// Logout dialog triggers
function triggerLogoutModal() {
  const container = document.getElementById('phone-screen-content');
  
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';
  modalOverlay.id = 'logout-confirm-modal';
  
  modalOverlay.innerHTML = `
    <div class="modal-box">
      <h3 class="modal-title">Logout?</h3>
      <p class="modal-body">
        Kya aap sure hain ki aap logout karna chahte ho?
      </p>
      <div class="modal-actions">
        <button class="btn-modal-cancel" onclick="document.getElementById('logout-confirm-modal').remove()">No, Stay</button>
        <button class="btn-modal-confirm" style="background-color:#E03E3E;" onclick="confirmLogout()">Yes, Logout</button>
      </div>
    </div>
  `;

  container.appendChild(modalOverlay);
}

async function confirmLogout() {
  document.getElementById('logout-confirm-modal').remove();
  
  if (USE_SUPABASE) {
    try {
      await dbLogout();
    } catch (err) {
      console.warn("Supabase signout failed:", err);
    }
  }
  
  state.currentUser = null;
  showToast("Logged out successfully!", "warning");
  router.navigate('/login');
}

// Helper: Initials collector
function getInitials(name) {
  if (!name) return "U";
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

// Search debounce
let debounceTimer;
function debounceRenderStudents() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    renderScreen();
  }, 300);
}

// 8. Role bypass quick selector in developer tools panel
function setDeveloperSession(role) {
  if (role === 'logged_out') {
    state.currentUser = null;
    showToast("Session reset to Guest", "warning");
    router.navigate('/login');
    return;
  }
  
  const profile = DB.profiles.find(p => p.role === role);
  if (profile) {
    state.currentUser = profile;
    showToast(`Developer Bypass: Logged in as ${profile.full_name}`, "success");
    
    if (role === 'teacher') router.navigate('/teacher/dashboard');
    else if (role === 'student') router.navigate('/student/dashboard');
    else if (role === 'super_admin') router.navigate('/admin');
  }
}

// Reset Database to Seed data state
function resetDatabaseDemo() {
  // Re-seed DB
  DB.students = [
    { id: 'st1', user_id: 's1', teacher_id: 't1', fee_structure_id: 'fs1', batch_name: 'Class 10 - Maths', enrollment_date: '2026-03-01', status: 'active' },
    { id: 'st2', user_id: 's2', teacher_id: 't1', fee_structure_id: 'fs1', batch_name: 'Class 10 - Maths', enrollment_date: '2026-03-05', status: 'active' },
    { id: 'st3', user_id: 's3', teacher_id: 't1', fee_structure_id: 'fs2', batch_name: 'Class 12 - Physics', enrollment_date: '2026-03-10', status: 'active' },
    { id: 'st4', user_id: 's4', teacher_id: 't2', fee_structure_id: 'fs3', batch_name: 'IIT JEE Prep', enrollment_date: '2026-03-12', status: 'active' }
  ];
  DB.payments = [
    { id: 'p1', student_id: 'st1', fee_structure_id: 'fs1', amount_paid: 1500.00, payment_date: '2026-05-08T10:00:00Z', method: 'upi', status: 'paid', receipt_url: 'receipt_p1.pdf', notes: 'Paid via GPay' },
    { id: 'p2', student_id: 'st2', fee_structure_id: 'fs1', amount_paid: 1500.00, payment_date: '2026-05-12T14:30:00Z', method: 'cash', status: 'paid', receipt_url: 'receipt_p2.pdf', notes: '' },
    { id: 'p3', student_id: 'st3', fee_structure_id: 'fs2', amount_paid: 1200.00, payment_date: '2026-05-16T18:00:00Z', method: 'bank_transfer', status: 'partial', receipt_url: 'receipt_p3.pdf', notes: 'Partial fees paid' }
  ];
  DB.reminders = [
    { id: 'r1', student_id: 'st3', message: 'Dear Aman Kumar, your fee for Class 12 - Physics is pending.', channel: 'whatsapp', sent_at: '2026-05-15T09:00:00Z', status: 'sent' }
  ];

  showToast("Database refreshed to seed state!", "success");
  renderScreen();
}
