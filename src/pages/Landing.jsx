import { ArrowRight, BarChart3, LogIn, MapPin, Radio, SquarePen } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HeroTopo from '../components/HeroTopo.jsx';
import { Marquee, Sticker, Swoosh, Topo } from '../components/Decor.jsx';
import { ScrollTop } from '../components/Layout.jsx';
import { LangToggle, Logo, PurposeIcon } from '../components/ui.jsx';
import { SURVEY } from '../data/cafes.js';
import { ago, minutesSince } from '../lib/live.js';
import { useStore } from '../store.jsx';

function useCountUp(target, ms = 1800) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf;
    const step = (now) => {
      const k = Math.min(1, (now - start) / ms);
      setV(Math.round(target * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}

export default function Landing() {
  const navigate = useNavigate();
  const { t, lang, user, cafes, allReports, now, purposes } = useStore();
  const [purpose, setPurpose] = useState('study');
  const enter = () => navigate(user ? '/explore' : '/login');

  const recent = allReports.filter((r) => minutesSince(r.ts, now) < 30).length;
  const cafeCount = useCountUp(cafes.length);
  const recentCount = useCountUp(recent);
  const best = [...cafes].filter((c) => c.live.state !== 'none').sort((a, b) => b.scores.study - a.scores.study)[0];

  return (
    <div className="lp">
      <ScrollTop />
      <header className="lp-nav">
        <div className="container lp-nav-inner">
          <Link to="/" aria-label="Cafeit">
            <Logo />
          </Link>
          <nav className="lp-links" aria-label={t('랜딩 메뉴', 'Landing menu')}>
            <a href="#how">{t('이용 방법', 'How it works')}</a>
            <a href="#purposes">{t('목적별 추천', 'Purposes')}</a>
            <a href="#live">{t('카페 LIVE', 'Cafe LIVE')}</a>
            <a href="#why">{t('왜 Cafeit', 'Why Cafeit')}</a>
          </nav>
          <div className="lp-actions">
            <LangToggle />
            {user ? (
              <Link to="/explore" className="btn btn-primary btn-sm">
                {t('앱으로 가기', 'Open app')} <ArrowRight size={15} />
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary btn-sm hide-sm">
                  <LogIn size={15} /> {t('로그인', 'Log in')}
                </Link>
                <Link to="/login?mode=signup" className="btn btn-primary btn-sm">
                  {t('회원가입', 'Sign up')}
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ---------- Hero ---------- */}
      <section className="lp-hero">
        <div className="lp-hero-art" aria-hidden="true">
          <HeroTopo purpose={purpose} />
          <Sticker
            className="lp-sticker"
            size={140}
            text={t('목적으로 고르는 카페 ✦ ', 'CHOOSE BY PURPOSE ✦ ')}
            center={
              <span>
                <span style={{ display: 'block', fontSize: 34 }}>LIVE</span>
                <span style={{ fontSize: 12 }}>ERICA</span>
              </span>
            }
          />
        </div>
        <div className="container lp-hero-inner">
          <div className="lp-hero-copy">
            <Link to="/live" className="lp-pill">
              <span className="dot is-fresh" aria-hidden="true" />
              {t('ERICA 베타 오픈 · 주변 카페 9곳 · 무료', 'ERICA beta is live · 9 cafés nearby · free')}
              <ArrowRight size={14} />
            </Link>
            <h1 className={`lp-title ${lang}`}>
              <span>{t('목적을 고르고.', 'PICK A PURPOSE.')}</span>
              <span className="accent">
                <span className="swoosh-wrap">
                  {t('딱 맞는 자리 찾고.', 'FIND YOUR SEAT.')}
                  <Swoosh />
                </span>
              </span>
              <span>{t('지금을 공유해요.', 'SHARE THE VIBE.')}</span>
            </h1>

            <div className="lp-stats">
              <div>
                <div className="n accent num">{cafeCount}</div>
                <div className="l">{t('ERICA 주변 카페', 'Cafés near ERICA')}</div>
              </div>
              <div>
                <div className="n num">{recentCount}</div>
                <div className="l">{t('최근 30분 LIVE 소식', 'Live reports, last 30 min')}</div>
              </div>
            </div>

            <p className="lp-desc">
              {t(
                '공부, 작업, 모임, 휴식. 오늘의 목적을 고르면 카페마다 적합도를 매기고, 지금 그 자리에 있는 학생들의 혼잡도와 소음을 함께 보여줘요.',
                'Study, work, meet friends or take a break. Pick today’s purpose and we score every café for it, with live crowd and noise from students who are there right now.',
              )}
            </p>

            <div className="lp-ctas">
              <button className="btn btn-primary lp-btn" onClick={enter}>
                {t('카페 찾아보기', 'Find a café')} <ArrowRight size={17} />
              </button>
              <a href="#how" className="btn btn-secondary lp-btn">
                {t('이용 방법', 'How it works')}
              </a>
            </div>

            {best && (
              <button className="lp-next" onClick={enter}>
                <div>
                  <div className="lp-next-title">
                    <span className={`dot is-${best.live.state}`} aria-hidden="true" />
                    {t('지금 공부하기 좋은 곳', 'Best for studying right now')} · {best.name}
                  </div>
                  <div className="lp-next-meta">
                    {best.area} · {t(`도보 ${best.walk}분`, `${best.walk} min walk`)} · {best.live.crowd.label} · {best.live.noise.label} · {ago(best.live.latest.ts, now, lang)}
                  </div>
                </div>
                <div className="lp-next-score">
                  <span className="num">{best.scores.study}</span>
                  <small>{t('공부 적합도', 'study fit')}</small>
                </div>
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="marquee-zone">
        <Marquee items={lang === 'en' ? ['STUDY', 'WORK', 'MEET FRIENDS', 'TAKE A BREAK', 'QUIET SEATS', 'OUTLETS EVERYWHERE', 'LIVE NOW', 'NEAR ERICA'] : ['공부하기', '작업하기', '친구 만나기', '쉬어가기', '조용한 1인석', '콘센트 가득', '지금 LIVE', 'ERICA 정문 7분']} />
        <Marquee items={['STUDY 97', 'WORK 96', 'MEET 97', 'REST 93', '76.9%', '3 TAPS', 'CAFEIT']} dark={false} tilt={1.2} speed={140} />
      </div>

      {/* ---------- How it works ---------- */}
      <section className="section pat-grid" id="how">
        <div className="container">
          <div className="eyebrow">{t('이용 방법', 'How it works')}</div>
          <h2 className="h2">{t('별점 말고, 목적으로 고르는 카페', 'Choose by purpose, not by stars')}</h2>
          <div className="lp-steps">
            {[
              { icon: MapPin, ko: ['목적을 골라요', '공부, 작업, 모임, 휴식 중 오늘의 목적을 선택해요.'], en: ['Pick a purpose', 'Study, work, meet friends or rest — choose today’s reason.'] },
              { icon: BarChart3, ko: ['적합도로 비교해요', '소음, 콘센트, 와이파이, 좌석을 목적별 점수로 한눈에 비교해요.'], en: ['Compare fit scores', 'Noise, outlets, Wi-Fi and seats become one score per purpose.'] },
              { icon: Radio, ko: ['LIVE로 확인하고 가요', '방금 다녀온 학생들의 혼잡도와 소음을 확인하고 출발해요.'], en: ['Check LIVE, then go', 'See crowd and noise reported by students who were just there.'] },
              { icon: SquarePen, ko: ['3탭으로 공유해요', '도착하면 지금의 분위기를 남겨 다음 사람을 도와요.'], en: ['Share in 3 taps', 'Once you’re there, leave a quick report for the next person.'] },
            ].map((s, i) => {
              const [title, body] = lang === 'en' ? s.en : s.ko;
              return (
                <div className="lp-step" key={i}>
                  <span className="lp-step-n num">0{i + 1}</span>
                  <span className="lp-step-ic">
                    <s.icon size={20} />
                  </span>
                  <h3 className="h3">{title}</h3>
                  <p className="muted">{body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- Purposes ---------- */}
      <div className="checker butter" />
      <section className="section band-dark on-dark pat-beans-dark" id="purposes">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">{t('목적별 추천', 'Purposes')}</div>
              <h2 className="h2">{t('같은 카페도, 목적이 바뀌면 점수가 바뀌어요', 'Same café, different purpose, different score')}</h2>
              <p className="lead">{t('목적을 눌러 보세요. 1위 카페가 달라져요.', 'Tap a purpose. The #1 café changes.')}</p>
            </div>
          </div>
          <div className="lp-purposes" role="radiogroup" aria-label={t('방문 목적', 'Purpose')}>
            {purposes.map((p) => {
              const top = [...cafes].sort((a, b) => b.scores[p.id] - a.scores[p.id])[0];
              const on = purpose === p.id;
              return (
                <button key={p.id} role="radio" aria-checked={on} className={`lp-purpose ${on ? 'is-on' : ''}`} onClick={() => setPurpose(p.id)}>
                  <span className="p-icon">
                    <PurposeIcon id={p.id} size={20} />
                  </span>
                  <span className="lp-purpose-name">{p.label}</span>
                  <span className="lp-purpose-hint">{p.hint}</span>
                  <span className="lp-purpose-top">
                    <span>
                      #1 · <b>{top.name}</b>
                    </span>
                    <span className="score-pill num">
                      <b>{top.scores[p.id]}</b>
                      {t('점', '')}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="checker butter" />

      {/* ---------- LIVE teaser ---------- */}
      <section className="section" id="live">
        <div className="container lp-live">
          <div>
            <div className="eyebrow">Cafe LIVE</div>
            <h2 className="h2">{t('가기 전에, 지금 분위기부터', 'Know the vibe before you go')}</h2>
            <p className="lead">
              {t(
                '모든 소식에는 시간이 붙어요. 30분이 지나면 흐려지고, 3시간이 지나면 “정보 부족”으로 바뀌어요. 오래된 정보로 헛걸음하지 않게.',
                'Every report shows its age. After 30 minutes it fades, after 3 hours it becomes “not enough info”, so you never walk over on stale news.',
              )}
            </p>
            <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => navigate(user ? '/live' : '/login?next=%2Flive')}>
              {t('LIVE 피드 보기', 'Open the LIVE feed')} <ArrowRight size={16} />
            </button>
          </div>
          <div className="lp-feed">
            {[...cafes]
              .filter((c) => c.live.state !== 'none')
              .sort((a, b) => b.live.latest.ts - a.live.latest.ts)
              .slice(0, 4)
              .map((c) => (
                <div className="lp-feed-row" key={c.id}>
                  <span className={`dot is-${c.live.state}`} aria-hidden="true" />
                  <div style={{ minWidth: 0 }}>
                    <b>{c.name}</b>
                    <div className="muted" style={{ fontSize: 13 }}>
                      <span className={`tone-${c.live.crowd.tone}`}>{c.live.crowd.label}</span> · <span className={`tone-${c.live.noise.tone}`}>{c.live.noise.label}</span>
                    </div>
                  </div>
                  <span className="muted num" style={{ fontSize: 13, whiteSpace: 'nowrap' }}>
                    {ago(c.live.latest.ts, now, lang)}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* ---------- Why ---------- */}
      <section className="section" id="why" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="lp-why decor-wrap">
            <Topo color="#302F03" opacity={0.14} rings={16} cx={85} cy={40} seed={4} />
            <div className="lp-why-stat num poster">{SURVEY.pct}%</div>
            <div>
              <h2 className="h2">{t('목적에 맞는 카페, 찾기 어려웠죠?', 'Finding the right café is hard.')}</h2>
              <p className="lead" style={{ color: '#3d2a17' }}>
                {t(
                  `ERICA 학생 ${SURVEY.total}명 중 ${SURVEY.struggle}명이 방문 목적에 맞는 카페를 찾기 어렵다고 답했어요. Cafeit은 그 문제에서 시작했어요.`,
                  `${SURVEY.struggle} of ${SURVEY.total} ERICA students we surveyed said they struggle to find a café that fits why they’re going. Cafeit started there.`,
                )}
              </p>
              <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={enter}>
                {t('지금 시작하기', 'Get started')} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-inner">
          <div>
            <Logo />
            <p style={{ marginTop: 8 }}>{t('오늘의 목적에 맞는, 나만의 카페.', 'The right café for today’s purpose.')}</p>
            <p style={{ marginTop: 4 }}>{t('SWag · 한양대학교 ERICA SW 캡스톤디자인', 'SWag · Hanyang University ERICA SW Capstone')}</p>
          </div>
          <span>© 2026 Cafeit</span>
        </div>
      </footer>
    </div>
  );
}
