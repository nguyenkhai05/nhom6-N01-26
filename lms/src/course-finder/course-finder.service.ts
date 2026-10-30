import { Injectable, Inject, BadRequestException } from '@nestjs/common';
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
        { value: 'AI', label: 'Phân tích dữ liệu & Trí tuệ nhân tạo (Python AI / Data)', icon: 'bi-cpu' },
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
        { value: 'UNSURE', label: 'Chưa chắc chắn / Cần đánh giá thêm' },
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
        { value: 0, label: 'Chưa xác định (Xem tất cả các khóa)' },
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
    const rawSkills = dto.knownSkills || [];
    const knownSkills = rawSkills.map((s) => s.toUpperCase());
    const budget = Number(dto.budgetMaxVnd || 0);
    const budgetMode = dto.budgetMode || (budget > 0 ? 'FLEXIBLE' : 'UNKNOWN');
    const hours = Number(dto.hoursPerWeek || 0);

    const items: any[] = [];
    const needsPreparation: any[] = [];

    // Metadata điều kiện tiên quyết và thời lượng chuẩn
    const COURSE_PREREQUISITES: Record<number, { required: string[]; recommended: string[]; workloadHours: number }> = {
      1: { required: ['HTML_CSS', 'JAVASCRIPT'], recommended: [], workloadHours: 52 },
      2: { required: ['JAVASCRIPT'], recommended: ['SQL'], workloadHours: 48 },
      3: { required: [], recommended: [], workloadHours: 36 },
      4: { required: [], recommended: ['PYTHON'], workloadHours: 42 },
      5: { required: ['JAVASCRIPT'], recommended: [], workloadHours: 35 },
      6: { required: [], recommended: [], workloadHours: 40 },
    };

    allCourses.forEach((c) => {
      let goalMatch = 0; // G in [0, 1]
      const reasons: string[] = [];
      const missingPrerequisites: string[] = [];

      const titleLower = (c.title || '').toLowerCase();
      const descLower = (c.description || '').toLowerCase();
      const catLower = (c.category?.category_name || (c.category as any)?.name || '').toLowerCase();
      const textCorpus = `${titleLower} ${descLower} ${catLower}`;

      // 1. Phù hợp mục tiêu học tập (Goal Match G in [0, 1])
      if (goal === 'FRONTEND') {
        if (textCorpus.includes('react') || textCorpus.includes('frontend') || textCorpus.includes('next') || textCorpus.includes('ui')) {
          goalMatch = 1.0;
          reasons.push('Khóa học trực tiếp giải quyết mục tiêu phát triển giao diện người dùng hiện đại với React/Next.js');
        } else if (textCorpus.includes('javascript') || textCorpus.includes('web')) {
          goalMatch = 0.6;
        }
      } else if (goal === 'BACKEND') {
        if (textCorpus.includes('nest') || textCorpus.includes('backend') || textCorpus.includes('sql') || textCorpus.includes('api')) {
          goalMatch = 1.0;
          reasons.push('Đào tạo trực tiếp kỹ năng thiết kế RESTful API, cơ sở dữ liệu và kiến trúc Clean Architecture');
        } else if (textCorpus.includes('node') || textCorpus.includes('database')) {
          goalMatch = 0.6;
        }
      } else if (goal === 'AI') {
        if (textCorpus.includes('python') || textCorpus.includes('ai') || textCorpus.includes('data') || textCorpus.includes('machine learning')) {
          goalMatch = 1.0;
          reasons.push('Tập trung vào phân tích dữ liệu, Machine Learning và kỹ thuật ứng dụng AI hiện đại');
        }
      } else if (goal === 'FOUNDATION') {
        if (c.level === 'Beginner' || textCorpus.includes('cơ bản') || textCorpus.includes('nhập môn') || textCorpus.includes('foundation') || textCorpus.includes('react')) {
          goalMatch = 0.9;
          reasons.push('Nội dung phù hợp cho người mới bắt đầu làm quen tư duy lập trình và xây dựng nền tảng vững chắc');
        }
      }

      if (goalMatch === 0) return; // Không khớp mục tiêu

      // 2. Phân loại Readiness (P: 1.0, 0.5, 0.0)
      const prereqDef = COURSE_PREREQUISITES[c.course_id] || { required: [], recommended: [], workloadHours: 40 };
      let readiness: 'READY' | 'CHECK_PREREQUISITES' | 'NEEDS_FOUNDATION' = 'READY';
      let pScore = 1.0;

      if (knownSkills.includes('UNSURE')) {
        readiness = 'CHECK_PREREQUISITES';
        pScore = 0.5;
        reasons.push('Bạn đã chọn Chưa chắc chắn nền tảng; khuyến nghị làm bài học thử để tự kiểm tra năng lực');
      } else if (knownSkills.includes('ZERO')) {
        if (prereqDef.required.length > 0) {
          readiness = 'NEEDS_FOUNDATION';
          pScore = 0.0;
          prereqDef.required.forEach((r) => missingPrerequisites.push(`Cần trang bị kỹ năng ${r} trước khi học khóa này`));
        } else {
          readiness = 'READY';
          pScore = 1.0;
          reasons.push('Khóa học thiết kế nhập môn, không yêu cầu kiến thức lập trình từ trước');
        }
      } else {
        // Kiểm tra xem đã đáp ứng đủ required skills chưa
        const missing = prereqDef.required.filter((r) => !knownSkills.includes(r));
        if (missing.length > 0) {
          readiness = 'NEEDS_FOUNDATION';
          pScore = 0.0;
          missing.forEach((m) => missingPrerequisites.push(`Cần bổ sung kiến thức ${m}`));
        } else {
          readiness = 'READY';
          pScore = 1.0;
          reasons.push('Bạn đã đáp ứng toàn bộ kỹ năng tiên quyết yêu cầu của khóa học này');
        }
      }

      // 3. Phù hợp ngân sách (Budget B in [0, 1])
      let bScore = 0.5;
      const coursePrice = Number(c.price) || 0;

      if (budgetMode === 'UNKNOWN' || budget === 0) {
        bScore = 0.5;
      } else if (coursePrice <= budget) {
        bScore = 1.0;
        reasons.push(`Học phí (${coursePrice.toLocaleString('vi-VN')} đ) nằm trong khoảng ngân sách dự kiến của bạn`);
      } else {
        if (budgetMode === 'STRICT') {
          return; // Loại bỏ hoàn toàn khỏi kết quả nếu chọn STRICT
        }
        bScore = Math.min(1.0, Math.max(0.1, budget / coursePrice));
        reasons.push(`Học phí (${coursePrice.toLocaleString('vi-VN')} đ) vượt mức ngân sách dự kiến (Cần cân nhắc thêm)`);
      }

      // 4. Ước lượng tiến độ theo quỹ thời gian
      let estimatedWeeks: number | null = null;
      if (hours > 0 && prereqDef.workloadHours > 0) {
        estimatedWeeks = Math.ceil(prereqDef.workloadHours / hours);
        reasons.push(`Ước tính lộ trình khoảng ~${estimatedWeeks} tuần với quỹ thời gian ${hours} giờ/tuần`);
      }

      // Tính tổng điểm xếp hạng theo công thức đặc tả (Section 3.4)
      const totalScore = Math.round(60 * goalMatch + 30 * pScore + 10 * bScore);

      // Kiểm tra có bài học thử tương tác thật hay không
      const matchedTrial = INITIAL_TRIALS.find((t) => t.course_id === c.course_id);
      const canTry = !!matchedTrial;
      const previewTrialId = matchedTrial ? matchedTrial.trial_id : null;

      // Giá cũ thật: chỉ lấy nếu DB có và lớn hơn giá thật
      const realOldPrice = (c as any).old_price && (c as any).old_price > c.price ? (c as any).old_price : null;

      const recItem = {
        score: totalScore,
        rankingScore: totalScore,
        readiness,
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
        estimatedWeeks,
        previewTrialId,
        canTry,
        owned: false,
      };

      items.push(recItem);
      if (readiness === 'NEEDS_FOUNDATION') {
        needsPreparation.push(recItem);
      }
    });

    // Sắp xếp items theo score giảm dần, sau đó theo course_id tăng dần
    items.sort((a, b) => b.score - a.score || a.course.course_id - b.course.course_id);
    needsPreparation.sort((a, b) => b.score - a.score);

    const top3 = items.slice(0, 3);

    let notice = 'Gợi ý dựa trên thông tin khảo sát thực tế; bạn nên trải nghiệm bài học thử trước khi đưa ra quyết định đăng ký.';
    if (top3.length === 0) {
      notice = 'Hiện tại chưa có khóa học khớp hoàn toàn với ngân sách hoặc tiêu chí của bạn. Bạn hãy thử nới lỏng ngân sách hoặc chọn lại mục tiêu học tập.';
    }

    return {
      ruleVersion: 'finder-1',
      items: top3,
      needsPreparation: needsPreparation.slice(0, 2),
      notice,
    };
  }
}
