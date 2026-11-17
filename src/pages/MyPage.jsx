import { ArrowRight, LogOut, Radio } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CafeArt from '../components/CafeArt.jsx';
import { Topo } from '../components/Decor.jsx';
import { CROWD, CROWD_EN, NOISE, NOISE_EN } from '../data/cafes.js';
import { ago } from '../lib/live.js';
import { useStore } from '../store.jsx';

const MY_REVIEWS = [
  { cafeId: 'yeobaek', purpose: 'study', date: ['2026년 10월 24일', 'Oct 24, 2026'], text: ['창가 1인석에 콘센트가 바로 있어서 노트북 충전이 편했어요.', 'The window solo seat had an outlet right there, so charging was easy.'] },
  { cafeId: 'slowpage', purpose: 'study', date: ['2026년 10월 12일', 'Oct 12, 2026'], text: ['대화 금지 존 덕분에 시험 공부에 집중했어요.', 'Thanks to the no-talking zone I could focus on exam prep.'] },
  { cafeId: 'forest', purpose: 'rest', date: ['2026년 9월 30일', 'Sep 30, 2026'], text: ['수업 사이 쉬어가기 좋은 소파석.', 'Great sofa seats for a break between classes.'] },
];
const PAST_REPORTS = 5;

export default function MyPage() {
  const navigate = useNavigate();
  const { cafes, saved, userReports, setPurpose, P, now, userName, logout, t, lang } = useStore();
  const [tab, setTab] = useState('saved');
  const savedCafes = saved.map((id) => cafes.find((c) => c.id === id)).filter(Boolean);
  const cafeName = (id) => cafes.find((c) => c.id === id)?.name;
  const L = (pair) => (lang === 'en' ? pair[1] : pair[0]);
  const crowdLabel = (k) => (lang === 'en' ? CROWD_EN[k].label : CROWD[k].label);
  const noiseLabel = (k) => (lang === 'en' ? NOISE_EN[k].label : NOISE[k].label);

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 40 }}>
      <section className="profile decor-wrap">
        <Topo color="#E2C96D" opacity={0.2} rings={16} cx={80} cy={50} seed={7} />
        <span className="avatar">{userName[0]}</span>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--butter-300)' }}>{t('한양대학교 ERICA', 'Hanyang University ERICA')}</div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{userName}</div>
          <span style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,.8)' }}>{t('공부하기 · 조용한 1인석 선호', 'Study · prefers quiet solo seats')}</span>
          <button
            className="btn btn-ghost-light btn-sm"
            style={{ marginTop: 10, height: 32 }}
            onClick={() => {
              logout();
              navigate('/');
            }}
          >
            <LogOut size={14} /> {t('로그아웃', 'Log out')}
          </button>
        </div>
        <div className="profile-stats">
          <div>
            <div className="n num">{saved.length}</div>
            <div className="l">{t('저장한 카페', 'Saved')}</div>
          </div>
          <div>
            <div className="n num">{MY_REVIEWS.length}</div>
            <div className="l">{t('내가 쓴 리뷰', 'Reviews')}</div>
          </div>
          <div>
            <div className="n num">{PAST_REPORTS + userReports.length}</div>
            <div className="l">{t('남긴 방문 소식', 'Live reports')}</div>
          </div>
        </div>
      </section>

      <nav className="tabs" style={{ top: 72, margin: '20px 0 24px' }} aria-label={t('마이페이지 탭', 'My page tabs')}>
        {[
          ['saved', t('저장한 카페', 'Saved cafés')],
          ['reviews', t('내 리뷰', 'My reviews')],
          ['reports', t('방문 소식', 'My reports')],
        ].map(([id, label]) => (
          <button key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </nav>

      <div className="me-grid">
        <div>
          {tab === 'saved' && (
            <>
              <div className="section-head" style={{ marginBottom: 14 }}>
                <div>
                  <div className="eyebrow">My favorite places</div>
                  <h2 className="h2">{t('다시 가고 싶은 나의 장소', 'Places I want to go back to')}</h2>
                </div>
                <Link to="/saved" className="link-arrow">
                  {t('전체 보기', 'See all')} <ArrowRight size={14} />
                </Link>
              </div>
              {savedCafes.length === 0 ? (
                <div className="empty">
                  <p className="h3">{t('아직 저장한 카페가 없어요', 'No saved cafés yet')}</p>
                </div>
              ) : (
                <div className="mini-cards">
                  {savedCafes.map((c) => (
                    <Link to={`/cafe/${c.id}`} key={c.id} className="mini-card">
                      <div className="thumb">
                        <CafeArt art={c.art} label={c.name} />
                      </div>
                      <div>
                        <div className="h3">{c.name}</div>
                        <div className="muted" style={{ fontSize: 13 }}>
                          {c.area} · {t(`공부 ${c.scores.study}점`, `Study ${c.scores.study}`)}
                        </div>
                      </div>
                      <ArrowRight size={18} />
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}

          {tab === 'reviews' &&
            MY_REVIEWS.map((r, i) => (
              <div className="feed-item" key={i}>
                <span className="tag">{P(r.purpose).label}</span>
                <div>
                  <Link to={`/cafe/${r.cafeId}`} style={{ fontWeight: 800 }}>
                    {cafeName(r.cafeId)}
                  </Link>
                  <p style={{ fontSize: 15 }}>{L(r.text)}</p>
                  <p className="muted" style={{ fontSize: 12 }}>
                    {t(`${L(r.date)} 방문`, `Visited ${L(r.date)}`)}
                  </p>
                </div>
              </div>
            ))}

          {tab === 'reports' && (
            <>
              {userReports.length === 0 && (
                <p className="muted">{t(`이번 데모에서 남긴 소식이 아직 없어요. 지난 소식 ${PAST_REPORTS}건은 보관 중이에요.`, `No reports in this demo session yet. ${PAST_REPORTS} past reports are archived.`)}</p>
              )}
              {userReports.map((r) => (
                <div className="feed-item" key={r.id}>
                  <span className="dot is-fresh" style={{ marginTop: 8 }} />
                  <div>
                    <Link to={`/cafe/${r.cafeId}`} style={{ fontWeight: 800 }}>
                      {cafeName(r.cafeId)}
                    </Link>
                    <p style={{ fontSize: 15 }}>
                      {crowdLabel(r.crowd)} · {noiseLabel(r.noise)}
                      {r.memo ? ` · “${r.memo}”` : ''}
                    </p>
                    <p className="muted" style={{ fontSize: 12 }}>
                      {ago(r.ts, now, lang)}
                    </p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        <aside className="taste decor-wrap pat-dots">
          <div className="eyebrow">My study taste</div>
          <h2 className="h2" style={{ fontSize: 24 }}>
            {t('나의 공부 취향', 'My study style')}
          </h2>
          <dl>
            <div>
              <dt>{t('주로 가는 동네', 'Usual area')}</dt>
              <dd>{t('ERICA 정문 · 도보 15분', 'ERICA Main Gate · 15 min')}</dd>
            </div>
            <div>
              <dt>{t('공간 분위기', 'Vibe')}</dt>
              <dd>{t('조용하고 차분한 곳', 'Quiet and calm')}</dd>
            </div>
            <div>
              <dt>{t('선호하는 자리', 'Favorite seat')}</dt>
              <dd>{t('창가 1인석', 'Window solo seat')}</dd>
            </div>
            <div>
              <dt>{t('꼭 필요한 시설', 'Must-haves')}</dt>
              <dd>{t('와이파이 · 콘센트', 'Wi-Fi · outlets')}</dd>
            </div>
          </dl>
          <button
            className="btn btn-primary btn-block"
            onClick={() => {
              setPurpose('study');
              navigate('/recommend');
            }}
          >
            {t('이 취향으로 카페 찾기', 'Find cafés with this style')} <ArrowRight size={16} />
          </button>
        </aside>
      </div>

      <div className="contrib">
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Radio size={20} />
          <div>
            <p style={{ fontWeight: 800 }}>{t(`${userName}님이 남긴 작은 기록이,`, `Your little reports, ${userName},`)}</p>
            <p className="muted" style={{ fontSize: 14 }}>
              {t('다른 학생의 좋은 한 자리를 만들고 있어요.', 'are helping other students find a good seat.')}
            </p>
          </div>
        </div>
        <Link to="/live/report" className="btn btn-secondary">
          {t('카페 현황 제보하기', 'Share a live report')} <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
