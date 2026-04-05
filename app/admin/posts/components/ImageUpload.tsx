'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

interface ImageUploadProps {
  value: string;
  alt: string;
  onChange: (url: string) => void;
  onAltChange: (alt: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ value, alt, onChange, onAltChange }) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Kích thước ảnh không được vượt quá 2MB');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await res.json();
      onChange(data.url);
      toast.success('Tải ảnh lên thành công');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4 font-sans">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
        Ảnh đại diện (Featured Image)
        <span className="text-rose-500 font-black">*</span>
      </label>

      {value ? (
        <div className="relative aspect-video rounded-3xl overflow-hidden border border-slate-100 group shadow-sm">
          <Image
            src={value}
            alt={alt || 'Featured image'}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-emerald-900/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-3 bg-white/20 backdrop-blur-md rounded-2xl hover:bg-white/40 transition-colors shadow-xl"
              title="Đổi ảnh"
            >
              <Upload className="w-5 h-5 text-white" />
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-3 bg-rose-500/20 backdrop-blur-md rounded-2xl hover:bg-rose-500/40 transition-colors shadow-xl"
              title="Xóa ảnh"
            >
              <X className="w-5 h-5 text-rose-100" />
            </button>
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent" />
            </div>
          )}
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`
            aspect-video border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-4 cursor-pointer
            transition-all duration-500 group
            ${uploading ? 'bg-slate-50 border-slate-200 cursor-not-allowed' : 'bg-slate-50/50 hover:bg-emerald-50/30 border-slate-200 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/5'}
          `}
        >
          {uploading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent" />
          ) : (
            <>
              <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform duration-500">
                <ImageIcon className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="text-center px-4">
                <p className="text-xs font-bold text-slate-600 group-hover:text-emerald-700 transition-colors">Tải ảnh đại diện lên</p>
                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tight font-medium">WebP, PNG, JPG • Max 2MB</p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        className="hidden"
        accept="image/jpeg,image/png,image/webp"
      />

      {/* Alt Text Input */}
      <div className="space-y-2 pt-2">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
          <span>Alt Text (SEO Mandatory)</span>
          {alt.trim().length > 0 ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
          )}
        </label>
        <div className="relative">
          <input
            type="text"
            value={alt}
            onChange={(e) => onAltChange(e.target.value)}
            placeholder="Mô tả nội dung ảnh cho Google..."
            className={`
              w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none transition-all pr-10 placeholder:text-slate-400
              ${alt.trim().length === 0 ? 'border-amber-100 focus:border-amber-400 focus:bg-white' : 'border-slate-100 focus:border-emerald-500 focus:bg-white'}
            `}
          />
        </div>
        <p className="text-[9px] text-slate-400 leading-relaxed italic">
          * Giúp tăng khả năng hiển thị trên Google Image Search.
        </p>
      </div>
    </div>
  );
};
