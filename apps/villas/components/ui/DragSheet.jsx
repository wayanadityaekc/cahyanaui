'use client';

import { useRef } from 'react';

const CLOSE_DISTANCE = 90;
const CLOSE_VELOCITY = 0.5;
const SPRING_BACK = 'transform 0.25s var(--ease-out)';

export default function DragSheet({
  enabled,
  onDismiss,
  className,
  handleClassName = 'absolute top-0 left-0 right-0 h-8 z-[2] [touch-action:none] cursor-grab active:cursor-grabbing min-[993px]:hidden',
  children,
  ...rest
}) {
  const ref = useRef(null);
  const drag = useRef(null);

  function onPointerDown(e) {
    if (!enabled || !ref.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { y0: e.clientY, t0: e.timeStamp, dy: 0 };
    ref.current.style.transition = 'none';
  }

  function onPointerMove(e) {
    const dragState = drag.current;
    if (!dragState || !ref.current) return;
    dragState.dy = Math.max(0, e.clientY - dragState.y0);
    ref.current.style.transform = `translateY(${dragState.dy}px)`;
  }

  function onPointerUp(e) {
    const dragState = drag.current;
    if (!dragState || !ref.current) return;
    drag.current = null;
    const sheet = ref.current;
    const velocity = dragState.dy / Math.max(1, e.timeStamp - dragState.t0);

    sheet.style.transition = SPRING_BACK;
    sheet.style.transform = 'translateY(0px)';
    function clear() {
      sheet.style.transition = '';
      sheet.style.transform = '';
      sheet.removeEventListener('transitionend', clear);
    }
    sheet.addEventListener('transitionend', clear);

    if (dragState.dy > CLOSE_DISTANCE || velocity > CLOSE_VELOCITY) onDismiss?.();
  }

  return (
    <div ref={ref} className={className} {...rest}>
      {enabled && (
        <span
          className={handleClassName}
          aria-hidden="true"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />
      )}
      {children}
    </div>
  );
}
