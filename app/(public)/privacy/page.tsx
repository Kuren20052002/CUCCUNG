import React from 'react';
import { Shield, Lock, Eye, Server, RefreshCcw } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chính sách bảo mật - ngoanxinhyeu',
  description: 'Chính sách bảo mật của ngoanxinhyeu.app - Cam kết bảo vệ thông tin cá nhân và dữ liệu riêng tư của người dùng.',
};

export default function PrivacyPage() {
  const sections = [
    {
      icon: Eye,
      title: 'Thông tin chúng tôi thu thập',
      content: 'Chúng tôi có thể thu thập thông tin cá nhân như tên, địa chỉ email khi bạn đăng ký nhận bản tin hoặc để lại bình luận. Những thông tin này giúp chúng tôi cá nhân hóa trải nghiệm người dùng và cung cấp nội dung phù hợp nhất.'
    },
    {
      icon: Shield,
      title: 'Cách chúng tôi bảo vệ thông tin',
      content: 'Chúng tôi áp dụng các biện pháp bảo mật nghiêm ngặt để đảm bảo an toàn cho thông tin cá nhân của bạn. Dữ liệu của bạn được lưu trữ trên các máy chủ bảo mật và chỉ những nhân viên có thẩm quyền mới được phép truy cập.'
    },
    {
      icon: Lock,
      title: 'Cam kết không chia sẻ dữ liệu',
      content: 'ngoanxinhyeu.app cam kết không bán, trao đổi hoặc cho bên thứ ba thuê thông tin nhận dạng cá nhân của người dùng. Chúng tôi chỉ chia sẻ thông tin khi có yêu cầu từ cơ quan pháp luật có thẩm quyền.'
    },
    {
      icon: Server,
      title: 'Sử dụng Cookie',
      content: 'Trang web sử dụng Cookie để nâng cao trải nghiệm người dùng, giúp chúng tôi phân tích lưu lượng truy cập và cải thiện chất lượng nội dung. Bạn có thể chọn tắt Cookie trong cài đặt trình duyệt của mình.'
    }
  ];

  return (
    <div className="pb-20 font-sans mt-8 lg:mt-16 bg-transparent selections:bg-emerald-100 selections:text-emerald-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-slate-900 p-12 lg:p-16 rounded-[3rem] shadow-2xl relative overflow-hidden mb-16 group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] transition-transform duration-1000 group-hover:scale-110" />
          <div className="relative z-10 space-y-6">
            <h1 className="text-4xl lg:text-6xl font-black text-white leading-tight underline decoration-emerald-500/30">Chính sách bảo mật<span className="text-emerald-500">.</span></h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
              <RefreshCcw className="w-3.5 h-3.5" /> Cập nhật lần cuối: 21 tháng 04, 2026
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-[3rem] shadow-sm p-10 lg:p-16 space-y-16">
          <div className="prose prose-emerald max-w-none">
            <p className="text-slate-600 font-medium leading-relaxed italic">
              Chào mừng bạn đến với ngoanxinhyeu.app. Sự riêng tư của bạn là ưu tiên hàng đầu của chúng tôi. Chúng tôi thiết lập Chính sách bảo mật này để giải thích cách chúng tôi xử lý thông tin cá nhân của bạn.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12">
            {sections.map((section, index) => (
              <div key={index} className="flex gap-8 group">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-500">
                  <section.icon className="w-8 h-8 text-emerald-600" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">{section.title}</h2>
                  <p className="text-slate-500 leading-relaxed font-medium">{section.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Box */}
          <div className="mt-20 pt-16 border-t border-slate-100 text-center space-y-6">
            <h3 className="text-2xl font-black text-slate-900">Mọi thắc mắc vui lòng liên hệ</h3>
            <p className="text-slate-500 font-medium">Chúng tôi luôn sẵn sàng giải đáp các thắc mắc về quyền riêng tư của bạn.</p>
            <a href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 transition-all active:scale-95">Gửi Email</a>
          </div>
        </div>
      </div>
    </div>
  );
}
