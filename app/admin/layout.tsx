import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { LayoutDashboard, LogOut, User as UserIcon, FileText, Settings } from "lucide-react";
import Link from 'next/link';
import Image from "next/image";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col pt-8 sticky top-0 h-screen shadow-sm">
        <div className="px-8 mb-10 flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
              <Image
                src="/cuccung_logo.png" // Đường dẫn tính từ thư mục public
                alt="Logo Cục Cưng - Cộng đồng Mẹ & Bé uy tín" // ALT text chuẩn SEO
                width={250} // Chiều rộng thực tế bạn muốn hiển thị (pixel)
                height={100} // Chiều cao tương ứng để giữ tỷ lệ
                priority // Thuộc tính quan trọng: Ưu tiên load logo ngay lập tức (LCP)
                className="object-contain" // Giúp ảnh không bị méo trong khung
              />
            </div>
            <span className="text-xl font-extrabold text-slate-800 tracking-tight">NgoanXinhYeu</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1.5">
          <Link
            href="/admin"
            className="flex items-center space-x-3 px-4 py-2.5 hover:bg-emerald-50 hover:text-primary text-slate-600 rounded-xl font-semibold transition-all active:scale-95"
          >
            <LayoutDashboard className="w-5 h-5 opacity-70" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/admin/posts"
            className="flex items-center space-x-3 px-4 py-2.5 bg-emerald-50 text-primary rounded-xl font-bold border border-emerald-100 shadow-sm shadow-emerald-500/5 transition-all"
          >
            <FileText className="w-5 h-5" />
            <span>Bài viết</span>
          </Link>
          <Link
            href="/admin/profile"
            className="flex items-center space-x-3 px-4 py-2.5 text-slate-500 hover:bg-slate-50 hover:text-slate-800 rounded-xl font-semibold transition-all active:scale-95"
          >
            <UserIcon className="w-5 h-5 opacity-70" />
            <span>Hồ sơ</span>
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center space-x-3 px-4 py-2.5 text-slate-500 hover:bg-slate-50 hover:text-slate-800 rounded-xl font-semibold transition-all active:scale-95"
          >
            <Settings className="w-5 h-5 opacity-70" />
            <span>Cài đặt</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-50 hover:text-red-500 rounded-xl font-medium transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Đăng xuất</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
