'use client';

import { useEffect, useState } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { Header } from '@/components/Header';
import { DashboardStats } from '@/components/DashboardStats';
import { QuickActions } from '@/components/QuickActions';
import { NotificationCard } from '@/components/NotificationCard';
import { BookmarkItem } from '@/components/BookmarkItem';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useAuth } from '@/lib/hooks/useAuth';
import { useReminders } from '@/lib/hooks/useReminders';
import { useBookmarks } from '@/lib/hooks/useBookmarks';
import { DAILY_DUAS } from '@/lib/constants';

export default function HomePage() {
  const { setFrameReady } = useMiniKit();
  const { isAuthenticated, isReady, login, userData } = useAuth();
  const { todayReminders, markCompleted, getCompletionStats, isLoading: remindersLoading } = useReminders();
  const { bookmarks, getRecentBookmarks, createBookmarkFromDua, deleteBookmark, isLoading: bookmarksLoading } = useBookmarks();
  const [activeTab, setActiveTab] = useState<'today' | 'bookmarks'>('today');

  useEffect(() => {
    setFrameReady();
  }, [setFrameReady]);

  // Show login screen if not authenticated
  if (isReady && !isAuthenticated) {
    return (
      <div className="max-w-md md:max-w-lg mx-auto px-4 py-6 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <div className="text-6xl">🕌</div>
            <h1 className="text-4xl font-bold text-gray-900">DuaFlow</h1>
            <p className="text-xl text-gray-600">
              Never miss a spiritual practice. Organize your divine connections.
            </p>
          </div>
          
          <div className="space-y-4">
            <PrimaryButton onClick={login} variant="default" className="w-full">
              Connect Wallet & Start
            </PrimaryButton>
            <p className="text-sm text-gray-500">
              Connect with Farcaster or your wallet to begin your spiritual journey
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show loading screen while initializing
  if (!isReady || remindersLoading || bookmarksLoading) {
    return (
      <div className="max-w-md md:max-w-lg mx-auto px-4 py-6 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin text-4xl">🕌</div>
          <p className="text-gray-600">Loading your spiritual dashboard...</p>
        </div>
      </div>
    );
  }

  const completionStats = getCompletionStats();
  const recentBookmarks = getRecentBookmarks(5);

  const handleCompleteReminder = (reminderId: string) => {
    markCompleted(reminderId);
  };

  const handleBookmarkReminder = (reminder: any) => {
    createBookmarkFromDua({
      title: reminder.duaTitle,
      arabic: reminder.duaArabic || '',
      translation: reminder.duaText,
      category: 'daily'
    });
  };

  const handleDeleteBookmark = (bookmarkId: string) => {
    deleteBookmark(bookmarkId);
  };

  return (
    <div className="max-w-md md:max-w-lg mx-auto px-4 py-6">
      <Header />
      
      <DashboardStats 
        todayStats={completionStats}
        totalBookmarks={bookmarks.length}
      />
      
      <QuickActions
        onAddReminder={() => console.log('Add reminder')}
        onSearch={() => console.log('Search')}
        onFilter={() => console.log('Filter')}
        onSettings={() => console.log('Settings')}
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
      {activeTab === 'today' && (
        <div className="space-y-6">
          {todayReminders.length > 0 ? (
            todayReminders.map((reminder) => (
              <NotificationCard
                key={reminder.reminderId}
                reminder={reminder}
                variant="withAction"
                onComplete={handleCompleteReminder}
                onBookmark={handleBookmarkReminder}
              />
            ))
          ) : (
            <div className="glass-card p-8 rounded-card text-center">
              <div className="w-16 h-16 bg-islamic-green bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌅</span>
              </div>
              <h3 className="text-lg font-semibold text-text mb-2">
                No reminders for today
              </h3>
              <p className="text-muted mb-4">
                Set up your daily reminders to get started with your spiritual practice.
              </p>
              <PrimaryButton variant="default">
                Set Up Reminders
              </PrimaryButton>
            </div>
          )}
          
          {/* Next Reminders Preview */}
          <div className="glass-card p-4 rounded-card">
            <h3 className="text-lg font-semibold text-text mb-4">Available Duas</h3>
            <div className="space-y-3">
              {DAILY_DUAS.slice(0, 3).map((dua, index) => (
                <div key={dua.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-islamic-green bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-islamic-green">
                      {index + 1}
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
        <div className="space-y-4">
          {bookmarks.length > 0 ? (
            bookmarks.map((bookmark) => (
              <BookmarkItem
                key={bookmark.bookmarkId}
                bookmark={bookmark}
                variant="editable"
                onDelete={handleDeleteBookmark}
              />
            ))
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
              <PrimaryButton variant="default" onClick={() => setActiveTab('today')}>
                Browse Duas
              </PrimaryButton>
            </div>
          )}
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
