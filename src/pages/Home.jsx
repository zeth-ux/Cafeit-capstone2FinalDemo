import { ArrowRight, Map as MapIcon, Search } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CafeArt from '../components/CafeArt.jsx';
import CafeMap from '../components/CafeMap.jsx';
import { ArrowNote, Bean, Marquee, Sticker, Swoosh, Topo } from '../components/Decor.jsx';
import { LiveLine, PurposeChips, PurposeIcon, SaveButton, ScorePill } from '../components/ui.jsx';
import { SURVEY } from '../data/cafes.js';
import { isOpen, minutesSince } from '../lib/live.js';
import { rankCafes, useStore } from '../store.jsx';

const FILTERS = [
  { id: 'open', ko: '영업 중', en: 'Open now', test: (c) => isOpen(c) },
  { id: 'quiet', ko: '조용한 곳', en: 'Quiet', test: (c) => c.attributes.quiet >= 0.8 },
  { id: 'outlets', ko: '콘센트', en: 'Outlets', test: (c) => c.attributes.outlets >= 0.8 },
  { id: 'solo', ko: '1인석', en: 'Solo seats', test: (c) => c.attributes.soloSeats >= 0.8 },
  { id: 'free', ko: '지금 여유', en: 'Free seats now', test: (c) => c.live.state !== 'none' && c.live.crowd.key === 'free' },
];

function Hero({ onPick }) {
  const { purpose, setPurpose, purposes, P, cafes, allReports, now, t } = useStore();
  const [q, setQ] = useState('');
  const quietNow = cafes.filter((c) => c.live.state !== 'none' && c.live.noise.key === 'quiet').length;
  const recent = allReports.filter((r) => minutesSince(r.ts, now) < 30).length;
  const topScore = Math.max(...cafes.map((c) => c.scores[purpose]));
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-card">
          <Topo color="#6C3100" opacity={0.13} rings={20} cx={30} cy={20} seed={3} />
          <Bean size={34} style={{ left: '44%', top: 34, transform: 'rotate(20deg)', opacity: 0.85 }} />
          <Bean size={22} color="#8C0200" style={{ left: '50%', bottom: 40, transform: 'rotate(-30deg)', opacity: 0.7 }} />
          <div className="hero-copy">
            <div className="eyebrow">Cafeit · ERICA Cafe Guide</div>
            <h1 className="hero-title">
              {t('오늘의 목적에', 'The right café')}
              <br />
              <em>{t('딱 맞는 카페', 'for today’s purpose')}</em>
              {t('를 찾아요.', '.')}
            </h1>
            <p className="hero-sub">
              {t('공부할 곳도, 이야기 나눌 곳도 조건은 모두 다르니까.', 'A place to study and a place to chat need different things.')}
              <br />
              {t('별점 대신 ', 'Pick by ')}
              <b>{t('목적', 'purpose')}</b>
              {t('으로 골라 보세요.', ', not by stars.')}
            </p>

            <p className="hero-q">{t('오늘은 어떤 목적으로 카페에 가세요?', 'Why are you going to a café today?')}</p>
            <div className="purpose-grid" role="radiogroup" aria-label={t('방문 목적', 'Purpose')}>
              {purposes.map((p) => (
                <button
                  key={p.id}
                  role="radio"
                  aria-checked={purpose === p.id}
                  className={`purpose-card ${purpose === p.id ? 'is-on' : ''}`}
                  onClick={() => {
                    setPurpose(p.id);
                    onPick();
                  }}
                >
                  <span className="p-icon">
                    <PurposeIcon id={p.id} size={18} />
                  </span>
                  <span className="p-label">{p.label}</span>
                  <span className="p-hint">{p.hint}</span>
                </button>
              ))}
            </div>

            <form
              className="search"
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                onPick(q);
              }}
            >
              <span className="loc">
                <MapIcon size={16} aria-hidden="true" /> {t('한양대학교 ERICA', 'Hanyang ERICA')}
              </span>
              <Search size={18} className="muted" aria-hidden="true" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('카페 이름이나 동네를 검색해 보세요', 'Search a café or neighborhood')} aria-label={t('카페 검색', 'Search cafés')} />
              <button className="btn btn-primary" type="submit">
                {t('찾아보기', 'Search')}
              </button>
            </form>
            <p className="hero-live">
              <span className="dot is-fresh" aria-hidden="true" />
              {t('지금 조용한 카페', 'Quiet right now:')} <b>{t(`${quietNow}곳`, `${quietNow} cafés`)}</b> · {t('최근 30분 소식', 'Reports in last 30 min:')} <b>{t(`${recent}건`, recent)}</b>
            </p>
          </div>
          <div className="hero-art">
            <CafeArt scene="hero" w={1400} art={{ variant: 'window', tone: '#3B3626', accent: '#1F1E0A' }} label={t('창가 자리가 있는 카페 일러스트', 'Illustration of a café with window seats')} />
          </div>
          <Sticker
            className="hero-sticker"
            size={132}
            text="CAFEIT ✦ ERICA ✦ LIVE ✦ "
            center={
              <span>
                <span style={{ display: 'block', fontSize: 40 }}>{topScore}</span>
                <span style={{ fontSize: 13 }}>{t(`${P(purpose).short} 1위`, `#1 ${P(purpose).short}`)}</span>
              </span>
            }
          />
        </div>
      </div>
    </section>
  );
}

