import { ArrowRight, Map as MapIcon, Search } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CafeArt from '../components/CafeArt.jsx';
import CafeMap from '../components/CafeMap.jsx';
import { LiveLine, PurposeChips, PurposeIcon, purposeById, SaveButton, ScorePill } from '../components/ui.jsx';
import { PURPOSES, SURVEY } from '../data/cafes.js';
import { isOpen, minutesSince } from '../lib/live.js';
import { rankCafes, useStore } from '../store.jsx';

const FILTERS = [
  { id: 'open', label: '영업 중', test: (c) => isOpen(c) },
  { id: 'quiet', label: '조용한 곳', test: (c) => c.attributes.quiet >= 0.8 },
  { id: 'outlets', label: '콘센트', test: (c) => c.attributes.outlets >= 0.8 },
  { id: 'solo', label: '1인석', test: (c) => c.attributes.soloSeats >= 0.8 },
  { id: 'free', label: '지금 여유', test: (c) => c.live.state !== 'none' && c.live.crowd.key === 'free' },
];

function Hero({ onPick }) {
  const { purpose, setPurpose, cafes, allReports, now } = useStore();
  const [q, setQ] = useState('');
  const quietNow = cafes.filter((c) => c.live.state !== 'none' && c.live.noise.key === 'quiet').length;
  const recent = allReports.filter((r) => minutesSince(r.ts, now) < 30).length;
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-card">
          <div className="hero-copy">
            <div className="eyebrow">Cafeit · ERICA Cafe Guide</div>
            <h1 className="hero-title">
              오늘의 목적에
              <br />
              <em>딱 맞는 카페</em>를 찾아요.
            </h1>
            <p className="hero-sub">
              공부할 곳도, 이야기 나눌 곳도 조건은 모두 다르니까.
              <br />
              별점 대신 <b>목적</b>으로 골라 보세요.
            </p>

            <p className="hero-q">오늘은 어떤 목적으로 카페에 가세요?</p>
            <div className="purpose-grid" role="radiogroup" aria-label="방문 목적">
              {PURPOSES.map((p) => (
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
                <MapIcon size={16} aria-hidden="true" /> 한양대학교 ERICA
              </span>
              <Search size={18} className="muted" aria-hidden="true" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="카페 이름이나 동네를 검색해 보세요" aria-label="카페 검색" />
              <button className="btn btn-primary" type="submit">
                찾아보기
              </button>
            </form>
            <p className="hero-live">
              <span className="dot is-fresh" aria-hidden="true" />
              지금 조용한 카페 <b>{quietNow}곳</b> · 최근 30분 소식 <b>{recent}건</b>
            </p>
          </div>
          <div className="hero-art">
            <CafeArt art={{ variant: 'window', tone: '#3B3626', accent: '#1F1E0A' }} label="창가 자리가 있는 카페 일러스트" />
          </div>
        </div>
      </div>
    </section>
  );
}

function CafeRow({ cafe, purpose, active, onHover, now }) {
  const navigate = useNavigate();
  return (
    <article
      className={`cafe-row ${active ? 'is-active' : ''}`}
      onMouseEnter={onHover}
      onFocus={onHover}
      onClick={() => navigate(`/cafe/${cafe.id}`)}
    >
      <div className="thumb">
        <CafeArt art={cafe.art} label={cafe.name} />
      </div>
      <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div>
          <Link to={`/cafe/${cafe.id}`} className="h3" onClick={(e) => e.stopPropagation()}>
            {cafe.name}
          </Link>
          <div className="meta">
            {cafe.area} · 도보 {cafe.walk}분 {cafe.partner && <span className="tag tag-partner" style={{ marginLeft: 6, padding: '1px 8px', fontSize: 11 }}>제휴</span>}
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
  const { purpose, setPurpose, cafes, now } = useStore();
  const [filters, setFilters] = useState([]);
  const [view, setView] = useState('map');
  const [activeId, setActiveId] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const list = useMemo(() => {
    const q = (query || '').trim();
    return rankCafes(cafes, purpose).filter((c) => {
      if (q && !(c.name.includes(q) || c.area.includes(q) || c.tags.some((t) => t.includes(q)))) return false;
      return filters.every((f) => FILTERS.find((x) => x.id === f).test(c));
    });
  }, [cafes, purpose, filters, query]);

  const shown = showAll ? list : list.slice(0, 4);
  const current = activeId && list.some((c) => c.id === activeId) ? activeId : list[0]?.id;
  const p = purposeById(purpose);

  return (
    <section className="section" ref={sectionRef} id="explore" style={{ paddingBottom: 56, scrollMarginTop: 56 }}>
      <div className="container">
        <div className="section-head">
          <div>
            <div className="eyebrow">Find your place</div>
            <h2 className="h2">
              {p.label}에 맞는 카페, 적합도 순으로 보여드려요
            </h2>
            <p className="lead">목적을 바꾸면 점수와 순위가 바로 바뀌어요.</p>
          </div>
          <Link to="/recommend" className="btn btn-secondary">
            맞춤 추천 보기 <ArrowRight size={16} />
          </Link>
        </div>
        <PurposeChips value={purpose} onChange={setPurpose} />

        <div className="explore-bar" style={{ marginTop: 16 }}>
          <div className="chips">
            <span className="chip chip-location">
              <MapIcon size={15} aria-hidden="true" /> 한양대학교 · 안산
            </span>
            {FILTERS.map((f) => {
              const on = filters.includes(f.id);
              return (
                <button key={f.id} className={`chip ${on ? 'is-on' : ''}`} aria-pressed={on} onClick={() => setFilters(on ? filters.filter((x) => x !== f.id) : [...filters, f.id])}>
                  {f.label}
                </button>
              );
            })}
          </div>
          <div className="seg" role="tablist" aria-label="보기 방식">
            <button className={view === 'map' ? 'is-on' : ''} onClick={() => setView('map')} role="tab" aria-selected={view === 'map'}>
              지도 + 목록
            </button>
            <button className={view === 'list' ? 'is-on' : ''} onClick={() => setView('list')} role="tab" aria-selected={view === 'list'}>
              목록만
            </button>
          </div>
        </div>

        <div className="list-meta">
          <b>{list.length}개의 카페</b>
          <span className="muted">{p.label} 적합도 순</span>
        </div>

        <div className={`explore-grid ${view === 'list' ? 'list-only' : ''}`}>
          <div>
            {list.length === 0 ? (
              <div className="empty">
                <p className="h3">조건에 맞는 카페가 없어요</p>
                <p className="muted">필터를 조금 줄여 볼까요?</p>
                <button className="btn btn-secondary btn-sm" style={{ marginTop: 14 }} onClick={() => setFilters([])}>
                  필터 초기화
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
                {showAll ? '접기' : `카페 ${list.length - 4}곳 더 보기`}
              </button>
            )}
          </div>
          {view === 'map' && (
            <CafeMap cafes={cafes} purpose={purpose} activeId={current} onSelect={setActiveId} dimIds={cafes.filter((c) => !list.includes(c)).map((c) => c.id)} />
          )}
        </div>
      </div>
    </section>
  );
}

function Pick() {
  const { purpose, cafes, now } = useStore();
  const top = rankCafes(cafes, purpose).slice(0, 3);
  const p = purposeById(purpose);
  return (
    <section className="section band-dark on-dark">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="eyebrow">Cafeit pick</div>
            <h2 className="h2 pick-title">
              <em>{p.label}</em>에 잘 맞는 카페
            </h2>
            <p className="lead">지금 선택한 목적과 LIVE 현황을 함께 살펴 골랐어요.</p>
          </div>
          <Link to="/recommend" className="link-arrow">
            전체 추천 보기 <ArrowRight size={16} />
          </Link>
        </div>
        <div className="pick-grid">
          {top.map((c, i) => (
            <Link to={`/cafe/${c.id}`} key={`${purpose}-${c.id}`} className="pick-card" style={{ animation: `rise 360ms ${i * 70}ms var(--ease) both` }}>
              <div className="art">
                <span className={`rank ${i === 0 ? 'r1' : ''}`}>{i + 1}</span>
                <SaveButton id={c.id} className="over-save" />
                <CafeArt art={c.art} label={c.name} />
              </div>
              <div className="pick-body">
                <div className="top">
                  <span>
                    {c.area} · 도보 {c.walk}분
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
                  자세히 보기 <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Note() {
  return (
    <section className="section">
      <div className="container">
        <div className="note">
          <div className="note-copy">
            <div className="eyebrow">Why Cafeit</div>
            <h2 className="h2">
              좋은 카페를 발견하는
              <br />
              기준은 사람마다 다르니까.
            </h2>
            <p>별점만으로는 알 수 없어요. 소음, 콘센트, 와이파이, 지금의 분위기까지 내 목적에 맞는 조건을 모아 더 나은 선택을 돕습니다.</p>
            <div className="stats">
              <div className="stat">
                <div className="n num">{SURVEY.pct}%</div>
                <div className="l">
                  목적에 맞는 카페를 찾기 어렵다고 답했어요 ({SURVEY.struggle}/{SURVEY.total}명)
                </div>
              </div>
              <div className="stat">
                <div className="n num">4가지</div>
                <div className="l">공부 · 작업 · 모임 · 휴식, 목적별 적합도</div>
              </div>
              <div className="stat">
                <div className="n num">3탭</div>
                <div className="l">카페 LIVE 현황 제보에 걸리는 시간</div>
              </div>
            </div>
            <Link to="/recommend" className="btn btn-primary">
              나만의 카페 찾기 <ArrowRight size={16} />
            </Link>
          </div>
          <div className="note-art">
            <CafeArt art={{ variant: 'hanok', tone: '#E8D2B8', accent: '#7A4A24' }} label="한옥 창살이 있는 카페 일러스트" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const exploreRef = useRef(null);
  const [query, setQuery] = useState('');
  const goExplore = (q) => {
    if (typeof q === 'string') setQuery(q);
    exploreRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return (
    <>
      <Hero onPick={goExplore} />
      <Explore query={query} sectionRef={exploreRef} />
      <Pick />
      <Note />
    </>
  );
}

