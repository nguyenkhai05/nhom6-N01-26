import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';

export default function GoogleAccountChooserModal({
  show,
  onHide,
  onSelectAccount,
  loading = false,
  originHost = 'eduviet-academy.vercel.app',
}) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [selectedAccountEmail, setSelectedAccountEmail] = useState('');

  const accounts = [
    {
      name: 'Son Nguyễn',
      email: 'nuicuti15@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      initial: 'S',
      type: 'photo',
    },
    {
      name: 'Son Nguyen',
      email: 'sonn0924@gmail.com',
      avatar: null,
      initial: 'S',
      type: 'outline',
    },
  ];

  const handleChoose = (account) => {
    setSelectedAccountEmail(account.email);
    onSelectAccount({
      email: account.email,
      full_name: account.name,
      avatar_url: account.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    });
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    const email = customEmail.trim().toLowerCase();
    if (!email || !email.includes('@')) return;
    const name = customName.trim() || email.split('@')[0];
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
    setSelectedAccountEmail(email);
    onSelectAccount({
      email,
      full_name: formattedName,
      avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(formattedName)}&background=0D8ABC&color=fff`,
    });
  };

  const handleClose = () => {
    setShowCustomInput(false);
    setSelectedAccountEmail('');
    onHide();
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop="static"
      keyboard={!loading}
      dialogClassName="google-account-chooser-dialog"
      contentClassName="google-account-chooser-content"
    >
      <div className="google-chooser-container">
        {/* Top bar with Google Branding & Close Button */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.79l7.97-6.2z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            <span className="google-top-brand-text">Đăng nhập bằng Google</span>
          </div>
          {!loading && (
            <button
              type="button"
              className="google-close-btn"
              onClick={handleClose}
              title="Đóng"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          )}
        </div>

        {/* Title & Host info */}
        <div className="mb-4">
          <h2 className="google-chooser-title">Chọn tài khoản</h2>
          <p className="google-chooser-subtitle">
            Tiếp tục tới <span className="google-host-highlight">{originHost}</span>
          </p>
        </div>

        {/* Loading Spinner State */}
        {loading && (
          <div className="google-loading-panel text-center py-4">
            <div className="google-spinner mb-3">
              <div className="spinner-inner"></div>
            </div>
            <div className="text-light fw-medium mb-1">
              Đang đăng nhập với {selectedAccountEmail || 'Google'}...
            </div>
            <small className="text-secondary">Đang chuyển tiếp bảo mật tới EduViet Platform</small>
          </div>
        )}

        {/* Account List View */}
        {!loading && !showCustomInput && (
          <div className="google-accounts-list">
            {accounts.map((acc, index) => (
              <React.Fragment key={acc.email}>
                <button
                  type="button"
                  className="google-account-row"
                  onClick={() => handleChoose(acc)}
                >
                  <div className="google-avatar-box">
                    {acc.type === 'photo' ? (
                      <img
                        src={acc.avatar}
                        alt={acc.name}
                        className="google-avatar-img"
                      />
                    ) : (
                      <div className="google-avatar-outline">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="google-account-info">
                    <div className="google-account-name">{acc.name}</div>
                    <div className="google-account-email">{acc.email}</div>
                  </div>
                </button>
                <div className="google-divider" />
              </React.Fragment>
            ))}

            {/* Sử dụng một tài khoản khác */}
            <button
              type="button"
              className="google-account-row google-add-account-row"
              onClick={() => setShowCustomInput(true)}
            >
              <div className="google-avatar-box">
                <div className="google-avatar-outline">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="8.5" cy="7" r="4"></circle>
                    <line x1="20" y1="8" x2="20" y2="14"></line>
                    <line x1="23" y1="11" x2="17" y2="11"></line>
                  </svg>
                </div>
              </div>
              <div className="google-account-info">
                <div className="google-account-name fw-normal">Sử dụng một tài khoản khác</div>
              </div>
            </button>
          </div>
        )}

        {/* Custom Account Input Form */}
        {!loading && showCustomInput && (
          <form onSubmit={handleCustomSubmit} className="google-custom-form">
            <div className="mb-3">
              <label className="google-form-label">Email hoặc số điện thoại Google</label>
              <input
                type="email"
                className="google-form-input"
                placeholder="example@gmail.com"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                autoFocus
                required
              />
            </div>
            <div className="mb-4">
              <label className="google-form-label">Họ và tên hiển thị (Tùy chọn)</label>
              <input
                type="text"
                className="google-form-input"
                placeholder="Ví dụ: Son Nguyễn"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
              />
            </div>

            <div className="d-flex align-items-center justify-content-between pt-2">
              <button
                type="button"
                className="google-btn-text"
                onClick={() => setShowCustomInput(false)}
              >
                Quay lại
              </button>
              <button
                type="submit"
                className="google-btn-primary"
                disabled={!customEmail.trim() || !customEmail.includes('@')}
              >
                Tiếp theo
              </button>
            </div>
          </form>
        )}

        {/* Bottom Footer Bar */}
        <div className="google-chooser-footer">
          <div className="google-footer-lang">
            <span>Tiếng Việt</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 10l5 5 5-5z"/>
            </svg>
          </div>
          <div className="google-footer-links">
            <a href="https://support.google.com/accounts" target="_blank" rel="noreferrer">Trợ giúp</a>
            <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Quyền riêng tư</a>
            <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer">Điều khoản</a>
          </div>
        </div>
      </div>
    </Modal>
  );
}
