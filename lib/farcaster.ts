import axios from 'axios';

const NEYNAR_API_BASE = 'https://api.neynar.com/v2';
const API_KEY = process.env.NEYNAR_API_KEY!;

// Farcaster API client
const farcasterAPI = axios.create({
  baseURL: NEYNAR_API_BASE,
  headers: {
    'api_key': API_KEY,
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
  verifications: string[];
}

export interface FarcasterCast {
  hash: string;
  thread_hash: string;
  parent_hash?: string;
  author: FarcasterUser;
  text: string;
  timestamp: string;
  replies: {
    count: number;
  };
  reactions: {
    likes_count: number;
    recasts_count: number;
  };
  embeds: any[];
}

/**
 * Get user information by FID
 */
export async function getFarcasterUser(fid: number): Promise<FarcasterUser> {
  try {
    const response = await farcasterAPI.get(`/user/bulk?fids=${fid}`);
    return response.data.users[0];
  } catch (error) {
    console.error('Error fetching Farcaster user:', error);
    throw new Error('Failed to fetch user information');
  }
}

/**
 * Get user information by username
 */
export async function getFarcasterUserByUsername(username: string): Promise<FarcasterUser> {
  try {
    const response = await farcasterAPI.get(`/user/by_username?username=${username}`);
    return response.data.user;
  } catch (error) {
    console.error('Error fetching Farcaster user by username:', error);
    throw new Error('Failed to fetch user information');
  }
}

/**
 * Get user's casts
 */
export async function getUserCasts(fid: number, limit: number = 25): Promise<FarcasterCast[]> {
  try {
    const response = await farcasterAPI.get(`/casts?fid=${fid}&limit=${limit}`);
    return response.data.casts;
  } catch (error) {
    console.error('Error fetching user casts:', error);
    throw new Error('Failed to fetch user casts');
  }
}

/**
 * Post a cast (requires signer)
 */
export async function postCast(text: string, signerUuid: string): Promise<FarcasterCast> {
  try {
    const response = await farcasterAPI.post('/casts', {
      text,
      signer_uuid: signerUuid,
    });
    return response.data.cast;
  } catch (error) {
    console.error('Error posting cast:', error);
    throw new Error('Failed to post cast');
  }
}

/**
 * Create a frame for Dua reminders
 */
export function createDuaFrame(reminder: {
  duaTitle: string;
  duaText: string;
  duaArabic?: string;
  reminderId: string;
}) {
  const frameUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/frame/dua/${reminder.reminderId}`;
  
  return {
    'fc:frame': 'vNext',
    'fc:frame:image': `${process.env.NEXT_PUBLIC_BASE_URL}/api/frame/image?title=${encodeURIComponent(reminder.duaTitle)}`,
    'fc:frame:button:1': 'Mark Complete',
    'fc:frame:button:2': 'Save to Bookmarks',
    'fc:frame:button:3': 'Share',
    'fc:frame:post_url': `${process.env.NEXT_PUBLIC_BASE_URL}/api/frame/action`,
  };
}

/**
 * Validate frame signature
 */
export async function validateFrameSignature(body: any): Promise<boolean> {
  try {
    const response = await farcasterAPI.post('/frame/validate', body);
    return response.data.valid;
  } catch (error) {
    console.error('Error validating frame signature:', error);
    return false;
  }
}

/**
 * Get trending casts related to Islamic content
 */
export async function getIslamicTrendingCasts(limit: number = 10): Promise<FarcasterCast[]> {
  try {
    const response = await farcasterAPI.get(`/casts/search?q=islam OR dua OR quran&limit=${limit}`);
    return response.data.casts;
  } catch (error) {
    console.error('Error fetching trending Islamic casts:', error);
    return [];
  }
}

export { farcasterAPI };
