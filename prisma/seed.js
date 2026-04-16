require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const { Pool } = require('pg')
const bcrypt = require('bcryptjs')

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ngoanxinhyeu.app' },
    update: {},
    create: {
      email: 'admin@ngoanxinhyeu.app',
      name: 'Admin ngoanxinhyeu',
      password: hashedPassword,
      role: 'ADMIN',
      bio: 'Quản trị viên hệ thống Mẹ & Bé ngoanxinhyeu.',
    },
  })

  console.log({ admin })

  // TEST POST CREATION TO VERIFY SCHEMA
  try {
    const testPost = await prisma.post.findFirst({ where: { slug: 'test-schema-sync' } });
    if (!testPost) {
      await prisma.post.create({
        data: {
          title: 'Test Schema Sync',
          slug: 'test-schema-sync',
          content: 'Testing if featuredImageAlt and images work.',
          metaTitle: 'Test',
          metaDescription: 'Test Description',
          metaImage: '/test.png',
          featuredImageAlt: 'Test Alt',
          images: [{ id: '1', url: '/test.png', alt: 'Test', name: 'test.png' }],
          authorId: admin.id,
        }
      });
      console.log('✅ Prisma Client is in sync: Post created successfully.');
    }
  } catch (e) {
    console.error('❌ Prisma Client SYNC ERROR:', e.message);
  }

const categories = [
  {
    name: 'Dinh dưỡng và phát triển',
    slug: 'dinh-duong-phat-trien',
    description: 'Thông tin về dinh dưỡng và sự phát triển toàn diện của trẻ nhỏ.',
  },
  {
    name: 'Giáo dục sớm và cùng con vui chơi',
    slug: 'giao-duc-som-va-vui-choi',
    description: 'Phương pháp giáo dục sớm và các hoạt động vui chơi cùng con.',
  },
  {
    name: 'Góc Review lựa chọn thông thái cho mẹ và bé',
    slug: 'goc-review-cho-me-va-be',
    description: 'Chia sẻ các bài review sản phẩm và lựa chọn thông thái dành cho mẹ và bé.',
  },
  {
    name: 'Chăm sóc và rèn luyện',
    slug: 'cham-soc-va-ren-luyen',
    description: 'Hướng dẫn chăm sóc sức khỏe và rèn luyện thói quen tốt cho bé.',
  },
  {
    name: 'Thời trang tổ chức sự kiện cho bé',
    slug: 'thoi-trang-su-kien-cho-be',
    description: 'Gợi ý thời trang và tổ chức các sự kiện dành cho bé.',
  },
];
  for (const cat of categories) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description
      },
    })
    console.log(`Created/Updated category: ${category.name}`)
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
