'use client';

import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

type UploadType = 'listings' | 'reviews' | 'claims' | 'avatars' | 'ads';

interface UseUploadOptions {
  type:      UploadType;
  entityId?: string;
  maxFiles?: number;
}

export function useUpload({ type, entityId, maxFiles = 8 }: UseUploadOptions) {
  const [uploading, setUploading] = useState(false);
  const [progress,  setProgress]  = useState(0);

  const upload = useCallback(async (files: File[]): Promise<string[]> => {
    if (!files.length) return [];
    if (files.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return [];
    }

    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      files.forEach((f) => formData.append('files', f));
      formData.append('type', type);
      if (entityId) formData.append('entityId', entityId);

      // Simulate progress with polling
      const progressInterval = setInterval(() => {
        setProgress((p) => Math.min(p + 10, 85));
      }, 300);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body:   formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Upload failed');
      }

      const { urls } = await response.json();
      return urls as string[];
    } catch (error: any) {
      toast.error(error.message || 'Upload failed');
      return [];
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  }, [type, entityId, maxFiles]);

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024;
    if (!allowed.includes(file.type)) return { valid: false, error: 'Only JPEG, PNG, WebP allowed' };
    if (file.size > maxSize)          return { valid: false, error: 'Image must be under 5MB' };
    return { valid: true };
  };

  return { upload, uploading, progress, validateFile };
}
