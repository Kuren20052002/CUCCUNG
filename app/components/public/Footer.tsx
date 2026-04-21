import React from 'react';
import Link from 'next/link';
import { Mail, Heart, ArrowRight, Share2, Globe, MessageCircle } from 'lucide-react';

interface FooterProps {
  categories: { name: string; slug: string }[];
}

export const Footer: React.FC<FooterProps> = ({ categories }) => {
  return (
    <footer className="bg-slate-900 pt-20 pb-10 overflow-hidden relative">
      {/* Subtle Glow effects */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-secondary to-primary opacity-50" />
      <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Brand Bio */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:rotate-6 transition-all duration-300">
                <span className="text-white font-black text-2xl tracking-tighter">N</span>
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                ngoanxinhyeu<span className="text-emerald-500 ml-0.5">.</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              ngoanxinhyeu.app là blog chuyên về kiến thức thai kỳ, nuôi dạy con cái và đánh giá đồ dùng cho mẹ & bé. Đồng hành cùng mẹ bỉm sữa chăm sóc thế hệ tương lai.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <a href="#" aria-label="Theo dõi ngoanxinhyeu trên Facebook" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1 shadow-lg active:scale-95">
                <Share2 className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Theo dõi ngoanxinhyeu trên Instagram" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-pink-600 hover:text-white transition-all transform hover:-translate-y-1 shadow-lg active:scale-95">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Nhắn tin qua Zalo" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-sky-500 hover:text-white transition-all transform hover:-translate-y-1 shadow-lg active:scale-95">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xs font-black text-white uppercase tracking-widest border-b border-slate-800 pb-4 inline-block">Khám phá</h3>
            <ul className="space-y-4">
              {categories.slice(0, 4).map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/${cat.slug}`} className="text-slate-400 text-sm font-medium hover:text-primary transition-colors flex items-center group">
                    <span className="w-1.5 h-1.5 bg-emerald-500/20 rounded-full mr-2 group-hover:w-3 transition-all" />
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xs font-black text-white uppercase tracking-widest border-b border-slate-800 pb-4 inline-block">Về chúng tôi</h3>
            <ul className="space-y-4">
              {[
                { name: 'Về ngoanxinhyeu', href: '/about' },
                { name: 'Liên hệ Quảng cáo', href: '/contact' },
                { name: 'Chính sách bảo mật', href: '/privacy' },
                { name: 'Điều khoản sử dụng', href: '/terms' }
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-slate-400 text-sm font-medium hover:text-primary transition-colors flex items-center group">
                    <span className="w-1.5 h-1.5 bg-secondary/30 rounded-full mr-2 group-hover:scale-150 transition-all" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Form */}
          <div className="lg:col-span-4 space-y-6" id="newsletter">
            <h3 className="text-xs font-black text-white uppercase tracking-widest border-b border-slate-800 pb-4 inline-block">Bản tin của mẹ</h3>
            <p className="text-slate-400 text-xs">Nhận những tin tức hữu ích nhất về thai kỳ & chăm sóc bé hàng tuần qua email.</p>
            <form className="relative group">
              <input
                type="email"
                placeholder="email@example.com"
                className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-500 pr-32"
              />
              <button type="submit" aria-label="Đăng ký nhận bản tin" className="absolute right-2 top-2 bottom-2 px-5 bg-primary text-white text-xs font-black rounded-xl hover:bg-emerald-600 transition-all flex items-center space-x-2 shadow-lg active:scale-95">
                <span>Tham gia</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            <div className="flex items-center space-x-2 text-slate-500 text-[10px] font-bold tracking-tight px-1">
              <Mail className="w-3 h-3" />
              <span>Chăm sóc bảo mật 100%. Không bao giờ gửi thư rác.</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-xs font-bold tracking-tight">
            © {new Date().getFullYear()} ngoanxinhyeu.app
            <span className="mx-2 font-normal opacity-30 text-emerald-500">|</span>
            Là dự án phát triển với mục đích học tập và trải nghiệm người dùng <Heart className="w-3 h-3 inline pb-0.5 text-rose-500 fill-rose-500" />
          </p>
          <div className="flex items-center space-x-6 text-slate-500 text-[10px] font-black uppercase tracking-widest">
            <Link href="/sitemap.xml" className="hover:text-primary transition-colors">Sitemap</Link>
            <Link href="/rss.xml" className="hover:text-primary transition-colors">RSS Feed</Link>
            <Link href="/authors" className="hover:text-primary transition-colors">Authors</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
