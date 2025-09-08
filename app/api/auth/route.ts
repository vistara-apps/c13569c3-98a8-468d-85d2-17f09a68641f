import { NextRequest, NextResponse } from 'next/server';
import { dbHelpers } from '@/lib/supabase';
import { generateId } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, username, walletAddress, farcasterData } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await dbHelpers.getUser(userId);
    
    if (existingUser) {
      // Update existing user
      const updatedUser = await dbHelpers.updateUser(userId, {
        username: username || existingUser.username,
        wallet_address: walletAddress || existingUser.wallet_address,
        farcaster_id: farcasterData?.fid?.toString() || existingUser.farcaster_id,
        updated_at: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        user: updatedUser,
        message: 'User updated successfully'
      });
    } else {
      // Create new user
      const newUser = await dbHelpers.createUser({
        user_id: userId,
        username: username || null,
        wallet_address: walletAddress || null,
        farcaster_id: farcasterData?.fid?.toString() || null,
        notification_preferences: {
          enabled: true,
          morningReminder: true,
          eveningReminder: true,
          customTimes: ['06:00', '18:00'],
          duaTypes: ['Morning', 'Evening']
        },
      });

      return NextResponse.json({
        success: true,
        user: newUser,
        message: 'User created successfully'
      });
    }
  } catch (error) {
    console.error('Auth API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const user = await dbHelpers.getUser(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get user API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, updates } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const updatedUser = await dbHelpers.updateUser(userId, {
      ...updates,
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Update user API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
