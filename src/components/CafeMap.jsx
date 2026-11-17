import { RotateCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { hoursLabel } from '../lib/live.js';
import { useStore } from '../store.jsx';
import CafeArt from './CafeArt.jsx';

// Stylised (not to scale) map of the ERICA area. Coordinates are % of the map.
const LABELS = [
  { x: 61, y: 17, t: 'ERICA\n캠퍼스' },
  { x: 37, y: 31, t: '정문' },
  { x: 73, y: 7, t: '후문' },
  { x: 74, y: 30, t: '사동공원' },
  { x: 86, y: 58, t: '사동' },
  { x: 16, y: 82, t: '본오동' },
  { x: 60, y: 94, t: '한대앞역 (4호선)' },
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

export default function CafeMap({ cafes, purpose, activeId, onSelect, dimIds = [] }) {
  const { showToast } = useStore();
  const active = cafes.find((c) => c.id === activeId);
  return (
    <div className="map" aria-label="ERICA 주변 카페 지도">
      <MapBase />
      {LABELS.map((l) => (
        <span key={l.t} className="map-label" style={{ left: `${l.x}%`, top: `${l.y}%`, whiteSpace: 'pre-line' }}>
          {l.t}
        </span>
      ))}
      <button className="btn btn-secondary btn-sm map-refresh" onClick={() => showToast('이 지역의 카페를 다시 찾았어요')}>
        <RotateCw size={14} /> 이 지역에서 다시 찾기
      </button>
      {cafes.map((c) => (
        <button
          key={c.id}
          className={`pin ${c.id === activeId ? 'is-active' : ''} ${dimIds.includes(c.id) ? 'is-dim' : ''}`}
          style={{ left: `${c.map.x}%`, top: `${c.map.y}%` }}
          onClick={() => onSelect(c.id)}
          aria-label={`${c.name}, 적합도 ${c.scores[purpose]}점`}
        >
          <span className="bubble num">{c.scores[purpose]}</span>
          <span className="tip" />
        </button>
      ))}
      {active && (
        <div className="map-preview">
          <div className="thumb">
            <CafeArt art={active.art} label={active.name} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div className="h3">{active.name}</div>
            <div className="muted" style={{ fontSize: 13 }}>
              {active.area} · 도보 {active.walk}분 · {hoursLabel(active)}
            </div>
            <Link to={`/cafe/${active.id}`} className="link-arrow" style={{ marginTop: 4 }}>
              상세 정보 보기 →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
