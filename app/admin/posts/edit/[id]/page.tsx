import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { PostForm } from "../../components/PostForm";

interface EditPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPostPage(props: EditPostPageProps) {
  const params = await props.params;
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/login");
  }

  const postId = params.id;

  // Fetch post and categories in parallel
  const [post, categories] = await Promise.all([
    prisma.post.findUnique({
      where: { id: postId },
      include: {
        category: true,
      },
    }),
    prisma.category.findMany({
      orderBy: {
        name: 'asc'
      },
      select: {
        id: true,
        name: true
      }
    }),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <div className="animate-fade-in">
      <PostForm 
        initialData={{
          ...post,
          categoryId: post.categoryId || '',
          images: post.images || [],
        }} 
        categories={categories} 
      />
    </div>
  );
}
