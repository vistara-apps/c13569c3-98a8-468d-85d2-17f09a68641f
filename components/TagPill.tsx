'use client';

import { TagPillProps } from '@/lib/types';

export function TagPill({ tag, active = false, onClick }: TagPillProps) {
  const handleClick = () => {
    onClick?.(tag);
  };

  return (
    <span
      className={`tag-pill ${active ? 'active' : ''} ${
        onClick ? 'cursor-pointer hover:bg-opacity-30' : ''
      }`}
      onClick={handleClick}
    >
      {tag}
    </span>
  );
}
