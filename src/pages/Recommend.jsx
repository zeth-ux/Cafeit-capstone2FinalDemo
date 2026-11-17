import { ArrowRight, Info, Map as MapIcon, Plug, Wifi } from 'lucide-react';
import { Link } from 'react-router-dom';
import CafeArt from '../components/CafeArt.jsx';
import { LiveLine, PurposeChips, purposeById, SaveButton } from '../components/ui.jsx';
import { won } from '../lib/live.js';
import { rankCafes, useStore } from '../store.jsx';

const PREFS = [
  { id: 'quiet', label: '조용한 공간', test: (c) => c.attributes.quiet >= 0.8 },
  { id: 'wifi', label: '와이파이 필수', test: (c) => c.attributes.wifi >= 0.8 },
  { id: 'outlets', label: '콘센트 필수', test: (c) => c.attributes.outlets >= 0.8 },
  { id: 'solo', label: '1인석 선호', test: (c) => c.attributes.soloSeats >= 0.8 },
  { id: 'group', label: '단체석', test: (c) => c.attributes.groupSeats >= 0.8 },
  { id: 'comfort', label: '편한 좌석', test: (c) => c.attributes.comfort >= 0.9 },
  { id: 'free', label: '지금 여유로운 곳', test: (c) => c.live.state !== 'none' && c.live.crowd.key === 'free' },
];

export default function Recommend() {
  const { purpose, setPurpose, cafes, prefs, setPrefs, now } = useStore();
  const p = purposeById(purpose);
  const active = PREFS.filter((x) => prefs[x.id]);
  const ranked = rankCafes(cafes, purpose).filter((c) => active.every((x) => x.test(c)));
  const top = ranked.slice(0, 5);

  return (
    <div className="container">
      <div className="page-head">
        <div className="eyebrow">For you</div>
        <h1 className="h1">맞춤 카페 추천</h1>
        <p className="lead">
          <b style={{ color: 'var(--ink)' }}>{p.label}</b> 목적과 서연님의 취향으로 고른 카페예요. 조건을 눌러 바로 바꿔 보세요.
        </p>
      </div>

      <PurposeChips value={purpose} onChange={setPurpose} />

      <div className="pref-bar" style={{ marginTop: 16 }}>
        <div className="chips">
          <span className="chip chip-location">
            <MapIcon size={15} aria-hidden="true" /> 한양대학교 · 도보 20분
          </span>
          {PREFS.map((x) => (
            <button key={x.id} className={`chip ${prefs[x.id] ? 'is-on' : ''}`} aria-pressed={!!prefs[x.id]} onClick={() => setPrefs({ ...prefs, [x.id]: !prefs[x.id] })}>
              {x.label}
            </button>
          ))}
        </div>
        <span className="muted" style={{ fontSize: 13 }}>
          {ranked.length}곳 중 상위 {top.length}곳
        </span>
      </div>

      {top.length === 0 ? (
        <div className="empty">
          <p className="h3">조건에 맞는 카페가 없어요</p>
          <p className="muted">조건을 하나 줄여 볼까요?</p>
          <button className="btn btn-secondary btn-sm" style={{ marginTop: 14 }} onClick={() => setPrefs({})}>
            조건 초기화
          </button>
        </div>
      ) : (
        <div className="rec-list">
          {top.map((c, i) => (
            <article key={`${purpose}-${c.id}`} className={`rec-card ${i === 0 ? 'top' : ''}`} style={{ animationDelay: `${i * 60}ms` }}>
              <div className="art">
                <span className={`rank ${i === 0 ? 'r1' : ''}`}>{i + 1}</span>
                <CafeArt art={c.art} label={c.name} />
              </div>
              <div className="rec-body">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <Link to={`/cafe/${c.id}`} className="h3" style={{ fontSize: 21 }}>
                    {c.name}
                  </Link>
                  {c.partner && <span className="tag tag-partner">제휴 · 음료 10% 할인</span>}
                </div>
                <span className="muted" style={{ fontSize: 14 }}>
                  {c.area} · 도보 {c.walk}분 · {c.summary}
                </span>
                <span style={{ fontWeight: 700, fontSize: 15 }}>{c.keyFact}</span>
                <LiveLine live={c.live} now={now} />
                <div className="amen">
                  <span>
                    <Wifi size={14} /> {c.amenities.wifi}
                  </span>
                  <span>
                    <Plug size={14} /> {c.amenities.outlets}
                  </span>
                  <span>아메리카노 {won(c.price)}</span>
                </div>
              </div>
              <div className="rec-score">
                <div>
                  <div className="score-caption">{p.label} 적합도</div>
                  <div className="score-big num" style={{ justifyContent: 'center' }}>
                    <span className="n">{c.scores[purpose]}</span>
                    <span className="u">점</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <SaveButton id={c.id} />
                  <Link to={`/cafe/${c.id}`} className={`btn btn-sm ${i === 0 ? 'btn-primary' : 'btn-secondary'}`}>
                    자세히 보기 <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
      <p className="info-note">
        <Info size={15} /> 순위는 목적별 적합도로만 정해져요. 제휴 여부는 점수와 순위에 영향을 주지 않아요.
      </p>
    </div>
  );
}
