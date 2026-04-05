import prisma from '@/lib/prisma';
import sharp from 'sharp';

export interface UploadResult {
  url: string;
  filename: string;
}

export class UploadService {
  /**
   * Uploads a file to the database.
   * Optimizes the image using Sharp before saving.
   * @param file The file to upload (Buffer)
   * @param originalName The original name of the file
   * @returns The result of the upload (URL and ID)
   */
  static async uploadFile(file: Buffer, originalName: string, mimeType: string = 'image/webp'): Promise<UploadResult> {
    try {
      // Diagnostic log
      console.log('Available Prisma Models:', Object.keys(prisma).filter(k => !k.startsWith('$') && !k.startsWith('_')));

      // 1. Optimize image with Sharp (convert to WebP for better compression)
      // This reduces database storage size significantly
      const optimizedBuffer = await sharp(file)
        .webp({ quality: 80 })
        .toBuffer();

      // 2. Save to Database
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
      console.error('Error uploading file to DB:', error);
      throw new Error(`DB_UPLOAD_ERROR: ${error.message || 'Unknown error'}`);
    }
  }

  /**
   * Deletes a file from the database.
   * @param id The record ID to delete
   */
  static async deleteFile(id: string): Promise<void> {
    try {
      await (prisma as any).media.delete({
        where: { id },
      });
    } catch (error) {
      console.error(`Failed to delete media from DB: ${id}`, error);
    }
  }
}
