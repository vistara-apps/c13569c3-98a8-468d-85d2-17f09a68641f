import { PinataSDK } from 'pinata';

// Initialize Pinata client
const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT!,
  pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL!,
});

export interface IPFSUploadResult {
  hash: string;
  url: string;
}

/**
 * Upload content to IPFS via Pinata
 */
export async function uploadToIPFS(content: string, filename: string): Promise<IPFSUploadResult> {
  try {
    const blob = new Blob([content], { type: 'text/plain' });
    const file = new File([blob], filename, { type: 'text/plain' });
    
    const upload = await pinata.upload.file(file);
    
    return {
      hash: upload.IpfsHash,
      url: `${process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL}/ipfs/${upload.IpfsHash}`,
    };
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw new Error('Failed to upload content to IPFS');
  }
}

/**
 * Upload JSON data to IPFS via Pinata
 */
export async function uploadJSONToIPFS(data: any, filename: string): Promise<IPFSUploadResult> {
  try {
    const upload = await pinata.upload.json(data);
    
    return {
      hash: upload.IpfsHash,
      url: `${process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL}/ipfs/${upload.IpfsHash}`,
    };
  } catch (error) {
    console.error('Error uploading JSON to IPFS:', error);
    throw new Error('Failed to upload JSON to IPFS');
  }
}

/**
 * Retrieve content from IPFS
 */
export async function getFromIPFS(hash: string): Promise<string> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL}/ipfs/${hash}`);
    if (!response.ok) {
      throw new Error('Failed to fetch from IPFS');
    }
    return await response.text();
  } catch (error) {
    console.error('Error fetching from IPFS:', error);
    throw new Error('Failed to retrieve content from IPFS');
  }
}

/**
 * Pin existing content by hash
 */
export async function pinByHash(hash: string, name?: string): Promise<void> {
  try {
    await pinata.upload.cid(hash);
  } catch (error) {
    console.error('Error pinning content:', error);
    throw new Error('Failed to pin content');
  }
}

export { pinata };
