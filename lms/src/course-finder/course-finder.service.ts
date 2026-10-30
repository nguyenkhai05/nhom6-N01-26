import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Course, CourseStatus } from '../course/course.entity.js';
import { RecommendationRequestDto } from './dto/recommendation-request.dto.js';

export const FINDER_QUESTIONS_CONFIG = {
  ruleVersion: 'finder-1',
  questions: [
    {
      id: 'goal',
      title: 'Mục tiêu học tập chính của bạn là gì?',
      required: true,
      options: [
        { value: 'FRONTEND', label: 'Phát triển giao diện Web (Frontend / React / UI)', icon: 'bi-window-sidebar' },
        { value: 'BACKEND', label: 'Xây dựng hệ thống máy chủ & API (Backend / NestJS / SQL)', icon: 'bi-hdd-network' },
        { value: 'AI', label: 'Phân tích dữ liệu & Trí tuệ nhân tạo (Python AI / Machine Learning)', icon: 'bi-cpu' },
        { value: 'FOUNDATION', label: 'Làm quen tư duy lập trình từ con số 0 (Mobile / Database)', icon: 'bi-stars' },
      ],
    },
    {
      id: 'knownSkills',
      title: 'Nền tảng kỹ năng hiện tại của bạn?',
      required: false,
      isMultiple: true,
      options: [
        { value: 'ZERO', label: 'Chưa có kiến thức lập trình (Bắt đầu từ số 0)' },
        { value: 'HTML_CSS', label: 'Đã biết HTML5 / CSS3 cơ bản' },
        { value: 'JAVASCRIPT', label: 'Đã biết JavaScript căn bản (Biến, Mảng, Hàm)' },
        { value: 'PYTHON', label: 'Đã biết cú pháp Python cơ bản' },
        { value: 'SQL', label: 'Đã biết viết câu lệnh SELECT / JOIN trong SQL' },
      ],
    },
    {
      id: 'budgetMaxVnd',
      title: 'Khoảng ngân sách dự kiến của bạn cho một khóa học?',
      required: false,
      options: [
        { value: 500000, label: 'Dưới 500.000 đ (Tiết kiệm)' },
        { value: 900000, label: 'Từ 500.000 đ - 900.000 đ (Phổ biến)' },
        { value: 1500000, label: 'Từ 900.000 đ - 1.500.000 đ (Chuyên sâu)' },
        { value: 0, label: 'Chưa xác định (Xem tất cả)' },
      ],
    },
    {
      id: 'hoursPerWeek',
      title: 'Quỹ thời gian bạn có thể dành để học mỗi tuần?',
      required: false,
      options: [
        { value: 4, label: 'Khoảng 3 - 5 giờ / tuần (Học tranh thủ buổi tối)' },
        { value: 8, label: 'Khoảng 6 - 10 giờ / tuần (Tiến độ tiêu chuẩn)' },
        { value: 15, label: 'Trên 10 giờ / tuần (Tập trung toàn thời gian / Bootcamp)' },
      ],
    },
  ],
};

@Injectable()
export class CourseFinderService {
  constructor(
    @Inject('COURSE_REPOSITORY')
    private readonly courseRepo: Repository<Course>,
  ) {}

  getConfig() {
    return FINDER_QUESTIONS_CONFIG;
  }

