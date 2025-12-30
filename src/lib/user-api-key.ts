import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../convex/_generated/api';
import { decryptApiKey } from './encryption';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export interface GeminiClientResult {
  genAI: GoogleGenerativeAI;
  isByok: boolean;
  user: any;
}

/**
 * Get the appropriate Gemini client for a user.
 * - If user has BYOK key configured, decrypts and uses their key
 * - Otherwise falls back to server-side API key (for paid users)
 */
export async function getGeminiClient(userId: string): Promise<GeminiClientResult> {
  // Get user data including encrypted API key if present
  const user = await convex.query(api.users.getByClerkId, { clerkId: userId });

  if (!user) {
    // User doesn't exist yet, use server key
    return {
      genAI: new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || ''),
      isByok: false,
      user: null,
    };
  }

  // Check if user has BYOK key configured
  const encryptedKeyData = await convex.query(api.users.getEncryptedKey, { clerkId: userId });

  if (encryptedKeyData) {
    // User has BYOK - decrypt and use their key
    try {
      const apiKey = decryptApiKey(
        encryptedKeyData.encryptedApiKey,
        encryptedKeyData.apiKeyIv,
        encryptedKeyData.apiKeyAuthTag
      );

      return {
        genAI: new GoogleGenerativeAI(apiKey),
        isByok: true,
        user,
      };
    } catch (decryptError) {
      console.error('Failed to decrypt user API key:', decryptError);
      // Fall back to server key if decryption fails
    }
  }

  // Fall back to server key
  return {
    genAI: new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || ''),
    isByok: false,
    user,
  };
}

/**
 * Check if a user can access the editor.
 * Returns true if user has:
 * - BYOK key configured, OR
 * - Active subscription with credits, OR
 * - Admin email
 */
export async function canUserAccessEditor(userId: string, adminEmails: string[] = []): Promise<{
  canAccess: boolean;
  reason: 'byok' | 'subscription' | 'admin' | 'none';
  user: any;
}> {
  const user = await convex.query(api.users.getByClerkId, { clerkId: userId });

  if (!user) {
    return { canAccess: false, reason: 'none', user: null };
  }

  // Check admin
  if (user.email && adminEmails.includes(user.email.toLowerCase())) {
    return { canAccess: true, reason: 'admin', user };
  }

  // Check BYOK
  if (user.encryptedApiKey) {
    return { canAccess: true, reason: 'byok', user };
  }

  // Check subscription
  if (user.subscriptionStatus === 'active' && user.credits > 0) {
    return { canAccess: true, reason: 'subscription', user };
  }

  return { canAccess: false, reason: 'none', user };
}
