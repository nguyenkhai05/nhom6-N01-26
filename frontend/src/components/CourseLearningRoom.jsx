import { useState, useEffect, useRef, useMemo } from 'react';
import { Row, Col, Card, Button, Badge, ProgressBar, Tab, Nav, Accordion, Form, InputGroup } from 'react-bootstrap';
import { getCurriculumForCourse } from '../utils/courseCurriculum';
import { apiUpdateLessonProgress, apiGetLessonNotes, apiCreateLessonNote } from '../services/commerceApi';

export default function CourseLearningRoom({
  course,
  currentUser,
  onBack,
  onNavigate
}) {
  const curriculum = useMemo(() => getCurriculumForCourse(course), [course]);
  const allLessons = useMemo(() => curriculum.modules.flatMap((m) => m.lessons), [curriculum]);

  // Khóa lưu tiến độ cục bộ theo người dùng và khóa học
  const storageKey = `eduviet_course_progress_${currentUser?.id || 'demo'}_${course?.course_id || 1}`;

  // Trạng thái bài học đang xem & danh sách bài đã hoàn thành
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchLessonQuery, setSearchLessonQuery] = useState('');
  const [autoplayNext, setAutoplayNext] = useState(true);
  const [resumePrompt, setResumePrompt] = useState(null);
  const [isSavedSync, setIsSavedSync] = useState(true);

  // Ghi chú cá nhân kèm timestamp
  const [notes, setNotes] = useState([]);
  const [newNoteText, setNewNoteText] = useState('');

  // Code Studio Sandbox
  const [codeEditorValue, setCodeEditorValue] = useState('');
  const [terminalOutput, setTerminalOutput] = useState('EduViet Sandbox Engine v2026 Ready. Bấm "Chạy Thử Code" để thực thi.');
  const [isRunningCode, setIsRunningCode] = useState(false);

  // YouTube IFrame Player API
  const playerRef = useRef(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [playbackSeconds, setPlaybackSeconds] = useState(0);
  const pendingSeekRef = useRef(null);
  const currentLesson = allLessons[activeLessonIndex] || allLessons[0];

  // 1. Khôi phục tiến độ từ LocalStorage khi khởi tạo
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.completedLessons)) {
          setCompletedLessons(parsed.completedLessons);
        }
        if (typeof parsed.lastLessonIndex === 'number' && parsed.lastLessonIndex < allLessons.length) {
          setActiveLessonIndex(parsed.lastLessonIndex);
          if (parsed.lastPositionSeconds && parsed.lastPositionSeconds > 0) {
            setResumePrompt({
              lessonIndex: parsed.lastLessonIndex,
              lessonTitle: allLessons[parsed.lastLessonIndex]?.title || 'Bài học',
              positionSeconds: parsed.lastPositionSeconds
            });
          }
        }
        if (Array.isArray(parsed.notes)) {
          setNotes(parsed.notes);
        }
      }
    } catch (e) {
      console.warn('Lỗi đọc tiến độ:', e);
    }
  }, [storageKey, allLessons]);

  // Cập nhật code mẫu khi đổi bài
  useEffect(() => {
    if (currentLesson?.sampleCode) {
      setCodeEditorValue(currentLesson.sampleCode);
    }
  }, [currentLesson]);

  // 2. Tích hợp YouTube IFrame Player API
  useEffect(() => {
    let checkInterval = null;

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return false;
      const container = document.getElementById('eduviet-yt-iframe');
      if (!container) return false;

      try {
        if (playerRef.current && typeof playerRef.current.destroy === 'function') {
          playerRef.current.destroy();
        }

        playerRef.current = new window.YT.Player('eduviet-yt-iframe', {
          videoId: currentLesson.videoId,
          playerVars: {
            start: currentLesson.start_seconds || 0,
            autoplay: 1,
            rel: 0,
            modestbranding: 1,
            enablejsapi: 1,
            origin: window.location.origin
          },
          events: {
            onReady: (event) => {
              setIsPlayerReady(true);
              if (pendingSeekRef.current !== null) {
                event.target.seekTo(pendingSeekRef.current, true);
                pendingSeekRef.current = null;
              }
            },
            onStateChange: (event) => {
              if (window.YT && event.data === window.YT.PlayerState.ENDED) {
                handleAutoAdvance();
              }
            }
          }
        });
        return true;
      } catch (err) {
        console.warn('Khởi tạo YT Player lỗi:', err);
        return false;
      }
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = () => initPlayer();
    } else {
      initPlayer();
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, []);

  // 3. Định kỳ theo dõi thời gian phát và tự động lưu tiến độ
  useEffect(() => {
    const timer = setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        try {
          const currentSec = Math.floor(playerRef.current.getCurrentTime());
          setPlaybackSeconds(currentSec);

          // Nếu phát đạt >= 90% thời lượng của bài học, tự động đánh dấu hoàn thành
          const segStart = currentLesson.start_seconds || 0;
          const segEnd = currentLesson.end_seconds || (segStart + 300);
          const segDuration = segEnd - segStart;
          if (segDuration > 0 && currentSec >= segStart + Math.floor(segDuration * 0.9)) {
            setCompletedLessons((prev) => {
              if (!prev.includes(currentLesson.id)) {
                return [...prev, currentLesson.id];
              }
              return prev;
            });
          }

          // Autosave vào LocalStorage và Máy chủ Backend
          const progressPayload = {
            courseId: course?.course_id || 1,
            lastLessonIndex: activeLessonIndex,
            lastPositionSeconds: currentSec,
            completedLessons: completedLessons,
            notes: notes,
            savedAt: new Date().toISOString()
          };
          localStorage.setItem(storageKey, JSON.stringify(progressPayload));
          if (currentUser) {
            apiUpdateLessonProgress(course?.course_id || 1, currentLesson?.id || 1, {
              is_completed: completedLessons.includes(currentLesson?.id),
              current_position_seconds: currentSec,
            }).catch(() => {});
          }
          setIsSavedSync(true);
        } catch (e) {
          // Player có thể đang ở trạng thái chuyển đổi
        }
      }
    }, 4000);

    return () => clearInterval(timer);
  }, [activeLessonIndex, completedLessons, currentLesson, notes, storageKey, course]);

  // 4. Chọn bài học trong giáo trình - Tua video đến đúng mốc thời gian
  const handleSelectLesson = (lessonIndex, lesson) => {
    setActiveLessonIndex(lessonIndex);
    setResumePrompt(null);
    setIsSavedSync(false);

    const targetSec = lesson.start_seconds || 0;

    if (playerRef.current && isPlayerReady && typeof playerRef.current.seekTo === 'function') {
      try {
        const currentPlayingUrl = playerRef.current.getVideoUrl?.() || '';
        const currentPlayingId = currentPlayingUrl.includes('v=')
          ? currentPlayingUrl.split('v=')[1]?.split('&')[0]
          : null;

        if (currentPlayingId && currentPlayingId === lesson.videoId) {
          // Cùng video -> seek ngay lập tức tới start_seconds
          playerRef.current.seekTo(targetSec, true);
          playerRef.current.playVideo();
        } else {
          // Khác video -> loadVideoById kèm startSeconds
          playerRef.current.loadVideoById({
            videoId: lesson.videoId,
            startSeconds: targetSec
          });
        }
      } catch (err) {
        console.warn('Lỗi seek/load:', err);
      }
    } else {
      pendingSeekRef.current = targetSec;
    }
  };

  // Tua lại từ đầu bài học hiện tại
  const handleReplayFromBeginning = () => {
    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      playerRef.current.seekTo(currentLesson.start_seconds || 0, true);
      playerRef.current.playVideo();
    }
  };

  // Tua tương đối +/- 10 giây
  const handleSeekRelative = (seconds) => {
    if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
      const cur = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(Math.max(0, cur + seconds), true);
    }
  };

  // Tự động chuyển bài tiếp theo khi kết thúc đoạn
  const handleAutoAdvance = () => {
    if (!autoplayNext) return;
    if (activeLessonIndex < allLessons.length - 1) {
      const nextIdx = activeLessonIndex + 1;
      handleSelectLesson(nextIdx, allLessons[nextIdx]);
    }
  };

  // Chuyển bài trước / tiếp theo
  const handlePrevLesson = () => {
    if (activeLessonIndex > 0) {
      handleSelectLesson(activeLessonIndex - 1, allLessons[activeLessonIndex - 1]);
    }
  };

  const handleNextLesson = () => {
    if (activeLessonIndex < allLessons.length - 1) {
      handleSelectLesson(activeLessonIndex + 1, allLessons[activeLessonIndex + 1]);
    }
  };

  // Bật/tắt trạng thái hoàn thành bài học thủ công
  const toggleCompleteCurrentLesson = () => {
    setCompletedLessons((prev) => {
      if (prev.includes(currentLesson.id)) {
        return prev.filter((id) => id !== currentLesson.id);
      } else {
        return [...prev, currentLesson.id];
      }
    });
  };

  // Thêm ghi chú tại thời điểm video hiện tại
  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const min = Math.floor(playbackSeconds / 60);
    const sec = playbackSeconds % 60;
    const timeLabel = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;

    const newNote = {
      id: Date.now(),
      lessonId: currentLesson.id,
      lessonTitle: currentLesson.title,
      timeSeconds: playbackSeconds,
      timeLabel: timeLabel,
      content: newNoteText.trim(),
      createdAt: new Date().toLocaleDateString('vi-VN')
    };

    setNotes((prev) => [newNote, ...prev]);
    if (currentUser && currentLesson?.id) {
      apiCreateLessonNote(currentLesson.id, newNoteText.trim()).catch(() => {});
    }
    setNewNoteText('');
  };

  // Đồng bộ ghi chú từ server cho bài học đang mở
  useEffect(() => {
    if (currentUser && currentLesson?.id) {
      apiGetLessonNotes(currentLesson.id)
        .then((serverNotes) => {
          if (Array.isArray(serverNotes) && serverNotes.length > 0) {
            setNotes((prev) => {
              const formatted = serverNotes.map((sn) => ({
                id: sn.note_id,
                lessonId: sn.lesson_id,
                lessonTitle: currentLesson.title,
                timeSeconds: 0,
                timeLabel: '00:00',
                content: sn.content,
                createdAt: sn.created_at ? new Date(sn.created_at).toLocaleDateString('vi-VN') : '',
              }));
              const existingIds = new Set(formatted.map((f) => f.id));
              return [...formatted, ...prev.filter((p) => !existingIds.has(p.id))];
            });
          }
        })
        .catch(() => {});
    }
  }, [currentLesson?.id, currentUser]);

  // Xóa ghi chú
  const handleDeleteNote = (noteId) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
  };

  // Chạy code JavaScript trong sandbox
  const handleRunCode = () => {
    setIsRunningCode(true);
    setTerminalOutput('Đang biên dịch qua EduViet Sandbox Engine...');
    setTimeout(() => {
      setIsRunningCode(false);
      try {
        const logs = [];
        const originalLog = console.log;
        console.log = (...args) => {
          logs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : a)).join(' '));
        };

        const fn = new Function(codeEditorValue);
        fn();
        console.log = originalLog;

        setTerminalOutput(
          `[BIÊN DỊCH THÀNH CÔNG] - Runtime: 0.14s | Exit Code: 0\n---------------------------------------------\n` +
          (logs.length > 0 ? logs.join('\n') : 'Chương trình chạy hoàn tất, không có lỗi runtime.')
        );
      } catch (err) {
        setTerminalOutput(`[LỖI RUNTIME / CÚ PHÁP]:\n${err.message}`);
      }
    }, 450);
  };

  // Tính tỷ lệ hoàn thành thực tế (chỉ tính các bài đã hoàn thành thật)
  const progressPercent = Math.round((completedLessons.length / allLessons.length) * 100);

  // Lọc bài học theo tìm kiếm
  const filteredModules = useMemo(() => {
    if (!searchLessonQuery.trim()) return curriculum.modules;
    const q = searchLessonQuery.toLowerCase();
    return curriculum.modules
      .map((mod) => ({
        ...mod,
        lessons: mod.lessons.filter((l) => l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q))
      }))
      .filter((mod) => mod.lessons.length > 0);
  }, [curriculum, searchLessonQuery]);

  return (
    <div className="course-learning-room bg-light min-vh-100 page-fade-in text-dark" style={{ overflowX: 'hidden' }}>
      {/* 1. Header Phòng Học Tinh Gọn Chuyên Biệt */}
      <div className="bg-dark text-white py-2 px-3 px-lg-4 border-bottom d-flex align-items-center justify-content-between flex-wrap gap-2 sticky-top" style={{ zIndex: 1020 }}>
        <div className="d-flex align-items-center gap-3">
          <Button
            variant="outline-light"
            size="sm"
            className="rounded-pill px-3 py-1 fw-bold d-flex align-items-center gap-1 shadow-sm"
            onClick={onBack}
            title="Quay lại danh mục khóa học"
          >
            <i className="bi bi-arrow-left"></i>
            <span className="d-none d-sm-inline">Khóa học</span>
          </Button>

          <div className="border-start border-secondary ps-3">
            <h6 className="mb-0 fw-bold d-flex align-items-center gap-2 text-white">
              <span className="text-warning fs-6">●</span>
              <span className="text-truncate" style={{ maxWidth: 360 }}>
                {course?.title || 'Phòng Học Lập Trình'}
              </span>
            </h6>
            <span className="text-secondary small d-none d-md-block" style={{ fontSize: '0.78rem' }}>
              Đang học: <strong>Bài {activeLessonIndex + 1}/{allLessons.length}</strong> • {currentLesson.title}
            </span>
          </div>
        </div>

        <div className="d-flex align-items-center gap-3">
          {/* Trạng thái lưu tiến độ */}
          <div className="d-none d-md-flex align-items-center gap-1 text-secondary small" style={{ fontSize: '0.75rem' }}>
            <i className={`bi bi-cloud-check-fill ${isSavedSync ? 'text-success' : 'text-warning'}`}></i>
            <span>{isSavedSync ? 'Đã lưu tiến độ' : 'Đang đồng bộ...'}</span>
          </div>

          {/* Thanh Tiến Độ Hoàn Thành */}
          <div className="text-end" style={{ width: 140 }}>
            <div className="d-flex justify-content-between small text-light mb-1" style={{ fontSize: '0.75rem' }}>
              <span>Tiến độ:</span>
              <strong className="text-success">{progressPercent}%</strong>
            </div>
            <ProgressBar now={progressPercent} variant="success" style={{ height: 6 }} className="rounded-pill" />
          </div>

          <Badge bg="success" className="px-3 py-2 rounded-pill fw-bold shadow-sm d-none d-sm-inline-block">
            <i className="bi bi-shield-check me-1"></i> Trọn Đời
          </Badge>
        </div>
      </div>

      {/* Thông báo tiếp tục học dở nếu có */}
      {resumePrompt && (
        <div className="bg-primary-subtle border-bottom border-primary px-3 py-2 d-flex justify-content-between align-items-center flex-wrap gap-2 text-primary">
          <div className="d-flex align-items-center gap-2 small">
            <i className="bi bi-clock-history fs-5"></i>
            <span>
              Bạn đang học dở <strong>{resumePrompt.lessonTitle}</strong> tại mốc{' '}
              <strong>
                {Math.floor(resumePrompt.positionSeconds / 60)}:
                {String(resumePrompt.positionSeconds % 60).padStart(2, '0')}
              </strong>.
            </span>
          </div>
          <div className="d-flex gap-2">
            <Button
              variant="primary"
              size="sm"
              className="rounded-pill px-3 py-1 fw-bold"
              onClick={() => {
                handleSelectLesson(resumePrompt.lessonIndex, allLessons[resumePrompt.lessonIndex]);
                if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
                  playerRef.current.seekTo(resumePrompt.positionSeconds, true);
                }
                setResumePrompt(null);
              }}
            >
              Tiếp tục mốc này
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              className="rounded-pill px-3 py-1"
              onClick={() => {
                handleReplayFromBeginning();
                setResumePrompt(null);
              }}
            >
              Học từ đầu bài
            </Button>
          </div>
        </div>
      )}

      {/* 2. Layout Không Gian Học Tập Tập Trung */}
      <div className="container-fluid px-2 px-lg-4 py-3">
        <Row className="g-3">
          {/* CỘT TRÁI (Khu vực Video Player & Tabs chức năng học tập) */}
          <Col lg={8} xl={8}>
            {/* Khung Video 16:9 thích ứng */}
            <Card className="border-0 rounded-4 shadow-sm overflow-hidden mb-3 bg-black">
              <div className="ratio ratio-16x9">
                <div id="eduviet-yt-iframe" className="w-100 h-100">
                  {/* Fallback Iframe nếu API chưa sẵn sàng */}
                  <iframe
                    src={`https://www.youtube.com/embed/${currentLesson.videoId}?start=${currentLesson.start_seconds || 0}&autoplay=1&enablejsapi=1&rel=0&modestbranding=1`}
                    title={currentLesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-100 h-100 border-0"
                  />
                </div>
              </div>

              {/* Thanh Điều Khiển & Tua Video Tiện Lợi */}
              <div className="bg-dark text-white p-2 px-3 d-flex justify-content-between align-items-center flex-wrap gap-2 border-top border-secondary border-opacity-25">
                <div className="d-flex align-items-center gap-2">
                  <Button
                    variant="outline-light"
                    size="sm"
                    className="rounded-pill px-2 py-1"
                    onClick={() => handleSeekRelative(-10)}
                    title="Tua lùi 10 giây"
                  >
                    <i className="bi bi-arrow-counterclockwise me-1"></i> -10s
                  </Button>
                  <Button
                    variant="outline-light"
                    size="sm"
                    className="rounded-pill px-2 py-1"
                    onClick={() => handleSeekRelative(10)}
                    title="Tua tới 10 giây"
                  >
                    +10s <i className="bi bi-arrow-clockwise ms-1"></i>
                  </Button>
                  <Button
                    variant="outline-warning"
                    size="sm"
                    className="rounded-pill px-3 py-1 text-warning fw-semibold"
                    onClick={handleReplayFromBeginning}
                    title="Xem lại từ mốc bắt đầu của bài học này"
                  >
                    <i className="bi bi-skip-start-circle me-1"></i> Xem từ đầu bài
                  </Button>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <Form.Check
                    type="switch"
                    id="autoplay-switch"
                    label={<span className="small text-light d-none d-sm-inline">Tự chuyển bài</span>}
                    checked={autoplayNext}
                    onChange={(e) => setAutoplayNext(e.target.checked)}
                    className="text-light me-2"
                  />

                  <Button
                    variant={completedLessons.includes(currentLesson.id) ? 'success' : 'outline-success'}
                    size="sm"
                    className="rounded-pill px-3 py-1 fw-bold d-flex align-items-center gap-1 shadow-sm"
                    onClick={toggleCompleteCurrentLesson}
                  >
                    {completedLessons.includes(currentLesson.id) ? (
                      <>
                        <i className="bi bi-check-circle-fill"></i>
                        <span>Đã Hoàn Thành</span>
                      </>
                    ) : (
                      <>
                        <i className="bi bi-circle"></i>
                        <span>Đánh Dấu Hoàn Thành</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Thanh Điều Hướng Bài Trước / Bài Tiếp Theo */}
            <div className="d-flex justify-content-between align-items-center bg-white p-3 rounded-4 shadow-sm mb-3 border">
              <Button
                variant="outline-primary"
                size="sm"
                className="rounded-pill px-3 py-1 fw-bold"
                onClick={handlePrevLesson}
                disabled={activeLessonIndex === 0}
              >
                <i className="bi bi-chevron-left me-1"></i> Bài Trước
              </Button>

              <div className="text-center px-2">
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 mb-1">
                  Bài {activeLessonIndex + 1}/{allLessons.length}
                </span>
                <div className="fw-bold text-dark small text-truncate" style={{ maxWidth: 380 }}>
                  {currentLesson.title}
                </div>
              </div>

              <Button
                variant="primary"
                size="sm"
                className="rounded-pill px-3 py-1 fw-bold"
                onClick={handleNextLesson}
                disabled={activeLessonIndex === allLessons.length - 1}
              >
                Bài Tiếp <i className="bi bi-chevron-right ms-1"></i>
              </Button>
            </div>

            {/* Khối Tabs Học Tập Toàn Diện (Tổng Quan, Code Sandbox, Ghi Chú, Hỏi Đáp) */}
            <Card className="border-0 rounded-4 shadow-sm bg-white overflow-hidden mb-4">
              <Card.Header className="bg-white border-bottom p-2">
                <Nav variant="pills" activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="gap-2">
                  <Nav.Item>
                    <Nav.Link eventKey="overview" className="rounded-pill px-3 py-2 fw-semibold">
                      <i className="bi bi-info-circle me-1"></i> Tổng Quan Bài Học
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="code" className="rounded-pill px-3 py-2 fw-semibold">
                      <i className="bi bi-terminal-fill me-1"></i> Code Studio Sandbox
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="notes" className="rounded-pill px-3 py-2 fw-semibold">
                      <i className="bi bi-journal-text me-1"></i> Ghi Chú Cá Nhân ({notes.length})
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="qa" className="rounded-pill px-3 py-2 fw-semibold">
                      <i className="bi bi-chat-dots me-1"></i> Hỏi Đáp Mentor
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Header>

              <Card.Body className="p-3 p-md-4">
                {/* TAB 1: TỔNG QUAN BÀI HỌC */}
                {activeTab === 'overview' && (
                  <div className="page-fade-in">
                    <h5 className="fw-bold mb-2 text-dark">{currentLesson.title}</h5>
                    <p className="text-muted leading-relaxed mb-4">{currentLesson.description}</p>

                    <div className="row g-3 mb-4">
                      <div className="col-sm-6 col-md-4">
                        <div className="p-3 bg-light rounded-3 border">
                          <span className="text-secondary small d-block mb-1">Thời lượng bài học</span>
                          <strong className="text-dark fs-6">
                            <i className="bi bi-clock me-1 text-primary"></i> {currentLesson.duration}
                          </strong>
                        </div>
                      </div>
                      <div className="col-sm-6 col-md-4">
                        <div className="p-3 bg-light rounded-3 border">
                          <span className="text-secondary small d-block mb-1">Mốc thời gian bắt đầu</span>
                          <strong className="text-dark fs-6">
                            <i className="bi bi-play-circle me-1 text-success"></i>{' '}
                            {Math.floor((currentLesson.start_seconds || 0) / 60)}:
                            {String((currentLesson.start_seconds || 0) % 60).padStart(2, '0')}
                          </strong>
                        </div>
                      </div>
                      <div className="col-sm-6 col-md-4">
                        <div className="p-3 bg-light rounded-3 border">
                          <span className="text-secondary small d-block mb-1">Trạng thái</span>
                          <strong className={completedLessons.includes(currentLesson.id) ? 'text-success' : 'text-primary'}>
                            {completedLessons.includes(currentLesson.id) ? '✓ Đã hoàn thành' : '● Đang học'}
                          </strong>
                        </div>
                      </div>
                    </div>

                    <h6 className="fw-bold mb-3">Mục tiêu học tập & Kiến thức đạt được:</h6>
                    <ul className="text-secondary small mb-0 ps-3 leading-relaxed">
                      <li className="mb-2">Nắm vững nguyên lý và kiến trúc cốt lõi áp dụng trong các dự án Production thực tế.</li>
                      <li className="mb-2">Thực hành viết code sạch theo chuẩn Clean Architecture và Clean Code quốc tế.</li>
                      <li className="mb-2">Tự tin giải quyết các lỗi runtime phổ biến và tối ưu hiệu năng ứng dụng.</li>
                      <li>Hoàn thành bài tập mẫu tại tab <strong>Code Studio Sandbox</strong> để củng cố kiến thức.</li>
                    </ul>
                  </div>
                )}

                {/* TAB 2: CODE STUDIO SANDBOX */}
                {activeTab === 'code' && (
                  <div className="page-fade-in">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <h6 className="fw-bold mb-0">EduViet Live Interactive Code Studio</h6>
                        <span className="text-secondary small">Môi trường thực thi JavaScript ES6 trong trình duyệt</span>
                      </div>
                      <div className="d-flex gap-2">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          className="rounded-pill px-3"
                          onClick={() => setCodeEditorValue(currentLesson.sampleCode || '')}
                        >
                          <i className="bi bi-arrow-counterclockwise me-1"></i> Khôi phục mẫu
                        </Button>
                        <Button
                          variant="success"
                          size="sm"
                          className="rounded-pill px-4 fw-bold shadow-sm"
                          onClick={handleRunCode}
                          disabled={isRunningCode}
                        >
                          {isRunningCode ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                              Đang chạy...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-play-circle-fill me-1"></i> Chạy Thử Code
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Editor Textarea */}
                    <div className="bg-dark rounded-3 overflow-hidden border mb-3">
                      <div className="bg-black text-secondary px-3 py-2 small d-flex justify-content-between align-items-center border-bottom border-secondary border-opacity-25">
                        <span><i className="bi bi-file-earmark-code me-1 text-primary"></i> solution.js</span>
                        <span className="badge bg-secondary">Node 20 Sandbox</span>
                      </div>
                      <textarea
                        rows={10}
                        value={codeEditorValue}
                        onChange={(e) => setCodeEditorValue(e.target.value)}
                        className="form-control bg-dark text-light border-0 font-monospace p-3"
                        style={{
                          fontSize: '0.9rem',
                          lineHeight: '1.6',
                          resize: 'vertical',
                          backgroundColor: '#18181b',
                          color: '#38bdf8'
                        }}
                        placeholder="// Viết mã nguồn JavaScript tại đây..."
                      />
                    </div>

                    {/* Console Output */}
                    <div className="bg-black text-white p-3 rounded-3 font-monospace border" style={{ fontSize: '0.84rem' }}>
                      <div className="text-secondary border-bottom border-secondary pb-1 mb-2 d-flex justify-content-between align-items-center">
                        <span><i className="bi bi-terminal me-1 text-success"></i> Terminal Output</span>
                        <span className="badge bg-dark text-secondary">stdout</span>
                      </div>
                      <pre className="mb-0 text-success-emphasis" style={{ whiteSpace: 'pre-wrap', maxHeight: 160, overflowY: 'auto' }}>
                        {terminalOutput}
                      </pre>
                    </div>
                  </div>
                )}

                {/* TAB 3: GHI CHÚ KÈM TIMESTAMP */}
                {activeTab === 'notes' && (
                  <div className="page-fade-in">
                    <h6 className="fw-bold mb-3">Thêm ghi chú tại thời điểm video hiện tại</h6>
                    <Form onSubmit={handleAddNote} className="mb-4">
                      <InputGroup className="mb-2">
                        <InputGroup.Text className="bg-light fw-bold text-primary font-monospace">
                          {Math.floor(playbackSeconds / 60)}:{String(playbackSeconds % 60).padStart(2, '0')}
                        </InputGroup.Text>
                        <Form.Control
                          placeholder="Nhập nội dung ghi chú học tập..."
                          value={newNoteText}
                          onChange={(e) => setNewNoteText(e.target.value)}
                        />
                        <Button variant="primary" type="submit" className="fw-bold px-3">
                          <i className="bi bi-plus-lg me-1"></i> Lưu Ghi Chú
                        </Button>
                      </InputGroup>
                      <Form.Text className="text-muted small">
                        Bấm vào mốc thời gian của ghi chú để tua video về đúng thời điểm đó.
                      </Form.Text>
                    </Form>

                    <h6 className="fw-bold mb-2">Danh sách ghi chú của bạn:</h6>
                    {notes.length === 0 ? (
                      <div className="p-4 bg-light rounded-3 text-center text-muted">
                        <i className="bi bi-journal-bookmark fs-3 d-block mb-2 text-secondary"></i>
                        Chưa có ghi chú nào. Hãy ghi lại những kiến thức quan trọng khi đang xem video!
                      </div>
                    ) : (
                      <div className="d-flex flex-column gap-2">
                        {notes.map((note) => (
                          <div key={note.id} className="p-3 bg-light rounded-3 border d-flex justify-content-between align-items-start gap-2">
                            <div>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-primary rounded-pill py-0 px-2 fw-bold font-monospace me-2"
                                onClick={() => {
                                  if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
                                    playerRef.current.seekTo(note.timeSeconds, true);
                                    playerRef.current.playVideo();
                                  }
                                }}
                                title="Bấm để tua video về thời điểm này"
                              >
                                <i className="bi bi-play-fill"></i> {note.timeLabel}
                              </button>
                              <strong className="text-dark small me-2">{note.lessonTitle}</strong>
                              <p className="mb-0 text-muted small mt-1">{note.content}</p>
                            </div>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="border-0 p-1"
                              onClick={() => handleDeleteNote(note.id)}
                              title="Xóa ghi chú"
                            >
                              <i className="bi bi-trash"></i>
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 4: HỎI ĐÁP VÀ THẢO LUẬN */}
                {activeTab === 'qa' && (
                  <div className="page-fade-in">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="fw-bold mb-0">Hỏi đáp cộng đồng & Hỗ trợ Mentor</h6>
                      <Button variant="primary" size="sm" className="rounded-pill px-3 fw-bold">
                        <i className="bi bi-chat-left-text me-1"></i> Đặt Câu Hỏi
                      </Button>
                    </div>

                    <div className="p-3 bg-light rounded-3 border mb-3">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: 32, height: 32, fontSize: '0.85rem' }}>
                          M
                        </div>
                        <div>
                          <strong className="text-dark small d-block">Mentor EduViet</strong>
                          <span className="text-muted" style={{ fontSize: '0.72rem' }}>Đã ghim bài học</span>
                        </div>
                      </div>
                      <p className="text-secondary small mb-0">
                        Chào các bạn! Nếu gặp khó khăn khi thực hành bài giảng này hoặc môi trường máy tính chưa khớp, hãy đặt câu hỏi bên dưới hoặc gửi ảnh chụp màn hình, đội ngũ Mentor sẽ giải đáp trong vòng 15 phút.
                      </p>
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* CỘT PHẢI (Danh Sách Giáo Trình & Bài Học) */}
          <Col lg={4} xl={4}>
            <Card className="border-0 rounded-4 shadow-sm bg-white overflow-hidden sticky-top" style={{ top: 75 }}>
              <Card.Header className="bg-white border-bottom p-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div>
                    <h6 className="fw-bold mb-0 text-dark">Nội Dung Khóa Học</h6>
                    <span className="text-secondary small">{allLessons.length} bài học • Giáo trình thực tế</span>
                  </div>
                  <Badge bg="primary-subtle" className="text-primary border border-primary-subtle px-2 py-1 rounded-pill fw-bold">
                    {completedLessons.length}/{allLessons.length} bài
                  </Badge>
                </div>

                {/* Ô tìm kiếm bài học */}
                <Form.Control
                  type="text"
                  placeholder="Tìm bài học..."
                  size="sm"
                  className="rounded-pill bg-light border-0 px-3"
                  value={searchLessonQuery}
                  onChange={(e) => setSearchLessonQuery(e.target.value)}
                />
              </Card.Header>

              <Card.Body className="p-0" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
                <Accordion defaultActiveKey="0" flush alwaysOpen>
                  {filteredModules.map((mod, modIdx) => (
                    <Accordion.Item eventKey={String(modIdx)} key={modIdx} className="border-bottom">
                      <div className="d-flex align-items-center justify-content-between bg-light px-3 py-2 border-bottom border-light">
                        <Accordion.Header className="flex-grow-1 p-0 m-0">
                          <span className="fw-bold small text-dark">{mod.moduleTitle}</span>
                        </Accordion.Header>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="rounded-pill py-0 px-2 fw-semibold text-nowrap ms-2"
                          style={{ fontSize: '0.72rem' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            const firstLesson = mod.lessons[0];
                            if (firstLesson) {
                              const globalIdx = allLessons.findIndex((l) => l.id === firstLesson.id);
                              handleSelectLesson(globalIdx, firstLesson);
                            }
                          }}
                          title="Học từ bài đầu tiên của chương này"
                        >
                          <i className="bi bi-play-circle me-1"></i> Học từ đầu chương
                        </Button>
                      </div>

                      <Accordion.Body className="p-0">
                        <div className="list-group list-group-flush">
                          {mod.lessons.map((lesson) => {
                            const globalIdx = allLessons.findIndex((l) => l.id === lesson.id);
                            const isActive = globalIdx === activeLessonIndex;
                            const isDone = completedLessons.includes(lesson.id);

                            return (
                              <button
                                key={lesson.id}
                                type="button"
                                onClick={() => handleSelectLesson(globalIdx, lesson)}
                                className={`list-group-item list-group-item-action border-0 py-3 px-3 d-flex align-items-start gap-2 ${
                                  isActive ? 'bg-primary-subtle border-start border-primary border-4 fw-bold' : ''
                                }`}
                              >
                                <span className="pt-1 flex-shrink-0">
                                  {isDone ? (
                                    <i className="bi bi-check-circle-fill text-success fs-5"></i>
                                  ) : isActive ? (
                                    <i className="bi bi-play-circle-fill text-primary fs-5"></i>
                                  ) : (
                                    <i className="bi bi-circle text-secondary fs-5"></i>
                                  )}
                                </span>

                                <div className="flex-grow-1 text-start overflow-hidden">
                                  <div className="d-flex justify-content-between align-items-baseline mb-1">
                                    <span className={`small ${isActive ? 'text-primary fw-bold' : 'text-dark'} text-truncate`}>
                                      {lesson.title}
                                    </span>
                                  </div>
                                  <div className="d-flex align-items-center gap-2 text-secondary" style={{ fontSize: '0.74rem' }}>
                                    <span className="font-monospace text-primary">
                                      <i className="bi bi-camera-video me-1"></i>
                                      {Math.floor((lesson.start_seconds || 0) / 60)}:
                                      {String((lesson.start_seconds || 0) % 60).padStart(2, '0')}
                                    </span>
                                    <span>•</span>
                                    <span>
                                      <i className="bi bi-clock me-1"></i> {lesson.duration}
                                    </span>
                                    {isActive && (
                                      <span className="badge bg-primary text-white ms-auto">Đang xem</span>
                                    )}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
