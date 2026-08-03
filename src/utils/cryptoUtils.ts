/**
 * Compute SHA-256 hash of a string or File using browser Web Crypto API
 * 100% Client-side, zero data leakage.
 */
export async function computeSha256(input: string | ArrayBuffer): Promise<string> {
  const encoder = new TextEncoder();
  const data = typeof input === 'string' ? encoder.encode(input) : input;
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export function formatShortHash(hash: string): string {
  if (!hash || hash.length < 12) return hash;
  return `${hash.substring(0, 8)}...${hash.substring(hash.length - 6)}`;
}
