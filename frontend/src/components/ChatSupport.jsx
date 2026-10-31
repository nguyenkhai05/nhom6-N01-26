import { useState, useRef, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';

const FAQ_SUGGESTIONS = [
  'Lộ trình học Web Fullstack 2026',
  'Học phí và ưu đãi ví EduViet',
  'Cách làm bài thực hành trong khóa',
  'Tài khoản Admin đăng nhập thế nào?'
];

export default function ChatSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Xin chào! 👋 Tôi là Trợ lý AI EduViet. Bạn cần tư vấn về lộ trình học lập trình, khóa học hay cần hỗ trợ kỹ thuật nào?',
      time: 'Vừa xong'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (userQuestion) => {
    const question = userQuestion || inputValue.trim();
    if (!question) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: question,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!userQuestion) setInputValue('');
    setIsTyping(true);

    // AI Bot trả lời thông minh dựa trên ngữ cảnh EduViet
    setTimeout(() => {
      let botReply = '';
      const q = question.toLowerCase();

      if (q.includes('admin') || q.includes('tài khoản')) {
        botReply = 'Bạn có thể trải nghiệm quyền Quản trị viên bằng tài khoản: Email "admin", Mật khẩu "Eduenglish123". Khi đăng nhập sẽ mở khóa tab Quản Trị CSDL!';
      } else if (q.includes('lộ trình') || q.includes('fullstack') || q.includes('frontend') || q.includes('backend')) {
        botReply = 'EduViet cung cấp 2 lộ trình trọng điểm: 1. Frontend Engineer (React 19 + Next.js) và 2. Backend & Cloud Engineer (NestJS + MySQL). Bạn có thể bấm vào tab "Lộ trình" trên thanh điều hướng để xem chi tiết nhé!';
      } else if (q.includes('học phí') || q.includes('ví') || q.includes('nạp tiền') || q.includes('ưu đãi')) {
        botReply = 'Khi tạo tài khoản học viên mới, bạn được tặng ngay 1.000.000đ vào ví học tập! Bạn có thể bấm vào nút ví trên thanh menu để nạp thêm hoặc thanh toán khóa học trực tiếp.';
      } else if (q.includes('code') || q.includes('luyện') || q.includes('test') || q.includes('arena')) {
        botReply = 'Mục "Luyện Code & Test" tích hợp sẵn trình biên dịch JavaScript trực tiếp và hệ thống chấm điểm Test Cases tự động (như LeetCode), cùng các đề trắc nghiệm chuẩn doanh nghiệp!';
      } else {
        botReply = 'Cảm ơn câu hỏi của bạn! Đội ngũ cố vấn kỹ thuật của EduViet đã nhận thông tin. Bạn có thể để lại email hoặc liên hệ hotline 1900-EDUVIET để được giải đáp 1-1 ngay nhé!';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: botReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="chat-support-wrapper">
      {/* Cửa sổ Chat khi mở */}
      {isOpen && (
        <div className="chat-box-window shadow-lg">
          {/* Header Chat */}
          <div className="chat-header d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <div className="chat-avatar-status position-relative">
                <div className="chat-bot-avatar">
                  <i className="bi bi-robot"></i>
                </div>
                <span className="online-indicator"></span>
              </div>
              <div>
                <h6 className="fw-bold mb-0 text-white">EduViet AI Support</h6>
                <span className="text-light opacity-75 small" style={{ fontSize: '0.72rem' }}>
                  Trực tuyến • Tư vấn học tập
                </span>
              </div>
            </div>
            <button
              className="chat-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Đóng chat"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          {/* Body tin nhắn */}
          <div className="chat-messages-container">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`chat-bubble-row d-flex ${
                  m.sender === 'user' ? 'justify-content-end' : 'justify-content-start'
                }`}
              >
                {m.sender === 'bot' && (
                  <div className="chat-mini-avatar me-2">
                    <i className="bi bi-code-slash text-primary"></i>
                  </div>
                )}
                <div
                  className={`chat-bubble ${
                    m.sender === 'user' ? 'user-bubble' : 'bot-bubble'
                  }`}
                >
                  <p className="mb-1 text-break">{m.text}</p>
                  <span className="chat-time">{m.time}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="chat-bubble-row d-flex justify-content-start">
                <div className="chat-mini-avatar me-2">
                  <i className="bi bi-code-slash text-primary"></i>
                </div>
                <div className="chat-bubble bot-bubble typing-dots">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Gợi ý câu hỏi nhanh */}
          <div className="chat-quick-suggestions px-3 py-2 border-top">
            <div className="small text-muted mb-1" style={{ fontSize: '0.7rem' }}>
              <i className="bi bi-stars text-warning me-1"></i>Gợi ý hỏi nhanh:
            </div>
            <div className="d-flex gap-1 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {FAQ_SUGGESTIONS.map((faq, idx) => (
                <button
                  key={idx}
                  className="btn btn-sm btn-light border rounded-pill px-2 py-1 text-nowrap small text-secondary"
                  style={{ fontSize: '0.72rem' }}
                  onClick={() => handleSend(faq)}
                >
                  {faq}
                </button>
              ))}
            </div>
          </div>

          {/* Input Footer */}
          <div className="chat-input-footer p-2 border-top">
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="d-flex align-items-center gap-2"
            >
              <Form.Control
                type="text"
                placeholder="Nhập câu hỏi của bạn..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="chat-text-input border-0 shadow-none"
              />
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="chat-send-btn rounded-circle"
                disabled={!inputValue.trim()}
              >
                <i className="bi bi-send-fill"></i>
              </Button>
            </Form>
          </div>
        </div>
      )}

      {/* Nút bấm tròn mở Chat ở góc dưới bên trái */}
      <button
        className={`chat-toggle-pill-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Trò chuyện với cố vấn EduViet"
      >
        <div className="d-flex align-items-center gap-2">
          <div className="chat-icon-pulse">
            <i className={`bi ${isOpen ? 'bi-x-lg' : 'bi-chat-dots-fill'} fs-5`}></i>
          </div>
          <span className="d-none d-sm-inline fw-bold small">Hỗ trợ 24/7</span>
        </div>
        <span className="chat-badge-dot"></span>
      </button>
    </div>
  );
}
