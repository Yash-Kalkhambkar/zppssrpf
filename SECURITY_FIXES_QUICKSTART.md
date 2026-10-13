# Security Fixes Quick Start Guide

## 🚨 STOP! Do NOT Deploy Until These Are Fixed

### 1. Fix Environment Variables (5 minutes)

**Current .env:**
```env
VITE_SUPABASE_URL=https://ytmwznrhuvrjgdmcrsjc.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_7pmU1YVeOtexCW48reF_hg_5BwJO7gz
```

**Fixed .env:**
```env
VITE_SUPABASE_URL=https://ytmwznrhuvrjgdmcrsjc.supabase.co
VITE_SUPABASE_ANON_KEY=<get_this_from_supabase_dashboard>
```

**Steps:**
1. Go to Supabase Dashboard → Settings → API
2. Copy "anon/public" key (NOT the service_role key!)
3. Replace `VITE_SUPABASE_PUBLISHABLE_KEY` with `VITE_SUPABASE_ANON_KEY`
4. Verify `.env` is in `.gitignore` ✓ (already done)

---

### 2. Remove Mock Authentication (30 minutes)

**Files to modify:**
- `src/context/AuthContext.tsx`
- `src/pages/Admin.tsx`

**In AuthContext.tsx:**
```typescript
// DELETE these functions entirely:
const [isMock, setIsMock] = useState(false);
const mockLogin = () => { ... };

// REMOVE mock check in useEffect:
if (!isSupabaseConfigured) {
  const storedMock = localStorage.getItem('mockSession');
  // ... DELETE ALL THIS
}

// UPDATE signOut to only use real auth:
const signOut = async () => {
  await supabase.auth.signOut();
};
```

**In Admin.tsx - LoginForm:**
```typescript
// REMOVE default values:
<input 
  type="email" 
  required 
  // DELETE THIS LINE: defaultValue="principal@school.com"
/>
<input 
  type="password" 
  required 
  // DELETE THIS LINE: defaultValue="password123"
/>

// REPLACE mockLogin with real Supabase auth:
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  
  const formData = new FormData(e.currentTarget);
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
  } catch (err: any) {
    setError(err.message || 'Login failed');
  }
  setLoading(false);
};
```

---

### 3. Add Route Protection (1 hour)

**Create new file: `src/components/ProtectedRoute.tsx`**
```typescript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin-login" replace />;
  }

  return <>{children}</>;
}
```

**Install React Router:**
```bash
npm install react-router-dom
```

**Update App.tsx:**
```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <div className="bg-surface text-on-surface font-body-md antialiased overflow-x-hidden min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow flex flex-col">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/achievements" element={<Achievements />} />
                <Route path="/facilities" element={<Facilities />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admission" element={<Admission />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute>
                      <Admin />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}
```

---

### 4. Verify Supabase RLS (2 hours)

**Go to Supabase SQL Editor and run:**

```sql
-- 1. Check if RLS is enabled on all tables
SELECT 
  schemaname, 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN (
    'notices', 
    'highlights', 
    'timeline_events', 
    'app_settings', 
    'contact_inquiries', 
    'admissions'
  );

-- If any show rowsecurity = false, enable it:
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE admissions ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies and recreate them strictly:

-- NOTICES
DROP POLICY IF EXISTS "Allow public read access on notices" ON notices;
DROP POLICY IF EXISTS "Allow authenticated insert" ON notices;
DROP POLICY IF EXISTS "Allow authenticated delete" ON notices;

CREATE POLICY "Anyone can view notices"
  ON notices FOR SELECT
  USING (true);

CREATE POLICY "Only authenticated users can insert notices"
  ON notices FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update notices"
  ON notices FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can delete notices"
  ON notices FOR DELETE
  USING (auth.role() = 'authenticated');

-- HIGHLIGHTS
DROP POLICY IF EXISTS "Allow public read access on highlights" ON highlights;
DROP POLICY IF EXISTS "Allow authenticated insert" ON highlights;
DROP POLICY IF EXISTS "Allow authenticated delete" ON highlights;

CREATE POLICY "Anyone can view highlights"
  ON highlights FOR SELECT
  USING (true);

CREATE POLICY "Only authenticated users can manage highlights"
  ON highlights FOR ALL
  USING (auth.role() = 'authenticated');

-- TIMELINE EVENTS
DROP POLICY IF EXISTS "Allow public read access on timeline_events" ON timeline_events;
DROP POLICY IF EXISTS "Allow authenticated insert" ON timeline_events;
DROP POLICY IF EXISTS "Allow authenticated delete" ON timeline_events;

CREATE POLICY "Anyone can view timeline"
  ON timeline_events FOR SELECT
  USING (true);

CREATE POLICY "Only authenticated users can manage timeline"
  ON timeline_events FOR ALL
  USING (auth.role() = 'authenticated');

-- APP SETTINGS
DROP POLICY IF EXISTS "Allow public read access on app_settings" ON app_settings;
DROP POLICY IF EXISTS "Allow authenticated update" ON app_settings;

CREATE POLICY "Anyone can view settings"
  ON app_settings FOR SELECT
  USING (true);

CREATE POLICY "Only authenticated users can manage settings"
  ON app_settings FOR ALL
  USING (auth.role() = 'authenticated');

-- ADMISSIONS (Public can insert, admin can read)
DROP POLICY IF EXISTS "Allow public insert on admissions" ON admissions;
DROP POLICY IF EXISTS "Allow authenticated read on admissions" ON admissions;

CREATE POLICY "Anyone can submit admission"
  ON admissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can view admissions"
  ON admissions FOR SELECT
  USING (auth.role() = 'authenticated');

-- CONTACT INQUIRIES (Public can insert, admin can read)
DROP POLICY IF EXISTS "Allow public insert on contact_inquiries" ON contact_inquiries;
DROP POLICY IF EXISTS "Allow authenticated read on contact_inquiries" ON contact_inquiries;

CREATE POLICY "Anyone can submit inquiry"
  ON contact_inquiries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can view inquiries"
  ON contact_inquiries FOR SELECT
  USING (auth.role() = 'authenticated');

-- 3. Create admin user in Supabase Auth
-- Go to: Authentication → Users → Add user
-- Email: principal@zppssrpcamp.edu.in
-- Password: <strong-password-here>
-- Auto Confirm User: YES
```

