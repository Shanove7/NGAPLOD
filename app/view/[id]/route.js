// credits : kasan
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import FileModel from '@/models/File';

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const fileRecord = await FileModel.findOne({ code: params.id });

    if (!fileRecord) {
        return new NextResponse('File Not Found', { status: 404 });
    }

    const response = await fetch(fileRecord.originalUrl);

    if (!response.ok) return new NextResponse('Storage Error', { status: 404 });

    const contentType = response.headers.get('content-type');
    const arrayBuffer = await response.arrayBuffer();

    return new NextResponse(Buffer.from(arrayBuffer), {
      headers: {
        'Content-Type': contentType || 'application/octet-stream',
        'Cache-Control': 'public, max-age=86400'
      },
    });

  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 });
  }
}
