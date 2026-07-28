import { createServiceRoleClient, verifyProjectExists, insertShareLinkRecord } from './database.ts';
import { generateSecureRandomToken, sha256Hash, hashPassword } from './crypto.ts';
import { validateGenerateShareLinkRequest } from '../validators/request.ts';
import { Logger } from '../utils/logger.ts';
import type { GenerateShareLinkResponse } from '../types.ts';

export async function processGenerateShareLink(
  req: Request
): Promise<GenerateShareLinkResponse> {
  Logger.info('Share Link Generation Started');

  // 1. Verify Authorization Header (Admin verification)
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    Logger.warn('Unauthorized request: missing Authorization header');
    throw new Error('Unauthorized: missing credentials');
  }

  // 2. Parse & Validate JSON payload
  const body = await req.json();
  const validation = validateGenerateShareLinkRequest(body);
  if (!validation.valid) {
    Logger.warn('Invalid request payload', { error: validation.error });
    throw new Error(validation.error);
  }

  const { projectId, expiresAt, password, notes, maxViews } = validation.value;

  // 3. Initialize Service Role DB Client
  const supabase = createServiceRoleClient();

  // 4. Verify target project exists in database
  const projectExists = await verifyProjectExists(supabase, projectId);
  if (!projectExists) {
    Logger.warn('Target project not found', { projectId });
    throw new Error(`Project "${projectId}" not found or unauthorized`);
  }

  Logger.info('Project Validated', { projectId });

  // 5. Generate 256-bit cryptographically secure token & SHA-256 token hash
  const token = generateSecureRandomToken();
  const tokenHash = await sha256Hash(token);

  Logger.info('Secure Token Generated');

  // 6. Compute password hash if password supplied
  let passwordHash: string | null = null;
  if (password) {
    passwordHash = await hashPassword(password);
    Logger.info('Password Hashed');
  }

  // 7. Insert share link record into database
  const dbResult = await insertShareLinkRecord(supabase, {
    projectId,
    tokenHash,
    token,
    passwordHash,
    expiresAt,
    maxViews,
    notes,
  });

  Logger.info('Share Link Created', { linkId: dbResult.id });

  // 8. Resolve public portal application base URL
  const baseUrl =
    Deno.env.get('PUBLIC_APP_URL') ||
    Deno.env.get('PUBLIC_PORTAL_URL') ||
    'https://velis.vercel.app';

  const shareUrl = `${baseUrl.replace(/\/$/, '')}/share/${token}`;

  return {
    success: true,
    shareUrl,
    token,
    id: dbResult.id,
    expiresAt: dbResult.expires_at || null,
    passwordProtected: Boolean(passwordHash),
    createdAt: dbResult.created_at || new Date().toISOString(),
  };
}
