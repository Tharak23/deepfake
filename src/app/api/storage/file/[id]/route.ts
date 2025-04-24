import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getFileById } from '@/lib/storage';
import dbConnect from '@/lib/mongoose';
import File from '@/models/File';
import { deleteFile } from '@/lib/storage';

// GET endpoint to retrieve a single file
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to database
    await dbConnect();
    
    // Check authentication
    const session = await getServerSession(authOptions);
    
    // Get the file
    const file = await File.findById(params.id).lean();
    
    // File not found
    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
    
    // Check privacy - private files can only be accessed by the owner
    if (file.isPrivate && (!session || session.user.id !== file.userId)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }
    
    // Update view count
    await File.findByIdAndUpdate(params.id, { $inc: { views: 1 } });
    
    // Return the file details
    return NextResponse.json({
      file: {
        id: file._id.toString(),
        title: file.title,
        description: file.description,
        type: file.type,
        originalName: file.originalName,
        url: file.url,
        size: file.size,
        mimeType: file.mimeType,
        tags: file.tags,
        downloads: file.downloads,
        views: file.views + 1, // Increment locally for immediate feedback
        isPrivate: file.isPrivate,
        isOwner: session?.user?.id === file.userId,
        createdAt: file.createdAt,
        updatedAt: file.updatedAt,
      }
    });
  } catch (error: any) {
    console.error('Error getting file:', error);
    return NextResponse.json(
      { error: 'Error getting file', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE endpoint to remove a file
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to database
    await dbConnect();
    
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the file
    const file = await File.findById(params.id);
    
    // File not found
    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
    
    // Check ownership - only file owner can delete
    if (file.userId !== session.user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }
    
    // Delete from storage
    await deleteFile(file.path);
    
    // Delete from database
    await File.findByIdAndDelete(params.id);
    
    return NextResponse.json({ message: 'File deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { error: 'Error deleting file', details: error.message },
      { status: 500 }
    );
  }
} 