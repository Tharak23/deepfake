import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { downloadFile } from '@/lib/storage';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // No authentication required - allow anyone to download files
    const session = await getServerSession(authOptions);

    const fileId = params.id;
    if (!fileId) {
      return NextResponse.json({ error: 'File ID is required' }, { status: 400 });
    }

    // Get download URL and increment download counter
    const result = await downloadFile(fileId);

    // Return the download URL
    return NextResponse.json({
      url: result.url,
      name: result.name
    });
  } catch (error: any) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Error downloading file', details: error.message },
      { status: 500 }
    );
  }
} 