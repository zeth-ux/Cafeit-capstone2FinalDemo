import { useId } from 'react';

// Placeholder café "photos": warm, flat illustrations in the brand palette.
// Replace with real photos later by swapping this component for <img>.
// shot 0 = interior, 1 = table close-up, 2 = detail

function mix(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255;
  let g = (n >> 8) & 255;
  let b = n & 255;
  const t = amt < 0 ? 0 : 255;
  const p = Math.abs(amt);
  r = Math.round((t - r) * p + r);
  g = Math.round((t - g) * p + g);
  b = Math.round((t - b) * p + b);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function Lamp({ x, y = 0, len = 70, color = '#1F1E0A', glow }) {
  return (
    <g>
      <line x1={x} y1={y} x2={x} y2={y + len} stroke={color} strokeWidth="2" />
      <path d={`M${x - 18} ${y + len + 20} Q${x} ${y + len - 6} ${x + 18} ${y + len + 20} Z`} fill={color} />
      <ellipse cx={x} cy={y + len + 22} rx="9" ry="4" fill="#FFE7A8" />
      {glow && <circle cx={x} cy={y + len + 40} r="46" fill={`url(#${glow})`} />}
    </g>
  );
}

function Plant({ x, y, s = 1, leaf = '#4F5B12', pot = '#B9825A' }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-14 0 h28 l-4 30 h-20 z" fill={pot} />
      <path d="M0 0 C-30 -20 -36 -60 -10 -80 C-6 -50 -4 -30 0 0" fill={leaf} />
      <path d="M0 0 C26 -16 40 -54 20 -86 C8 -56 6 -30 0 0" fill={mix(leaf, 0.15)} />
      <path d="M0 0 C-8 -30 -2 -70 6 -96 C14 -66 10 -30 0 0" fill={mix(leaf, -0.15)} />
    </g>
  );
}

function TableSet({ x, y, top = '#2A2614', chair = '#7A4A24' }) {
  return (
    <g>
      {/* chairs */}
      <path d={`M${x - 70} ${y - 34} h22 v60 h-4 v-30 h-14 v30 h-4 z`} fill={chair} />
      <path d={`M${x + 48} ${y - 34} h22 v60 h-4 v-30 h-14 v30 h-4 z`} fill={chair} />
      {/* table */}
      <ellipse cx={x} cy={y - 6} rx="58" ry="10" fill={top} />
      <rect x={x - 5} y={y - 4} width="10" height="44" fill={top} />
      <ellipse cx={x} cy={y + 40} rx="22" ry="5" fill={top} />
      {/* cups */}
      <rect x={x - 22} y={y - 22} width="12" height="12" rx="2" fill="#FFF" />
      <rect x={x + 10} y={y - 24} width="10" height="14" rx="2" fill="#E2C96D" />
    </g>
  );
}

