-- Supabase Storage Policies for school-images bucket
-- Run this in Supabase SQL Editor

-- Policy 1: Allow anyone (public) to SELECT/VIEW images
CREATE POLICY "Anyone can view school images"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'school-images'
);

-- Policy 2: Allow authenticated users to INSERT/UPLOAD images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'school-images'
  AND auth.role() = 'authenticated'
);

-- Policy 3: Allow authenticated users to UPDATE images
CREATE POLICY "Authenticated users can update images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'school-images'
  AND auth.role() = 'authenticated'
);

-- Policy 4: Allow authenticated users to DELETE images
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'school-images'
  AND auth.role() = 'authenticated'
);

-- Verify policies were created
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd
FROM pg_policies 
WHERE tablename = 'objects' 
  AND policyname LIKE '%school%';
