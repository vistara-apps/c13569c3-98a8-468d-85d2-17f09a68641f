// User entity
export interface User {
  userId: string; // Farcaster ID or Wallet Address
  username: string;
  notificationPreferences: NotificationPreferences;
  savedBookmarks: string[]; // array of Bookmark IDs
}

export interface NotificationPreferences {
  enabled: boolean;
  morningReminder: boolean;
  eveningReminder: boolean;
  customTimes: string[];
  duaTypes: string[];
}

// Bookmark entity
export interface Bookmark {
  bookmarkId: string;
  userId: string;
  contentTitle: string;
  contentBody: string;
  sourceUrl?: string;
  tags: string[];
  createdAt: Date;
  ipfsHash?: string;
}

// Reminder entity
export interface Reminder {
  reminderId: string;
  userId: string;
  duaTitle: string;
  duaText: string;
  duaArabic?: string;
  scheduledTime: string;
  notificationSent: boolean;
  createdAt: Date;
  completed?: boolean;
}

// Dua content
export interface DuaContent {
  id: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  category: string;
  source?: string;
  benefits?: string;
}

// Component props
export interface NotificationCardProps {
  reminder: Reminder;
  variant?: 'withAction' | 'simple';
  onComplete?: (reminderId: string) => void;
  onBookmark?: (reminder: Reminder) => void;
}

export interface BookmarkItemProps {
  bookmark: Bookmark;
  variant?: 'editable' | 'viewOnly';
  onEdit?: (bookmark: Bookmark) => void;
  onDelete?: (bookmarkId: string) => void;
}

export interface TagPillProps {
  tag: string;
  active?: boolean;
  onClick?: (tag: string) => void;
}
