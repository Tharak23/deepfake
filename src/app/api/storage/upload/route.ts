import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongoose';
import { uploadFile } from '@/lib/storage';
import User from '@/models/User';

// Import the correct File model
import File from '@/models/File';

export async function POST(request: Request) {
  try {
    console.log('File upload request received');
    
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      console.error('Authentication error: No valid session');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.log('User authenticated:', session.user.id);

    // Parse the request
    let formData;
    try {
      formData = await request.formData();
      console.log('FormData parsed successfully');
    } catch (error) {
      console.error('Error parsing form data:', error);
      return NextResponse.json({ 
        error: 'Invalid form data',
        details: error instanceof Error ? error.message : String(error)
      }, { status: 400 });
    }
    
    const file = formData.get('file');
    if (!file || !(file instanceof File || file instanceof Blob)) {
      console.error('Invalid file object:', file);
      return NextResponse.json({ 
        error: 'File is required and must be a valid File or Blob object',
        received: file ? typeof file : 'null'
      }, { status: 400 });
    }
    
    const type = formData.get('type') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const tagsRaw = formData.get('tags');
    let tags = [];
    
    try {
      if (tagsRaw) {
        tags = JSON.parse(tagsRaw as string);
      }
    } catch (error) {
      console.error('Error parsing tags:', error);
      // Continue with empty tags rather than failing
    }
    
    const isPrivate = formData.get('isPrivate') === 'true';

    if (!type) {
      return NextResponse.json({ error: 'File type is required' }, { status: 400 });
    }

    console.log('File details:', {
      name: file.name,
      type: file.type,
      size: file.size,
      contentType: type,
      title: title || file.name
    });

    // Validate file type
    const validTypes = ['papers', 'datasets', 'experiments', 'images'];
    if (!validTypes.includes(type)) {
      console.error('Invalid file type:', type);
      return NextResponse.json({ 
        error: 'Invalid file type', 
        validTypes,
        received: type
      }, { status: 400 });
    }

    // Upload file using our storage utility
    const metadata = {
      title: title || file.name,
      description: description || '',
      originalName: file.name,
      tags: tags || [],
      isPrivate: isPrivate,
    };
    
    console.log('Connecting to database...');
    // Connect to database
    try {
      await dbConnect();
      console.log('Database connected successfully');
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json({
        error: 'Database connection failed',
        details: dbError instanceof Error ? dbError.message : String(dbError)
      }, { status: 500 });
    }

    console.log('Uploading file...');
    // Upload file and store in MongoDB
    let result;
    try {
      result = await uploadFile(file, type, session.user.id, metadata);
      console.log('File uploaded successfully:', result.id);
    } catch (uploadError) {
      console.error('Error in uploadFile function:', uploadError);
      return NextResponse.json({
        error: 'Error uploading file',
        details: uploadError instanceof Error ? uploadError.message : String(uploadError)
      }, { status: 500 });
    }

    console.log('Updating user contributions...');
    // Update user's contributions
    if (type === 'papers' || type === 'datasets' || type === 'experiments') {
      try {
        await User.findByIdAndUpdate(
          session.user.id,
          { $push: { [`contributions.${type}`]: result.id } },
          { new: true }
        );
        console.log('User contributions updated');
      } catch (userError) {
        console.error('Error updating user contributions:', userError);
        // Don't fail the whole request if this update fails
      }
    }

    // Return success response with file details
    return NextResponse.json({
      message: 'File uploaded successfully',
      file: {
        id: result.id,
        title: result.title,
        description: result.description,
        url: result.url,
        type: type,
        size: result.size,
        isPrivate: result.isPrivate,
        createdAt: result.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { 
        error: 'Error uploading file', 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 