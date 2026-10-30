import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { PracticeExercise } from './entities/practice-exercise.entity.js';
import { SkillAssessment } from './entities/skill-assessment.entity.js';

export const INITIAL_EXERCISES: any[] = [
  {
    exercise_id: 1,
    title: 'Đảo Ngược Chuỗi Bằng Kỹ Thuật Hai Con Trỏ (Two Pointers)',
    skill: 'JavaScript',
    difficulty: 'Beginner',
    description: 'Viết hàm `reverseString(str)` nhận vào một chuỗi ký tự và trả về chuỗi đó được đảo ngược thứ tự các ký tự mà không dùng hàm `reverse()` có sẵn.',
    initial_code: 'function reverseString(str) {\n  // Viết mã nguồn của bạn tại đây\n  \n}\n\n// Ví dụ kiểm thử\nconsole.log(reverseString("eduviet")); // Kết quả kỳ vọng: "teivude"',
    solution_code: 'function reverseString(str) {\n  const chars = str.split("");\n  let left = 0;\n  let right = chars.length - 1;\n  while (left < right) {\n    const temp = chars[left];\n    chars[left] = chars[right];\n    chars[right] = temp;\n    left++;\n    right--;\n  }\n  return chars.join("");\n}',
    test_cases: [
      { input: '"hello"', expected_output: '"olleh"', description: 'Đảo ngược từ đơn' },
      { input: '"eduviet"', expected_output: '"teivude"', description: 'Đảo ngược tên nền tảng' },
      { input: '"a"', expected_output: '"a"', description: 'Chuỗi 1 ký tự' },
    ],
    hint: 'Sử dụng hai con trỏ `left = 0` và `right = length - 1`, hoán đổi ký tự cho nhau và tiến dần vào giữa.',
  },
  {
    exercise_id: 2,
    title: 'Xây Dựng Custom Hook useDebounce Trong React 19',
    skill: 'React',
    difficulty: 'Intermediate',
    description: 'Viết một Custom Hook `useDebounce(value, delay)` nhận vào giá trị `value` và độ trễ `delay` (ms), chỉ cập nhật và trả về giá trị mới sau khi người dùng ngừng gõ phím đủ thời gian quy định.',
    initial_code: 'function useDebounce(value, delay = 500) {\n  // Sử dụng useState và useEffect\n  \n}\n\n// Kiểm thử mô phỏng\nconsole.log("Hook đã sẵn sàng để kiểm thử");',
    solution_code: 'function useDebounce(value, delay = 500) {\n  const [debouncedValue, setDebouncedValue] = React.useState(value);\n  React.useEffect(() => {\n    const handler = setTimeout(() => {\n      setDebouncedValue(value);\n    }, delay);\n    return () => clearTimeout(handler);\n  }, [value, delay]);\n  return debouncedValue;\n}',
    test_cases: [
      { input: 'debounce logic', expected_output: 'clean timeout', description: 'Clear timeout khi component unmount' },
    ],
    hint: 'Trong hàm cleanup của `useEffect`, đừng quên gọi `clearTimeout(timer)` để hủy timer cũ trước khi kích hoạt timer mới.',
  },
  {
    exercise_id: 3,
    title: 'Truy Vấn Top 3 Khóa Học Có Doanh Thu Cao Nhất Trong Năm',
    skill: 'SQL',
    difficulty: 'Intermediate',
    description: 'Viết câu lệnh SQL truy vấn danh sách 3 khóa học đạt tổng doanh thu cao nhất từ bảng `orders` và `order_items` trong năm 2026, nhóm theo khóa học và sắp xếp giảm dần.',
    initial_code: 'SELECT c.title, SUM(oi.price) AS total_revenue\nFROM courses c\nJOIN order_items oi ON c.course_id = oi.course_id\n-- Bổ sung điều kiện JOIN và GROUP BY tại đây\n;',
    solution_code: 'SELECT c.title, SUM(oi.price) AS total_revenue\nFROM courses c\nJOIN order_items oi ON c.course_id = oi.course_id\nJOIN orders o ON oi.order_id = o.order_id\nWHERE o.status = "PAID" AND YEAR(o.paid_at) = 2026\nGROUP BY c.course_id, c.title\nORDER BY total_revenue DESC\nLIMIT 3;',
    test_cases: [
      { input: 'group by course_id', expected_output: 'top 3 rows', description: 'Đúng top 3 doanh thu cao nhất' },
    ],
    hint: 'Nhớ lọc `orders.status = "PAID"` để chỉ tính các đơn hàng đã thanh toán thành công.',
  },
  {
    exercise_id: 4,
    title: 'Thuật Toán Hợp Nhất Các Khoảng Thời Gian (Merge Intervals)',
    skill: 'Algorithm',
    difficulty: 'Advanced',
    description: 'Cho mảng các khoảng thời gian `intervals`, hãy hợp nhất tất cả các khoảng giao nhau hoặc kề nhau thành danh sách các khoảng tối giản.',
    initial_code: 'function mergeIntervals(intervals) {\n  // Trả về danh sách khoảng đã hợp nhất\n  \n}\n\n// Ví dụ: [[1, 3], [2, 6], [8, 10], [15, 18]] => [[1, 6], [8, 10], [15, 18]]',
    solution_code: 'function mergeIntervals(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const result = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const current = intervals[i];\n    const last = result[result.length - 1];\n    if (current[0] <= last[1]) {\n      last[1] = Math.max(last[1], current[1]);\n    } else {\n      result.push(current);\n    }\n  }\n  return result;\n}',
    test_cases: [
      { input: '[[1,3],[2,6],[8,10]]', expected_output: '[[1,6],[8,10]]', description: 'Khoảng giao nhau' },
      { input: '[[1,4],[4,5]]', expected_output: '[[1,5]]', description: 'Khoảng chạm biên' },
    ],
    hint: 'Sắp xếp mảng theo thời điểm bắt đầu `a[0]` trước khi duyệt tuần tự.',
  },
];

