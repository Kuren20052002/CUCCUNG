import React from 'react';
import { Gavel, Scale, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Điều khoản sử dụng - ngoanxinhyeu',
  description: 'Điều khoản sử dụng của ngoanxinhyeu.app - Các quy định và điều kiện khi sử dụng trang web và dịch vụ của chúng tôi.',
};

export default function TermsPage() {
  const terms = [
    {
      title: 'Chấp nhận điều khoản',
      desc: 'Bằng việc truy cập và sử dụng ngoanxinhyeu.app, bạn đồng ý tuân theo các quy định và điều kiện được nêu tại đây. Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng ngừng sử dụng trang web.'
    },
    {
      title: 'Bản quyền nội dung',
      desc: 'Tất cả nội dung bao gồm bài viết, hình ảnh, video trên trang web này thuộc sở hữu của ngoanxinhyeu.app hoặc được cấp phép sử dụng. Nghiêm cấm sao chép, phân phối lại dưới bất kỳ hình thức nào mà không có sự đồng ý bằng văn bản.'
    },
    {
      title: 'Trách nhiệm người dùng',
      desc: 'Người dùng cam kết không sử dụng trang web để đăng tải các nội dung vi phạm pháp luật, xúc phạm người khác hoặc gây tổn hại đến hệ thống của chúng tôi. Bạn chịu trách nhiệm hoàn toàn về các bình luận mà mình đăng tải.'
    },
    {
      title: 'Tuyên bố miễn trừ trách nhiệm',
      desc: 'Các thông tin về sức khỏe và chăm sóc trẻ em trên ngoanxinhyeu.app chỉ mang tính chất tham khảo. Chúng tôi khuyên bạn nên tham vấn ý kiến bác sĩ chuyên khoa trước khi áp dụng bất kỳ phương pháp nào.'
    }
  ];

  return (
    <div className="pb-20 font-sans mt-8 lg:mt-16 bg-transparent selections:bg-emerald-100 selections:text-emerald-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-emerald-600 p-12 lg:p-16 rounded-[3rem] shadow-2xl relative overflow-hidden mb-16 group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] transition-transform duration-1000 group-hover:scale-110" />
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3 text-emerald-100 font-black text-xs uppercase tracking-[0.3em]">
               <Gavel className="w-5 h-5" />
               Quy định & Pháp lý
            </div>
            <h1 className="text-4xl lg:text-6xl font-black text-white leading-tight">Điều khoản sử dụng<span className="text-emerald-200">.</span></h1>
            <p className="text-emerald-50 text-sm font-medium leading-relaxed max-w-xl">
              Vui lòng đọc kỹ các điều khoản này để hiểu rõ quyền lợi và trách nhiệm của bạn khi tham gia cộng đồng của chúng tôi.
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-8">
          {terms.map((term, i) => (
            <div key={i} className="bg-white p-8 lg:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group flex items-start gap-8">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:bg-primary group-hover:text-white transition-all">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-4">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">{term.title}</h2>
                <p className="text-slate-500 leading-relaxed font-medium">{term.desc}</p>
              </div>
            </div>
          ))}

          {/* Disclaimer Area */}
          <div className="bg-rose-50 p-10 lg:p-12 rounded-[3.5rem] border-2 border-dashed border-rose-200 mt-12">
            <div className="flex items-center gap-4 mb-6">
               <AlertTriangle className="w-8 h-8 text-rose-500" />
               <h3 className="text-xl font-black text-rose-900">Lưu ý quan trọng</h3>
            </div>
            <p className="text-rose-800/80 leading-relaxed font-bold italic">
               Mọi thông tin trên trang web này không thay thế cho lời khuyên y tế chuyên nghiệp. NGOANXINHYEU không chịu trách nhiệm về bất kỳ hậu quả nào phát sinh từ việc tự ý áp dụng kiến thức mà không có sự giám sát của bác sĩ.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
