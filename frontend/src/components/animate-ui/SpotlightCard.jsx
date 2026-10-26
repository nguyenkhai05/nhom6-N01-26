import { useState, useRef } from 'react';
import { motion } from 'motion/react';

/**
 * SpotlightCard - Inspired by Animate UI (@animate-ui/spotlight-card)
 * Hiệu ứng vệt sáng Spotlight di chuyển theo con trỏ chuột
 * Tạo chiều sâu thị giác và cảm giác tương tác mượt mà cao cấp
 */
export default function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(0, 108, 228, 0.18)',
  borderColor = 'rgba(0, 108, 228, 0.35)',
  ...props
}) {
  const cardRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`position-relative rounded-4 overflow-hidden ${className}`}
      style={{
        boxShadow: isHovered
          ? '0 14px 30px rgba(0, 59, 149, 0.12), 0 4px 10px rgba(0, 0, 0, 0.04)'
          : '0 2px 8px rgba(0, 0, 0, 0.05)',
        transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
      }}
      {...props}
    >
      {/* Lớp Spotlight phát sáng theo chuột */}
      {isHovered && (
        <div
          className="position-absolute top-0 start-0 w-100 h-100 pointer-events-none"
          style={{
            zIndex: 1,
            background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, ${spotlightColor}, transparent 70%)`,
            transition: 'opacity 0.2s ease',
          }}
          aria-hidden="true"
        />
      )}

      {/* Đường viền sáng vi tính */}
      {isHovered && (
        <div
          className="position-absolute top-0 start-0 w-100 h-100 pointer-events-none rounded-4"
          style={{
            zIndex: 1,
            border: `1.5px solid ${borderColor}`,
            maskImage: `radial-gradient(280px circle at ${mousePosition.x}px ${mousePosition.y}px, black 40%, transparent 100%)`,
            WebkitMaskImage: `radial-gradient(280px circle at ${mousePosition.x}px ${mousePosition.y}px, black 40%, transparent 100%)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Nội dung card bên trong */}
      <div className="position-relative" style={{ zIndex: 2 }}>
        {children}
      </div>
    </motion.div>
  );
}