export const INITIAL_ASSESSMENTS: any[] = [
  {
    assessment_id: 1,
    title: 'Kiểm Tra Năng Lực Lập Trình Frontend React 19 Chuyên Sâu',
    topic: 'React',
    duration_minutes: 15,
    questions: [
      {
        question_id: 101,
        skill_category: 'Component & Hooks',
        question_text: 'Trong React 19, hook nào cho phép quản lý trạng thái pending của Server Action không chặn luồng giao diện?',
        options: ['useTransition', 'useDeferredValue', 'useActionState', 'useOptimistic'],
        correct_answer_index: 2,
        explanation: '`useActionState` trong React 19 là hook chuyên dụng tiếp nhận action và trả về state, formAction cùng cờ isPending.',
      },
      {
        question_id: 102,
        skill_category: 'Performance & Optimization',
        question_text: 'Hàm nào được khuyến nghị để bọc hàm callback truyền xuống component con nhằm tránh re-render không cần thiết khi component con dùng React.memo?',
        options: ['useMemo', 'useCallback', 'useRef', 'useEffect'],
        correct_answer_index: 1,
        explanation: '`useCallback` lưu lại tham chiếu hàm (memoized callback) và chỉ tạo lại khi dependencies thay đổi.',
      },
      {
        question_id: 103,
        skill_category: 'Virtual DOM & Lifecycle',
        question_text: 'Khi render danh sách các phần tử bằng hàm `.map()`, thuộc tính `key` có ý nghĩa gì đối với React?',
        options: [
          'Định danh duy nhất giúp React nhận diện phần tử nào được thêm, sửa, hoặc xóa trong quá trình Reconciliation',
          'Tự động gán CSS class theo chỉ số index',
          'Tăng tốc độ tải mạng của trình duyệt',
          'Đảm bảo thứ tự sắp xếp tăng dần trong bộ nhớ',
        ],
        correct_answer_index: 0,
        explanation: 'Key giúp thuật toán so khớp Virtual DOM (Reconciliation) xác định chính xác phần tử nào biến đổi để cập nhật DOM tối thiểu.',
      },
      {
        question_id: 104,
        skill_category: 'State Architecture',
        question_text: 'Trong quy tắc của React, tại sao không được gọi React Hooks bên trong câu lệnh điều kiện `if` hoặc vòng lặp `for`?',
        options: [
          'Vì React dựa vào thứ tự gọi cố định của Hooks giữa các lần render để liên kết đúng state với component',
          'Vì JavaScript ES6 cấm khai báo hàm trong câu lệnh if',
          'Vì sẽ gây lỗi tràn bộ nhớ heap',
          'Vì trình duyệt Chrome không hỗ trợ closure',
        ],
        correct_answer_index: 0,
        explanation: 'React lưu trữ state của hooks theo một danh sách liên kết tuần tự, do đó thứ tự gọi mỗi lần render phải tuyệt đối nhất quán.',
      },
    ],
  },
  {
    assessment_id: 2,
    title: 'Kiểm Tra Năng Lực Kiến Trúc Backend NestJS & Clean Code',
    topic: 'NestJS',
    duration_minutes: 15,
    questions: [
      {
        question_id: 201,
        skill_category: 'Dependency Injection',
        question_text: 'Trong NestJS, decorator nào dùng để khai báo một class là một Provider có thể được inject vào các class khác?',
        options: ['@Controller()', '@Injectable()', '@Module()', '@Service()'],
        correct_answer_index: 1,
        explanation: 'Decorator `@Injectable()` gắn metadata báo cho Nest IoC container biết class đó có thể tham gia vào chu trình Dependency Injection.',
      },
      {
        question_id: 202,
        skill_category: 'Bảo mật & Guards',
        question_text: 'Thành phần nào trong NestJS vòng đời Request được thực thi đầu tiên để xác thực danh tính người dùng trước khi vào Controller?',
        options: ['Pipes', 'Interceptors', 'Guards', 'Exception Filters'],
        correct_answer_index: 2,
        explanation: 'Guards được kích hoạt sau Middleware và trước Interceptors/Pipes để xác định request có được phép tiếp tục hay không.',
      },
      {
        question_id: 203,
        skill_category: 'TypeORM & Transaction',
        question_text: 'Khi thực hiện nhiều thao tác CSDL liên quan đến tài chính, cơ chế nào đảm bảo nếu một thao tác lỗi thì toàn bộ đều rollback?',
        options: ['Cron Job', 'Database Transaction (QueryRunner)', 'Async/Await', 'EventEmitter'],
        correct_answer_index: 1,
        explanation: 'Transaction Runner đảm bảo tính nguyên tử (Atomicity) theo chuẩn ACID, rollback 100% nếu có lỗi phát sinh.',
      },
    ],
  },
];

