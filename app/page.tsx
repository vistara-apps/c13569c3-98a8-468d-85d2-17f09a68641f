'use client';

import { useEffect, useState } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { Header } from '@/components/Header';
import { DashboardStats } from '@/components/DashboardStats';
import { QuickActions } from '@/components/QuickActions';
import { NotificationCard } from '@/components/NotificationCard';
import { BookmarkItem } from '@/components/BookmarkItem';
import { DAILY_DUAS } from '@/lib/constants';
import { Reminder, Bookmark } from '@/lib/types';
import { generateId } from '@/lib/utils';

export default function HomePage() {
  const { setFrameReady } = useMiniKit();
  const [currentReminder, setCurrentReminder] = useState<Reminder | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [activeTab, setActiveTab] = useState<'today' | 'bookmarks'>('today');

  useEffect(() => {
    setFrameReady();
    
    // Initialize with a sample reminder
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

    // Initialize with sample bookmarks
    setBookmarks([
      {
        bookmarkId: generateId(),
        userId: 'demo-user',
        contentTitle: 'Morning Dhikr Benefits',
        contentBody: 'Reciting morning dhikr provides spiritual protection and brings barakah to your day. It connects you with Allah and sets a positive tone for all activities.',
        tags: ['morning', 'dhikr', 'benefits'],
        createdAt: new Date(Date.now() - 86400000), // Yesterday
      },
      {
        bookmarkId: generateId(),
        userId: 'demo-user',
        contentTitle: 'Importance of Consistency',
        contentBody: 'Consistency in spiritual practices, even if small, is more beloved to Allah than sporadic large efforts. The Prophet (PBUH) emphasized regular worship.',
        tags: ['consistency', 'sunnah', 'worship'],
        createdAt: new Date(Date.now() - 172800000), // 2 days ago
      },
    ]);
  }, [setFrameReady]);

  const handleCompleteReminder = (reminderId: string) => {
    setCurrentReminder(prev => 
      prev ? { ...prev, completed: true } : null
    );
  };

  const handleBookmarkReminder = (reminder: Reminder) => {
    const newBookmark: Bookmark = {
      bookmarkId: generateId(),
      userId: reminder.userId,
      contentTitle: reminder.duaTitle,
      contentBody: `${reminder.duaArabic}\n\n${reminder.duaText}`,
      tags: ['dua', 'daily'],
      createdAt: new Date(),
    };
    
    setBookmarks(prev => [newBookmark, ...prev]);
  };

  const handleDeleteBookmark = (bookmarkId: string) => {
    setBookmarks(prev => prev.filter(b => b.bookmarkId !== bookmarkId));
  };

  return (
    <div className="max-w-md md:max-w-lg mx-auto px-4 py-6">
      <Header />
      
      <DashboardStats />
      
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
              <button className="btn-primary">
                Browse Duas
              </button>
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
