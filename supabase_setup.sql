-- ============================================================================
-- ZPPS SRP CAMP - Complete Database Setup Script
-- Run this in Supabase SQL Editor
-- ============================================================================

-- Step 1: Create all tables
-- ============================================================================

-- 1. Notices Table
CREATE TABLE IF NOT EXISTS notices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  day TEXT NOT NULL,
  month TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Highlights Table
CREATE TABLE IF NOT EXISTS highlights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  icon TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Timeline Events Table
CREATE TABLE IF NOT EXISTS timeline_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  year TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  alignment TEXT CHECK (alignment IN ('left', 'right')) DEFAULT 'right',
  is_highlighted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. App Settings (for images and configurations)
CREATE TABLE IF NOT EXISTS app_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key_name TEXT UNIQUE NOT NULL,
  image_url TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Contact Inquiries Table
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Admissions Table
CREATE TABLE IF NOT EXISTS admissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_first_name TEXT NOT NULL,
  student_last_name TEXT NOT NULL,
  dob DATE NOT NULL,
  grade_applying TEXT NOT NULL,
  parent_name TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  address TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- Step 2: Enable Row Level Security on all tables
-- ============================================================================

ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE admissions ENABLE ROW LEVEL SECURITY;


-- Step 3: Drop existing policies (if any) to start fresh
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can view notices" ON notices;
DROP POLICY IF EXISTS "Only authenticated users can insert notices" ON notices;
DROP POLICY IF EXISTS "Only authenticated users can update notices" ON notices;
DROP POLICY IF EXISTS "Only authenticated users can delete notices" ON notices;

DROP POLICY IF EXISTS "Anyone can view highlights" ON highlights;
DROP POLICY IF EXISTS "Only authenticated users can manage highlights" ON highlights;

DROP POLICY IF EXISTS "Anyone can view timeline" ON timeline_events;
DROP POLICY IF EXISTS "Only authenticated users can manage timeline" ON timeline_events;

DROP POLICY IF EXISTS "Anyone can view settings" ON app_settings;
DROP POLICY IF EXISTS "Only authenticated users can manage settings" ON app_settings;

DROP POLICY IF EXISTS "Anyone can submit admission" ON admissions;
DROP POLICY IF EXISTS "Only authenticated users can view admissions" ON admissions;

DROP POLICY IF EXISTS "Anyone can submit inquiry" ON contact_inquiries;
DROP POLICY IF EXISTS "Only authenticated users can view inquiries" ON contact_inquiries;


-- Step 4: Create secure Row Level Security policies
-- ============================================================================

-- NOTICES: Public read, authenticated write
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

-- HIGHLIGHTS: Public read, authenticated write
CREATE POLICY "Anyone can view highlights"
  ON highlights FOR SELECT
  USING (true);

CREATE POLICY "Only authenticated users can manage highlights"
  ON highlights FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- TIMELINE EVENTS: Public read, authenticated write
CREATE POLICY "Anyone can view timeline"
  ON timeline_events FOR SELECT
  USING (true);

CREATE POLICY "Only authenticated users can manage timeline"
  ON timeline_events FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- APP SETTINGS: Public read, authenticated write
CREATE POLICY "Anyone can view settings"
  ON app_settings FOR SELECT
  USING (true);

CREATE POLICY "Only authenticated users can manage settings"
  ON app_settings FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ADMISSIONS: Public can submit, only authenticated can view
CREATE POLICY "Anyone can submit admission"
  ON admissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can view admissions"
  ON admissions FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update admission status"
  ON admissions FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- CONTACT INQUIRIES: Public can submit, only authenticated can view
CREATE POLICY "Anyone can submit inquiry"
  ON contact_inquiries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can view inquiries"
  ON contact_inquiries FOR SELECT
  USING (auth.role() = 'authenticated');


-- Step 5: Insert default/sample data
-- ============================================================================

