import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { LayoutDashboard, LogOut, User as UserIcon, FileText, Settings } from "lucide-react";

export default async function AdminPage() {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col pt-8">
        <div className="px-8 mb-10 flex items-center space-x-2">
          <div className="w-8 h-8 bg-pink-400 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <span className="text-xl font-bold text-gray-800">CucCung</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <a href="/admin" className="flex items-center space-x-3 px-4 py-3 bg-pink-50 text-pink-600 rounded-xl font-medium">
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </a>
          <a href="/admin/posts" className="flex items-center space-x-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-700 rounded-xl font-medium transition-all">
            <FileText className="w-5 h-5" />
            <span>Bài viết</span>
          </a>
          <a href="/admin/profile" className="flex items-center space-x-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-700 rounded-xl font-medium transition-all">
            <UserIcon className="w-5 h-5" />
            <span>Hồ sơ</span>
          </a>
          <a href="/admin/settings" className="flex items-center space-x-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-700 rounded-xl font-medium transition-all">
            <Settings className="w-5 h-5" />
            <span>Cài đặt</span>
          </a>
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

      {/* Main Content */}
      <main className="flex-1 p-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Tổng quan hệ thống</h1>
            <p className="text-gray-500">Chào mừng trở lại, {session.user.name}!</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-800">{session.user.name}</p>
              <p className="text-xs text-pink-400 font-medium capitalize">{session.user.role}</p>
            </div>
            <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center text-pink-500 font-bold border-2 border-white shadow-sm">
              {session.user.name?.charAt(0)}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <p className="text-gray-400 text-sm font-medium mb-1">Tổng bài viết</p>
            <h3 className="text-3xl font-bold text-gray-800">128</h3>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <p className="text-gray-400 text-sm font-medium mb-1">Lượt xem trang</p>
            <h3 className="text-3xl font-bold text-gray-800">45.2k</h3>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <p className="text-gray-400 text-sm font-medium mb-1">Bình luận mới</p>
            <h3 className="text-3xl font-bold text-gray-800">12</h3>
          </div>
        </div>

        <div className="mt-10 bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 min-h-[400px]">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Bài viết gần đây</h2>
          <div className="flex flex-col items-center justify-center h-full pt-10 text-gray-300">
            <FileText className="w-16 h-16 mb-4 opacity-20" />
            <p>Chưa có dữ liệu bài viết mới</p>
          </div>
        </div>
      </main>
    </div>
  );
}
