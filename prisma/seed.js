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
    { name: 'Thai kỳ & Sinh con', slug: 'thai-ky-va-sinh-con', description: 'Kiến thức về thai kỳ và chuẩn bị sinh con.' },
    { name: 'Chăm sóc bé sơ sinh', slug: 'cham-soc-be-so-sinh', description: 'Hướng dẫn chăm sóc bé trong những tháng đầu đời.' },
    { name: 'Dinh dưỡng & Ăn dặm', slug: 'dinh-duong-va-an-dam', description: 'Chế độ dinh dưỡng và hành trình ăn dặm của bé.' },
    { name: 'Review & Kinh nghiệm chọn đồ', slug: 'review-va-kinh-nghiem-chon-do', description: 'Đánh giá sản phẩm và kinh nghiệm mua sắm cho mẹ & bé.' },
  ]

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
