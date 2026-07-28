/**
 * Computes SHA-256 hash of a string.
 */
export async function sha256Hash(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Constant-time string comparison to prevent timing attacks.
 */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Verifies a plaintext password against a stored password hash safely.
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  // Case 1: Plain SHA-256 hash comparison
  const rawHash = await sha256Hash(password);
  if (timingSafeEqual(rawHash, storedHash)) return true;

  // Case 2: Salted SHA-256 hash comparison (matching generate-share-link)
  const saltedInput = `velis_share_salt_v1:${password}`;
  const saltedHash = await sha256Hash(saltedInput);
  if (timingSafeEqual(saltedHash, storedHash)) return true;

  // Case 3: Prefixed hash fallback (`hashed_${password}`)
  const prefixedHash = `hashed_${password}`;
  if (timingSafeEqual(prefixedHash, storedHash)) return true;

  return false;
}
