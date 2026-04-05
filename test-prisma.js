const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();

async function test() {
  console.log('Testing Prisma Media access...');
  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });
    
    console.log('Available models:', Object.keys(prisma).filter(k => !k.startsWith('_')));
    
    const count = await prisma.media.count();
    console.log('Media count:', count);
    
    await prisma.$disconnect();
    await pool.end();
  } catch (e) {
    console.error('Prisma Error:', e);
  }
}

test();