@Injectable()
export class PracticeService {
  constructor(
    @Inject('PRACTICE_EXERCISE_REPOSITORY') private readonly exerciseRepo: Repository<PracticeExercise>,
    @Inject('SKILL_ASSESSMENT_REPOSITORY') private readonly assessmentRepo: Repository<SkillAssessment>,
  ) {}

  async getExercises(query?: { skill?: string; difficulty?: string; q?: string }) {
    let exercises = INITIAL_EXERCISES;
    if (query?.skill && query.skill !== 'All') {
      exercises = exercises.filter((e) => e.skill.toLowerCase() === query.skill!.toLowerCase());
    }
    if (query?.difficulty && query.difficulty !== 'All') {
      exercises = exercises.filter((e) => e.difficulty.toLowerCase() === query.difficulty!.toLowerCase());
    }
    if (query?.q) {
      const kw = query.q.toLowerCase().trim();
      exercises = exercises.filter((e) => e.title.toLowerCase().includes(kw) || e.description.toLowerCase().includes(kw));
    }
    return exercises;
  }

  async getExercise(id: number) {
    const exercise = INITIAL_EXERCISES.find((e) => Number(e.exercise_id) === Number(id));
    if (!exercise) {
      throw new NotFoundException('Không tìm thấy bài luyện tập');
    }
    return exercise;
  }

