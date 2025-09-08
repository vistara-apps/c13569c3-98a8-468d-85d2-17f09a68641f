import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          user_id: string;
          username: string;
          notification_preferences: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          username: string;
          notification_preferences?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          username?: string;
          notification_preferences?: any;
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
          updated_at?: string;
        };
      };
    };
  };
}
