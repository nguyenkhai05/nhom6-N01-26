import { API_URL } from './api';
import { getToken, clearToken } from './auth';

async function authRequest(path, { method = 'GET', body } = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      if (res.status === 401) {
        clearToken();
        window.dispatchEvent(new CustomEvent('eduviet:unauthorized'));
      }
      const msg = Array.isArray(data?.message) ? data.message.join('. ') : data?.message;
      throw new Error(msg || `Lỗi máy chủ (${res.status})`);
    }
    return data;
  } catch (err) {
    if (err.name === 'TypeError') {
      throw new Error('Không thể kết nối tới máy chủ EduViet.');
    }
    throw err;
  }
}

/* ================= VÍ TIỀN & LỊCH SỬ BIẾN ĐỘNG SỐ DƯ ================= */

export async function apiGetWallet() {
  return authRequest('/commerce/wallet');
}

export async function apiGetWalletLedger() {
  return authRequest('/commerce/wallet/ledger');
}

export async function apiTopupWallet({ amount, payment_method = 'BANK_QR', note = 'Nạp ví học tập EduViet - MBBank', auto_confirm = true }) {
  return authRequest('/commerce/topup', {
    method: 'POST',
    body: {
      amount: Number(amount),
      payment_method,
      note: note || undefined,
      auto_confirm: Boolean(auto_confirm),
    },
  });
}

/* ================= GIỎ HÀNG (CART) ================= */

export async function apiGetCart() {
  return authRequest('/commerce/cart');
}

export async function apiAddToCart(courseId) {
  return authRequest('/commerce/cart', {
    method: 'POST',
    body: { course_id: Number(courseId) },
  });
}

export async function apiRemoveFromCart(courseId) {
  return authRequest(`/commerce/cart/${courseId}`, {
    method: 'DELETE',
  });
}

export async function apiClearCart() {
  return authRequest('/commerce/cart', {
    method: 'DELETE',
  });
}

/* ================= BÁO GIÁ & THANH TOÁN (CHECKOUT) ================= */

export async function apiCalculateQuote(voucherCode) {
  return authRequest('/commerce/quote', {
    method: 'POST',
    body: { code: voucherCode || undefined },
  });
}

export async function apiCheckout({ voucher_code, payment_method = 'WALLET', course_ids } = {}) {
  return authRequest('/commerce/checkout', {
    method: 'POST',
    body: {
      voucher_code: voucher_code || undefined,
      payment_method,
      course_ids: course_ids ? course_ids.map(Number) : undefined,
    },
  });
}

export async function apiGetMyOrders() {
  return authRequest('/commerce/orders');
}

/* ================= HỌC TẬP (LEARNING) ================= */

export async function apiGetMyCourses() {
  return authRequest('/learning/my-courses');
}

export async function apiUpdateLessonProgress(courseId, lessonId, { is_completed, current_position_seconds }) {
  return authRequest(`/learning/courses/${courseId}/lessons/${lessonId}/progress`, {
    method: 'PUT',
    body: {
      is_completed: Boolean(is_completed),
      current_position_seconds: Number(current_position_seconds || 0),
    },
  });
}

export async function apiGetLessonNotes(lessonId) {
  return authRequest(`/learning/lessons/${lessonId}/notes`);
}

export async function apiCreateLessonNote(lessonId, content) {
  return authRequest(`/learning/lessons/${lessonId}/notes`, {
    method: 'POST',
    body: { content },
  });
}

export async function apiDeleteLessonNote(noteId) {
  return authRequest(`/learning/notes/${noteId}`, {
    method: 'DELETE',
  });
}

/* ================= QUẢN TRỊ VIÊN (ADMIN) ================= */

export async function apiAdminGetUsers() {
  return authRequest('/admin/users');
}

export async function apiAdminUpdateUserStatus(userId, is_active) {
  return authRequest(`/admin/users/${userId}/status`, {
    method: 'PUT',
    body: { is_active },
  });
}

export async function apiAdminGetOrders() {
  return authRequest('/commerce/admin/orders');
}

export async function apiAdminGetTopups() {
  return authRequest('/commerce/admin/topups');
}

export async function apiAdminConfirmTopup(topupId, { approved = true, note = '' }) {
  return authRequest(`/commerce/admin/topups/${topupId}/confirm`, {
    method: 'POST',
    body: { approved, note },
  });
}

export async function apiAdminCreateCourse(courseData) {
  return authRequest('/courses', {
    method: 'POST',
    body: courseData,
  });
}

export async function apiAdminUpdateCourse(courseId, courseData) {
  return authRequest(`/courses/${courseId}`, {
    method: 'PUT',
    body: courseData,
  });
}

export async function apiAdminDeleteCourse(courseId) {
  return authRequest(`/courses/${courseId}`, {
    method: 'DELETE',
  });
}
