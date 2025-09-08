'use client';

import { Plus, Search, Filter, Settings2 } from 'lucide-react';
import { PrimaryButton } from './PrimaryButton';

interface QuickActionsProps {
  onAddReminder?: () => void;
  onSearch?: () => void;
  onFilter?: () => void;
  onSettings?: () => void;
}

export function QuickActions({ 
  onAddReminder,
  onSearch,
  onFilter,
  onSettings 
}: QuickActionsProps) {
  return (
    <div className="glass-card p-4 rounded-card mb-6">
      <h3 className="text-lg font-semibold text-text mb-4">Quick Actions</h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <PrimaryButton
          variant="withIcon"
          icon={Plus}
          onClick={onAddReminder}
          className="w-full justify-center"
        >
          Add Reminder
        </PrimaryButton>
        
        <button
          onClick={onSearch}
          className="btn-secondary w-full flex items-center justify-center gap-2"
        >
          <Search className="w-4 h-4" />
          Search
        </button>
        
        <button
          onClick={onFilter}
          className="btn-secondary w-full flex items-center justify-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filter
        </button>
        
        <button
          onClick={onSettings}
          className="btn-secondary w-full flex items-center justify-center gap-2"
        >
          <Settings2 className="w-4 h-4" />
          Settings
        </button>
      </div>
    </div>
  );
}