**Test RLS:**
1. Log out of Supabase
2. Try to insert/update/delete data via API (should fail)
3. Log in as admin
4. Try to insert/update/delete data (should succeed)

---

### 5. Add Input Validation (3 hours)

**Install Zod:**
```bash
npm install zod
```

**Create validation schemas: `src/lib/validation.ts`**
```typescript
import { z } from 'zod';

export const admissionSchema = z.object({
  student_first_name: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Only letters and spaces allowed'),
  
  student_last_name: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Only letters and spaces allowed'),
  
  dob: z
    .string()
    .refine(val => !isNaN(Date.parse(val)), 'Invalid date')
    .refine(val => {
      const age = (new Date().getTime() - new Date(val).getTime()) / (1000 * 60 * 60 * 24 * 365);
      return age >= 5 && age <= 15;
    }, 'Student must be between 5 and 15 years old'),
  
  grade_applying: z
    .string()
    .regex(/^[1-7]$/, 'Grade must be between 1 and 7'),
  
  parent_name: z
    .string()
    .min(2, 'Parent name must be at least 2 characters')
    .max(100, 'Parent name must be less than 100 characters'),
  
  contact_number: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number'),
  
  address: z
    .string()
    .min(10, 'Address must be at least 10 characters')
    .max(500, 'Address must be less than 500 characters')
});

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  
  email: z
    .string()
    .email('Invalid email address'),
  
  subject: z
    .string()
    .min(1, 'Please select a subject'),
  
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters')
});

export const noticeSchema = z.object({
  day: z
    .string()
    .regex(/^[0-9]{1,2}$/, 'Day must be 1-2 digits'),
  
  month: z
    .string()
    .min(3, 'Month abbreviation required')
    .max(4, 'Month too long'),
  
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be less than 100 characters'),
  
  desc: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  
  active: z.boolean()
});
```

**Update Admission.tsx:**
```typescript
import { admissionSchema } from '../lib/validation';

const [errors, setErrors] = useState<Record<string, string>>({});

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);
  setErrors({});
  
  const formData = new FormData(e.currentTarget);
  const data = {
    student_first_name: formData.get('studentFirstName') as string,
    student_last_name: formData.get('studentLastName') as string,
    dob: formData.get('dob') as string,
    grade_applying: formData.get('grade') as string,
    parent_name: formData.get('parentName') as string,
    contact_number: formData.get('contactNumber') as string,
    address: formData.get('address') as string,
  };

  // Validate
  const validation = admissionSchema.safeParse(data);
  if (!validation.success) {
    const fieldErrors: Record<string, string> = {};
    validation.error.errors.forEach(err => {
      if (err.path[0]) {
        fieldErrors[err.path[0] as string] = err.message;
      }
    });
    setErrors(fieldErrors);
    setLoading(false);
    return;
  }

  try {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('admissions').insert([validation.data]);
      if (error) throw error;
    } else {
      await new Promise(r => setTimeout(r, 1000));
    }
    setSuccess(true);
    e.currentTarget.reset();
  } catch (err) {
    alert('Failed to submit form. Please try again.');
  } finally {
    setLoading(false);
  }
};

// In JSX, add error messages:
<div>
  <label>First Name *</label>
  <input name="studentFirstName" required />
  {errors.student_first_name && (
    <span className="text-error text-sm block mt-1">
      {errors.student_first_name}
    </span>
  )}
</div>
```

---

## ⚡ After These 5 Fixes

Your app will be:
- ✅ Properly connected to Supabase
- ✅ Secured with real authentication
- ✅ Protected from unauthorized access
- ✅ Database secured with RLS
- ✅ Forms validated properly

**Time Required:** ~6 hours total

**Next Steps:** See `PRODUCTION_READINESS_AUDIT.md` for Week 2 priorities (rate limiting, CSRF, security headers)

---

## 🧪 Testing Checklist

After implementing these fixes:

- [ ] Can you access Supabase data?
- [ ] Does login work with real credentials?
- [ ] Can anonymous users NOT access /admin?
- [ ] Can authenticated users access /admin?
- [ ] Do forms validate properly?
- [ ] Do forms submit to Supabase?
- [ ] Can you CRUD notices/highlights/timeline?
- [ ] Can public users submit admission/contact forms?
- [ ] Can public users NOT delete/update admin content?

---

## 🆘 Common Issues

**Issue:** "Invalid API key"  
**Fix:** Make sure you're using `VITE_SUPABASE_ANON_KEY` (not PUBLISHABLE_KEY)

**Issue:** "Cannot read properties of null"  
**Fix:** User is not authenticated - check authentication flow

**Issue:** "Row level security policy violation"  
**Fix:** Run the RLS SQL commands in Supabase SQL Editor

**Issue:** "Validation errors not showing"  
**Fix:** Make sure Zod is installed and imported correctly

**Issue:** "Routes not working"  
**Fix:** Install react-router-dom and wrap App with BrowserRouter
