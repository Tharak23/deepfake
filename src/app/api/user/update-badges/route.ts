import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be signed in to update badges' },
        { status: 401 }
      );
    }

    // Get user email from session
    const userEmail = session.user.email;
    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email not found in session' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Find user by email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Parse request body
    const requestData = await req.json();
    const { badgeName } = requestData;

    if (!badgeName) {
      return NextResponse.json(
        { error: 'Badge name is required' },
        { status: 400 }
      );
    }

    // Check if user already has this badge
    if (user.badges?.includes(badgeName)) {
      return NextResponse.json(
        { message: 'User already has this badge', badgesCount: user.badgesCount },
        { status: 200 }
      );
    }

    // Add the badge and update badges count
    user.badges = [...(user.badges || []), badgeName];
    user.badgesCount = user.badges.length;

    // If user has 5 or more badges, automatically verify them as a researcher
    if (user.badgesCount >= 5 && user.role !== 'verified_researcher') {
      user.role = 'verified_researcher';
      user.isVerified = true;
      user.verificationDate = new Date();
    }

    // Save changes
    await user.save();

    return NextResponse.json({
      message: 'Badge added successfully',
      badgesCount: user.badgesCount,
      badges: user.badges,
      isVerifiedResearcher: user.role === 'verified_researcher'
    });
  } catch (error) {
    console.error('Error updating badges:', error);
    return NextResponse.json(
      { error: 'Failed to update badges' },
      { status: 500 }
    );
  }
}

// Get user's badges
export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be signed in to view badges' },
        { status: 401 }
      );
    }

    // Get user email from session
    const userEmail = session.user.email;
    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email not found in session' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Find user by email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      badgesCount: user.badgesCount,
      badges: user.badges,
      isVerifiedResearcher: user.role === 'verified_researcher'
    });
  } catch (error) {
    console.error('Error fetching badges:', error);
    return NextResponse.json(
      { error: 'Failed to fetch badges' },
      { status: 500 }
    );
  }
} 