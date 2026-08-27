# Supabase Database and Storage Schema

This document outlines the database tables and storage buckets required to migrate the ZPPS SRP CAMP application's data layer to Supabase. 
You can run the following SQL commands in your Supabase SQL Editor.

## 1. `notices` Table
Stores the notices displayed on the Notice Board.
```sql
CREATE TABLE notices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  day TEXT NOT NULL,
  month TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on notices" ON notices FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON notices FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete" ON notices FOR DELETE USING (auth.role() = 'authenticated');
```

## 2. `highlights` Table
Stores the campus highlights.
```sql
CREATE TABLE highlights (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  icon TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE highlights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on highlights" ON highlights FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON highlights FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete" ON highlights FOR DELETE USING (auth.role() = 'authenticated');
```

## 3. `timeline_events` Table
Stores the history and milestones.
```sql
CREATE TABLE timeline_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  year TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  alignment TEXT CHECK (alignment IN ('left', 'right')) DEFAULT 'right',
  is_highlighted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on timeline_events" ON timeline_events FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON timeline_events FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete" ON timeline_events FOR DELETE USING (auth.role() = 'authenticated');
```

## 4. `app_settings` (Images & Configurations)
Stores dynamic image URLs.
```sql
CREATE TABLE app_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key_name TEXT UNIQUE NOT NULL,
  image_url TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on app_settings" ON app_settings FOR SELECT USING (true);
CREATE POLICY "Allow authenticated update" ON app_settings FOR UPDATE USING (auth.role() = 'authenticated');
```

## 5. `contact_inquiries` Table
Stores incoming messages from the contact form.
```sql
CREATE TABLE contact_inquiries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert on contact_inquiries" ON contact_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated read on contact_inquiries" ON contact_inquiries FOR SELECT USING (auth.role() = 'authenticated');
```

## 6. `admissions` Table
Stores admission applications.
```sql
CREATE TABLE admissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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
ALTER TABLE admissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert on admissions" ON admissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated read on admissions" ON admissions FOR SELECT USING (auth.role() = 'authenticated');
```

## Supabase Storage (Buckets)
Create a bucket named `school-assets` (Public: Yes) for uploading images in the future.
```sql
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'school-assets' );
CREATE POLICY "Allow authenticated upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'school-assets' AND auth.role() = 'authenticated');
```

## Authentication
Create a user in Supabase Authentication (e.g. `principal@school.com`) to allow access to the Admin Dashboard.