function CafeRow({ cafe, purpose, active, onHover, now }) {
  const navigate = useNavigate();
  const { t } = useStore();
  return (
    <article className={`cafe-row ${active ? 'is-active' : ''}`} onMouseEnter={onHover} onFocus={onHover} onClick={() => navigate(`/cafe/${cafe.id}`)}>
      <div className="thumb">
        <CafeArt art={cafe.art} id={cafe.id} label={cafe.name} />
      </div>
      <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div>
          <Link to={`/cafe/${cafe.id}`} className="h3" onClick={(e) => e.stopPropagation()}>
            {cafe.name}
          </Link>
          <div className="meta">
            {cafe.area} · {t(`도보 ${cafe.walk}분`, `${cafe.walk} min walk`)}{' '}
            {cafe.partner && (
              <span className="tag tag-partner" style={{ marginLeft: 6, padding: '1px 8px', fontSize: 11 }}>
                {t('제휴', 'Partner')}
              </span>
            )}
          </div>
        </div>
        <span className="tag" style={{ alignSelf: 'flex-start' }}>
          {cafe.keyFact}
        </span>
        <LiveLine live={cafe.live} now={now} compact />
      </div>
      <div className="side">
        <SaveButton id={cafe.id} />
        <ScorePill cafe={cafe} purpose={purpose} />
      </div>
    </article>
  );
}

