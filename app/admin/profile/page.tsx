import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import Link from "next/link";
import { 
  FileText, 
  Settings, 
  Calendar,
  ChevronRight,
  Eye,
  Edit
} from "lucide-react";
import { ProfileForm } from "./components/ProfileForm";

export default async function ProfilePage() {
  const session = await auth();

  if (!session || !session.user?.id) {
    redirect("/login");
  }

  // Fetch user data and their posts
  const [user, posts] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
    }),
    prisma.post.findMany({
      where: { authorId: session.user.id },
      include: {
        category: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: 20, // Show last 20 posts in profile
    }),
  ]);

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Header section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Hồ sơ cá nhân</h1>
          <p className="text-slate-500 mt-1">Quản lý thông tin cá nhân và xem các bài viết của bạn</p>
        </div>
      </header>

      {/* Profile Form Section */}
      <ProfileForm user={{
        id: user.id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar
      }} />

      {/* User Posts Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-500" />
            Bài viết của bạn ({posts.length})
          </h2>
          <Link href="/admin/posts" className="text-sm font-bold text-pink-500 hover:text-pink-600 flex items-center gap-1 transition-colors">
            Xem tất cả <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div 
                key={post.id} 
                className="bg-white p-5 rounded-[2rem] border border-slate-100 hover:border-pink-100 hover:shadow-md transition-all group relative overflow-hidden"
              >
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-slate-50 rounded-2xl shrink-0 overflow-hidden relative">
                    {post.metaImage ? (
                      <img src={post.metaImage} alt={post.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileText className="w-8 h-8 text-slate-200" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0 py-1">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                      <span className="text-emerald-500">{post.category?.name || 'Uncategorized'}</span>
                      <span>•</span>
                      <span>{format(new Date(post.updatedAt), "dd/MM/yyyy")}</span>
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-800 line-clamp-2 leading-tight group-hover:text-pink-600 transition-colors">
                      {post.title}
                    </h3>
                  </div>
                </div>
                
                <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link 
                    href={`/admin/posts/edit/${post.id}`}
                    className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 hover:text-pink-500 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <Link 
                    href={`/${post.category?.slug}/${post.slug}`}
                    target="_blank"
                    className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 hover:text-emerald-500 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
               <FileText className="w-12 h-12 mb-4 opacity-20" />
               <p className="font-bold">Bạn chưa có bài viết nào</p>
               <Link href="/admin/posts/new" className="mt-4 px-6 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-pink-500 hover:bg-pink-50 transition-all">
                  Viết bài ngay
               </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
