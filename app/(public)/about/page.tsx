import React from 'react';
import Image from 'next/image';
import { Heart, ShieldCheck, Sparkles, Users, Award, BookOpen } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Về ngoanxinhyeu - Sứ mệnh đồng hành cùng Mẹ & Bé',
  description: 'Khám phá câu chuyện đằng sau ngoanxinhyeu.app - Nơi chia sẻ kiến thức chăm sóc mẹ và bé dựa trên nền tảng khoa học và tình yêu thương.',
};

export default function AboutPage() {
  return (
    <div className="space-y-20 pb-20 font-sans mt-8 lg:mt-16">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-[3rem] p-12 lg:p-24 relative overflow-hidden group border-b-8 border-emerald-500 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] -mr-48 -mt-48 transition-transform duration-1000 group-hover:scale-110" />

          <div className="relative z-10 max-w-3xl space-y-8">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Câu chuyện của chúng tôi</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight">
              Vì một thế hệ <span className="text-emerald-500">tương lai</span> rạng rỡ<span className="text-emerald-500">.</span>
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed font-medium">
              ngoanxinhyeu.app ra đời với mong muốn trở thành người bạn đồng hành đáng tin cậy nhất của mọi bà mẹ Việt trên hành trình nuôi dạy con cái đầy hạnh phúc nhưng cũng không ít thử thách.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
            <Image
              src="/hero-mom-baby.png"
              alt="Mẹ và bé hạnh phúc"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 600px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
          </div>

          <div className="space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">Sứ mệnh của chúng tôi<span className="text-primary">.</span></h2>
              <div className="h-1.5 w-20 bg-emerald-500 rounded-full" />
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                  <ShieldCheck className="w-7 h-7 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 mb-2">Kiến thức chuẩn khoa học</h3>
                  <p className="text-slate-500 leading-relaxed font-medium">
                    Chúng tôi cam kết cung cấp thông tin đã được kiểm chứng, giúp các bậc cha mẹ có được cái nhìn đúng đắn nhất về chăm sóc sức khỏe mẹ và bé.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                  <Heart className="w-7 h-7 text-secondary" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 mb-2">Chia sẻ từ trái tim</h3>
                  <p className="text-slate-500 leading-relaxed font-medium">
                    Không chỉ là lý thuyết, ngoanxinhyeu còn là nơi hội tụ những kinh nghiệm thực tế, những câu chuyện truyền cảm hứng từ hàng ngàn bà mẹ bỉm sữa.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-black text-primary uppercase tracking-[0.3em]">Giá trị cốt lõi</h2>
            <h3 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">Chúng tôi tin vào những giá trị bền vững.</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Users, title: 'Cộng đồng', desc: 'Kết nối hàng triệu bà mẹ, cùng nhau chia sẻ và thấu hiểu.' },
              { icon: Award, title: 'Chất lượng', desc: 'Nội dung được đầu tư bài bản, hình ảnh sống động và chuyên nghiệp.' },
              { icon: BookOpen, title: 'Học hỏi', desc: 'Không ngừng cập nhật những xu hướng nuôi dạy con tiến bộ trên thế giới.' }
            ].map((value, i) => (
              <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-xl font-black text-slate-900 mb-4">{value.title}</h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10" />
          <div className="relative z-10 space-y-8 max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-5xl font-black text-white leading-tight">Hãy để chúng tôi đồng hành cùng bạn trên hành trình tuyệt vời này.</h2>
            <div className="flex justify-center flex-wrap gap-4 pt-4">
              <button className="px-10 py-5 bg-white text-primary font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-white/10 hover:bg-slate-100 transition-all active:scale-95">Trang chủ</button>
              <button className="px-10 py-5 bg-emerald-700 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl hover:bg-emerald-800 transition-all active:scale-95">Khám phá bài viết</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