function Explore({ query, sectionRef }) {
  const { purpose, setPurpose, P, cafes, now, t, lang } = useStore();
  const [filters, setFilters] = useState([]);
  const [view, setView] = useState('map');
  const [activeId, setActiveId] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const list = useMemo(() => {
    const q = (query || '').trim().toLowerCase();
    return rankCafes(cafes, purpose).filter((c) => {
      if (q && !(c.name.toLowerCase().includes(q) || c.area.toLowerCase().includes(q) || c.tags.some((x) => x.toLowerCase().includes(q)))) return false;
      return filters.every((f) => FILTERS.find((x) => x.id === f).test(c));
    });
  }, [cafes, purpose, filters, query]);

  const shown = showAll ? list : list.slice(0, 4);
  const current = activeId && list.some((c) => c.id === activeId) ? activeId : list[0]?.id;
  const p = P(purpose);

  return (
    <section className="section" ref={sectionRef} id="explore" style={{ paddingBottom: 56, scrollMarginTop: 56 }}>
      <div className="container">
        <div className="section-head">
          <div>
            <div className="eyebrow">Find your place</div>
            <h2 className="h2">{t(`${p.label}에 맞는 카페, 적합도 순으로 보여드려요`, `Cafés for “${p.label}”, ranked by fit`)}</h2>
            <p className="lead">{t('목적을 바꾸면 점수와 순위가 바로 바뀌어요.', 'Change the purpose and the scores and ranking change instantly.')}</p>
          </div>
          <Link to="/recommend" className="btn btn-secondary">
            {t('맞춤 추천 보기', 'See my picks')} <ArrowRight size={16} />
          </Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <PurposeChips value={purpose} onChange={setPurpose} />
          <ArrowNote className="hide-sm" flip>
            {t('눌러 보세요, 순위가 바뀌어요!', 'Tap one, the ranking changes!')}
          </ArrowNote>
        </div>

        <div className="explore-bar" style={{ marginTop: 16 }}>
          <div className="chips">
            <span className="chip chip-location">
              <MapIcon size={15} aria-hidden="true" /> {t('한양대학교 · 안산', 'Hanyang ERICA')}
            </span>
            {FILTERS.map((f) => {
              const on = filters.includes(f.id);
              return (
                <button key={f.id} className={`chip ${on ? 'is-on' : ''}`} aria-pressed={on} onClick={() => setFilters(on ? filters.filter((x) => x !== f.id) : [...filters, f.id])}>
                  {lang === 'en' ? f.en : f.ko}
                </button>
              );
            })}
          </div>
          <div className="seg" role="tablist" aria-label={t('보기 방식', 'View')}>
            <button className={view === 'map' ? 'is-on' : ''} onClick={() => setView('map')} role="tab" aria-selected={view === 'map'}>
              {t('지도 + 목록', 'Map + list')}
            </button>
            <button className={view === 'list' ? 'is-on' : ''} onClick={() => setView('list')} role="tab" aria-selected={view === 'list'}>
              {t('목록만', 'List only')}
            </button>
          </div>
        </div>

        <div className="list-meta">
          <b>{t(`${list.length}개의 카페`, `${list.length} cafés`)}</b>
          <span className="muted">{t(`${p.label} 적합도 순`, `Sorted by “${p.label}” fit`)}</span>
        </div>

        <div className={`explore-grid ${view === 'list' ? 'list-only' : ''}`}>
          <div>
            {list.length === 0 ? (
              <div className="empty">
                <p className="h3">{t('조건에 맞는 카페가 없어요', 'No cafés match these filters')}</p>
                <p className="muted">{t('필터를 조금 줄여 볼까요?', 'Try removing a filter.')}</p>
                <button className="btn btn-secondary btn-sm" style={{ marginTop: 14 }} onClick={() => setFilters([])}>
                  {t('필터 초기화', 'Clear filters')}
                </button>
              </div>
            ) : (
              <div className="cafe-list">
                {shown.map((c) => (
                  <CafeRow key={c.id} cafe={c} purpose={purpose} now={now} active={view === 'map' && c.id === current} onHover={() => setActiveId(c.id)} />
                ))}
              </div>
            )}
            {list.length > 4 && (
              <button className="btn btn-secondary btn-block" style={{ marginTop: 12 }} onClick={() => setShowAll(!showAll)}>
                {showAll ? t('접기', 'Show less') : t(`카페 ${list.length - 4}곳 더 보기`, `Show ${list.length - 4} more`)}
              </button>
            )}
          </div>
          {view === 'map' && <CafeMap cafes={cafes} purpose={purpose} activeId={current} onSelect={setActiveId} dimIds={cafes.filter((c) => !list.includes(c)).map((c) => c.id)} />}
        </div>
      </div>
    </section>
  );
}

