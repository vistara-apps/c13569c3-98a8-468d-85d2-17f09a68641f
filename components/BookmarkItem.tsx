'use client';

import { useState } from 'react';
import { Edit3, Trash2, ExternalLink, Tag } from 'lucide-react';
import { BookmarkItemProps } from '@/lib/types';
import { formatDate, truncateText } from '@/lib/utils';
import { TagPill } from './TagPill';

export function BookmarkItem({ 
  bookmark, 
  variant = 'viewOnly',
  onEdit,
  onDelete 
}: BookmarkItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleEdit = () => {
    onEdit?.(bookmark);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this bookmark?')) {
      onDelete?.(bookmark.bookmarkId);
    }
  };

  return (
    <div className="bookmark-item" onClick={() => setIsExpanded(!isExpanded)}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-text mb-1">
            {bookmark.contentTitle}
          </h4>
          <p className="text-sm text-muted">
            {formatDate(bookmark.createdAt)}
          </p>
        </div>
        
        {variant === 'editable' && (
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEdit();
              }}
              className="p-2 text-muted hover:text-text hover:bg-gray-100 rounded-button transition-all duration-200"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="p-2 text-muted hover:text-red-500 hover:bg-red-50 rounded-button transition-all duration-200"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-text leading-relaxed">
          {isExpanded 
            ? bookmark.contentBody 
            : truncateText(bookmark.contentBody, 150)
          }
        </p>
        
        {bookmark.sourceUrl && (
          <a
            href={bookmark.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary hover:text-blue-700 mt-2 transition-colors duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-3 h-3" />
            View Source
          </a>
        )}
      </div>

      {/* Tags */}
      {bookmark.tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <Tag className="w-4 h-4 text-muted" />
          {bookmark.tags.map((tag) => (
            <TagPill key={tag} tag={tag} />
          ))}
        </div>
      )}
    </div>
  );
}
