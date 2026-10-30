import { API_URL } from './api';
import { getToken, clearToken } from './auth';

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
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
}

function toQueryString(params = {}) {
  const filtered = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== '' && v !== 'undefined'
  );
  if (filtered.length === 0) return '';
  return `?${new URLSearchParams(filtered).toString()}`;
}

// 1. Combo Ưu Đãi (Bundles)
export const getBundles = () => request('/bundles');
export const getBundle = (id) => request(`/bundles/${id}`);
export const getBundleQuote = (id) => request(`/bundles/${id}/quote`, { method: 'POST' });
export const checkoutBundle = (id) => request(`/bundles/${id}/checkout`, { method: 'POST' });

// 2. Dự Án Thực Tế (Projects)
export const getProjects = () => request('/projects');
export const getProject = (id) => request(`/projects/${id}`);
export const getMyProjectSubmission = (id) => request(`/projects/${id}/my-submission`);
export const saveProjectSubmission = (id, body) => request(`/projects/${id}/submissions`, { method: 'POST', body: JSON.stringify(body) });
export const getProjectShowcase = () => request('/projects/showcase');

// 3. Trung Tâm Luyện Tập (Practice)
export const getPracticeExercises = (query = {}) => {
  return request(`/practice/exercises${toQueryString(query)}`);
};
export const getPracticeExercise = (id) => request(`/practice/exercises/${id}`);
export const getSkillAssessments = () => request('/practice/assessments');
export const getSkillAssessment = (id) => request(`/practice/assessments/${id}`);
export const submitSkillAssessment = (id, answers) => request(`/practice/assessments/${id}/submit`, { method: 'POST', body: JSON.stringify({ answers }) });
export const getWeeklyChallenge = () => request('/practice/challenges/weekly');

// 4. Cộng Đồng Học Viên (Community)
export const getCommunityPosts = (query = {}) => {
  return request(`/community/posts${toQueryString(query)}`);
};
export const getCommunityPost = (id) => request(`/community/posts/${id}`);
export const createCommunityPost = (body) => request('/community/posts', { method: 'POST', body: JSON.stringify(body) });
export const createCommunityReply = (postId, content) => request(`/community/posts/${postId}/replies`, { method: 'POST', body: JSON.stringify({ content }) });
export const acceptCommunityReply = (postId, replyId) => request(`/community/posts/${postId}/accept-reply`, { method: 'POST', body: JSON.stringify({ reply_id: replyId }) });
export const reportContent = (body) => request('/community/reports', { method: 'POST', body: JSON.stringify(body) });

// 5. Bài Viết & Cẩm Nang Công Nghệ (Articles)
export const getArticles = (query = {}) => {
  return request(`/articles${toQueryString(query)}`);
};
export const getArticle = (idOrSlug) => request(`/articles/${idOrSlug}`);
export const likeArticle = (id) => request(`/articles/${id}/like`, { method: 'POST' });

// 6. So Sánh Khóa Học (Course Comparison)
export const compareCourses = (ids) => {
  const idsStr = Array.isArray(ids) ? ids.join(',') : ids;
  return request(`/courses/compare?ids=${encodeURIComponent(idsStr)}`);
};

// 7. Bộ Chọn Khóa Phù Hợp (Course Finder)
export const getCourseFinderConfig = () => request('/course-finder/config');
export const getCourseRecommendations = (body) =>
  request('/course-finder/recommendations', { method: 'POST', body: JSON.stringify(body) });

// 8. Học Thử Tương Tác (Interactive Trials - Codecademy Inspired)
export const getTrials = () => request('/trials');
export const getTrial = (id) => request(`/trials/${id}`);
export const getTrialSolution = (id) => request(`/trials/${id}/solution`);

// 9. Trung Tâm Hỗ Trợ & FAQ (Help Center)
export const getFaq = () => request('/help/faq');
export const getMySupportRequests = () => request('/help/requests/my');
export const createSupportRequest = (body) =>
  request('/help/requests', { method: 'POST', body: JSON.stringify(body) });

// 10. Tiến Độ & Khóa Học Của Tôi (Learning Dashboard)
export const getMyCourses = () => request('/learning/my-courses');

