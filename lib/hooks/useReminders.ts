import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

interface Reminder {
  reminderId: string;
  userId: string;
  duaTitle: string;
  duaText: string;
  duaArabic?: string;
  scheduledTime: string;
  notificationSent: boolean;
  completed: boolean;
  createdAt: Date;
}

interface CreateReminderData {
  duaTitle: string;
  duaText: string;
  duaArabic?: string;
  scheduledTime: string;
}

export function useReminders() {
  const { userData } = useAuth();
  const queryClient = useQueryClient();

  // Get user reminders
  const { data: reminders = [], isLoading, error } = useQuery({
    queryKey: ['reminders', userData?.user_id],
    queryFn: async () => {
      if (!userData?.user_id) return [];
      
      const response = await fetch(`/api/reminders?userId=${userData.user_id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch reminders');
      }
      
      const data = await response.json();
      return data.reminders || [];
    },
    enabled: !!userData?.user_id,
  });

  // Get today's reminders
  const { data: todayReminders = [], isLoading: isTodayLoading } = useQuery({
    queryKey: ['reminders', 'today', userData?.user_id],
    queryFn: async () => {
      if (!userData?.user_id) return [];
      
      const response = await fetch(`/api/reminders?userId=${userData.user_id}&today=true`);
      if (!response.ok) {
        throw new Error('Failed to fetch today\'s reminders');
      }
      
      const data = await response.json();
      return data.reminders || [];
    },
    enabled: !!userData?.user_id,
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });

  // Create reminder mutation
  const createReminderMutation = useMutation({
    mutationFn: async (reminderData: CreateReminderData) => {
      if (!userData?.user_id) throw new Error('User not authenticated');

      const response = await fetch('/api/reminders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userData.user_id,
          ...reminderData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create reminder');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders', userData?.user_id] });
      queryClient.invalidateQueries({ queryKey: ['reminders', 'today', userData?.user_id] });
      toast.success('Reminder created successfully!');
    },
    onError: (error) => {
      console.error('Create reminder error:', error);
      toast.error('Failed to create reminder');
    },
  });

  // Update reminder mutation
  const updateReminderMutation = useMutation({
    mutationFn: async ({ reminderId, updates }: { reminderId: string; updates: any }) => {
      const response = await fetch('/api/reminders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reminderId,
          updates,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update reminder');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders', userData?.user_id] });
      queryClient.invalidateQueries({ queryKey: ['reminders', 'today', userData?.user_id] });
    },
    onError: (error) => {
      console.error('Update reminder error:', error);
      toast.error('Failed to update reminder');
    },
  });

  // Generate daily reminders mutation
  const generateDailyRemindersMutation = useMutation({
    mutationFn: async (preferences?: any) => {
      if (!userData?.user_id) throw new Error('User not authenticated');

      const response = await fetch('/api/reminders/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userData.user_id,
          preferences: preferences || userData.notification_preferences,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate daily reminders');
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['reminders', userData?.user_id] });
      queryClient.invalidateQueries({ queryKey: ['reminders', 'today', userData?.user_id] });
      toast.success(data.message);
    },
    onError: (error) => {
      console.error('Generate daily reminders error:', error);
      toast.error('Failed to generate daily reminders');
    },
  });

  // Mark reminder as completed
  const markCompleted = (reminderId: string) => {
    updateReminderMutation.mutate({
      reminderId,
      updates: { completed: true },
    });
  };

  // Mark reminder as incomplete
  const markIncomplete = (reminderId: string) => {
    updateReminderMutation.mutate({
      reminderId,
      updates: { completed: false },
    });
  };

  // Get completed reminders
  const getCompletedReminders = () => {
    return reminders.filter(reminder => reminder.completed);
  };

  // Get pending reminders
  const getPendingReminders = () => {
    return reminders.filter(reminder => !reminder.completed);
  };

  // Get reminders for a specific time
  const getRemindersByTime = (time: string) => {
    return reminders.filter(reminder => reminder.scheduledTime === time);
  };

  // Get next reminder
  const getNextReminder = () => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    
    const upcomingReminders = todayReminders
      .filter(reminder => !reminder.completed && reminder.scheduledTime > currentTime)
      .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));
    
    return upcomingReminders[0] || null;
  };

  // Get completion stats
  const getCompletionStats = () => {
    const total = todayReminders.length;
    const completed = todayReminders.filter(r => r.completed).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return {
      total,
      completed,
      pending: total - completed,
      percentage,
    };
  };

  return {
    // Data
    reminders,
    todayReminders,
    isLoading: isLoading || isTodayLoading,
    error,
    
    // Actions
    createReminder: createReminderMutation.mutate,
    updateReminder: updateReminderMutation.mutate,
    generateDailyReminders: generateDailyRemindersMutation.mutate,
    markCompleted,
    markIncomplete,
    
    // Utilities
    getCompletedReminders,
    getPendingReminders,
    getRemindersByTime,
    getNextReminder,
    getCompletionStats,
    
    // Loading states
    isCreating: createReminderMutation.isPending,
    isUpdating: updateReminderMutation.isPending,
    isGenerating: generateDailyRemindersMutation.isPending,
  };
}
