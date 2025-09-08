import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types based on our schema
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          user_id: string;
          username: string | null;
          wallet_address: string | null;
          farcaster_id: string | null;
          notification_preferences: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          username?: string | null;
          wallet_address?: string | null;
          farcaster_id?: string | null;
          notification_preferences?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          username?: string | null;
          wallet_address?: string | null;
          farcaster_id?: string | null;
          notification_preferences?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      bookmarks: {
        Row: {
          id: string;
          bookmark_id: string;
          user_id: string;
          content_title: string;
          content_body: string;
          source_url: string | null;
          tags: string[];
          ipfs_hash: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          bookmark_id: string;
          user_id: string;
          content_title: string;
          content_body: string;
          source_url?: string | null;
          tags?: string[];
          ipfs_hash?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          bookmark_id?: string;
          user_id?: string;
          content_title?: string;
          content_body?: string;
          source_url?: string | null;
          tags?: string[];
          ipfs_hash?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      reminders: {
        Row: {
          id: string;
          reminder_id: string;
          user_id: string;
          dua_title: string;
          dua_text: string;
          dua_arabic: string | null;
          scheduled_time: string;
          notification_sent: boolean;
          completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          reminder_id: string;
          user_id: string;
          dua_title: string;
          dua_text: string;
          dua_arabic?: string | null;
          scheduled_time: string;
          notification_sent?: boolean;
          completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          reminder_id?: string;
          user_id?: string;
          dua_title?: string;
          dua_text?: string;
          dua_arabic?: string | null;
          scheduled_time?: string;
          notification_sent?: boolean;
          completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

// Helper functions for database operations
export const dbHelpers = {
  // User operations
  async createUser(userData: Database['public']['Tables']['users']['Insert']) {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUser(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async updateUser(userId: string, updates: Database['public']['Tables']['users']['Update']) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Bookmark operations
  async createBookmark(bookmarkData: Database['public']['Tables']['bookmarks']['Insert']) {
    const { data, error } = await supabase
      .from('bookmarks')
      .insert(bookmarkData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserBookmarks(userId: string) {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async deleteBookmark(bookmarkId: string, userId: string) {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('bookmark_id', bookmarkId)
      .eq('user_id', userId);
    
    if (error) throw error;
  },

  // Reminder operations
  async createReminder(reminderData: Database['public']['Tables']['reminders']['Insert']) {
    const { data, error } = await supabase
      .from('reminders')
      .insert(reminderData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserReminders(userId: string) {
    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async updateReminder(reminderId: string, updates: Database['public']['Tables']['reminders']['Update']) {
    const { data, error } = await supabase
      .from('reminders')
      .update(updates)
      .eq('reminder_id', reminderId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getTodaysReminders(userId: string) {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', `${today}T00:00:00.000Z`)
      .lt('created_at', `${today}T23:59:59.999Z`)
      .order('scheduled_time', { ascending: true });
    
    if (error) throw error;
    return data;
  }
};
