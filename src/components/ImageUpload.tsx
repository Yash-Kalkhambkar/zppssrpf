import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

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
      return 'Photo is too large. Please choose one under 5MB.';
    }

    return null;
  };

  const handleFile = async (file: File) => {
    setError(null);

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setTimeout(() => setError(null), 3000);
      return;
    }

    // Show preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Upload
    setIsUploading(true);
    try {
      await onFileSelected(file);
      // Clear preview after successful upload
      setTimeout(() => {
        setPreviewUrl(null);
        URL.revokeObjectURL(objectUrl);
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Failed to upload photo. Please try again.');
      setTimeout(() => setError(null), 3000);
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
          <div className="max-w-xs rounded-lg border border-outline-variant overflow-hidden">
            <img
              src={currentImageUrl}
              alt={label}
              className="w-full h-auto"
            />
          </div>
        )}
        <div className="bg-surface-variant/50 border border-outline-variant rounded-lg p-4">
          <p className="font-body-sm text-on-surface-variant">
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
        <div className="max-w-xs rounded-lg border border-outline-variant overflow-hidden">
          <img
            src={displayUrl}
            alt={label}
            className="w-full h-auto"
          />
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
          border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer
          ${isDragging
            ? 'border-primary bg-primary/5'
            : 'border-outline hover:border-primary/50 hover:bg-surface-container-highest'
          }
          ${isUploading ? 'opacity-50 cursor-wait' : ''}
        `}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <p className="font-headline-sm text-primary">Uploading...</p>
          </div>
        ) : (
          <>
            <Upload className="w-12 h-12 text-on-surface-variant mx-auto mb-3" />
            <p className="font-headline-sm text-on-surface mb-1">{label}</p>
            <p className="font-body-sm text-on-surface-variant mb-2">
              Drag a photo here or click to select
            </p>
            <p className="font-label-sm text-outline">
              Photos only (JPG, PNG, WEBP) • Max 5MB
            </p>
          </>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-error-container text-on-error-container p-3 rounded-lg font-body-sm">
          {error}
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
