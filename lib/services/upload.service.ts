import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

export interface UploadResult {
  url: string;
  filename: string;
}

export class UploadService {
  private static readonly uploadDir = path.join(process.cwd(), 'public', 'uploads');

  /**
   * Uploads a file to the local storage.
   * @param file The file to upload (Buffer)
   * @param originalName The original name of the file
   * @returns The result of the upload (URL and filename)
   */
  static async uploadFile(file: Buffer, originalName: string): Promise<UploadResult> {
    // Ensure upload directory exists
    await fs.mkdir(this.uploadDir, { recursive: true });

    const ext = path.extname(originalName);
    const filename = `${uuidv4()}${ext}`;
    const filePath = path.join(this.uploadDir, filename);

    await fs.writeFile(filePath, file);

    return {
      url: `/uploads/${filename}`,
      filename: filename,
    };
  }

  /**
   * Deletes a file from the local storage.
   * @param filename The filename to delete
   */
  static async deleteFile(filename: string): Promise<void> {
    const filePath = path.join(this.uploadDir, filename);
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error(`Failed to delete file: ${filename}`, error);
    }
  }
}
