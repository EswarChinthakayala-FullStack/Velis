import { supabase } from '../lib/supabase';

export interface GenerateShareLinkParams {
  projectId: string;
  password?: string;
  expiresAt?: string;
  maxViews?: number;
}

export interface ShareLinkResult {
  url: string;
  token: string;
  id: string;
  expires_at: string | null;
  max_views: number | null;
}

export const shareService = {
  /**
   * Generates a cryptographically secure share link via Supabase Edge Function
   */
  async generateShareLink(params: GenerateShareLinkParams): Promise<ShareLinkResult> {
    const { data, error } = await supabase.functions.invoke('generate-share-link', {
      body: params
    });

    if (error || !data || data.error) {
      throw new Error(data?.error || error?.message || 'Failed to generate share link');
    }

    return data as ShareLinkResult;
  },

  /**
   * Revokes an active share link immediately via Supabase Edge Function
   */
  async revokeShareLink(shareLinkId: string): Promise<boolean> {
    const { data, error } = await supabase.functions.invoke('revoke-share-link', {
      body: { shareLinkId }
    });

    if (error || !data || data.error) {
      throw new Error(data?.error || error?.message || 'Failed to revoke share link');
    }

    return true;
  }
};
