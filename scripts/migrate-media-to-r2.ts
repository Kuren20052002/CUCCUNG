/**
 * Migration Script: PostgreSQL Media Blobs → Cloudflare R2
 * 
 * This script reads all images stored as binary blobs in the PostgreSQL
 * `Media` table, uploads them to Cloudflare R2, and updates all Post
 * records that reference the old `/api/media/{id}` URLs to use the new
 * R2 CDN URLs.
 * 
 * Usage:
 *   npx tsx scripts/migrate-media-to-r2.ts
 * 
 * Prerequisites:
 *   - R2 bucket created with public access enabled
 *   - R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_PUBLIC_URL
 *     set in .env
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Initialize Prisma
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Initialize R2 (S3-compatible)
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'ngoanxinhyeu-media';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;

if (!R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY || !R2_PUBLIC_URL) {
  console.error('❌ Missing R2 environment variables. Please set:');
  console.error('   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_PUBLIC_URL');
  process.exit(1);
}

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

async function main() {
  console.log('🚀 Starting media migration: PostgreSQL → Cloudflare R2\n');

  // 1. Fetch all media records
  const allMedia = await (prisma as any).media.findMany({
    select: { id: true, filename: true, type: true, data: true },
  });

  console.log(`📦 Found ${allMedia.length} media records in database\n`);

  if (allMedia.length === 0) {
    console.log('✅ No media to migrate. Done!');
    return;
  }

  // 2. Upload each to R2
  const urlMap = new Map<string, string>(); // old URL → new URL

  for (const [index, media] of allMedia.entries()) {
    const oldUrl = `/api/media/${media.id}`;
    const key = `media/${media.id}.webp`;

    try {
      await r2.send(new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        Body: media.data as Buffer,
        ContentType: media.type || 'image/webp',
        CacheControl: 'public, max-age=31536000, immutable',
      }));

      const newUrl = `${R2_PUBLIC_URL}/${key}`;
      urlMap.set(oldUrl, newUrl);

      const sizeKB = ((media.data as Buffer).length / 1024).toFixed(1);
      console.log(`  [${index + 1}/${allMedia.length}] ✅ ${media.filename} (${sizeKB}KB) → ${newUrl}`);
    } catch (error: any) {
      console.error(`  [${index + 1}/${allMedia.length}] ❌ Failed: ${media.filename} — ${error.message}`);
    }
  }

  console.log(`\n📤 Uploaded ${urlMap.size}/${allMedia.length} files to R2\n`);

  // 3. Update Post records that reference old URLs
  const posts = await prisma.post.findMany({
    select: { id: true, content: true, metaImage: true, images: true },
  });

  let updatedCount = 0;

  for (const post of posts) {
    let changed = false;
    let newContent = post.content;
    let newMetaImage = post.metaImage;
    let newImages = post.images;

    // Replace in content (markdown body)
    for (const [oldUrl, newUrl] of urlMap) {
      if (newContent.includes(oldUrl)) {
        newContent = newContent.replaceAll(oldUrl, newUrl);
        changed = true;
      }
    }

    // Replace metaImage
    if (newMetaImage) {
      for (const [oldUrl, newUrl] of urlMap) {
        if (newMetaImage === oldUrl || newMetaImage.includes(oldUrl)) {
          newMetaImage = newMetaImage.replaceAll(oldUrl, newUrl);
          changed = true;
        }
      }
    }

    // Replace in images JSON array
    if (newImages && typeof newImages === 'object') {
      let imagesStr = JSON.stringify(newImages);
      for (const [oldUrl, newUrl] of urlMap) {
        if (imagesStr.includes(oldUrl)) {
          imagesStr = imagesStr.replaceAll(oldUrl, newUrl);
          changed = true;
        }
      }
      if (changed) {
        newImages = JSON.parse(imagesStr);
      }
    }

    if (changed) {
      await prisma.post.update({
        where: { id: post.id },
        data: {
          content: newContent,
          metaImage: newMetaImage,
          images: newImages as any,
        },
      });
      updatedCount++;
      console.log(`  📝 Updated post: ${post.id}`);
    }
  }

  console.log(`\n📝 Updated ${updatedCount}/${posts.length} posts with new R2 URLs`);

  // 4. Summary
  console.log('\n' + '='.repeat(60));
  console.log('✅ Migration complete!');
  console.log(`   Files uploaded to R2: ${urlMap.size}`);
  console.log(`   Posts updated: ${updatedCount}`);
  console.log('\n⚠️  Next steps:');
  console.log('   1. Deploy the updated code (upload service now uses R2)');
  console.log('   2. Verify images load correctly on the site');
  console.log('   3. After confirming, you can optionally clear the Media');
  console.log('      table to reclaim PostgreSQL storage');
  console.log('='.repeat(60));
}

main()
  .catch((error) => {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