  async getRecommendations(dto: RecommendationRequestDto): Promise<any> {
    const allCourses = await this.courseRepo.find({
      where: { status: CourseStatus.PUBLISHED },
      relations: { category: true, instructor: true },
    });

    const goal = (dto.goal || 'FRONTEND').toUpperCase();
    const knownSkills = (dto.knownSkills || []).map((s) => s.toUpperCase());
    const budget = Number(dto.budgetMaxVnd || 0);

    // Bảng quy tắc phân tích theo mục tiêu
    const recommendations: any[] = [];

    allCourses.forEach((c) => {
      let score = 0;
      const reasons: string[] = [];
      const missingPrerequisites: string[] = [];

      // 1. Phù hợp mục tiêu
      if (goal === 'FRONTEND') {
        if (c.course_id === 1 || c.course_id === 8) {
          score += 50;
          reasons.push('Khóa học trực tiếp giải quyết mục tiêu xây dựng giao diện người dùng hiện đại với React/Next.js');
        }
      } else if (goal === 'BACKEND') {
        if (c.course_id === 2 || c.course_id === 7 || c.course_id === 3) {
          score += 50;
          reasons.push('Đào tạo trực tiếp kỹ năng thiết kế RESTful API, cơ sở dữ liệu và kiến trúc Clean Architecture');
        }
      } else if (goal === 'AI') {
        if (c.course_id === 4 || c.course_id === 9) {
          score += 50;
          reasons.push('Tập trung vào phân tích dữ liệu, Machine Learning và kỹ thuật Prompt Engineering với LLMs');
        }
      } else if (goal === 'FOUNDATION') {
        if (c.course_id === 1 || c.course_id === 3 || c.course_id === 6) {
          score += 40;
          reasons.push('Nội dung phù hợp cho người mới bắt đầu làm quen tư duy lập trình và xây dựng nền tảng vững chắc');
        }
      }

      // 2. Phù hợp kỹ năng đầu vào (Prerequisites)
      if (c.course_id === 1) { // React
        if (knownSkills.includes('HTML_CSS') || knownSkills.includes('JAVASCRIPT')) {
          score += 25;
          reasons.push('Bạn đã có nền tảng HTML/CSS hoặc JS, rất thuận lợi để tiếp thu nhanh React 19');
        } else if (knownSkills.includes('ZERO')) {
          missingPrerequisites.push('Cần bổ sung kiến thức cú pháp HTML/CSS cơ bản trong module đầu tiên');
        }
      } else if (c.course_id === 2) { // NestJS
        if (knownSkills.includes('JAVASCRIPT')) {
          score += 25;
          reasons.push('Kiến thức JavaScript của bạn sẵn sàng để học TypeScript & NestJS');
        } else {
          missingPrerequisites.push('Nên nắm vững JavaScript ES6+ trước khi học kiến trúc NestJS');
        }
      } else if (c.course_id === 4) { // Python AI
        if (knownSkills.includes('PYTHON') || knownSkills.includes('ZERO')) {
          score += 20;
          reasons.push('Giáo trình có module nhập môn Python từ số 0 cho người chưa biết gì');
        }
      }

      // 3. Phù hợp ngân sách
      if (budget > 0) {
        if (c.price <= budget) {
          score += 15;
          reasons.push(`Học phí (${Number(c.price).toLocaleString('vi-VN')} đ) nằm trong khoảng ngân sách dự kiến của bạn`);
        } else {
          score -= 10;
        }
      }

      // Có bài học thử đại diện
      const canTry = [1, 2, 4, 5].includes(c.course_id);

      if (score >= 30) {
        recommendations.push({
          score,
          course: {
            course_id: c.course_id,
            title: c.title,
            slug: c.slug,
            description: c.description,
            price: c.price,
            old_price: (c as any).old_price || Math.round(c.price * 1.3),
            level: c.level,
            thumbnail_url: c.thumbnail_url,
            category_name: c.category?.category_name || (c.category as any)?.name || 'Lập trình',
            instructor_name: c.instructor?.full_name || 'EduViet Specialist',
          },
          reasons,
          missingPrerequisites,
          canTry,
        });
      }
    });

    // Sắp xếp theo điểm phù hợp giảm dần và lấy tối đa 3 khóa
    recommendations.sort((a, b) => b.score - a.score);
    const top3 = recommendations.slice(0, 3);

    return {
      ruleVersion: 'finder-1',
      items: top3,
      notice:
        top3.length > 0
          ? 'Gợi ý dựa trên thông tin khảo sát thực tế; bạn nên trải nghiệm bài học thử trước khi đưa ra quyết định đăng ký.'
          : 'Hiện tại chưa có khóa học hoàn toàn khớp với toàn bộ tiêu chí nghiêm ngặt của bạn. Bạn hãy thử nới lỏng ngân sách hoặc thay đổi mục tiêu học tập.',
    };
  }
}
