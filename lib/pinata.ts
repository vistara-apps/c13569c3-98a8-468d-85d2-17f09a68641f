import { PinataSDK } from 'pinata-web3';

// Initialize Pinata client
const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT!,
  pinataGateway: 'gateway.pinata.cloud'
});

export interface IPFSUploadResult {
  hash: string;
  url: string;
  size: number;
}

export const ipfsHelpers = {
  /**
   * Upload text content to IPFS
   */
  async uploadText(content: string, filename?: string): Promise<IPFSUploadResult> {
    try {
      const blob = new Blob([content], { type: 'text/plain' });
      const file = new File([blob], filename || 'content.txt', { type: 'text/plain' });
      
      const upload = await pinata.upload.file(file);
      
      return {
        hash: upload.IpfsHash,
        url: `https://gateway.pinata.cloud/ipfs/${upload.IpfsHash}`,
        size: upload.PinSize
      };
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      throw new Error('Failed to upload content to IPFS');
    }
  },

  /**
   * Upload JSON data to IPFS
   */
  async uploadJSON(data: any, filename?: string): Promise<IPFSUploadResult> {
    try {
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const file = new File([blob], filename || 'data.json', { type: 'application/json' });
      
      const upload = await pinata.upload.file(file);
      
      return {
        hash: upload.IpfsHash,
        url: `https://gateway.pinata.cloud/ipfs/${upload.IpfsHash}`,
        size: upload.PinSize
      };
    } catch (error) {
      console.error('Error uploading JSON to IPFS:', error);
      throw new Error('Failed to upload JSON to IPFS');
    }
  },

  /**
   * Upload bookmark content to IPFS with metadata
   */
  async uploadBookmark(bookmark: {
    title: string;
    content: string;
    tags: string[];
    source?: string;
    createdAt: Date;
  }): Promise<IPFSUploadResult> {
    try {
      const bookmarkData = {
        title: bookmark.title,
        content: bookmark.content,
        tags: bookmark.tags,
        source: bookmark.source,
        createdAt: bookmark.createdAt.toISOString(),
        type: 'duaflow-bookmark',
        version: '1.0'
      };

      return await this.uploadJSON(bookmarkData, `bookmark-${Date.now()}.json`);
    } catch (error) {
      console.error('Error uploading bookmark to IPFS:', error);
      throw new Error('Failed to upload bookmark to IPFS');
    }
  },

  /**
   * Retrieve content from IPFS
   */
  async getContent(hash: string): Promise<string> {
    try {
      const response = await fetch(`https://gateway.pinata.cloud/ipfs/${hash}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      console.error('Error retrieving content from IPFS:', error);
      throw new Error('Failed to retrieve content from IPFS');
    }
  },

  /**
   * Retrieve JSON data from IPFS
   */
  async getJSON(hash: string): Promise<any> {
    try {
      const content = await this.getContent(hash);
      return JSON.parse(content);
    } catch (error) {
      console.error('Error retrieving JSON from IPFS:', error);
      throw new Error('Failed to retrieve JSON from IPFS');
    }
  },

  /**
   * Pin existing content by hash
   */
  async pinByHash(hash: string, name?: string): Promise<void> {
    try {
      await pinata.pin.add(hash, {
        pinataMetadata: {
          name: name || `duaflow-pin-${Date.now()}`
        }
      });
    } catch (error) {
      console.error('Error pinning content:', error);
      throw new Error('Failed to pin content');
    }
  },

  /**
   * Unpin content from IPFS
   */
  async unpin(hash: string): Promise<void> {
    try {
      await pinata.unpin(hash);
    } catch (error) {
      console.error('Error unpinning content:', error);
      throw new Error('Failed to unpin content');
    }
  },

  /**
   * List all pinned files
   */
  async listPins(): Promise<any[]> {
    try {
      const pins = await pinata.pin.list();
      return pins.rows || [];
    } catch (error) {
      console.error('Error listing pins:', error);
      throw new Error('Failed to list pins');
    }
  },

  /**
   * Get pin status and metadata
   */
  async getPinStatus(hash: string): Promise<any> {
    try {
      const pins = await pinata.pin.list({
        hashContains: hash
      });
      return pins.rows?.[0] || null;
    } catch (error) {
      console.error('Error getting pin status:', error);
      throw new Error('Failed to get pin status');
    }
  }
};

// Utility function to validate IPFS hash
export function isValidIPFSHash(hash: string): boolean {
  // Basic validation for IPFS hash (CID)
  const ipfsHashRegex = /^Qm[1-9A-HJ-NP-Za-km-z]{44}$|^baf[a-z0-9]{56}$/;
  return ipfsHashRegex.test(hash);
}

// Utility function to extract hash from IPFS URL
export function extractHashFromURL(url: string): string | null {
  const match = url.match(/\/ipfs\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}
