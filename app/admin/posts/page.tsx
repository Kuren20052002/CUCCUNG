import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import Link from "next/link";
import { 
  FileText, 
  Plus, 
  Edit, 
  ChevronLeft, 
  ChevronRight,
  Calendar,
  Eye,
  Search
} from "lucide-react";
import { PostFilters } from "./components/PostFilters";
import { DeletePostButton } from "./components/DeletePostButton";

interface PostsPageProps {
  searchParams: Promise<{
    query?: string;
    sort?: string;
    page?: string;
    status?: string;
  }>;
}

export default async function PostsPage(props: PostsPageProps) {
  const searchParams = await props.searchParams;
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/login");
  }

  const query = searchParams.query || "";
  const sort = searchParams.sort === "asc" ? "asc" : "desc";
  const status = searchParams.status || "all";
  const currentPage = parseInt(searchParams.page || "1");
  const pageSize = 10;

  // Build where clause
  const where: any = {
    title: {
      contains: query,
      mode: "insensitive",
    },
  };

  if (status === "published") {
    where.published = true;
  } else if (status === "draft") {
    where.published = false;
  }

  // Fetch posts with filters
  const [posts, totalCount] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: {
        createdAt: sort,
      },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
      include: {
        category: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    }),
    prisma.post.count({
      where,
    }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const getPaginationUrl = (pageNum: number) => {
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (sort !== "desc") params.set("sort", sort);
    if (status !== "all") params.set("status", status);
    if (pageNum > 1) params.set("page", pageNum.toString());
    return `/admin/posts?${params.toString()}`;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Quản lý bài viết</h1>
          <p className="text-slate-500 mt-1">Danh sách tất cả bài viết trên hệ thống ({totalCount})</p>
        </div>
        
        <Link 
          href="/admin/posts/new" 
          className="flex items-center space-x-2 px-6 py-3 bg-pink-500 text-white rounded-2xl font-bold hover:bg-pink-600 transition shadow-lg shadow-pink-500/20 active:scale-95 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Tạo bài viết mới</span>
        </Link>
      </header>

      {/* Filters and Search */}
      <PostFilters initialQuery={query} initialSort={sort} initialStatus={status} />

      {/* Posts List */}
      <div className="grid grid-cols-1 gap-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div 
              key={post.id} 
              className="group bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:border-pink-100 hover:shadow-md transition-all duration-300 relative overflow-hidden"
            >
              {/* Status Badge */}
              <div className="absolute top-0 right-0">
                <div className={`px-4 py-1.5 rounded-bl-2xl text-[10px] uppercase font-black tracking-widest ${
                  post.published 
                    ? "bg-emerald-50 text-emerald-600 border-l border-b border-emerald-100" 
                    : "bg-amber-50 text-amber-600 border-l border-b border-amber-100"
                }`}>
                  {post.published ? "Công khai" : "Nháp"}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                {/* Image Placeholder or Actual Image */}
                <div className="w-full md:w-48 h-32 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden relative group-hover:scale-[1.02] transition-transform duration-500">
                  {post.metaImage ? (
                    <img src={post.metaImage} alt={post.title} className="w-full h-full object-cover" />
                  ) : (
                    <FileText className="w-10 h-10 text-slate-300" />
                  )}
                  {post.category && (
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-bold text-slate-600 shadow-sm uppercase">
                      {post.category.name}
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-3">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-slate-800 group-hover:text-pink-600 transition-colors">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {format(new Date(post.createdAt), "dd/MM/yyyy HH:mm")}
                      </span>
                      <span>•</span>
                      <span className="text-slate-500 font-bold">Bởi {post.author.name}</span>
                    </div>
                  </div>

                  {/* Metadata display as requested */}
                  <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 group-hover:bg-pink-50/30 group-hover:border-pink-50 transition-colors">
                    <p className="text-xs font-bold text-pink-500 uppercase tracking-wider mb-1">SEO Title</p>
                    <p className="text-sm font-semibold text-slate-700 mb-2">{post.metaTitle}</p>
                    
                    <p className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-1">Content Preview</p>
                    <p className="text-sm text-slate-500 line-clamp-2 italic">
                      {post.content.replace(/[#*`]/g, '').slice(0, 200)}...
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                       <Link 
                        href={`/${post.category?.slug}/${post.slug}`}
                        target="_blank"
                        className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all"
                        title="Xem trang công khai"
                      >
                        <Eye className="w-5 h-5" />
                      </Link>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link 
                        href={`/admin/posts/edit/${post.id}`}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 hover:text-pink-600 hover:bg-pink-50 rounded-xl transition-all border border-transparent hover:border-pink-100"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Sửa</span>
                      </Link>
                      <DeletePostButton postId={post.id} title={post.title} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-20 rounded-[3rem] shadow-sm border border-slate-100 border-dashed flex flex-col items-center justify-center text-slate-300">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <Search className="w-10 h-10 opacity-20" />
            </div>
            <h3 className="text-xl font-bold text-slate-400">Không tìm thấy bài viết nào</h3>
            <p className="text-slate-400 text-sm mt-1">Hãy thử đổi từ khóa tìm kiếm hoặc lọc lại</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 py-8">
          <Link
            href={getPaginationUrl(Math.max(1, currentPage - 1))}
            className={`p-3 rounded-2xl transition-all ${
              currentPage === 1 
                ? "text-slate-200 pointer-events-none" 
                : "bg-white text-slate-600 hover:bg-pink-50 hover:text-pink-500 shadow-sm"
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
          </Link>
          
          <div className="flex items-center gap-2">
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              const isCurrent = pageNum === currentPage;
              
              if (
                pageNum === 1 || 
                pageNum === totalPages || 
                (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
              ) {
                return (
                  <Link
                    key={pageNum}
                    href={getPaginationUrl(pageNum)}
                    className={`w-12 h-12 flex items-center justify-center rounded-2xl font-bold transition-all ${
                      isCurrent 
                        ? "bg-pink-500 text-white shadow-lg shadow-pink-500/30 scale-110 z-10" 
                        : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-100 shadow-sm"
                    }`}
                  >
                    {pageNum}
                  </Link>
                );
              } else if (
                (pageNum === currentPage - 3 && pageNum > 1) || 
                (pageNum === currentPage + 3 && pageNum < totalPages)
              ) {
                return <span key={pageNum} className="px-1 text-slate-400">...</span>;
              }
              return null;
            })}
          </div>

          <Link
            href={getPaginationUrl(Math.min(totalPages, currentPage + 1))}
            className={`p-3 rounded-2xl transition-all ${
              currentPage === totalPages 
                ? "text-slate-200 pointer-events-none" 
                : "bg-white text-slate-600 hover:bg-pink-50 hover:text-pink-500 shadow-sm"
            }`}
          >
            <ChevronRight className="w-6 h-6" />
          </Link>
        </div>
      )}
    </div>
  );
}
