import { Armchair, Bookmark, ChevronRight, Clock, Navigation, Plug, Share2, SquarePen, Toilet, Wifi } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CafeArt from '../components/CafeArt.jsx';
import { MapBase } from '../components/CafeMap.jsx';
import { PurposeIcon, purposeById, StatusTrio } from '../components/ui.jsx';
import { ATTRIBUTE_LABELS, PURPOSES } from '../data/cafes.js';
import { ago, hoursLabel, isOpen, won } from '../lib/live.js';
import { useStore } from '../store.jsx';

function useCountUp(target, ms = 450) {
  const [v, setV] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    const start = performance.now();
    const a = from.current;
    let raf;
    const step = (t) => {
      const k = Math.min(1, (t - start) / ms);
      const e = 1 - Math.pow(1 - k, 3);
      setV(Math.round(a + (target - a) * e));
      if (k < 1) raf = requestAnimationFrame(step);
      else from.current = target;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}

const SECTIONS = [
  { id: 'intro', label: '공간 소개' },
  { id: 'fit', label: '목적 적합도' },
  { id: 'live', label: '카페 현황' },
  { id: 'reviews', label: '리뷰' },
  { id: 'location', label: '위치 안내' },
];

export default function CafeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCafe, purpose, setPurpose, isSaved, toggleSave, showToast, now } = useStore();
  const cafe = getCafe(id);
  const [tab, setTab] = useState('intro');
  const [mounted, setMounted] = useState(false);
  const headline = useCountUp(cafe ? cafe.scores[purpose] : 0);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  if (!cafe) {
    return (
      <div className="container">
        <div className="empty" style={{ margin: '64px 0' }}>
          <p className="h3">카페를 찾을 수 없어요</p>
          <Link to="/explore" className="btn btn-secondary btn-sm" style={{ marginTop: 14 }}>
            카페 둘러보기
          </Link>
        </div>
      </div>
    );
  }

  const p = purposeById(purpose);
  const saved = isSaved(cafe.id);
  const open = isOpen(cafe);
  const live = cafe.live;
  const best = [...PURPOSES].sort((a, b) => cafe.scores[b.id] - cafe.scores[a.id])[0];

  const goto = (sid) => {
    setTab(sid);
    document.getElementById(sid)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="container">
      <div className="detail-head">
        <div>
          <div className="crumbs">
            <Link to="/explore">카페 탐색</Link> <ChevronRight size={14} /> <span>{cafe.area}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <h1 className="h1">{cafe.name}</h1>
            {cafe.partner && <span className="tag tag-partner">제휴 · 음료 10% 할인</span>}
          </div>
          <p className="muted" style={{ marginTop: 4 }}>
            {cafe.area} · 도보 {cafe.walk}분 · {cafe.summary}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className={`btn btn-sm ${saved ? 'btn-primary' : 'btn-secondary'}`} aria-pressed={saved} onClick={() => toggleSave(cafe.id)}>
            <Bookmark size={15} fill={saved ? 'currentColor' : 'none'} /> {saved ? '저장됨' : '저장'}
          </button>
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => {
              try {
                navigator.clipboard?.writeText(window.location.href);
              } catch {
                /* ignore */
              }
              showToast('링크를 복사했어요');
            }}
          >
            <Share2 size={15} /> 공유하기
          </button>
        </div>
      </div>

      <div className="gallery">
        <div>
          <CafeArt art={cafe.art} label={`${cafe.name} 내부`} />
        </div>
        <div>
          <CafeArt art={cafe.art} shot={1} label={`${cafe.name} 테이블`} />
        </div>
        <div>
          <CafeArt art={cafe.art} shot={2} label={`${cafe.name} 창가`} />
        </div>
      </div>

      <nav className="tabs" aria-label="상세 섹션">
        {SECTIONS.map((s) => (
          <button key={s.id} className={tab === s.id ? 'active' : ''} onClick={() => goto(s.id)}>
            {s.label}
            {s.id === 'reviews' ? ` ${cafe.reviews.length}` : ''}
          </button>
        ))}
      </nav>

      <div className="detail-grid">
        <div>
          <section id="intro" className="panel" style={{ scrollMarginTop: 140 }}>
            <div className="panel-title">공간 소개</div>
            <div className="chips">
              {cafe.tags.map((t) => (
                <span className="tag" key={t}>
                  {t}
                </span>
              ))}
            </div>
            <div className="amenity-grid" style={{ marginTop: 16 }}>
              <div className="amenity">
                <Wifi size={20} /> {cafe.amenities.wifi}
              </div>
              <div className="amenity">
                <Plug size={20} /> {cafe.amenities.outlets}
              </div>
              <div className="amenity">
                <Armchair size={20} /> {cafe.amenities.solo}
              </div>
              <div className="amenity">
                <Toilet size={20} /> {cafe.amenities.toilet}
              </div>
            </div>
          </section>

          <section id="fit" className="panel" style={{ scrollMarginTop: 140 }}>
            <div className="panel-title">
              목적 적합도
              <span className="muted" style={{ fontSize: 13, fontWeight: 600 }}>
                목적을 눌러 비교해 보세요
              </span>
            </div>
            <div className="fit-headline">
              <div className="score-big num">
                <span className="n">{headline}</span>
                <span className="u">점</span>
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 17 }}>{p.label}에 이만큼 잘 맞아요</div>
                <div className="muted" style={{ fontSize: 14 }}>
                  {best.id === purpose ? '이 카페가 가장 잘 맞는 목적이에요.' : `이 카페는 ${best.label}에 가장 잘 맞아요 (${cafe.scores[best.id]}점).`}
                </div>
              </div>
            </div>
            <div role="radiogroup" aria-label="목적 선택">
              {PURPOSES.map((x) => (
                <button key={x.id} role="radio" aria-checked={purpose === x.id} className={`fit-row ${purpose === x.id ? 'is-on' : ''}`} onClick={() => setPurpose(x.id)}>
                  <PurposeIcon id={x.id} />
                  <span className="label">{x.label}</span>
                  <span className="bar">
                    <i style={{ width: mounted ? `${cafe.scores[x.id]}%` : 0 }} />
                  </span>
                  <span className="val num">{cafe.scores[x.id]}점</span>
                </button>
              ))}
            </div>
            <div className="attr-grid">
              {Object.entries(ATTRIBUTE_LABELS).map(([k, label]) => (
                <div className="attr" key={k}>
                  <span>{label}</span>
                  <span className="bar">
                    <i style={{ width: mounted ? `${Math.round(cafe.attributes[k] * 100)}%` : 0 }} />
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section id="reviews" className="panel" style={{ scrollMarginTop: 140 }}>
            <div className="panel-title">리뷰 {cafe.reviews.length}</div>
            {cafe.reviews.length === 0 && <p className="muted">아직 리뷰가 없어요. 첫 리뷰를 남겨 주세요.</p>}
            {cafe.reviews.map((r, i) => (
              <div className="review" key={i}>
                <div className="review-head">
                  <span className="avatar">{r.author[0]}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{r.author}</div>
                    <div className="muted" style={{ fontSize: 12 }}>
                      {r.date} 방문 · {purposeById(r.purpose).label}
                    </div>
                  </div>
                  <span className="tag" style={{ marginLeft: 'auto' }}>
                    {purposeById(r.purpose).label} 추천
                  </span>
                </div>
                <p style={{ fontSize: 15 }}>{r.text}</p>
              </div>
            ))}
          </section>
        </div>

        <aside className="sticky-side">
          <section id="live" className="panel" style={{ scrollMarginTop: 140 }}>
            <div className="panel-title">
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className={`dot is-${live.state}`} aria-hidden="true" /> 지금 카페는
              </span>
              {live.state !== 'none' && <span className="confidence">신뢰도 {live.confidence}</span>}
            </div>
            <StatusTrio live={live} />
            <p className="muted" style={{ fontSize: 13, marginTop: 10 }}>
              {live.state === 'none'
                ? '최근 3시간 동안 제보가 없어요. 첫 소식을 남겨 주세요.'
                : `${ago(live.latest.ts, now)} 업데이트 · 최근 2시간 제보 ${live.count}건${live.state === 'stale' ? ' · 지금은 달라졌을 수 있어요' : ''}`}
            </p>
            {live.memo && live.state !== 'none' && (
              <p className="quote" style={{ marginTop: 10 }}>
                “{live.memo}”
              </p>
            )}
            <button className={`btn btn-sm btn-block ${live.state === 'none' ? 'btn-primary' : 'btn-secondary'}`} style={{ marginTop: 14 }} onClick={() => navigate(`/live/report?cafe=${cafe.id}`)}>
              <SquarePen size={15} /> {live.state === 'none' ? '첫 제보 남기기' : '나도 현황 남기기'}
            </button>
          </section>

          <section className="panel">
            <div className="panel-title">
              영업 정보
              <span className={`open-badge ${open ? 'on' : 'off'}`}>
                <Clock size={12} /> {open ? '영업 중' : '영업 종료'}
              </span>
            </div>
            <p style={{ fontWeight: 700 }}>매일 {hoursLabel(cafe)}</p>
            <p className="muted" style={{ fontSize: 14 }}>
              마지막 주문 {cafe.lastOrder} · {cafe.closed}
            </p>
            <p className="muted" style={{ fontSize: 14 }}>아메리카노 {won(cafe.price)} · 전체 {cafe.seats}석</p>
          </section>

          <section id="location" className="panel" style={{ scrollMarginTop: 140 }}>
            <div className="panel-title">위치 안내</div>
            <div className="mini-map">
              <MapBase />
              <span className="pin is-active" style={{ left: `${cafe.map.x}%`, top: `${cafe.map.y}%`, position: 'absolute' }}>
                <span className="bubble num">{cafe.scores[purpose]}</span>
                <span className="tip" />
              </span>
            </div>
            <p style={{ fontSize: 14 }}>{cafe.address}</p>
            <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={() => showToast(`${cafe.area}까지 도보 ${cafe.walk}분 길찾기를 열었어요`)}>
              <Navigation size={14} /> 도보 길찾기
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
}
