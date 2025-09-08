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
  todayStats?: {
    total: number;
    completed: number;
    pending: number;
    percentage: number;
  };
  totalBookmarks?: number;
}

export function DashboardStats({ todayStats, totalBookmarks = 0 }: DashboardStatsProps) {
  const completionPercentage = todayStats?.percentage || 0;
  const completedToday = todayStats?.completed || 0;
  const totalToday = todayStats?.total || 0;
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        icon={<Calendar className="w-5 h-5 text-islamic-green" />}
        label="Today's Progress"
        value={`${completionPercentage}%`}
        trend={completedToday > 0 ? `${completedToday}/${totalToday}` : undefined}
      />
      <StatCard
        icon={<CheckCircle className="w-5 h-5 text-islamic-green" />}
        label="Completed"
        value={completedToday.toString()}
        trend={totalToday > 0 ? `of ${totalToday}` : undefined}
      />
      <StatCard
        icon={<BookOpen className="w-5 h-5 text-islamic-green" />}
        label="Bookmarks"
        value={totalBookmarks.toString()}
      />
      <StatCard
        icon={<Clock className="w-5 h-5 text-islamic-green" />}
        label="Pending"
        value={(todayStats?.pending || 0).toString()}
      />
    </div>
  );
}
