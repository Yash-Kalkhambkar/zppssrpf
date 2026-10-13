# Supabase Storage Setup Guide

This guide will help you set up image storage for the school website. Follow these steps carefully.

## Step 1: Create the Storage Bucket

1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/ytmwznrhuvrjgdmcrsjc
2. Click on **Storage** in the left sidebar
3. Click the **New bucket** button
4. Enter the following details:
   - **Name**: `school-images`
   - **Public bucket**: Toggle **ON** (very important!)
   - Click **Create bucket**

## Step 2: Enable Row Level Security (RLS)

1. In the Supabase Dashboard, click on **SQL Editor** in the left sidebar
2. Click **New query**
3. Copy and paste the following SQL code:

```sql
-- Enable Row Level Security on storage.objects table
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view school images (public read access)
CREATE POLICY "Public can view school images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'school-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'school-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to update images
CREATE POLICY "Authenticated users can update images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'school-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'school-images' AND auth.role() = 'authenticated');
```

4. Click **Run** to execute the SQL
5. You should see "Success. No rows returned" message

## Step 3: Verify the Setup

1. Go back to **Storage** in the left sidebar
2. Click on the `school-images` bucket
3. You should see an empty bucket ready for uploads
4. The bucket should show a **Public** badge

## Folder Structure

The application will automatically organize uploaded images into folders:

```
school-images/
├── heroBg/          # Homepage hero background images
├── aboutImg/        # About Us page images
├── facilityMain/    # Facilities section images
├── midDayMeal/      # Mid-day meal program images
└── principal/       # Principal's profile photos
```

You don't need to create these folders manually - they will be created automatically when you upload the first image of each type.

## Testing the Upload Feature

1. Log in to the admin dashboard
2. Navigate to the **🖼️ Photos** tab
3. Try uploading a photo by:
   - Dragging a photo file onto the upload box, OR
   - Clicking the upload box to select a file from your computer
4. You should see a success message
5. The photo should appear on the website immediately

## Troubleshooting

### Issue: "Failed to upload photo"
**Solution**: Check that:
- The bucket name is exactly `school-images` (lowercase, with hyphen)
- The bucket is marked as **Public**
- The RLS policies were created successfully (check SQL Editor history)

### Issue: "CORS error" in browser console
**Solution**: 
- Make sure the bucket is set to **Public**
- Try refreshing the Supabase Dashboard and verify bucket settings

### Issue: "403 Forbidden" error
**Solution**: 
- Verify you're logged in as an admin
- Check that RLS policies were created (see Step 2)
- Make sure the SQL ran without errors

### Issue: "File too large" error
**Solution**: 
- Supabase free tier allows up to 50MB per file
- The app limits uploads to 5MB for faster loading
- Compress your image using an online tool like TinyPNG or CompressJPEG

### Issue: Photos not appearing on website
**Solution**:
- Check that the upload showed a success message
- Refresh the page (Ctrl+F5 or Cmd+Shift+R)
- Verify the Storage bucket shows the uploaded file

## Important Notes

- **File Formats Supported**: JPG, PNG, WEBP only
- **Maximum File Size**: 5MB per photo
- **Storage Limits (Free Tier)**: 1GB total storage, 2GB bandwidth per month
- **Old Photos**: When you upload a new photo to replace an old one, the old photo is automatically deleted to save storage space
- **Public Access**: All uploaded photos are publicly accessible via their URLs (this is required for the website to display them)

## Need Help?

If you encounter any issues not covered in this guide:
1. Check the browser console for error messages (press F12 in your browser)
2. Verify your Supabase project is active and not paused
3. Contact technical support with a screenshot of the error message
