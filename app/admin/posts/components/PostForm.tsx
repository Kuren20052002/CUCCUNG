'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Save, Send, AlertTriangle, ChevronLeft, Edit2, Lock } from 'lucide-react';
import Link from 'next/link';

import { slugify } from '@/lib/utils/slugify';
import { validateMarkdown } from '@/lib/markdown';
import { SEOLiveFeedback } from './SEOLiveFeedback';
import { ImageGallery } from './ImageGallery';
import { MarkdownEditor } from './MarkdownEditor';

interface Category {
  id: string;
  name: string;
}

interface PostFormProps {
  initialData?: any;
  categories: Category[];
}

export const PostForm: React.FC<PostFormProps> = ({ initialData, categories }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    id: initialData?.id || '',
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    content: initialData?.content || '',
    metaTitle: initialData?.metaTitle || '',
    metaDescription: initialData?.metaDescription || '',
    categoryId: initialData?.categoryId || '',
    metaImage: initialData?.metaImage || '',
    featuredImageAlt: initialData?.featuredImageAlt || '',
    images: (initialData?.images as any[]) || [],
    published: initialData?.published || false,
  });

  const [isManualSlug, setIsManualSlug] = useState(!!initialData?.slug);

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !isManualSlug) {
      setFormData(prev => ({ ...prev, slug: slugify(formData.title) }));
    }
  }, [formData.title, isManualSlug]);

  // SEO Heading Checks
  const h2Count = (formData.content.match(/^##\s/gm) || []).length;
  const isH2Valid = h2Count >= 3;
  const h1Found = /^#\s/gm.test(formData.content);

  const handleGalleryUpdate = (images: any[]) => {
    setFormData(prev => ({ ...prev, images }));
  };

  const handleSetFeatured = (url: string, alt: string, showToast = true) => {
    setFormData(prev => ({ ...prev, metaImage: url, featuredImageAlt: alt }));
    if (url && showToast) {
      toast.success('Đã đặt làm ảnh đại diện SEO');
    }
  };

  const handleSubmit = async (publish: boolean) => {
    // Validation
    if (!formData.title) return toast.error('Vui lòng nhập tiêu đề bài viết');
    if (!formData.slug) return toast.error('Lỗi: Chưa có đường dẫn bài viết');
    if (!formData.categoryId) return toast.error('Vui lòng chọn chủ đề (Silo Structure)');
    if (!formData.content) return toast.error('Vui lòng nhập nội dung bài viết');
    
    // Markdown SEO Validation
    const mdValidation = validateMarkdown(formData.content);
    if (!mdValidation.valid) {
      return toast.error(mdValidation.error);
    }

    if (!formData.metaImage || !formData.featuredImageAlt) {
      return toast.error('Ảnh đại diện và Alt text là bắt buộc cho SEO');
    }

    setLoading(true);
    const method = initialData ? 'PUT' : 'POST';

    try {
      const res = await fetch('/api/posts', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, published: publish }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        const errorMessage = errorData.details 
          ? `${errorData.error}: ${errorData.details}` 
          : (errorData.error || 'Failed to save post');
        throw new Error(errorMessage);
      }

      toast.success(publish ? 'Bài viết đã được xuất bản!' : 'Đã lưu bản nháp');
      router.push('/admin/posts');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-20 bg-white/90 backdrop-blur-md py-4 border-b border-slate-100 shadow-sm transition-all">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/posts"
            className="p-2 hover:bg-slate-100 rounded-full transition-colors active:scale-95"
          >
            <ChevronLeft className="w-5 h-5 text-slate-500" />
          </Link>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {initialData ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSubmit(false)}
            disabled={loading}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-xl transition-all disabled:opacity-50 flex items-center gap-2 border border-slate-200 active:scale-95 "
          >
            <Save className="w-4 h-4" />
            Lưu nháp
          </button>
          <button
            onClick={() => handleSubmit(true)}
            disabled={loading}
            className="px-6 py-2 text-sm font-extrabold text-white bg-primary hover:bg-emerald-700 rounded-xl transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-95 mr-[30px]"
          >
            <Send className="w-4 h-4 mg-r-30" />
            Xuất bản bài viết
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8 animate-fade-in-down">
          {/* Title Section */}
          <div className="space-y-4 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/50">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tiêu đề bài viết (H1)</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Nhập tiêu đề thu hút ở đây..."
                className="w-full text-3xl font-extrabold bg-transparent border-none focus:ring-0 outline-none py-2 transition-all placeholder:text-slate-400 text-slate-900"
              />
            </div>

            <div className="space-y-1.5 pt-4 border-t border-slate-50">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Đường dẫn</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-black font-mono">ngoanxinhyeu.app/</span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => isManualSlug && setFormData(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/\\s+/g, '-') }))}
                  readOnly={!isManualSlug || initialData?.published}
                  className={`flex-1 border rounded-lg px-3 py-1.5 text-xs font-mono focus:outline-none transition-all ${
                    !isManualSlug || initialData?.published 
                      ? "bg-slate-100/50 border-slate-100 text-emerald-800 cursor-not-allowed select-none" 
                      : "bg-white border-emerald-200 text-emerald-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 shadow-sm"
                  }`}
                />
                {!initialData?.published ? (
                  <button
                    type="button"
                    onClick={() => setIsManualSlug(!isManualSlug)}
                    className={`p-1.5 rounded-lg border transition-all ${
                      isManualSlug 
                        ? "bg-emerald-50 border-emerald-200 text-emerald-600 shadow-inner" 
                        : "bg-white border-slate-200 text-slate-400 hover:text-emerald-500 hover:border-emerald-200"
                    }`}
                    title={isManualSlug ? "Switch to Auto-generate" : "Edit URL manually"}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <div className="p-1.5 text-slate-400 bg-slate-50 border border-slate-100 rounded-lg cursor-not-allowed" title="URL is locked for published posts">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Markdown Editor */}
          <div className="bg-white p-1 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/50 overflow-hidden">
            <MarkdownEditor
              value={formData.content}
              onChange={(val) => setFormData(prev => ({ ...prev, content: val }))}
            />

            {/* H1 Error Warning */}
            {h1Found && (
              <div className="m-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-4 animate-shake">
                <div className="p-2 bg-rose-100 rounded-xl">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-rose-900">LỖI: Sử dụng thẻ H1 không hợp lệ</p>
                  <p className="text-xs text-rose-700 leading-relaxed">
                    Bạn đang sử dụng <span className="font-bold underline">H1 (#)</span> trong nội dung. 
                    Mỗi trang chỉ được phép có duy nhất một thẻ H1 (là tiêu đề bài viết phía trên). 
                    Vui lòng đổi sang <span className="font-bold underline">H2 (##)</span>.
                  </p>
                </div>
              </div>
            )}

            {/* H2 Warning */}
            {!isH2Valid && !h1Found && formData.content.length > 200 && (
              <div className="m-6 p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-4 animate-shake">
                <div className="p-2 bg-amber-100 rounded-xl">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-amber-900">Cấu trúc nội dung yếu (SEO Warning)</p>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    Bài viết hiện có <span className="font-bold underline">{h2Count} tiêu đề H2</span>. Google ưu tiên các bài viết có ít nhất 3 thẻ H2 (##) để phân tách nội dung rõ ràng cho người đọc.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Moved Media Assets Gallery here */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/50">
            <ImageGallery
              images={formData.images}
              featuredUrl={formData.metaImage}
              onUpdate={handleGalleryUpdate}
              onSetFeatured={(url, alt) => handleSetFeatured(url, alt, url !== formData.metaImage)}
            />
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-8 animate-fade-in-down" style={{ animationDelay: '0.1s' }}>
          {/* SEO Metadata */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/50 space-y-6">
            <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest border-b border-slate-50 pb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
              SEO Configuration
            </h2>

            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                  Meta Title
                  <span className="text-rose-500 font-black">*</span>
                </label>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                  placeholder="Tiêu đề hiển thị trên Google..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all placeholder:text-slate-400 text-slate-900 font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                  Meta Description
                  <span className="text-rose-500 font-black">*</span>
                </label>
                <textarea
                  value={formData.metaDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                  placeholder="Mô tả thu hút người dùng nhấp vào link..."
                  rows={4}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all resize-none leading-relaxed placeholder:text-slate-400 text-slate-900 font-medium"
                />
              </div>

              <SEOLiveFeedback
                title={formData.metaTitle}
                description={formData.metaDescription}
              />
            </div>
          </div>


          {/* Category Selection */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/50 space-y-4">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center justify-between">
              Silo Structure (Category)
              <span className="text-rose-500 font-black">*</span>
            </label>
            <div className="relative">
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold focus:outline-none focus:border-emerald-500 focus:bg-white transition-all appearance-none text-slate-700"
              >
                <option value="">Chọn chủ đề bài viết...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ChevronLeft className="w-4 h-4 -rotate-90" />
              </div>
            </div>
            <p className="text-[10px] text-slate-400 italic leading-relaxed">
              * Lựa chọn danh mục chính xác giúp Google index bài viết đúng cụm chủ đề.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
