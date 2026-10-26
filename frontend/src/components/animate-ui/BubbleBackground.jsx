import { motion } from 'motion/react';

/**
 * BubbleBackground - Inspired by Animate UI (@animate-ui/backgrounds-bubble)
 * Hiệu ứng nền động bong bóng phát sáng mềm mại (Floating Mesh Orbs)
 * Tương thích 100% React 19 + Motion, hiệu năng cao, không cản trở tương tác người dùng.
 */
export default function BubbleBackground({ className = '', children }) {
  const bubbles = [
    {
      id: 1,
      size: 450,
      color: 'radial-gradient(circle, rgba(0, 108, 228, 0.45) 0%, rgba(0, 59, 149, 0.1) 70%, transparent 100%)',
      initial: { x: '-10%', y: '-10%', scale: 1 },
      animate: {
        x: ['-10%', '15%', '-5%', '-10%'],
        y: ['-10%', '10%', '20%', '-10%'],
        scale: [1, 1.15, 0.95, 1],
      },
      duration: 16,
    },
    {
      id: 2,
      size: 380,
      color: 'radial-gradient(circle, rgba(56, 189, 248, 0.35) 0%, rgba(99, 102, 241, 0.15) 60%, transparent 100%)',
      initial: { x: '80%', y: '10%', scale: 1.1 },
      animate: {
        x: ['80%', '65%', '90%', '80%'],
        y: ['10%', '-15%', '25%', '10%'],
        scale: [1.1, 0.9, 1.2, 1.1],
      },
      duration: 20,
    },
    {
      id: 3,
      size: 320,
      color: 'radial-gradient(circle, rgba(255, 183, 0, 0.22) 0%, rgba(245, 158, 11, 0.05) 60%, transparent 100%)',
      initial: { x: '40%', y: '60%', scale: 0.9 },
      animate: {
        x: ['40%', '25%', '55%', '40%'],
        y: ['60%', '40%', '70%', '60%'],
        scale: [0.9, 1.1, 1, 0.9],
      },
      duration: 18,
    },
    {
      id: 4,
      size: 300,
      color: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, rgba(30, 58, 138, 0.1) 70%, transparent 100%)',
      initial: { x: '10%', y: '70%', scale: 1 },
      animate: {
        x: ['10%', '30%', '-5%', '10%'],
        y: ['70%', '50%', '85%', '70%'],
        scale: [1, 1.2, 0.9, 1],
      },
      duration: 22,
    },
  ];

  return (
    <div className={`position-relative overflow-hidden ${className}`}>
      {/* Container chứa các bong bóng động */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100 overflow-hidden pointer-events-none"
        style={{ zIndex: 0, filter: 'blur(50px)', opacity: 0.85 }}
        aria-hidden="true"
      >
        {bubbles.map((b) => (
          <motion.div
            key={b.id}
            initial={b.initial}
            animate={b.animate}
            transition={{
              duration: b.duration,
              repeat: Infinity,
              repeatType: 'mirror',
              ease: 'easeInOut',
            }}
            style={{
              position: 'absolute',
              width: b.size,
              height: b.size,
              borderRadius: '50%',
              background: b.color,
              willChange: 'transform',
            }}
          />
        ))}
      </div>

      {/* Grid pattern công nghệ bán trong suốt tăng độ sắc nét */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100 pointer-events-none"
        style={{
          zIndex: 1,
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '36px 36px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 85%)',
        }}
        aria-hidden="true"
      />

      {/* Nội dung thực tế của component */}
      <div className="position-relative" style={{ zIndex: 2 }}>
        {children}
      </div>
    </div>
  );
}
