import { supabase, isSupabaseConfigured } from './supabase';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload an image file to Supabase Storage
 * @param file - The image file to upload
 * @param folder - The folder name in the bucket (e.g., 'hero', 'about')
 * @returns Promise with success status, URL, or error message
 */
export async function uploadImage(file: File, folder: string): Promise<UploadResult> {
  if (!isSupabaseConfigured) {
    throw new Error('Photo upload is not available in preview mode.');
  }

  try {
    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}-${sanitizedFileName}`;
    const filePath = `${folder}/${fileName}`;

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('school-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      
      // Provide user-friendly error messages
      if (error.message.includes('exceeded')) {
        return {
          success: false,
          error: 'Storage limit reached. Please contact support.'
        };
      }
      
      return {
        success: false,
        error: 'Could not upload the photo. Please try again or choose a different one.'
      };
    }

    // Get public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from('school-images')
      .getPublicUrl(filePath);

    return {
      success: true,
      url: urlData.publicUrl
    };
  } catch (err: any) {
    console.error('Unexpected upload error:', err);
    return {
      success: false,
      error: err.message || 'An unexpected error occurred. Please try again.'
    };
  }
}

/**
 * Delete an image from Supabase Storage using its URL
 * @param url - The full URL of the image to delete
 * @returns Promise<void>
 */
export async function deleteImage(url: string): Promise<void> {
  if (!isSupabaseConfigured || !url) {
    return;
  }

  try {
    // Extract the path from the URL
    // URL format: https://[project].supabase.co/storage/v1/object/public/school-images/folder/filename.jpg
    const pathMatch = url.match(/\/school-images\/(.+)$/);
    
    if (!pathMatch) {
      console.warn('Could not extract path from URL:', url);
      return;
    }

    const filePath = pathMatch[1];

    // Delete the file
    const { error } = await supabase.storage
      .from('school-images')
      .remove([filePath]);

    if (error) {
      console.error('Error deleting old image:', error);
      // Don't throw - deletion of old images is not critical
    }
  } catch (err) {
    console.error('Unexpected error deleting image:', err);
    // Don't throw - deletion of old images is not critical
  }
}
