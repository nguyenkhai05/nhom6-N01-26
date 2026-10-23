import { useCallback, useEffect, useRef, useState } from 'react';

// Hàng thẻ cuộn ngang có nút mũi tên tròn như mẫu Booking.com.
export default function ScrollRow({ children, className = '' }) {
  const ref = useRef(null);
  const [edge, setEdge] = useState({ start: true, end: true });

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setEdge({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    update();
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [update]);

  useEffect(update);

  const scrollBy = (dir) =>
    ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: 'smooth' });

  return (
    <div className="bv-row">
      <div ref={ref} className={`bv-track ${className}`} onScroll={update}>
        {children}
      </div>
      {!edge.start && (
        <button type="button" className="bv-arrow bv-arrow-prev" aria-label="Xem trước" onClick={() => scrollBy(-1)}>
          <i className="bi bi-chevron-left" />
        </button>
      )}
      {!edge.end && (
        <button type="button" className="bv-arrow bv-arrow-next" aria-label="Xem tiếp" onClick={() => scrollBy(1)}>
          <i className="bi bi-chevron-right" />
        </button>
      )}
    </div>
  );
}
