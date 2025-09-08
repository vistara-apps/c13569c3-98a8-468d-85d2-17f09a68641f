import { supabase } from './supabase';
import { User, Bookmark, Reminder } from './types';
import { uploadJSONToIPFS } from './pinata';

/**
 * User Management
 */
export async function createUser(user: Omit<User, 'savedBookmarks'>): Promise<User> {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert({
        user_id: user.userId,
        username: user.username,
        notification_preferences: user.notificationPreferences,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      userId: data.user_id,
      username: data.username,
      notificationPreferences: data.notification_preferences,
      savedBookmarks: [],
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
}

export async function getUser(userId: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // User not found
      throw error;
    }

    // Get user's bookmarks
    const { data: bookmarks } = await supabase
      .from('bookmarks')
      .select('bookmark_id')
      .eq('user_id', userId);

    return {
      userId: data.user_id,
      username: data.username,
      notificationPreferences: data.notification_preferences,
      savedBookmarks: bookmarks?.map(b => b.bookmark_id) || [],
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error('Failed to fetch user');
  }
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<User> {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        username: updates.username,
        notification_preferences: updates.notificationPreferences,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    const user = await getUser(userId);
    if (!user) throw new Error('User not found after update');
    
    return user;
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Failed to update user');
  }
}

/**
 * Bookmark Management
 */
export async function createBookmark(bookmark: Bookmark): Promise<Bookmark> {
  try {
    // Optionally upload to IPFS for decentralized storage
    let ipfsHash: string | undefined;
    if (bookmark.contentBody.length > 500) { // Upload longer content to IPFS
      try {
        const ipfsResult = await uploadJSONToIPFS({
          title: bookmark.contentTitle,
          body: bookmark.contentBody,
          tags: bookmark.tags,
          sourceUrl: bookmark.sourceUrl,
        }, `bookmark-${bookmark.bookmarkId}.json`);
        ipfsHash = ipfsResult.hash;
      } catch (ipfsError) {
        console.warn('Failed to upload to IPFS, storing in database only:', ipfsError);
      }
    }

    const { data, error } = await supabase
      .from('bookmarks')
      .insert({
        bookmark_id: bookmark.bookmarkId,
        user_id: bookmark.userId,
        content_title: bookmark.contentTitle,
        content_body: bookmark.contentBody,
        source_url: bookmark.sourceUrl,
        tags: bookmark.tags,
        ipfs_hash: ipfsHash,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      bookmarkId: data.bookmark_id,
      userId: data.user_id,
      contentTitle: data.content_title,
      contentBody: data.content_body,
      sourceUrl: data.source_url,
      tags: data.tags,
      createdAt: new Date(data.created_at),
      ipfsHash: data.ipfs_hash,
    };
  } catch (error) {
    console.error('Error creating bookmark:', error);
    throw new Error('Failed to create bookmark');
  }
}

export async function getUserBookmarks(userId: string, limit: number = 50): Promise<Bookmark[]> {
  try {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data.map(item => ({
      bookmarkId: item.bookmark_id,
      userId: item.user_id,
      contentTitle: item.content_title,
      contentBody: item.content_body,
      sourceUrl: item.source_url,
      tags: item.tags,
      createdAt: new Date(item.created_at),
      ipfsHash: item.ipfs_hash,
    }));
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    throw new Error('Failed to fetch bookmarks');
  }
}

export async function searchBookmarks(userId: string, query: string, tags?: string[]): Promise<Bookmark[]> {
  try {
    let queryBuilder = supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', userId);

    // Text search
    if (query) {
      queryBuilder = queryBuilder.or(`content_title.ilike.%${query}%,content_body.ilike.%${query}%`);
    }

    // Tag filter
    if (tags && tags.length > 0) {
      queryBuilder = queryBuilder.contains('tags', tags);
    }

    const { data, error } = await queryBuilder
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;

    return data.map(item => ({
      bookmarkId: item.bookmark_id,
      userId: item.user_id,
      contentTitle: item.content_title,
      contentBody: item.content_body,
      sourceUrl: item.source_url,
      tags: item.tags,
      createdAt: new Date(item.created_at),
      ipfsHash: item.ipfs_hash,
    }));
  } catch (error) {
    console.error('Error searching bookmarks:', error);
    throw new Error('Failed to search bookmarks');
  }
}

export async function deleteBookmark(bookmarkId: string, userId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('bookmark_id', bookmarkId)
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    throw new Error('Failed to delete bookmark');
  }
}

/**
 * Reminder Management
 */
export async function createReminder(reminder: Reminder): Promise<Reminder> {
  try {
    const { data, error } = await supabase
      .from('reminders')
      .insert({
        reminder_id: reminder.reminderId,
        user_id: reminder.userId,
        dua_title: reminder.duaTitle,
        dua_text: reminder.duaText,
        dua_arabic: reminder.duaArabic,
        scheduled_time: reminder.scheduledTime,
        notification_sent: reminder.notificationSent,
        completed: reminder.completed || false,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      reminderId: data.reminder_id,
      userId: data.user_id,
      duaTitle: data.dua_title,
      duaText: data.dua_text,
      duaArabic: data.dua_arabic,
      scheduledTime: data.scheduled_time,
      notificationSent: data.notification_sent,
      createdAt: new Date(data.created_at),
      completed: data.completed,
    };
  } catch (error) {
    console.error('Error creating reminder:', error);
    throw new Error('Failed to create reminder');
  }
}

export async function getUserReminders(userId: string, limit: number = 50): Promise<Reminder[]> {
  try {
    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data.map(item => ({
      reminderId: item.reminder_id,
      userId: item.user_id,
      duaTitle: item.dua_title,
      duaText: item.dua_text,
      duaArabic: item.dua_arabic,
      scheduledTime: item.scheduled_time,
      notificationSent: item.notification_sent,
      createdAt: new Date(item.created_at),
      completed: item.completed,
    }));
  } catch (error) {
    console.error('Error fetching reminders:', error);
    throw new Error('Failed to fetch reminders');
  }
}

export async function updateReminder(reminderId: string, updates: Partial<Reminder>): Promise<void> {
  try {
    const { error } = await supabase
      .from('reminders')
      .update({
        notification_sent: updates.notificationSent,
        completed: updates.completed,
        updated_at: new Date().toISOString(),
      })
      .eq('reminder_id', reminderId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating reminder:', error);
    throw new Error('Failed to update reminder');
  }
}

/**
 * Analytics and Stats
 */
export async function getUserStats(userId: string) {
  try {
    const [bookmarksResult, remindersResult, completedResult] = await Promise.all([
      supabase.from('bookmarks').select('id', { count: 'exact' }).eq('user_id', userId),
      supabase.from('reminders').select('id', { count: 'exact' }).eq('user_id', userId),
      supabase.from('reminders').select('id', { count: 'exact' }).eq('user_id', userId).eq('completed', true),
    ]);

    return {
      totalBookmarks: bookmarksResult.count || 0,
      totalReminders: remindersResult.count || 0,
      completedReminders: completedResult.count || 0,
      completionRate: remindersResult.count ? 
        Math.round((completedResult.count || 0) / remindersResult.count * 100) : 0,
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return {
      totalBookmarks: 0,
      totalReminders: 0,
      completedReminders: 0,
      completionRate: 0,
    };
  }
}
