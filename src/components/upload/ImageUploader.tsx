'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, ImageIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { detectAspectRatio, AspectRatioKey } from '@/types';

interface ImageUploaderProps {
  onUpload: (file: File, dimensions: { width: number; height: number; aspectRatio: string; aspectRatioKey: AspectRatioKey | 'custom' }) => void;
  currentImage?: {
    url: string;
    filename: string;
    width: number;
    height: number;
    aspectRatio: string;
  } | null;
  onRemove?: () => void;
}

export function ImageUploader({ onUpload, currentImage, onRemove }: ImageUploaderProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);

      if (acceptedFiles.length === 0) {
        return;
      }

      const file = acceptedFiles[0];

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }

      // Read image dimensions
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);

        const { key, label } = detectAspectRatio(img.width, img.height);

        onUpload(file, {
          width: img.width,
          height: img.height,
          aspectRatio: label,
          aspectRatioKey: key,
        });
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        setError('Failed to read image dimensions');
      };

      img.src = objectUrl;
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp'],
    },
    maxFiles: 1,
    onDropRejected: () => {
      setError('Please upload a valid image file (PNG, JPG, or WebP)');
    },
  });

  if (currentImage) {
    return (
      <div className="space-y-4">
        <div className="flex gap-6">
          {/* Image preview */}
          <div className="relative group">
            <div className="w-48 h-60 rounded-lg overflow-hidden bg-muted border">
              <img
                src={currentImage.url}
                alt="Uploaded ad"
                className="w-full h-full object-contain"
              />
            </div>
            {onRemove && (
              <Button
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={onRemove}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Image info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 text-green-600 mb-2">
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="font-medium">Image uploaded</span>
            </div>

            <p className="text-sm text-muted-foreground mb-4 truncate max-w-xs">
              {currentImage.filename}
            </p>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Dimensions:</span>
                <span>{currentImage.width} x {currentImage.height}px</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Size:</span>
                <span>{currentImage.aspectRatio}</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-start gap-2">
                <ImageIcon className="w-4 h-4 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-primary">
                    Detected: {currentImage.aspectRatio}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Variations will be generated in this aspect ratio to match your original ad.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              {onRemove && (
                <Button variant="outline" size="sm" onClick={onRemove}>
                  Remove
                </Button>
              )}
              <Button variant="outline" size="sm" {...getRootProps()}>
                <input {...getInputProps()} />
                Replace
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
        }`}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-muted-foreground" />
          </div>

          {isDragActive ? (
            <p className="text-primary font-medium">Drop the image here...</p>
          ) : (
            <>
              <div>
                <p className="font-medium mb-1">Drag and drop your ad image here</p>
                <p className="text-sm text-muted-foreground">
                  or <span className="text-primary">browse files</span>
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, WebP • Max 10MB
              </p>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm p-3 bg-destructive/10 rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-4 gap-4 pt-4">
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <div className="w-8 h-8 mx-auto mb-2 border-2 border-dashed border-muted-foreground/30 rounded" />
          <span className="text-xs text-muted-foreground">1:1 Feed</span>
        </div>
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <div className="w-6 h-8 mx-auto mb-2 border-2 border-dashed border-muted-foreground/30 rounded" />
          <span className="text-xs text-muted-foreground">4:5 Feed</span>
        </div>
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <div className="w-5 h-8 mx-auto mb-2 border-2 border-dashed border-muted-foreground/30 rounded" />
          <span className="text-xs text-muted-foreground">9:16 Story</span>
        </div>
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <div className="w-10 h-6 mx-auto mb-2 border-2 border-dashed border-muted-foreground/30 rounded" />
          <span className="text-xs text-muted-foreground">16:9 Display</span>
        </div>
      </div>
    </div>
  );
}
