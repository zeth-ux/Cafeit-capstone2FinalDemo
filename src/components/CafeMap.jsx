import { LocateFixed, Minus, Plus, RotateCw } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { hoursLabel } from '../lib/live.js';
import { useStore } from '../store.jsx';
import CafeArt from './CafeArt.jsx';

// Stylised (not to scale) map of the ERICA area. Coordinates are % of the map.
const LABELS = [
  { x: 61, y: 17, t: 'ERICA\n캠퍼스', en: 'ERICA\nCampus' },
  { x: 37, y: 31, t: '정문', en: 'Main Gate' },
  { x: 73, y: 7, t: '후문', en: 'Back Gate' },
  { x: 74, y: 30, t: '사동공원', en: 'Sadong Park' },
  { x: 86, y: 58, t: '사동', en: 'Sa-dong' },
  { x: 16, y: 82, t: '본오동', en: 'Bono-dong' },
  { x: 60, y: 94, t: '한대앞역 (4호선)', en: 'Handae-ap Stn. (Line 4)' },
];

export function MapBase() {
  return (
    <svg className="base" viewBox="0 0 700 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="700" height="600" fill="#EFE5D8" />
      {/* blocks */}
      {Array.from({ length: 30 }).map((_, i) => {
        const x = (i % 6) * 120 + 10;
        const y = Math.floor(i / 6) * 120 + 190;
        return <rect key={i} x={x} y={y} width="96" height="92" rx="10" fill="#E8DCCB" />;
      })}
      {/* campus */}
      <path d="M190 10 Q350 -20 520 30 Q560 120 470 170 Q350 200 230 165 Q150 120 190 10Z" fill="#D9DDBF" />
      <path d="M470 160 q40 20 70 0 q30 -30 0 -50 q-40 -10 -70 50z" fill="#CDD5AE" />
      {/* stream */}
      <path d="M0 330 C120 300 140 420 230 470 C300 510 260 600 260 600 L180 600 C200 540 200 510 140 480 C80 450 60 380 0 390Z" fill="#C6CCE2" />
      {/* roads */}
      <path d="M0 210 L700 180" stroke="#FFF" strokeWidth="26" />
      <path d="M280 0 L330 600" stroke="#FFF" strokeWidth="22" />
      <path d="M540 0 L470 600" stroke="#FFF" strokeWidth="18" />
      <path d="M0 470 L700 410" stroke="#FFF" strokeWidth="16" />
      <path d="M90 600 L600 260" stroke="#FFF" strokeWidth="14" />
      {/* rail */}
      <path d="M0 566 L700 548" stroke="#8C8B7D" strokeWidth="6" />
      <path d="M0 566 L700 548" stroke="#EFE5D8" strokeWidth="3" strokeDasharray="14 12" />
      <rect x="390" y="540" width="60" height="22" rx="6" fill="#302F03" />
    </svg>
  );
}

const MIN = 1;
const MAX = 3;
const EDGE = 0.2; // how far (share of the map) you can drag past the edge

// Drag to move, wheel or +/- to zoom. Our own drawn map, so no map API is needed.
function usePanZoom() {
  const ref = useRef(null);
  const [view, setView] = useState({ s: 1, x: 0, y: 0 });
  const drag = useRef(null);

  const clamp = useCallback((v) => {
    const el = ref.current;
    if (!el) return v;
    const W = el.clientWidth;
    const H = el.clientHeight;
    const s = Math.min(MAX, Math.max(MIN, v.s));
    const minX = W - W * s - W * EDGE;
    const minY = H - H * s - H * EDGE;
    return { s, x: Math.min(W * EDGE, Math.max(minX, v.x)), y: Math.min(H * EDGE, Math.max(minY, v.y)) };
  }, []);

  const zoomAt = useCallback(
    (factor, px, py) => {
      setView((v) => {
        const el = ref.current;
        const cx = px ?? el.clientWidth / 2;
        const cy = py ?? el.clientHeight / 2;
        const s = Math.min(MAX, Math.max(MIN, v.s * factor));
        const k = s / v.s;
        return clamp({ s, x: cx - (cx - v.x) * k, y: cy - (cy - v.y) * k });
      });
    },
    [clamp],
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const onWheel = (e) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      zoomAt(e.deltaY < 0 ? 1.15 : 1 / 1.15, e.clientX - r.left, e.clientY - r.top);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [zoomAt]);

  const handlers = {
    onPointerDown: (e) => {
      if (e.button !== 0 || e.target.closest('button, a, .map-preview')) return;
      drag.current = { px: e.clientX, py: e.clientY, x: view.x, y: view.y };
      e.currentTarget.setPointerCapture(e.pointerId);
      e.currentTarget.classList.add('is-dragging');
    },
    onPointerMove: (e) => {
      const d = drag.current;
      if (!d) return;
      setView((v) => clamp({ s: v.s, x: d.x + e.clientX - d.px, y: d.y + e.clientY - d.py }));
    },
    onPointerUp: (e) => {
      drag.current = null;
      e.currentTarget.classList.remove('is-dragging');
    },
  };
  handlers.onPointerCancel = handlers.onPointerUp;

  return { ref, view, handlers, zoomAt, reset: () => setView({ s: 1, x: 0, y: 0 }) };
}

