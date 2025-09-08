import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

interface Bookmark {
  bookmarkId: string;
  userId: string;
  contentTitle: string;
  contentBody: string;
  sourceUrl?: string;
  tags: string[];
  ipfsHash?: string;
  createdAt: Date;
}

interface CreateBookmarkData {
  contentTitle: string;
  contentBody: string;
  sourceUrl?: string;
  tags?: string[];
  saveToIPFS?: boolean;
}

export function useBookmarks() {
  const { userData } = useAuth();
  const queryClient = useQueryClient();

  // Get user bookmarks
  const { data: bookmarks = [], isLoading, error } = useQuery({
    queryKey: ['bookmarks', userData?.user_id],
    queryFn: async () => {
      if (!userData?.user_id) return [];
      
      const response = await fetch(`/api/bookmarks?userId=${userData.user_id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch bookmarks');
      }
      
      const data = await response.json();
      return data.bookmarks || [];
    },
    enabled: !!userData?.user_id,
  });

  // Search bookmarks
  const searchBookmarks = async (searchTerm: string, tags?: string[]) => {
    if (!userData?.user_id) return [];
    
    const params = new URLSearchParams({
      userId: userData.user_id,
    });
    
    if (searchTerm) {
      params.append('search', searchTerm);
    }
    
    if (tags && tags.length > 0) {
      params.append('tags', tags.join(','));
    }
    
    const response = await fetch(`/api/bookmarks?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to search bookmarks');
    }
    
    const data = await response.json();
    return data.bookmarks || [];
  };

  // Create bookmark mutation
  const createBookmarkMutation = useMutation({
    mutationFn: async (bookmarkData: CreateBookmarkData) => {
      if (!userData?.user_id) throw new Error('User not authenticated');

      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userData.user_id,
          ...bookmarkData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create bookmark');
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks', userData?.user_id] });
      toast.success('Bookmark saved successfully!');
    },
    onError: (error) => {
      console.error('Create bookmark error:', error);
      toast.error('Failed to save bookmark');
    },
  });

  // Delete bookmark mutation
  const deleteBookmarkMutation = useMutation({
    mutationFn: async (bookmarkId: string) => {
      if (!userData?.user_id) throw new Error('User not authenticated');

      const response = await fetch(`/api/bookmarks?bookmarkId=${bookmarkId}&userId=${userData.user_id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete bookmark');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks', userData?.user_id] });
      toast.success('Bookmark deleted successfully');
    },
    onError: (error) => {
      console.error('Delete bookmark error:', error);
      toast.error('Failed to delete bookmark');
    },
  });

  // Get bookmarks by tag
  const getBookmarksByTag = (tag: string) => {
    return bookmarks.filter(bookmark => 
      bookmark.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    );
  };

  // Get all unique tags
  const getAllTags = () => {
    const allTags = bookmarks.flatMap(bookmark => bookmark.tags);
    return [...new Set(allTags)].sort();
  };

  // Get recent bookmarks
  const getRecentBookmarks = (limit: number = 5) => {
    return [...bookmarks]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  };

  // Create bookmark from dua
  const createBookmarkFromDua = (dua: {
    title: string;
    arabic: string;
    translation: string;
    source?: string;
    category?: string;
  }) => {
    const tags = ['dua'];
    if (dua.category) {
      tags.push(dua.category.toLowerCase());
    }

    return createBookmarkMutation.mutate({
      contentTitle: dua.title,
      contentBody: `${dua.arabic}\n\n${dua.translation}${dua.source ? `\n\nSource: ${dua.source}` : ''}`,
      tags,
      saveToIPFS: true,
    });
  };

  return {
    // Data
    bookmarks,
    isLoading,
    error,
    
    // Actions
    createBookmark: createBookmarkMutation.mutate,
    deleteBookmark: deleteBookmarkMutation.mutate,
    searchBookmarks,
    createBookmarkFromDua,
    
    // Utilities
    getBookmarksByTag,
    getAllTags,
    getRecentBookmarks,
    
    // Loading states
    isCreating: createBookmarkMutation.isPending,
    isDeleting: deleteBookmarkMutation.isPending,
  };
}
