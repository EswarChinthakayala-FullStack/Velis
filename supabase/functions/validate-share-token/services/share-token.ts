import { createServiceRoleClient, findShareLinkByToken, verifyProjectActive } from './database.ts';
import { sha256Hash, verifyPassword } from './bcrypt.ts';
import { generateViewerJwt } from './jwt.ts';
import { recordShareLinkAccess } from './analytics.ts';
import { validateTokenRequest } from '../validators/request.ts';
import { Logger } from '../utils/logger.ts';
import type { ValidateShareTokenSuccessResponse } from '../types.ts';

export async function processValidateShareToken(
  req: Request
): Promise<ValidateShareTokenSuccessResponse> {
  Logger.info('Token Validation Started');

  // 1. Parse & Validate Payload
  const body = await req.json();
  const validation = validateTokenRequest(body);
  if (!validation.valid) {
    Logger.warn('Invalid token request payload', { error: validation.error });
    throw { status: 'invalid', message: validation.error, httpCode: 400 };
  }

  const { token, password } = validation.value;
  const tokenHash = await sha256Hash(token);

  // 2. Initialize Service Role DB Client
  const supabase = createServiceRoleClient();

  // 3. Step 1: Lookup Share Link in DB
  const link = await findShareLinkByToken(supabase, tokenHash, token);
  if (!link) {
    Logger.warn('Share link not found in database');
    throw { status: 'invalid', message: 'Share link not found or invalid', httpCode: 404 };
  }

  Logger.info('Token Located', { linkId: link.id, projectId: link.project_id });

  // 4. Step 2: Validate Link Activation, Expiration & Project
  if (!link.is_active || Boolean(link.revoked_at)) {
    Logger.warn('Share link disabled or revoked', { linkId: link.id });
    throw { status: 'revoked', message: 'Access to this share link has been revoked', httpCode: 403 };
  }

  if (link.expires_at && new Date(link.expires_at) <= new Date()) {
    Logger.warn('Share link expired', { linkId: link.id, expiresAt: link.expires_at });
    throw { status: 'expired', message: 'Share link has expired', httpCode: 410 };
  }

  const currentViews = Number(link.current_views || link.view_count || 0);
  if (link.max_views !== null && link.max_views !== undefined && currentViews >= link.max_views) {
    Logger.warn('Share link view limit exceeded', { linkId: link.id, maxViews: link.max_views });
    throw { status: 'view_limit_exceeded', message: 'Maximum view limit reached', httpCode: 429 };
  }

  const projectActive = await verifyProjectActive(supabase, link.project_id);
  if (!projectActive) {
    Logger.warn('Associated project deleted or inactive', { projectId: link.project_id });
    throw { status: 'invalid', message: 'Associated project is no longer available', httpCode: 404 };
  }

  // 5. Step 3: Password Validation
  if (link.password_hash) {
    if (!password) {
      Logger.warn('Password required for share link access', { linkId: link.id });
      throw { status: 'password_required', message: 'Password is required to access this portal', httpCode: 401 };
    }

    const passwordValid = await verifyPassword(password, link.password_hash);
    if (!passwordValid) {
      Logger.warn('Invalid password submitted for share link', { linkId: link.id });
      throw { status: 'invalid_password', message: 'Incorrect password', httpCode: 401 };
    }

    Logger.info('Password Verified', { linkId: link.id });
  }

  // 6. Step 4: Record View Analytics
  await recordShareLinkAccess(supabase, link.id, currentViews);
  Logger.info('Analytics Updated', { linkId: link.id });

  // 7. Step 5: Issue Short-lived (15 min) Scoped Viewer JWT
  const ttlEnv = Deno.env.get('VIEWER_TOKEN_TTL');
  const ttlSeconds = ttlEnv ? parseInt(ttlEnv, 10) : 900;

  const { accessToken, expiresIn } = await generateViewerJwt(
    link.project_id,
    link.id,
    ttlSeconds
  );

  Logger.info('JWT Issued', { linkId: link.id, projectId: link.project_id, expiresIn });

  return {
    success: true,
    access_token: accessToken,
    expires_in: expiresIn,
    token_type: 'Bearer',
    project_id: link.project_id,
    viewer_role: 'viewer',
  };
}
