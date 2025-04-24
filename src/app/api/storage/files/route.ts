import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongoose';
import File from '@/models/File';

export async function GET(request: Request) {
  try {
    // Connect to the database
    await dbConnect();

    // Check authentication
    const session = await getServerSession(authOptions);
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const query = searchParams.get('query') || '';
    
    // Build query object
    const queryObject: any = {};
    
    // Type filter
    if (type && ['papers', 'datasets', 'experiments', 'images'].includes(type)) {
      queryObject.type = type;
    }
    
    // Category/tag filter
    if (category) {
      queryObject.tags = { $in: [category] };
    }
    
    // Text search
    if (query) {
      queryObject.$text = { $search: query };
    }
    
    // Privacy filtering
    if (session?.user?.id) {
      // If user is authenticated, they can see their own private files and all public files
      queryObject.$or = [
        { isPrivate: false }, // Public files visible to everyone
        { userId: session.user.id } // User's own files (including private)
      ];
    } else {
      // Unauthenticated users can only see public files
      queryObject.isPrivate = false;
    }
    
    // Execute query
    const files = await File.find(queryObject)
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
    
    // Format the response
    const formattedFiles = files.map(file => ({
      id: file._id.toString(),
      title: file.title,
      description: file.description,
      type: file.type,
      originalName: file.originalName,
      url: file.url,
      size: file.size,
      mimeType: file.mimeType,
      tags: file.tags,
      isPrivate: file.isPrivate,
      isOwner: session?.user?.id === file.userId,
      createdAt: file.createdAt,
    }));
    
    return NextResponse.json({
      files: formattedFiles
    });
  } catch (error: any) {
    console.error('Error fetching files:', error);
    return NextResponse.json(
      { error: 'Error fetching files', details: error.message },
      { status: 500 }
    );
  }
} 