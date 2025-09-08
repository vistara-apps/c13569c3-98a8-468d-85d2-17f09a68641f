'use client';

import { Calendar, BookOpen, CheckCircle, Clock } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: string;
}

function StatCard({ icon, label, value, trend }: StatCardProps) {
  return (
    <div className="glass-card p-4 rounded-card">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-islamic-green bg-opacity-10 rounded-lg">
          {icon}
        </div>
        <span className="text-sm text-muted font-medium">{label}</span>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-text">{value}</span>
        {trend && (
          <span className="text-sm text-islamic-green font-medium">
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}

interface DashboardStatsProps {
  totalBookmarks?: number;
  totalReminders?: number;
  completionRate?: number;
}

export function DashboardStats({ 
  totalBookmarks = 0, 
  totalReminders = 0, 
  completionRate = 0 
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        icon={<BookOpen className="w-5 h-5 text-islamic-green" />}
        label="Bookmarks"
        value={totalBookmarks.toString()}
        trend={totalBookmarks > 0 ? "Saved" : "Start saving"}
      />
      <StatCard
        icon={<Calendar className="w-5 h-5 text-islamic-green" />}
        label="Reminders"
        value={totalReminders.toString()}
        trend={totalReminders > 0 ? "Active" : "Create first"}
      />
      <StatCard
        icon={<CheckCircle className="w-5 h-5 text-islamic-green" />}
        label="Completed"
        value={`${completionRate}%`}
        trend="This month"
      />
      <StatCard
        icon={<Clock className="w-5 h-5 text-islamic-green" />}
        label="Next Dua"
        value="6:00 AM"
        trend="Tomorrow"
      />
    </div>
  );
}
