import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { UploadService } from '@/lib/services/upload.service';

export async function POST(req: NextRequest) {
  try {
    // Check if user is authenticated and is an ADMIN
    const session = await auth();

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Basic validation
    if (file.size > 2 * 1024 * 1024) { // 2MB
      return NextResponse.json({ error: 'File size too large (max 2MB)' }, { status: 400 });
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await UploadService.uploadFile(buffer, file.name);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('SERVER_UPLOAD_ERROR:', error);
    return NextResponse.json({ 
      error: error?.message || 'Failed to upload file',
      details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
    }, { status: 500 });
  }
}
