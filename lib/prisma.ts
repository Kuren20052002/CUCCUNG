import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const prismaClientSingleton = () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

// 1. Get or create initial instance
let prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

// 2. Hot-reload fix: If Media model was just added but isn't in our cached instance
if (process.env.NODE_ENV !== 'production' && !(prisma as any).media) {
  console.log('Regenerating Prisma client to include new models...');
  prisma = prismaClientSingleton()
}

// 3. Keep for next time in dev
if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma
}

export default prisma