  async getAssessments() {
    return INITIAL_ASSESSMENTS.map((a) => ({
      assessment_id: a.assessment_id,
      title: a.title,
      topic: a.topic,
      duration_minutes: a.duration_minutes,
      total_questions: a.questions.length,
    }));
  }

  async getAssessment(id: number) {
    const assessment = INITIAL_ASSESSMENTS.find((a) => Number(a.assessment_id) === Number(id));
    if (!assessment) {
      throw new NotFoundException('Không tìm thấy bài kiểm tra năng lực');
    }
    // Ẩn đáp án đúng và lời giải thích trước khi nộp
    return {
      assessment_id: assessment.assessment_id,
      title: assessment.title,
      topic: assessment.topic,
      duration_minutes: assessment.duration_minutes,
      questions: assessment.questions.map((q: any) => ({
        question_id: q.question_id,
        skill_category: q.skill_category,
        question_text: q.question_text,
        options: q.options,
      })),
    };
  }

  async submitAssessment(id: number, answers: { question_id: number; selected_index: number }[]) {
    const assessment = INITIAL_ASSESSMENTS.find((a) => Number(a.assessment_id) === Number(id));
    if (!assessment) {
      throw new NotFoundException('Không tìm thấy bài kiểm tra');
    }

    let correctCount = 0;
    const categoryStats: Record<string, { total: number; correct: number }> = {};

    const detailedResults = assessment.questions.map((q: any) => {
      const userAns = answers.find((a) => Number(a.question_id) === Number(q.question_id));
      const isCorrect = userAns !== undefined && userAns.selected_index === q.correct_answer_index;

      if (!categoryStats[q.skill_category]) {
        categoryStats[q.skill_category] = { total: 0, correct: 0 };
      }
      categoryStats[q.skill_category].total += 1;
      if (isCorrect) {
        correctCount += 1;
        categoryStats[q.skill_category].correct += 1;
      }

      return {
        question_id: q.question_id,
        question_text: q.question_text,
        skill_category: q.skill_category,
        user_choice: userAns ? userAns.selected_index : null,
        correct_choice: q.correct_answer_index,
        is_correct: isCorrect,
        explanation: q.explanation,
      };
    });

    const totalQuestions = assessment.questions.length;
    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const isPassed = score >= 70;

    const skillRadar = Object.entries(categoryStats).map(([skill, stat]) => ({
      skill,
      accuracy_percent: Math.round((stat.correct / stat.total) * 100),
    }));

    return {
      assessment_id: assessment.assessment_id,
      score,
      total_questions: totalQuestions,
      correct_count: correctCount,
      is_passed: isPassed,
      skill_radar: skillRadar,
      detailed_results: detailedResults,
      recommendation: isPassed
        ? 'Xuất sắc! Bạn đã nắm vững các nguyên lý then chốt của chủ đề này.'
        : 'Bạn nên ôn tập lại các phần có độ chính xác dưới 60% thông qua kho bài luyện tập.',
    };
  }

  async getWeeklyChallenge() {
    return {
      challenge_id: 44,
      title: 'Thử Thách Tuần #44: Thiết Kế Thuật Toán Bộ Nhớ Đệm LRU Cache',
      deadline: '2026-11-05T23:59:59Z',
      reward: 'Huy hiệu Kỹ sư Thuật toán + 500 điểm Uy tín Cộng đồng',
      participants_count: 86,
      leaderboard: [
        { rank: 1, display_name: 'Hoàng_Frontend_Dev', score: 100, time_seconds: 245 },
        { rank: 2, display_name: 'Minh_NestJS_Master', score: 100, time_seconds: 310 },
        { rank: 3, display_name: 'QuocKhai_Phenikaa', score: 95, time_seconds: 280 },
        { rank: 4, display_name: 'NgocHao_UI_Expert', score: 90, time_seconds: 350 },
        { rank: 5, display_name: 'HoangSon_QA_Pro', score: 90, time_seconds: 390 },
      ],
    };
  }
}
