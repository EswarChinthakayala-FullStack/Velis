import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { supabase, resilientFetch } from '../lib/supabase';
import { authService } from './auth.service';

export interface ValidateTokenParams {
  token: string;
  password?: string;
}

export interface ValidationResponse {
  status: 'valid' | 'password_required' | 'invalid_password' | 'expired' | 'revoked' | 'invalid' | 'view_limit_exceeded' | 'error';
  token?: string;
  project_id?: string;
  expires_at?: number;
  error?: string;
}

export const portalService = {
  /**
   * Validates share link token & optional password via Edge Function
   */
  async validateShareToken(params: ValidateTokenParams): Promise<ValidationResponse> {
    const { data, error } = await supabase.functions.invoke('validate-share-token', {
      body: params
    });

    if (error && !data) {
      return { status: 'error', error: error.message };
    }

    if (data?.token) {
      authService.setViewerToken(data.token);
    }

    return data as ValidationResponse;
  },

  /**
   * Refreshes in-memory Viewer JWT via Edge Function
   */
  async refreshViewerToken(rawToken: string): Promise<ValidationResponse> {
    const { data, error } = await supabase.functions.invoke('refresh-viewer-token', {
      body: { token: rawToken }
    });

    if (error && !data) {
      return { status: 'error', error: error.message };
    }

    if (data?.token) {
      authService.setViewerToken(data.token);
    }

    return data as ValidationResponse;
  },

  /**
   * Creates a dedicated Supabase client instance configured with the Viewer Bearer JWT
   */
  createViewerClient(viewerJwt: string): SupabaseClient {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
    const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

    return createClient(supabaseUrl, supabaseKey, {
      global: {
        fetch: resilientFetch,
        headers: {
          Authorization: `Bearer ${viewerJwt}`
        }
      }
    });
  }
};
