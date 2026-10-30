import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Form, Accordion, Alert, Spinner } from 'react-bootstrap';
import { getFaq, createSupportRequest } from '../services/hubApi';

export default function HelpCenterPage({ currentUser, onNavigate }) {
  const [faqTopics, setFaqTopics] = useState([]);
  const [loadingFaq, setLoadingFaq] = useState(true);

  // Form state
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [topic, setTopic] = useState('Tư vấn trước khi mua khóa học');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [ticketResponse, setTicketResponse] = useState(null);

  useEffect(() => {
    getFaq()
      .then((data) => setFaqTopics(data || []))
      .catch((err) => console.error('Lỗi tải FAQ:', err))
      .finally(() => setLoadingFaq(false));
  }, []);

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    if (!email.trim() || !message.trim()) {
      alert('Vui lòng nhập đầy đủ Email và Nội dung yêu cầu.');
      return;
    }

    setSubmitting(true);
    setTicketResponse(null);
    try {
      const res = await createSupportRequest({
        fullName,
        email,
        topic,
        message,
        userId: currentUser?.user_id,
      });
      setTicketResponse(res);
      setMessage('');
    } catch (err) {
      alert(err.message || 'Lỗi gửi yêu cầu hỗ trợ');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="help-center-page pb-5 page-fade-in">
      {/* 1. Header Banner */}
      <section
        className="py-5 mb-4 text-white shadow-sm"
        style={{ background: 'linear-gradient(135deg, #0d3b66 0%, #001e3d 100%)' }}
      >
        <Container className="app-container">
          <Badge bg="info" text="dark" className="px-3 py-2 fw-bold rounded-pill mb-2">
            <i className="bi bi-question-circle-fill me-1"></i> TRUNG TÂM TRỢ GIÚP & HỖ TRỢ NGƯỜI HỌC
          </Badge>
          <h1 className="fw-bold display-6 mb-2">Giải Đáp Thắc Mắc & Hỗ Trợ 1-1</h1>
          <p className="lead text-light mb-0" style={{ maxWidth: 840 }}>
            Tra cứu câu hỏi thường gặp về thanh toán, chính sách hoàn học phí, môi trường thực hành code, hoặc gửi yêu cầu tư vấn trước khi mua để được Giảng viên giải đáp chi tiết.
          </p>
        </Container>
      </section>

      <Container className="app-container">
        <Row className="g-4">
          {/* CỘT TRÁI: CÂU HỎI THƯỜNG GẶP (FAQ) */}
          <Col lg={7}>
            <div className="mb-4">
              <h4 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                <i className="bi bi-patch-question text-primary"></i>
                Câu Hỏi Thường Gặp (FAQ)
              </h4>
              <p className="text-muted small">Các tình huống học viên thường thắc mắc nhất</p>
            </div>

            {loadingFaq ? (
              <div className="text-center py-5 bg-white rounded-4 border p-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted">Đang tải câu hỏi...</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {faqTopics.map((topic, tIdx) => (
                  <Card key={topic.topic_id} className="border-0 shadow-sm rounded-4 overflow-hidden">
                    <Card.Header className="bg-light p-3 fw-bold text-primary d-flex align-items-center gap-2">
                      <i className={`bi ${topic.icon} fs-5`}></i>
                      <span>{topic.topic_name}</span>
                    </Card.Header>
                    <Card.Body className="p-3">
                      <Accordion defaultActiveKey="0" flush>
                        {topic.items.map((it, idx) => (
                          <Accordion.Item key={idx} eventKey={String(idx)}>
                            <Accordion.Header>
                              <strong className="small text-dark">{it.question}</strong>
                            </Accordion.Header>
                            <Accordion.Body className="small text-secondary lh-base">
                              {it.answer}
                            </Accordion.Body>
                          </Accordion.Item>
                        ))}
                      </Accordion>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            )}
          </Col>

          {/* CỘT PHẢI: FORM GỬI YÊU CẦU HỖ TRỢ / TƯ VẤN (TICKET) */}
          <Col lg={5}>
            <Card className="border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: '90px' }}>
              <h5 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                <i className="bi bi-chat-heart text-danger"></i>
                Hỏi Về Khóa Học Trước Khi Mua
              </h5>
              <p className="text-muted small mb-3">
                Đội ngũ cố vấn học tập sẽ phản hồi bạn qua email trong vòng 2-4 giờ.
              </p>

              {ticketResponse && (
                <Alert variant="success" className="p-3 rounded-3 small mb-3">
                  <div className="fw-bold d-flex align-items-center gap-1 mb-1">
                    <i className="bi bi-check-circle-fill"></i> Gửi thành công!
                  </div>
                  <div>Mã phiếu: <strong>{ticketResponse.ticket_id}</strong></div>
                  <div>{ticketResponse.message}</div>
                </Alert>
              )}

              <Form onSubmit={handleSubmitTicket}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Họ và tên của bạn</Form.Label>
                  <Form.Control
                    type="text"
                    size="sm"
                    className="rounded-3"
                    placeholder="Nguyễn Văn A"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Email nhận phản hồi *</Form.Label>
                  <Form.Control
                    type="email"
                    size="sm"
                    className="rounded-3"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Chủ đề cần tư vấn</Form.Label>
                  <Form.Select
                    size="sm"
                    className="rounded-3"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  >
                    <option value="Tư vấn trước khi mua khóa học">Tư vấn trước khi mua khóa học</option>
                    <option value="Hỏi về lộ trình phù hợp">Hỏi về lộ trình phù hợp</option>
                    <option value="Hỗ trợ kỹ thuật & Compiler Sandbox">Hỗ trợ kỹ thuật & Compiler Sandbox</option>
                    <option value="Hỏi về chứng chỉ & chính sách hoàn phí">Hỏi về chứng chỉ & chính sách hoàn phí</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Nội dung câu hỏi / thắc mắc *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    size="sm"
                    className="rounded-3"
                    placeholder="Ví dụ: Em chưa biết lập trình thì có thể học khóa React 19 này được không ạ?..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-100 fw-bold py-2 rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Spinner animation="border" size="sm" />
                      Đang gửi yêu cầu...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send-fill text-warning"></i>
                      Gửi Yêu Cầu Tư Vấn Ngay
                    </>
                  )}
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
