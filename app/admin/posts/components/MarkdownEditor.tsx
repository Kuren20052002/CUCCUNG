'use client';

import React, { useState } from 'react';
import { MdEditor, MdPreview } from 'md-editor-rt';
import { PenLine, Eye } from 'lucide-react';
import 'md-editor-rt/lib/style.css';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange }) => {
  const [mode, setMode] = useState<'write' | 'preview'>('write');

  return (
    <div className="space-y-0.5 prose-emerald max-w-none font-sans">
      <div className="px-6 py-4 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-4">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            Nội dung bài viết
            <span className="text-rose-500 font-black">*</span>
          </label>
          <a
            href="/markdown-guide.md"
            download="Huong-dan-soan-thao-NgoanXinhYeu.md"
            className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-[10px] font-bold hover:bg-emerald-100 transition-all"
            title="Tải tệp hướng dẫn sử dụng Markdown"
          >
            <PenLine className="w-3 h-3" />
            Tải Hướng dẫn (MD)
          </a>
        </div>
        
        {/* Write/Preview Toggles */}
        <div className="flex p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setMode('write')}
            className={`
              flex items-center gap-2 px-4 py-1.5 text-[11px] font-bold rounded-lg transition-all
              ${mode === 'write' ? 'bg-white text-emerald-700 shadow-sm shadow-emerald-500/5' : 'text-slate-500 hover:text-slate-700'}
            `}
          >
            <PenLine className={`w-3.5 h-3.5 ${mode === 'write' ? 'text-emerald-500' : 'text-slate-400'}`} />
            Viết nội dung
          </button>
          <button
            type="button"
            onClick={() => setMode('preview')}
            className={`
              flex items-center gap-2 px-4 py-1.5 text-[11px] font-bold rounded-lg transition-all
              ${mode === 'preview' ? 'bg-white text-emerald-700 shadow-sm shadow-emerald-500/5' : 'text-slate-500 hover:text-slate-700'}
            `}
          >
            <Eye className={`w-3.5 h-3.5 ${mode === 'preview' ? 'text-emerald-500' : 'text-slate-400'}`} />
            Xem trước
          </button>
        </div>
      </div>

      <div className="min-h-[600px] border-t border-slate-100 overflow-hidden">
        {mode === 'write' ? (
          <MdEditor
            modelValue={value}
            onChange={onChange}
            language="en-US"
            theme="light"
            preview={false}
            htmlPreview={false}
            toolbarsExclude={['github', 'save', 'preview', 'htmlPreview']}
            toolbars={[
              'bold', 'italic', 'underline', 'strikeThrough', '-', 'title', 'sub', 'sup', 'quote',
              'unorderedList', 'orderedList', 'task', '-', 'codeRow', 'code', 'link', 'image', 'table',
              'mermaid', 'katex', '-', 'revoke', 'next', '=', 'pageFullscreen', 'fullscreen', 'catalog',
            ]}
            style={{ height: '600px', border: 'none' }}
          />
        ) : (
          <div className="bg-white p-8 max-h-[600px] overflow-y-auto">
            <MdPreview
              modelValue={value}
              theme="light"
              language="en-US"
              style={{ padding: 0 }}
            />
            {value.trim().length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                <Eye className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-sm font-medium">Chưa có nội dung để hiển thị xem trước</p>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="p-6 pt-4 bg-slate-50/50 border-t border-slate-50">
        <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          Mẹo SEO: Sử dụng ## cho tiêu đề chính (H2) và ### cho tiêu đề phụ (H3) để Google hiểu cấu trúc bài viết tốt hơn.
        </p>
      </div>
    </div>
  );
};
