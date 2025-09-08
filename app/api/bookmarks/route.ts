import { NextRequest, NextResponse } from 'next/server';
import { dbHelpers } from '@/lib/supabase';
import { ipfsHelpers } from '@/lib/pinata';
import { generateId } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const tags = searchParams.get('tags');
    const search = searchParams.get('search');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    let bookmarks = await dbHelpers.getUserBookmarks(userId);

    // Filter by tags if provided
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim().toLowerCase());
      bookmarks = bookmarks.filter(bookmark =>
        bookmark.tags.some(tag => tagArray.includes(tag.toLowerCase()))
      );
    }

    // Filter by search term if provided
    if (search) {
      const searchTerm = search.toLowerCase();
      bookmarks = bookmarks.filter(bookmark =>
        bookmark.content_title.toLowerCase().includes(searchTerm) ||
        bookmark.content_body.toLowerCase().includes(searchTerm) ||
        bookmark.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    return NextResponse.json({
      success: true,
      bookmarks: bookmarks.map(bookmark => ({
        bookmarkId: bookmark.bookmark_id,
        userId: bookmark.user_id,
        contentTitle: bookmark.content_title,
        contentBody: bookmark.content_body,
        sourceUrl: bookmark.source_url,
        tags: bookmark.tags,
        ipfsHash: bookmark.ipfs_hash,
        createdAt: new Date(bookmark.created_at),
      }))
    });
  } catch (error) {
    console.error('Get bookmarks API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, contentTitle, contentBody, sourceUrl, tags, saveToIPFS } = body;

    if (!userId || !contentTitle || !contentBody) {
      return NextResponse.json(
        { error: 'User ID, content title, and content body are required' },
        { status: 400 }
      );
    }

    const bookmarkId = generateId();
    let ipfsHash = null;

    // Optionally save to IPFS
    if (saveToIPFS) {
      try {
        const ipfsResult = await ipfsHelpers.uploadBookmark({
          title: contentTitle,
          content: contentBody,
          tags: tags || [],
          source: sourceUrl,
          createdAt: new Date(),
        });
        ipfsHash = ipfsResult.hash;
      } catch (ipfsError) {
        console.error('IPFS upload error:', ipfsError);
        // Continue without IPFS if it fails
      }
    }

    const bookmark = await dbHelpers.createBookmark({
      bookmark_id: bookmarkId,
      user_id: userId,
      content_title: contentTitle,
      content_body: contentBody,
      source_url: sourceUrl || null,
      tags: tags || [],
      ipfs_hash: ipfsHash,
    });

    return NextResponse.json({
      success: true,
      bookmark: {
        bookmarkId: bookmark.bookmark_id,
        userId: bookmark.user_id,
        contentTitle: bookmark.content_title,
        contentBody: bookmark.content_body,
        sourceUrl: bookmark.source_url,
        tags: bookmark.tags,
        ipfsHash: bookmark.ipfs_hash,
        createdAt: new Date(bookmark.created_at),
      },
      message: 'Bookmark created successfully'
    });
  } catch (error) {
    console.error('Create bookmark API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookmarkId = searchParams.get('bookmarkId');
    const userId = searchParams.get('userId');

    if (!bookmarkId || !userId) {
      return NextResponse.json(
        { error: 'Bookmark ID and User ID are required' },
        { status: 400 }
      );
    }

    await dbHelpers.deleteBookmark(bookmarkId, userId);

    return NextResponse.json({
      success: true,
      message: 'Bookmark deleted successfully'
    });
  } catch (error) {
    console.error('Delete bookmark API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