function Scene({ variant, tone, accent, ids }) {
  const wall = tone;
  const wallLight = mix(tone, 0.35);
  const floor = mix(tone, -0.18);
  const sky = variant === 'garden' ? '#CFE0B8' : '#F3F0E8';
  const skyLow = variant === 'garden' ? '#93A86A' : '#DCE3EC';

  const windowFrame = (x, y, w, h, cols = 3, rows = 2) => (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={`url(#${ids.sky})`} />
      {variant === 'garden' && (
        <g>
          <circle cx={x + w * 0.25} cy={y + h * 0.55} r={h * 0.38} fill="#6F8A3A" />
          <circle cx={x + w * 0.6} cy={y + h * 0.4} r={h * 0.45} fill="#5A7330" />
          <circle cx={x + w * 0.9} cy={y + h * 0.65} r={h * 0.32} fill="#7C9845" />
        </g>
      )}
      {variant !== 'garden' && (
        <g opacity="0.55">
          <rect x={x} y={y + h * 0.62} width={w} height={h * 0.38} fill="#C9CDBF" />
          <rect x={x + w * 0.1} y={y + h * 0.4} width={w * 0.18} height={h * 0.6} fill="#B8BDB0" />
          <rect x={x + w * 0.62} y={y + h * 0.3} width={w * 0.22} height={h * 0.7} fill="#BFC4B6" />
        </g>
      )}
      {Array.from({ length: cols - 1 }).map((_, i) => (
        <rect key={`c${i}`} x={x + ((i + 1) * w) / cols - 2} y={y} width="4" height={h} fill={accent} />
      ))}
      {Array.from({ length: rows - 1 }).map((_, i) => (
        <rect key={`r${i}`} x={x} y={y + ((i + 1) * h) / rows - 2} width={w} height="4" fill={accent} />
      ))}
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={accent} strokeWidth="6" />
    </g>
  );

  return (
    <g>
      <rect width="400" height="300" fill={`url(#${ids.wall})`} />
      <rect y="214" width="400" height="86" fill={floor} />
      <rect y="212" width="400" height="4" fill={mix(floor, -0.12)} />

      {variant === 'window' && (
        <g>
          {windowFrame(60, 34, 280, 168, 4, 2)}
          <polygon points="80,300 150,214 230,214 200,300" fill="#FFF" opacity="0.18" />
          <polygon points="230,300 260,214 330,214 340,300" fill="#FFF" opacity="0.14" />
        </g>
      )}
      {variant === 'garden' && (
        <g>
          {windowFrame(30, 30, 340, 176, 3, 1)}
          <polygon points="60,300 120,214 220,214 180,300" fill="#FFF" opacity="0.2" />
        </g>
      )}
      {variant === 'hanok' && (
        <g>
          <rect x="40" y="30" width="320" height="176" fill={`url(#${ids.sky})`} />
          {Array.from({ length: 13 }).map((_, i) => (
            <rect key={`v${i}`} x={40 + i * 26.6} y="30" width="3" height="176" fill={accent} />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <rect key={`h${i}`} x="40" y={30 + i * 25} width="320" height="3" fill={accent} />
          ))}
          <rect x="40" y="30" width="320" height="176" fill="none" stroke={accent} strokeWidth="8" />
          <rect x="196" y="30" width="8" height="176" fill={accent} />
        </g>
      )}
      {variant === 'shelf' && (
        <g>
          {[40, 100, 160].map((sy, row) => (
            <g key={sy}>
              <rect x="30" y={sy + 46} width="340" height="6" fill={accent} />
              {Array.from({ length: 22 }).map((_, i) => {
                const colors = ['#8C0200', '#302F03', '#E2C96D', '#C6CCE2', '#6C3100', '#D3AB86', '#4F5B12'];
                const h = 30 + ((i * 7 + row * 5) % 16);
                const w = 10 + ((i + row) % 3) * 2;
                const x = 36 + i * 15.2;
                return <rect key={i} x={x} y={sy + 46 - h} width={w} height={h} fill={colors[(i + row * 3) % colors.length]} rx="1" />;
              })}
            </g>
          ))}
          <circle cx="330" cy="246" r="60" fill="#FFE7A8" opacity="0.25" />
        </g>
      )}
      {variant === 'roastery' && (
        <g>
          {windowFrame(220, 40, 150, 150, 2, 2)}
          <rect x="40" y="110" width="70" height="104" rx="10" fill="#2A2614" />
          <circle cx="75" cy="140" r="22" fill="#8C8B7D" />
          <circle cx="75" cy="140" r="12" fill="#2A2614" />
          <rect x="60" y="80" width="30" height="30" fill="#45440F" />
          <rect x="130" y="196" width="230" height="10" rx="3" fill={accent} />
          <rect x="140" y="206" width="8" height="40" fill={accent} />
          <rect x="342" y="206" width="8" height="40" fill={accent} />
        </g>
      )}
      {variant === 'lounge' && (
        <g>
          <path d="M110 214 V100 a90 90 0 0 1 180 0 V214 Z" fill={`url(#${ids.sky})`} />
          <path d="M110 214 V100 a90 90 0 0 1 180 0 V214" fill="none" stroke={accent} strokeWidth="8" />
          <rect x="196" y="12" width="8" height="202" fill={accent} opacity="0.0" />
          <rect x="70" y="176" width="260" height="56" rx="20" fill={accent} />
          <rect x="60" y="196" width="40" height="44" rx="14" fill={mix(accent, -0.2)} />
          <rect x="300" y="196" width="40" height="44" rx="14" fill={mix(accent, -0.2)} />
        </g>
      )}
      {variant === 'desk' && (
        <g>
          {windowFrame(40, 30, 320, 110, 4, 1)}
          {[70, 170, 270].map((dx) => (
            <g key={dx}>
              <rect x={dx - 10} y="150" width="80" height="40" rx="3" fill="#2A2614" />
              <rect x={dx - 6} y="154" width="72" height="32" rx="2" fill="#C6CCE2" />
              <rect x={dx + 26} y="190" width="8" height="14" fill="#2A2614" />
            </g>
          ))}
          <rect x="30" y="204" width="340" height="10" fill={accent} />
        </g>
      )}

      {variant !== 'shelf' && variant !== 'desk' && <Lamp x={variant === 'lounge' ? 330 : 200} len={variant === 'hanok' ? 40 : 60} glow={ids.glow} />}
      {variant === 'shelf' && <Lamp x={330} len={110} glow={ids.glow} />}

      {variant !== 'desk' && variant !== 'roastery' && <TableSet x={variant === 'lounge' ? 200 : 210} y={250} chair={variant === 'hanok' ? '#2A2614' : '#7A4A24'} />}
      {variant === 'roastery' && <TableSet x={250} y={262} />}

      <Plant x={variant === 'garden' ? 350 : 46} y={232} s={variant === 'garden' ? 1.1 : 0.95} />
      {variant === 'window' && <Plant x={360} y={236} s={0.8} leaf="#5A7330" />}

      <rect width="400" height="300" fill={wallLight} opacity="0" />
    </g>
  );
}

