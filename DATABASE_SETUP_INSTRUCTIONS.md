# Database Setup Instructions

## ✅ Step 1: Environment File (DONE)

Your `.env` file has been fixed:
```env
VITE_SUPABASE_URL=https://ytmwznrhuvrjgdmcrsjc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🗄️ Step 2: Run Database Setup

### Option A: Run the entire script (Recommended)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: **ytmwznrhuvrjgdmcrsjc**
3. Click **SQL Editor** in the left sidebar
4. Click **+ New query**
5. Open the file `supabase_setup.sql` in this folder
6. **Copy the ENTIRE contents** of `supabase_setup.sql`
7. **Paste** into the Supabase SQL Editor
8. Click **Run** (or press Ctrl+Enter)
9. Wait for completion (should take 5-10 seconds)

### Option B: Run queries section by section

If you prefer to run step-by-step (good for learning):

1. Open `supabase_setup.sql`
2. Copy **Step 1** (Create all tables) → Run in SQL Editor
3. Copy **Step 2** (Enable RLS) → Run
4. Copy **Step 3** (Drop policies) → Run
5. Copy **Step 4** (Create policies) → Run
6. Copy **Step 5** (Insert data) → Run
7. Copy **Step 7** (Verification queries) → Run to confirm

## 👤 Step 3: Create Admin User

1. In Supabase Dashboard, go to **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Fill in:
   - **Email:** `principal@zppssrpcamp.edu.in` (or your choice)
   - **Password:** Create a strong password (save it somewhere safe!)
   - **Auto Confirm User:** ✅ YES (check this box)
4. Click **Create user**

**IMPORTANT:** Save these credentials - you'll need them to login to the admin dashboard!

## 🧪 Step 4: Test the Setup

### Test 1: Verify Database
Run these queries in SQL Editor:

```sql
-- Should show 6 tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('notices', 'highlights', 'timeline_events', 'app_settings', 'contact_inquiries', 'admissions');

-- Should show data counts
SELECT 'notices' as table_name, COUNT(*) as records FROM notices
UNION ALL SELECT 'highlights', COUNT(*) FROM highlights
UNION ALL SELECT 'timeline_events', COUNT(*) FROM timeline_events
UNION ALL SELECT 'app_settings', COUNT(*) FROM app_settings;
```

Expected results:
- notices: 5 records
- highlights: 4 records
- timeline_events: 5 records
- app_settings: 5 records

### Test 2: Run the App
```bash
npm run dev
```

Open http://localhost:3000 in your browser:
- ✅ Home page should load with notices and highlights
- ✅ Achievements page should show timeline
- ✅ Facilities page should load

### Test 3: Test Admin Login
1. Go to http://localhost:3000 and click **Admin Login** in footer
2. OR directly go to http://localhost:3000 (click on admin in navigation)
3. Login with the credentials you created in Step 3
4. ✅ You should be able to access the admin dashboard
5. ✅ Try adding/editing/deleting a notice

### Test 4: Test Public Forms
1. Go to **Admission** page
2. Fill out and submit the form
3. ✅ Should show success message
4. Login to admin and check **Admissions** tab - your submission should be there

## 🐛 Troubleshooting

### Error: "Invalid API key"
- **Fix:** Make sure `.env` file has `VITE_SUPABASE_ANON_KEY` (not PUBLISHABLE_KEY)
- Restart dev server: Stop (Ctrl+C) and run `npm run dev` again

### Error: "relation 'notices' does not exist"
- **Fix:** You haven't run the SQL setup script yet
- Go back to Step 2 and run `supabase_setup.sql`

### Error: "new row violates row-level security policy"
- **Fix:** RLS policies not set up correctly
- Run Step 4 from `supabase_setup.sql` again

### Home page shows no data
- **Fix:** Data wasn't inserted
- Run Step 5 from `supabase_setup.sql` (Insert sample data)

### Can't login to admin
- **Fix:** User not created or wrong credentials
- Go to Supabase → Authentication → Users
- Verify user exists with correct email
- Try resetting password if needed

### Page is blank or shows errors
- **Fix:** Check browser console (F12)
- Most likely .env issue - verify the file has correct values
- Restart dev server

## 📋 Verification Checklist

After completing all steps, verify:

- [x] `.env` file has correct `VITE_SUPABASE_ANON_KEY`
- [ ] All 6 tables created in Supabase
- [ ] RLS enabled on all tables
- [ ] Sample data inserted (5 notices, 4 highlights, 5 timeline events, 5 images)
- [ ] Admin user created in Supabase Authentication
- [ ] App runs without errors (`npm run dev`)
- [ ] Home page shows notices and highlights
- [ ] Achievements page shows timeline
- [ ] Can login to admin dashboard
- [ ] Can add/edit/delete notices from admin
- [ ] Can submit admission form
- [ ] Can view submitted admissions in admin

## 🎉 Success!

If all tests pass, your database is ready! Your app now:
- ✅ Connects to Supabase properly
- ✅ Has secure RLS policies
- ✅ Contains sample data
- ✅ Has admin authentication ready

## 📚 Next Steps

1. **Remove mock authentication** (see `SECURITY_FIXES_QUICKSTART.md`)
2. **Add route protection** with React Router
3. **Add form validation** with Zod
4. **Test everything thoroughly**

## ❓ Need Help?

If you encounter any issues:
1. Check browser console (F12) for errors
2. Check Supabase logs (Dashboard → Logs)
3. Verify `.env` file is correct
4. Make sure you restarted the dev server after changing `.env`

---

**Current Status:**
- ✅ .env file: FIXED
- ⏳ Database: READY TO SET UP
- ⏳ Admin user: NEEDS CREATION
- ⏳ App testing: PENDING

**Time Required:** 10-15 minutes total
