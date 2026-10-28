import { createHmac, timingSafeEqual } from 'node:crypto';

export interface JwtPayload {
  sub: number; // user_id
  email: string;
  roles: string[]; // ví dụ ['Admin'], ['Instructor'], ['Student']
  iat: number;
  exp: number;
}

const HEADER = { alg: 'HS256', typ: 'JWT' };

function encode(obj: object): string {
  return Buffer.from(JSON.stringify(obj)).toString('base64url');
}

function signature(data: string, secret: string): string {
  return createHmac('sha256', secret).update(data).digest('base64url');
}

// Lấy khóa bí mật từ .env; thiếu hoặc quá ngắn thì không cho chạy
export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error('Thiếu JWT_SECRET (tối thiểu 16 ký tự) trong lms/.env');
  }
  return secret;
}

// "7d" -> 604800 (giây). Hỗ trợ s, m, h, d. Mặc định 7 ngày.
export function parseExpiresIn(value = process.env.JWT_EXPIRES_IN ?? '7d'): number {
  const match = /^(\d+)([smhd])$/.exec(value);
  if (!match) return 7 * 24 * 3600;
  const unit = { s: 1, m: 60, h: 3600, d: 86400 }[match[2] as 's' | 'm' | 'h' | 'd'];
  return Number(match[1]) * unit;
}

export function signToken(
  data: Pick<JwtPayload, 'sub' | 'email' | 'roles'>,
  secret: string,
  expiresInSeconds: number,
): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: JwtPayload = { ...data, iat: now, exp: now + expiresInSeconds };
  const body = `${encode(HEADER)}.${encode(payload)}`;
  return `${body}.${signature(body, secret)}`;
}

// Trả về payload nếu token hợp lệ và chưa hết hạn, ngược lại trả về null
export function verifyToken(token: string, secret: string): JwtPayload | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [header, payload, sig] = parts;
  try {
    // Chỉ chấp nhận đúng thuật toán HS256 (chặn kiểu tấn công alg=none)
    const head = JSON.parse(Buffer.from(header, 'base64url').toString());
    if (head.alg !== 'HS256') return null;

    const expected = Buffer.from(signature(`${header}.${payload}`, secret));
    const actual = Buffer.from(sig);
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;

    const data = JSON.parse(Buffer.from(payload, 'base64url').toString()) as JwtPayload;
    if (typeof data.exp !== 'number' || data.exp < Math.floor(Date.now() / 1000)) return null;
    return data;
  } catch {
    return null;
  }
}