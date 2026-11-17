import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import CafeArt from '../components/CafeArt.jsx';
import { LiveLine, SaveButton, ScorePill } from '../components/ui.jsx';
import { useStore } from '../store.jsx';

export default function Saved() {
  const { cafes, saved, purpose, now } = useStore();
  const list = saved.map((id) => cafes.find((c) => c.id === id)).filter(Boolean);
  return (
    <div className="container" style={{ paddingBottom: 40 }}>
      <div className="page-head">
        <div className="eyebrow">My cafe collection</div>
        <h1 className="h1">다시 가고 싶은 카페</h1>
        <p className="lead">
          {list.length}개의 공간을 저장해 두었어요. 오늘의 목적과 LIVE 현황을 한눈에 살펴보세요.
        </p>
      </div>
      {list.length === 0 ? (
        <div className="empty">
          <p className="h3">아직 저장한 카페가 없어요</p>
          <p className="muted">마음에 드는 카페의 북마크를 눌러 모아 보세요.</p>
          <Link to="/explore" className="btn btn-primary btn-sm" style={{ marginTop: 14 }}>
            카페 둘러보기
          </Link>
        </div>
      ) : (
        <div className="saved-grid">
          {list.map((c) => (
            <article key={c.id} className="saved-card">
              <div className="art">
                <span style={{ position: 'absolute', top: 12, left: 12, zIndex: 2 }}>
                  <ScorePill cafe={c} purpose={purpose} />
                </span>
                <CafeArt art={c.art} label={c.name} />
              </div>
              <div className="body">
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <div>
                    <h2 className="h3" style={{ fontSize: 21 }}>
                      {c.name}
                    </h2>
                    <p className="muted" style={{ fontSize: 14 }}>
                      {c.area} · 도보 {c.walk}분
                    </p>
                  </div>
                  <SaveButton id={c.id} />
                </div>
                <LiveLine live={c.live} now={now} />
                <p className="muted" style={{ fontSize: 14 }}>
                  {c.keyFact}
                </p>
                <Link to={`/cafe/${c.id}`} className="btn btn-secondary btn-block" style={{ marginTop: 'auto' }}>
                  카페 보기 <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
