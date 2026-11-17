import { useEffect, useMemo, useState } from 'react';
import { useStore } from '../store.jsx';

// Isometric "topographic" mini-map of the ERICA area for the landing hero.
// Plane coords (x, y) are projected to screen with a 2:1 isometric matrix.
const CX = 430;
const CY = 330;
const iso = (x, y) => [CX + 0.866 * (x - y), CY + 0.5 * (x + y)];

function ring(a, b, i, n = 4, steps = 140) {
  const pts = [];
  for (let k = 0; k <= steps; k++) {
    const th = (k / steps) * Math.PI * 2;
    const c = Math.cos(th);
    const s = Math.sin(th);
    const wob = 1 + (0.015 + i * 0.0035) * Math.sin(4 * th + i * 0.55) + (0.01 + i * 0.003) * Math.sin(7 * th - i * 0.35);
    const x = a * wob * Math.sign(c) * Math.pow(Math.abs(c), 2 / n);
    const y = b * wob * Math.sign(s) * Math.pow(Math.abs(s), 2 / n);
    const [X, Y] = iso(x, y);
    pts.push(`${X.toFixed(1)},${Y.toFixed(1)}`);
  }
  return `M${pts.join('L')}Z`;
}

function planePath(points) {
  return points.map(([x, y], i) => `${i ? 'L' : 'M'}${iso(x, y).map((v) => v.toFixed(1)).join(',')}`).join('');
}

export default function HeroTopo({ purpose = 'study' }) {
  const { cafes, t } = useStore();
  const [active, setActive] = useState(0);

  const rings = useMemo(() => Array.from({ length: 22 }, (_, i) => ring(176 + i * 15, 132 + i * 15, i)), []);
  const tile = useMemo(() => ring(170, 126, 0, 5), []);
  const ranked = useMemo(() => [...cafes].sort((a, b) => b.scores[purpose] - a.scores[purpose]), [cafes, purpose]);

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % 4), 2200);
    return () => clearInterval(t);
  }, []);

  const pinAt = (c) => iso((c.map.x / 100 - 0.5) * 290, (c.map.y / 100 - 0.5) * 210);

  return (
    <svg viewBox="0 0 860 660" className="lp-topo" role="img" aria-label="ERICA 주변 카페 지도 일러스트">
      <defs>
        <filter id="lpGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="lpHalo">
          <stop offset="0" stopColor="#E2C96D" stopOpacity="0.55" />
          <stop offset="1" stopColor="#E2C96D" stopOpacity="0" />
        </radialGradient>
      </defs>

      {rings.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="#6C3100" strokeOpacity={0.32 - i * 0.012} strokeWidth="1.2" className="lp-ring" style={{ animationDelay: `${i * 60}ms` }} />
      ))}

      {/* map tile */}
      <path d={tile} fill="#FFFDF8" stroke="#6C3100" strokeWidth="3" filter="url(#lpGlow)" />
      {/* campus */}
      <path d={planePath([[-90, -105], [40, -112], [70, -60], [10, -40], [-80, -50]])} fill="#DCE1C4" />
      {/* stream */}
      <path d={planePath([[-150, 10], [-90, 20], [-60, 70], [-40, 110], [-70, 110], [-95, 60], [-150, 40]])} fill="#C6CCE2" />
      {/* roads */}
      {[
        [[-160, -30], [160, -40]],
        [[-40, -120], [-20, 120]],
        [[70, -120], [50, 120]],
        [[-160, 60], [160, 50]],
      ].map((r, i) => (
        <path key={i} d={planePath(r)} stroke="#EFE5D8" strokeWidth="9" strokeLinecap="round" fill="none" />
      ))}
      {/* rail */}
      <path d={planePath([[-160, 100], [160, 92]])} stroke="#8C8B7D" strokeWidth="3" strokeDasharray="8 6" fill="none" />

      {/* pins */}
      {ranked.map((c, i) => {
        const [x, y] = pinAt(c);
        const on = i === active;
        const top = i < 4;
        return (
          <g key={c.id} className="lp-pin" style={{ animationDelay: `${i * 120}ms` }}>
            {on && <circle cx={x} cy={y} r="46" fill="url(#lpHalo)" className="lp-halo" />}
            <ellipse cx={x} cy={y} rx="9" ry="4.5" fill="#302F03" opacity="0.18" />
            <line x1={x} y1={y} x2={x} y2={y - 26} stroke={on ? '#8C0200' : '#302F03'} strokeWidth="2" />
            <rect x={x - 21} y={y - 52} width="42" height="26" rx="13" fill={on ? '#8C0200' : top ? '#302F03' : '#8C8B7D'} />
            <text x={x} y={y - 34.5} textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff" fontFamily="Inter, sans-serif">
              {c.scores[purpose]}
            </text>
          </g>
        );
      })}
      {ranked.slice(active, active + 1).map((c) => {
        const [x, y] = pinAt(c);
        const w = c.name.length * 13 + 44;
        return (
          <g key={`label-${c.id}`} className="lp-label">
            <rect x={x + 26} y={y - 62} width={w} height="42" rx="12" fill="#fff" stroke="#E6E4DC" />
            <text x={x + 40} y={y - 45} fontSize="12.5" fontWeight="800" fill="#1A1A14" fontFamily="'Noto Sans KR', sans-serif">
              {c.name}
            </text>
            <text x={x + 40} y={y - 29} fontSize="10.5" fontWeight="600" fill="#5F5E52" fontFamily="'Noto Sans KR', sans-serif">
              {c.area} · {t(`${c.walk}분`, `${c.walk} min`)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
