import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import CafeArt from '../components/CafeArt.jsx';
import { PageHero } from '../components/Decor.jsx';
import { LiveLine, SaveButton, ScorePill } from '../components/ui.jsx';
import { useStore } from '../store.jsx';

export default function Saved() {
  const { cafes, saved, purpose, now, t } = useStore();
  const list = saved.map((id) => cafes.find((c) => c.id === id)).filter(Boolean);
  return (
    <div className="container" style={{ paddingBottom: 40 }}>
      <PageHero
        pattern="dots"
        eyebrow="My cafe collection"
        title={
          <>
            {t('다시 가고 싶은', 'My')} <span className="serif">favorites</span>
          </>
        }
        lead={t(`${list.length}개의 공간을 저장해 두었어요. 오늘의 목적과 LIVE 현황을 한눈에 살펴보세요.`, `You’ve saved ${list.length} places. See today’s fit and live status at a glance.`)}
      />
      <div style={{ height: 32 }} />
      {list.length === 0 ? (
        <div className="empty">
          <p className="h3">{t('아직 저장한 카페가 없어요', 'No saved cafés yet')}</p>
          <p className="muted">{t('마음에 드는 카페의 북마크를 눌러 모아 보세요.', 'Tap the bookmark on any café to save it here.')}</p>
          <Link to="/explore" className="btn btn-primary btn-sm" style={{ marginTop: 14 }}>
            {t('카페 둘러보기', 'Browse cafés')}
          </Link>
        </div>
      ) : (
        <div className="saved-grid">
          {list.map((c) => (
            <article key={c.id} className="saved-card" style={{ position: 'relative', overflow: 'visible' }}>
              <span className="tape" aria-hidden="true" />
              <div className="art" style={{ borderRadius: '22px 0 0 22px', overflow: 'hidden' }}>
                <span style={{ position: 'absolute', top: 12, left: 12, zIndex: 2 }}>
                  <ScorePill cafe={c} purpose={purpose} />
                </span>
                <CafeArt art={c.art} id={c.id} label={c.name} />
              </div>
              <div className="body">
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <div>
                    <h2 className="h3" style={{ fontSize: 21 }}>
                      {c.name}
                    </h2>
                    <p className="muted" style={{ fontSize: 14 }}>
                      {c.area} · {t(`도보 ${c.walk}분`, `${c.walk} min walk`)}
                    </p>
                  </div>
                  <SaveButton id={c.id} />
                </div>
                <LiveLine live={c.live} now={now} />
                <p className="muted" style={{ fontSize: 14 }}>
                  {c.keyFact}
                </p>
                <Link to={`/cafe/${c.id}`} className="btn btn-secondary btn-block" style={{ marginTop: 'auto' }}>
                  {t('카페 보기', 'View café')} <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
