import { describe, it, expect, beforeEach } from 'vitest';
import { ArticleService, INITIAL_ARTICLES } from '../../src/article/article.service.js';

describe('ArticleService Unit Tests (Bài viết & Cẩm nang)', () => {
  let articleService: ArticleService;
  let articleStore: any[];

  beforeEach(() => {
    articleStore = JSON.parse(JSON.stringify(INITIAL_ARTICLES));

    const mockRepo: any = {
      find: async () => articleStore,
      findOne: async (opt: any) => {
        if (opt?.where?.article_id) {
          return articleStore.find((a) => a.article_id === opt.where.article_id) || null;
        }
        if (opt?.where?.slug) {
          return articleStore.find((a) => a.slug === opt.where.slug) || null;
        }
        return null;
      },
      save: async (entity: any) => {
        const idx = articleStore.findIndex((a) => a.article_id === entity.article_id);
        if (idx >= 0) articleStore[idx] = entity;
        else articleStore.push(entity);
        return entity;
      },
    };

    articleService = new ArticleService(mockRepo);
  });

  it('1. Trả về đầy đủ danh sách bài viết công nghệ', async () => {
    const list = await articleService.findAll();
    expect(list.length).toBeGreaterThanOrEqual(5);
    expect(list[0]).toHaveProperty('title');
    expect(list[0]).toHaveProperty('slug');
    expect(list[0]).toHaveProperty('read_time');
  });

  it('2. Lọc bài viết theo danh mục (category: Frontend, Backend)', async () => {
    const frontendArticles = await articleService.findAll('Frontend');
    expect(frontendArticles.length).toBeGreaterThan(0);
    expect(frontendArticles.every((a) => a.category === 'Frontend')).toBe(true);

    const backendArticles = await articleService.findAll('Backend');
    expect(backendArticles.length).toBeGreaterThan(0);
    expect(backendArticles.every((a) => a.category === 'Backend')).toBe(true);
  });

  it('3. Tìm kiếm bài viết theo từ khóa (keyword search)', async () => {
    const searchResults = await articleService.findAll('ALL', 'Docker');
    expect(searchResults.length).toBeGreaterThan(0);
    expect(searchResults[0].title.toLowerCase()).toContain('docker');
  });

  it('4. Xem chi tiết bài viết theo ID và slug, tự động tăng views_count', async () => {
    const initial = await articleService.findOne(1);
    const viewsBefore = initial.views_count;

    const viewedAgain = await articleService.findOne(1);
    expect(viewedAgain.views_count).toBe(viewsBefore + 1);

    const bySlug = await articleService.findOne('cam-nang-toi-uu-hoa-hieu-nang-react-19');
    expect(bySlug.article_id).toBe(1);
  });

  it('5. Like bài viết tăng số lượt thích thành công', async () => {
    const before = await articleService.findOne(2);
    const likesBefore = before.likes_count;

    const res = await articleService.likeArticle(2);
    expect(res.likes_count).toBe(likesBefore + 1);
    expect(res.message).toContain('Đã thích');
  });

  it('6. Báo lỗi NotFoundException khi truy vấn bài viết không tồn tại', async () => {
    await expect(articleService.findOne(9999)).rejects.toThrow('Không tìm thấy bài viết');
  });
});
