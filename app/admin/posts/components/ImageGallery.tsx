'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { 
  Upload, X, Image as ImageIcon, Copy, Check, 
  Star, Trash2, FileText, Plus, AlertCircle 
} from 'lucide-react';
import { toast } from 'sonner';

interface GalleryImage {
  id: string; // Unique ID for keying
  url: string;
  alt: string;
  name: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  featuredUrl: string;
  onUpdate: (images: GalleryImage[]) => void;
  onSetFeatured: (url: string, alt: string) => void;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ 
  images, 
  featuredUrl, 
  onUpdate, 
  onSetFeatured 
}) => {
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    let files: File[] = [];
    if ('files' in e.target && e.target.files) {
      files = Array.from(e.target.files);
    } else if ('dataTransfer' in e) {
      e.preventDefault();
      files = Array.from(e.dataTransfer.files);
    }
    
    if (files.length === 0) return;

    // Validate
    const totalSize = files.reduce((acc, f) => acc + f.size, 0);
    if (totalSize > 10 * 1024 * 1024) { // Increased to 10MB total
      toast.error('Tổng dung lượng quá lớn (Max 10MB một lần tải)');
    }

    setUploading(true);
    const currentImages = [...images];

    try {
      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) { // Increased to 5MB individual
          toast.error(`Ảnh ${file.name} quá lớn (Max 5MB)`);
          continue;
        }

        const formData = new FormData();
        formData.append('file', file);

        console.log(`Uploading file: ${file.name}...`);
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error('Upload API Error:', errorData);
          throw new Error(errorData.error || `Lỗi tải ảnh ${file.name}`);
        }
        
        const data = await res.json();
        const imgId = Math.random().toString(36).substring(7);
        const imgObj = {
          id: imgId,
          url: data.url,
          alt: '',
          name: file.name
        };
        currentImages.push(imgObj);
        
        // Auto-set as featured if none exists
        if (!featuredUrl && currentImages.length === 1) {
          onSetFeatured(imgObj.url, imgObj.alt);
        }
      }
      onUpdate(currentImages);
      toast.success(`Đã tải lên thành công`);
    } catch (error: any) {
      console.error('Upload Process Error:', error);
      toast.error(error.message || 'Có lỗi xảy ra khi tải ảnh');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const updateAlt = (index: number, newAlt: string) => {
    const newImages = [...images];
    newImages[index].alt = newAlt;
    onUpdate(newImages);
    
    // If this is the featured image, update its alt in parent state WITHOUT toast
    if (newImages[index].url === featuredUrl) {
      onSetFeatured(featuredUrl, newAlt); 
    }
  };

  const removeImage = (index: number) => {
    const imageToRemove = images[index];
    const newImages = images.filter((_, i) => i !== index);
    onUpdate(newImages);
    
    // If we removed the featured image, reset it
    if (imageToRemove.url === featuredUrl) {
      onSetFeatured('', '');
    }
    toast.success('Đã xóa ảnh khỏi thư viện');
  };

  const copyMarkdown = (img: GalleryImage) => {
    const markdown = `![${img.alt || img.name}](${img.url})`;
    navigator.clipboard.writeText(markdown);
    setCopiedUrl(img.url);
    toast.success('Đã sao chép Markdown');
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-slate-100 pb-5">
        <div>
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Media Assets (Markdown Images)
          </h3>
          <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tight">Thư viện ảnh đính kèm trong bài viết</p>
        </div>
        
        {images.length > 0 && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-2xl text-[11px] font-extrabold hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-emerald-500/20"
          >
            {uploading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            Tải thêm ảnh
          </button>
        )}
      </div>

      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleUpload}
        className="hidden"
        accept="image/*"
      />

      {images.length === 0 ? (
        <div 
          onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('bg-emerald-50/50', 'border-emerald-300'); }}
          onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('bg-emerald-50/50', 'border-emerald-300'); }}
          onDrop={(e) => { handleUpload(e); e.currentTarget.classList.remove('bg-emerald-50/50', 'border-emerald-300'); }}
          onClick={() => fileInputRef.current?.click()}
          className="border-3 border-dashed border-slate-100 rounded-[2.5rem] p-20 flex flex-col items-center justify-center gap-6 bg-slate-50/30 hover:bg-emerald-50/20 hover:border-emerald-200 transition-all cursor-pointer group"
        >
          <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100 group-hover:scale-110 group-hover:shadow-xl transition-all duration-500">
            <Plus className="w-10 h-10 text-emerald-400 group-hover:rotate-90 transition-transform duration-500" />
          </div>
          <div className="text-center group-hover:translate-y-1 transition-transform">
            <p className="text-sm font-bold text-slate-700">Thả ảnh vào đây hoặc nhấp để tải lên</p>
            <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-widest font-black opacity-60">WebP, PNG, JPG • Max 5MB/Ảnh</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {images.map((img, index) => (
            <div 
              key={img.id || img.url} 
              className={`
                group relative bg-white border-2 rounded-[2rem] p-6 flex flex-col md:flex-row gap-6 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10
                ${img.url === featuredUrl ? 'border-emerald-500 shadow-xl shadow-emerald-500/5' : 'border-slate-50'}
              `}
            >
              {/* Thumbnail Container */}
              <div className="relative w-full md:w-36 h-36 rounded-2xl overflow-hidden border-2 border-slate-50 shrink-0 shadow-inner">
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Content & Actions */}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-4 h-4 text-emerald-500 shrink-0" />
                        <p className="text-[13px] font-black text-slate-800 truncate tracking-tight">{img.name}</p>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono truncate select-all opacity-70">Path: {img.url}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="p-3 bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 border border-slate-50 rounded-2xl transition-all shadow-sm shrink-0"
                      title="Xóa khỏi thư viện"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="relative group/alt">
                    <input
                      type="text"
                      value={img.alt}
                      onChange={(e) => updateAlt(index, e.target.value)}
                      placeholder="Mô tả cho Google (Alt text)..."
                      className={`
                        w-full pl-11 pr-4 py-3 bg-slate-50/50 border-2 rounded-2xl text-[11px] font-bold focus:outline-none transition-all placeholder:text-slate-300
                        ${!img.alt ? 'border-amber-100 focus:border-amber-400 focus:bg-white' : 'border-slate-50 focus:border-emerald-500 focus:bg-white text-slate-800'}
                      `}
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      {img.alt ? (
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-400 animate-bounce" />
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => onSetFeatured(img.url, img.alt)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border-2 transition-all text-[10px] font-black uppercase tracking-widest ${
                      img.url === featuredUrl 
                      ? 'bg-amber-100 text-amber-600 border-amber-300 shadow-sm' 
                      : 'bg-slate-50 text-slate-400 border-slate-50 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${img.url === featuredUrl ? 'fill-current' : ''}`} />
                    {img.url === featuredUrl ? "Featured Image (SEO)" : "Set as Featured"}
                  </button>
                  <button
                    type="button"
                    onClick={() => copyMarkdown(img)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border-2 transition-all text-[10px] font-black uppercase tracking-widest ${
                      copiedUrl === img.url 
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg' 
                      : 'bg-white text-emerald-600 border-emerald-100 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 shadow-sm'
                    }`}
                  >
                    {copiedUrl === img.url ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    Copy Markdown
                  </button>
                </div>
              </div>
              
              {img.url === featuredUrl && (
                <div className="absolute -top-4 -left-4 bg-amber-500 text-white text-[9px] font-black uppercase px-4 py-2 rounded-full border-4 border-white shadow-2xl z-10 transition-transform group-hover:scale-105">
                  Main SEO Image
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      <p className="text-[10px] text-slate-400 italic bg-emerald-50/30 p-4 rounded-2xl border border-emerald-100/30 leading-relaxed">
        * Mẹo: Click <b>Copy Markdown</b> để nhận mã chèn vào văn bản. Chọn <b>Featured Image</b> để dùng làm ảnh đại diện cho Google Search.
      </p>
    </div>
  );
};
