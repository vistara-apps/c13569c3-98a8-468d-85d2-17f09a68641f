import { NextRequest, NextResponse } from 'next/server';
import { validateFrameSignature } from '@/lib/farcaster';
import { updateReminder, createBookmark } from '@/lib/database';
import { generateId } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the frame signature
    const isValid = await validateFrameSignature(body);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const { untrustedData } = body;
    const { buttonIndex, fid, inputText } = untrustedData;
    const reminderId = request.nextUrl.searchParams.get('reminderId');

    if (!reminderId) {
      return NextResponse.json({ error: 'Missing reminder ID' }, { status: 400 });
    }

    switch (buttonIndex) {
      case 1: // Mark Complete
        await updateReminder(reminderId, { completed: true });
        
        return NextResponse.json({
          type: 'frame',
          frameUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/frame/completed/${reminderId}`,
        });

      case 2: // Save to Bookmarks
        // Create a bookmark from the reminder
        const bookmark = {
          bookmarkId: generateId(),
          userId: fid.toString(),
          contentTitle: 'Daily Dua Reminder',
          contentBody: inputText || 'Saved from Farcaster frame',
          tags: ['dua', 'farcaster', 'saved'],
          createdAt: new Date(),
        };
        
        await createBookmark(bookmark);
        
        return NextResponse.json({
          type: 'frame',
          frameUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/frame/bookmarked/${reminderId}`,
        });

      case 3: // Share
        const shareText = `🤲 Just completed my daily Dua reminder on DuaFlow! Never miss a spiritual practice. 

Built on @base with ❤️ for the Muslim community.

Try it: ${process.env.NEXT_PUBLIC_BASE_URL}`;

        return NextResponse.json({
          type: 'frame',
          frameUrl: `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}`,
        });

      default:
        return NextResponse.json({ error: 'Invalid button' }, { status: 400 });
    }
  } catch (error) {
    console.error('Frame action error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
