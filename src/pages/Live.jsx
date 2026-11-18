import { Armchair, ArrowRight, MessageSquareText, Radio, SquarePen, Volume1 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CafeArt from '../components/CafeArt.jsx';
import { Marquee, PageHero } from '../components/Decor.jsx';
import { StatusTrio } from '../components/ui.jsx';
import { INCOMING_REPORTS } from '../data/cafes.js';
import { ago, minutesSince } from '../lib/live.js';
import { useStore } from '../store.jsx';

export default function Live() {
  const { cafes, allReports, pushIncoming, saved, now, t, lang } = useStore();
  const { state } = useLocation();
  const [filter, setFilter] = useState('all');
  const [newIds, setNewIds] = useState(state?.highlight ? [state.highlight] : []);
  const step = useRef(0);

  const FILTERS = [
    { id: 'all', label: t('전체 현황', 'All') },
    { id: 'free', label: t('여유로운 곳', 'Free seats') },
    { id: 'quiet', label: t('조용한 곳', 'Quiet') },
    { id: 'saved', label: t('저장한 카페', 'Saved') },
  ];

  // A new visitor report "arrives" every 60s while this page is open.
  useEffect(() => {
    const tm = setInterval(() => {
      const r = INCOMING_REPORTS[step.current % INCOMING_REPORTS.length];
      step.current += 1;
      pushIncoming(r);
      setNewIds([r.cafeId]);
    }, 60 * 1000);
    return () => clearInterval(tm);
  }, [pushIncoming]);

  useEffect(() => {
    if (!newIds.length) return undefined;
    const tm = setTimeout(() => setNewIds([]), 8000);
    return () => clearTimeout(tm);
  }, [newIds]);

  const recent30 = allReports.filter((r) => minutesSince(r.ts, now) < 30).length;
  const freeNow = cafes.filter((c) => c.live.state !== 'none' && c.live.crowd.key === 'free').length;
  const quietNow = cafes.filter((c) => c.live.state !== 'none' && c.live.noise.key === 'quiet').length;

  const list = useMemo(
    () =>
      cafes
        .filter((c) => {
          if (filter === 'free') return c.live.state !== 'none' && c.live.crowd.key === 'free';
          if (filter === 'quiet') return c.live.state !== 'none' && c.live.noise.key === 'quiet';
          if (filter === 'saved') return saved.includes(c.id);
          return true;
        })
        .sort((a, b) => (b.live.latest?.ts || 0) - (a.live.latest?.ts || 0)),
    [cafes, filter, saved],
  );

  return (
    <div className="container">
      <PageHero
        dark
        pattern="radar"
        eyebrow={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span className="dot is-fresh" /> Cafe live
          </span>
        }
        title={
          <>
            {t('지금, 카페는 ', 'Right now, how are ')}
            <span className="serif">{t('어떤가요?', 'the cafés?')}</span>
          </>
        }
        lead={t('방금 다녀온 학생들이 알려준 혼잡도와 소음이에요. 오래된 소식은 흐리게 보여드려요.', 'Crowd and noise reported by students who were just there. Older reports fade out.')}
        actions={
          <Link to="/live/report" className="btn btn-primary">
            <SquarePen size={16} /> {t('지금 카페 현황 남기기', 'Share a live report')}
          </Link>
        }
      />
      <div className="marquee-zone" style={{ margin: '4px 0 8px' }}>
        <Marquee
          dark={false}
          tilt={-1}
          speed={160}
          items={cafes
            .filter((c) => c.live.state !== 'none')
            .sort((a, b) => b.live.latest.ts - a.live.latest.ts)
            .map((c) => `${c.name} · ${c.live.crowd.label} · ${c.live.noise.label} · ${ago(c.live.latest.ts, now, lang)}`)}
        />
      </div>

      <div className="stat-tiles">
        <div className="stat-tile">
          <div>
            <div className="n num">
              {recent30}
              <small>{t('건', '')}</small>
            </div>
            <div className="l">{t('최근 30분 안에 들려온 소식', 'Reports in the last 30 min')}</div>
          </div>
          <span className="ic">
            <MessageSquareText size={20} />
          </span>
        </div>
        <div className="stat-tile">
          <div>
            <div className="n num">
              {freeNow}
              <small>{t('곳', '')}</small>
            </div>
            <div className="l">{t('지금 여유로운 카페', 'Cafés with free seats')}</div>
          </div>
          <span className="ic">
            <Armchair size={20} />
          </span>
        </div>
        <div className="stat-tile">
          <div>
            <div className="n num">
              {quietNow}
              <small>{t('곳', '')}</small>
            </div>
            <div className="l">{t('조용하다고 알려준 카페', 'Cafés reported quiet')}</div>
          </div>
          <span className="ic">
            <Volume1 size={20} />
          </span>
        </div>
      </div>

      <div className="chips">
        <span className="chip chip-location">
          <Radio size={15} /> {t('한양대학교 · 안산', 'Hanyang ERICA')}
        </span>
        {FILTERS.map((f) => (
          <button key={f.id} className={`chip ${filter === f.id ? 'is-on' : ''}`} aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
            {f.label}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="empty" style={{ marginTop: 20 }}>
          <p className="h3">{t('해당하는 카페가 없어요', 'No cafés here')}</p>
          <p className="muted">{t('다른 조건으로 살펴볼까요?', 'Try another filter.')}</p>
        </div>
      ) : (
        <div className="live-grid">
          {list.map((c) => {
            const latest = c.live.latest;
            const isNew = newIds.includes(c.id);
            return (
              <Link to={`/cafe/${c.id}`} key={`${c.id}-${latest?.id || 'none'}`} className={`live-card ${isNew ? 'is-new' : ''}`}>
                <div className="art">
                  <span className="age-badge">
                    <span className={`dot is-${c.live.state}`} />
                    {latest && c.live.state !== 'none' ? t(`${ago(latest.ts, now)} 방문자 업데이트`, `Updated ${ago(latest.ts, now, 'en')}`) : t('최근 제보 없음', 'No recent reports')}
                  </span>
                  <CafeArt art={c.art} id={c.id} label={c.name} />
                </div>
                <div className="live-body" style={{ opacity: c.live.state === 'stale' ? 0.7 : 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                    <span className="h3">{c.name}</span>
                    <span className="muted" style={{ fontSize: 13, whiteSpace: 'nowrap' }}>
                      {c.area} · {t(`도보 ${c.walk}분`, `${c.walk} min`)}
                    </span>
                  </div>
                  <StatusTrio live={c.live} />
                  {c.live.state === 'none' ? (
                    <p className="quote">{t('정보 부족 · 지금 계신다면 첫 소식을 남겨 주세요.', 'Not enough info · if you’re there, share the first report.')}</p>
                  ) : c.live.memo ? (
                    <p className="quote">“{c.live.memo}”</p>
                  ) : null}
                  <span className="link-arrow" style={{ marginTop: 'auto' }}>
                    {t('카페 보기', 'View café')} <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <div className="prompt-card">
        <div>
          <p className="h3">{t('지금 카페에 계신가요?', 'At a café right now?')}</p>
          <p className="muted" style={{ fontSize: 14 }}>
            {t('3번만 누르면 끝. 다른 학생의 좋은 한 자리를 만들어 줘요.', 'Three taps and done. You’ll help another student find a good seat.')}
          </p>
        </div>
        <Link to="/live/report" className="btn btn-secondary">
          {t('방문 소식 남기기', 'Share a report')} <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
