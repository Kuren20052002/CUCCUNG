import prisma from '@/lib/prisma';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { uploadToR2, deleteFromR2, extractR2Key, isR2Configured } from '@/lib/r2';

export interface UploadResult {
  url: string;
  filename: string;
}

export class UploadService {
  /**
   * Uploads a file — to R2 (CDN) if configured, otherwise falls back to DB.
   * Images are optimized with Sharp before saving.
   * 
   * @param file The file buffer to upload
   * @param originalName The original filename
   * @param mimeType The original MIME type
   * @returns The result with public URL and filename
   */
  static async uploadFile(file: Buffer, originalName: string, mimeType: string = 'image/webp'): Promise<UploadResult> {
    try {
      // 1. Optimize image with Sharp (convert to WebP for compression)
      const optimizedBuffer = await sharp(file)
        .webp({ quality: 80 })
        .toBuffer();

      // 2. Try R2 first (CDN — fast, global edge delivery)
      if (isR2Configured()) {
        const id = uuidv4();
        const key = `media/${id}.webp`;
        const url = await uploadToR2(key, optimizedBuffer, 'image/webp');

        console.log(`[Upload] R2: ${originalName} → ${url} (${(optimizedBuffer.length / 1024).toFixed(1)}KB)`);

        return { url, filename: originalName };
      }

      // 3. Fallback: save to PostgreSQL (legacy)
      console.log('[Upload] R2 not configured, falling back to DB storage');

      if (!(prisma as any).media) {
        throw new Error("Model 'media' not found in Prisma client! Try restarting the server.");
      }

      const media = await (prisma as any).media.create({
        data: {
          filename: originalName,
          type: 'image/webp',
          data: optimizedBuffer,
        },
      });

      return {
        url: `/api/media/${media.id}`,
        filename: originalName,
      };
    } catch (error: any) {
      console.error('Error uploading file:', error);
      throw new Error(`UPLOAD_ERROR: ${error.message || 'Unknown error'}`);
    }
  }

  /**
   * Deletes a file — from R2 if it's an R2 URL, otherwise from DB.
   * @param urlOrId The R2 URL or DB record ID to delete
   */
  static async deleteFile(urlOrId: string): Promise<void> {
    try {
      // Check if it's an R2 URL
      const r2Key = extractR2Key(urlOrId);
      if (r2Key) {
        await deleteFromR2(r2Key);
        console.log(`[Delete] R2: ${r2Key}`);
        return;
      }

      // Legacy: delete from DB
      // Extract ID from "/api/media/{id}" format
      const id = urlOrId.replace('/api/media/', '');
      await (prisma as any).media.delete({
        where: { id },
      });
      console.log(`[Delete] DB: ${id}`);
    } catch (error) {
      console.error(`Failed to delete media: ${urlOrId}`, error);
    }
  }
}
