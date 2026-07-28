import { create, getNumericDate } from "https://deno.land/x/djwt@v2.8/mod.ts";

export async function getCryptoKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  return await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

export async function generateViewerJwt(
  projectId: string,
  shareLinkId: string,
  ttlSeconds = 900 // 15 minutes TTL
): Promise<{ accessToken: string; expiresIn: number }> {
  const jwtSecret =
    Deno.env.get('SUPABASE_JWT_SECRET') ||
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ||
    'velis_jwt_secret_fallback_key';

  const cryptoKey = await getCryptoKey(jwtSecret);
  const now = Math.floor(Date.now() / 1000);
  const exp = getNumericDate(ttlSeconds);

  const payload = {
    role: 'viewer',
    project_id: projectId,
    share_link_id: shareLinkId,
    permission: 'read',
    exp,
    iat: getNumericDate(0),
    iss: 'velis',
    aud: 'client-portal',
  };

  const accessToken = await create({ alg: "HS256", typ: "JWT" }, payload, cryptoKey);

  return {
    accessToken,
    expiresIn: ttlSeconds,
  };
}
