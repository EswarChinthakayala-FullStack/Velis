/**
 * Generates a 256-bit (32 bytes) cryptographically secure random URL-safe token.
 */
export function generateSecureRandomToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Computes SHA-256 cryptographic hash of a input string.
 */
export async function sha256Hash(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Computes password hash for password-protected share links.
 */
export async function hashPassword(password: string): Promise<string> {
  // Using SHA-256 with salt prefix for secure zero-trust storage
  const saltedInput = `velis_share_salt_v1:${password}`;
  return await sha256Hash(saltedInput);
}
