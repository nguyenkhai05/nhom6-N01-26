import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Form, Modal, Spinner, Alert, InputGroup } from 'react-bootstrap';
import { getCommunityPosts, getCommunityPost, createCommunityPost, createCommunityReply, acceptCommunityReply, reportContent } from '../services/hubApi';

export default function CommunityHub({ currentUser }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchKeyword, setSearchKeyword] = useState('');

  // Post detail modal
  const [selectedPost, setSelectedPost] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [newReply, setNewReply] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  // Create post modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createCategory, setCreateCategory] = useState('Hỏi đáp lập trình');
  const [createTitle, setCreateTitle] = useState('');
  const [createContent, setCreateContent] = useState('');
  const [createTags, setCreateTags] = useState('');
  const [creatingPost, setCreatingPost] = useState(false);

  // Alert feedback
  const [alertInfo, setAlertInfo] = useState(null);

  useEffect(() => {
    loadPosts();
  }, [selectedCategory]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await getCommunityPosts({
        category: selectedCategory,
        q: searchKeyword,
      });
      setPosts(data || []);
    } catch (err) {
      console.error('Lỗi tải bài viết cộng đồng:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetail = async (postId) => {
    setDetailLoading(true);
    setNewReply('');
    setAlertInfo(null);
    try {
      const p = await getCommunityPost(postId);
      setSelectedPost(p);
    } catch (err) {
      alert(err.message || 'Không thể xem bài viết');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert('Vui lòng đăng nhập để đăng bài viết mới.');
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
      alert(err.message || 'Lỗi đăng bài viết');
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
      // Cập nhật lại UI
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
    <div className="community-hub pb-5">
      {/* Banner */}
      <section className="bg-primary text-white py-5 mb-5 shadow-sm" style={{ background: 'linear-gradient(135deg, #003049 0%, #0d3b66 100%)' }}>
        <Container className="app-container">
          <Badge bg="info" text="dark" className="px-3 py-2 fw-bold rounded-pill mb-2">
            <i className="bi bi-chat-quote-fill me-1"></i> KHÔNG GIAN GIAO LƯU HỌC TẬP
          </Badge>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h1 className="fw-bold display-6 mb-2">Cộng Đồng Lập Trình Viên EduViet</h1>
              <p className="lead text-light mb-0" style={{ maxWidth: 800 }}>
                Hỏi đáp lỗi kỹ thuật, chia sẻ sản phẩm thực tế, trao đổi kinh nghiệm học tập và định hướng nghề nghiệp cùng các giảng viên và bạn học.
              </p>
            </div>
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
          </div>
        </Container>
      </section>

      <Container className="app-container">
        {/* Thanh tìm kiếm & bộ lọc chuyên mục */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div className="d-flex gap-2 flex-wrap">
            {['All', 'Hỏi đáp lập trình', 'Chia sẻ dự án', 'Kinh nghiệm học', 'Thông báo'].map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'primary' : 'outline-secondary'}
                size="sm"
                className="rounded-pill fw-semibold px-3"
                onClick={() => setSelectedCategory(cat)}
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
            style={{ maxWidth: 320 }}
          >
            <InputGroup size="sm">
              <Form.Control
                placeholder="Tìm bài viết, tag..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
              <Button variant="outline-primary" type="submit">
                <i className="bi bi-search"></i>
              </Button>
            </InputGroup>
          </Form>
        </div>

        {/* Danh sách bài thảo luận */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted">Đang tải danh sách thảo luận...</p>
          </div>
        ) : (
          <Row className="g-3">
            {posts.map((post) => (
              <Col key={post.post_id} xs={12}>
                <Card
                  className="border-0 shadow-sm rounded-4 p-4 hover-shadow cursor-pointer transition"
                  onClick={() => handleOpenDetail(post.post_id)}
                >
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <Badge bg="secondary" className="px-2 py-1 rounded-pill">
                        {post.category}
                      </Badge>
                      {post.is_solved && (
                        <Badge bg="success-subtle" text="success" className="border border-success-subtle px-2 py-1 rounded-pill fw-bold">
                          <i className="bi bi-check-circle-fill me-1"></i> Đã giải đáp
                        </Badge>
                      )}
                    </div>
                    <small className="text-muted">
                      {new Date(post.created_at).toLocaleDateString('vi-VN')}
                    </small>
                  </div>

                  <h5 className="fw-bold text-dark mb-2">{post.title}</h5>
                  <p className="text-muted small mb-3 line-clamp-2">{post.content}</p>

                  <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                    <div className="d-flex gap-1 flex-wrap">
                      {post.tags?.map((t, idx) => (
                        <span key={idx} className="badge bg-light text-secondary border">
                          #{t}
                        </span>
                      ))}
                    </div>

                    <div className="d-flex align-items-center gap-3 text-muted small">
                      <span>
                        <i className="bi bi-person me-1"></i> {post.author?.full_name || 'Học viên'}
                      </span>
                      <span>
                        <i className="bi bi-eye me-1"></i> {post.views_count || 0}
                      </span>
                      <span className="fw-bold text-primary">
                        <i className="bi bi-chat-dots me-1"></i> {post.replies_count || 0} trả lời
                      </span>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* Modal Đăng Bài Mới */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg" centered>
        <Form onSubmit={handleCreatePost}>
          <Modal.Header closeButton className="border-0 pb-0">
            <Modal.Title className="fw-bold text-primary">
              <i className="bi bi-pencil-square me-2"></i> Đăng Bài Thảo Luận Mới
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Chuyên mục thảo luận *</Form.Label>
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
              <Form.Label className="small fw-bold">Tiêu đề bài viết *</Form.Label>
              <Form.Control
                placeholder="Tóm tắt rõ ràng câu hỏi hoặc nội dung cần chia sẻ..."
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
                placeholder="Mô tả cụ thể vấn đề bạn gặp phải hoặc chia sẻ kiến thức..."
                value={createContent}
                onChange={(e) => setCreateContent(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Thẻ từ khóa (Tags, phân cách bằng dấu phẩy)</Form.Label>
              <Form.Control
                placeholder="React, NestJS, Bug, Career..."
                value={createTags}
                onChange={(e) => setCreateTags(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-0 pt-0">
            <Button variant="light" onClick={() => setShowCreateModal(false)}>
              Hủy
            </Button>
            <Button variant="primary" type="submit" disabled={creatingPost} className="fw-bold px-4">
              {creatingPost ? 'Đang đăng...' : 'Đăng Bài Viết'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal Chi Tiết Bài Viết & Bình Luận */}
      <Modal show={!!selectedPost} onHide={() => setSelectedPost(null)} size="lg" centered scrollable>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold text-dark fs-5">
            <Badge bg="secondary" className="me-2">{selectedPost?.category}</Badge>
            {selectedPost?.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {selectedPost && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3 text-muted small pb-2 border-bottom">
                <span>
                  Đăng bởi <strong>{selectedPost.author?.full_name}</strong> · {new Date(selectedPost.created_at).toLocaleDateString('vi-VN')}
                </span>
                <Button
                  variant="link"
                  size="sm"
                  className="text-danger p-0 text-decoration-none"
                  onClick={() => handleReport('POST', selectedPost.post_id)}
                >
                  <i className="bi bi-flag me-1"></i> Báo cáo vi phạm
                </Button>
              </div>

              <div className="p-3 bg-light rounded-4 mb-4" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                {selectedPost.content}
              </div>

              {/* Danh sách bình luận */}
              <h6 className="fw-bold text-dark mb-3">
                <i className="bi bi-chat-left-text me-2"></i> Các Câu Trả Lời ({selectedPost.replies?.length || 0})
              </h6>

              <div className="d-flex flex-column gap-3 mb-4">
                {selectedPost.replies?.map((r) => (
                  <div
                    key={r.reply_id}
                    className={`p-3 rounded-4 border ${r.is_accepted ? 'border-success bg-success-subtle' : 'bg-light'}`}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="d-flex align-items-center gap-2">
                        <strong className="text-dark small">{r.author?.full_name}</strong>
                        {r.is_accepted && (
                          <Badge bg="success" className="px-2 py-1">
                            <i className="bi bi-check-circle-fill me-1"></i> Câu trả lời được chấp nhận
                          </Badge>
                        )}
                      </div>
                      <small className="text-muted">{new Date(r.created_at).toLocaleDateString('vi-VN')}</small>
                    </div>

                    <p className="small mb-2 text-dark" style={{ whiteSpace: 'pre-wrap' }}>{r.content}</p>

                    <div className="d-flex justify-content-end gap-2">
                      {currentUser && !r.is_accepted && (selectedPost.user_id === currentUser.userId || currentUser.role === 'ADMIN') && (
                        <Button
                          variant="outline-success"
                          size="sm"
                          className="fw-bold"
                          onClick={() => handleAcceptReply(r.reply_id)}
                        >
                          <i className="bi bi-check-lg me-1"></i> Chọn câu trả lời này
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Ô nhập bình luận */}
              <div className="p-3 border rounded-4 bg-white">
                <Form.Label className="small fw-bold">Câu trả lời của bạn:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Chia sẻ giải pháp hoặc góc nhìn của bạn..."
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  className="mb-2"
                />
                <div className="d-flex justify-content-end">
                  <Button
                    variant="primary"
                    size="sm"
                    className="fw-bold px-3"
                    disabled={submittingReply || !newReply.trim()}
                    onClick={handleSendReply}
                  >
                    {submittingReply ? 'Đang gửi...' : 'Gửi Câu Trả Lời'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}
