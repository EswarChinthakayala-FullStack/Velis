export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          avatar_url: string | null;
          role: string;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          avatar_url?: string | null;
          role?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          avatar_url?: string | null;
          role?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      clients: {
        Row: {
          id: string;
          created_by: string;
          name: string;
          company: string | null;
          email: string | null;
          phone: string | null;
          country: string | null;
          timezone: string | null;
          website: string | null;
          notes: string | null;
          github_username: string | null;
          social_links: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          created_by: string;
          name: string;
          company?: string | null;
          email?: string | null;
          phone?: string | null;
          country?: string | null;
          timezone?: string | null;
          website?: string | null;
          notes?: string | null;
          github_username?: string | null;
          social_links?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          created_by?: string;
          name?: string;
          company?: string | null;
          email?: string | null;
          phone?: string | null;
          country?: string | null;
          timezone?: string | null;
          website?: string | null;
          notes?: string | null;
          github_username?: string | null;
          social_links?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          client_id: string | null;
          name: string;
          slug: string;
          description: string | null;
          status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
          priority: 'low' | 'medium' | 'high' | 'urgent';
          start_date: string | null;
          deadline: string | null;
          budget: number;
          spent: number;
          progress: number;
          github_repo: string | null;
          tech_stack: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id?: string | null;
          name: string;
          slug: string;
          description?: string | null;
          status?: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          start_date?: string | null;
          deadline?: string | null;
          budget?: number;
          spent?: number;
          progress?: number;
          github_repo?: string | null;
          tech_stack?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string | null;
          name?: string;
          slug?: string;
          description?: string | null;
          status?: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          start_date?: string | null;
          deadline?: string | null;
          budget?: number;
          spent?: number;
          progress?: number;
          github_repo?: string | null;
          tech_stack?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      share_links: {
        Row: {
          id: string;
          project_id: string;
          created_by: string | null;
          token: string | null;
          token_hash: string | null;
          name: string | null;
          access_level: string | null;
          pin_code_hash: string | null;
          passkey_hash: string | null;
          password_hash: string | null;
          allowed_ip_cidrs: string[] | null;
          is_active: boolean;
          current_views: number;
          view_count: number;
          max_views: number | null;
          expires_at: string | null;
          revoked_at: string | null;
          last_accessed_at: string | null;
          notes: string | null;
          scope_json: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          created_by?: string | null;
          token?: string | null;
          token_hash?: string | null;
          name?: string | null;
          access_level?: string | null;
          pin_code_hash?: string | null;
          passkey_hash?: string | null;
          password_hash?: string | null;
          allowed_ip_cidrs?: string[] | null;
          is_active?: boolean;
          current_views?: number;
          view_count?: number;
          max_views?: number | null;
          expires_at?: string | null;
          revoked_at?: string | null;
          last_accessed_at?: string | null;
          notes?: string | null;
          scope_json?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          created_by?: string | null;
          token?: string | null;
          token_hash?: string | null;
          name?: string | null;
          access_level?: string | null;
          pin_code_hash?: string | null;
          passkey_hash?: string | null;
          password_hash?: string | null;
          allowed_ip_cidrs?: string[] | null;
          is_active?: boolean;
          current_views?: number;
          view_count?: number;
          max_views?: number | null;
          expires_at?: string | null;
          revoked_at?: string | null;
          last_accessed_at?: string | null;
          notes?: string | null;
          scope_json?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      project_status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
      project_priority: 'low' | 'medium' | 'high' | 'urgent';
      task_status: 'todo' | 'in_progress' | 'review' | 'testing' | 'completed';
      deployment_environment: 'local' | 'development' | 'staging' | 'production';
      repo_visibility: 'public' | 'private';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
