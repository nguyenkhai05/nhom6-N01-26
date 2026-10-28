const baseUrl = (process.env.API_BASE_URL || 'http://localhost:3000').replace(/\/$/, '');

async function getJson(path) {
  const response = await fetch(`${baseUrl}${path}`);
  const body = await response.text();
  let data;
  try {
    data = body ? JSON.parse(body) : null;
  } catch {
    throw new Error(`${path}: phản hồi không phải JSON (HTTP ${response.status}).`);
  }
  if (!response.ok) {
    throw new Error(`${path}: HTTP ${response.status} — ${body.slice(0, 250)}`);
  }
  return data;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

try {
  console.log(`Kiểm tra API tại ${baseUrl}`);

  const courses = await getJson('/courses');
  assert(Array.isArray(courses), 'GET /courses phải trả về một mảng.');
  assert(courses.length > 0, 'GET /courses không có dữ liệu. Hãy kiểm tra lms_db.sql và kết nối MySQL.');
  console.log(`✓ GET /courses: ${courses.length} khóa học`);

  const firstCourse = courses[0];
  assert(firstCourse.course_id != null, 'Khóa học thiếu course_id.');
  assert(firstCourse.category && firstCourse.category.category_name, 'Khóa học chưa có quan hệ category.');
  assert(firstCourse.instructor && firstCourse.instructor.full_name, 'Khóa học chưa có quan hệ instructor.');

  const detail = await getJson(`/courses/${firstCourse.course_id}`);
  assert(Number(detail.course_id) === Number(firstCourse.course_id), 'GET /courses/:id trả về sai khóa học.');
  assert(detail.title, 'Chi tiết khóa học thiếu title.');
  assert(detail.category?.category_name, 'Chi tiết khóa học thiếu tên danh mục.');
  assert(detail.instructor?.full_name, 'Chi tiết khóa học thiếu tên giảng viên.');
  console.log(`✓ GET /courses/${firstCourse.course_id}: ${detail.title}`);

  const categories = await getJson('/categories');
  assert(Array.isArray(categories), 'GET /categories phải trả về một mảng.');
  assert(categories.length > 0, 'GET /categories không có dữ liệu.');
  console.log(`✓ GET /categories: ${categories.length} danh mục`);
  console.log('\nTHÀNH CÔNG: các API chính trả về JSON và có dữ liệu liên kết.');
} catch (error) {
  console.error(`\nTHẤT BẠI: ${error.message}`);
  console.error('Đảm bảo MySQL đã chạy, lms_db.sql đã được import, lms/.env đã cấu hình và backend đang chạy với DEMO_MODE=false.');
  process.exitCode = 1;
}
