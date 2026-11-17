import { useId, useMemo } from 'react';

// Decorative layer kit: topographic lines, radar rings, rotating sticker,
// ticker ribbon and hand-drawn scribbles. All pure SVG/CSS, no images.

function topoRing(cx, cy, a, b, i, seed) {
  const pts = [];
  const steps = 120;
  for (let k = 0; k <= steps; k++) {
    const th = (k / steps) * Math.PI * 2;
    const w = 1 + 0.06 * Math.sin(3 * th + i * 0.45 + seed) + 0.035 * Math.sin(5 * th - i * 0.3 + seed * 2) + 0.02 * Math.sin(9 * th + seed);
    pts.push(`${(cx + a * w * Math.cos(th)).toFixed(1)},${(cy + b * w * Math.sin(th)).toFixed(1)}`);
  }
  return `M${pts.join('L')}Z`;
}

// Flat topographic contour lines. Place inside a position:relative parent.
export function Topo({ color = '#6C3100', opacity = 0.16, rings = 18, cx = 70, cy = 40, seed = 1, className = '' }) {
  const paths = useMemo(() => {
    const out = [];
    for (let i = 0; i < rings; i++) out.push(topoRing(cx * 10, cy * 6, 40 + i * 42, 30 + i * 30, i, seed));
    // second smaller peak
    for (let i = 0; i < Math.round(rings / 2.5); i++) out.push(topoRing(cx * 10 - 520, cy * 6 + 300, 30 + i * 34, 22 + i * 26, i + 3, seed + 2));
    return out;
  }, [rings, cx, cy, seed]);
  return (
    <svg className={`decor-topo ${className}`} viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {paths.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={color} strokeOpacity={opacity} strokeWidth="1.3" vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  );
}

// Concentric "signal" rings for LIVE.
export function Radar({ color = '#E2C96D', className = '' }) {
  return (
    <svg className={`decor-radar ${className}`} viewBox="0 0 600 600" aria-hidden="true">
      {Array.from({ length: 9 }).map((_, i) => (
        <circle key={i} cx="300" cy="300" r={30 + i * 34} fill="none" stroke={color} strokeOpacity={0.5 - i * 0.045} strokeWidth="1.2" strokeDasharray={i % 2 ? '4 8' : 'none'} />
      ))}
      <circle cx="300" cy="300" r="30" fill="none" stroke={color} strokeWidth="2" className="radar-pulse" />
      <circle cx="300" cy="300" r="30" fill="none" stroke={color} strokeWidth="2" className="radar-pulse" style={{ animationDelay: '3s' }} />
      <circle cx="300" cy="300" r="8" fill={color} />
    </svg>
  );
}

// Rotating circular sticker with text on a path.
export function Sticker({ text = 'CAFEIT ✦ ERICA ✦ LIVE ✦ ', center, size = 128, bg = '#E2C96D', fg = '#302F03', className = '', style }) {
  const id = useId().replace(/:/g, '');
  const repeated = text.repeat(Math.max(1, Math.round(40 / text.length)));
  return (
    <div className={`sticker ${className}`} style={{ width: size, height: size, ...style }} aria-hidden="true">
      <svg viewBox="0 0 200 200" className="sticker-ring">
        <defs>
          <path id={`c${id}`} d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" />
        </defs>
        <circle cx="100" cy="100" r="98" fill={bg} />
        <circle cx="100" cy="100" r="58" fill="none" stroke={fg} strokeOpacity="0.25" strokeDasharray="3 5" />
        <text fill={fg} fontSize="17" fontWeight="800" letterSpacing="3" fontFamily="'Black Han Sans', Inter, sans-serif">
          <textPath href={`#c${id}`}>{repeated}</textPath>
        </text>
      </svg>
      <div className="sticker-center" style={{ color: fg }}>
        {center}
      </div>
    </div>
  );
}

// Tilted ticker ribbon.
export function Marquee({ items, dark = true, tilt = -1.6, speed = 120 }) {
  const row = [...items, ...items];
  return (
    <div className={`marquee ${dark ? 'is-dark' : 'is-light'}`} style={{ transform: `rotate(${tilt}deg)` }} aria-hidden="true">
      <div className="marquee-track" style={{ animationDuration: `${speed}s` }}>
        {[0, 1].map((k) => (
          <span key={k} className="marquee-group">
            {row.map((t, i) => (
              <span key={i}>
                {t}
                <i>✦</i>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

// Hand-drawn underline swoosh. Put inside an inline-block wrapper.
export function Swoosh({ color = '#E2C96D', className = '' }) {
  return (
    <svg className={`swoosh ${className}`} viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden="true">
      <path d="M4 16 C 60 6, 120 4, 180 9 S 270 18, 296 8" fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" />
    </svg>
  );
}

// Hand-drawn curly arrow with a note.
export function ArrowNote({ children, className = '', flip = false }) {
  return (
    <span className={`arrow-note ${className}`} aria-hidden="true">
      <svg viewBox="0 0 90 60" style={{ transform: flip ? 'scaleX(-1)' : undefined }}>
        <path d="M84 6 C 60 4, 40 14, 34 30 C 30 42, 40 50, 50 44 C 60 38, 50 24, 36 30 C 22 36, 14 46, 8 54" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M2 46 L8 55 L18 50" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>{children}</span>
    </span>
  );
}

// Big outlined coffee bean doodle.
export function Bean({ size = 60, color = '#6C3100', className = '', style }) {
  return (
    <svg className={`bean ${className}`} width={size} height={size} viewBox="0 0 60 60" style={style} aria-hidden="true">
      <ellipse cx="30" cy="30" rx="17" ry="25" transform="rotate(28 30 30)" fill={color} />
      <path d="M22 10 C 34 22, 26 38, 38 50" stroke="#FAF7F0" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// Patterned banner used at the top of app pages.
// pattern: 'grid' | 'dots' | 'beans' | 'topo' | 'radar'
export function PageHero({ eyebrow, title, lead, pattern = 'topo', dark = false, actions, sticker, children }) {
  const patClass = pattern === 'grid' ? 'pat-grid' : pattern === 'dots' ? 'pat-dots' : pattern === 'beans' ? (dark ? 'pat-beans-dark' : 'pat-beans-light') : '';
  return (
    <section className={`page-hero ${dark ? 'is-dark' : ''}`}>
      {patClass && <div className={`pat-layer ${patClass}`} />}
      {(pattern === 'topo' || pattern === 'grid' || pattern === 'dots') && <Topo color={dark ? '#E2C96D' : '#6C3100'} opacity={dark ? 0.18 : 0.14} rings={16} cx={86} cy={50} seed={pattern.length} />}
      {pattern === 'radar' && <Radar className="page-hero-radar" />}
      {sticker}
      <div className="page-hero-row">
        <div style={{ maxWidth: 680 }}>
          {eyebrow && <div className="eyebrow">{eyebrow}</div>}
          <h1 className="title">{title}</h1>
          {lead && <p className="lead">{lead}</p>}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}
