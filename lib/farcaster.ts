import axios from 'axios';

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY!;
const NEYNAR_BASE_URL = 'https://api.neynar.com/v2';

// Neynar API client
const neynarClient = axios.create({
  baseURL: NEYNAR_BASE_URL,
  headers: {
    'api_key': NEYNAR_API_KEY,
    'Content-Type': 'application/json',
  },
});

export interface FarcasterUser {
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string;
  bio: string;
  follower_count: number;
  following_count: number;
  verified_addresses: {
    eth_addresses: string[];
    sol_addresses: string[];
  };
}

export interface Cast {
  hash: string;
  thread_hash: string;
  parent_hash?: string;
  parent_url?: string;
  root_parent_url?: string;
  parent_author?: FarcasterUser;
  author: FarcasterUser;
  text: string;
  timestamp: string;
  embeds: any[];
  reactions: {
    likes_count: number;
    recasts_count: number;
    likes: any[];
    recasts: any[];
  };
  replies: {
    count: number;
  };
  mentioned_profiles: FarcasterUser[];
}

export interface FrameAction {
  button_index: number;
  cast_id: {
    fid: number;
    hash: string;
  };
  input?: {
    text: string;
  };
  state?: {
    serialized: string;
  };
  url: string;
  address: string;
  transaction_id?: string;
}

export const farcasterHelpers = {
  /**
   * Get user information by FID
   */
  async getUserByFid(fid: number): Promise<FarcasterUser | null> {
    try {
      const response = await neynarClient.get(`/farcaster/user/bulk?fids=${fid}`);
      return response.data.users?.[0] || null;
    } catch (error) {
      console.error('Error fetching user by FID:', error);
      return null;
    }
  },

  /**
   * Get user information by username
   */
  async getUserByUsername(username: string): Promise<FarcasterUser | null> {
    try {
      const response = await neynarClient.get(`/farcaster/user/by_username?username=${username}`);
      return response.data.user || null;
    } catch (error) {
      console.error('Error fetching user by username:', error);
      return null;
    }
  },

  /**
   * Get user's casts
   */
  async getUserCasts(fid: number, limit: number = 25): Promise<Cast[]> {
    try {
      const response = await neynarClient.get(`/farcaster/feed/user/casts?fid=${fid}&limit=${limit}`);
      return response.data.casts || [];
    } catch (error) {
      console.error('Error fetching user casts:', error);
      return [];
    }
  },

  /**
   * Get cast by hash
   */
  async getCast(hash: string): Promise<Cast | null> {
    try {
      const response = await neynarClient.get(`/farcaster/cast?identifier=${hash}&type=hash`);
      return response.data.cast || null;
    } catch (error) {
      console.error('Error fetching cast:', error);
      return null;
    }
  },

  /**
   * Search for casts containing specific text
   */
  async searchCasts(query: string, limit: number = 25): Promise<Cast[]> {
    try {
      const response = await neynarClient.get(`/farcaster/cast/search?q=${encodeURIComponent(query)}&limit=${limit}`);
      return response.data.casts || [];
    } catch (error) {
      console.error('Error searching casts:', error);
      return [];
    }
  },

  /**
   * Get trending casts
   */
  async getTrendingCasts(limit: number = 25): Promise<Cast[]> {
    try {
      const response = await neynarClient.get(`/farcaster/feed/trending?limit=${limit}`);
      return response.data.casts || [];
    } catch (error) {
      console.error('Error fetching trending casts:', error);
      return [];
    }
  },

  /**
   * Validate frame action
   */
  async validateFrameAction(messageBytes: string): Promise<FrameAction | null> {
    try {
      const response = await neynarClient.post('/farcaster/frame/validate', {
        message_bytes_in_hex: messageBytes
      });
      return response.data.action || null;
    } catch (error) {
      console.error('Error validating frame action:', error);
      return null;
    }
  },

  /**
   * Post a cast (requires signer)
   */
  async postCast(signerUuid: string, text: string, parentHash?: string): Promise<Cast | null> {
    try {
      const payload: any = {
        signer_uuid: signerUuid,
        text: text
      };

      if (parentHash) {
        payload.parent = parentHash;
      }

      const response = await neynarClient.post('/farcaster/cast', payload);
      return response.data.cast || null;
    } catch (error) {
      console.error('Error posting cast:', error);
      return null;
    }
  },

  /**
   * React to a cast (like/recast)
   */
  async reactToCast(signerUuid: string, castHash: string, reactionType: 'like' | 'recast'): Promise<boolean> {
    try {
      await neynarClient.post('/farcaster/reaction', {
        signer_uuid: signerUuid,
        reaction_type: reactionType,
        target: castHash
      });
      return true;
    } catch (error) {
      console.error('Error reacting to cast:', error);
      return false;
    }
  },

  /**
   * Follow a user
   */
  async followUser(signerUuid: string, targetFid: number): Promise<boolean> {
    try {
      await neynarClient.post('/farcaster/follow', {
        signer_uuid: signerUuid,
        target_fids: [targetFid]
      });
      return true;
    } catch (error) {
      console.error('Error following user:', error);
      return false;
    }
  },

  /**
   * Get user's followers
   */
  async getUserFollowers(fid: number, limit: number = 100): Promise<FarcasterUser[]> {
    try {
      const response = await neynarClient.get(`/farcaster/followers?fid=${fid}&limit=${limit}`);
      return response.data.users || [];
    } catch (error) {
      console.error('Error fetching followers:', error);
      return [];
    }
  },

  /**
   * Get user's following
   */
  async getUserFollowing(fid: number, limit: number = 100): Promise<FarcasterUser[]> {
    try {
      const response = await neynarClient.get(`/farcaster/following?fid=${fid}&limit=${limit}`);
      return response.data.users || [];
    } catch (error) {
      console.error('Error fetching following:', error);
      return [];
    }
  }
};

