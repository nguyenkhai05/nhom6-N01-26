import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

/**
 * TypingText - Inspired by Animate UI (@animate-ui/primitives/texts/typing)
 * Hiệu ứng gõ chữ linh hoạt với con trỏ nhấp nháy, hỗ trợ chu kỳ thay đổi nhiều từ khóa
 */
export default function TypingText({
  texts = [],
  typingSpeed = 80,
  deletingSpeed = 40,
  pauseDuration = 2200,
  className = '',
  cursor = '|',
  cursorClassName = 'text-warning',
}) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!texts.length) return;

    const fullText = texts[currentTextIndex];
    let timeout;

    if (!isDeleting && displayedText.length < fullText.length) {
      timeout = setTimeout(() => {
        setDisplayedText(fullText.slice(0, displayedText.length + 1));
      }, typingSpeed);
    } else if (!isDeleting && displayedText.length === fullText.length) {
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, pauseDuration);
    } else if (isDeleting && displayedText.length > 0) {
      timeout = setTimeout(() => {
        setDisplayedText(fullText.slice(0, displayedText.length - 1));
      }, deletingSpeed);
    } else if (isDeleting && displayedText.length === 0) {
      setIsDeleting(false);
      setCurrentTextIndex((prev) => (prev + 1) % texts.length);
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, currentTextIndex, texts, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <span className={`d-inline-flex align-items-center ${className}`}>
      <span>{displayedText}</span>
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        className={`ms-1 fw-bold ${cursorClassName}`}
        aria-hidden="true"
      >
        {cursor}
      </motion.span>
    </span>
  );
}