-- Insert Notices
INSERT INTO notices (day, month, title, description, is_active) VALUES
  ('05', 'Apr', 'Academic Session Starts', 'New academic year 2024-25 commences.', true),
  ('12', 'Apr', 'PTA Meeting Schedule', 'Mandatory meeting for Grades 1-4 parents.', true),
  ('28', 'Mar', 'Final Result Declaration', 'Results for previous academic year.', false),
  ('15', 'May', 'Summer Camp Registration', 'Registration open for summer activities and workshops.', true),
  ('01', 'Jun', 'First Term Begins', 'First term of new academic year starts.', true)
ON CONFLICT DO NOTHING;

-- Insert Highlights
INSERT INTO highlights (icon, title, description) VALUES
  ('Monitor', 'Functional Computer Lab', 'Equipped with modern PCs to ensure digital literacy from an early age, preparing students for a technology-driven future.'),
  ('Utensils', 'Mid-Day Meal Program', 'Nutritious, hygienically prepared meals served daily to ensure optimal health and focus during study hours.'),
  ('Goal', 'Spacious Playground', 'A secure, open outdoor space dedicated to physical education, sports, and recreational activities.'),
  ('Book', 'Well-Stocked Library', 'Over 170 books covering various subjects to encourage reading habits and knowledge exploration.')
ON CONFLICT DO NOTHING;

-- Insert Timeline Events
INSERT INTO timeline_events (year, title, description, alignment, is_highlighted) VALUES
  ('1992', 'Foundation', 'Establishment of ZPPS SRP CAMP in Solapur North, laying the cornerstone for accessible education in the region.', 'right', false),
  ('2005', 'Expansion', 'Expansion to 9 functional classrooms to accommodate our steadily growing student body and expanding academic programs.', 'left', false),
  ('2012', 'Nutrition Program', 'Implementation of the Mid-Day Meal program with dedicated on-site preparation, ensuring holistic student well-being.', 'right', false),
  ('2018', 'Digital Era', 'Modernization of the Computer Lab, providing functional PCs and essential digital literacy skills for student use.', 'left', false),
  ('2023', 'Academic Excellence', 'Formal recognition for excellence in Marathi-medium education across the Solapur Urban block.', 'right', true)
ON CONFLICT DO NOTHING;

