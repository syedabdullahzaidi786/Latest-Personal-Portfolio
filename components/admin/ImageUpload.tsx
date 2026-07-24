'use client';

import { useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  value: string;          // current image (base64 dataUrl or empty)
  onChange: (url: string) => void;
  onError?: (msg: string) => void;
}

export default function ImageUpload({ value, onChange, onError }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const upload = useCallback(async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) {
        onError?.(data.error || 'Upload failed');
      } else {
        onChange(data.url);
      }
    } catch {
      onError?.('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [onChange, onError]);

  const handleFile = (file: File | undefined | null) => {
    if (!file) return;
    upload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0]);
    // reset input so same file can be re-selected
    e.target.value = '';
  };

  const remove = () => onChange('');

  return (
    <div className="space-y-2">
      {/* Preview */}
      {value && (
        <div className="relative w-full h-64 rounded-xl overflow-hidden border border-white/10 bg-[#0a0d13] group">
          <Image
            src={value}
            alt="Achievement image"
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center">
            <button
              type="button"
              onClick={remove}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full bg-red-500/90 hover:bg-red-500 text-white"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Drop zone */}
      {!value && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={`relative w-full h-56 rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-2 select-none
            ${dragging
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-white/10 bg-[#0a0d13] hover:border-white/25 hover:bg-white/[0.03]'
            }`}
        >
          {uploading ? (
            <>
              <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
              <p className="text-xs text-gray-400">Uploading…</p>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center">
                {dragging ? (
                  <ImageIcon className="w-5 h-5 text-blue-400" />
                ) : (
                  <Upload className="w-5 h-5 text-gray-500" />
                )}
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-gray-300">
                  {dragging ? 'Drop to upload' : 'Click or drag & drop'}
                </p>
                <p className="text-[11px] text-gray-600 mt-0.5">PNG, JPG, WEBP, GIF — max 2MB</p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Change button when image exists */}
      {value && !uploading && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full py-2 rounded-xl border border-white/10 text-xs font-medium text-gray-400 hover:text-white hover:bg-white/[0.04] transition flex items-center justify-center gap-1.5"
        >
          <Upload className="w-3.5 h-3.5" />
          Change Image
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
}
