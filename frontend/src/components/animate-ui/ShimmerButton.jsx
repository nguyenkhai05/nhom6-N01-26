import { motion } from 'motion/react';

/**
 * ShimmerButton - Inspired by Animate UI (@animate-ui/shimmer-button)
 * Nút bấm với vệt sáng ánh kim quét qua theo chu kỳ
 * Hoàn hảo cho các nút CTA, nút Tìm kiếm vàng Booking (#ffb700)
 */
export default function ShimmerButton({
  children,
  onClick,
  type = 'button',
  className = '',
  shimmerColor = 'rgba(255, 255, 255, 0.45)',
  style = {},
  ...props
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`position-relative overflow-hidden border-0 fw-bold d-inline-flex align-items-center justify-content-center gap-2 ${className}`}
      style={{
        cursor: 'pointer',
        ...style,
      }}
      {...props}
    >
      {/* Vệt sáng Shimmer quét qua */}
      <motion.div
        className="position-absolute top-0 start-0 w-100 h-100 pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${shimmerColor} 50%, transparent 100%)`,
          transform: 'skewX(-25deg)',
          zIndex: 1,
        }}
        initial={{ x: '-150%' }}
        animate={{ x: ['150%', '-150%'] }}
        transition={{
          repeat: Infinity,
          repeatDelay: 2.8,
          duration: 1.4,
          ease: 'easeInOut',
        }}
        aria-hidden="true"
      />

      {/* Nội dung nút */}
      <span className="position-relative" style={{ zIndex: 2 }}>
        {children}
      </span>
    </motion.button>
  );
}
