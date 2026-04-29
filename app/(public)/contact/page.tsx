import React from 'react';
import { Mail, Phone, MapPin, MessageCircle, Send, Globe, MessageSquare } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Liên hệ - Ngoan Xinh Yêu sẵn sàng lắng nghe bạn',
  description: 'Liên hệ với đội ngũ ngoanxinhyeu.app để hợp tác quảng cáo, đóng góp ý kiến hoặc được giải đáp các thắc mắc về chăm sóc mẹ và bé.',
};

export default function ContactPage() {
  return (
    <div className="space-y-20 pb-20 font-sans mt-8 lg:mt-16">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 animate-fade-in-down">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100">
          <MessageCircle className="w-4 h-4 text-emerald-600" />
          <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Chúng tôi luôn lắng nghe</span>
        </div>
        <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
          Kết nối với <span className="text-primary underline decoration-emerald-500/20">ngay hôm nay</span>.
        </h1>
        <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto font-medium">
          Bạn có thắc mắc, ý tưởng hợp tác hay đơn giản là muốn chia sẻ trải nghiệm của mình? Hãy liên hệ với chúng tôi qua form dưới đây.
        </p>
      </section>

      {/* Container Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center"> {/* Added flex justify-center for safety */}

          {/* Contact Form Container - Now Centered */}
          <div className="w-full max-w-3xl bg-white p-10 lg:p-16 rounded-[3rem] border border-slate-100 shadow-2xl">
            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Họ và tên</label>
                  <input type="text" placeholder="Nguyễn Văn A" className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-300" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email</label>
                  <input type="email" placeholder="email@example.com" className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-300" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Chủ đề</label>
                <select className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all text-slate-600">
                  <option>Hợp tác quảng cáo</option>
                  <option>Đóng góp nội dung</option>
                  <option>Cần hỗ trợ về sức khỏe</option>
                  <option>Khác</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Tin nhắn của bạn</label>
                <textarea rows={5} placeholder="Chia sẻ với chúng tôi..." className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-300 resize-none"></textarea>
              </div>

              <button className="w-full py-5 bg-primary hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-emerald-500/20 transition-all active:scale-95 flex items-center justify-center gap-3 group">
                Gửi tin nhắn <Send className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
}
