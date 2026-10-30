// Dịch vụ gọi API backend NestJS (lms/). Đổi địa chỉ bằng biến VITE_API_URL trong frontend/.env
export const API_URL = import.meta.env.VITE_API_URL ?? '';

async function request(path, { signal } = {}) {
  const res = await fetch(`${API_URL}${path}`, { signal });
  if (!res.ok) throw new Error(`API ${path} trả về lỗi ${res.status}`);
  return res.json();
}

// Backend trả category.category_name / instructor.full_name,
// còn giao diện hiện tại dùng category.name / instructor.name → quy về một dạng.
export function normalizeCourse(c) {
  return {
    ...c,
    price: Number(c.price) || 0,
    category: c.category ? { id: c.category.category_id, name: c.category.category_name } : null,
    instructor: c.instructor ? { id: c.instructor.user_id, name: c.instructor.full_name } : null,
  };
}

export async function getCourses(params = {}, opts) {
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null)
  ).toString();
  const data = await request(`/courses${qs ? `?${qs}` : ''}`, opts);
  return data.map(normalizeCourse);
}

export async function getCourse(id, opts) {
  return normalizeCourse(await request(`/courses/${id}`, opts));
}

export async function getCategories(opts) {
  const data = await request('/categories', opts);
  return data
    .map((c) => ({ id: c.category_id, name: c.category_name, order: c.order_index ?? 0 }))
    .sort((a, b) => a.order - b.order);
}
