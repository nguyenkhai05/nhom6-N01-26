import { useState } from 'react';
import { motion } from 'motion/react';

/**
 * RippleButton - Inspired by Animate UI (@animate-ui/primitives/buttons/ripple)
 * Nút bấm với làn sóng ripple tỏa ra từ điểm click chuột
 */
export default function RippleButton({
  children,
  onClick,
  type = 'button',
  className = '',
  rippleColor = 'rgba(255, 255, 255, 0.45)',
  style = {},
  disabled = false,
  ...props
}) {
  const [ripples, setRipples] = useState([]);

  const handleClick = (e) => {
    if (disabled) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = {
      id: Date.now() + Math.random(),
      x,
      y,
      size,
    };

    setRipples((prev) => [...prev, newRipple]);
    onClick?.(e);
  };

  const removeRipple = (id) => {
    setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
  };

  return (
    <motion.button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`position-relative overflow-hidden border-0 d-inline-flex align-items-center justify-content-center ${className}`}
      style={{
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...style,
      }}
      {...props}
    >
      {/* Các vòng sóng Ripple */}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="position-absolute rounded-circle pointer-events-none"
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          onAnimationComplete={() => removeRipple(ripple.id)}
          style={{
            top: ripple.y,
            left: ripple.x,
            width: ripple.size,
            height: ripple.size,
            backgroundColor: rippleColor,
            zIndex: 1,
          }}
          aria-hidden="true"
        />
      ))}

      {/* Nội dung nút */}
      <span className="position-relative d-inline-flex align-items-center justify-content-center gap-2 w-100" style={{ zIndex: 2 }}>
        {children}
      </span>
    </motion.button>
  );
}