function TableShot({ tone, accent, ids }) {
  return (
    <g>
      <rect width="400" height="300" fill={`url(#${ids.wall})`} />
      <rect y="150" width="400" height="150" fill={mix(accent, 0.1)} />
      <rect y="150" width="400" height="6" fill={mix(accent, -0.2)} />
      {Array.from({ length: 6 }).map((_, i) => (
        <rect key={i} y={170 + i * 22} width="400" height="1.5" fill={mix(accent, -0.15)} opacity="0.5" />
      ))}
      {/* latte */}
      <ellipse cx="170" cy="214" rx="74" ry="20" fill="#F4EFE6" />
      <path d="M118 180 h104 q-4 40 -52 44 q-48 -4 -52 -44z" fill="#FFF" />
      <ellipse cx="170" cy="180" rx="52" ry="14" fill="#B57A45" />
      <path d="M170 186 c-10 -10 -26 -2 -16 -12 c6 -6 14 0 16 4 c2 -4 10 -10 16 -4 c10 10 -6 2 -16 12z" fill="#F6E9D6" />
      <path d="M222 188 q22 0 18 16 q-4 10 -20 8" fill="none" stroke="#FFF" strokeWidth="7" />
      {/* croissant */}
      <path d="M262 214 q40 -40 92 -6 q-10 14 -46 18 q-34 2 -46 -12z" fill="#C98A3E" />
      <path d="M280 206 q20 -16 54 -2" fill="none" stroke="#A5672A" strokeWidth="3" />
      {/* notebook */}
      <rect x="40" y="236" width="90" height="60" rx="4" fill={tone} transform="rotate(-8 85 266)" />
      <rect x="44" y="240" width="40" height="52" rx="2" fill="#FFF" opacity="0.6" transform="rotate(-8 85 266)" />
      <circle cx="320" cy="60" r="90" fill="#FFE7A8" opacity="0.35" />
    </g>
  );
}

function DetailShot({ variant, tone, accent, ids }) {
  return (
    <g>
      <rect width="400" height="300" fill={`url(#${ids.wall})`} />
      <rect x="40" y="20" width="200" height="260" fill={`url(#${ids.sky})`} />
      {variant === 'hanok'
        ? Array.from({ length: 8 }).map((_, i) => (
            <g key={i}>
              <rect x={40 + i * 25} y="20" width="3" height="260" fill={accent} />
              <rect x="40" y={20 + i * 33} width="200" height="3" fill={accent} />
            </g>
          ))
        : [<rect key="a" x="138" y="20" width="5" height="260" fill={accent} />, <rect key="b" x="40" y="150" width="200" height="5" fill={accent} />]}
      <rect x="40" y="20" width="200" height="260" fill="none" stroke={accent} strokeWidth="7" />
      <Lamp x={300} len={90} glow={ids.glow} />
      <Plant x={310} y={262} s={1.3} leaf={variant === 'lounge' ? '#45440F' : '#4F5B12'} />
      <rect y="280" width="400" height="20" fill={mix(tone, -0.2)} />
    </g>
  );
}

export default function CafeArt({ art, shot = 0, label }) {
  const uid = useId().replace(/:/g, '');
  const ids = { wall: `w${uid}`, sky: `s${uid}`, glow: `g${uid}` };
  const { variant, tone, accent } = art;
  const sky = variant === 'garden' ? ['#D9E7C4', '#9FB477'] : variant === 'lounge' ? ['#F4D9C8', '#D9A98C'] : ['#F5F2EA', '#D7E0EA'];
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label={label} style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id={ids.wall} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={mix(tone, 0.25)} />
          <stop offset="1" stopColor={tone} />
        </linearGradient>
        <linearGradient id={ids.sky} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sky[0]} />
          <stop offset="1" stopColor={sky[1]} />
        </linearGradient>
        <radialGradient id={ids.glow}>
          <stop offset="0" stopColor="#FFE7A8" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FFE7A8" stopOpacity="0" />
        </radialGradient>
      </defs>
      {shot === 0 && <Scene variant={variant} tone={tone} accent={accent} ids={ids} />}
      {shot === 1 && <TableShot tone={tone} accent={accent} ids={ids} />}
      {shot === 2 && <DetailShot variant={variant} tone={tone} accent={accent} ids={ids} />}
    </svg>
  );
}
