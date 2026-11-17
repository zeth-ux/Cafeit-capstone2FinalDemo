import { Armchair, Bookmark, BookOpen, Check, Globe, Laptop, MessagesSquare, Moon, Sun, Users, Volume2 } from 'lucide-react';
import mark from '../assets/logo-mark.svg';
import word from '../assets/logo-word.svg';
import wordDark from '../assets/logo-word-dark.svg';
import { ago } from '../lib/live.js';
import { useStore } from '../store.jsx';

export function Logo() {
  return (
    <span className="logo" aria-label="Cafeit">
      <img className="mark" src={mark} alt="" />
      <img className="word word-light" src={word} alt="Cafeit" />
      <img className="word word-dark" src={wordDark} alt="" />
    </span>
  );
}

const PURPOSE_ICONS = { study: BookOpen, work: Laptop, social: MessagesSquare, rest: Armchair };

export function PurposeIcon({ id, size = 18 }) {
  const Icon = PURPOSE_ICONS[id];
  return <Icon size={size} strokeWidth={1.8} aria-hidden="true" />;
}

export function ScorePill({ cafe, purpose }) {
  const { P, t } = useStore();
  const p = P(purpose);
  return (
    <span className="score-pill num" title={t(`${p.label} 적합도`, `${p.label} fit`)}>
      {p.short} <b>{cafe.scores[purpose]}</b>
      {t('점', '')}
    </span>
  );
}

export function PurposeChips({ value, onChange }) {
  const { purposes, t } = useStore();
  return (
    <div className="chips" role="radiogroup" aria-label={t('방문 목적', 'Purpose')}>
      {purposes.map((p) => (
        <button key={p.id} role="radio" aria-checked={value === p.id} className={`chip ${value === p.id ? 'is-on' : ''}`} onClick={() => onChange(p.id)}>
          <PurposeIcon id={p.id} size={16} /> {p.label}
        </button>
      ))}
    </div>
  );
}

// "● 지금 여유 · 조용함 · 12분 전"
export function LiveLine({ live, now, compact = false }) {
  const { t, lang } = useStore();
  if (live.state === 'none') {
    return (
      <span className="live-line">
        <span className="dot is-none" aria-hidden="true" />
        <span className="tone-none">{t('정보 부족 · 최근 제보 없음', 'Not enough info · no recent reports')}</span>
      </span>
    );
  }
  return (
    <span className={`live-line ${live.state === 'stale' ? 'is-stale' : ''}`}>
      <span className={`dot is-${live.state}`} aria-hidden="true" />
      {!compact && <span>{t('지금', 'Now')}</span>}
      <span className={`tone-${live.crowd.tone}`}>{live.crowd.label}</span>
      <span aria-hidden="true">·</span>
      <span className={`tone-${live.noise.tone}`}>{live.noise.label}</span>
      <span className="age">· {ago(live.latest.ts, now, lang)}</span>
    </span>
  );
}

export function StatusTrio({ live }) {
  const { t } = useStore();
  const none = live.state === 'none';
  const cells = [
    { k: t('혼잡도', 'Crowd'), icon: Users, v: none ? '–' : live.crowd.label, tone: none ? 'none' : live.crowd.tone },
    { k: t('소음', 'Noise'), icon: Volume2, v: none ? '–' : live.noise.label, tone: none ? 'none' : live.noise.tone },
    { k: t('빈자리', 'Seats'), icon: Armchair, v: none ? '–' : live.seats.label, tone: none ? 'none' : live.seats.tone },
  ];
  return (
    <div className="trio">
      {cells.map(({ k, icon: Icon, v, tone }) => (
        <div key={k} className={`trio-cell bg-${tone}`}>
          <div className="k">
            <Icon size={13} aria-hidden="true" /> {k}
          </div>
          <div className={`v tone-${tone}`}>{v}</div>
        </div>
      ))}
    </div>
  );
}

export function SaveButton({ id, className = '' }) {
  const { isSaved, toggleSave, t } = useStore();
  const on = isSaved(id);
  return (
    <button
      className={`icon-btn ${on ? 'is-on' : ''} ${className}`}
      aria-pressed={on}
      aria-label={on ? t('저장 취소', 'Unsave') : t('저장하기', 'Save')}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSave(id);
      }}
    >
      <Bookmark size={18} fill={on ? 'currentColor' : 'none'} />
    </button>
  );
}

export function LangToggle({ dark = false }) {
  const { lang, setLang } = useStore();
  return (
    <div className={`lang-toggle ${dark ? 'is-dark' : ''}`} role="group" aria-label="Language">
      <Globe size={15} aria-hidden="true" />
      {[
        ['ko', 'KR'],
        ['en', 'EN'],
      ].map(([id, label]) => (
        <button key={id} className={lang === id ? 'is-on' : ''} aria-pressed={lang === id} onClick={() => setLang(id)}>
          {label}
        </button>
      ))}
    </div>
  );
}

export function ThemeToggle() {
  const { theme, toggleTheme, t } = useStore();
  const dark = theme === 'dark';
  return (
    <button className="theme-toggle" onClick={toggleTheme} aria-pressed={dark} aria-label={dark ? t('라이트 모드로 전환', 'Switch to light mode') : t('나이트 모드로 전환', 'Switch to night mode')} title={dark ? t('라이트 모드', 'Light mode') : t('나이트 모드', 'Night mode')}>
      {dark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}

export function Toast() {
  const { toast } = useStore();
  if (!toast) return null;
  return (
    <div className="toast" role="status" key={toast.id}>
      <Check size={16} /> {toast.message}
    </div>
  );
}
