import { ArrowRight, Info, Map as MapIcon, Plug, Wifi } from 'lucide-react';
import { Link } from 'react-router-dom';
import CafeArt from '../components/CafeArt.jsx';
import { PageHero, Sticker } from '../components/Decor.jsx';
import { LiveLine, PurposeChips, SaveButton } from '../components/ui.jsx';
import { won } from '../lib/live.js';
import { rankCafes, useStore } from '../store.jsx';

const PREFS = [
  { id: 'quiet', ko: '조용한 공간', en: 'Quiet space', test: (c) => c.attributes.quiet >= 0.8 },
  { id: 'wifi', ko: '와이파이 필수', en: 'Wi-Fi a must', test: (c) => c.attributes.wifi >= 0.8 },
  { id: 'outlets', ko: '콘센트 필수', en: 'Outlets a must', test: (c) => c.attributes.outlets >= 0.8 },
  { id: 'solo', ko: '1인석 선호', en: 'Prefer solo seats', test: (c) => c.attributes.soloSeats >= 0.8 },
  { id: 'group', ko: '단체석', en: 'Group tables', test: (c) => c.attributes.groupSeats >= 0.8 },
  { id: 'comfort', ko: '편한 좌석', en: 'Comfy seats', test: (c) => c.attributes.comfort >= 0.9 },
  { id: 'free', ko: '지금 여유로운 곳', en: 'Free seats now', test: (c) => c.live.state !== 'none' && c.live.crowd.key === 'free' },
];

export default function Recommend() {
  const { purpose, setPurpose, P, cafes, prefs, setPrefs, now, userName, t, lang } = useStore();
  const p = P(purpose);
  const active = PREFS.filter((x) => prefs[x.id]);
  const ranked = rankCafes(cafes, purpose).filter((c) => active.every((x) => x.test(c)));
  const top = ranked.slice(0, 5);

  return (
    <div className="container">
      <PageHero
        eyebrow="For you"
        pattern="grid"
        title={
          <>
            {t('맞춤 카페', 'Café picks')} <span className="serif">for you</span>
          </>
        }
        lead={
          <>
            {t('', 'Picked for ')}
            <b style={{ color: 'var(--ink)' }}>{p.label}</b>
            {t(` 목적과 ${userName}님의 취향으로 고른 카페예요. 조건을 눌러 바로 바꿔 보세요.`, ` and ${userName}’s taste. Tap a condition to change it.`)}
          </>
        }
        sticker={
          top[0] && (
            <Sticker
              size={124}
              text={`${p.label.toUpperCase()} BEST ✦ `}
              style={{ right: 48, top: 28, transform: 'rotate(10deg)' }}
              center={
                <span>
                  <span style={{ display: 'block', fontSize: 38 }}>{top[0].scores[purpose]}</span>
                  <span style={{ fontSize: 11 }}>#1 {top[0].name}</span>
                </span>
              }
            />
          )
        }
      />

      <div style={{ marginTop: 20 }}>
        <PurposeChips value={purpose} onChange={setPurpose} />
      </div>

      <div className="pref-bar" style={{ marginTop: 16 }}>
        <div className="chips">
          <span className="chip chip-location">
            <MapIcon size={15} aria-hidden="true" /> {t('한양대학교 · 도보 20분', 'ERICA · within 20 min walk')}
          </span>
          {PREFS.map((x) => (
            <button key={x.id} className={`chip ${prefs[x.id] ? 'is-on' : ''}`} aria-pressed={!!prefs[x.id]} onClick={() => setPrefs({ ...prefs, [x.id]: !prefs[x.id] })}>
              {lang === 'en' ? x.en : x.ko}
            </button>
          ))}
        </div>
        <span className="muted" style={{ fontSize: 13 }}>
          {t(`${ranked.length}곳 중 상위 ${top.length}곳`, `Top ${top.length} of ${ranked.length}`)}
        </span>
      </div>

      {top.length === 0 ? (
        <div className="empty">
          <p className="h3">{t('조건에 맞는 카페가 없어요', 'No cafés match these conditions')}</p>
          <p className="muted">{t('조건을 하나 줄여 볼까요?', 'Try removing one.')}</p>
          <button className="btn btn-secondary btn-sm" style={{ marginTop: 14 }} onClick={() => setPrefs({})}>
            {t('조건 초기화', 'Clear conditions')}
          </button>
        </div>
      ) : (
        <div className="rec-list">
          {top.map((c, i) => (
            <article key={`${purpose}-${c.id}`} className={`rec-card ${i === 0 ? 'top' : ''}`} style={{ animationDelay: `${i * 110}ms` }}>
              <div className="art">
                <span className={`rank ${i === 0 ? 'r1' : ''}`}>{i + 1}</span>
                {i === 0 && (
                  <span className="stamp" style={{ right: 12, bottom: 14 }}>
                    BEST PICK
                  </span>
                )}
                <CafeArt art={c.art} label={c.name} />
              </div>
              <div className="rec-body">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <Link to={`/cafe/${c.id}`} className="h3" style={{ fontSize: 21 }}>
                    {c.name}
                  </Link>
                  {c.partner && <span className="tag tag-partner">{t('제휴 · 음료 10% 할인', 'Partner · 10% off drinks')}</span>}
                </div>
                <span className="muted" style={{ fontSize: 14 }}>
                  {c.area} · {t(`도보 ${c.walk}분`, `${c.walk} min walk`)} · {c.summary}
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
                  <span>
                    {t('아메리카노', 'Americano')} {won(c.price, lang)}
                  </span>
                </div>
              </div>
              <div className="rec-score">
                <div>
                  <div className="score-caption">{t(`${p.label} 적합도`, `${p.label} fit`)}</div>
                  <div className="score-big num" style={{ justifyContent: 'center' }}>
                    <span className="n">{c.scores[purpose]}</span>
                    <span className="u">{t('점', '/100')}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <SaveButton id={c.id} />
                  <Link to={`/cafe/${c.id}`} className={`btn btn-sm ${i === 0 ? 'btn-primary' : 'btn-secondary'}`}>
                    {t('자세히 보기', 'Details')} <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
      <p className="info-note">
        <Info size={15} /> {t('순위는 목적별 적합도로만 정해져요. 제휴 여부는 점수와 순위에 영향을 주지 않아요.', 'Ranking uses purpose fit only. Partner status never affects scores or ranking.')}
      </p>
    </div>
  );
}
