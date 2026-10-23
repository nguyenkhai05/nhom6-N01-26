export const LEVELS = [
  { value: 'Beginner', label: 'Cơ bản', hint: 'Dành cho người mới bắt đầu' },
  { value: 'Intermediate', label: 'Trung cấp', hint: 'Đã có nền tảng lập trình' },
  { value: 'Advanced', label: 'Nâng cao', hint: 'Chuyên sâu, hệ thống lớn' },
];

export const levelLabel = (value) => LEVELS.find((l) => l.value === value)?.label ?? value ?? 'Cơ bản';

export const formatVnd = (n) => `${Number(n || 0).toLocaleString('vi-VN')} ₫`;

export const FALLBACK_IMG = 'https://placehold.co/600x400/e2e8f0/475569?text=EduViet';

// Khi API lỗi vẫn dựng được danh mục từ dữ liệu khóa học đang có.
export function resolveCategories(categories, courses) {
  if (categories?.length) return categories;
  const names = [...new Set(courses.map((c) => c.category?.name).filter(Boolean))];
  return names.map((name, i) => ({ id: i + 1, name, order: i }));
}

export const coursesOfCategory = (courses, name) => courses.filter((c) => c.category?.name === name);
