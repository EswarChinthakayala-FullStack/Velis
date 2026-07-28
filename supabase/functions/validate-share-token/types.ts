export interface ValidateShareTokenRequest {
  token: string;
  password?: string | null;
}

export interface ValidateShareTokenSuccessResponse {
  success: true;
  access_token: string;
  expires_in: number;
  token_type: 'Bearer';
  project_id: string;
  viewer_role: 'viewer';
}

export interface ValidateShareTokenErrorResponse {
  success: false;
  status: 'invalid' | 'revoked' | 'expired' | 'password_required' | 'invalid_password' | 'view_limit_exceeded' | 'error';
  error: string;
}
