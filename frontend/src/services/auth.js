// Gọi API xác thực của backend (/auth/*) và quản lý phiên đăng nhập ở frontend.
// - Token JWT gửi theo dạng "Authorization: Bearer <token>" (không dùng cookie).
// - Mật khẩu KHÔNG bao giờ được lưu ở frontend: chỉ gửi lên máy chủ lúc đăng nhập / đăng ký.
import { API_URL } from './api';

const TOKEN_KEY = 'eduviet_token';
const EXTRAS_KEY = 'eduviet_user_extras';

export const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80';

// Lỗi có kèm mã HTTP (0 = không kết nối được máy chủ)
export class AuthError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
  }
}

/* ---------- Token ---------- */

export function getToken() {
  try {
    return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

// remember = true: giữ đăng nhập sau khi đóng trình duyệt (localStorage)
// remember = false: chỉ giữ trong tab hiện tại (sessionStorage)
export function saveToken(token, remember = true) {
  clearToken();
  try {
    (remember ? localStorage : sessionStorage).setItem(TOKEN_KEY, token);
  } catch {
    // Trình duyệt chặn lưu trữ: bỏ qua, người dùng sẽ phải đăng nhập lại khi tải lại trang
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    // bỏ qua
  }
}

/* ---------- Gọi API ---------- */

async function callAuth(path, { method = 'GET', body, token } = {}) {
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new AuthError('Không kết nối được máy chủ. Hãy kiểm tra backend đã chạy chưa.', 0);
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    // phản hồi không phải JSON
  }

  if (!res.ok) {
    // ValidationPipe của Nest trả message là mảng, các lỗi khác trả chuỗi
    const msg = Array.isArray(data?.message) ? data.message.join('. ') : data?.message;
    throw new AuthError(msg || `Lỗi máy chủ (${res.status})`, res.status);
  }
  return data;
}

export function apiLogin(email, password) {
  return callAuth('/auth/login', { method: 'POST', body: { email, password } });
}

export function apiGoogleLogin({ id_token, email, full_name, avatar_url }) {
  return callAuth('/auth/google', {
    method: 'POST',
    body: { id_token, email, full_name, avatar_url },
  });
}

export function apiRegister({ full_name, email, password }) {
  return callAuth('/auth/register', { method: 'POST', body: { full_name, email, password } });
}

export function apiMe(token) {
  return callAuth('/auth/me', { token });
}

/* ---------- Dữ liệu phụ của người dùng (chỉ lưu ở trình duyệt) ----------
   Backend hiện chỉ có họ tên, email, vai trò. Ví, khóa học đã mua, số điện thoại, tiểu sử...
   vẫn là dữ liệu giả lập ở frontend, lưu theo user_id để đổi tài khoản không bị lẫn. */

const EXTRA_FIELDS = [
  'walletBalance', 'enrolledCourses', 'phone', 'bio', 'targetTrack', 'githubUrl', 'joinDate', 'avatarUrl',
];

function readAllExtras() {
  try {
    const value = JSON.parse(localStorage.getItem(EXTRAS_KEY) || '{}');
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  } catch {
    return {};
  }
}

export function saveExtras(user) {
  if (!user?.userId) return;
  const extras = {};
  for (const key of EXTRA_FIELDS) {
    if (user[key] !== undefined) extras[key] = user[key];
  }
  try {
    const all = readAllExtras();
    all[user.userId] = extras;
    localStorage.setItem(EXTRAS_KEY, JSON.stringify(all));
  } catch {
    // bỏ qua
  }
}

// Ghép thông tin từ máy chủ (tin cậy) với dữ liệu phụ ở trình duyệt thành "currentUser" của giao diện.
// Vai trò luôn lấy từ máy chủ: Admin → 'ADMIN', còn lại → 'USER'.
export function toFrontendUser(serverUser, newExtras = {}) {
  const roles = Array.isArray(serverUser.roles) ? serverUser.roles : [];
  const saved = readAllExtras()[serverUser.user_id] || {};
  return {
    userId: serverUser.user_id,
    fullName: serverUser.full_name,
    email: serverUser.email,
    roles,
    role: roles.includes('Admin') ? 'ADMIN' : 'USER',
    phone: 'Chưa cập nhật',
    walletBalance: 1000000,
    enrolledCourses: [],
    bio: 'Học viên đam mê chinh phục công nghệ lập trình.',
    targetTrack: 'Fullstack Web Engineer',
    joinDate: new Date().toLocaleDateString('vi-VN'),
    avatarUrl: serverUser.avatar_url || DEFAULT_AVATAR,
    ...saved,
    ...newExtras,
  };
}