// position of something placed at (x%, y%) of the map, after pan + zoom
const at = (pct, axis) => `calc(${pct}% * var(--s) + var(--t${axis}))`;

export default function CafeMap({ cafes, purpose, activeId, onSelect, dimIds = [] }) {
  const { showToast, t, lang } = useStore();
  const active = cafes.find((c) => c.id === activeId);
  const { ref, view, handlers, zoomAt, reset } = usePanZoom();
  return (
    <div
      ref={ref}
      className="map is-movable"
      aria-label={t('ERICA 주변 카페 지도', 'Map of cafés near ERICA')}
      style={{ '--s': view.s, '--tx': `${view.x}px`, '--ty': `${view.y}px` }}
      {...handlers}
    >
      <div className="map-world" style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.s})` }}>
        <MapBase />
      </div>
      {LABELS.map((l) => (
        <span key={l.t} className="map-label" style={{ left: at(l.x, 'x'), top: at(l.y, 'y'), whiteSpace: 'pre-line' }}>
          {lang === 'en' ? l.en : l.t}
        </span>
      ))}
      <button className="btn btn-secondary btn-sm map-refresh" onClick={() => showToast(t('이 지역의 카페를 다시 찾았어요', 'Searched this area again'))}>
        <RotateCw size={14} /> {t('이 지역에서 다시 찾기', 'Search this area')}
      </button>
      <div className="map-zoom" role="group" aria-label={t('지도 확대/축소', 'Map zoom')}>
        <button type="button" onClick={() => zoomAt(1.3)} disabled={view.s >= MAX} aria-label={t('확대', 'Zoom in')}>
          <Plus size={16} />
        </button>
        <button type="button" onClick={() => zoomAt(1 / 1.3)} disabled={view.s <= MIN} aria-label={t('축소', 'Zoom out')}>
          <Minus size={16} />
        </button>
        <button type="button" onClick={reset} aria-label={t('처음 위치로', 'Reset view')}>
          <LocateFixed size={16} />
        </button>
      </div>
      {cafes.map((c) => (
        <button
          key={c.id}
          className={`pin ${c.id === activeId ? 'is-active' : ''} ${dimIds.includes(c.id) ? 'is-dim' : ''}`}
          style={{ left: at(c.map.x, 'x'), top: at(c.map.y, 'y') }}
          onClick={() => onSelect(c.id)}
          aria-label={t(`${c.name}, 적합도 ${c.scores[purpose]}점`, `${c.name}, fit ${c.scores[purpose]}`)}
        >
          <span className="bubble num">{c.scores[purpose]}</span>
          <span className="tip" />
        </button>
      ))}
      {active && (
        <div className="map-preview">
          <div className="thumb">
            <CafeArt art={active.art} id={active.id} label={active.name} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div className="h3">{active.name}</div>
            <div className="muted" style={{ fontSize: 13 }}>
              {active.area} · {t(`도보 ${active.walk}분`, `${active.walk} min walk`)} · {hoursLabel(active)}
            </div>
            <Link to={`/cafe/${active.id}`} className="link-arrow" style={{ marginTop: 4 }}>
              {t('상세 정보 보기 →', 'View details →')}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
