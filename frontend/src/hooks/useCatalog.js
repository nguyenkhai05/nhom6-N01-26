import { useEffect, useState } from 'react';
import { getCategories, getCourses } from '../services/api';

// Tải danh sách khóa học + danh mục từ backend một lần khi mở trang.
// status: 'loading' | 'ready' | 'error'
export default function useCatalog() {
  const [state, setState] = useState({ status: 'loading', courses: [], categories: [] });

  useEffect(() => {
    const controller = new AbortController();
    const opts = { signal: controller.signal };
    Promise.all([getCourses({}, opts), getCategories(opts)])
      .then(([courses, categories]) => setState({ status: 'ready', courses, categories }))
      .catch((err) => {
        if (err.name !== 'AbortError') setState((s) => ({ ...s, status: 'error' }));
      });
    return () => controller.abort();
  }, []);

  return state;
}
