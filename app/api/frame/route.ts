import { NextRequest, NextResponse } from 'next/server';
import { farcasterHelpers, frameHelpers } from '@/lib/farcaster';
import { dbHelpers } from '@/lib/supabase';
import { generateId } from '@/lib/utils';
import { DAILY_DUAS } from '@/lib/constants';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'daily-dua';

    // Generate frame metadata based on action
    let frameConfig;

    switch (action) {
      case 'daily-dua':
        const todayDua = DAILY_DUAS[0]; // Get today's dua
        frameConfig = {
          title: 'DuaFlow - Daily Dua Reminder',
          image: `${process.env.NEXT_PUBLIC_APP_URL}/api/frame/image?type=daily-dua&duaId=${todayDua.id}`,
          buttons: [
            { label: '✅ Mark Complete', action: 'post' },
            { label: '📖 Save to Bookmarks', action: 'post' },
            { label: '🔄 Next Dua', action: 'post' },
            { label: '🏠 Open App', action: 'link', target: process.env.NEXT_PUBLIC_APP_URL }
          ],
          postUrl: `${process.env.NEXT_PUBLIC_FRAME_URL}`,
        };
        break;

      case 'bookmark-saved':
        frameConfig = {
          title: 'DuaFlow - Bookmark Saved',
          image: `${process.env.NEXT_PUBLIC_APP_URL}/api/frame/image?type=success&message=Bookmark saved successfully!`,
          buttons: [
            { label: '📚 View Bookmarks', action: 'link', target: `${process.env.NEXT_PUBLIC_APP_URL}?tab=bookmarks` },
            { label: '🏠 Back to App', action: 'link', target: process.env.NEXT_PUBLIC_APP_URL }
          ],
        };
        break;

      case 'reminder-complete':
        frameConfig = {
          title: 'DuaFlow - Reminder Complete',
          image: `${process.env.NEXT_PUBLIC_APP_URL}/api/frame/image?type=success&message=Great job! Reminder completed.`,
          buttons: [
            { label: '📖 Next Dua', action: 'post' },
            { label: '🏠 Back to App', action: 'link', target: process.env.NEXT_PUBLIC_APP_URL }
          ],
          postUrl: `${process.env.NEXT_PUBLIC_FRAME_URL}?action=next-dua`,
        };
        break;

      default:
        frameConfig = {
          title: 'DuaFlow - Never miss a spiritual practice',
          image: `${process.env.NEXT_PUBLIC_APP_URL}/api/frame/image?type=welcome`,
          buttons: [
            { label: '🕌 Today\'s Dua', action: 'post' },
            { label: '📚 My Bookmarks', action: 'link', target: `${process.env.NEXT_PUBLIC_APP_URL}?tab=bookmarks` },
            { label: '🏠 Open App', action: 'link', target: process.env.NEXT_PUBLIC_APP_URL }
          ],
          postUrl: `${process.env.NEXT_PUBLIC_FRAME_URL}?action=daily-dua`,
        };
    }

    const frameMetadata = frameHelpers.generateFrameMetadata(frameConfig);

    // Return HTML with frame metadata
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${frameConfig.title}</title>
          ${frameMetadata}
          <meta property="og:title" content="${frameConfig.title}" />
          <meta property="og:description" content="Never miss a spiritual practice. Organize your divine connections." />
          <meta property="og:image" content="${frameConfig.image}" />
        </head>
        <body>
          <h1>DuaFlow</h1>
          <p>Never miss a spiritual practice. Organize your divine connections.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}">Open DuaFlow App</a>
        </body>
      </html>
    `;

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Frame GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { untrustedData, trustedData } = body;

    // Validate the frame action
    const frameAction = await farcasterHelpers.validateFrameAction(trustedData.messageBytes);
    
    if (!frameAction) {
      return NextResponse.json(
        { error: 'Invalid frame action' },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'daily-dua';
    const buttonIndex = frameAction.button_index;
    const userFid = frameAction.cast_id.fid;
    const userAddress = frameAction.address;

    let responseConfig;

    switch (action) {
      case 'daily-dua':
        if (buttonIndex === 1) {
          // Mark complete
          try {
            // Create or update user reminder as completed
            const userId = userAddress || userFid.toString();
            const todayDua = DAILY_DUAS[0];
            
            await dbHelpers.createReminder({
              reminder_id: generateId(),
              user_id: userId,
              dua_title: todayDua.title,
              dua_text: todayDua.translation,
              dua_arabic: todayDua.arabic,
              scheduled_time: new Date().toTimeString().slice(0, 5),
              notification_sent: true,
              completed: true,
            });

            responseConfig = {
              title: 'DuaFlow - Reminder Complete',
              image: `${process.env.NEXT_PUBLIC_APP_URL}/api/frame/image?type=success&message=Great job! Dua completed.`,
              buttons: [
                { label: '🔄 Next Dua', action: 'post' },
                { label: '🏠 Open App', action: 'link', target: process.env.NEXT_PUBLIC_APP_URL }
              ],
              postUrl: `${process.env.NEXT_PUBLIC_FRAME_URL}?action=next-dua`,
            };
          } catch (error) {
            console.error('Error marking reminder complete:', error);
            responseConfig = {
              title: 'DuaFlow - Error',
              image: `${process.env.NEXT_PUBLIC_APP_URL}/api/frame/image?type=error&message=Failed to mark complete. Try again.`,
              buttons: [
                { label: '🔄 Try Again', action: 'post' },
                { label: '🏠 Open App', action: 'link', target: process.env.NEXT_PUBLIC_APP_URL }
              ],
              postUrl: `${process.env.NEXT_PUBLIC_FRAME_URL}?action=daily-dua`,
            };
          }
        } else if (buttonIndex === 2) {
          // Save to bookmarks
          try {
            const userId = userAddress || userFid.toString();
            const todayDua = DAILY_DUAS[0];
            
            await dbHelpers.createBookmark({
              bookmark_id: generateId(),
              user_id: userId,
              content_title: todayDua.title,
              content_body: `${todayDua.arabic}\n\n${todayDua.translation}\n\nSource: ${todayDua.source}`,
              tags: ['dua', 'daily', todayDua.category.toLowerCase()],
            });

            responseConfig = {
              title: 'DuaFlow - Bookmark Saved',
              image: `${process.env.NEXT_PUBLIC_APP_URL}/api/frame/image?type=success&message=Dua saved to bookmarks!`,
              buttons: [
                { label: '📚 View Bookmarks', action: 'link', target: `${process.env.NEXT_PUBLIC_APP_URL}?tab=bookmarks` },
                { label: '🔄 Next Dua', action: 'post' },
                { label: '🏠 Open App', action: 'link', target: process.env.NEXT_PUBLIC_APP_URL }
              ],
              postUrl: `${process.env.NEXT_PUBLIC_FRAME_URL}?action=next-dua`,
            };
          } catch (error) {
            console.error('Error saving bookmark:', error);
            responseConfig = {
              title: 'DuaFlow - Error',
              image: `${process.env.NEXT_PUBLIC_APP_URL}/api/frame/image?type=error&message=Failed to save bookmark. Try again.`,
              buttons: [
                { label: '🔄 Try Again', action: 'post' },
                { label: '🏠 Open App', action: 'link', target: process.env.NEXT_PUBLIC_APP_URL }
              ],
              postUrl: `${process.env.NEXT_PUBLIC_FRAME_URL}?action=daily-dua`,
            };
          }
        } else if (buttonIndex === 3) {
          // Next dua
          const nextDuaIndex = Math.floor(Math.random() * DAILY_DUAS.length);
          const nextDua = DAILY_DUAS[nextDuaIndex];
          
          responseConfig = {
            title: 'DuaFlow - Next Dua',
            image: `${process.env.NEXT_PUBLIC_APP_URL}/api/frame/image?type=daily-dua&duaId=${nextDua.id}`,
            buttons: [
              { label: '✅ Mark Complete', action: 'post' },
              { label: '📖 Save to Bookmarks', action: 'post' },
              { label: '🔄 Another Dua', action: 'post' },
              { label: '🏠 Open App', action: 'link', target: process.env.NEXT_PUBLIC_APP_URL }
            ],
            postUrl: `${process.env.NEXT_PUBLIC_FRAME_URL}?action=daily-dua`,
          };
        }
        break;

      case 'next-dua':
        const randomDuaIndex = Math.floor(Math.random() * DAILY_DUAS.length);
        const randomDua = DAILY_DUAS[randomDuaIndex];
        
        responseConfig = {
          title: 'DuaFlow - Daily Dua',
          image: `${process.env.NEXT_PUBLIC_APP_URL}/api/frame/image?type=daily-dua&duaId=${randomDua.id}`,
          buttons: [
            { label: '✅ Mark Complete', action: 'post' },
            { label: '📖 Save to Bookmarks', action: 'post' },
            { label: '🔄 Next Dua', action: 'post' },
            { label: '🏠 Open App', action: 'link', target: process.env.NEXT_PUBLIC_APP_URL }
          ],
          postUrl: `${process.env.NEXT_PUBLIC_FRAME_URL}?action=daily-dua`,
        };
        break;

      default:
        responseConfig = {
          title: 'DuaFlow - Welcome',
          image: `${process.env.NEXT_PUBLIC_APP_URL}/api/frame/image?type=welcome`,
          buttons: [
            { label: '🕌 Today\'s Dua', action: 'post' },
            { label: '🏠 Open App', action: 'link', target: process.env.NEXT_PUBLIC_APP_URL }
          ],
          postUrl: `${process.env.NEXT_PUBLIC_FRAME_URL}?action=daily-dua`,
        };
    }

    return NextResponse.json(frameHelpers.createFrameResponse(responseConfig));
  } catch (error) {
    console.error('Frame POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
