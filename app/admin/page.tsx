import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { FileText } from "lucide-react";
import { format } from "date-fns";

export default async function AdminPage() {
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/login");
  }

  // Fetch posts
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: 5, // Limit to recent 5 posts
  });

  return (
    <>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <p className="text-gray-400 text-sm font-medium mb-1">Tổng bài viết</p>
          <h3 className="text-3xl font-bold text-gray-800">{posts.length}</h3>
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Bài viết gần đây</h2>
          <a href="/admin/posts/new" className="px-4 py-2 bg-pink-500 text-white rounded-xl text-sm font-bold hover:bg-pink-600 transition shadow-lg shadow-pink-500/20">
            Tạo bài viết mới
          </a>
        </div>

        {posts.length > 0 ? (
          <ul className="space-y-4">
            {posts.map((post: any) => (
              <li key={post.id} className="border-b pb-4">
                <Link href={`/${post.category?.slug}/${post.slug}`} className="block hover:underline">
                  <h3 className="text-lg font-semibold text-emerald-700">{post.title}</h3>
                </Link>
                <p className="text-sm text-gray-500">
                  {post.category?.name && (
                    <span className="mr-2">Category: {post.category.name}</span>
                  )}
                  <span>Published: {format(new Date(post.createdAt), "MMMM dd, yyyy")}</span>
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-full pt-10 text-gray-300">
            <FileText className="w-16 h-16 mb-4 opacity-20" />
            <p>Chưa có dữ liệu bài viết mới</p>
          </div>
        )}
      </div>
    </>
  );
}
