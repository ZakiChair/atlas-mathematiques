import { useRef, useState, type ReactNode } from 'react';
import { useLang } from '../i18n/lang';

/** Bottom sheet mobile : deux positions (35 % / 90 %), glisser pour changer. */
export function Sheet({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  const { t } = useLang();
  const [snap, setSnap] = useState<'half' | 'full'>('half');
  const [dragY, setDragY] = useState(0);
  const startY = useRef(0);
  const dragging = useRef(false);

  const height = snap === 'half' ? 35 : 90;

  return (
    <div
      data-testid="panel-sheet"
      className="glass fixed left-0 right-0 bottom-0 z-40 rounded-t-2xl flex flex-col overflow-hidden"
      style={{
        height: `${height}dvh`,
        transform: dragY ? `translateY(${dragY}px)` : undefined,
        transition: dragging.current ? 'none' : 'height 250ms ease, transform 200ms ease',
      }}
      role="dialog"
      aria-label={t('sheet.aria')}
    >
      <div
        className="py-3 flex justify-center cursor-grab touch-none shrink-0"
        onPointerDown={(e) => {
          dragging.current = true;
          startY.current = e.clientY;
          (e.target as Element).setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!dragging.current) return;
          setDragY(Math.max(-80, e.clientY - startY.current));
        }}
        onPointerUp={(e) => {
          if (!dragging.current) return;
          dragging.current = false;
          const dy = e.clientY - startY.current;
          setDragY(0);
          if (dy < -40) setSnap('full');
          else if (dy > 60) {
            if (snap === 'full') setSnap('half');
            else onClose();
          }
        }}
        aria-label={t('sheet.handle')}
      >
        <div className="w-10 h-1.5 rounded-full bg-white/30" />
      </div>
      <div className="flex-1 overflow-auto panel-scroll">{children}</div>
    </div>
  );
}
