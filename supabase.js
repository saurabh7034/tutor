/* =========================================================
   TuitionVault — Live Supabase Connector & Sync Layer
   ========================================================= */

const SUPABASE_URL = "https://esrhpijlkvzelpwwlrex.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzcmhwaWpsa3Z6ZWxwd3dscmV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NDMyNTAsImV4cCI6MjA5NTQxOTI1MH0.8_CsTZ0xXTRBCEbdSCFRmch0rT6yVoLduBZ7oFrnx6o";

// Initialize the Supabase Client
const sb = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

if (sb) {
  console.log("⚡ [Supabase] Live Client initialized successfully!");
} else {
  console.error("✕ [Supabase] Failed to initialize client. CDN script not loaded.");
}

/**
 * Syncs the local memory DB object with active rows fetched from the Supabase API.
 * Because the queries use the authenticated user credentials, RLS automatically
 * filters rows, keeping the data isolated as per security boundaries.
 */
async function syncFromSupabase() {
  if (!sb) return false;
  
  try {
    const user = sb.auth.user ? sb.auth.user() : (await sb.auth.getUser()).data.user;
    if (!user) {
      console.warn("[Supabase Sync] No authenticated user session found.");
      return false;
    }

    console.log("[Supabase Sync] Synchronizing local DB with live data...");

    // 1. Sync Profiles
    const { data: profiles, error: errProfiles } = await sb
      .from('profiles')
      .select('*');
    if (!errProfiles && profiles) DB.profiles = profiles;

    // 2. Sync Students
    const { data: students, error: errStudents } = await sb
      .from('students')
      .select('*');
    if (!errStudents && students) DB.students = students;

    // 3. Sync Fee Structures
    const { data: feeStructures, error: errFee } = await sb
      .from('fee_structures')
      .select('*');
    if (!errFee && feeStructures) DB.fee_structures = feeStructures;

    // 4. Sync Payments
    const { data: payments, error: errPayments } = await sb
      .from('payments')
      .select('*');
    if (!errPayments && payments) DB.payments = payments;

    // 5. Sync Reminders
    const { data: reminders, error: errReminders } = await sb
      .from('reminders')
      .select('*');
    if (!errReminders && reminders) DB.reminders = reminders;

    console.log("[Supabase Sync] Synchronization complete. Local mirrors updated.");
    return true;
  } catch (error) {
    console.error("[Supabase Sync] Failed to synchronize state:", error);
    return false;
  }
}

/**
 * Authentication Wrapper: Sign in using email and password
 */
async function dbLogin(email, password) {
  if (!sb) throw new Error("Supabase client is not loaded.");
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

/**
 * Authentication Wrapper: Sign up using email, password, and custom metadata.
 * Trigger `on_auth_user_created` will auto-insert into public.profiles on Postgres.
 */
async function dbRegister(email, password, name, role, phone) {
  if (!sb) throw new Error("Supabase client is not loaded.");
  const { data, error } = await sb.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
        role: role,
        phone: phone
      }
    }
  });
  if (error) throw error;
  return data;
}

/**
 * Authentication Wrapper: Logout
 */
async function dbLogout() {
  if (!sb) return;
  const { error } = await sb.auth.signOut();
  if (error) throw error;
}

/**
 * Database Mutations: Add Student
 * Inserts a new student user profile first, then links it to the student index table.
 */
async function dbAddStudent(name, email, phone, batch, feeId, enrollmentDate, status) {
  if (!sb) throw new Error("Supabase client is not loaded.");

  // To let the teacher create students without triggering real email verification during demo,
  // we will insert the profile directly using a generated UUID, then link the student row.
  const newUserId = self.crypto.randomUUID ? self.crypto.randomUUID() : 'u-live-' + Date.now();

  // 1. Create public profile
  const { data: profile, error: pErr } = await sb
    .from('profiles')
    .insert({
      id: newUserId,
      full_name: name,
      role: 'student',
      phone: phone,
      avatar_url: ''
    })
    .select()
    .single();

  if (pErr) throw pErr;

  // 2. Create student entry
  const { data: student, error: sErr } = await sb
    .from('students')
    .insert({
      user_id: newUserId,
      teacher_id: sb.auth.user ? sb.auth.user().id : (await sb.auth.getUser()).data.user.id,
      fee_structure_id: feeId,
      batch_name: batch,
      enrollment_date: enrollmentDate,
      status: status
    })
    .select()
    .single();

  if (sErr) throw sErr;

  return { profile, student };
}

/**
 * Database Mutations: Record Payment
 */
async function dbRecordPayment(studentId, feeStructureId, amountPaid, paymentDate, method, status, notes) {
  if (!sb) throw new Error("Supabase client is not loaded.");

  const { data, error } = await sb
    .from('payments')
    .insert({
      student_id: studentId,
      fee_structure_id: feeStructureId,
      amount_paid: amountPaid,
      payment_date: paymentDate,
      method: method,
      status: status,
      notes: notes
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Database Mutations: Send Reminder Log Entry
 */
async function dbSendReminder(studentId, message, channel, sentAt, status) {
  if (!sb) throw new Error("Supabase client is not loaded.");

  const { data, error } = await sb
    .from('reminders')
    .insert({
      student_id: studentId,
      message: message,
      channel: channel,
      sent_at: sentAt,
      status: status
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Database Mutations: Deactivate Student
 */
async function dbDeactivateStudent(studentId) {
  if (!sb) throw new Error("Supabase client is not loaded.");

  const { data, error } = await sb
    .from('students')
    .update({ status: 'inactive' })
    .eq('id', studentId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
