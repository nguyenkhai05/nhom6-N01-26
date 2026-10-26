import { motion } from 'motion/react';

/**
 * SlidingTabs - Inspired by Animate UI (@animate-ui/tabs)
 * Thanh Tabs chuyển đổi với con trượt vật lý lò xo (Spring Physics Slider)
 * Cung cấp phản hồi tương tác mượt mà chuẩn Booking.com cao cấp
 */
export default function SlidingTabs({
  tabs = [],
  activeTab,
  onTabChange,
  className = '',
  pillColor = 'rgba(255, 255, 255, 0.18)',
  activeTextColor = '#ffffff',
  inactiveTextColor = 'rgba(255, 255, 255, 0.85)',
}) {
  return (
    <div
      className={`d-flex align-items-center gap-1 p-1 rounded-pill position-relative ${className}`}
      style={{
        background: 'rgba(0, 0, 0, 0.12)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
      }}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.id)}
            className="position-relative border-0 bg-transparent px-3 py-2 rounded-pill d-flex align-items-center gap-2 fw-semibold text-nowrap transition-colors"
            style={{
              color: isActive ? activeTextColor : inactiveTextColor,
              fontSize: '0.88rem',
              zIndex: 2,
              cursor: 'pointer',
            }}
          >
            {/* Lớp nền trượt động (Spring Layout Animation) */}
            {isActive && (
              <motion.span
                layoutId="activeTabPill"
                className="position-absolute top-0 start-0 w-100 h-100 rounded-pill shadow-sm"
                style={{
                  background: pillColor,
                  border: '1px solid rgba(255, 255, 255, 0.35)',
                  zIndex: -1,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 450,
                  damping: 32,
                }}
              />
            )}

            {tab.icon && (
              <i
                className={`${tab.icon} ${
                  isActive ? 'text-warning' : ''
                }`}
                style={{ fontSize: '1.05rem' }}
              />
            )}
            <span>{tab.label}</span>
            {tab.badge && (
              <span
                className="badge rounded-pill bg-danger ms-1"
                style={{ fontSize: '0.65rem' }}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
