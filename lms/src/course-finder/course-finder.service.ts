import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Course, CourseStatus } from '../course/course.entity.js';
import { RecommendationRequestDto } from './dto/recommendation-request.dto.js';
import { INITIAL_TRIALS } from '../trial/trial.service.js';

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
        { value: 'FOUNDATION', label: 'Làm quen tư duy lập trình từ con số 0 (Nền tảng / Nhập môn)', icon: 'bi-stars' },
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
    const hours = Number(dto.hoursPerWeek || 0);

    const recommendations: any[] = [];

    allCourses.forEach((c) => {
      let score = 0;
      const reasons: string[] = [];
      const missingPrerequisites: string[] = [];

      const titleLower = (c.title || '').toLowerCase();
      const descLower = (c.description || '').toLowerCase();
      const catLower = (c.category?.category_name || (c.category as any)?.name || '').toLowerCase();
      const textCorpus = `${titleLower} ${descLower} ${catLower}`;

      // 1. Phù hợp mục tiêu học tập (Dựa trên metadata và phân loại thật của khóa học)
      if (goal === 'FRONTEND') {
        if (textCorpus.includes('react') || textCorpus.includes('frontend') || textCorpus.includes('next') || textCorpus.includes('ui')) {
          score += 50;
          reasons.push('Khóa học trực tiếp giải quyết mục tiêu xây dựng giao diện người dùng hiện đại với React/Next.js');
        }
      } else if (goal === 'BACKEND') {
        if (textCorpus.includes('nest') || textCorpus.includes('backend') || textCorpus.includes('sql') || textCorpus.includes('api')) {
          score += 50;
          reasons.push('Đào tạo trực tiếp kỹ năng thiết kế RESTful API, cơ sở dữ liệu và kiến trúc Clean Architecture');
        }
      } else if (goal === 'AI') {
        if (textCorpus.includes('python') || textCorpus.includes('ai') || textCorpus.includes('data') || textCorpus.includes('machine learning')) {
          score += 50;
          reasons.push('Tập trung vào phân tích dữ liệu, Machine Learning và kỹ thuật ứng dụng AI hiện đại');
        }
      } else if (goal === 'FOUNDATION') {
        if (c.level === 'Beginner' || textCorpus.includes('cơ bản') || textCorpus.includes('nhập môn') || textCorpus.includes('foundation') || textCorpus.includes('react')) {
          score += 45;
          reasons.push('Nội dung phù hợp cho người mới bắt đầu làm quen tư duy lập trình và xây dựng nền tảng vững chắc');
        }
      }

      // 2. Kiểm tra điều kiện tiên quyết (Prerequisites) dựa trên kỹ năng đầu vào
      if (textCorpus.includes('react') || textCorpus.includes('frontend')) {
        if (knownSkills.includes('HTML_CSS') || knownSkills.includes('JAVASCRIPT')) {
          score += 25;
          reasons.push('Bạn đã có nền tảng HTML/CSS hoặc JS, rất thuận lợi để tiếp thu nhanh React 19');
        } else if (knownSkills.includes('ZERO')) {
          missingPrerequisites.push('Cần bổ sung kiến thức cú pháp HTML/CSS cơ bản trong module đầu tiên');
        }
      } else if (textCorpus.includes('nest') || textCorpus.includes('backend')) {
        if (knownSkills.includes('JAVASCRIPT') || knownSkills.includes('SQL')) {
          score += 25;
          reasons.push('Kiến thức JavaScript hoặc SQL của bạn sẵn sàng để học TypeScript & NestJS');
        } else if (knownSkills.includes('ZERO')) {
          missingPrerequisites.push('Nên nắm vững JavaScript ES6+ trước khi học kiến trúc NestJS');
        }
      } else if (textCorpus.includes('python') || textCorpus.includes('ai')) {
        if (knownSkills.includes('PYTHON') || knownSkills.includes('ZERO')) {
          score += 20;
          reasons.push('Giáo trình có module nhập môn Python từ số 0 cho người chưa biết gì');
        }
      }

      // 3. Phù hợp ngân sách dự kiến (Budget Matching)
      if (budget > 0) {
        if (c.price <= budget) {
          score += 15;
          reasons.push(`Học phí (${Number(c.price).toLocaleString('vi-VN')} đ) nằm trong khoảng ngân sách dự kiến của bạn`);
        } else {
          score -= 10;
        }
      }

      // 4. Tư vấn thời lượng học theo quỹ thời gian
      if (hours > 0) {
        if (hours <= 5) {
          reasons.push('Lộ trình được chia nhỏ thành các bài giảng 8-15 phút, phù hợp học tranh thủ 3-5 giờ/tuần');
        } else if (hours >= 10) {
          reasons.push('Với trên 10 giờ/tuần, bạn có thể hoàn thành trọn vẹn lộ trình và bài tập dự án trong vòng 3-4 tuần');
        }
      }

      // Kiểm tra sự tồn tại của bài học thử tương tác thật
      const canTry = INITIAL_TRIALS.some((t) => t.course_id === c.course_id);

      // Giá cũ: chỉ hiển thị nếu trong DB có old_price lớn hơn price thật (không tự nhân 1.3)
      const realOldPrice = (c as any).old_price && (c as any).old_price > c.price ? (c as any).old_price : null;

      if (score >= 30) {
        recommendations.push({
          score,
          course: {
            course_id: c.course_id,
            title: c.title,
            slug: c.slug,
            description: c.description,
            price: c.price,
            old_price: realOldPrice,
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