// Frame utilities
export const frameHelpers = {
  /**
   * Generate frame metadata for HTML
   */
  generateFrameMetadata(config: {
    title: string;
    image: string;
    buttons?: Array<{
      label: string;
      action?: 'post' | 'post_redirect' | 'link' | 'mint';
      target?: string;
    }>;
    input?: {
      text: string;
    };
    postUrl?: string;
    aspectRatio?: '1.91:1' | '1:1';
  }): string {
    const { title, image, buttons = [], input, postUrl, aspectRatio = '1.91:1' } = config;

    let metadata = `
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:title" content="${title}" />
      <meta property="fc:frame:image" content="${image}" />
      <meta property="fc:frame:image:aspect_ratio" content="${aspectRatio}" />
    `;

    if (postUrl) {
      metadata += `<meta property="fc:frame:post_url" content="${postUrl}" />`;
    }

    if (input) {
      metadata += `<meta property="fc:frame:input:text" content="${input.text}" />`;
    }

    buttons.forEach((button, index) => {
      const buttonIndex = index + 1;
      metadata += `<meta property="fc:frame:button:${buttonIndex}" content="${button.label}" />`;
      
      if (button.action) {
        metadata += `<meta property="fc:frame:button:${buttonIndex}:action" content="${button.action}" />`;
      }
      
      if (button.target) {
        metadata += `<meta property="fc:frame:button:${buttonIndex}:target" content="${button.target}" />`;
      }
    });

    return metadata.trim();
  },

  /**
   * Create a simple frame response
   */
  createFrameResponse(config: {
    title: string;
    image: string;
    buttons?: Array<{
      label: string;
      action?: 'post' | 'post_redirect' | 'link' | 'mint';
      target?: string;
    }>;
    input?: {
      text: string;
    };
    postUrl?: string;
  }) {
    return {
      image: config.image,
      buttons: config.buttons || [],
      input: config.input,
      post_url: config.postUrl,
      title: config.title
    };
  }
};

// Utility functions
export function extractFidFromAddress(address: string, users: FarcasterUser[]): number | null {
  const user = users.find(u => 
    u.verified_addresses.eth_addresses.includes(address.toLowerCase()) ||
    u.verified_addresses.sol_addresses.includes(address)
  );
  return user?.fid || null;
}

export function formatCastText(text: string, maxLength: number = 280): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

export function isValidFid(fid: any): boolean {
  return typeof fid === 'number' && fid > 0 && Number.isInteger(fid);
}
