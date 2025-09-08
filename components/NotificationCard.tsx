'use client';

import { useState } from 'react';
import { Check, Bookmark, Share2, Clock } from 'lucide-react';
import { NotificationCardProps } from '@/lib/types';
import { formatTime } from '@/lib/utils';

export function NotificationCard({ 
  reminder, 
  variant = 'withAction',
  onComplete,
  onBookmark 
}: NotificationCardProps) {
  const [isCompleted, setIsCompleted] = useState(reminder.completed || false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
    onComplete?.(reminder.reminderId);
  };

  const handleBookmark = () => {
    setIsBookmarked(true);
    onBookmark?.(reminder);
  };

  return (
    <div className="notification-card">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-islamic-green rounded-full"></div>
          <span className="text-sm text-muted font-medium">Daily Dua</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted">
          <Clock className="w-4 h-4" />
          {formatTime(reminder.scheduledTime)}
        </div>
      </div>

      {/* Content */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-text mb-3">
          {reminder.duaTitle}
        </h3>
        
        {reminder.duaArabic && (
          <div className="arabic-text text-xl leading-relaxed mb-4 p-4 bg-islamic-green bg-opacity-10 rounded-lg">
            {reminder.duaArabic}
          </div>
        )}
        
        <p className="text-text leading-relaxed">
          {reminder.duaText}
        </p>
      </div>

      {/* Actions */}
      {variant === 'withAction' && (
        <div className="flex items-center gap-3">
          <button
            onClick={handleComplete}
            disabled={isCompleted}
            className={`flex items-center gap-2 px-4 py-2 rounded-button font-medium transition-all duration-200 ${
              isCompleted
                ? 'bg-islamic-green text-white'
                : 'bg-islamic-green bg-opacity-10 text-islamic-green hover:bg-opacity-20'
            }`}
          >
            <Check className="w-4 h-4" />
            {isCompleted ? 'Completed' : 'Mark Done'}
          </button>

          <button
            onClick={handleBookmark}
            className={`flex items-center gap-2 px-4 py-2 rounded-button font-medium transition-all duration-200 ${
              isBookmarked
                ? 'bg-accent text-white'
                : 'bg-gray-100 text-muted hover:bg-gray-200'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            {isBookmarked ? 'Saved' : 'Save'}
          </button>

          <button className="flex items-center gap-2 px-4 py-2 rounded-button font-medium bg-gray-100 text-muted hover:bg-gray-200 transition-all duration-200">
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      )}
    </div>
  );
}
