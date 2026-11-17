import { CROWD, NOISE, SEATS } from '../data/cafes.js';

const MIN = 60 * 1000;

export function minutesSince(ts, now) {
  return Math.max(0, Math.floor((now - ts) / MIN));
}

export function ago(ts, now) {
  const m = minutesSince(ts, now);
  if (m < 1) return '방금 전';
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  return `${h}시간 전`;
}

// fresh: < 30 min · recent: < 2 h · stale: < 3 h · none: older / no reports
export function freshness(ts, now) {
  if (!ts) return 'none';
  const m = minutesSince(ts, now);
  if (m < 30) return 'fresh';
  if (m < 120) return 'recent';
  if (m < 180) return 'stale';
  return 'none';
}

function mode(values) {
  const count = {};
  let best = values[0];
  for (const v of values) {
    count[v] = (count[v] || 0) + 1;
    if (count[v] > count[best]) best = v;
  }
  return best;
}

// Summarise a café's reports into one status.
export function liveStatus(reports, now) {
  const sorted = [...reports].sort((a, b) => b.ts - a.ts);
  const latest = sorted[0];
  const fresh = freshness(latest?.ts, now);
  if (!latest || fresh === 'none') {
    return { state: 'none', count: 0, latest: null };
  }
  const window = sorted.filter((r) => minutesSince(r.ts, now) < 120);
  const pool = window.length ? window : [latest];
  const crowd = mode(pool.map((r) => r.crowd));
  const noise = mode(pool.map((r) => r.noise));
  const seats = mode(pool.map((r) => r.seats));
  const n = window.length;
  const confidence = n >= 4 ? '높음' : n >= 2 ? '보통' : '낮음';
  return {
    state: fresh,
    count: n,
    confidence,
    latest,
    crowd: { key: crowd, ...CROWD[crowd] },
    noise: { key: noise, ...NOISE[noise] },
    seats: { key: seats, ...SEATS[seats] },
    memo: sorted.find((r) => r.memo)?.memo || '',
  };
}

export function isOpen(cafe, date = new Date()) {
  const h = date.getHours() + date.getMinutes() / 60;
  const [open, close] = cafe.hours;
  return h >= open && h < close;
}

export function hoursLabel(cafe) {
  const [o, c] = cafe.hours;
  const f = (x) => `${String(x % 24).padStart(2, '0')}:00`;
  return `${f(o)}–${c === 24 ? '24:00' : f(c)}`;
}

export const won = (n) => `${n.toLocaleString('ko-KR')}원`;
