import { ArrowRight, LogOut, Radio } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CafeArt from '../components/CafeArt.jsx';
import { Topo } from '../components/Decor.jsx';
import { purposeById } from '../components/ui.jsx';
import { CAFES, CROWD, NOISE } from '../data/cafes.js';
import { ago } from '../lib/live.js';
import { useStore } from '../store.jsx';

const MY_REVIEWS = [
  { cafeId: 'yeobaek', date: '2026년 10월 24일', purpose: 'study', text: '창가 1인석에 콘센트가 바로 있어서 노트북 충전이 편했어요.' },
  { cafeId: 'slowpage', date: '2026년 10월 12일', purpose: 'study', text: '대화 금지 존 덕분에 시험 공부에 집중했어요.' },
  { cafeId: 'forest', date: '2026년 9월 30일', purpose: 'rest', text: '수업 사이 쉬어가기 좋은 소파석.' },
];
const PAST_REPORTS = 5;

export default function MyPage() {
  const navigate = useNavigate();
  const { cafes, saved, userReports, setPurpose, now, userName, logout, t } = useStore();
  const [tab, setTab] = useState('saved');
  const savedCafes = saved.map((id) => cafes.find((c) => c.id === id)).filter(Boolean);
  const cafeName = (id) => CAFES.find((c) => c.id === id)?.name;

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 40 }}>
      <section className="profile decor-wrap">
        <Topo color="#E2C96D" opacity={0.2} rings={16} cx={80} cy={50} seed={7} />
        <span className="avatar">{userName[0]}</span>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--butter-300)' }}>한양대학교 ERICA</div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{userName}</div>
          <span style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,.8)' }}>공부하기 · 조용한 1인석 선호</span>
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
            <div className="l">저장한 카페</div>
          </div>
          <div>
            <div className="n num">{MY_REVIEWS.length}</div>
            <div className="l">내가 쓴 리뷰</div>
          </div>
          <div>
            <div className="n num">{PAST_REPORTS + userReports.length}</div>
            <div className="l">남긴 방문 소식</div>
          </div>
        </div>
      </section>

      <nav className="tabs" style={{ top: 72, margin: '20px 0 24px' }} aria-label="마이페이지 탭">
        {[
          ['saved', '저장한 카페'],
          ['reviews', '내 리뷰'],
          ['reports', '방문 소식'],
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
                  <h2 className="h2">다시 가고 싶은 나의 장소</h2>
                </div>
                <Link to="/saved" className="link-arrow">
                  전체 보기 <ArrowRight size={14} />
                </Link>
              </div>
              {savedCafes.length === 0 ? (
                <div className="empty">
                  <p className="h3">아직 저장한 카페가 없어요</p>
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
                          {c.area} · 공부 {c.scores.study}점
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
                <span className="tag">{purposeById(r.purpose).label}</span>
                <div>
                  <Link to={`/cafe/${r.cafeId}`} style={{ fontWeight: 800 }}>
                    {cafeName(r.cafeId)}
                  </Link>
                  <p style={{ fontSize: 15 }}>{r.text}</p>
                  <p className="muted" style={{ fontSize: 12 }}>
                    {r.date} 방문
                  </p>
                </div>
              </div>
            ))}

          {tab === 'reports' && (
            <>
              {userReports.length === 0 && <p className="muted">이번 데모에서 남긴 소식이 아직 없어요. 지난 소식 {PAST_REPORTS}건은 보관 중이에요.</p>}
              {userReports.map((r) => (
                <div className="feed-item" key={r.id}>
                  <span className="dot is-fresh" style={{ marginTop: 8 }} />
                  <div>
                    <Link to={`/cafe/${r.cafeId}`} style={{ fontWeight: 800 }}>
                      {cafeName(r.cafeId)}
                    </Link>
                    <p style={{ fontSize: 15 }}>
                      {CROWD[r.crowd].label} · {NOISE[r.noise].label}
                      {r.memo ? ` · “${r.memo}”` : ''}
                    </p>
                    <p className="muted" style={{ fontSize: 12 }}>{ago(r.ts, now)}</p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        <aside className="taste decor-wrap pat-dots">
          <div className="eyebrow">My study taste</div>
          <h2 className="h2" style={{ fontSize: 24 }}>
            나의 공부 취향
          </h2>
          <dl>
            <div>
              <dt>주로 가는 동네</dt>
              <dd>ERICA 정문 · 도보 15분</dd>
            </div>
            <div>
              <dt>공간 분위기</dt>
              <dd>조용하고 차분한 곳</dd>
            </div>
            <div>
              <dt>선호하는 자리</dt>
              <dd>창가 1인석</dd>
            </div>
            <div>
              <dt>꼭 필요한 시설</dt>
              <dd>와이파이 · 콘센트</dd>
            </div>
          </dl>
          <button
            className="btn btn-primary btn-block"
            onClick={() => {
              setPurpose('study');
              navigate('/recommend');
            }}
          >
            이 취향으로 카페 찾기 <ArrowRight size={16} />
          </button>
        </aside>
      </div>

      <div className="contrib">
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Radio size={20} />
          <div>
            <p style={{ fontWeight: 800 }}>{userName}님이 남긴 작은 기록이,</p>
            <p className="muted" style={{ fontSize: 14 }}>
              다른 학생의 좋은 한 자리를 만들고 있어요.
            </p>
          </div>
        </div>
        <Link to="/live/report" className="btn btn-secondary">
          카페 현황 제보하기 <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
