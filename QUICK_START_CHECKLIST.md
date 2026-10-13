# 🚀 Quick Start Checklist

## Phase 1: Database Setup (15 minutes)

### □ Step 1: Open Supabase
- [ ] Go to https://supabase.com/dashboard
- [ ] Select project: **ytmwznrhuvrjgdmcrsjc**
- [ ] Click **SQL Editor** in sidebar

### □ Step 2: Run Setup Script
- [ ] Open file: `supabase_setup.sql`
- [ ] Copy ALL contents (Ctrl+A, Ctrl+C)
- [ ] Paste into Supabase SQL Editor
- [ ] Click **Run** (or press Ctrl+Enter)
- [ ] Wait for "Success. No rows returned"

### □ Step 3: Verify Tables Created
Run this in SQL Editor:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('notices', 'highlights', 'timeline_events', 'app_settings', 'contact_inquiries', 'admissions');
```
- [ ] Should return 6 table names

### □ Step 4: Verify Data Inserted
Run this in SQL Editor:
```sql
SELECT 'notices' as table, COUNT(*) FROM notices
UNION ALL SELECT 'highlights', COUNT(*) FROM highlights
UNION ALL SELECT 'timeline_events', COUNT(*) FROM timeline_events
UNION ALL SELECT 'app_settings', COUNT(*) FROM app_settings;
```
- [ ] notices: 5 rows
- [ ] highlights: 4 rows
- [ ] timeline_events: 5 rows
- [ ] app_settings: 5 rows

### □ Step 5: Create Admin User
- [ ] Go to **Authentication** → **Users**
- [ ] Click **Add user** → **Create new user**
- [ ] Email: `principal@zppssrpcamp.edu.in` (or your choice)
- [ ] Password: _________________________ (write it down!)
- [ ] ✅ Check **Auto Confirm User**
- [ ] Click **Create user**
- [ ] User appears in user list

---

## Phase 2: Test Application (5 minutes)

### □ Step 6: Start Dev Server
```bash
npm run dev
```
- [ ] Opens on http://localhost:3000
- [ ] No errors in terminal
- [ ] No errors in browser console (F12)

### □ Step 7: Test Public Pages
- [ ] **Home page** loads
- [ ] Sees 5 notices in Notice Board
- [ ] Sees 4 highlights in Campus Highlights
- [ ] **Achievements page** shows 5 timeline events
- [ ] **Facilities page** shows facilities
- [ ] **Contact page** form renders
- [ ] **Admission page** form renders

### □ Step 8: Test Forms (Public)
**Admission Form:**
- [ ] Fill out all fields
- [ ] Click "Submit Application"
- [ ] See success message

**Contact Form:**
- [ ] Fill out all fields
- [ ] Click "Submit Inquiry"
- [ ] See success alert

### □ Step 9: Test Admin Access
- [ ] Click "Staff Login" in footer (or go to URL directly)
- [ ] See login form
- [ ] Enter credentials from Step 5
- [ ] Successfully logs in
- [ ] See admin dashboard with tabs

### □ Step 10: Test Admin Functions
**Notices Tab:**
- [ ] See existing notices
- [ ] Click "Add New Notice" form
- [ ] Fill and submit
- [ ] New notice appears in list
- [ ] Click delete button on a notice
- [ ] Notice disappears

**Highlights Tab:**
- [ ] See existing highlights
- [ ] Add a new highlight
- [ ] Delete a highlight

**Admissions Tab:**
- [ ] See submission from Step 8
- [ ] Shows correct student details

**Inquiries Tab:**
- [ ] See submission from Step 8
- [ ] Shows correct inquiry details

---

## Phase 3: Verification (2 minutes)

### □ Step 11: Final Checks
- [ ] No console errors (F12 → Console)
- [ ] All pages navigate correctly
- [ ] Images load properly
- [ ] Responsive on mobile (F12 → Toggle device toolbar)
- [ ] Can logout from admin
- [ ] Cannot access admin after logout

---

## ✅ COMPLETE! Your app is now running with Supabase

**Total Time:** ~20 minutes

---

## 🎯 What's Next?

### Immediate (Optional)
- [ ] Test on different browsers (Chrome, Firefox, Safari)
- [ ] Test on actual mobile device
- [ ] Customize content in admin dashboard

### This Week (Critical Security - 6 hours)
**See:** `SECURITY_FIXES_QUICKSTART.md`
- [ ] Remove mock authentication
- [ ] Add React Router for route protection
- [ ] Add input validation with Zod
- [ ] Test authentication flow

### Next Weeks (Production Ready - 20 hours)
**See:** `PRODUCTION_READINESS_AUDIT.md`
- [ ] Add rate limiting
- [ ] Add CSRF protection
- [ ] Configure security headers
- [ ] Add error boundaries
- [ ] Performance optimization
- [ ] Accessibility improvements
- [ ] SEO optimization

---

## 📞 Need Help?

**If stuck, check:**
1. Browser console for errors (F12)
2. Supabase Dashboard → Logs
3. `DATABASE_SETUP_INSTRUCTIONS.md` → Troubleshooting section

**Common issues:**
- Server not connecting → Check `.env` file and restart server
- Tables not found → Run `supabase_setup.sql` again
- Can't login → Verify user created in Supabase Auth
- No data showing → Check Step 4 (data count query)

---

## 📁 Important Files

- `supabase_setup.sql` - Database setup script
- `.env` - Environment variables (already fixed)
- `DATABASE_SETUP_INSTRUCTIONS.md` - Detailed guide
- `SETUP_COMPLETE_SUMMARY.md` - Overview
- `test-supabase-connection.html` - Connection tester

---

**Current Status:**
- ✅ .env file FIXED
- ⏳ Database setup PENDING
- ⏳ Testing PENDING

**Get Started:** Begin with Step 1 above! ⬆️
