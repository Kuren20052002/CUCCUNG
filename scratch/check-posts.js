
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const allPosts = await prisma.post.count();
  const publishedPosts = await prisma.post.count({ where: { published: true } });
  const indexedPublishedPosts = await prisma.post.count({ where: { published: true, isIndexed: true } });
  const postsNoCategory = await prisma.post.count({ where: { categoryId: null } });

  console.log({
    allPosts,
    publishedPosts,
    indexedPublishedPosts,
    postsNoCategory
  });
  
  process.exit(0);
}

check();
