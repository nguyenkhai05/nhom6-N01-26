import { motion } from 'motion/react';

/**
 * ShineEffect - Inspired by Animate UI (@animate-ui/primitives/effects/shine)
 * Vệt ánh sáng chạy lướt qua thẻ hoặc container khi hover
 */
export default function ShineEffect({
  children,
  className = '',
  shineColor = 'rgba(255, 255, 255, 0.35)',
  style = {},
  ...props
}) {
  return (
    <div
      className={`position-relative overflow-hidden group ${className}`}
      style={{ ...style }}
      {...props}
    >
      {children}
      <motion.div
        className="position-absolute top-0 start-0 w-100 h-100 pointer-events-none"
        style={{
          background: `linear-gradient(105deg, transparent 20%, ${shineColor} 50%, transparent 80%)`,
          transform: 'translateX(-100%)',
          zIndex: 3,
        }}
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        aria-hidden="true"
      />
    </div>
  );
}
