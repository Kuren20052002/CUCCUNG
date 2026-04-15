'use client';

import React, { useState, useRef } from 'react';
import { Camera, Save, Loader2, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';
import { updateProfile } from '../actions';
import Image from 'next/image';

interface ProfileFormProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    bio: string | null;
    avatar: string | null;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || '',
    bio: user.bio || '',
    avatar: user.avatar || '',
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Kích thước ảnh không được vượt quá 2MB');
      return;
    }

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await res.json();
      setFormData(prev => ({ ...prev, avatar: data.url }));
      toast.success('Tải ảnh đại diện lên thành công');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await updateProfile(formData);
      if (result.success) {
        toast.success('Cập nhật hồ sơ thành công');
      } else {
        toast.error(result.error || 'Cập nhật thất bại');
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi cập nhật hồ sơ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in-down">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Avatar Sidebar */}
        <div className="w-full md:w-64 shrink-0 space-y-4">
          <div className="relative group">
            <div className={`w-full aspect-square rounded-[3rem] overflow-hidden border-4 border-white shadow-xl bg-slate-100 flex items-center justify-center relative ${uploading ? 'opacity-50' : ''}`}>
              {formData.avatar ? (
                <Image 
                  src={formData.avatar} 
                  alt={formData.name || 'Avatar'} 
                  fill
                  className="object-cover"
                />
              ) : (
                <UserIcon className="w-20 h-20 text-slate-300" />
              )}
              
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-sm">
                  <Loader2 className="w-10 h-10 text-pink-500 animate-spin" />
                </div>
              )}
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute inset-0 bg-pink-600/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center text-white"
              >
                <Camera className="w-8 h-8 mb-2" />
                <span className="text-xs font-black uppercase tracking-widest">Thay đổi ảnh</span>
              </button>
            </div>
            
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarUpload}
              className="hidden"
              accept="image/*"
            />
          </div>
          
          <div className="text-center md:text-left px-2">
            <p className="text-sm font-bold text-slate-700">{user.email}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Admin Account</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="flex-1 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm shadow-slate-200/50 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Họ và tên</label>
              <input 
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nhập tên của bạn..."
                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-slate-800 font-semibold focus:ring-2 focus:ring-pink-500/20 focus:bg-white transition-all outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest leading-relaxed">Tiểu sử (E-E-A-T Info)</label>
              <textarea 
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Giới thiệu về chuyên môn và kinh nghiệm của bạn..."
                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-slate-700 font-medium focus:ring-2 focus:ring-pink-500/20 focus:bg-white transition-all outline-none min-h-[150px] leading-relaxed"
              />
              <p className="text-[10px] text-slate-400 italic leading-relaxed">
                * Tiểu sử chuyên nghiệp giúp củng cố yếu tố Chuyên gia (Expertise) cho website của bạn trên Google.
              </p>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-8 py-4 bg-pink-500 text-white rounded-2xl font-bold hover:bg-pink-600 transition shadow-lg shadow-pink-500/20 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                <span>{loading ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
