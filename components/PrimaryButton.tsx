'use client';

import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface PrimaryButtonProps {
  children: ReactNode;
  variant?: 'default' | 'withIcon';
  icon?: LucideIcon;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function PrimaryButton({ 
  children, 
  variant = 'default',
  icon: Icon,
  onClick,
  disabled = false,
  className = ''
}: PrimaryButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn-primary ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {variant === 'withIcon' && Icon && (
        <Icon className="w-5 h-5 mr-2" />
      )}
      {children}
    </button>
  );
}
