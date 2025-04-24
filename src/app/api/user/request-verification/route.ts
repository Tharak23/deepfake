import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import VerificationRequest from '@/models/VerificationRequest';
import mongoose from 'mongoose';

// Accepted file types
const ACCEPTED_FILE_TYPES = [
  'application/pdf', 
  'application/zip', 
  'application/x-zip-compressed', 
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

// Maximum file size (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    // Get user email from session
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userEmail = session.user.email;
    console.log(`Processing verification request for user: ${userEmail}`);

    // Connect to database
    try {
      await connectToDatabase();
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { error: 'Failed to connect to database' },
        { status: 500 }
      );
    }

    // Find or create user
    let user;
    try {
      user = await User.findOne({ email: userEmail });
      
      if (!user) {
        console.log(`User not found with email ${userEmail}, creating new user record`);
        user = new User({
          email: userEmail,
          name: session.user.name || 'Anonymous User',
          image: session.user.image || '',
          role: 'user',
          isVerified: false,
          roadmapProgress: [],
          roadmapLevel: 'beginner',
          blogEnabled: false,
          badges: [],
          badgesCount: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        await user.save();
        console.log(`Created new user with ID: ${user._id}`);
      }
    } catch (userError) {
      console.error('Error finding/creating user:', userError);
      return NextResponse.json(
        { error: 'Failed to process user data', details: (userError as Error).message },
        { status: 500 }
      );
    }

    // Process the verification request
    const formData = await req.formData();
    return await processVerificationRequest(user, formData);
    
  } catch (error) {
    console.error('Unhandled error in verification request:', error);
    return NextResponse.json(
      { 
        error: 'An unexpected error occurred while processing your verification request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper function to process the verification request
async function processVerificationRequest(user: any, formData: FormData) {
  try {
    // Check if user already has a pending or approved verification request
    const existingRequest = await VerificationRequest.findOne({
      userEmail: user.email,
      status: 'pending'
    });

    // Only block if there's a pending request, allow if previous requests were rejected
    if (existingRequest && existingRequest.status === 'pending') {
      return NextResponse.json(
        { 
          error: 'You already have a pending verification request',
          status: existingRequest.status
        },
        { status: 400 }
      );
    }
    
    // Extract data from formData
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const fileLink = formData.get('fileLink') as string;
    const projectFile = formData.get('projectFile') as File;
    
    // Get other fields if they exist
    const researchField = formData.get('researchField') as string || user.field || 'Deep Learning Research';
    const institution = formData.get('institution') as string || user.institution || 'Independent Researcher';
    const position = formData.get('position') as string || user.position || 'Researcher';
    const publicationsCount = Number(formData.get('publicationsCount')) || 0;
    const motivation = formData.get('motivation') as string || 'Project submission for researcher verification';
    const publicationLinks = formData.get('publicationLinks') 
      ? JSON.parse(formData.get('publicationLinks') as string) 
      : [];
    const roadmapCompleted = formData.get('roadmapCompleted') === 'true' || false;
    
    console.log('Processing project submission with title:', title);
    
    // Validate required fields
    if (!title || !description) {
      return NextResponse.json(
        { error: 'Project title and description are required' },
        { status: 400 }
      );
    }
    
    if (!projectFile && !fileLink) {
      return NextResponse.json(
        { error: 'Either a project file or file link is required' },
        { status: 400 }
      );
    }

    // Check for automatic verification based on badges
    if (user.badgesCount >= 5 && !user.isVerified) {
      // Automatically set user as verified researcher
      user.role = 'verified_researcher';
      user.isVerified = true;
      user.verificationDate = new Date();
      await user.save();
      
      return NextResponse.json(
        { 
          message: 'You have been automatically verified as a researcher because you have completed all 5 badges by finishing the required learning content (2 videos and 1 article for each phase).',
          verified: true
        },
        { status: 200 }
      );
    }

    try {
      // Create verification request with basic details
      const verificationRequest: any = {
        userId: user._id,
        userName: user.name,
        userEmail: user.email,
        dateSubmitted: new Date(),
        researchField,
        institution,
        position,
        publicationsCount,
        motivation,
        publicationLinks,
        status: 'pending',
        roadmapCompleted,
        project: {
          title,
          description,
          fileLink: fileLink || ''
        }
      };
      
      // Process file if provided
      if (projectFile) {
        // Validate file type
        if (!ACCEPTED_FILE_TYPES.includes(projectFile.type)) {
          return NextResponse.json(
            { error: 'Invalid file type. Accepted types are PDF, ZIP, and document files.' },
            { status: 400 }
          );
        }
        
        // Validate file size
        if (projectFile.size > MAX_FILE_SIZE) {
          return NextResponse.json(
            { error: 'File is too large. Maximum size is 10MB.' },
            { status: 400 }
          );
        }
        
        // Read file as array buffer and convert to buffer
        const fileArrayBuffer = await projectFile.arrayBuffer();
        const fileBuffer = Buffer.from(fileArrayBuffer);
        
        // Add file data to the verification request
        verificationRequest.projectFile = {
          fileName: projectFile.name,
          fileType: projectFile.type,
          fileSize: projectFile.size,
          fileData: fileBuffer
        };
        
        console.log(`File processed: ${projectFile.name} (${(projectFile.size / 1024 / 1024).toFixed(2)} MB)`);
      }
      
      // Save verification request to database
      const savedRequest = await VerificationRequest.create(verificationRequest);
      console.log('Saved verification request:', savedRequest._id);
      
      return NextResponse.json(
        { 
          message: 'Project submitted successfully for researcher verification',
          requestId: savedRequest._id
        },
        { status: 201 }
      );
    } catch (saveError) {
      console.error('Error saving verification request:', saveError);
      return NextResponse.json(
        { error: 'Failed to save verification request', details: (saveError as Error).message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing verification request:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process verification request', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Get verification request status for the current user
export async function GET(req: NextRequest) {
  try {
    // Get user email from session
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userEmail = session.user.email;
    console.log(`Getting verification status for user: ${userEmail}`);

    // Connect to database
    try {
      await connectToDatabase();
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { error: 'Failed to connect to database' },
        { status: 500 }
      );
    }

    // Find or create user
    let user;
    try {
      user = await User.findOne({ email: userEmail });
      
      if (!user) {
        console.log(`User not found with email ${userEmail}, creating new user record`);
        user = new User({
          email: userEmail,
          name: session.user.name || 'Anonymous User',
          image: session.user.image || '',
          role: 'user',
          isVerified: false,
          roadmapProgress: [],
          roadmapLevel: 'beginner',
          blogEnabled: false,
          badges: [],
          badgesCount: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        await user.save();
        console.log(`Created new user with ID: ${user._id}`);
      }
    } catch (userError) {
      console.error('Error finding/creating user:', userError);
      return NextResponse.json(
        { error: 'Failed to process user data', details: (userError as Error).message },
        { status: 500 }
      );
    }

    // Check if user is already verified
    if (user.isVerified) {
      return NextResponse.json(
        {
          verified: true,
          message: 'User is already verified',
          role: user.role
        },
        { status: 200 }
      );
    }

    // Check for automatic verification based on badges
    if (user.badgesCount >= 5 && !user.isVerified) {
      try {
        // Automatically set user as verified researcher
        user.role = 'verified_researcher';
        user.isVerified = true;
        user.verificationDate = new Date();
        await user.save();
        
        return NextResponse.json(
          { 
            message: 'You have been automatically verified as a researcher because you have completed all 5 badges by finishing the required learning content (2 videos and 1 article for each phase).',
            verified: true
          },
          { status: 200 }
        );
      } catch (saveError) {
        console.error('Error updating user verification status:', saveError);
        return NextResponse.json(
          { error: 'Failed to update verification status', details: (saveError as Error).message },
          { status: 500 }
        );
      }
    }

    // Check if user has any pending verification requests
    try {
      const pendingRequest = await VerificationRequest.findOne({
        userEmail: user.email,
        status: 'pending'
      });

      if (pendingRequest) {
        return NextResponse.json(
          {
            verified: false,
            pending: true,
            message: 'Verification request is pending review',
            dateSubmitted: pendingRequest.dateSubmitted
          },
          { status: 200 }
        );
      }

      // If no pending request, check if there are any rejected requests
      const rejectedRequest = await VerificationRequest.findOne({
        userEmail: user.email,
        status: 'rejected'
      });

      if (rejectedRequest) {
        return NextResponse.json(
          {
            verified: false,
            pending: false,
            rejected: true,
            message: 'Previous verification request was rejected',
            feedbackMessage: rejectedRequest.reviewNotes || 'No feedback provided'
          },
          { status: 200 }
        );
      }

      // No verification requests found
      return NextResponse.json(
        {
          verified: false,
          pending: false,
          message: 'No verification request found',
          badgesCount: user.badgesCount || 0
        },
        { status: 200 }
      );
    } catch (findError) {
      console.error('Error finding verification requests:', findError);
      return NextResponse.json(
        { error: 'Failed to retrieve verification status', details: (findError as Error).message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Unhandled error in verification status check:', error);
    return NextResponse.json(
      { 
        error: 'An unexpected error occurred while checking verification status', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 