function Pick() {
  const { purpose, P, cafes, now, t } = useStore();
  const top = rankCafes(cafes, purpose).slice(0, 3);
  const p = P(purpose);
  return (
    <>
      <div className="checker butter" />
      <section className="section band-dark on-dark pat-beans-dark">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Cafeit pick</div>
              <h2 className="h2 pick-title" style={{ fontSize: 40 }}>
                {t('', 'Best for ')}
                <span className="swoosh-wrap">
                  <em className="poster" style={{ fontWeight: 400 }}>
                    {p.label}
                  </em>
                  <Swoosh color="#8C0200" />
                </span>
                {t('에 잘 맞는 카페', '')}
              </h2>
              <p className="lead">{t('지금 선택한 목적과 LIVE 현황을 함께 살펴 골랐어요.', 'Picked using your purpose and live conditions right now.')}</p>
            </div>
            <Link to="/recommend" className="link-arrow">
              {t('전체 추천 보기', 'All picks')} <ArrowRight size={16} />
            </Link>
          </div>
          <div className="pick-grid">
            {top.map((c, i) => (
              <Link to={`/cafe/${c.id}`} key={`${purpose}-${c.id}`} className="pick-card" style={{ animation: `rise 700ms ${i * 140}ms var(--ease) both` }}>
                <div className="art">
                  <span className={`rank ${i === 0 ? 'r1' : ''}`}>{i + 1}</span>
                  <SaveButton id={c.id} className="over-save" />
                  <CafeArt art={c.art} id={c.id} label={c.name} />
                </div>
                <div className="pick-body">
                  <div className="top">
                    <span>
                      {c.area} · {t(`도보 ${c.walk}분`, `${c.walk} min walk`)}
                    </span>
                    <ScorePill cafe={c} purpose={purpose} />
                  </div>
                  <h3 className="h3" style={{ fontSize: 20 }}>
                    {c.name}
                  </h3>
                  <p className="muted" style={{ fontSize: 14 }}>
                    {c.summary}
                  </p>
                  <LiveLine live={c.live} now={now} />
                  <span className="link-arrow" style={{ marginTop: 'auto', paddingTop: 6 }}>
                    {t('자세히 보기', 'View details')} <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <div className="checker butter" />
    </>
  );
}

function Note() {
  const { t } = useStore();
  return (
    <section className="section">
      <div className="container">
        <div className="note">
          <div className="note-copy decor-wrap">
            <Topo color="#302F03" opacity={0.14} rings={14} cx={20} cy={90} seed={5} />
            <div className="eyebrow">Why Cafeit</div>
            <h2 className="h2">
              {t('좋은 카페를 발견하는', 'What makes a café “good”')}
              <br />
              {t('기준은 사람마다 다르니까.', 'is different for everyone.')}
            </h2>
            <p>
              {t(
                '별점만으로는 알 수 없어요. 소음, 콘센트, 와이파이, 지금의 분위기까지 내 목적에 맞는 조건을 모아 더 나은 선택을 돕습니다.',
                'Stars don’t tell you much. We bring together noise, outlets, Wi-Fi and the vibe right now, so you can choose by what you actually need.',
              )}
            </p>
            <div className="stats">
              <div className="stat">
                <div className="n num">{SURVEY.pct}%</div>
                <div className="l">
                  {t(`목적에 맞는 카페를 찾기 어렵다고 답했어요 (${SURVEY.struggle}/${SURVEY.total}명)`, `said it’s hard to find a café that fits their purpose (${SURVEY.struggle}/${SURVEY.total})`)}
                </div>
              </div>
              <div className="stat">
                <div className="n num">{t('4가지', '4')}</div>
                <div className="l">{t('공부 · 작업 · 모임 · 휴식, 목적별 적합도', 'purposes: study, work, meet, rest')}</div>
              </div>
              <div className="stat">
                <div className="n num">{t('3탭', '3 taps')}</div>
                <div className="l">{t('카페 LIVE 현황 제보에 걸리는 시간', 'to share a live café report')}</div>
              </div>
            </div>
            <Link to="/recommend" className="btn btn-primary">
              {t('나만의 카페 찾기', 'Find my café')} <ArrowRight size={16} />
            </Link>
          </div>
          <div className="note-art">
            <CafeArt scene="note" w={1200} art={{ variant: 'hanok', tone: '#E8D2B8', accent: '#7A4A24' }} label={t('한옥 창살이 있는 카페 일러스트', 'Illustration of a café with hanok lattice windows')} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const exploreRef = useRef(null);
  const [query, setQuery] = useState('');
  const { t } = useStore();
  const goExplore = (q) => {
    if (typeof q === 'string') setQuery(q);
    exploreRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return (
    <>
      <Hero onPick={goExplore} />
      <div className="marquee-zone">
        <Marquee items={[t('공부하기', 'STUDY'), t('작업하기', 'WORK'), t('친구 만나기', 'MEET FRIENDS'), t('쉬어가기', 'TAKE A BREAK'), t('조용한 1인석', 'QUIET SOLO SEATS'), t('콘센트 가득', 'OUTLETS EVERYWHERE'), t('지금 LIVE', 'LIVE NOW'), t('ERICA 정문 7분', '7 MIN FROM ERICA')]} />
        <Marquee items={['STUDY', 'WORK', 'MEET', 'REST', 'QUIET SEATS', 'OUTLETS', 'LIVE NOW', 'NEAR ERICA']} dark={false} tilt={1.2} speed={140} />
      </div>
      <Explore query={query} sectionRef={exploreRef} />
      <Pick />
      <Note />
    </>
  );
}
