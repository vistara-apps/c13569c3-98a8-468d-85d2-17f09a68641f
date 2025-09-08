'use client';

import { useEffect, useState } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { DashboardStats } from '@/components/DashboardStats';
import { QuickActions } from '@/components/QuickActions';
import { NotificationCard } from '@/components/NotificationCard';
import { BookmarkItem } from '@/components/BookmarkItem';
import { SearchBar } from '@/components/SearchBar';
import { DAILY_DUAS } from '@/lib/constants';
import { Reminder, Bookmark } from '@/lib/types';
import { generateId } from '@/lib/utils';
import { 
  getUser, 
  createUser, 
  getUserBookmarks, 
  createBookmark, 
  deleteBookmark,
  searchBookmarks,
  getUserStats 
} from '@/lib/database';

export default function HomePage() {
  const { setFrameReady } = useMiniKit();
  const { user, authenticated, login } = usePrivy();
  const router = useRouter();
  const [currentReminder, setCurrentReminder] = useState<Reminder | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState<Bookmark[]>([]);
  const [activeTab, setActiveTab] = useState<'today' | 'bookmarks'>('today');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookmarks: 0,
    totalReminders: 0,
    completedReminders: 0,
    completionRate: 0,
  });

  useEffect(() => {
    setFrameReady();
    initializeApp();
  }, [setFrameReady, authenticated, user]);

  const initializeApp = async () => {
    if (!authenticated) {
      // Show demo content for unauthenticated users
      const todayDua = DAILY_DUAS[0];
      setCurrentReminder({
        reminderId: generateId(),
        userId: 'demo-user',
        duaTitle: todayDua.title,
        duaText: todayDua.translation,
        duaArabic: todayDua.arabic,
        scheduledTime: '06:00',
        notificationSent: false,
        createdAt: new Date(),
      });

      setBookmarks([
        {
          bookmarkId: generateId(),
          userId: 'demo-user',
          contentTitle: 'Morning Dhikr Benefits',
          contentBody: 'Reciting morning dhikr provides spiritual protection and brings barakah to your day. It connects you with Allah and sets a positive tone for all activities.',
          tags: ['morning', 'dhikr', 'benefits'],
          createdAt: new Date(Date.now() - 86400000),
        },
        {
          bookmarkId: generateId(),
          userId: 'demo-user',
          contentTitle: 'Importance of Consistency',
          contentBody: 'Consistency in spiritual practices, even if small, is more beloved to Allah than sporadic large efforts. The Prophet (PBUH) emphasized regular worship.',
          tags: ['consistency', 'sunnah', 'worship'],
          createdAt: new Date(Date.now() - 172800000),
        },
      ]);
      setFilteredBookmarks(bookmarks);
      setLoading(false);
      return;
    }

    if (!user?.id) return;

    try {
      // Check if user exists, create if not
      let userData = await getUser(user.id);
      if (!userData) {
        userData = await createUser({
          userId: user.id,
          username: user.email?.address || user.wallet?.address || 'Anonymous',
          notificationPreferences: {
            enabled: true,
            morningReminder: true,
            eveningReminder: true,
            customTimes: ['06:00', '18:00'],
            duaTypes: ['daily', 'morning', 'evening'],
          },
        });
      }

      // Load user data
      const [userBookmarks, userStats] = await Promise.all([
        getUserBookmarks(user.id),
        getUserStats(user.id),
      ]);

      setBookmarks(userBookmarks);
      setFilteredBookmarks(userBookmarks);
      setStats(userStats);

      // Set today's reminder
      const todayDua = DAILY_DUAS[0];
      setCurrentReminder({
        reminderId: generateId(),
        userId: user.id,
        duaTitle: todayDua.title,
        duaText: todayDua.translation,
        duaArabic: todayDua.arabic,
        scheduledTime: '06:00',
        notificationSent: false,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error('Error initializing app:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteReminder = (reminderId: string) => {
    setCurrentReminder(prev => 
      prev ? { ...prev, completed: true } : null
    );
  };

  const handleBookmarkReminder = async (reminder: Reminder) => {
    if (!authenticated || !user?.id) {
      alert('Please connect your wallet to save bookmarks');
      return;
    }

    try {
      const newBookmark: Bookmark = {
        bookmarkId: generateId(),
        userId: reminder.userId,
        contentTitle: reminder.duaTitle,
        contentBody: `${reminder.duaArabic}\n\n${reminder.duaText}`,
        tags: ['dua', 'daily'],
        createdAt: new Date(),
      };
      
      await createBookmark(newBookmark);
      setBookmarks(prev => [newBookmark, ...prev]);
      setFilteredBookmarks(prev => [newBookmark, ...prev]);
    } catch (error) {
      console.error('Error saving bookmark:', error);
      alert('Failed to save bookmark. Please try again.');
    }
  };

  const handleDeleteBookmark = async (bookmarkId: string) => {
    if (!authenticated || !user?.id) return;

    try {
      await deleteBookmark(bookmarkId, user.id);
      setBookmarks(prev => prev.filter(b => b.bookmarkId !== bookmarkId));
      setFilteredBookmarks(prev => prev.filter(b => b.bookmarkId !== bookmarkId));
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      alert('Failed to delete bookmark. Please try again.');
    }
  };

  const handleSearch = async (query: string, tags: string[]) => {
    if (!authenticated || !user?.id) {
      // For demo users, filter locally
      let filtered = bookmarks;
      
      if (query) {
        filtered = filtered.filter(bookmark => 
          bookmark.contentTitle.toLowerCase().includes(query.toLowerCase()) ||
          bookmark.contentBody.toLowerCase().includes(query.toLowerCase())
        );
      }
      
      if (tags.length > 0) {
        filtered = filtered.filter(bookmark => 
          tags.some(tag => bookmark.tags.includes(tag))
        );
      }
      
      setFilteredBookmarks(filtered);
      return;
    }

    try {
      if (!query && tags.length === 0) {
        // No filters, show all bookmarks
        setFilteredBookmarks(bookmarks);
      } else {
        // Search with filters
        const results = await searchBookmarks(user.id, query, tags);
        setFilteredBookmarks(results);
      }
    } catch (error) {
      console.error('Error searching bookmarks:', error);
      setFilteredBookmarks(bookmarks);
    }
  };

  // Get all unique tags from bookmarks
  const availableTags = Array.from(
    new Set(bookmarks.flatMap(bookmark => bookmark.tags))
  ).sort();

  if (loading) {
    return (
      <div className="max-w-md md:max-w-lg mx-auto px-4 py-6">
        <div className="animate-pulse">
          <div className="h-16 bg-gray-200 rounded-card mb-6"></div>
          <div className="h-32 bg-gray-200 rounded-card mb-6"></div>
          <div className="h-20 bg-gray-200 rounded-card mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded-card"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md md:max-w-lg mx-auto px-4 py-6">
      <Header />
      
      <DashboardStats 
        totalBookmarks={stats.totalBookmarks}
        totalReminders={stats.totalReminders}
        completionRate={stats.completionRate}
      />
      
      <QuickActions
        onAddReminder={() => console.log('Add reminder')}
        onSearch={() => setActiveTab('bookmarks')}
        onFilter={() => setActiveTab('bookmarks')}
        onSettings={() => router.push('/settings')}
      />

      {/* Tab Navigation */}
      <div className="glass-card rounded-card p-1 mb-6">
        <div className="flex">
          <button
            onClick={() => setActiveTab('today')}
            className={`flex-1 py-2 px-4 rounded-button font-medium transition-all duration-200 ${
              activeTab === 'today'
                ? 'bg-islamic-green text-white shadow-md'
                : 'text-muted hover:text-text'
            }`}
          >
            Today's Dua
          </button>
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`flex-1 py-2 px-4 rounded-button font-medium transition-all duration-200 ${
              activeTab === 'bookmarks'
                ? 'bg-islamic-green text-white shadow-md'
                : 'text-muted hover:text-text'
            }`}
          >
            Bookmarks ({bookmarks.length})
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'today' && currentReminder && (
        <div className="space-y-6">
          <NotificationCard
            reminder={currentReminder}
            variant="withAction"
            onComplete={handleCompleteReminder}
            onBookmark={handleBookmarkReminder}
          />
          
          {/* Next Reminders Preview */}
          <div className="glass-card p-4 rounded-card">
            <h3 className="text-lg font-semibold text-text mb-4">Upcoming</h3>
            <div className="space-y-3">
              {DAILY_DUAS.slice(1, 3).map((dua, index) => (
                <div key={dua.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-islamic-green bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-islamic-green">
                      {index + 2}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-text">{dua.title}</p>
                    <p className="text-sm text-muted">{dua.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'bookmarks' && (
        <div className="space-y-6">
          {/* Search Bar */}
          <SearchBar
            onSearch={handleSearch}
            availableTags={availableTags}
            placeholder="Search your bookmarks..."
          />

          {/* Authentication Prompt */}
          {!authenticated && (
            <div className="glass-card p-4 rounded-card bg-islamic-green bg-opacity-10 border border-islamic-green border-opacity-20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-islamic-green bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-islamic-green">🔐</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-text">
                    Connect your wallet to save and sync bookmarks
                  </p>
                  <button
                    onClick={login}
                    className="text-sm text-islamic-green hover:underline"
                  >
                    Connect Wallet
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Bookmarks List */}
          <div className="space-y-4">
            {filteredBookmarks.length > 0 ? (
              filteredBookmarks.map((bookmark) => (
                <BookmarkItem
                  key={bookmark.bookmarkId}
                  bookmark={bookmark}
                  variant="editable"
                  onDelete={handleDeleteBookmark}
                />
              ))
            ) : bookmarks.length > 0 ? (
              <div className="glass-card p-8 rounded-card text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="text-lg font-semibold text-text mb-2">
                  No results found
                </h3>
                <p className="text-muted mb-4">
                  Try adjusting your search terms or filters.
                </p>
              </div>
            ) : (
              <div className="glass-card p-8 rounded-card text-center">
                <div className="w-16 h-16 bg-islamic-green bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📖</span>
                </div>
                <h3 className="text-lg font-semibold text-text mb-2">
                  No bookmarks yet
                </h3>
                <p className="text-muted mb-4">
                  Save your favorite Duas and spiritual content to access them anytime.
                </p>
                <button 
                  onClick={() => setActiveTab('today')}
                  className="btn-primary"
                >
                  Browse Today's Dua
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-muted">
          Built with ❤️ for the Muslim community
        </p>
        <p className="text-xs text-muted mt-1">
          Powered by Base & Farcaster
        </p>
      </div>
    </div>
  );
}
