// credits : kasan
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import FileModel from '@/models/File';

function generateCode(length = 6) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export async function POST(req) {
  try {
    await connectDB();
    
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

    const idnetData = new FormData();
    idnetData.append('file', file);

    const uploadRes = await fetch('https://file.idnet.my.id/api/upload.php', {
      method: 'POST',
      body: idnetData,
    });

    const data = await uploadRes.json();
    if (!data.file || !data.file.url) throw new Error('Gagal upload ke storage');

    let uniqueCode = generateCode();
    let isUnique = false;
    
    while (!isUnique) {
        const existing = await FileModel.findOne({ code: uniqueCode });
        if (!existing) isUnique = true;
        else uniqueCode = generateCode();
    }
    
    await FileModel.create({
        code: uniqueCode,
        originalUrl: data.file.url
    });
    
    const host = req.headers.get('host');
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    
    return NextResponse.json({ url: `${protocol}://${host}/view/${uniqueCode}` });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
                              }
