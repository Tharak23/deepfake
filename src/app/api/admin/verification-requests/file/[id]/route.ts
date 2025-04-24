import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import VerificationRequest from '@/models/VerificationRequest';
import mongoose from 'mongoose';

// Helper function to check if user is admin
async function isAdmin(email: string) {
  const adminEmails = [
    'tharak.nagaveti@gmail.com',
    'adityasonetna@gmail.com',
    'dhanushyangal@gmail.com',
    'tejeshvarma07@gmail.com'
  ];
  
  if (adminEmails.includes(email.toLowerCase())) {
    return true;
  }
  
  // Also check database for admin role
  const user = await User.findOne({ email: email });
  return user?.role === 'admin';
}

// GET request handler for fetching project files
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const userIsAdmin = await isAdmin(session.user.email);
    if (!userIsAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    // Get verification request ID from params
    const { id } = params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid verification request ID' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Find the verification request
    const verificationRequest = await VerificationRequest.findById(id);
    if (!verificationRequest) {
      return NextResponse.json(
        { error: 'Verification request not found' },
        { status: 404 }
      );
    }

    // Check if the request has a project file
    if (!verificationRequest.projectFile || !verificationRequest.projectFile.fileData) {
      return NextResponse.json(
        { error: 'No file found for this verification request' },
        { status: 404 }
      );
    }

    // Get file details
    const { fileName, fileType, fileData } = verificationRequest.projectFile;

    // Log the download request
    console.log(`Admin ${session.user.email} is downloading file: ${fileName}`);

    // Create response with file data and appropriate headers
    const response = new NextResponse(fileData);
    
    // Set content type and disposition headers
    response.headers.set('Content-Type', fileType);
    response.headers.set('Content-Disposition', `attachment; filename="${fileName}"`);
    
    return response;
  } catch (error) {
    console.error('Error fetching project file:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project file', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 