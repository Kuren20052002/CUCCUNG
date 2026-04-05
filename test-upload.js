const { PrismaClient } = require('@prisma/client');
const sharp = require('sharp');

async function test() {
  console.log('Testing Sharp...');
  try {
    const buffer = await sharp({
      create: {
        width: 10,
        height: 10,
        channels: 3,
        background: { r: 255, g: 0, b: 0 }
      }
    }).webp().toBuffer();
    console.log('Sharp OK, buffer size:', buffer.length);
  } catch (e) {
    console.error('Sharp Failed:', e);
  }

  console.log('Testing Prisma...');
  try {
    const prisma = new PrismaClient();
    const count = await prisma.media.count();
    console.log('Prisma OK, media count:', count);
    await prisma.$disconnect();
  } catch (e) {
    console.error('Prisma Failed:', e);
  }
}

test();
