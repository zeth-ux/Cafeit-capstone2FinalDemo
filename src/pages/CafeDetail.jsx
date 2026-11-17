import { Armchair, Bookmark, ChevronRight, Clock, Navigation, Plug, Share2, SquarePen, Toilet, Wifi } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CafeArt from '../components/CafeArt.jsx';
import { MapBase } from '../components/CafeMap.jsx';
import { Sticker, Topo } from '../components/Decor.jsx';
import { PurposeIcon, StatusTrio } from '../components/ui.jsx';
import { ATTRIBUTE_LABELS, ATTRIBUTE_LABELS_EN } from '../data/cafes.js';
import { ago, hoursLabel, isOpen, won } from '../lib/live.js';
import { useStore } from '../store.jsx';

function useCountUp(target, ms = 900) {
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

export default function CafeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCafe, purpose, setPurpose, purposes, P, isSaved, toggleSave, showToast, now, t, lang } = useStore();
  const cafe = getCafe(id);
  const [tab, setTab] = useState('intro');
  const [mounted, setMounted] = useState(false);
  const headline = useCountUp(cafe ? cafe.scores[purpose] : 0);

  useEffect(() => {
    const tm = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(tm);
  }, []);

  if (!cafe) {
    return (
      <div className="container">
        <div className="empty" style={{ margin: '64px 0' }}>
          <p className="h3">{t('카페를 찾을 수 없어요', 'Café not found')}</p>
          <Link to="/explore" className="btn btn-secondary btn-sm" style={{ marginTop: 14 }}>
            {t('카페 둘러보기', 'Browse cafés')}
          </Link>
        </div>
      </div>
    );
  }

  const SECTIONS = [
    { id: 'intro', label: t('공간 소개', 'About') },
    { id: 'fit', label: t('목적 적합도', 'Purpose fit') },
    { id: 'live', label: t('카페 현황', 'Live status') },
    { id: 'reviews', label: t('리뷰', 'Reviews') },
    { id: 'location', label: t('위치 안내', 'Location') },
  ];
  const ATTR = lang === 'en' ? ATTRIBUTE_LABELS_EN : ATTRIBUTE_LABELS;
  const p = P(purpose);
  const saved = isSaved(cafe.id);
  const open = isOpen(cafe);
  const live = cafe.live;
  const best = [...purposes].sort((a, b) => cafe.scores[b.id] - cafe.scores[a.id])[0];

  const goto = (sid) => {
    setTab(sid);
    document.getElementById(sid)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="container">
      <div className="detail-head decor-wrap" style={{ borderRadius: 0 }}>
        <Topo color="#6C3100" opacity={0.12} rings={12} cx={95} cy={60} seed={2} />
        <div>
          <div className="crumbs">
            <Link to="/explore">{t('카페 탐색', 'Explore')}</Link> <ChevronRight size={14} /> <span>{cafe.area}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <h1 className="h1 poster" style={{ fontSize: 52, fontWeight: 400 }}>
              {cafe.name}
            </h1>
            {cafe.partner && <span className="tag tag-partner">{t('제휴 · 음료 10% 할인', 'Partner · 10% off drinks')}</span>}
          </div>
          <p className="muted" style={{ marginTop: 4 }}>
            {cafe.area} · {t(`도보 ${cafe.walk}분`, `${cafe.walk} min walk`)} · {cafe.summary}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className={`btn btn-sm ${saved ? 'btn-primary' : 'btn-secondary'}`} aria-pressed={saved} onClick={() => toggleSave(cafe.id)}>
            <Bookmark size={15} fill={saved ? 'currentColor' : 'none'} /> {saved ? t('저장됨', 'Saved') : t('저장', 'Save')}
          </button>
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => {
              try {
                navigator.clipboard?.writeText(window.location.href);
              } catch {
                /* ignore */
              }
              showToast(t('링크를 복사했어요', 'Link copied'));
            }}
          >
            <Share2 size={15} /> {t('공유하기', 'Share')}
          </button>
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        <Sticker
          className="detail-sticker"
          size={120}
          text={`${p.label.toUpperCase()} ✦ ${cafe.area.toUpperCase()} ✦ `}
          center={
            <span>
              <span style={{ display: 'block', fontSize: 38 }}>{cafe.scores[purpose]}</span>
              <span style={{ fontSize: 12 }}>{t(`${p.short} 적합도`, `${p.short} fit`)}</span>
            </span>
          }
        />
        <div className="gallery">
          <div>
            <CafeArt art={cafe.art} label={t(`${cafe.name} 내부`, `${cafe.name} interior`)} />
          </div>
          <div>
            <CafeArt art={cafe.art} shot={1} label={t(`${cafe.name} 테이블`, `${cafe.name} table`)} />
          </div>
          <div>
            <CafeArt art={cafe.art} shot={2} label={t(`${cafe.name} 창가`, `${cafe.name} window`)} />
          </div>
        </div>
      </div>

      <nav className="tabs" aria-label={t('상세 섹션', 'Sections')}>
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
            <div className="panel-title">{t('공간 소개', 'About this space')}</div>
            <div className="chips">
              {cafe.tags.map((x) => (
                <span className="tag" key={x}>
                  {x}
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
              {t('목적 적합도', 'Purpose fit')}
              <span className="muted" style={{ fontSize: 13, fontWeight: 600 }}>
                {t('목적을 눌러 비교해 보세요', 'Tap a purpose to compare')}
              </span>
            </div>
            <div className="fit-headline">
              <div className="score-big num">
                <span className="n">{headline}</span>
                <span className="u">{t('점', '/100')}</span>
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 17 }}>{t(`${p.label}에 이만큼 잘 맞아요`, `How well it fits “${p.label}”`)}</div>
                <div className="muted" style={{ fontSize: 14 }}>
                  {best.id === purpose
                    ? t('이 카페가 가장 잘 맞는 목적이에요.', 'This is what this café is best for.')
                    : t(`이 카페는 ${best.label}에 가장 잘 맞아요 (${cafe.scores[best.id]}점).`, `This café is best for “${best.label}” (${cafe.scores[best.id]}).`)}
                </div>
              </div>
            </div>
            <div role="radiogroup" aria-label={t('목적 선택', 'Choose purpose')}>
              {purposes.map((x) => (
                <button key={x.id} role="radio" aria-checked={purpose === x.id} className={`fit-row ${purpose === x.id ? 'is-on' : ''}`} onClick={() => setPurpose(x.id)}>
                  <PurposeIcon id={x.id} />
                  <span className="label">{x.label}</span>
                  <span className="bar">
                    <i style={{ width: mounted ? `${cafe.scores[x.id]}%` : 0 }} />
                  </span>
                  <span className="val num">
                    {cafe.scores[x.id]}
                    {t('점', '')}
                  </span>
                </button>
              ))}
            </div>
            <div className="attr-grid">
              {Object.entries(ATTR).map(([k, label]) => (
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
            <div className="panel-title">
              {t('리뷰', 'Reviews')} {cafe.reviews.length}
            </div>
            {cafe.reviews.length === 0 && <p className="muted">{t('아직 리뷰가 없어요. 첫 리뷰를 남겨 주세요.', 'No reviews yet. Be the first!')}</p>}
            {cafe.reviews.map((r, i) => (
              <div className="review" key={i}>
                <div className="review-head">
                  <span className="avatar">{r.author[0]}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{r.author}</div>
                    <div className="muted" style={{ fontSize: 12 }}>
                      {t(`${r.date} 방문`, `Visited ${r.date}`)} · {P(r.purpose).label}
                    </div>
                  </div>
                  <span className="tag" style={{ marginLeft: 'auto' }}>
                    {t(`${P(r.purpose).label} 추천`, `Good for ${P(r.purpose).label.toLowerCase()}`)}
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
                <span className={`dot is-${live.state}`} aria-hidden="true" /> {t('지금 카페는', 'Right now')}
              </span>
              {live.state !== 'none' && (
                <span className="confidence">
                  {t('신뢰도', 'Confidence')} {t(live.confidence, { 높음: 'high', 보통: 'medium', 낮음: 'low' }[live.confidence])}
                </span>
              )}
            </div>
            <StatusTrio live={live} />
            <p className="muted" style={{ fontSize: 13, marginTop: 10 }}>
              {live.state === 'none'
                ? t('최근 3시간 동안 제보가 없어요. 첫 소식을 남겨 주세요.', 'No reports in the last 3 hours. Be the first to share.')
                : t(
                    `${ago(live.latest.ts, now)} 업데이트 · 최근 2시간 제보 ${live.count}건${live.state === 'stale' ? ' · 지금은 달라졌을 수 있어요' : ''}`,
                    `Updated ${ago(live.latest.ts, now, 'en')} · ${live.count} reports in last 2 h${live.state === 'stale' ? ' · may have changed' : ''}`,
                  )}
            </p>
            {live.memo && live.state !== 'none' && (
              <p className="quote" style={{ marginTop: 10 }}>
                “{live.memo}”
              </p>
            )}
            <button className={`btn btn-sm btn-block ${live.state === 'none' ? 'btn-primary' : 'btn-secondary'}`} style={{ marginTop: 14 }} onClick={() => navigate(`/live/report?cafe=${cafe.id}`)}>
              <SquarePen size={15} /> {live.state === 'none' ? t('첫 제보 남기기', 'Leave the first report') : t('나도 현황 남기기', 'Share what it’s like')}
            </button>
          </section>

          <section className="panel">
            <div className="panel-title">
              {t('영업 정보', 'Hours')}
              <span className={`open-badge ${open ? 'on' : 'off'}`}>
                <Clock size={12} /> {open ? t('영업 중', 'Open now') : t('영업 종료', 'Closed')}
              </span>
            </div>
            <p style={{ fontWeight: 700 }}>{t(`매일 ${hoursLabel(cafe)}`, `Daily ${hoursLabel(cafe)}`)}</p>
            <p className="muted" style={{ fontSize: 14 }}>
              {t('마지막 주문', 'Last order')} {cafe.lastOrder} · {cafe.closed}
            </p>
            <p className="muted" style={{ fontSize: 14 }}>
              {t('아메리카노', 'Americano')} {won(cafe.price, lang)} · {t(`전체 ${cafe.seats}석`, `${cafe.seats} seats`)}
            </p>
          </section>

          <section id="location" className="panel" style={{ scrollMarginTop: 140 }}>
            <div className="panel-title">{t('위치 안내', 'Location')}</div>
            <div className="mini-map">
              <MapBase />
              <span className="pin is-active" style={{ left: `${cafe.map.x}%`, top: `${cafe.map.y}%`, position: 'absolute' }}>
                <span className="bubble num">{cafe.scores[purpose]}</span>
                <span className="tip" />
              </span>
            </div>
            <p style={{ fontSize: 14 }}>{cafe.address}</p>
            <button
              className="btn btn-primary btn-sm"
              style={{ marginTop: 12 }}
              onClick={() => showToast(t(`${cafe.area}까지 도보 ${cafe.walk}분 길찾기를 열었어요`, `Opened walking directions (${cafe.walk} min)`))}
            >
              <Navigation size={14} /> {t('도보 길찾기', 'Walking directions')}
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
}
