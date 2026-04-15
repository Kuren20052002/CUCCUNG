'use client';

import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { deletePost } from "../actions";

export function DeletePostButton({ postId, title }: { postId: string, title: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deletePost(postId);
      if (result.success) {
        setShowConfirm(false);
      } else {
        alert("Xóa thất bại: " + result.error);
      }
    } catch (err) {
      alert("Đã xảy ra lỗi khi xóa bài viết");
    } finally {
      setIsDeleting(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-red-500 animate-pulse">Xác nhận?</span>
        <button 
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 transition-all flex items-center gap-1"
        >
          {isDeleting ? <Loader2 className="w-3 h-3 animate-spin" /> : "Có"}
        </button>
        <button 
          onClick={() => setShowConfirm(false)}
          className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-200 transition-all"
        >
          Không
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={() => setShowConfirm(true)}
      className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
    >
      <Trash2 className="w-4 h-4" />
      <span>Xóa</span>
    </button>
  );
}
