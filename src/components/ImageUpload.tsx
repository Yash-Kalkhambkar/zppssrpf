import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';

interface ImageUploadProps {
  label: string;
  folder: string;
  currentImageUrl?: string;
  onFileSelected: (file: File) => Promise<void>;
  disabled?: boolean;
}

export function ImageUpload({
  label,
  folder,
  currentImageUrl,
  onFileSelected,
  disabled = false
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return 'Please choose a photo file (JPG, PNG, or WEBP).';
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return 'Photo is too big. Try a smaller one (under 5MB).';
    }

    return null;
  };

  const handleFile = async (file: File) => {
    setError(null);
    setUploadSuccess(false);

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setTimeout(() => setError(null), 5000);
      return;
    }

    // Show preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Upload
    setIsUploading(true);
    try {
      await onFileSelected(file);
      // Show success animation
      setUploadSuccess(true);
      setTimeout(() => {
        setPreviewUrl(null);
        setUploadSuccess(false);
        URL.revokeObjectURL(objectUrl);
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Upload failed. Please try again.');
      setTimeout(() => setError(null), 5000);
      setPreviewUrl(null);
      URL.revokeObjectURL(objectUrl);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled || isUploading) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  const displayUrl = previewUrl || currentImageUrl;

  if (disabled || !isSupabaseConfigured) {
    return (
      <div className="space-y-4">
        {currentImageUrl && (
          <div className="max-w-md rounded-lg border-2 border-outline-variant overflow-hidden">
            <p className="text-base font-label-md bg-surface-variant px-4 py-2">Current Photo:</p>
            <img
              src={currentImageUrl}
              alt={label}
              className="w-full h-auto"
            />
          </div>
        )}
        <div className="bg-surface-variant/50 border-2 border-outline-variant rounded-lg p-6">
          <p className="text-lg font-body-md text-on-surface-variant">
            Photo upload requires live database connection. Currently in preview mode.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Current/Preview Image */}
      {displayUrl && (
        <div className="max-w-md rounded-lg border-2 border-outline-variant overflow-hidden">
          <p className="text-base font-label-md bg-surface-variant px-4 py-3">Current Photo:</p>
          <div className="relative">
            <img
              src={displayUrl}
              alt={label}
              className="w-full h-auto"
            />
            <AnimatePresence>
              {uploadSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-green-600/80 flex items-center justify-center"
                >
                  <CheckCircle className="w-20 h-20 text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label={`Upload ${label}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
        className={`
          min-h-48 border-4 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer
          ${isDragging
            ? 'border-primary bg-primary/10'
            : 'border-outline hover:border-primary/50 hover:bg-surface-container-highest'
          }
          ${isUploading ? 'opacity-50 cursor-wait' : ''}
        `}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <p className="text-xl font-headline-md text-primary">Uploading your photo...</p>
            <p className="text-base font-body-md text-on-surface-variant">Please wait</p>
          </div>
        ) : (
          <>
            <Upload className="w-16 h-16 text-on-surface-variant mx-auto mb-4" />
            <p className="text-xl font-headline-md text-on-surface mb-2">{displayUrl ? 'Upload New Photo' : 'Upload Photo'}</p>
            <p className="text-lg font-body-md text-on-surface-variant mb-3">
              Drag a photo here or click to select
            </p>
            <p className="text-base font-label-md text-outline">
              Photos only (JPG, PNG, WEBP) • Maximum 5MB
            </p>
          </>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-error-container text-on-error-container p-4 rounded-lg text-lg font-body-md">
          ❌ {error}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileInputChange}
        className="hidden"
        aria-label={`Choose file for ${label}`}
      />
    </div>
  );
}
