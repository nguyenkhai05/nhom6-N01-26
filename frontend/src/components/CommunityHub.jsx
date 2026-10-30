import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Form, Modal, Spinner, Alert } from 'react-bootstrap';
import {
  getCommunityPosts,
  getCommunityPost,
  createCommunityPost,
  createCommunityReply,
  acceptCommunityReply,
  reportContent,
  getArticles,
  getArticle,
  likeArticle,
} from '../services/hubApi';

const ARTICLE_CATEGORIES = [
  { key: 'ALL', label: 'Tất Cả Bài Viết', icon: 'bi-grid-fill' },
  { key: 'Frontend', label: 'Frontend & UI', icon: 'bi-layout-text-window-reverse' },
  { key: 'Backend', label: 'Backend & APIs', icon: 'bi-hdd-network-fill' },
  { key: 'DevOps', label: 'DevOps & Cloud', icon: 'bi-clouds-fill' },
  { key: 'AI', label: 'Trí Tuệ Nhân Tạo', icon: 'bi-cpu-fill' },
  { key: 'Career', label: 'Phỏng Vấn & Sự Nghiệp', icon: 'bi-briefcase-fill' },
];

export default function CommunityHub({ currentUser, initialTab = 'articles', onNavigate, onCourseSelect }) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'articles' | 'discussion'

  // --- STATE BÀI VIẾT & CẨM NANG ---
  const [articles, setArticles] = useState([]);
  const [articlesLoading, setArticlesLoading] = useState(true);
  const [articleCategory, setArticleCategory] = useState('ALL');
  const [articleKeyword, setArticleKeyword] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [articleModalLoading, setArticleModalLoading] = useState(false);
  const [articleLikeLoading, setArticleLikeLoading] = useState(false);

  // --- STATE HỎI ĐÁP & THẢO LUẬN ---
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postCategory, setPostCategory] = useState('All');
  const [postKeyword, setPostKeyword] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [postDetailLoading, setPostDetailLoading] = useState(false);
  const [newReply, setNewReply] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  // Modal tạo bài thảo luận / câu hỏi
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createCategory, setCreateCategory] = useState('Hỏi đáp lập trình');
  const [createTitle, setCreateTitle] = useState('');
  const [createContent, setCreateContent] = useState('');
  const [createTags, setCreateTags] = useState('');
  const [creatingPost, setCreatingPost] = useState(false);

  // Alert feedback
  const [alertInfo, setAlertInfo] = useState(null);

  // Tải danh sách bài viết khi chọn tab hoặc filter
  useEffect(() => {
    if (activeTab === 'articles') {
      loadArticles();
    } else {
      loadPosts();
    }
  }, [activeTab, articleCategory, postCategory]);

  const loadArticles = async () => {
    setArticlesLoading(true);
    try {
      const data = await getArticles({
        category: articleCategory !== 'ALL' ? articleCategory : undefined,
        keyword: articleKeyword.trim() || undefined,
      });
      setArticles(data || []);
    } catch (err) {
      console.error('Lỗi tải bài viết:', err);
    } finally {
      setArticlesLoading(false);
    }
  };

  const loadPosts = async () => {
    setPostsLoading(true);
    try {
      const data = await getCommunityPosts({
        category: postCategory,
        q: postKeyword,
      });
      setPosts(data || []);
    } catch (err) {
      console.error('Lỗi tải bài viết cộng đồng:', err);
    } finally {
      setPostsLoading(false);
    }
  };

  // --- HANDLERS BÀI VIẾT ---
  const handleOpenArticle = async (idOrSlug) => {
    setArticleModalLoading(true);
    try {
      const art = await getArticle(idOrSlug);
      setSelectedArticle(art);
      setArticles((prev) =>
        prev.map((a) => (a.article_id === art.article_id ? { ...a, views_count: art.views_count } : a))
      );
    } catch (err) {
      alert(err.message || 'Không thể mở bài viết');
    } finally {
      setArticleModalLoading(false);
    }
  };

  const handleLikeArticle = async (id, e) => {
    if (e) e.stopPropagation();
    setArticleLikeLoading(true);
    try {
      const res = await likeArticle(id);
      setArticles((prev) =>
        prev.map((a) => (a.article_id === id ? { ...a, likes_count: res.likes_count } : a))
      );
      if (selectedArticle && selectedArticle.article_id === id) {
        setSelectedArticle((prev) => ({ ...prev, likes_count: res.likes_count }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setArticleLikeLoading(false);
    }
  };

  // --- HANDLERS THẢO LUẬN / HỎI ĐÁP ---
  const handleOpenPostDetail = async (postId) => {
    setPostDetailLoading(true);
    setNewReply('');
    setAlertInfo(null);
    try {
      const p = await getCommunityPost(postId);
      setSelectedPost(p);
    } catch (err) {
      alert(err.message || 'Không thể xem chi tiết câu hỏi');
    } finally {
      setPostDetailLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert('Vui lòng đăng nhập để gửi câu hỏi.');
      return;
    }
    setCreatingPost(true);
    try {
      const tagsArray = createTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      await createCommunityPost({
        category: createCategory,
        title: createTitle,
        content: createContent,
        tags: tagsArray.length ? tagsArray : ['General'],
      });

      setShowCreateModal(false);
      setCreateTitle('');
      setCreateContent('');
      setCreateTags('');
      loadPosts();
    } catch (err) {
      alert(err.message || 'Lỗi gửi câu hỏi');
    } finally {
      setCreatingPost(false);
    }
  };

  const handleSendReply = async () => {
    if (!currentUser) {
      alert('Vui lòng đăng nhập để bình luận.');
      return;
    }
    if (!newReply.trim()) return;
    setSubmittingReply(true);
    try {
      const reply = await createCommunityReply(selectedPost.post_id, newReply);
      setSelectedPost({
        ...selectedPost,
        replies: [...(selectedPost.replies || []), reply],
      });
      setNewReply('');
    } catch (err) {
      alert(err.message || 'Lỗi gửi bình luận');
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleAcceptReply = async (replyId) => {
    try {
      await acceptCommunityReply(selectedPost.post_id, replyId);
      const updatedReplies = (selectedPost.replies || []).map((r) => ({
        ...r,
        is_accepted: r.reply_id === replyId,
      }));
      setSelectedPost({
        ...selectedPost,
        is_solved: true,
        accepted_reply_id: replyId,
        replies: updatedReplies,
      });
    } catch (err) {
      alert(err.message || 'Không thể chọn câu trả lời');
    }
  };

  const handleReport = async (targetType, targetId) => {
    if (!currentUser) {
      alert('Vui lòng đăng nhập để báo cáo nội dung.');
      return;
    }
    const reason = window.prompt('Nhập lý do báo cáo vi phạm nội dung:');
    if (!reason?.trim()) return;
    try {
      const res = await reportContent({
        target_type: targetType,
        target_id: targetId,
        reason: reason.trim(),
      });
      alert(res.message);
    } catch (err) {
      alert(err.message || 'Lỗi gửi báo cáo');
    }
  };

  return (
    <div className="community-hub pb-5 page-fade-in">
      {/* 1. Header Banner */}
      <section
        className="py-5 mb-4 text-white shadow-sm"
        style={{ background: 'linear-gradient(135deg, #0d3b66 0%, #001e3d 100%)' }}
      >
        <Container className="app-container">
          <Badge bg="info" text="dark" className="px-3 py-2 fw-bold rounded-pill mb-2">
            <i className="bi bi-chat-square-text-fill me-1"></i> KHÔNG GIAN HỌC TẬP & TRI THỨC SỐ
          </Badge>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h1 className="fw-bold display-6 mb-2">Cộng Đồng & Bài Viết Công Nghệ EduViet</h1>
              <p className="lead text-light mb-0" style={{ maxWidth: 820 }}>
                Trung tâm tri thức toàn diện: Đọc các bài viết chuyên sâu từ Tech Lead và tham gia trao đổi, hỏi đáp sửa lỗi code trực tiếp cùng Giảng viên và cộng đồng học viên.
              </p>
            </div>
            {activeTab === 'discussion' && (
              <Button
                variant="warning"
                className="fw-bold px-4 py-2 rounded-pill shadow-sm"
                onClick={() => {
                  if (!currentUser) alert('Vui lòng đăng nhập để đặt câu hỏi mới.');
                  else setShowCreateModal(true);
                }}
              >
                <i className="bi bi-pencil-square me-1"></i> Đặt Câu Hỏi Mới
              </Button>
            )}
          </div>

          {/* 2. Thanh Chuyển Đổi Tab Chính (Gom Bài Viết và Cộng Đồng Thành 1) */}
          <div className="d-flex gap-2 mt-4">
            <button
              type="button"
              className={`btn px-4 py-2 rounded-pill fw-bold d-flex align-items-center gap-2 transition ${activeTab === 'articles' ? 'btn-light text-primary shadow' : 'btn-outline-light'}`}
              onClick={() => setActiveTab('articles')}
            >
              <i className="bi bi-journal-text fs-5"></i>
              <span>Bài Viết & Cẩm Nang Công Nghệ</span>
            </button>
            <button
              type="button"
              className={`btn px-4 py-2 rounded-pill fw-bold d-flex align-items-center gap-2 transition ${activeTab === 'discussion' ? 'btn-light text-primary shadow' : 'btn-outline-light'}`}
              onClick={() => setActiveTab('discussion')}
            >
              <i className="bi bi-chat-dots-fill fs-5"></i>
              <span>Hỏi Đáp & Thảo Luận Cộng Đồng</span>
            </button>
          </div>
        </Container>
      </section>

      <Container className="app-container">
        {/* ========================================================
            TAB 1: BÀI VIẾT & CẨM NANG CÔNG NGHỆ
           ======================================================== */}
        {activeTab === 'articles' && (
          <div className="articles-section page-fade-in">
            {/* Bộ lọc chuyên mục bài viết & Ô tìm kiếm */}
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4 pb-2 border-bottom">
              <div className="d-flex flex-wrap gap-2">
                {ARTICLE_CATEGORIES.map((cat) => (
                  <Button
                    key={cat.key}
                    variant={articleCategory === cat.key ? 'primary' : 'outline-secondary'}
                    size="sm"
                    className={`rounded-pill px-3 py-2 d-flex align-items-center gap-2 fw-semibold ${articleCategory === cat.key ? 'shadow-sm' : 'border-0 bg-light text-dark'}`}
                    onClick={() => setArticleCategory(cat.key)}
                  >
                    <i className={`bi ${cat.icon}`}></i>
                    {cat.label}
                  </Button>
                ))}
              </div>

              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  loadArticles();
                }}
                className="d-flex gap-2"
                style={{ minWidth: 280 }}
              >
                <Form.Control
                  type="text"
                  placeholder="Tìm bài viết, React 19, Docker..."
                  size="sm"
                  value={articleKeyword}
                  onChange={(e) => setArticleKeyword(e.target.value)}
                  className="rounded-pill"
                />
                <Button type="submit" variant="primary" size="sm" className="rounded-pill px-3 fw-bold">
                  Tìm
                </Button>
              </Form>
            </div>

            {/* Danh sách bài viết */}
            {articlesLoading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-muted">Đang tải danh sách bài viết...</p>
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-5 bg-white rounded-4 border p-5">
                <i className="bi bi-journal-x fs-1 text-muted d-block mb-3"></i>
                <h5 className="fw-bold">Không tìm thấy bài viết phù hợp</h5>
                <p className="text-muted">Hãy thử tìm kiếm với từ khóa khác hoặc chuyển chuyên mục.</p>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => {
                    setArticleCategory('ALL');
                    setArticleKeyword('');
                  }}
                >
                  Xem tất cả bài viết
                </Button>
              </div>
            ) : (
              <Row className="g-4">
                {articles.map((art) => {
                  let tagsArray = [];
                  try {
                    tagsArray = typeof art.tags === 'string' ? JSON.parse(art.tags) : art.tags || [];
                  } catch {
                    tagsArray = [];
                  }

                  return (
                    <Col key={art.article_id} lg={4} md={6}>
                      <Card className="h-100 shadow-sm border-0 rounded-4 overflow-hidden d-flex flex-column hover-shadow transition">
                        <div className="position-relative" style={{ height: '190px', overflow: 'hidden' }}>
                          <Card.Img
                            variant="top"
                            src={art.thumbnail_url}
                            alt={art.title}
                            style={{ height: '100%', objectFit: 'cover' }}
                          />
                          <Badge
                            bg="dark"
                            className="position-absolute top-0 end-0 m-3 px-3 py-2 bg-opacity-75 rounded-pill fw-semibold"
                          >
                            <i className="bi bi-clock me-1"></i> {art.read_time}
                          </Badge>
                          <Badge
                            bg="primary"
                            className="position-absolute bottom-0 start-0 m-3 px-3 py-1 rounded-pill fw-bold"
                          >
                            {art.category}
                          </Badge>
                        </div>

                        <Card.Body className="p-3 d-flex flex-column">
                          <div className="d-flex align-items-center gap-2 mb-2">
                            <img
                              src={art.author_avatar}
                              alt={art.author_name}
                              className="rounded-circle"
                              style={{ width: '26px', height: '26px', objectFit: 'cover' }}
                            />
                            <span className="small text-muted fw-semibold">{art.author_name}</span>
                          </div>

                          <h6 className="fw-bold text-dark mb-2" style={{ lineHeight: 1.4, minHeight: '42px' }}>
                            {art.title}
                          </h6>
                          <p className="text-muted small mb-3 flex-grow-1" style={{ lineHeight: 1.5 }}>
                            {art.summary}
                          </p>

                          <div className="d-flex flex-wrap gap-1 mb-3">
                            {tagsArray.map((t, idx) => (
                              <span key={idx} className="badge bg-light text-secondary border small">
                                #{t}
                              </span>
                            ))}
                          </div>

                          <div className="d-flex justify-content-between align-items-center pt-2 border-top mt-auto">
                            <div className="d-flex align-items-center gap-3 text-muted small">
                              <span>
                                <i className="bi bi-eye me-1"></i> {art.views_count}
                              </span>
                              <button
                                type="button"
                                className="btn btn-sm btn-link p-0 text-muted text-decoration-none d-flex align-items-center gap-1"
                                onClick={(e) => handleLikeArticle(art.article_id, e)}
                                title="Thích bài viết"
                              >
                                <i className="bi bi-hand-thumbs-up text-primary"></i>
                                <span>{art.likes_count}</span>
                              </button>
                            </div>

                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="rounded-pill px-3 fw-bold"
                              onClick={() => handleOpenArticle(art.slug || art.article_id)}
                            >
                              Đọc tiếp <i className="bi bi-arrow-right ms-1"></i>
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 2: HỎI ĐÁP & THẢO LUẬN CỘNG ĐỒNG
           ======================================================== */}
        {activeTab === 'discussion' && (
          <div className="discussion-section page-fade-in">
            {/* Thanh tìm kiếm & bộ lọc chuyên mục thảo luận */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3 pb-2 border-bottom">
              <div className="d-flex gap-2 flex-wrap">
                {['All', 'Hỏi đáp lập trình', 'Chia sẻ dự án', 'Kinh nghiệm học', 'Thông báo'].map((cat) => (
                  <Button
                    key={cat}
                    variant={postCategory === cat ? 'primary' : 'outline-secondary'}
                    size="sm"
                    className="rounded-pill fw-semibold px-3"
                    onClick={() => setPostCategory(cat)}
                  >
                    {cat === 'All' ? 'Tất cả chuyên mục' : cat}
                  </Button>
                ))}
              </div>

              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  loadPosts();
                }}
                className="d-flex gap-2"
                style={{ minWidth: 280 }}
              >
                <Form.Control
                  type="text"
                  placeholder="Tìm câu hỏi, từ khóa..."
                  size="sm"
                  value={postKeyword}
                  onChange={(e) => setPostKeyword(e.target.value)}
                  className="rounded-pill"
                />
                <Button type="submit" variant="primary" size="sm" className="rounded-pill px-3 fw-bold">
                  Tìm
                </Button>
              </Form>
            </div>

            {/* Danh sách câu hỏi / thảo luận */}
            {postsLoading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-muted">Đang tải thảo luận cộng đồng...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-5 bg-white rounded-4 border p-5">
                <i className="bi bi-chat-square-dots fs-1 text-muted d-block mb-3"></i>
                <h5 className="fw-bold">Chưa có bài thảo luận nào trong mục này</h5>
                <p className="text-muted">Hãy là người đầu tiên đặt câu hỏi để nhận trợ giúp từ cộng đồng!</p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    if (!currentUser) alert('Vui lòng đăng nhập để đặt câu hỏi.');
                    else setShowCreateModal(true);
                  }}
                >
                  Đặt câu hỏi ngay
                </Button>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {posts.map((post) => (
                  <Card
                    key={post.post_id}
                    className="shadow-sm border-0 rounded-4 overflow-hidden hover-shadow cursor-pointer transition"
                    onClick={() => handleOpenPostDetail(post.post_id)}
                  >
                    <Card.Body className="p-4">
                      <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                        <div className="d-flex align-items-center gap-2">
                          <Badge bg="secondary" className="fw-semibold px-2 py-1">
                            {post.category}
                          </Badge>
                          {post.is_solved && (
                            <Badge bg="success" className="d-flex align-items-center gap-1">
                              <i className="bi bi-check-circle-fill"></i> Đã giải quyết
                            </Badge>
                          )}
                        </div>
                        <small className="text-muted">
                          {new Date(post.created_at || Date.now()).toLocaleDateString('vi-VN')}
                        </small>
                      </div>

                      <h5 className="fw-bold text-dark mb-2">{post.title}</h5>
                      <p className="text-muted small mb-3 text-truncate-2" style={{ lineHeight: 1.5 }}>
                        {post.content}
                      </p>

                      <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                        <div className="d-flex align-items-center gap-2">
                          <div className="p-2 bg-light rounded-circle text-primary">
                            <i className="bi bi-person-fill"></i>
                          </div>
                          <div>
                            <span className="small fw-bold d-block text-dark">
                              {post.author?.full_name || 'Học viên ẩn danh'}
                            </span>
                            <small className="text-muted">Thành viên EduViet</small>
                          </div>
                        </div>

                        <div className="d-flex align-items-center gap-3 text-muted small">
                          <span>
                            <i className="bi bi-chat-text me-1"></i> {post.replies?.length || 0} câu trả lời
                          </span>
                          <span>
                            <i className="bi bi-eye me-1"></i> {post.views_count || 1} lượt xem
                          </span>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </Container>

      {/* 3. Modal Đọc Bài Viết */}
      <Modal
        show={!!selectedArticle}
        onHide={() => setSelectedArticle(null)}
        size="lg"
        centered
        scrollable
        className="article-reader-modal"
      >
        {selectedArticle && (
          <>
            <Modal.Header closeButton className="border-bottom">
              <div className="d-flex align-items-center gap-2">
                <Badge bg="primary" className="rounded-pill px-3 py-1">
                  {selectedArticle.category}
                </Badge>
                <span className="text-muted small">
                  <i className="bi bi-clock me-1"></i> {selectedArticle.read_time}
                </span>
              </div>
            </Modal.Header>
            <Modal.Body className="p-4">
              <h3 className="fw-bold mb-3">{selectedArticle.title}</h3>

              <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded-3 mb-4">
                <div className="d-flex align-items-center gap-2">
                  <img
                    src={selectedArticle.author_avatar}
                    alt={selectedArticle.author_name}
                    className="rounded-circle"
                    style={{ width: '42px', height: '42px', objectFit: 'cover' }}
                  />
                  <div>
                    <strong className="d-block text-dark">{selectedArticle.author_name}</strong>
                    <small className="text-muted">Chuyên gia giảng dạy tại EduViet</small>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <span className="small text-muted">
                    <i className="bi bi-eye me-1"></i> {selectedArticle.views_count} lượt xem
                  </span>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="rounded-pill px-3 d-flex align-items-center gap-1"
                    onClick={() => handleLikeArticle(selectedArticle.article_id)}
                    disabled={articleLikeLoading}
                  >
                    <i className="bi bi-hand-thumbs-up-fill"></i>
                    <span>Thích ({selectedArticle.likes_count})</span>
                  </Button>
                </div>
              </div>

              <div
                className="article-content lh-lg text-dark mb-4"
                style={{ fontSize: '1.05rem', whiteSpace: 'pre-line' }}
              >
                {selectedArticle.content}
              </div>

              {selectedArticle.related_course_id && (
                <div className="p-4 bg-primary-subtle border border-primary-subtle rounded-4 mt-4">
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div>
                      <span className="badge bg-primary text-white mb-2">KHÓA HỌC THỰC CHIẾN GỢI Ý</span>
                      <h5 className="fw-bold text-dark mb-1">
                        Áp dụng kiến thức bài viết này vào đồ án chuyên nghiệp
                      </h5>
                      <small className="text-secondary">
                        Đăng ký học để nhận giáo trình chi tiết, source code hoàn chỉnh và sửa bài 1-1 cùng Giảng viên.
                      </small>
                    </div>
                    <Button
                      variant="primary"
                      className="fw-bold px-4 rounded-pill shadow-sm"
                      onClick={() => {
                        setSelectedArticle(null);
                        onNavigate?.('courses');
                      }}
                    >
                      <i className="bi bi-mortarboard me-1"></i> Khám Phá Khóa Học
                    </Button>
                  </div>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer className="border-top">
              <Button variant="secondary" onClick={() => setSelectedArticle(null)}>
                Đóng
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>

      {/* 4. Modal Chi Tiết Bài Thảo Luận / Câu Hỏi & Trả Lời */}
      <Modal
        show={!!selectedPost}
        onHide={() => setSelectedPost(null)}
        size="lg"
        centered
        scrollable
      >
        {selectedPost && (
          <>
            <Modal.Header closeButton>
              <Modal.Title className="fs-5 fw-bold d-flex align-items-center gap-2">
                <Badge bg="secondary">{selectedPost.category}</Badge>
                {selectedPost.title}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
              {/* Nội dung câu hỏi */}
              <div className="p-3 bg-light rounded-4 mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <div className="p-2 bg-white rounded-circle text-primary shadow-sm">
                      <i className="bi bi-person-fill"></i>
                    </div>
                    <strong>{selectedPost.author?.full_name || 'Học viên'}</strong>
                  </div>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-danger p-0 text-decoration-none"
                    onClick={() => handleReport('POST', selectedPost.post_id)}
                  >
                    <i className="bi bi-flag me-1"></i> Báo cáo
                  </Button>
                </div>
                <div style={{ whiteSpace: 'pre-line' }}>{selectedPost.content}</div>
              </div>

              {/* Danh sách câu trả lời */}
              <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <i className="bi bi-chat-left-dots text-primary"></i>
                Câu trả lời ({selectedPost.replies?.length || 0})
              </h6>

              <div className="d-flex flex-column gap-3 mb-4">
                {selectedPost.replies?.map((rep) => (
                  <div
                    key={rep.reply_id}
                    className={`p-3 rounded-4 border ${rep.is_accepted ? 'bg-success-subtle border-success' : 'bg-white'}`}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="d-flex align-items-center gap-2">
                        <strong>{rep.author?.full_name || 'Học viên'}</strong>
                        {rep.is_accepted && (
                          <Badge bg="success" className="d-flex align-items-center gap-1">
                            <i className="bi bi-check-circle-fill"></i> Câu trả lời được chấp nhận
                          </Badge>
                        )}
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        {currentUser &&
                          currentUser.user_id === selectedPost.author_id &&
                          !selectedPost.is_solved && (
                            <Button
                              variant="outline-success"
                              size="sm"
                              className="py-0 px-2 small"
                              onClick={() => handleAcceptReply(rep.reply_id)}
                            >
                              <i className="bi bi-check2"></i> Chọn câu trả lời đúng
                            </Button>
                          )}
                        <Button
                          variant="link"
                          size="sm"
                          className="text-danger p-0 text-decoration-none"
                          onClick={() => handleReport('REPLY', rep.reply_id)}
                        >
                          <i className="bi bi-flag"></i>
                        </Button>
                      </div>
                    </div>
                    <div style={{ whiteSpace: 'pre-line' }}>{rep.content}</div>
                  </div>
                ))}
              </div>

              {/* Form gửi bình luận */}
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold">Viết câu trả lời của bạn:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Chia sẻ cách giải quyết, gợi ý hoặc phân tích giải thuật..."
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                />
              </Form.Group>
              <div className="text-end">
                <Button
                  variant="primary"
                  size="sm"
                  className="fw-bold px-3"
                  onClick={handleSendReply}
                  disabled={submittingReply || !newReply.trim()}
                >
                  {submittingReply ? 'Đang gửi...' : 'Gửi câu trả lời'}
                </Button>
              </div>
            </Modal.Body>
          </>
        )}
      </Modal>

      {/* 5. Modal Đặt Câu Hỏi Mới */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fs-5 fw-bold">Đặt Câu Hỏi / Tạo Thảo Luận Mới</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreatePost}>
          <Modal.Body className="p-4">
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Chuyên mục *</Form.Label>
              <Form.Select
                value={createCategory}
                onChange={(e) => setCreateCategory(e.target.value)}
              >
                <option value="Hỏi đáp lập trình">Hỏi đáp lập trình</option>
                <option value="Chia sẻ dự án">Chia sẻ dự án</option>
                <option value="Kinh nghiệm học">Kinh nghiệm học</option>
                <option value="Thông báo">Thông báo</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Tiêu đề câu hỏi *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ví dụ: Lỗi Unhandled Exception khi dùng TypeORM migration trong NestJS"
                value={createTitle}
                onChange={(e) => setCreateTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Nội dung chi tiết *</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Mô tả cụ thể lỗi gặp phải, log console hoặc đoạn code cần trợ giúp..."
                value={createContent}
                onChange={(e) => setCreateContent(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Tags (cách nhau bởi dấu phẩy)</Form.Label>
              <Form.Control
                type="text"
                placeholder="NestJS, TypeORM, Database"
                value={createTags}
                onChange={(e) => setCreateTags(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" size="sm" onClick={() => setShowCreateModal(false)}>
              Hủy
            </Button>
            <Button type="submit" variant="primary" size="sm" className="fw-bold px-4" disabled={creatingPost}>
              {creatingPost ? 'Đang đăng...' : 'Đăng câu hỏi'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
