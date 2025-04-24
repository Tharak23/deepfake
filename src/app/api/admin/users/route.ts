import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

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

// Get all users with pagination
export async function GET(req: NextRequest) {
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

    // Connect to database
    await connectToDatabase();

    // Parse query parameters
    const url = new URL(req.url);
    const searchTerm = url.searchParams.get('search');
    const role = url.searchParams.get('role');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const page = parseInt(url.searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};
    
    // Add search filter if provided
    if (searchTerm) {
      query.$or = [
        { name: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } }
      ];
    }
    
    // Add role filter if provided
    if (role && role !== 'all') {
      query.role = role;
    }

    // Get total count
    const totalCount = await User.countDocuments(query);

    // Get users
    const users = await User.find(query)
      .select('-password -verificationToken -resetPasswordToken')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    console.log(`Returning ${users.length} users to admin dashboard`);

    return NextResponse.json({
      users,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit)
      }
    });
    
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 