-- Insert App Settings (Image URLs)
INSERT INTO app_settings (key_name, image_url) VALUES
  ('heroBg', 'https://lh3.googleusercontent.com/aida-public/AB6AXuALygm1ErXoKnsLyG_zwcD-S_Vh1pRBYp_CphjwpUxqB1aYWVQYOmpE1rxafjcUIHvOrlAOjONnZVck8iBVIr7YT3z8KQa5Q2tkHOpSgzbAXkmG6bAoj5rQ13F_BYPBQuSOQCThptM7ScJOBccxftHk-HEVktCPDEIiXX5xpuiGXsaZEb-H0UKDolmjgPdIavhroQBDCVFCWDiRt6JAmOO6xb4c9ujMUQXBWH86BUy9Hm80Z_ij21de'),
  ('aboutImg', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbwQH9-H6PaF_W8BJf-u1tG8oWAR2DyTQNz2vSJwfC1GVIOJL03QA-ni4zsmxG_929E4TY0-saIovOLoealgLtPj4n6Wjf4X5BeVEXutXse-COKQr2yE0BfiSumGr5DXMc-u-rgozGrV6tdOyV9EUO2RLg_WQsY3KFAAFx8mqaHV6UwIEMdlmSYmGVAa6ZpHknScw4jPJn0F0v-zwvYa308NJpb7j0fft5KkNl6Pj30OILQoST1ymB'),
  ('facilityMain', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXZfJI1KZp6RuJKfeGVz7harQINhxl7dC-WM8HVClKONGDcVYrr0UwRx3WCh5OQIGGuAVS3qqwEXTs0GCakH9_3tZWiyIaFbroeBcYsvIIilMW4hswldvUKyoZb06mmqKXmxoWdLMqsbfp0eOyMpJ6OdPQ5MwB4eglL_1fjqshAPNosbrieAEXem7MfLI09NifW-Jmujm9eJUiFRbiE4A768-OYXrzBc_2X4CD8IZKdhQ5TxwvYfK2'),
  ('midDayMeal', 'https://lh3.googleusercontent.com/aida-public/AB6AXuChEv3ie2C1rLaVcJd1E5X7jAusSOOE0wPvQns-TH7RSnT0ocpoMORdx7OscLnPTeZbCrsPWHHVqBB89atUAJ8bHirApbqRQHDTFNEut3-mRDZIKkpacAPpezwanfdf7KP6pI6_HeKi4lgLJG78Yv7l8ygwh_IRlKJAT1G3fiGSBsNVXg4MGOAtCtkSRgGRHIY0xvbkpoORbez5-knCXsERZpiG-QX3uHGC6NpLDQQFxb11nkCW_7yi'),
  ('principal', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDo2THd2lEOArqx4V_hMzm1348G79t7nCPqgGCE0flRJsiH-qNoUyu_WIZOcIsJ5QAkz3-xPs3NNXbFABYQrsDdfU5D-8rnhC72O8XhpNVlbPJJZdhB2y05w2T_mGzIjvi1inbhWgkMRfxpUWDjSAy5TcXch8-zkLlQ6oIMgHpx12Puggat1L_1rLoYNbx7YSCYJyuNfe21S4OWKA6YEMidR9gmWhVA48weLS_-p1fEH0OfgE2trU0v')
ON CONFLICT (key_name) DO UPDATE SET
  image_url = EXCLUDED.image_url,
  updated_at = NOW();


-- Step 6: Create Storage Bucket for future image uploads
-- ============================================================================

-- Note: Storage buckets are created via Supabase Dashboard, not SQL
-- Go to: Storage → Create bucket → Name: "school-assets" → Public: Yes

-- You can run these policies after creating the bucket:
-- CREATE POLICY "Public can view school assets"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'school-assets');
-- 
-- CREATE POLICY "Authenticated users can upload school assets"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'school-assets' AND auth.role() = 'authenticated');


-- Step 7: Verify everything is set up correctly
-- ============================================================================

-- Check if all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('notices', 'highlights', 'timeline_events', 'app_settings', 'contact_inquiries', 'admissions')
ORDER BY table_name;

-- Check if RLS is enabled on all tables
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('notices', 'highlights', 'timeline_events', 'app_settings', 'contact_inquiries', 'admissions')
ORDER BY tablename;

-- Check policies
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Count records
SELECT 'notices' as table_name, COUNT(*) as record_count FROM notices
UNION ALL
SELECT 'highlights', COUNT(*) FROM highlights
UNION ALL
SELECT 'timeline_events', COUNT(*) FROM timeline_events
UNION ALL
SELECT 'app_settings', COUNT(*) FROM app_settings
UNION ALL
SELECT 'admissions', COUNT(*) FROM admissions
UNION ALL
SELECT 'contact_inquiries', COUNT(*) FROM contact_inquiries;


-- ============================================================================
-- SETUP COMPLETE!
-- ============================================================================
-- 
-- Next steps:
-- 1. Create an admin user in Supabase Authentication:
--    - Go to: Authentication → Users → Add user
--    - Email: principal@zppssrpcamp.edu.in
--    - Password: <create-strong-password>
--    - Auto Confirm User: YES
--
-- 2. Test the connection:
--    - Run your app: npm run dev
--    - Navigate to home page - you should see data
--    - Try to login to /admin with your created credentials
--
-- 3. (Optional) Create storage bucket for images:
--    - Go to: Storage → Create new bucket
--    - Name: school-assets
--    - Public: Yes
--    - Then run the storage policy SQL above
--
-- ============================================================================
