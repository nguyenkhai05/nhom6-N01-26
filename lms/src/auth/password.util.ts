import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const KEY_LENGTH = 64;

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

// Băm mật khẩu bằng scrypt (có sẵn trong Node) + salt ngẫu nhiên.
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, KEY_LENGTH).toString('hex');
  return `scrypt$${salt}$${hash}`;
}

export function isLegacyHash(stored: string): boolean {
  return /^[a-f0-9]{64}$/i.test(stored);
}

export function verifyPassword(password: string, stored: string): boolean {
  if (isLegacyHash(stored)) {
    const sha = createHash('sha256').update(password).digest('hex');
    return safeEqual(sha, stored.toLowerCase());
  }
  const [scheme, salt, hash] = stored.split('$');
  if (scheme !== 'scrypt' || !salt || !hash) return false;
  const actual = scryptSync(password, salt, KEY_LENGTH).toString('hex');
  return safeEqual(actual, hash);
}