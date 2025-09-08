import { usePrivy } from '@privy-io/react-auth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface User {
  id: string;
  userId: string;
  username?: string;
  walletAddress?: string;
  farcasterData?: any;
  notificationPreferences?: any;
  createdAt: Date;
  updatedAt: Date;
}

export function useAuth() {
  const { user: privyUser, login, logout, authenticated, ready } = usePrivy();
  const queryClient = useQueryClient();
  const [isInitialized, setIsInitialized] = useState(false);

  // Get user data from our API
  const { data: userData, isLoading: isUserLoading, error: userError } = useQuery({
    queryKey: ['user', privyUser?.id],
    queryFn: async () => {
      if (!privyUser?.id) return null;
      
      const response = await fetch(`/api/auth?userId=${privyUser.id}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null; // User doesn't exist yet
        }
        throw new Error('Failed to fetch user data');
      }
      
      const data = await response.json();
      return data.user;
    },
    enabled: !!privyUser?.id && authenticated,
  });

  // Create or update user mutation
  const createUserMutation = useMutation({
    mutationFn: async (userData: {
      userId: string;
      username?: string;
      walletAddress?: string;
      farcasterData?: any;
    }) => {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Failed to create/update user');
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['user', data.user.user_id], data.user);
      toast.success(data.message);
    },
    onError: (error) => {
      console.error('User creation/update error:', error);
      toast.error('Failed to save user data');
    },
  });

  // Update user preferences mutation
  const updatePreferencesMutation = useMutation({
    mutationFn: async (updates: any) => {
      if (!privyUser?.id) throw new Error('No user ID');

      const response = await fetch('/api/auth', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: privyUser.id,
          updates,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update preferences');
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['user', data.user.user_id], data.user);
      toast.success('Preferences updated successfully');
    },
    onError: (error) => {
      console.error('Preferences update error:', error);
      toast.error('Failed to update preferences');
    },
  });

  // Initialize user when Privy user is available
  useEffect(() => {
    if (ready && authenticated && privyUser && !userData && !isUserLoading && !isInitialized) {
      const walletAddress = privyUser.wallet?.address;
      const farcasterData = privyUser.farcaster;
      
      createUserMutation.mutate({
        userId: privyUser.id,
        username: farcasterData?.username || privyUser.email?.address?.split('@')[0],
        walletAddress,
        farcasterData,
      });
      
      setIsInitialized(true);
    }
  }, [ready, authenticated, privyUser, userData, isUserLoading, isInitialized]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to login');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      queryClient.clear();
      setIsInitialized(false);
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  const updatePreferences = (preferences: any) => {
    updatePreferencesMutation.mutate({
      notification_preferences: preferences,
    });
  };

  return {
    // Auth state
    isAuthenticated: authenticated,
    isReady: ready,
    isLoading: isUserLoading || createUserMutation.isPending,
    
    // User data
    privyUser,
    userData,
    userError,
    
    // Auth actions
    login: handleLogin,
    logout: handleLogout,
    updatePreferences,
    
    // Mutation states
    isCreatingUser: createUserMutation.isPending,
    isUpdatingPreferences: updatePreferencesMutation.isPending,
  };
}
