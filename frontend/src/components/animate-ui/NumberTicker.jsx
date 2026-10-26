import { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'motion/react';

/**
 * NumberTicker - Inspired by Animate UI (@animate-ui/number-ticker)
 * Hiệu ứng nhảy số mượt mà khi người dùng cuộn tới phần tử
 */
export default function NumberTicker({
  value,
  direction = 'up',
  delay = 0,
  className = '',
  formatter = (val) => Math.round(val).toLocaleString('vi-VN'),
}) {
  const ref = useRef(null);
  const motionValue = useMotionValue(direction === 'down' ? value : 0);
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: '0px' });

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        motionValue.set(direction === 'down' ? 0 : value);
      }, delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [isInView, delay, value, direction, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = formatter(latest);
      }
    });
    return () => unsubscribe();
  }, [springValue, formatter]);

  return (
    <span
      ref={ref}
      className={`d-inline-block tabular-nums ${className}`}
    >
      {formatter(direction === 'down' ? value : 0)}
    </span>
  );
}
